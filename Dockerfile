# syntax=docker.arvancloud.ir/docker/dockerfile:1.7

# Official Docker best practices for Next.js:
# - multi-stage build
# - layer caching for dependencies
# - BuildKit cache mounts
# - standalone output (minimal runtime image)
# - non-root user
# Base images pulled via Arvan Cloud Docker repository mirror.

ARG DOCKER_REGISTRY=docker.arvancloud.ir
ARG NODE_VERSION=20

# -----------------------------------------------------------------------------
# Stage 1: Install dependencies (cached unless lockfile changes)
# -----------------------------------------------------------------------------
FROM ${DOCKER_REGISTRY}/library/node:${NODE_VERSION}-alpine AS deps

RUN sed -i 's|https://dl-cdn.alpinelinux.org|https://mirror.arvancloud.ir|g' /etc/apk/repositories \
  && apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./

# Install all deps (including dev) — required for `next build` / TypeScript.
RUN --mount=type=cache,target=/root/.npm \
  npm ci

# -----------------------------------------------------------------------------
# Stage 2: Build the Next.js application
# -----------------------------------------------------------------------------
FROM ${DOCKER_REGISTRY}/library/node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* must be present at build time for the client bundle.
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ARG NEXT_PUBLIC_SENTRY_DSN=
ARG SENTRY_ORG=
ARG SENTRY_PROJECT=
ARG SENTRY_AUTH_TOKEN=
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SENTRY_DSN=${NEXT_PUBLIC_SENTRY_DSN}
ENV SENTRY_ORG=${SENTRY_ORG}
ENV SENTRY_PROJECT=${SENTRY_PROJECT}
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN --mount=type=cache,target=/app/.next/cache \
  npm run build

# -----------------------------------------------------------------------------
# Stage 3: Minimal production runner
# -----------------------------------------------------------------------------
FROM ${DOCKER_REGISTRY}/library/node:${NODE_VERSION}-alpine AS runner

RUN sed -i 's|https://dl-cdn.alpinelinux.org|https://mirror.arvancloud.ir|g' /etc/apk/repositories \
  && apk add --no-cache wget \
  && addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Standalone server + static assets only (no full node_modules).
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health >/dev/null || exit 1

CMD ["node", "server.js"]
