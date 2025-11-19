# 🔥 Ero Chat - Anonymous Erotic Dating Platform

**Estado actual:** 8 de 24 sprints completados (33%) | MVP 100% funcional | Web + Mobile + Monetización

Plataforma de chat anónimo y dating con matching inteligente, revelación de perfiles progresiva, sistema de moderación AI, y monetización completa con Stripe.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
[![React Native](https://img.shields.io/badge/React_Native-0.72+-blue.svg)](https://reactnative.dev/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-blueviolet.svg)](https://stripe.com/)

[Características](#-características-principales) •
[Tech Stack](#-tech-stack) •
[Configuración](#-configuración-local) •
[API Docs](#-api-documentation) •
[Deployment](#-deployment) •
[Roadmap](ROADMAP.md)

---

## 📋 Tabla de Contenidos

1. [Características Principales](#-características-principales)
2. [Arquitectura](#-arquitectura)
3. [Tech Stack](#-tech-stack)
4. [Estructura del Proyecto](#-estructura-del-proyecto)
5. [Configuración Local](#-configuración-local)
6. [Variables de Entorno](#-variables-de-entorno)
7. [Desarrollo](#-desarrollo)
8. [API Documentation](#-api-documentation)
9. [Deployment](#-deployment)
10. [Métricas](#-métricas-del-proyecto)

---

## ✨ Características Principales

### MVP Core (100% Completo)
- ✅ **Autenticación completa**: Registro, login, verificación de email, reset de contraseña
- ✅ **Onboarding de 3 pasos**: Información básica, preferencias de matching, intereses y fotos
- ✅ **Matching inteligente**: Algoritmo basado en intereses (40%), edad (30%), ubicación (30%)
- ✅ **Chat anónimo en tiempo real**: Socket.io con timer de 20 minutos
- ✅ **Sistema de Match/Reveal**: Solicitudes de match durante el chat con revelación progresiva
- ✅ **Sistema de moderación AI**: OpenAI Moderation API para todos los mensajes
- ✅ **Sistema de reportes**: 6 razones de reporte, panel de admin, acciones de moderación
- ✅ **App móvil**: React Native + Expo (iOS y Android)

### Monetización (100% Completo)
- ✅ **Stripe Integration**: Checkout, webhooks, customer portal
- ✅ **Suscripciones Premium**: Mensual ($9.99) y Anual ($79.99, ahorro 33%)
- ✅ **Features Premium**:
  - Usuarios Free: 5 chats/día, 10 matches/mes, 3 fotos
  - Usuarios Premium: Chats ilimitados, matches ilimitados, 6 fotos, 5 super likes/día

### Plataformas
- 🌐 **Web App**: Next.js 14 con App Router
- 📱 **Mobile App**: React Native con Expo (iOS + Android)
- 🎮 **Admin Panel**: Dashboard de moderación y reportes

---

## 🏗 Arquitectura

```
┌──────────────────┐          ┌──────────────────┐
│   Frontend Web   │          │   Mobile App     │
│  Next.js 14      │          │  React Native    │
│  + TypeScript    │          │  + Expo          │
└────────┬─────────┘          └────────┬─────────┘
         │                             │
         │        HTTP + WebSocket     │
         │                             │
         └─────────────┬───────────────┘
                       │
         ┌─────────────┴──────────────────────────┐
         │      Auth Service (Node.js)            │
         │   Express + TypeScript + Prisma        │
         │   Socket.io + Stripe + OpenAI          │
         └─────┬────────────┬──────────┬──────────┘
               │            │          │
         ┌─────┴──────┐ ┌──┴────┐ ┌──┴────┐
         │ PostgreSQL │ │MongoDB│ │ Redis │
         │ (Users,    │ │(Msgs, │ │(Queue,│
         │  Profiles, │ │Reports│ │Cache) │
         │  Matches)  │ │)      │ │       │
         └────────────┘ └───────┘ └───────┘
```

### Microservicios

1. **Auth Service** (Node.js + Express)
   - Autenticación y autorización
   - Gestión de usuarios y perfiles
   - Chats y matches
   - Moderación y reportes
   - Suscripciones y pagos
   - WebSocket server

### Bases de Datos

- **PostgreSQL**: Users, Profiles, Chats, Matches, Blocks, Subscriptions, Transactions
- **MongoDB**: Messages, Chat Metadata, Reports
- **Redis**: Queue management, caching, rate limiting

---

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 20 + TypeScript 5.3
- **Framework**: Express 4.x
- **ORMs**: Prisma (PostgreSQL) + Mongoose (MongoDB)
- **Real-time**: Socket.io
- **Queue**: Redis
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **APIs**: Stripe, OpenAI

### Frontend Web
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Real-time**: Socket.io-client
- **Icons**: Lucide React

### Mobile
- **Framework**: React Native + Expo
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State**: Zustand
- **Storage**: AsyncStorage
- **Real-time**: Socket.io-client

### DevOps & Infrastructure
- **Containerization**: Docker + Docker Compose
- **Monorepo**: npm workspaces
- **Version Control**: Git

---

## 📁 Estructura del Proyecto

```
EROSCHAT/
├── apps/
│   ├── web/                    # Next.js web application
│   │   ├── src/
│   │   │   ├── app/           # Pages (App Router)
│   │   │   ├── components/    # React components
│   │   │   ├── lib/           # API client & utils
│   │   │   └── store/         # Zustand stores
│   │   └── package.json
│   │
│   └── mobile/                 # React Native app
│       ├── src/
│       │   ├── api/           # API & Socket clients
│       │   ├── screens/       # App screens
│       │   ├── navigation/    # React Navigation
│       │   ├── store/         # Zustand stores
│       │   └── types/         # TypeScript types
│       └── package.json
│
├── services/
│   └── auth-service/          # Main backend service
│       ├── src/
│       │   ├── controllers/  # Route controllers
│       │   ├── services/     # Business logic
│       │   ├── models/       # MongoDB models
│       │   ├── middleware/   # Express middleware
│       │   ├── routes/       # API routes
│       │   └── config/       # Configuration
│       ├── prisma/           # Prisma schema
│       └── package.json
│
├── docker-compose.yml         # Development stack
├── package.json               # Root package.json
├── ROADMAP.md                 # Development roadmap
└── README.md                  # This file
```

---

## 🚀 Configuración Local

### Prerequisitos

- Node.js >= 20.0.0
- npm >= 10.0.0
- Docker y Docker Compose

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd EROSCHAT
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Levantar Servicios con Docker

```bash
docker-compose up -d
```

### 4. Configurar Variables de Entorno

**services/auth-service/.env:**
```env
PORT=3000
NODE_ENV=development

DATABASE_URL="postgresql://postgres:password@localhost:5432/erochat?schema=public"
MONGODB_URI="mongodb://localhost:27017/erochat"

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

OPENAI_API_KEY=sk-your-key
STRIPE_SECRET_KEY=sk_test_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-secret
```

**apps/web/.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

### 5. Ejecutar Migraciones

```bash
cd services/auth-service
npx prisma generate
npx prisma migrate deploy
```

### 6. Iniciar Desarrollo

```bash
# Todos los servicios
npm run dev

# Solo web
npm run dev:web

# Solo mobile
npm run dev:mobile
```

---

## 🔧 Variables de Entorno

### Backend (Auth Service)

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `REDIS_HOST` | Redis host | ✅ |
| `JWT_SECRET` | JWT access token secret | ✅ |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | ✅ |
| `OPENAI_API_KEY` | OpenAI API key | Para moderación |
| `STRIPE_SECRET_KEY` | Stripe secret key | Para pagos |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Para webhooks |

### Frontend Web

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_SOCKET_URL` | WebSocket server URL |

---

## 💻 Desarrollo

### Comandos Principales

```bash
# Desarrollo
npm run dev                 # Todos los servicios
npm run dev:auth           # Solo auth service
npm run dev:web            # Solo web frontend
npm run dev:mobile         # Solo mobile app

# Build
npm run build              # Build todo

# Docker
docker-compose up -d       # Levantar servicios
docker-compose logs -f     # Ver logs
docker-compose down        # Detener servicios

# Prisma
cd services/auth-service
npx prisma generate        # Generar cliente
npx prisma migrate dev     # Crear migración
npx prisma studio          # GUI de base de datos
```

---

## 📚 API Documentation

### Base URL
```
Local: http://localhost:3000/api/v1
```

### Endpoints (49+)

#### Autenticación (6)
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/verify-email`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/refresh`

#### Usuarios (5)
- `GET /users/me`
- `PATCH /users/me`
- `GET /users/me/stats`
- `GET /users/me/limits`
- `DELETE /users/me`

#### Perfiles (5)
- `POST /profiles`
- `GET /profiles/me`
- `PATCH /profiles/me`
- `POST /profiles/me/photos`
- `DELETE /profiles/me/photos`

#### Matching (3)
- `POST /matching/search`
- `DELETE /matching/queue`

#### Chats (7)
- `GET /chats`
- `GET /chats/:id`
- `GET /chats/:id/messages`
- `POST /chats/:id/end`

#### Matches (4)
- `GET /matches`
- `GET /matches/user/:userId`
- `DELETE /matches/:id`

#### Reportes (6)
- `POST /reports`
- `GET /reports/pending`
- `POST /reports/:id/review`

#### Suscripciones (5)
- `POST /subscriptions/checkout`
- `GET /subscriptions/me`
- `POST /subscriptions/cancel`
- `POST /subscriptions/resume`
- `POST /subscriptions/portal`

#### Webhooks (1)
- `POST /webhooks/stripe`

### WebSocket Events (20+)

**Cliente → Servidor:**
- `chat:join`, `chat:leave`, `chat:message`, `chat:typing`
- `matching:join`, `matching:leave`

**Servidor → Cliente:**
- `chat:message`, `chat:typing`, `chat:ended`, `chat:matched`
- `matching:found`, `queue:update`

---

## 🌍 Deployment

### Backend

Recomendado: Railway, Render, o AWS

```bash
cd services/auth-service
npm run build

# Variables de producción
DATABASE_URL=postgresql://...
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://...
JWT_SECRET=<strong-secret>
STRIPE_SECRET_KEY=sk_live_...
```

### Frontend Web

Recomendado: Vercel

```bash
cd apps/web
npm run build

# Variables
NEXT_PUBLIC_API_URL=https://api.erochat.com/api/v1
```

### Mobile App

```bash
cd apps/mobile

# Install EAS CLI
npm install -g eas-cli

# Build
eas build --platform ios
eas build --platform android

# Submit
eas submit --platform ios
eas submit --platform android
```

### Configurar Stripe Webhooks

1. En Stripe Dashboard, crear webhook:
   ```
   https://api.erochat.com/api/v1/webhooks/stripe
   ```

2. Eventos:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

3. Copiar webhook secret a `STRIPE_WEBHOOK_SECRET`

---

## 📊 Métricas del Proyecto

- **Archivos**: 106+
- **Líneas de código**: ~20,000+
  - Backend: ~11,500+
  - Frontend Web: ~5,400+
  - Mobile: ~3,000+
- **Modelos de datos**: 15
- **Servicios backend**: 10
- **Endpoints REST**: 49+
- **WebSocket events**: 20+
- **Páginas Web**: 10
- **Pantallas Mobile**: 7
- **Plataformas**: Web, iOS, Android

---

## 📈 Roadmap

### ✅ Completado (8/24 sprints - 33%)

- **Sprint 1-2**: Auth + Profiles
- **Sprint 3**: Matching Service
- **Sprint 4**: Chat Service
- **Sprint 5**: Match/Reveal System
- **Sprint 6**: Moderation System
- **Sprint 7**: Mobile App (React Native + Expo)
- **Sprint 8**: Monetización (Stripe + Premium)

### 📋 Próximos Sprints

Ver [ROADMAP.md](ROADMAP.md) para el plan completo.

---

## 🤝 Contributing

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/Feature`)
3. Commit tus cambios (`git commit -m 'Add Feature'`)
4. Push a la branch (`git push origin feature/Feature`)
5. Abre un Pull Request

---

## 📝 Licencia

Proprietary - Ero Chat Platform

---

## 👥 Equipo

Desarrollado por Keykpo con Claude Code

---

## 📞 Soporte

- Email: support@erochat.com
- Issues: [GitHub Issues](https://github.com/Keykpo/EROSCHAT/issues)
- Documentation: [ROADMAP.md](ROADMAP.md)

---

**Nota**: Proyecto educacional/portfolio. Asegúrate de cumplir con regulaciones locales sobre contenido adulto antes de implementar en producción.

---

## 🎯 Quick Start

```bash
# 1. Clone
git clone <repo-url>
cd EROSCHAT

# 2. Install
npm install

# 3. Docker
docker-compose up -d

# 4. Setup env
cp services/auth-service/.env.example services/auth-service/.env
# Edit .env with your keys

# 5. Migrate
cd services/auth-service
npx prisma migrate deploy

# 6. Run
npm run dev
```

Visita:
- Web: http://localhost:3001
- API: http://localhost:3000
- Mobile: Expo Go app

---

**Built with ❤️ using TypeScript, React, and Node.js**
