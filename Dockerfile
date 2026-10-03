# syntax=docker/dockerfile:1.7

# Official Docker best practices for Next.js:
# - multi-stage build
# - layer caching for dependencies
# - BuildKit cache mounts
# - standalone output (minimal runtime image)
# - non-root user
# Base images: official Docker Hub (node)

ARG NODE_VERSION=20

# -----------------------------------------------------------------------------
# Stage 1: Install dependencies (cached unless lockfile changes)
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./

# Install all deps (including dev) — required for `next build` / TypeScript.
RUN --mount=type=cache,target=/root/.npm \
  npm ci

# -----------------------------------------------------------------------------
# Stage 2: Build the Next.js application
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* must be present at build time for the client bundle.
# Site URL defaults keep `next build` from failing when compose does not pass one.
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG SITE_URL=http://localhost:3000
ARG FRONTEND_URL=http://localhost:3000
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV SITE_URL=${SITE_URL}
ENV FRONTEND_URL=${FRONTEND_URL}
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN --mount=type=cache,target=/app/.next/cache \
  npm run build

# -----------------------------------------------------------------------------
# Stage 3: Local development (Compose watch / next dev)
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS development

RUN apk add --no-cache libc6-compat wget

WORKDIR /app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
  npm ci

COPY . .

ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG SITE_URL=http://localhost:3000
ARG FRONTEND_URL=http://localhost:3000
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV SITE_URL=${SITE_URL}
ENV FRONTEND_URL=${FRONTEND_URL}
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0", "-p", "3000"]

# -----------------------------------------------------------------------------
# Stage 4: Minimal production runner
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS runner

RUN apk add --no-cache wget \
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
