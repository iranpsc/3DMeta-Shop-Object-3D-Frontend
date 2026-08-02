# 3D RGB Frontend

Next.js storefront and admin UI for **3D RGB** (سه بعدی متا) — a Persian digital marketplace for 3D models, avatars, textures, and related design assets.

This app is a UI migration of the original Laravel/Livewire views. **Business logic stays on the Laravel API**; this repo calls `/api/v1/...` and keeps the same URL paths, copy, and theme where possible.

| Layer | Repository |
| --- | --- |
| Frontend (this repo) | Next.js App Router |
| Backend API | [iranpsc/3DMeta-Shop-Object-3D](https://github.com/iranpsc/3DMeta-Shop-Object-3D) |

Live site: [https://3d.irpsc.com](https://3d.irpsc.com)

---

## Features and business logic

### Storefront (public)

- **Home** — hero search, 3D avatar viewer (Three.js), popular/top-level categories, product tabs (newest / score / sales)
- **Catalog** — product list with filters (category, tag, sort, search), category tree pages, tag pages
- **Product detail** — gallery, attributes, similar products, reviews/replies, file download when purchased or free
- **Cart** — session-backed cart (guest or authenticated) via Laravel
- **Checkout** — account step (login/register redirect) → payment gateway redirect → `/verify` callback
- **Contact / custom order** — contact form and custom submit-order form with optional attachment

### Authenticated user area

- **Dashboard** — order/ticket/product ownership stats and recent orders
- **Orders** — history, detail, digital file downloads, repay unpaid orders
- **Profile** — name/phone/avatar update
- **Avatars** — list and create user avatars from purchased assets
- **Tickets** — create/edit/delete support tickets and reply with attachments

Auth is **Laravel Sanctum SPA cookies** plus OAuth redirect (`/auth/redirect`, `/auth/register` on the API host). Protected routes use client-side `RequireAuth` because the Sanctum cookie belongs to the API origin.

### Admin panel (`/admin/*`, `admin` role)

- Dashboard stats (products, orders, sales, users)
- Products CRUD, chunked file upload, CSV/Excel import, temp-upload discard
- Categories, tags, attributes CRUD
- Review moderation (approve/delete) and admin replies
- Users list, custom submit-orders inbox, contact messages inbox

### Technical notes

- Responses use a shared envelope: `{ data, message?, info?, errors?, meta?, links? }`
- Client mutations send `credentials: "include"` and CSRF via `/sanctum/csrf-cookie` + `X-XSRF-TOKEN`
- Server Components use cookie-less `serverApiFetch` with short revalidation for public catalog data
- UI parity with Blade/Livewire is intentional — no redesign

---

## Project structure

```
3drgb-frontend/
├── app/                      # Next.js App Router pages
│   ├── page.tsx              # Home
│   ├── products/             # Catalog + product detail ([sku])
│   ├── categories/           # Category index + nested [...slug]
│   ├── tags/[slug]/         # Tag product listings
│   ├── cart/, checkout/, verify/
│   ├── contact-us/, submit-order/, about-us/
│   ├── dashboard/, orders/, profile/, avatars/, tickets/
│   └── admin/                # Admin dashboard and CRUD screens
├── components/
│   ├── admin/                # Product form, uploads, admin helpers
│   ├── auth/                 # RequireAuth gate
│   ├── checkout/, contact/, submit-order/
│   ├── home/                 # Hero, sliders, AvatarViewer, search
│   ├── layout/               # Shell, footer, side nav, breadcrumbs
│   ├── product/, store/, form/, ui/
│   └── providers.tsx         # Auth, cart, toast providers
├── lib/
│   ├── api-client.ts         # Browser fetch + Sanctum CSRF
│   ├── server-api.ts         # Server Component fetch
│   ├── storefront-*-api.ts   # Public catalog helpers
│   ├── cart-api.ts, checkout-api.ts, product-api.ts
│   ├── user-api.ts, auth.ts, admin-api.ts
│   ├── types.ts              # Shared API/domain types
│   └── *-context.tsx         # Auth + cart React context
├── e2e/                      # Playwright specs
├── public/                   # Static assets (home imagery, theme CSS)
├── proxy.ts                  # Next 16 proxy (route matcher stubs)
├── next.config.ts
└── package.json
```

Route paths mirror the legacy Laravel web URLs so links and bookmarks stay compatible.

---

## Setup and running

### Requirements

- Node.js 20+ (recommended)
- npm
- Running Laravel API from [3DMeta-Shop-Object-3D](https://github.com/iranpsc/3DMeta-Shop-Object-3D) (default `http://localhost:8000`)
- API must allow Sanctum SPA requests from the Next origin (`localhost:3000`) — configure `SANCTUM_STATEFUL_DOMAINS`, `SESSION_DOMAIN`, and CORS on the backend

### Install

```bash
git clone <this-repo-url>
cd 3drgb-frontend
npm install
```

### Environment

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

If unset, the client defaults to `http://localhost:8000`.

Update `next.config.ts` `images.remotePatterns` if product images are served from a non-localhost host.

### Development

```bash
# Terminal 1 — Laravel API (sibling 3drgb / 3DMeta-Shop-Object-3D)
php artisan serve

# Terminal 2 — Next.js
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

### Lint and E2E

```bash
npm run lint
npm run test:e2e        # Playwright (Chrome + Firefox)
npm run test:e2e:ui
```

E2E expects the frontend on `http://localhost:3000` and uses `NEXT_PUBLIC_API_URL` for API checks.

---

## Backend API contracts

Base URL: `{NEXT_PUBLIC_API_URL}/api/v1`  
Auth: Laravel Sanctum session (`credentials: "include"`). CSRF: `GET /sanctum/csrf-cookie` before mutating requests.  
OAuth entry (browser redirect, not under `/api/v1`): `/auth/redirect`, `/auth/register` (optional `?intended=`).

Envelope shape used by the frontend:

```ts
{
  data: T;
  message?: string | null;
  info?: string | null;
  errors?: Record<string, string[]>;
  meta?: { current_page; last_page; per_page; total };
  links?: Record<string, string | null>;
}
```

Source of truth for routes: backend `routes/api.php` in [3DMeta-Shop-Object-3D](https://github.com/iranpsc/3DMeta-Shop-Object-3D). Client wrappers live under `lib/*-api.ts`.

### Auth

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/api/v1/user` | Sanctum | Current user or 401 |
| POST | `/api/v1/logout` | Sanctum | End SPA session |

### Catalog (public)

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/v1/products` | Query: `page`, `take`, `sort` (`newest`\|`score`\|`sales`), search/filters |
| GET | `/api/v1/products/store-filters` | Categories + tags for store UI |
| GET | `/api/v1/products/{sku}` | Product detail |
| GET | `/api/v1/products/{sku}/reviews` | Reviews + rating breakdown |
| GET | `/api/v1/categories` | Paginated categories |
| GET | `/api/v1/categories/popular` | Query: `take` |
| GET | `/api/v1/categories/top-level` | Nav / home slider |
| GET | `/api/v1/categories/{slug}` | Nested slug path (`where: .*`) |
| GET | `/api/v1/tags/{slug}/products` | Tag listing |

### Cart & checkout

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/api/v1/cart` | Optional | Cart snapshot |
| POST | `/api/v1/cart/{product}` | Optional | Body: `{ quantity }` |
| PUT | `/api/v1/cart/{product}` | Optional | Body: `{ quantity }` |
| DELETE | `/api/v1/cart/{product}` | Optional | |
| GET | `/api/v1/checkout` | Optional | Step: `create-account` \| `payment` |
| POST | `/api/v1/checkout/account` | — | Body: `{ action: login\|register, intended? }` → `redirect_url` |
| POST | `/api/v1/checkout/payment` | Sanctum | Starts IPG → `redirect_url` |
| GET | `/api/v1/checkout/verify` | Optional | Gateway return query params |
| POST | `/api/v1/orders/{order}/pay` | Sanctum | Repay unpaid order |

### Reviews & forms (mutating)

| Method | Path | Auth |
| --- | --- | --- |
| POST | `/api/v1/products/{sku}/reviews` | Sanctum — `{ comment, rating }` |
| POST | `/api/v1/reviews/{review}/replies` | Sanctum — `{ comment }` |
| POST | `/api/v1/contact-us` | Public JSON |
| POST | `/api/v1/submit-order` | Public `FormData` (attachment optional) |

### User area (`auth:sanctum` + verified)

| Method | Path |
| --- | --- |
| GET | `/api/v1/user/dashboard` |
| GET/PUT | `/api/v1/user/profile` (PUT uses `FormData`) |
| GET | `/api/v1/user/orders`, `/api/v1/user/orders/{order}` |
| GET/POST | `/api/v1/user/avatars` |
| GET/POST | `/api/v1/tickets` |
| GET/PUT/DELETE | `/api/v1/tickets/{ticket}` |
| POST | `/api/v1/tickets/{ticket}/responses` (`FormData`) |

### Admin (`auth:sanctum` + verified + admin)

| Area | Endpoints |
| --- | --- |
| Dashboard | `GET /api/v1/admin/dashboard` |
| Products | `GET/POST /admin/products`, `GET/PUT/DELETE /admin/products/{id}`, `GET .../form-data`, `POST .../import`, `POST .../upload`, `POST .../temp-uploads/discard` |
| Categories | `apiResource` + `GET .../form-data` |
| Tags | `GET/POST /admin/tags`, `DELETE /admin/tags/{id}` |
| Attributes | `GET/POST /admin/attributes`, `DELETE /admin/attributes/{id}` |
| Reviews | list, approve, delete; replies CRUD/approve |
| Users | `GET /admin/users` (`search`, `page`) |
| Submit orders | `GET /admin/orders`, `GET /admin/orders/{id}` |
| Contact | `GET /admin/contact-messages` |

### Other backend endpoints (not heavily used by this UI)

- `GET /api/v1/build-package`
- `GET /api/v1/user/assets/*` (HTTP Basic) — external asset clients

Typed models for cards, orders, tickets, admin entities, etc. are defined in [`lib/types.ts`](./lib/types.ts).

---

## Related repositories

- **Backend API / Laravel app:** [https://github.com/iranpsc/3DMeta-Shop-Object-3D](https://github.com/iranpsc/3DMeta-Shop-Object-3D)
- Local sibling checkout is often named `3drgb` next to this frontend.

---

## Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4
- Three.js (avatar viewer), Swiper, SweetAlert2
- Playwright E2E
