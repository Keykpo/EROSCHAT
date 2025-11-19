# 🏗️ Ero Chat - Arquitectura Técnica Detallada

## Documento de Referencia para Desarrollo

**Versión:** 1.0
**Última actualización:** 18 de Noviembre, 2025

---

## 📋 Tabla de Contenidos

1. [Stack Tecnológico Detallado](#stack-tecnológico-detallado)
2. [Arquitectura de Microservicios](#arquitectura-de-microservicios)
3. [Esquema de Base de Datos](#esquema-de-base-de-datos)
4. [API Specification](#api-specification)
5. [Real-Time Architecture](#real-time-architecture)
6. [Seguridad e Infraestructura](#seguridad-e-infraestructura)
7. [Deployment Strategy](#deployment-strategy)

---

## 💻 Stack Tecnológico Detallado

### Frontend Stack

#### Web Application
```json
{
  "framework": "Next.js 14.2+",
  "language": "TypeScript 5.3+",
  "styling": {
    "primary": "Tailwind CSS 3.4+",
    "components": "shadcn/ui",
    "animations": "Framer Motion"
  },
  "stateManagement": {
    "global": "Zustand 4.5+",
    "server": "TanStack Query (React Query) 5.0+",
    "forms": "React Hook Form + Zod"
  },
  "realtime": "Socket.io-client 4.7+",
  "pwa": "next-pwa",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.2.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.0.0",
    "socket.io-client": "^4.7.0",
    "react-hook-form": "^7.50.0",
    "zod": "^3.22.0",
    "framer-motion": "^11.0.0",
    "date-fns": "^3.0.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "eslint": "^8.56.0",
    "prettier": "^3.2.0",
    "jest": "^29.7.0",
    "@testing-library/react": "^14.1.0",
    "playwright": "^1.40.0"
  }
}
```

#### Mobile Applications

**iOS (Swift)**
```json
{
  "language": "Swift 5.9+",
  "minimumDeployment": "iOS 16.0",
  "ui": "SwiftUI",
  "architecture": "MVVM + Combine",
  "dependencies": [
    "SocketIO (4.7.0)",
    "Kingfisher (image loading)",
    "KeychainSwift (secure storage)",
    "Alamofire (networking)"
  ]
}
```

**Android (Kotlin)**
```json
{
  "language": "Kotlin 1.9+",
  "minimumSdk": "26 (Android 8.0)",
  "targetSdk": "34 (Android 14)",
  "ui": "Jetpack Compose",
  "architecture": "MVVM + Kotlin Flow",
  "dependencies": [
    "socket.io-client-java:2.1.0",
    "Coil (image loading)",
    "Retrofit (networking)",
    "Room (local database)",
    "Hilt (dependency injection)"
  ]
}
```

### Backend Stack

#### Core Services (Node.js)

**package.json**
```json
{
  "name": "erochat-backend",
  "version": "1.0.0",
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.7.0",
    "prisma": "^5.9.0",
    "@prisma/client": "^5.9.0",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "zod": "^3.22.4",
    "redis": "^4.6.12",
    "bull": "^4.12.0",
    "nodemailer": "^6.9.8",
    "aws-sdk": "^2.1540.0",
    "stripe": "^14.12.0",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.1.5",
    "winston": "^3.11.0",
    "dotenv": "^16.4.1"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/express": "^4.17.21",
    "typescript": "^5.3.3",
    "ts-node-dev": "^2.0.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.11",
    "supertest": "^6.3.4",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "prettier": "^3.2.4"
  }
}
```

**tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "types": ["node", "jest"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

#### ML/Matching Service (Python)

**requirements.txt**
```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.6.0
pydantic-settings==2.1.0
sqlalchemy==2.0.25
asyncpg==0.29.0
redis==5.0.1
numpy==1.26.3
scikit-learn==1.4.0
tensorflow==2.15.0
openai==1.10.0
python-jose[cryptography]==3.3.0
python-multipart==0.0.6
pytest==8.0.0
httpx==0.26.0
```

**pyproject.toml**
```toml
[tool.poetry]
name = "erochat-ml-service"
version = "1.0.0"
description = "Matching and ML service for Ero Chat"
authors = ["Ero Chat Team"]

[tool.poetry.dependencies]
python = "^3.11"
fastapi = "^0.109.0"
uvicorn = {extras = ["standard"], version = "^0.27.0"}
pydantic = "^2.6.0"
scikit-learn = "^1.4.0"

[tool.poetry.dev-dependencies]
pytest = "^8.0.0"
black = "^24.0.0"
mypy = "^1.8.0"
ruff = "^0.1.15"

[build-system]
requires = ["poetry-core>=1.0.0"]
build-backend = "poetry.core.masonry.api"
```

---

## 🎯 Arquitectura de Microservicios

### Estructura de Directorios

```
erochat-platform/
├── services/
│   ├── auth-service/              # Autenticación y autorización
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── middleware/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── utils/
│   │   │   └── index.ts
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── chat-service/              # Chat en tiempo real
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── sockets/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   └── index.ts
│   │   └── ...
│   │
│   ├── matching-service/          # Algoritmo de matching (Python)
│   │   ├── app/
│   │   │   ├── api/
│   │   │   ├── core/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   │   ├── matching_algorithm.py
│   │   │   │   └── queue_manager.py
│   │   │   └── main.py
│   │   ├── tests/
│   │   └── requirements.txt
│   │
│   ├── moderation-service/        # Moderación y seguridad
│   │   ├── app/
│   │   │   ├── api/
│   │   │   ├── ml/
│   │   │   │   ├── content_filter.py
│   │   │   │   └── image_analysis.py
│   │   │   ├── services/
│   │   │   └── main.py
│   │   └── ...
│   │
│   ├── payment-service/           # Pagos y suscripciones
│   │   └── ...
│   │
│   ├── notification-service/      # Notificaciones push
│   │   └── ...
│   │
│   └── media-service/             # Upload y manejo de media
│       └── ...
│
├── shared/
│   ├── types/                     # TypeScript types compartidos
│   ├── utils/                     # Utilidades compartidas
│   └── constants/                 # Constantes globales
│
├── infrastructure/
│   ├── docker-compose.yml         # Desarrollo local
│   ├── kubernetes/                # K8s manifests
│   │   ├── deployments/
│   │   ├── services/
│   │   ├── ingress/
│   │   └── configmaps/
│   └── terraform/                 # IaC para AWS
│       ├── main.tf
│       ├── vpc.tf
│       ├── rds.tf
│       └── ecs.tf
│
├── apps/
│   ├── web/                       # Next.js web app
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   └── styles/
│   │   └── package.json
│   │
│   ├── ios/                       # iOS app (Swift)
│   └── android/                   # Android app (Kotlin)
│
├── docs/
│   ├── PRODUCT_DESIGN_SPECIFICATION.md
│   ├── TECHNICAL_ARCHITECTURE.md
│   ├── API_DOCUMENTATION.md
│   └── SECURITY_GUIDELINES.md
│
└── .github/
    └── workflows/
        ├── ci.yml
        ├── deploy-staging.yml
        └── deploy-production.yml
```

### Comunicación Entre Servicios

#### Patrón: API Gateway + Service Mesh

```
┌─────────────────────────────────────────────────────────────┐
│                       API Gateway (Kong)                    │
│  - Rate limiting                                            │
│  - Authentication (JWT verification)                        │
│  - Request routing                                          │
│  - CORS handling                                            │
│  - API versioning (/api/v1/...)                            │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│ Auth Service │      │ Chat Service │     │User Service  │
│  (Node.js)   │      │  (Node.js)   │     │  (Node.js)   │
│              │      │              │     │              │
│ POST /login  │      │ WS /socket   │     │ GET /users   │
│ POST /signup │      │              │     │ PATCH /users │
└──────────────┘      └──────────────┘     └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │ Message Queue│    │   Event Bus  │
            │  (RabbitMQ)  │    │   (Redis)    │
            └──────────────┘    └──────────────┘
```

#### Comunicación Síncrona: REST API
```typescript
// Ejemplo: Auth Service llama a User Service
import axios from 'axios';

async function createUserProfile(userId: string, data: ProfileData) {
  const response = await axios.post(
    `${process.env.USER_SERVICE_URL}/api/v1/profiles`,
    {
      userId,
      ...data
    },
    {
      headers: {
        'X-Service-Token': process.env.SERVICE_AUTH_TOKEN
      }
    }
  );
  return response.data;
}
```

#### Comunicación Asíncrona: Message Queue
```typescript
// Ejemplo: Chat Service publica evento de nuevo match
import { publishEvent } from './eventBus';

async function handleMatchSuccess(chatId: string, userAId: string, userBId: string) {
  // Publicar evento
  await publishEvent('match.created', {
    chatId,
    userAId,
    userBId,
    timestamp: new Date()
  });

  // Otros servicios lo consumen:
  // - Notification Service → envía push notifications
  // - Analytics Service → registra métrica
  // - Matching Service → actualiza estadísticas
}
```

---

## 🗄️ Esquema de Base de Datos

### PostgreSQL Schema (Primary Database)

#### Prisma Schema
```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// USERS & AUTHENTICATION
// ============================================

model User {
  id                String    @id @default(uuid())
  email             String    @unique
  passwordHash      String    @map("password_hash")
  dateOfBirth       DateTime  @map("date_of_birth")
  ageVerified       Boolean   @default(false) @map("age_verified")
  isVerified        Boolean   @default(false) @map("is_verified")
  isPremium         Boolean   @default(false) @map("is_premium")
  credits           Int       @default(0)
  trustScore        Int       @default(50) @map("trust_score")

  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")
  lastActive        DateTime? @map("last_active")

  // Relations
  profile           Profile?
  chatsAsUserA      Chat[]    @relation("UserAChats")
  chatsAsUserB      Chat[]    @relation("UserBChats")
  matchesAsUserA    Match[]   @relation("UserAMatches")
  matchesAsUserB    Match[]   @relation("UserBMatches")
  subscriptions     Subscription[]
  transactions      Transaction[]
  reportsCreated    Report[]  @relation("ReportsCreated")
  reportsReceived   Report[]  @relation("ReportsReceived")
  blocksCreated     Block[]   @relation("BlocksCreated")
  blocksReceived    Block[]   @relation("BlocksReceived")

  @@map("users")
}

model Profile {
  userId            String    @id @map("user_id")
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  username          String    @unique
  gender            Gender
  interestedIn      Gender[]  @map("interested_in")

  // Location
  city              String?
  region            String?
  latitude          Float?
  longitude         Float?

  // Bio & Interests
  bio               String?   @db.Text
  interests         String[]  // Array of tags

  // Preferences
  minAge            Int       @default(18) @map("min_age")
  maxAge            Int       @default(99) @map("max_age")
  maxDistance       Int       @default(50) @map("max_distance") // km
  lookingFor        LookingFor[] @map("looking_for")

  // Revealed info (post-match)
  photos            Json      @default("[]") // Array of URLs
  socialLinks       Json?     @map("social_links")

  // Settings
  showOnlineStatus  Boolean   @default(true) @map("show_online_status")
  showLastSeen      Boolean   @default(true) @map("show_last_seen")
  allowLocation     Boolean   @default(true) @map("allow_location")

  updatedAt         DateTime  @updatedAt @map("updated_at")

  @@map("profiles")
}

enum Gender {
  MALE
  FEMALE
  NON_BINARY
  OTHER
}

enum LookingFor {
  CHAT
  DATING
  BOTH
}

// ============================================
// CHAT & MATCHING
// ============================================

model Chat {
  id                String    @id @default(uuid())

  userAId           String    @map("user_a_id")
  userA             User      @relation("UserAChats", fields: [userAId], references: [id])

  userBId           String    @map("user_b_id")
  userB             User      @relation("UserBChats", fields: [userBId], references: [id])

  status            ChatStatus @default(ACTIVE)

  startedAt         DateTime  @default(now()) @map("started_at")
  endsAt            DateTime? @map("ends_at")
  matchedAt         DateTime? @map("matched_at")
  endedAt           DateTime? @map("ended_at")

  timeExtensions    Int       @default(0) @map("time_extensions")

  // Relations
  match             Match?

  @@unique([userAId, userBId])
  @@index([status])
  @@index([endsAt])
  @@map("chats")
}

enum ChatStatus {
  ACTIVE
  ENDED
  MATCHED
}

model Match {
  id                String    @id @default(uuid())

  userAId           String    @map("user_a_id")
  userA             User      @relation("UserAMatches", fields: [userAId], references: [id])

  userBId           String    @map("user_b_id")
  userB             User      @relation("UserBMatches", fields: [userBId], references: [id])

  chatId            String    @unique @map("chat_id")
  chat              Chat      @relation(fields: [chatId], references: [id])

  status            MatchStatus @default(ACTIVE)

  matchedAt         DateTime  @default(now()) @map("matched_at")
  unmatchedAt       DateTime? @map("unmatched_at")

  @@unique([userAId, userBId])
  @@index([status])
  @@map("matches")
}

enum MatchStatus {
  ACTIVE
  UNMATCHED
}

// ============================================
// PAYMENTS & SUBSCRIPTIONS
// ============================================

model Subscription {
  id                String    @id @default(uuid())
  userId            String    @map("user_id")
  user              User      @relation(fields: [userId], references: [id])

  tier              SubscriptionTier

  stripeSubscriptionId String? @unique @map("stripe_subscription_id")
  stripeCustomerId  String?   @map("stripe_customer_id")

  status            SubscriptionStatus @default(ACTIVE)

  currentPeriodStart DateTime @map("current_period_start")
  currentPeriodEnd   DateTime @map("current_period_end")

  cancelAtPeriodEnd  Boolean  @default(false) @map("cancel_at_period_end")
  canceledAt        DateTime? @map("canceled_at")

  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")

  @@index([userId])
  @@index([status])
  @@map("subscriptions")
}

enum SubscriptionTier {
  PREMIUM
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
  EXPIRED
  PAST_DUE
}

model Transaction {
  id                String    @id @default(uuid())
  userId            String    @map("user_id")
  user              User      @relation(fields: [userId], references: [id])

  type              TransactionType
  amount            Int       // cents
  credits           Int?      // if credits purchase

  stripePaymentIntentId String? @unique @map("stripe_payment_intent_id")

  status            TransactionStatus @default(PENDING)

  metadata          Json?

  createdAt         DateTime  @default(now()) @map("created_at")
  completedAt       DateTime? @map("completed_at")

  @@index([userId])
  @@index([status])
  @@map("transactions")
}

enum TransactionType {
  SUBSCRIPTION
  CREDITS
  BOOST
  SUPER_LIKE
  REWIND
}

enum TransactionStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

// ============================================
// MODERATION
// ============================================

model Report {
  id                String    @id @default(uuid())

  reporterId        String    @map("reporter_id")
  reporter          User      @relation("ReportsCreated", fields: [reporterId], references: [id])

  reportedId        String    @map("reported_id")
  reported          User      @relation("ReportsReceived", fields: [reportedId], references: [id])

  chatId            String?   @map("chat_id")

  reason            ReportReason
  description       String?   @db.Text

  status            ReportStatus @default(PENDING)

  createdAt         DateTime  @default(now()) @map("created_at")
  reviewedAt        DateTime? @map("reviewed_at")
  reviewedBy        String?   @map("reviewed_by")

  action            ModerationAction? @map("moderation_action")
  notes             String?   @db.Text

  @@index([status])
  @@index([reportedId])
  @@map("reports")
}

enum ReportReason {
  INAPPROPRIATE_CONTENT
  SPAM
  HARASSMENT
  FAKE_PROFILE
  UNDERAGE
  OTHER
}

enum ReportStatus {
  PENDING
  REVIEWED
  RESOLVED
}

enum ModerationAction {
  NO_ACTION
  WARNING
  TEMPORARY_BAN
  PERMANENT_BAN
}

model Block {
  id                String    @id @default(uuid())

  blockerId         String    @map("blocker_id")
  blocker           User      @relation("BlocksCreated", fields: [blockerId], references: [id])

  blockedId         String    @map("blocked_id")
  blocked           User      @relation("BlocksReceived", fields: [blockedId], references: [id])

  createdAt         DateTime  @default(now()) @map("created_at")

  @@unique([blockerId, blockedId])
  @@index([blockerId])
  @@map("blocks")
}
```

### MongoDB Schema (Chat Messages & Logs)

```javascript
// chats collection
{
  _id: ObjectId,
  chatId: String (UUID),
  participants: [
    { userId: String, joinedAt: Date, leftAt: Date? }
  ],
  messages: [
    {
      messageId: String (UUID),
      senderId: String (UUID),
      content: String,
      timestamp: Date,
      isDeleted: Boolean,
      type: 'text' | 'system',
      metadata: Object
    }
  ],
  status: 'active' | 'ended' | 'matched',
  createdAt: Date,
  updatedAt: Date,
  expiresAt: Date // TTL index for auto-deletion
}

// messages collection (alternative flat structure for better querying)
{
  _id: ObjectId,
  messageId: String (UUID),
  chatId: String (UUID),
  senderId: String (UUID),
  content: String,
  timestamp: Date,
  isDeleted: Boolean,
  type: 'text' | 'image' | 'video' | 'system',
  metadata: {
    imageUrl: String?,
    videoUrl: String?,
    expiresAt: Date? // for self-destruct media
  },
  createdAt: Date
}

// analytics_events collection
{
  _id: ObjectId,
  userId: String (UUID),
  eventType: String, // 'chat_started', 'match_success', 'time_extended', etc.
  metadata: Object,
  timestamp: Date,
  sessionId: String?
}

// moderation_logs collection
{
  _id: ObjectId,
  contentId: String (UUID), // messageId or userId
  contentType: 'message' | 'image' | 'profile',
  action: 'flagged' | 'blocked' | 'approved',
  reason: String,
  aiConfidence: Number, // 0-1
  reviewedBy: String?, // moderator userId
  timestamp: Date,
  metadata: Object
}
```

### Redis Data Structures

```javascript
// User Sessions
KEY: session:{userId}
VALUE: {
  userId: String,
  deviceId: String,
  ipAddress: String,
  lastActive: Timestamp,
  socketId: String
}
TTL: 7 days

// Online Presence
KEY: presence:{userId}
VALUE: {
  isOnline: Boolean,
  lastSeen: Timestamp,
  status: 'online' | 'away' | 'offline'
}
TTL: 1 hour (refresh on activity)

// Matching Queue
KEY: matching:queue:{gender}:{region}
VALUE: Sorted Set [userId, score (timestamp)]
// Score = timestamp of when they joined queue

// Rate Limiting
KEY: ratelimit:{endpoint}:{userId}
VALUE: Counter
TTL: Varies (1 min, 15 min, 1 hour)

// Cache
KEY: cache:user:{userId}
VALUE: JSON (user data)
TTL: 15 minutes

KEY: cache:profile:{userId}
VALUE: JSON (profile data)
TTL: 15 minutes

// JWT Blacklist (for logout)
KEY: blacklist:token:{jti}
VALUE: "1"
TTL: Token expiration time
```

---

## 🔌 API Specification

### Base URL
```
Development: http://localhost:3000/api/v1
Staging: https://api-staging.erochat.com/api/v1
Production: https://api.erochat.com/api/v1
```

### Authentication

Todos los endpoints (excepto `/auth/*`) requieren autenticación mediante JWT.

**Header:**
```
Authorization: Bearer <access_token>
```

### Endpoints Completos

#### 1. Authentication Service

```yaml
POST /api/v1/auth/register
Description: Registrar nuevo usuario
Request:
  body:
    email: string (required, valid email)
    password: string (required, min 8 chars)
    dateOfBirth: string (required, ISO 8601, must be 18+)
    acceptedTerms: boolean (required, must be true)
Response:
  201 Created:
    userId: string (UUID)
    email: string
    message: "Verification email sent"
  400 Bad Request:
    error: "Validation error"
    details: [...]
  409 Conflict:
    error: "Email already registered"

POST /api/v1/auth/verify-email
Description: Verificar email con token
Request:
  body:
    token: string (required)
Response:
  200 OK:
    message: "Email verified successfully"
  400 Bad Request:
    error: "Invalid or expired token"

POST /api/v1/auth/login
Description: Iniciar sesión
Request:
  body:
    email: string (required)
    password: string (required)
Response:
  200 OK:
    accessToken: string (JWT, expires in 15min)
    refreshToken: string (JWT, expires in 7 days)
    user:
      id: string
      email: string
      isPremium: boolean
      credits: number
  401 Unauthorized:
    error: "Invalid credentials"
  403 Forbidden:
    error: "Email not verified"

POST /api/v1/auth/refresh-token
Description: Renovar access token
Request:
  body:
    refreshToken: string (required)
Response:
  200 OK:
    accessToken: string
  401 Unauthorized:
    error: "Invalid refresh token"

POST /api/v1/auth/logout
Description: Cerrar sesión (blacklist token)
Request:
  headers:
    Authorization: Bearer <access_token>
Response:
  200 OK:
    message: "Logged out successfully"

POST /api/v1/auth/forgot-password
Description: Solicitar reset de contraseña
Request:
  body:
    email: string (required)
Response:
  200 OK:
    message: "Password reset email sent"

POST /api/v1/auth/reset-password
Description: Resetear contraseña con token
Request:
  body:
    token: string (required)
    newPassword: string (required, min 8 chars)
Response:
  200 OK:
    message: "Password reset successfully"
```

#### 2. User & Profile Service

```yaml
GET /api/v1/users/me
Description: Obtener datos del usuario actual
Response:
  200 OK:
    id: string
    email: string
    isPremium: boolean
    isVerified: boolean
    credits: number
    createdAt: string (ISO 8601)
    lastActive: string (ISO 8601)

PATCH /api/v1/users/me
Description: Actualizar datos del usuario
Request:
  body:
    email?: string
    password?: string (hash en backend)
Response:
  200 OK:
    (same as GET /users/me)

DELETE /api/v1/users/me
Description: Eliminar cuenta (GDPR)
Response:
  204 No Content

GET /api/v1/profiles/me
Description: Obtener perfil del usuario actual
Response:
  200 OK:
    userId: string
    username: string
    gender: string
    interestedIn: string[]
    city: string
    region: string
    bio: string
    interests: string[]
    preferences:
      minAge: number
      maxAge: number
      maxDistance: number
      lookingFor: string[]
    photos: string[]
    socialLinks: object

POST /api/v1/profiles
Description: Crear perfil (onboarding)
Request:
  body:
    username: string (required, unique)
    gender: string (required)
    interestedIn: string[] (required)
    city: string
    region: string
    interests: string[]
    preferences:
      minAge: number (default 18)
      maxAge: number (default 99)
      maxDistance: number (default 50)
      lookingFor: string[]
Response:
  201 Created:
    (same as GET /profiles/me)

PATCH /api/v1/profiles/me
Description: Actualizar perfil
Request:
  body: (partial profile data)
Response:
  200 OK:
    (same as GET /profiles/me)

POST /api/v1/profiles/me/photos
Description: Upload foto de perfil
Request:
  multipart/form-data:
    photo: file (required, max 10MB, jpg/png)
Response:
  200 OK:
    photoUrl: string (S3 URL)
    photos: string[] (array actualizado)

DELETE /api/v1/profiles/me/photos/:photoId
Description: Eliminar foto
Response:
  204 No Content

GET /api/v1/users/:userId/profile
Description: Ver perfil de otro usuario (solo si hay match)
Response:
  200 OK:
    (same structure as GET /profiles/me, but limited data)
  403 Forbidden:
    error: "No match with this user"
```

#### 3. Matching Service

```yaml
POST /api/v1/matching/join-queue
Description: Entrar en cola de matching
Request:
  body:
    filters?: {
      minAge?: number
      maxAge?: number
      maxDistance?: number
      gender?: string[]
    }
Response:
  200 OK:
    queueId: string
    estimatedWaitTime: number (seconds)

DELETE /api/v1/matching/leave-queue
Description: Salir de la cola
Response:
  204 No Content

GET /api/v1/matching/status
Description: Estado actual en cola
Response:
  200 OK:
    inQueue: boolean
    queuePosition: number
    estimatedWaitTime: number
  404 Not Found:
    error: "Not in queue"
```

#### 4. Chat Service

**REST Endpoints:**

```yaml
GET /api/v1/chats
Description: Listar chats del usuario
Query params:
  status?: 'active' | 'matched' | 'ended'
  limit?: number (default 20)
  offset?: number (default 0)
Response:
  200 OK:
    chats: [
      {
        id: string
        participants: [userId1, userId2]
        status: string
        startedAt: string
        endsAt: string
        matchedAt: string?
      }
    ]
    total: number

GET /api/v1/chats/:chatId
Description: Obtener detalles de un chat
Response:
  200 OK:
    id: string
    participants: object[]
    status: string
    startedAt: string
    endsAt: string
    timeExtensions: number
    canExtend: boolean

GET /api/v1/chats/:chatId/messages
Description: Obtener mensajes de un chat
Query params:
  limit?: number (default 50)
  before?: string (messageId, for pagination)
Response:
  200 OK:
    messages: [
      {
        messageId: string
        senderId: string
        content: string
        timestamp: string
        type: 'text' | 'system'
      }
    ]
    hasMore: boolean

POST /api/v1/chats/:chatId/extend-time
Description: Solicitar extensión de tiempo
Response:
  200 OK:
    endsAt: string (new end time)
    timeExtensions: number
  400 Bad Request:
    error: "Max extensions reached"
  402 Payment Required:
    error: "Premium feature required"

POST /api/v1/chats/:chatId/match-request
Description: Solicitar match (revelar identidad)
Response:
  200 OK:
    status: 'pending' | 'matched'
    message: string
  409 Conflict:
    error: "Already requested match"

DELETE /api/v1/chats/:chatId/leave
Description: Salir del chat
Response:
  204 No Content
```

**WebSocket Events:**

```yaml
# Client → Server

chat:join
Description: Unirse a un chat
Payload:
  chatId: string
Response:
  chat:joined
  error (if failed)

chat:leave
Payload:
  chatId: string

message:send
Payload:
  chatId: string
  content: string (max 1000 chars)
Response:
  message:sent
  error (if failed)

typing:start
Payload:
  chatId: string

typing:stop
Payload:
  chatId: string

# Server → Client

chat:joined
Payload:
  chatId: string
  participants: object[]
  endsAt: string

chat:user_joined
Payload:
  chatId: string
  userId: string

chat:user_left
Payload:
  chatId: string
  userId: string
  reason: 'left' | 'timeout' | 'unmatched'

message:received
Payload:
  chatId: string
  message:
    messageId: string
    senderId: string
    content: string
    timestamp: string

typing:user_typing
Payload:
  chatId: string
  userId: string
  isTyping: boolean

chat:time_extended
Payload:
  chatId: string
  endsAt: string
  extendedBy: string (userId)

match:requested
Payload:
  chatId: string
  requestedBy: string (userId)

match:success
Payload:
  chatId: string
  matchId: string
  revealedProfiles:
    - userId: string
      username: string
      photos: string[]
      bio: string
      ...

match:failed
Payload:
  chatId: string
  reason: 'rejected' | 'timeout'

chat:ended
Payload:
  chatId: string
  reason: 'timeout' | 'unmatched' | 'user_left'

error
Payload:
  code: string
  message: string
```

#### 5. Payment Service

```yaml
GET /api/v1/subscriptions
Description: Ver suscripciones del usuario
Response:
  200 OK:
    subscriptions: [
      {
        id: string
        tier: 'premium'
        status: string
        currentPeriodEnd: string
        cancelAtPeriodEnd: boolean
      }
    ]

POST /api/v1/subscriptions/subscribe
Description: Crear suscripción Premium
Request:
  body:
    tier: 'premium'
    interval: 'month' | 'year'
    paymentMethodId: string (Stripe payment method)
Response:
  200 OK:
    subscriptionId: string
    clientSecret: string (for 3D Secure)
  402 Payment Required:
    error: "Payment failed"

POST /api/v1/subscriptions/cancel
Description: Cancelar suscripción
Response:
  200 OK:
    cancelAtPeriodEnd: true
    currentPeriodEnd: string

GET /api/v1/credits/balance
Description: Ver balance de créditos
Response:
  200 OK:
    balance: number

POST /api/v1/credits/purchase
Description: Comprar créditos
Request:
  body:
    package: '10' | '50' | '100' | '250'
    paymentMethodId: string
Response:
  200 OK:
    credits: number (new balance)
    transactionId: string

POST /api/v1/credits/spend
Description: Gastar créditos (interno)
Request:
  body:
    amount: number
    type: 'boost' | 'super_like' | 'rewind' | 'peek'
    metadata: object
Response:
  200 OK:
    credits: number (new balance)
  402 Payment Required:
    error: "Insufficient credits"
```

#### 6. Moderation Service

```yaml
POST /api/v1/reports
Description: Reportar usuario
Request:
  body:
    reportedUserId: string (required)
    chatId: string (optional)
    reason: string (required)
    description: string (optional)
Response:
  201 Created:
    reportId: string
    message: "Report submitted successfully"

POST /api/v1/users/:userId/block
Description: Bloquear usuario
Response:
  200 OK:
    message: "User blocked"

DELETE /api/v1/users/:userId/unblock
Description: Desbloquear usuario
Response:
  200 OK:
    message: "User unblocked"

GET /api/v1/users/blocked
Description: Lista de usuarios bloqueados
Response:
  200 OK:
    blockedUsers: [
      {
        userId: string
        blockedAt: string
      }
    ]
```

---

## ⚡ Real-Time Architecture

### WebSocket Connection Flow

```
Client                          Server (Socket.io)               Services
  │                                    │                             │
  │  1. HTTP Handshake                 │                             │
  ├────────────────────────────────────>│                             │
  │    GET /socket.io/?EIO=4&          │                             │
  │        transport=websocket         │                             │
  │        Auth: Bearer <token>        │                             │
  │                                    │  2. Verify JWT              │
  │                                    ├─────────────────────────────>│
  │                                    │<─────────────────────────────│
  │                                    │     User verified           │
  │  3. WebSocket Upgrade              │                             │
  │<────────────────────────────────────│                             │
  │    101 Switching Protocols         │                             │
  │                                    │                             │
  │  4. Join chat room                 │                             │
  ├─── chat:join(chatId) ──────────────>│                             │
  │                                    │  5. Validate chat access    │
  │                                    ├─────────────────────────────>│
  │                                    │<─────────────────────────────│
  │                                    │     Access granted          │
  │  6. chat:joined event              │                             │
  │<────────────────────────────────────│                             │
  │                                    │                             │
  │  7. Send message                   │                             │
  ├─── message:send ───────────────────>│                             │
  │                                    │  8. Save to MongoDB         │
  │                                    ├─────────────────────────────>│
  │                                    │  9. Moderate content        │
  │                                    ├─────────────────────────────>│
  │                                    │     Content approved        │
  │                                    │<─────────────────────────────│
  │  10. Broadcast to room             │                             │
  │<───── message:received ─────────────│                             │
  │                                    │─ message:received ──>       │
  │                                    │    (to other user)          │
```

### Socket.io Server Implementation

```typescript
// src/sockets/chatSocket.ts
import { Server as SocketServer, Socket } from 'socket.io';
import { verifyJWT } from '../utils/auth';
import { ChatService } from '../services/chatService';
import { ModerationService } from '../services/moderationService';

interface AuthenticatedSocket extends Socket {
  userId: string;
}

export function initializeChatSocket(io: SocketServer) {
  // Middleware: Authentication
  io.use(async (socket: Socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const payload = await verifyJWT(token);
      (socket as AuthenticatedSocket).userId = payload.userId;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.userId}`);

    // Update presence
    updateUserPresence(socket.userId, 'online');

    // Event: Join chat
    socket.on('chat:join', async ({ chatId }) => {
      try {
        // Validate user has access to this chat
        const chat = await ChatService.getChatById(chatId);

        if (!chat.participants.includes(socket.userId)) {
          socket.emit('error', {
            code: 'FORBIDDEN',
            message: 'You are not a participant in this chat'
          });
          return;
        }

        // Join Socket.io room
        socket.join(chatId);

        // Notify user
        socket.emit('chat:joined', {
          chatId,
          participants: chat.participants,
          endsAt: chat.endsAt
        });

        // Notify other participants
        socket.to(chatId).emit('chat:user_joined', {
          chatId,
          userId: socket.userId
        });
      } catch (error) {
        socket.emit('error', {
          code: 'CHAT_JOIN_ERROR',
          message: error.message
        });
      }
    });

    // Event: Send message
    socket.on('message:send', async ({ chatId, content }) => {
      try {
        // Rate limiting check
        const canSend = await checkRateLimit(socket.userId, 'message', 30); // 30 msgs/min
        if (!canSend) {
          socket.emit('error', {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'You are sending messages too fast'
          });
          return;
        }

        // Validate message
        if (!content || content.length > 1000) {
          socket.emit('error', {
            code: 'INVALID_MESSAGE',
            message: 'Message must be 1-1000 characters'
          });
          return;
        }

        // Content moderation
        const moderationResult = await ModerationService.moderateText(content);

        if (moderationResult.flagged) {
          socket.emit('error', {
            code: 'CONTENT_BLOCKED',
            message: 'Your message contains inappropriate content'
          });

          // Log for review
          await ModerationService.logFlag(socket.userId, content, moderationResult);
          return;
        }

        // Save message to database
        const message = await ChatService.saveMessage({
          chatId,
          senderId: socket.userId,
          content,
          timestamp: new Date()
        });

        // Broadcast to all participants in the chat
        io.to(chatId).emit('message:received', {
          chatId,
          message: {
            messageId: message.id,
            senderId: socket.userId,
            content: message.content,
            timestamp: message.timestamp
          }
        });

        // Acknowledge to sender
        socket.emit('message:sent', {
          messageId: message.id,
          timestamp: message.timestamp
        });
      } catch (error) {
        socket.emit('error', {
          code: 'MESSAGE_ERROR',
          message: error.message
        });
      }
    });

    // Event: Typing indicator
    socket.on('typing:start', ({ chatId }) => {
      socket.to(chatId).emit('typing:user_typing', {
        chatId,
        userId: socket.userId,
        isTyping: true
      });
    });

    socket.on('typing:stop', ({ chatId }) => {
      socket.to(chatId).emit('typing:user_typing', {
        chatId,
        userId: socket.userId,
        isTyping: false
      });
    });

    // Event: Match request
    socket.on('match:request', async ({ chatId }) => {
      try {
        const result = await ChatService.requestMatch(chatId, socket.userId);

        if (result.status === 'matched') {
          // Both users have requested match
          const revealedProfiles = await ChatService.revealProfiles(chatId);

          // Notify both users
          io.to(chatId).emit('match:success', {
            chatId,
            matchId: result.matchId,
            revealedProfiles
          });

          // Trigger notifications
          await notifyMatchSuccess(chatId, result.matchId);
        } else {
          // Only one user has requested
          socket.to(chatId).emit('match:requested', {
            chatId,
            requestedBy: socket.userId
          });

          socket.emit('match:request_sent', {
            chatId,
            message: 'Waiting for the other user to accept'
          });
        }
      } catch (error) {
        socket.emit('error', {
          code: 'MATCH_ERROR',
          message: error.message
        });
      }
    });

    // Event: Leave chat
    socket.on('chat:leave', async ({ chatId }) => {
      socket.leave(chatId);

      socket.to(chatId).emit('chat:user_left', {
        chatId,
        userId: socket.userId,
        reason: 'left'
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
      updateUserPresence(socket.userId, 'offline');
    });
  });
}

// Helper functions
async function updateUserPresence(userId: string, status: 'online' | 'offline') {
  await redisClient.hSet(`presence:${userId}`, {
    isOnline: status === 'online',
    lastSeen: Date.now()
  });
  await redisClient.expire(`presence:${userId}`, 3600); // 1 hour TTL
}

async function checkRateLimit(userId: string, action: string, limit: number): Promise<boolean> {
  const key = `ratelimit:${action}:${userId}`;
  const count = await redisClient.incr(key);

  if (count === 1) {
    await redisClient.expire(key, 60); // 1 minute window
  }

  return count <= limit;
}
```

---

## 🔐 Seguridad e Infraestructura

### Environment Variables

```bash
# .env.example

# Application
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/erochat
MONGODB_URL=mongodb://localhost:27017/erochat
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=erochat-media
CDN_URL=https://cdn.erochat.com

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PREMIUM_PRICE_ID=price_...

# External APIs
OPENAI_API_KEY=sk-...
AWS_REKOGNITION_REGION=us-east-1

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=noreply@erochat.com

# Monitoring
SENTRY_DSN=https://...@sentry.io/...
DATADOG_API_KEY=...

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### Docker Configuration

**Dockerfile (Node.js services)**
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY src/ ./src/

# Build TypeScript
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

**docker-compose.yml (Local Development)**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: erochat
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  rabbitmq:
    image: rabbitmq:3-management-alpine
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: admin

  auth-service:
    build:
      context: ./services/auth-service
    ports:
      - "3001:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/erochat
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  chat-service:
    build:
      context: ./services/chat-service
    ports:
      - "3002:3000"
    environment:
      - MONGODB_URL=mongodb://mongodb:27017/erochat
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongodb
      - redis

  matching-service:
    build:
      context: ./services/matching-service
    ports:
      - "3003:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/erochat
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
  redis_data:
  mongo_data:
```

---

## 🚀 Deployment Strategy

### CI/CD Pipeline (GitHub Actions)

**.github/workflows/ci.yml**
```yaml
name: CI

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

**.github/workflows/deploy-production.yml**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: erochat-backend
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG

      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster erochat-production \
            --service backend-service \
            --force-new-deployment
```

### Infrastructure as Code (Terraform)

**terraform/main.tf**
```hcl
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "erochat-terraform-state"
    key    = "production/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC
module "vpc" {
  source = "./modules/vpc"

  environment = var.environment
  cidr_block  = "10.0.0.0/16"
}

# RDS (PostgreSQL)
module "rds" {
  source = "./modules/rds"

  environment         = var.environment
  instance_class      = "db.t3.medium"
  allocated_storage   = 100
  vpc_id              = module.vpc.vpc_id
  subnet_ids          = module.vpc.private_subnet_ids
}

# ElastiCache (Redis)
module "redis" {
  source = "./modules/elasticache"

  environment   = var.environment
  node_type     = "cache.t3.medium"
  num_cache_nodes = 2
  vpc_id        = module.vpc.vpc_id
  subnet_ids    = module.vpc.private_subnet_ids
}

# ECS Cluster
module "ecs" {
  source = "./modules/ecs"

  environment    = var.environment
  cluster_name   = "erochat-${var.environment}"
  vpc_id         = module.vpc.vpc_id
  subnet_ids     = module.vpc.private_subnet_ids
}

# S3 for media storage
resource "aws_s3_bucket" "media" {
  bucket = "erochat-media-${var.environment}"

  tags = {
    Environment = var.environment
    Purpose     = "Media Storage"
  }
}

# CloudFront CDN
resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = aws_s3_bucket.media.bucket_regional_domain_name
    origin_id   = "S3-erochat-media"
  }

  enabled = true

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-erochat-media"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
  }
}
```

---

## 📊 Monitoring & Observability

### Logging Strategy

```typescript
// src/utils/logger.ts
import winston from 'winston';
import { Logtail } from '@logtail/node';

const logtail = new Logtail(process.env.LOGTAIL_TOKEN);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'erochat-backend',
    environment: process.env.NODE_ENV
  },
  transports: [
    // Console (development)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // File (production)
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log'
    }),
    // Logtail (cloud)
    new logtail.winston()
  ]
});

// Usage
logger.info('User logged in', { userId: '123', ip: '1.2.3.4' });
logger.error('Payment failed', { error: err, userId: '123' });
```

### Metrics & APM

```typescript
// Datadog APM integration
import tracer from 'dd-trace';

tracer.init({
  service: 'erochat-backend',
  env: process.env.NODE_ENV,
  analytics: true
});

// Custom metrics
import { StatsD } from 'node-dogstatsd';
const metrics = new StatsD();

// Track custom events
metrics.increment('chat.started');
metrics.histogram('chat.duration', chatDuration);
metrics.gauge('matching.queue_length', queueLength);
```

---

**Fin del documento técnico.**

Este documento proporciona las bases técnicas para implementar Ero Chat. Para más detalles, consulta:
- `PRODUCT_DESIGN_SPECIFICATION.md` (diseño del producto)
- `API_DOCUMENTATION.md` (documentación completa de API)
- `SECURITY_GUIDELINES.md` (guías de seguridad)
