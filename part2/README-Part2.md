# Part 2 — Product Manager (React + Node.js)

A full-stack CRUD application for managing products, built with React on the frontend and Node.js/Express on the backend, persisted with SQLite.

---

## Features

- **CRUD Operations**: Create, read, update, and delete products
- **Form Validation**: Client and server-side validation using Zod schemas
- **Optimistic Updates**: Instant UI feedback with automatic rollback on errors
- **Toast Notifications**: Success and error feedback for all operations
- **Responsive Design**: Clean, mobile-friendly interface
- **Loading States**: Skeleton loaders for better perceived performance
- **Delete Confirmation**: Prevents accidental deletions

---

## Running the app

**Prerequisites:** Node.js 18+

**Backend** (Terminal 1)
```bash
cd part2/backend
npm install
mkdir data
npm run dev
```
Server runs on `http://localhost:3001`

**Frontend** (Terminal 2)
```bash
cd part2/frontend
npm install
npm run dev
```
App runs on `http://localhost:5173`

---

## Project Structure

```
part2/
├── backend/
│   ├── data/
│   │   └── products.db           # SQLite database (auto-created on first run)
│   ├── src/
│   │   ├── db.js                 # Database initialisation and table setup
│   │   ├── middleware/
│   │   │   └── validate.js       # Zod validation middleware
│   │   └── routes/
│   │       └── products.js       # REST API endpoints
│   ├── server.js                 # Express app entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── products.js       # All fetch calls in one place
    │   ├── components/
    │   │   ├── ProductForm.jsx   # Add/edit form with field validation
    │   │   ├── ProductCard.jsx   # Product card with inline confirm delete
    │   │   ├── ProductList.jsx   # Product grid with skeleton loading
    │   │   ├── SearchBar.jsx     # Controlled search input
    │   │   ├── Toast.jsx         # Toast notifications and useToast hook
    │   │   └── EmptyState.jsx    # Empty and no-results states
    │   ├── hooks/
    │   │   └── useProducts.js    # Central state and operations hook
    │   ├── App.jsx               # Root layout and state wiring
    │   ├── main.jsx              # React entry point
    │   └── index.css             # Global styles and design tokens
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## API Reference

### Base URL
```
http://localhost:3001/api
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Fetch all products |
| GET | `/products?search=term` | Search products by name or description |
| GET | `/products/:id` | Fetch single product |
| POST | `/products` | Create new product |
| PUT | `/products/:id` | Update existing product |
| DELETE | `/products/:id` | Delete product (returns 204) |

### Product Schema

```json
{
  "id": 1,
  "name": "Lip Balm",
  "price": 32.00,
  "description": "Butter lip balm.",
  "created_at": "2024-01-01T12:00:00.000Z",
  "updated_at": "2024-01-01T12:00:00.000Z"
}
```

### Validation Rules

| Field | Type | Constraints |
|-------|------|-------------|
| name | string | Required, 1–100 characters |
| price | number | Required, positive, max 2 decimal places |
| description | string | Optional, max 500 characters |

### Error Response Format

```json
{
  "errors": {
    "name": "Name is required",
    "price": "Price must be greater than 0"
  }
}
```

---

## Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                        │
│                                                             │
│  App.jsx ──→ useProducts() hook ──→ productsApi ──→ fetch() │
│                                                             │
└────────────────────────── HTTP ─────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Express)                        │
│                                                             │
│  server.js ──→ /api/products router ──→ Zod validation      │
│                                                             │
└────────────────────────── SQL ──────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (SQLite)                        │
│                                                             │
│  products.db (WAL mode enabled)                             │
│  └── products table                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── ProductForm (sidebar)
│   └── React Hook Form + Zod validation
├── SearchBar
├── ProductList
│   ├── SkeletonCard (loading state)
│   ├── ProductCard (×N)
│   │   └── Inline delete confirmation
│   └── EmptyState (no results)
└── ToastContainer
    └── Toast (×N)
```

---

## Decisions & Trade-offs

**SQLite over in-memory array** — data survives server restarts, which felt more honest for a persistence demo. `better-sqlite3` uses a synchronous API which keeps route handlers clean and readable without unnecessary async complexity for a single-user app. WAL mode is enabled for better read performance.

**Zod validation on both sides** — the backend validates in middleware because you can never trust the client. The frontend validates via `react-hook-form` + `zodResolver` for instant field-level feedback without a round trip. Both use the same schema shape.

**`useProducts` hook as the single source of truth** — all state, API calls, and operations live in one hook. Components are purely responsible for rendering. If the API base URL or auth headers ever needed changing, there is one file to update.

**Optimistic delete** — the card is removed from the UI immediately, with a full state snapshot restored if the API call fails. Feels fast without being dishonest about what happened.

**Inline confirm delete** — confirmation appears inside the card itself rather than a modal or dialog. Keeps the UI calm and avoids interrupting the user's flow.

**API calls isolated in `api/products.js`** — fetch logic is never scattered across components. One file owns the HTTP layer, making it easy to swap, mock, or extend.

**Skeleton loading over a spinner** — four shimmer cards on initial load give the user a sense of the layout before data arrives, reducing perceived wait time.

**No Redux or external state library** —  A single custom hook with `useState` handles everything cleanly. 

**Search on the backend** — the `GET /api/products?search=` endpoint filters via SQL `LIKE` rather than filtering client-side. This scales correctly if the product list grows and keeps the frontend logic simple.

---

