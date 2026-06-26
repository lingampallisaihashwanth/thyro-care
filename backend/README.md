# THYRO LABORATORIES Backend

Node.js, Express.js, TypeScript, Supabase, JWT, and Zod backend for the THYRO LABORATORIES Smart Booking & Management System.

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Set these environment variables in `.env`:

```bash
PORT=5001
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
JWT_SECRET=your-jwt-signing-secret
```

If your frontend uses Supabase Auth access tokens, set `JWT_SECRET` to the Supabase JWT secret for the project so the API can verify those bearer tokens.

## Scripts

```bash
npm run dev       # Start the TypeScript dev server
npm run build     # Compile TypeScript into dist/
npm start         # Run the compiled server
npm run typecheck # Type-check without emitting files
```

## Public Endpoints

```http
GET /
GET /health
```

`GET /` returns:

```json
{
  "message": "THYRO LABORATORIES Backend Running"
}
```

`GET /health` returns:

```json
{
  "status": "success",
  "server": "running"
}
```

## Protected API Endpoints

All `/api/*` routes require:

```http
Authorization: Bearer <jwt>
```

### Bookings

```http
POST /api/bookings
GET /api/bookings
GET /api/bookings/:id
PUT /api/bookings/:id
DELETE /api/bookings/:id
```

Create/update booking payload:

```json
{
  "profileId": "optional-profile-uuid",
  "userEmail": "patient@example.com",
  "testName": "Thyroid Profile",
  "category": "Hormone Tests",
  "price": 500,
  "bookingType": "Home Sample Collection",
  "bookingDate": "2026-06-18",
  "preferredTimeSlot": "09:00 AM - 11:00 AM",
  "status": "Requested"
}
```

### Reports

```http
GET /api/reports
GET /api/reports/:id
```

### Notifications

```http
GET /api/notifications
PATCH /api/notifications/:id/read
```

## Expected Supabase Tables

The API is typed for these tables:

- `profiles`
- `bookings`
- `reports`
- `notifications`

The route services use snake_case database columns and accept camelCase JSON payloads from the frontend. Supabase errors are returned through the shared API error handler with appropriate HTTP status codes.
