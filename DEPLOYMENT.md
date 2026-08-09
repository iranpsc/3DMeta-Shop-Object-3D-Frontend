# Deployment — 3D RGB Frontend

Deploy the Next.js storefront with Docker, using **Arvan Cloud** (`docker.arvancloud.ir`) as the base-image registry mirror.

## Prerequisites

- Docker Engine with Compose v2
- Git repository checkout (or a pre-built image)
- Laravel API reachable from the browser and the host running this container (CORS + Sanctum SPA domains configured)
- DNS for the frontend domain pointing at your server (production)

## What gets deployed

| Item | Value |
| --- | --- |
| App | Next.js 16 (`output: "standalone"`) |
| Compose file | `docker-compose.yml` |
| Container port | `3000` |
| Health endpoint | `GET /api/health` → `{ "status": "ok", ... }` |
| Base images | `docker.arvancloud.ir/library/node:20-alpine` |

## Environment variables

Copy `.env.example` to `.env` (optional for local defaults) and set at least:

```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.example
DOCKER_REGISTRY=docker.arvancloud.ir
IMAGE_NAME=docker.arvancloud.ir/3drgb/frontend
IMAGE_TAG=latest
HOST_PORT=3000
```

Notes:

- `NEXT_PUBLIC_API_URL` is a **build arg**. Changing it requires a **rebuild**, not only a restart.
- Keep secrets out of git; never commit a production `.env`.

### Backend alignment (Laravel)

On the API, allow the frontend origin:

- `SANCTUM_STATEFUL_DOMAINS` — include your frontend host
- `SESSION_DOMAIN` / CORS — match production cookie + CORS policy
- `FRONTEND_URL` / related app URLs if your API uses them for redirects

## Build and run

```bash
# Build and start in the background
docker compose up -d --build

# Health check
curl http://localhost:3000/api/health

# Logs
docker compose logs -f frontend

# Stop
docker compose down
```

The app listens on `http://localhost:${HOST_PORT:-3000}`. Put a reverse proxy (Nginx, Caddy, Traefik, etc.) in front for TLS and your public domain.

## Pushing an image to Arvan (optional)

```bash
# Login if your Arvan org requires auth for private repos
docker login docker.arvancloud.ir

docker compose build
docker tag docker.arvancloud.ir/3drgb/frontend:latest docker.arvancloud.ir/<namespace>/3drgb-frontend:latest
docker push docker.arvancloud.ir/<namespace>/3drgb-frontend:latest
```

On the deployment host you can then pull that image and run with Compose (`image:` already set in `docker-compose.yml`), or configure the Docker daemon mirror for faster base pulls:

```json
{
  "registry-mirrors": ["https://docker.arvancloud.ir"]
}
```

Restart Docker after editing `/etc/docker/daemon.json`.

## Operational checklist

- [ ] `NEXT_PUBLIC_API_URL` points at the production API (HTTPS)
- [ ] Rebuild after any `NEXT_PUBLIC_*` change
- [ ] `/api/health` returns 200
- [ ] Product images load (update `images.remotePatterns` in `next.config.ts` if the API host is not covered)
- [ ] Sanctum/CORS allow the frontend origin
- [ ] DNS + TLS configured on your reverse proxy / load balancer

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Build can't pull `node` | No access to Docker Hub | Use `DOCKER_REGISTRY=docker.arvancloud.ir` (default) or set host registry-mirrors |
| Healthcheck failing | App still starting / wrong port | Increase `start_period`; confirm `PORT=3000` and `HOSTNAME=0.0.0.0` |
| API calls hit localhost | Old client bundle | Rebuild with correct `NEXT_PUBLIC_API_URL` build arg |
| 401 / CSRF on auth | Sanctum domain mismatch | Update API `SANCTUM_STATEFUL_DOMAINS` + CORS |
| Images broken | Host not in `remotePatterns` | Add API hostname under `images.remotePatterns` and rebuild |
