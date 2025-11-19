# 🔥 Ero Chat - Anonymous Erotic Dating App

<div align="center">

**Conexión Mental Antes que Física**

Un chat erótico completamente anónimo donde los usuarios interactúan solo por texto y revelan su identidad visual únicamente cuando ambos deciden hacer match mutuo.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)

[Características](#-características) •
[Documentación](#-documentación) •
[Arquitectura](#-arquitectura) •
[Instalación](#-instalación) •
[Roadmap](#-roadmap)

</div>

---

## 🎯 Visión del Producto

**Ero Chat** revoluciona el dating erótico al priorizar la **conexión mental y química conversacional** antes que la apariencia física. Los usuarios experimentan:

- ✅ **Anonimato total inicial** - Sin fotos, sin prejuicios
- ✅ **Conversaciones auténticas** - Química basada en personalidad
- ✅ **Match consciente** - Revelar identidad solo cuando hay conexión mutua
- ✅ **Seguridad prioritaria** - Moderación activa y herramientas de protección

### 🎪 Audiencia Objetivo

Adultos de 18-45 años que buscan:
- Interacciones eróticas discretas y seguras
- Sexting con personas compatibles
- Citas donde la personalidad importa más que lo físico
- Exploración sexual en un ambiente consensuado

---

## ✨ Características

### Core Features (MVP)

#### 🎭 Matching Anónimo
```
1. Usuario entra en cola → Algoritmo encuentra match compatible
2. Chat temporal de 20 minutos → Solo texto, sin identidad visual
3. Opción de Match → Ambos presionan ❤️ para revelar perfiles
4. Chat permanente → Si hay match, continúa conversación con fotos
```

#### 💬 Chat en Tiempo Real
- WebSocket para mensajes instantáneos
- Indicador de "escribiendo..."
- Extensiones de tiempo (con límites)
- Sistema de auto-expiración de chats

#### 🛡️ Moderación y Seguridad
- IA para detección de contenido inapropiado
- Sistema de reportes y bloqueos
- Verificación de edad estricta (+18)
- Zero-tolerance para contenido ilegal

#### 💎 Modelo Freemium
**Gratis:**
- Chats anónimos ilimitados
- Matching básico
- 1 Rewind por semana

**Premium ($9.99/mes):**
- Peek (ver perfil antes de chatear)
- Filtros avanzados
- Extensiones ilimitadas
- Sin publicidad

**Créditos:**
- Super Likes (5 créditos)
- Boosts (10 créditos)
- Rewind adicional (10 créditos)

---

## 📚 Documentación

Este proyecto incluye documentación completa y profesional:

| Documento | Descripción |
|-----------|-------------|
| **[PRODUCT_DESIGN_SPECIFICATION.md](./PRODUCT_DESIGN_SPECIFICATION.md)** | Especificación completa del producto: visión, MVP, modelo de negocio, seguridad, ética |
| **[TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)** | Arquitectura técnica detallada: stack, microservicios, APIs, base de datos, deployment |
| **README.md** (este archivo) | Resumen ejecutivo y guía de inicio rápido |

### 📖 Contenido de la Documentación

#### Product Design Specification
- 🎯 Visión y propuesta de valor
- 🏗️ Arquitectura de sistema (diagramas incluidos)
- 💻 Stack tecnológico con justificaciones
- 🚀 Funcionalidades MVP detalladas
- 💰 Modelo de negocio y monetización
- 🔒 Seguridad y cumplimiento (GDPR, CCPA)
- ⚖️ Consideraciones éticas
- 🗓️ Roadmap de implementación

#### Technical Architecture
- Stack completo (Frontend, Backend, Databases)
- Estructura de microservicios
- Esquemas de base de datos (Prisma, MongoDB, Redis)
- API Specification completa
- Real-time architecture (WebSockets)
- Security & Infrastructure
- CI/CD y deployment

---

## 🏗️ Arquitectura

### Stack Tecnológico

#### Frontend
```
Web:       Next.js 14 + TypeScript + Tailwind CSS
Mobile:    Swift (iOS) + Kotlin (Android)
State:     Zustand + TanStack Query
Real-time: Socket.io-client
```

#### Backend
```
Core:      Node.js 20 + Express + TypeScript
ML:        Python 3.11 + FastAPI
Real-time: Socket.io
ORM:       Prisma
Queue:     RabbitMQ / AWS SQS
```

#### Databases
```
Primary:   PostgreSQL 15 (users, matches, payments)
Cache:     Redis 7 (sessions, presence, queue)
Chat:      MongoDB 6 (messages, logs)
Media:     AWS S3 + CloudFront CDN
Search:    Elasticsearch
```

#### Infrastructure
```
Cloud:     AWS (ECS, RDS, ElastiCache)
IaC:       Terraform
CI/CD:     GitHub Actions
Monitor:   Datadog, Sentry
```

### Arquitectura de Microservicios

```
┌─────────────────────────────────────────────────────────┐
│                   API Gateway (Kong)                    │
└─────────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│Auth Service  │ │Chat Service  │ │User Service  │
│  (Node.js)   │ │  (Node.js)   │ │  (Node.js)   │
└──────────────┘ └──────────────┘ └──────────────┘
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│Matching Svc  │ │Moderation Svc│ │Payment Svc   │
│  (Python)    │ │  (Python)    │ │  (Node.js)   │
└──────────────┘ └──────────────┘ └──────────────┘
                        │
        ┌───────────────┴───────────────┐
        ▼                               ▼
┌──────────────┐              ┌──────────────┐
│ Message Queue│              │   Databases  │
│  (RabbitMQ)  │              │ PostgreSQL   │
└──────────────┘              │ MongoDB      │
                              │ Redis        │
                              └──────────────┘
```

---

## 🚀 Instalación

### Prerrequisitos

```bash
Node.js >= 20.0.0
npm >= 10.0.0
Docker >= 24.0.0
PostgreSQL >= 15
MongoDB >= 6
Redis >= 7
```

### Setup Local (Desarrollo)

#### 1. Clonar el repositorio
```bash
git clone https://github.com/your-org/erochat-platform.git
cd erochat-platform
```

#### 2. Instalar dependencias
```bash
# Root
npm install

# Services
cd services/auth-service && npm install
cd ../chat-service && npm install
cd ../matching-service && pip install -r requirements.txt
```

#### 3. Configurar variables de entorno
```bash
# Copiar ejemplo
cp .env.example .env

# Editar con tus credenciales
nano .env
```

Configuración mínima:
```env
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/erochat
MONGODB_URL=mongodb://localhost:27017/erochat
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-change-this
```

#### 4. Iniciar bases de datos con Docker
```bash
docker-compose up -d postgres mongodb redis
```

#### 5. Ejecutar migraciones
```bash
cd services/auth-service
npx prisma migrate dev
```

#### 6. Iniciar servicios

**Terminal 1: Auth Service**
```bash
cd services/auth-service
npm run dev
# Runs on http://localhost:3001
```

**Terminal 2: Chat Service**
```bash
cd services/chat-service
npm run dev
# Runs on http://localhost:3002
```

**Terminal 3: Matching Service**
```bash
cd services/matching-service
uvicorn app.main:app --reload --port 3003
# Runs on http://localhost:3003
```

**Terminal 4: Frontend (Web)**
```bash
cd apps/web
npm run dev
# Runs on http://localhost:3000
```

#### 7. Acceder a la aplicación

Abre tu navegador en: **http://localhost:3000**

---

## 🧪 Testing

### Unit Tests
```bash
npm run test:unit
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

### Coverage
```bash
npm run test:coverage
```

---

## 📦 Deployment

### Staging
```bash
# Automático en push a rama 'develop'
git push origin develop
```

### Production
```bash
# Automático en push a rama 'main'
git push origin main
```

### Manual Deployment
```bash
# Build Docker images
docker build -t erochat/auth-service:latest ./services/auth-service
docker build -t erochat/chat-service:latest ./services/chat-service

# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker tag erochat/auth-service:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/erochat/auth-service:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/erochat/auth-service:latest
```

---

## 🗓️ Roadmap

### ✅ Fase 1: MVP (Meses 1-4)
- [x] Arquitectura y stack definidos
- [x] Documentación completa
- [ ] Setup de infraestructura
- [ ] Autenticación y registro
- [ ] Sistema de matching
- [ ] Chat en tiempo real
- [ ] Moderación básica

### 🚧 Fase 2: Lanzamiento Público (Meses 5-6)
- [ ] Apps móviles (iOS + Android)
- [ ] Testing exhaustivo
- [ ] Beta cerrada (100 usuarios)
- [ ] Lanzamiento en ciudad piloto

### 📅 Fase 3: Monetización (Meses 7-9)
- [ ] Tier Premium
- [ ] Sistema de créditos
- [ ] Integración con Stripe
- [ ] Publicidad para tier free

### 🚀 Fase 4: Expansión (Meses 10-12)
- [ ] Contenido temporal (self-destruct media)
- [ ] ML mejorado para matching
- [ ] Verificación de perfil
- [ ] Internacionalización

### 🌟 Post-MVP (Año 2+)
- [ ] Videollamadas anónimas
- [ ] E2E encryption (Signal Protocol)
- [ ] IA conversacional
- [ ] VR/AR experiences

---

## 🤝 Contribuir

Este es un proyecto privado en desarrollo. Si eres parte del equipo:

1. Crea una rama desde `develop`:
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/nombre-feature
   ```

2. Haz tus cambios y commit:
   ```bash
   git add .
   git commit -m "feat: descripción del feature"
   ```

3. Push y crea Pull Request:
   ```bash
   git push origin feature/nombre-feature
   ```

### Convención de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nueva característica
fix: corrección de bug
docs: cambios en documentación
style: formateo, punto y coma faltante, etc
refactor: refactorización de código
test: agregar tests
chore: actualizar dependencias, configuración
```

---

## 📄 Licencia

**Propiedad Privada - Todos los Derechos Reservados**

Este proyecto y su código son propiedad privada de [Nombre de la Empresa]. No se permite el uso, copia, modificación o distribución sin autorización explícita.

---

## 📞 Contacto

**Equipo de Desarrollo:**
- Tech Lead: [nombre@erochat.com](mailto:nombre@erochat.com)
- Product Manager: [pm@erochat.com](mailto:pm@erochat.com)

**Links:**
- Website: [https://erochat.com](https://erochat.com)
- Documentación: [https://docs.erochat.com](https://docs.erochat.com)
- Status: [https://status.erochat.com](https://status.erochat.com)

---

## 🙏 Agradecimientos

Este proyecto ha sido diseñado con las mejores prácticas de la industria, siguiendo estándares de:
- **OWASP** para seguridad
- **GDPR/CCPA** para privacidad
- **AWS Well-Architected Framework** para infraestructura
- **12 Factor App** para arquitectura de servicios

---

<div align="center">

**Hecho con ❤️ por el equipo de Ero Chat**

[⬆ Volver arriba](#-ero-chat---anonymous-erotic-dating-app)

</div>
