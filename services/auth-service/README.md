# Auth Service - Ero Chat

Authentication and user management service for Ero Chat platform.

## Features

- ✅ User registration with email verification
- ✅ Login with JWT tokens (access + refresh)
- ✅ Password reset flow
- ✅ Email notifications
- ✅ Rate limiting
- ✅ Security middleware (Helmet, CORS)
- ✅ Error handling
- ✅ Logging with Winston

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

Make sure PostgreSQL is running (via Docker Compose in root):

```bash
# From root directory
docker-compose up -d postgres
```

### 3. Configure Environment

```bash
cp ../../.env.example ../../.env
```

Edit `.env` with your configuration.

### 4. Run Migrations

```bash
npm run prisma:migrate
```

### 5. Generate Prisma Client

```bash
npm run prisma:generate
```

## Development

```bash
npm run dev
```

Server will start on `http://localhost:3001`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## API Endpoints

### Public Endpoints

```
POST   /api/v1/auth/register          - Register new user
POST   /api/v1/auth/verify-email      - Verify email with token
POST   /api/v1/auth/login             - Login
POST   /api/v1/auth/refresh-token     - Refresh access token
POST   /api/v1/auth/forgot-password   - Request password reset
POST   /api/v1/auth/reset-password    - Reset password with token
```

### Protected Endpoints

```
POST   /api/v1/auth/logout            - Logout (requires auth)
GET    /api/v1/users/me               - Get current user
PATCH  /api/v1/users/me               - Update user
DELETE /api/v1/users/me               - Delete account
```

## Testing

### Manual Testing with cURL

**Register:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "dateOfBirth": "1990-01-01",
    "acceptedTerms": true
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

## Tech Stack

- **Framework:** Express.js + TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Auth:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Validation:** Zod
- **Email:** Nodemailer
- **Logging:** Winston

## Project Structure

```
src/
├── controllers/      # Request handlers
├── services/         # Business logic
├── middleware/       # Express middleware
├── models/           # Zod validation schemas
├── routes/           # Route definitions
├── utils/            # Utility functions
└── index.ts          # App entry point
```
