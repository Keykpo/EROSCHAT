# 🗺️ Ero Chat - Roadmap de Implementación

## Documento de Planificación de Desarrollo

**Versión:** 1.0
**Última actualización:** 19 de Noviembre, 2025
**Horizonte temporal:** 12 meses (MVP a lanzamiento)

---

## 📋 Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Metodología y Principios](#metodología-y-principios)
3. [Pre-Desarrollo (Semanas -4 a 0)](#pre-desarrollo-semanas--4-a-0)
4. [Fase 1: Fundaciones (Semanas 1-8)](#fase-1-fundaciones-semanas-1-8)
5. [Fase 2: Core MVP (Semanas 9-16)](#fase-2-core-mvp-semanas-9-16)
6. [Fase 3: Testing y Refinamiento (Semanas 17-20)](#fase-3-testing-y-refinamiento-semanas-17-20)
7. [Fase 4: Lanzamiento Beta (Semanas 21-24)](#fase-4-lanzamiento-beta-semanas-21-24)
8. [Fase 5: Monetización (Semanas 25-32)](#fase-5-monetización-semanas-25-32)
9. [Fase 6: Escalamiento (Semanas 33-48)](#fase-6-escalamiento-semanas-33-48)
10. [Recursos y Equipo](#recursos-y-equipo)
11. [Budget Estimado](#budget-estimado)
12. [Riesgos y Mitigación](#riesgos-y-mitigación)

---

## 📊 Resumen Ejecutivo

### Timeline General

```
Mes 0  │ Pre-Desarrollo (Setup, Legal, Diseño)
───────┼────────────────────────────────────────────────
Mes 1-2│ Fundaciones (Infra, Auth, DB)
───────┼────────────────────────────────────────────────
Mes 3-4│ Core MVP (Matching, Chat, Moderación)
───────┼────────────────────────────────────────────────
Mes 5  │ Testing y Refinamiento
───────┼────────────────────────────────────────────────
Mes 6  │ Beta Cerrada
───────┼────────────────────────────────────────────────
Mes 7-8│ Monetización (Premium, Payments)
───────┼────────────────────────────────────────────────
Mes 9-12│ Escalamiento y Expansión
```

### Milestones Críticos

| Milestone | Fecha Objetivo | Entregable |
|-----------|---------------|------------|
| 🎯 M0: Kickoff | Semana 0 | Equipo contratado, infra lista |
| 🎯 M1: Auth Ready | Semana 4 | Login/registro funcionando |
| 🎯 M2: First Match | Semana 10 | Primer matching exitoso |
| 🎯 M3: First Chat | Semana 12 | Chat en tiempo real funcionando |
| 🎯 M4: MVP Complete | Semana 16 | Todas las features core listas |
| 🎯 M5: Beta Launch | Semana 24 | 100 usuarios en beta |
| 🎯 M6: Payment Live | Semana 28 | Primera suscripción Premium |
| 🎯 M7: Public Launch | Semana 32 | Lanzamiento público |

---

## 🎯 Metodología y Principios

### Enfoque de Desarrollo

**Metodología:** Agile/Scrum con sprints de 2 semanas

**Principios:**
- ✅ **MVP First**: Construir lo mínimo viable, iterar rápido
- ✅ **User-Centric**: Testing con usuarios reales cada 2 sprints
- ✅ **Security by Design**: Seguridad desde el día 1, no como afterthought
- ✅ **Continuous Deployment**: Deploy a staging en cada merge
- ✅ **Data-Driven**: Métricas desde el primer día

### Priorización: MoSCoW Method

- **Must Have**: Crítico para MVP, blocker si no está
- **Should Have**: Importante pero no crítico
- **Could Have**: Deseable si hay tiempo
- **Won't Have (now)**: Fuera de scope para MVP

---

## 🏗️ Pre-Desarrollo (Semanas -4 a 0)

**Duración:** 4 semanas
**Objetivo:** Preparar todo lo necesario antes de escribir código

### Semana -4: Setup Legal y Compliance

#### Tareas
- [ ] **Consulta legal especializada** (8h)
  - Contratar abogado con experiencia en apps adultas
  - Review de modelo de negocio vs. regulaciones
  - Identificar jurisdicciones objetivo

- [ ] **Documentos legales** (24h)
  - Términos de Servicio
  - Privacy Policy (GDPR/CCPA compliant)
  - Community Guidelines
  - Cookie Policy
  - DMCA Policy

- [ ] **Estructura corporativa** (16h)
  - Registrar empresa (LLC, Inc, etc.)
  - Abrir cuenta bancaria business
  - Setup de contabilidad (QuickBooks/similar)

#### Entregables
✅ Empresa registrada
✅ Documentos legales aprobados por abogado
✅ Lista de compliance requirements por jurisdicción

---

### Semana -3: Diseño UX/UI

#### Tareas
- [ ] **Research de competencia** (16h)
  - Análisis de Tinder, Bumble, Feeld, Pure
  - Identificar pain points en apps existentes
  - Documentar best practices de UX

- [ ] **User Personas** (8h)
  - Crear 3-5 user personas detalladas
  - User journey maps
  - Pain points y motivaciones

- [ ] **Wireframes** (40h)
  - Onboarding flow (5 pantallas)
  - Matching flow (3 pantallas)
  - Chat interface (2 pantallas)
  - Profile setup (4 pantallas)
  - Settings (2 pantallas)

- [ ] **Design System** (24h)
  - Color palette
  - Typography
  - Iconography
  - Component library (buttons, inputs, cards)

#### Entregables
✅ Figma con 20+ pantallas wireframed
✅ Design system documentado
✅ Clickable prototype básico

---

### Semana -2: Arquitectura y Planning Técnico

#### Tareas
- [ ] **Technical Specification Review** (8h)
  - Review completo de TECHNICAL_ARCHITECTURE.md
  - Validar stack tecnológico
  - Identificar gaps o riesgos técnicos

- [ ] **Infrastructure Planning** (16h)
  - Diseñar arquitectura AWS (VPC, subnets, security groups)
  - Plan de CI/CD pipelines
  - Estrategia de environments (dev, staging, prod)

- [ ] **Database Design Detallado** (16h)
  - Finalizar todos los schemas de Prisma
  - Índices y optimizaciones
  - Migration strategy

- [ ] **API Contract Definition** (16h)
  - OpenAPI/Swagger specs completos
  - Request/Response examples
  - Error handling standards

#### Entregables
✅ Terraform configs listas
✅ Prisma schemas finalizados
✅ OpenAPI spec completo
✅ ADRs (Architecture Decision Records) documentados

---

### Semana -1: Setup de Infraestructura Base

#### Tareas
- [ ] **AWS Account Setup** (4h)
  - Crear cuenta AWS
  - Setup de IAM users/roles
  - Enable CloudTrail, GuardDuty

- [ ] **Provision Infrastructure** (16h)
  - Run Terraform para crear VPC, RDS, ElastiCache
  - Setup de S3 buckets (media, backups)
  - Configure CloudFront CDN

- [ ] **CI/CD Pipeline** (16h)
  - GitHub Actions workflows
  - Docker registry (ECR)
  - Staging environment auto-deploy

- [ ] **Monitoring Setup** (8h)
  - Datadog account y agent
  - Sentry para error tracking
  - Setup de alertas básicas

#### Entregables
✅ AWS infrastructure provisionada
✅ CI/CD funcionando (hello world app)
✅ Monitoring dashboards configurados

---

### Semana 0: Contratación y Onboarding

#### Tareas
- [ ] **Contratar equipo core** (40h de recruiting)
  - 2x Full-Stack Engineers (Node.js/React)
  - 1x Backend Engineer (Python/ML)
  - 1x Mobile Engineer (Swift o Kotlin)
  - 1x DevOps Engineer
  - 1x QA Engineer
  - 1x Product Manager (puede ser fundador)

- [ ] **Onboarding técnico** (16h)
  - Setup de dev environments
  - Access a repos, AWS, tools
  - Architecture walkthrough

- [ ] **Sprint Planning** (4h)
  - Definir sprints 1-4
  - Estimar story points
  - Asignar tareas

#### Entregables
✅ Equipo contratado y onboarded
✅ Backlog de 8 semanas priorizado
✅ Development kickoff completado

---

## 🚀 Fase 1: Fundaciones (Semanas 1-8)

**Duración:** 8 semanas (4 sprints de 2 semanas)
**Objetivo:** Construir la base técnica sólida

---

### Sprint 1 (Semanas 1-2): Monorepo Setup + Auth Service

#### Epic 1.1: Project Setup
**Priority:** Must Have
**Story Points:** 13

**User Stories:**
- [ ] **US-001**: Como developer, quiero un monorepo estructurado para trabajar eficientemente
  - Setup de Turborepo o Nx
  - Configurar shared types y utils
  - Linting y formatting (ESLint, Prettier)
  - Pre-commit hooks (Husky)
  - **Estimación:** 8h

- [ ] **US-002**: Como developer, quiero un ambiente de desarrollo local
  - Docker Compose para DBs locales
  - Scripts de seed data
  - Hot reload configurado
  - **Estimación:** 8h

#### Epic 1.2: Authentication Service
**Priority:** Must Have
**Story Points:** 21

**User Stories:**
- [ ] **US-003**: Como usuario, quiero registrarme con email y contraseña
  - POST /api/v1/auth/register endpoint
  - Validación con Zod
  - Hash password con bcrypt
  - Send verification email
  - **Estimación:** 12h
  - **Tests:** Unit + Integration

- [ ] **US-004**: Como usuario, quiero verificar mi email
  - POST /api/v1/auth/verify-email endpoint
  - Token generation y validación
  - Email template (SendGrid/similar)
  - **Estimación:** 8h

- [ ] **US-005**: Como usuario, quiero hacer login
  - POST /api/v1/auth/login endpoint
  - JWT generation (access + refresh tokens)
  - Redis para refresh token storage
  - **Estimación:** 10h

- [ ] **US-006**: Como usuario, quiero recuperar mi contraseña
  - POST /api/v1/auth/forgot-password
  - POST /api/v1/auth/reset-password
  - Email con reset link
  - **Estimación:** 8h

#### Tareas Técnicas
- [ ] Setup Prisma con PostgreSQL (6h)
- [ ] Implementar JWT middleware (4h)
- [ ] Rate limiting con Redis (4h)
- [ ] Email service abstraction (4h)
- [ ] Unit tests (auth service) (8h)
- [ ] Integration tests (8h)

#### Definition of Done
✅ Todos los endpoints funcionando
✅ Tests con >80% coverage
✅ Documentación API actualizada
✅ Security review aprobado
✅ Deploy a staging exitoso

---

### Sprint 2 (Semanas 3-4): User Profile Service + Frontend Base

#### Epic 2.1: User Profile Management
**Priority:** Must Have
**Story Points:** 21

**User Stories:**
- [ ] **US-007**: Como usuario nuevo, quiero crear mi perfil anónimo
  - POST /api/v1/profiles endpoint
  - Campos: username, gender, interestedIn, location, interests
  - Validación de uniqueness (username)
  - **Estimación:** 10h

- [ ] **US-008**: Como usuario, quiero actualizar mi perfil
  - PATCH /api/v1/profiles/me endpoint
  - Partial updates permitidos
  - Validación de cambios (no cambiar username muy frecuente)
  - **Estimación:** 8h

- [ ] **US-009**: Como usuario, quiero subir fotos de perfil
  - POST /api/v1/profiles/me/photos endpoint
  - Upload directo a S3 con pre-signed URLs
  - Image resizing (Sharp library)
  - Max 6 photos
  - **Estimación:** 12h

- [ ] **US-010**: Como usuario, quiero configurar mis preferencias de matching
  - Preferences: minAge, maxAge, maxDistance, lookingFor
  - Guardar en DB (JSON field)
  - **Estimación:** 6h

#### Epic 2.2: Frontend Base (Next.js)
**Priority:** Must Have
**Story Points:** 21

**User Stories:**
- [ ] **US-011**: Como usuario, quiero ver una landing page atractiva
  - Hero section
  - Features section
  - CTA buttons
  - Responsive design
  - **Estimación:** 12h

- [ ] **US-012**: Como usuario, quiero registrarme desde la web
  - Formulario de registro con validación
  - Integración con API auth
  - Error handling
  - Success state (check email)
  - **Estimación:** 10h

- [ ] **US-013**: Como usuario, quiero hacer login
  - Login form
  - Token storage (httpOnly cookies)
  - Redirect a home después de login
  - **Estimación:** 8h

- [ ] **US-014**: Como usuario, quiero un onboarding flow
  - Multi-step form (3 pasos)
    1. Datos básicos (género, edad)
    2. Preferencias (quién buscas)
    3. Intereses (tags)
  - Progress indicator
  - **Estimación:** 16h

#### Tareas Técnicas
- [ ] Setup Next.js 14 con App Router (4h)
- [ ] Tailwind CSS + shadcn/ui setup (4h)
- [ ] Zustand store para auth (4h)
- [ ] React Query setup (4h)
- [ ] Auth context y protected routes (6h)
- [ ] Image upload component (8h)
- [ ] E2E tests con Playwright (8h)

#### Definition of Done
✅ Profile CRUD completo
✅ Frontend conectado a backend
✅ Onboarding flow completable
✅ Tests E2E pasando
✅ Responsive en mobile/desktop

---

### Sprint 3 (Semanas 5-6): Matching Service Foundation

#### Epic 3.1: Matching Algorithm
**Priority:** Must Have
**Story Points:** 34

**User Stories:**
- [ ] **US-015**: Como usuario, quiero entrar en cola de matching
  - POST /api/v1/matching/join-queue endpoint
  - Agregar a Redis sorted set por región/género
  - Return queue position y estimated wait time
  - **Estimación:** 12h

- [ ] **US-016**: Como sistema, quiero emparejar usuarios compatibles
  - Background worker (BullMQ)
  - Algoritmo de matching v1:
    - Filtros geográficos
    - Filtros de edad
    - Interés en género mutuo
    - Excluir ya chateados
  - **Estimación:** 20h

- [ ] **US-017**: Como usuario, quiero salir de la cola
  - DELETE /api/v1/matching/leave-queue
  - Cleanup de Redis
  - **Estimación:** 4h

- [ ] **US-018**: Como usuario, quiero saber mi estado en la cola
  - GET /api/v1/matching/status
  - WebSocket notification cuando se encuentra match
  - **Estimación:** 8h

#### Epic 3.2: Matching Service (Python/FastAPI)
**Priority:** Must Have
**Story Points:** 21

**Tareas:**
- [ ] Setup FastAPI project (4h)
- [ ] Implementar algoritmo de scoring (12h)
  - Compatibilidad por intereses
  - Distance calculation (haversine)
  - Preferencias mutuas
- [ ] Redis integration para queue management (8h)
- [ ] Endpoint: POST /match/find (6h)
- [ ] Unit tests (algoritmo) (8h)
- [ ] Load testing (1000 concurrent users) (4h)

#### Epic 3.3: Frontend - Matching UI
**Priority:** Must Have
**Story Points:** 13

**User Stories:**
- [ ] **US-019**: Como usuario, quiero buscar un chat
  - Button "Buscar Chat"
  - Loading spinner con mensajes motivacionales
  - Manejo de timeout (60s)
  - **Estimación:** 8h

- [ ] **US-020**: Como usuario, quiero saber cuando se encuentra match
  - WebSocket listener
  - Notificación visual + sonido
  - Auto-redirect a chat
  - **Estimación:** 8h

#### Definition of Done
✅ Matching funcional (find match en <60s)
✅ Queue management eficiente
✅ Tests de carga pasados (1000 users)
✅ Frontend conectado vía WebSocket
✅ Métricas de matching siendo logged

---

### Sprint 4 (Semanas 7-8): Chat Service Foundation

#### Epic 4.1: Chat Backend (WebSockets)
**Priority:** Must Have
**Story Points:** 34

**User Stories:**
- [ ] **US-021**: Como usuario, quiero unirme a un chat anónimo
  - WebSocket connection con autenticación
  - Socket event: chat:join
  - Create chat room (Socket.io rooms)
  - Save chat to MongoDB
  - **Estimación:** 12h

- [ ] **US-022**: Como usuario, quiero enviar mensajes de texto
  - Socket event: message:send
  - Content moderation (OpenAI Moderation API)
  - Rate limiting (30 msgs/min)
  - Save to MongoDB
  - Broadcast a room
  - **Estimación:** 16h

- [ ] **US-023**: Como usuario, quiero ver indicador de "escribiendo"
  - Socket events: typing:start, typing:stop
  - Broadcast a otros en el chat
  - **Estimación:** 6h

- [ ] **US-024**: Como sistema, quiero auto-terminar chats después de 20 min
  - Background job (cron)
  - Check chats con endsAt < now
  - Emit chat:ended event
  - Update status en DB
  - **Estimación:** 8h

#### Epic 4.2: Chat Frontend
**Priority:** Must Have
**Story Points:** 34

**User Stories:**
- [ ] **US-025**: Como usuario, quiero ver la UI del chat
  - Chat interface con mensajes
  - Avatares anónimos (colores)
  - Timer countdown (20:00)
  - Input field con send button
  - **Estimación:** 16h

- [ ] **US-026**: Como usuario, quiero enviar y recibir mensajes en tiempo real
  - Socket.io-client integration
  - Optimistic updates
  - Error handling
  - Message delivery confirmation
  - **Estimación:** 12h

- [ ] **US-027**: Como usuario, quiero ver cuando la otra persona escribe
  - Listen typing:user_typing event
  - Show "Anon_Blue está escribiendo..."
  - **Estimación:** 4h

- [ ] **US-028**: Como usuario, quiero extender el tiempo del chat
  - Button "Extender +10 min"
  - Solicitar confirmación del otro usuario
  - Update timer UI
  - **Estimación:** 8h

#### Tareas Técnicas
- [ ] Setup Socket.io server (6h)
- [ ] MongoDB schemas para chats y messages (4h)
- [ ] Socket.io authentication middleware (4h)
- [ ] Message queue para processing async (8h)
- [ ] Frontend: Socket connection manager (6h)
- [ ] Frontend: Message list virtualization (4h)
- [ ] Integration tests (chat flow) (12h)
- [ ] Performance testing (100 concurrent chats) (4h)

#### Definition of Done
✅ Chat en tiempo real funcionando
✅ Mensajes siendo guardados y recuperados
✅ Timer funcionando correctamente
✅ Tests de concurrencia pasados
✅ Error handling robusto

---

## 🎯 Fase 2: Core MVP (Semanas 9-16)

**Duración:** 8 semanas (4 sprints)
**Objetivo:** Completar todas las features críticas del MVP

---

### Sprint 5 (Semanas 9-10): Match/Reveal System

#### Epic 5.1: Match Logic
**Priority:** Must Have
**Story Points:** 34

**User Stories:**
- [ ] **US-029**: Como usuario, quiero solicitar hacer match
  - Button "❤️ Quiero hacer Match" en chat
  - Socket event: match:request
  - Save request en DB
  - Notificar a otro usuario
  - **Estimación:** 8h

- [ ] **US-030**: Como usuario, quiero aceptar/rechazar una solicitud de match
  - Popup de confirmación
  - Opciones: Aceptar / Rechazar
  - Socket events: match:accept, match:reject
  - **Estimación:** 8h

- [ ] **US-031**: Como sistema, quiero revelar perfiles al hacer match
  - Fetch full profiles de ambos usuarios
  - Unlock photos
  - Create Match record en DB
  - Emit match:success event
  - **Estimación:** 10h

- [ ] **US-032**: Como usuario, quiero ver el perfil revelado después de match
  - Modal de celebración "🎉 Es un Match!"
  - Mostrar fotos y bio de ambos usuarios
  - Chat se convierte en permanente
  - **Estimación:** 12h

- [ ] **US-033**: Como usuario, quiero que el chat termine si no hay match
  - Handle match:failed event
  - Mostrar "No hubo match esta vez"
  - Opción: "Buscar Nuevo Chat"
  - Block future matching con esa persona
  - **Estimación:** 8h

#### Epic 5.2: Matches List
**Priority:** Must Have
**Story Points:** 13

**User Stories:**
- [ ] **US-034**: Como usuario, quiero ver mis matches activos
  - GET /api/v1/matches endpoint
  - Lista de matches con fotos y last message
  - Click para abrir chat
  - **Estimación:** 10h

- [ ] **US-035**: Como usuario, quiero unmatch con alguien
  - DELETE /api/v1/matches/:matchId
  - Confirmación "¿Estás seguro?"
  - Block future matching
  - **Estimación:** 6h

#### Tareas Técnicas
- [ ] Match service endpoints (8h)
- [ ] WebSocket events para matching (6h)
- [ ] Frontend: Match modal UI (8h)
- [ ] Frontend: Matches list component (8h)
- [ ] Integration tests (match flow) (8h)

#### Definition of Done
✅ Match flow completo funcionando
✅ Reveal de perfiles correcto
✅ Unmatch funcionando
✅ Tests E2E pasando

---

### Sprint 6 (Semanas 11-12): Moderation System

#### Epic 6.1: Content Moderation
**Priority:** Must Have
**Story Points:** 34

**User Stories:**
- [ ] **US-036**: Como sistema, quiero moderar mensajes automáticamente
  - Integration con OpenAI Moderation API
  - Categorías: sexual/minors, hate, harassment, violence
  - Block message si flagged
  - Log para review manual
  - **Estimación:** 12h

- [ ] **US-037**: Como sistema, quiero moderar imágenes
  - Integration con AWS Rekognition
  - Detect: nudity, violence, weapons
  - Detect age (block if <18 detected)
  - **Estimación:** 12h

- [ ] **US-038**: Como sistema, quiero aplicar rate limiting agresivo
  - Redis-based rate limiting
  - Limites:
    - Messages: 30/min
    - Reports: 5/hour
    - API calls: 100/min
  - **Estimación:** 8h

#### Epic 6.2: User Reports
**Priority:** Must Have
**Story Points:** 21

**User Stories:**
- [ ] **US-039**: Como usuario, quiero reportar contenido inapropiado
  - POST /api/v1/reports endpoint
  - Razones: inappropriate, spam, harassment, fake, underage, other
  - Incluir context (últimos 10 mensajes)
  - **Estimación:** 8h

- [ ] **US-040**: Como usuario, quiero bloquear a otro usuario
  - POST /api/v1/users/:userId/block
  - Prevenir future matches
  - Hide de matches list
  - **Estimación:** 6h

- [ ] **US-041**: Como moderador, quiero revisar reportes
  - Admin dashboard (basic)
  - Lista de reportes pending
  - Actions: approve, warn, suspend, ban
  - **Estimación:** 16h

#### Epic 6.3: Moderation Dashboard (Admin)
**Priority:** Should Have
**Story Points:** 21

**Tareas:**
- [ ] Admin auth (separate from user auth) (4h)
- [ ] Reports queue UI (12h)
- [ ] User detail view (8h)
- [ ] Ban/suspend actions (8h)
- [ ] Moderation logs (4h)

#### Definition of Done
✅ Moderación automática funcionando
✅ Reportes siendo guardados
✅ Bloqueo funcionando
✅ Admin dashboard básico operativo
✅ False positive rate <5%

---

### Sprint 7 (Semanas 13-14): Mobile Apps (iOS Foundation)

#### Epic 7.1: iOS App Base
**Priority:** Must Have
**Story Points:** 55

**Tareas:**
- [ ] Setup Xcode project (SwiftUI) (4h)
- [ ] Networking layer (Alamofire) (8h)
- [ ] Socket.io integration (8h)
- [ ] Authentication flow (16h)
  - Login screen
  - Register screen
  - Email verification
  - Token storage (Keychain)
- [ ] Onboarding flow (12h)
  - Same as web: 3 steps
  - SwiftUI forms
- [ ] Profile screen (12h)
  - View profile
  - Edit profile
  - Photo upload (camera + gallery)
- [ ] Navigation setup (TabView) (4h)

#### Epic 7.2: iOS - Matching & Chat
**Priority:** Must Have
**Story Points:** 34

**Tareas:**
- [ ] Matching screen (10h)
  - "Buscar Chat" button
  - Queue loading state
  - Match found animation
- [ ] Chat UI (SwiftUI) (16h)
  - Message list
  - Input field
  - Send button
  - Typing indicator
  - Timer
- [ ] Socket connection manager (8h)
- [ ] Push notifications setup (APNS) (6h)

#### Epic 7.3: iOS - Match Flow
**Priority:** Must Have
**Story Points:** 21

**Tareas:**
- [ ] Match request UI (8h)
- [ ] Match success modal (8h)
- [ ] Matches list (8h)

#### Definition of Done
✅ iOS app funcional con todas las features core
✅ Conectada a backend staging
✅ TestFlight build lista
✅ No crashes en testing

---

### Sprint 8 (Semanas 15-16): Mobile Apps (Android) + Polish

#### Epic 8.1: Android App
**Priority:** Must Have
**Story Points:** 55

**Tareas:**
- [ ] Setup Android Studio (Jetpack Compose) (4h)
- [ ] Networking (Retrofit) (8h)
- [ ] Socket.io integration (8h)
- [ ] Authentication flow (16h)
- [ ] Onboarding flow (12h)
- [ ] Profile screen (12h)
- [ ] Matching screen (10h)
- [ ] Chat UI (16h)
- [ ] Match flow (12h)
- [ ] Push notifications (FCM) (6h)

#### Epic 8.2: Cross-Platform Polish
**Priority:** Must Have
**Story Points:** 21

**Tareas:**
- [ ] Consistent UX across web/iOS/Android (12h)
- [ ] Error messages estandarizados (4h)
- [ ] Loading states polish (4h)
- [ ] Accessibility audit (8h)

#### Epic 8.3: Performance Optimization
**Priority:** Should Have
**Story Points:** 13

**Tareas:**
- [ ] Backend: DB query optimization (8h)
- [ ] Frontend: Code splitting (4h)
- [ ] Images: WebP conversion + lazy loading (4h)
- [ ] API: Response caching (4h)

#### Definition of Done
✅ Android app funcional
✅ 3 plataformas (web/iOS/Android) feature parity
✅ Performance metrics buenas (TTI <3s)
✅ Lighthouse score >90

---

## 🧪 Fase 3: Testing y Refinamiento (Semanas 17-20)

**Duración:** 4 semanas (2 sprints)
**Objetivo:** Testing exhaustivo y corrección de bugs

---

### Sprint 9 (Semanas 17-18): Quality Assurance

#### Epic 9.1: Testing Comprehensivo
**Priority:** Must Have
**Story Points:** 55

**Tareas:**
- [ ] **Unit tests** (completar coverage >80%) (16h)
  - Auth service
  - Profile service
  - Matching algorithm
  - Chat service

- [ ] **Integration tests** (20h)
  - Flujo completo: registro → match → chat → reveal
  - Payment flows (mock Stripe)
  - Moderation flows

- [ ] **E2E tests** (Playwright/Detox) (24h)
  - Happy paths (15 scenarios)
  - Edge cases (10 scenarios)
  - Error scenarios (10 scenarios)

- [ ] **Performance testing** (16h)
  - Load test: 1000 concurrent users
  - Stress test: 5000 concurrent users
  - Spike test (sudden traffic)
  - Endurance test (24h sustained load)

- [ ] **Security testing** (16h)
  - Penetration testing (contratar firma externa)
  - OWASP Top 10 check
  - SQL injection attempts
  - XSS attempts
  - CSRF protection validation

#### Epic 9.2: Bug Fixing
**Priority:** Must Have
**Story Points:** 34

**Proceso:**
1. Bug triage daily
2. Severity classification (P0-P3)
3. Fix all P0/P1 bugs
4. Fix critical P2 bugs
5. Log P3 bugs para post-MVP

**Estimación:** 80h (2 engineers x 40h)

#### Epic 9.3: User Acceptance Testing (UAT)
**Priority:** Must Have
**Story Points:** 21

**Tareas:**
- [ ] Recruiting de 20 testers (4h)
- [ ] Crear test scripts (8h)
- [ ] Sesiones de testing moderadas (20h)
- [ ] Recopilación de feedback (8h)
- [ ] Análisis y priorización de cambios (8h)

#### Definition of Done
✅ Test coverage >80%
✅ Todos los tests pasando
✅ P0/P1 bugs: 0
✅ Security audit aprobado
✅ UAT feedback incorporado

---

### Sprint 10 (Semanas 19-20): Pre-Launch Preparation

#### Epic 10.1: Legal & Compliance Final Review
**Priority:** Must Have
**Story Points:** 13

**Tareas:**
- [ ] Final legal review (8h)
- [ ] Age verification strengthening (8h)
- [ ] Privacy Policy update (4h)
- [ ] GDPR/CCPA compliance check (8h)
- [ ] Data export functionality (GDPR requirement) (8h)
- [ ] Account deletion functionality (8h)

#### Epic 10.2: App Store Preparation
**Priority:** Must Have
**Story Points:** 21

**Tareas:**
- [ ] **iOS App Store** (16h)
  - App metadata (description, keywords, screenshots)
  - App Store Connect setup
  - Privacy nutrition label
  - Age rating (17+)
  - Submit for review

- [ ] **Google Play Store** (16h)
  - Store listing
  - Screenshots y videos
  - Content rating questionnaire
  - Submit for review

#### Epic 10.3: Marketing Assets
**Priority:** Should Have
**Story Points:** 21

**Tareas:**
- [ ] Landing page optimization (12h)
- [ ] Social media assets (8h)
- [ ] Press kit (8h)
- [ ] Demo video (12h)

#### Epic 10.4: Analytics & Monitoring
**Priority:** Must Have
**Story Points:** 13

**Tareas:**
- [ ] Mixpanel events tracking (8h)
- [ ] Custom dashboards (Datadog) (6h)
- [ ] Alerts setup (on-call rotation) (4h)
- [ ] Error budget definition (2h)

#### Definition of Done
✅ App Store submissions aprobadas
✅ Legal compliance 100%
✅ Analytics tracking completo
✅ Monitoring robusto
✅ Marketing assets listos

---

## 🚀 Fase 4: Lanzamiento Beta (Semanas 21-24)

**Duración:** 4 semanas (2 sprints)
**Objetivo:** Beta cerrada con usuarios reales, iteración basada en data

---

### Sprint 11 (Semanas 21-22): Beta Cerrada Launch

#### Epic 11.1: Beta User Onboarding
**Priority:** Must Have
**Story Points:** 13

**Tareas:**
- [ ] Recruiting de 100 beta users (12h)
  - Anuncios en Reddit (r/dating, r/sex)
  - Invitaciones personales
  - Incentivo: 3 meses Premium gratis

- [ ] Email de bienvenida (4h)
- [ ] Onboarding tour en app (8h)
- [ ] Beta feedback form (4h)
- [ ] Discord/Slack community setup (4h)

#### Epic 11.2: Launch Execution
**Priority:** Must Have
**Story Points:** 8

**Tareas:**
- [ ] Deploy a producción (4h)
- [ ] Smoke tests post-deploy (2h)
- [ ] Enviar invites a beta users (2h)
- [ ] Monitoring 24/7 durante primeros 3 días (on-call)

#### Epic 11.3: Real-Time Support
**Priority:** Must Have
**Story Points:** 21

**Tareas:**
- [ ] Setup Intercom/Zendesk (4h)
- [ ] Responder tickets <2h (continuous)
- [ ] Bug hotfixes (ad-hoc)
- [ ] Daily standup para revisar issues

#### Métricas Objetivo (Semana 21-22)
- ✅ 100 registros
- ✅ 80 usuarios completan onboarding
- ✅ 50 matches exitosos
- ✅ 200+ chats iniciados
- ✅ NPS >40
- ✅ Retention Day 7: >30%

---

### Sprint 12 (Semanas 23-24): Beta Iteration

#### Epic 12.1: Data Analysis
**Priority:** Must Have
**Story Points:** 13

**Tareas:**
- [ ] Análisis de funnel (8h)
  - Drop-off points
  - Conversion rates
  - Time to first match

- [ ] User behavior analysis (8h)
  - Session duration
  - Messages per chat
  - Match acceptance rate

- [ ] Feedback synthesis (8h)
  - Categorizar feedback
  - Identificar pain points
  - Priorizar fixes

#### Epic 12.2: Quick Wins Implementation
**Priority:** Must Have
**Story Points:** 34

**Proceso:**
1. Identificar top 5 issues de users
2. Implementar fixes rápidos
3. Deploy y notificar a users

**Ejemplos:**
- Matching demasiado lento → Optimizar algoritmo
- Muchos fake profiles → Mejorar verificación
- Chat UI confusa → Rediseñar

**Estimación:** 80h

#### Epic 12.3: Expansion de Beta
**Priority:** Should Have
**Story Points:** 8

**Tareas:**
- [ ] Invitar 100 usuarios más (4h)
- [ ] Segmentación (50% hombres, 50% mujeres) (2h)
- [ ] Monitor gender balance (ongoing)

#### Métricas Objetivo (Semana 23-24)
- ✅ 200 usuarios activos
- ✅ 100+ matches exitosos
- ✅ Retention Day 7: >35%
- ✅ NPS >50
- ✅ <1% reportes de abuso

#### Definition of Done
✅ Beta exitosa con 200+ usuarios
✅ Métricas saludables
✅ Feedback positivo (NPS >50)
✅ Top issues resueltos
✅ Ready para monetización

---

## 💰 Fase 5: Monetización (Semanas 25-32)

**Duración:** 8 semanas (4 sprints)
**Objetivo:** Implementar sistema de pagos y Premium tier

---

### Sprint 13 (Semanas 25-26): Payment Infrastructure

#### Epic 13.1: Stripe Integration
**Priority:** Must Have
**Story Points:** 34

**Tareas:**
- [ ] **Stripe account setup** (4h)
  - Business verification
  - Payment methods (card, Apple Pay, Google Pay)
  - Tax configuration

- [ ] **Backend integration** (20h)
  - Stripe SDK setup
  - POST /api/v1/subscriptions/subscribe
  - POST /api/v1/credits/purchase
  - Webhook endpoint para events
  - Handle subscription lifecycle

- [ ] **Frontend - Paywall** (16h)
  - Pricing page
  - Checkout flow (Stripe Checkout)
  - Payment method management
  - Receipts/invoices

- [ ] **Testing** (12h)
  - Test mode transactions
  - Webhook testing
  - Refund flows
  - Dispute handling

#### Epic 13.2: Subscription Logic
**Priority:** Must Have
**Story Points:** 21

**Tareas:**
- [ ] Premium tier activation (8h)
  - Update user.isPremium on payment
  - Grant premium features

- [ ] Subscription management (12h)
  - Cancel subscription
  - Reactivate subscription
  - Upgrade/downgrade

- [ ] Grace period (8h)
  - 3 days grace si payment falla
  - Email reminders
  - Downgrade a free después de grace

#### Definition of Done
✅ Pagos funcionando (test mode)
✅ Subscriptions lifecycle manejado
✅ Webhooks configurados
✅ Invoice generation funcionando

---

### Sprint 14 (Semanas 27-28): Premium Features

#### Epic 14.1: Peek Feature
**Priority:** Must Have
**Story Points:** 34

**User Stories:**
- [ ] **US-042**: Como usuario Premium, quiero ver el perfil antes de chatear
  - Nuevo matching flow para Premium
  - Mostrar foto y bio antes de aceptar match
  - Límite: 3 Peeks por día
  - **Estimación:** 20h

- [ ] **US-043**: Como usuario Premium, quiero skip matches sin penalización
  - Button "Skip" (no cuenta como unmatch)
  - Puede volver a aparecer después
  - **Estimación:** 8h

#### Epic 14.2: Advanced Filters
**Priority:** Must Have
**Story Points:** 21

**User Stories:**
- [ ] **US-044**: Como usuario Premium, quiero filtros avanzados
  - Filtrar por intereses específicos (tags)
  - Filtrar por verified users only
  - Ver distancia exacta
  - **Estimación:** 16h

#### Epic 14.3: Unlimited Features
**Priority:** Must Have
**Story Points:** 13

**Tareas:**
- [ ] Extensiones ilimitadas (4h)
  - Check user.isPremium antes de limitar
- [ ] Matches ilimitados (4h)
  - Remove limit check para Premium
- [ ] Rewind ilimitado (6h)
  - Feature completo (deshacer unmatch)

#### Epic 14.4: Ad Removal
**Priority:** Should Have
**Story Points:** 8

**Tareas:**
- [ ] Implementar ads para free users (8h)
  - Google AdMob integration
  - Banner en matching screen
  - Interstitial cada 5 chats
- [ ] Disable ads para Premium (2h)

#### Definition of Done
✅ Todas las features Premium funcionando
✅ Diferenciación clara free vs Premium
✅ A/B testing setup para pricing

---

### Sprint 15 (Semanas 29-30): Credits System

#### Epic 15.1: Credits Purchase
**Priority:** Must Have
**Story Points:** 21

**Tareas:**
- [ ] Credits packages (8h)
  - 10, 50, 100, 250 créditos
  - Pricing: $0.99, $4.99, $8.99, $19.99
  - Stripe products/prices

- [ ] Purchase flow (12h)
  - Credits store UI
  - Checkout
  - Credits balance update

- [ ] Credits tracking (6h)
  - Transaction history
  - Balance display

#### Epic 15.2: Credits Features
**Priority:** Must Have
**Story Points:** 34

**Features:**
- [ ] **Super Like** (10h)
  - 5 créditos
  - Enviar mensaje personalizado antes de match
  - Destacado para el receptor

- [ ] **Boost** (10h)
  - 10 créditos
  - 30 min de prioridad en queue
  - Analytics de cuántos usuarios vieron perfil

- [ ] **Rewind** (individual) (8h)
  - 10 créditos
  - Deshacer un unmatch específico

- [ ] **Peek** (individual para free users) (6h)
  - 15 créditos
  - Ver 1 perfil antes de chatear

#### Definition of Done
✅ Credits purchase funcionando
✅ Todas las features de créditos funcionando
✅ Analytics de uso de créditos
✅ Fraud prevention implementado

---

### Sprint 16 (Semanas 31-32): Monetization Optimization

#### Epic 16.1: A/B Testing
**Priority:** Must Have
**Story Points:** 21

**Tests:**
- [ ] **Pricing test** (12h)
  - Variant A: $9.99/mes
  - Variant B: $7.99/mes
  - Variant C: $12.99/mes
  - Measure conversion rate

- [ ] **Paywall placement** (8h)
  - Variant A: Después de 5 chats
  - Variant B: Después de 10 chats
  - Variant C: Después de primer unmatch

#### Epic 16.2: Conversion Optimization
**Priority:** Should Have
**Story Points:** 21

**Tareas:**
- [ ] Premium benefits explainer (8h)
- [ ] Social proof ("10,000 Premium users") (4h)
- [ ] Limited time offers (8h)
  - First month 50% off
  - Expire en 24h
- [ ] Exit intent popup (6h)

#### Epic 16.3: Analytics & Metrics
**Priority:** Must Have
**Story Points:** 13

**Dashboards:**
- [ ] Revenue dashboard (8h)
  - MRR (Monthly Recurring Revenue)
  - ARPU (Average Revenue Per User)
  - LTV (Lifetime Value)
  - Churn rate

- [ ] Conversion funnel (6h)
  - Free → Premium conversion
  - Credits purchase rate
  - Feature usage

#### Métricas Objetivo (Fin de Sprint 16)
- ✅ 5% conversión a Premium
- ✅ 15% usuarios compran créditos al menos 1 vez
- ✅ MRR >$5,000
- ✅ LTV:CAC >3

#### Definition of Done
✅ Sistema de pagos maduro
✅ Conversión optimizada
✅ Revenue creciendo
✅ Métricas siendo tracked

---

## 📈 Fase 6: Escalamiento (Semanas 33-48)

**Duración:** 16 semanas (8 sprints)
**Objetivo:** Escalar producto, expandir features, crecer usuarios

---

### Sprint 17-18 (Semanas 33-36): Public Launch

#### Epic 17.1: Public Launch Preparation
**Priority:** Must Have
**Story Points:** 34

**Tareas:**
- [ ] Marketing campaign (20h)
  - Social media posts
  - Influencer partnerships
  - Press release
  - Product Hunt launch

- [ ] Scaling infrastructure (16h)
  - Auto-scaling groups
  - Load balancer optimization
  - CDN optimization

- [ ] Customer support scaling (8h)
  - Contratar 2 support agents
  - Create knowledge base
  - FAQs

#### Epic 17.2: Launch Execution
**Priority:** Must Have
**Story Points:** 13

**Timeline:**
- **Día 1**: Soft launch (email a waitlist)
- **Día 3**: Product Hunt launch
- **Día 7**: Press outreach
- **Día 14**: Paid ads (Facebook, Google, TikTok)

#### Métricas Objetivo (Mes 9)
- ✅ 10,000 registros
- ✅ 5,000 MAU
- ✅ 1,000 matches/día
- ✅ $15,000 MRR

---

### Sprint 19-20 (Semanas 37-40): Advanced Features

#### Epic 19.1: Self-Destruct Media
**Priority:** Should Have
**Story Points:** 34

**Features:**
- [ ] Enviar fotos/videos temporales (20h)
  - Upload a S3 con lifecycle policy
  - Max 10 segundos de visualización
  - Auto-delete después

- [ ] Screenshot detection (12h)
  - iOS: DRM framework
  - Android: FLAG_SECURE
  - Notificar emisor si screenshot

#### Epic 19.2: Profile Verification
**Priority:** Should Have
**Story Points:** 34

**Integration con Onfido/Jumio:**
- [ ] Verification flow (16h)
- [ ] Liveness detection (8h)
- [ ] ID document validation (8h)
- [ ] Blue badge para verificados (4h)

#### Epic 19.3: Gamification
**Priority:** Could Have
**Story Points:** 21

**Features:**
- [ ] Achievements (12h)
  - "First Match", "10 Matches", "100 Messages"
  - Badges en perfil

- [ ] Streaks (8h)
  - "Login diario por 7 días"
  - Bonus créditos

---

### Sprint 21-22 (Semanas 41-44): ML Improvements

#### Epic 21.1: Advanced Matching Algorithm
**Priority:** Should Have
**Story Points:** 55

**Tareas:**
- [ ] Collaborative filtering (24h)
  - Users similares basado en matches previos

- [ ] NLP para bio matching (16h)
  - Similarity score basado en intereses

- [ ] Reinforcement learning (20h)
  - Aprender de match success rate
  - Optimizar recomendaciones

#### Epic 21.2: Personalization
**Priority:** Should Have
**Story Points:** 21

**Features:**
- [ ] Recommended matches (12h)
- [ ] Smart notifications (8h)
  - "Usuario compatible está online"

---

### Sprint 23-24 (Semanas 45-48): International Expansion

#### Epic 23.1: Internationalization
**Priority:** Should Have
**Story Points:** 34

**Tareas:**
- [ ] i18n setup (8h)
- [ ] Translations (16h)
  - Español
  - Portugués
  - Francés

- [ ] Currency support (8h)
  - EUR, GBP, BRL
  - Localized pricing

#### Epic 23.2: Regional Compliance
**Priority:** Must Have
**Story Points:** 21

**Tareas:**
- [ ] EU: GDPR full compliance (12h)
- [ ] Brazil: LGPD compliance (8h)
- [ ] Data residency (8h)

---

## 👥 Recursos y Equipo

### Equipo Core (Mes 1-6)

| Rol | Cantidad | Seniority | Costo Mensual (USD) |
|-----|----------|-----------|---------------------|
| Full-Stack Engineer | 2 | Senior | $15,000 |
| Backend Engineer (Python) | 1 | Mid | $6,000 |
| Mobile Engineer (iOS) | 1 | Senior | $8,000 |
| Mobile Engineer (Android) | 1 | Mid | $6,000 |
| DevOps Engineer | 1 | Senior | $8,000 |
| QA Engineer | 1 | Mid | $5,000 |
| Product Manager | 1 | Senior | $10,000 |
| Designer (UX/UI) | 1 | Senior | $7,000 |
| **Total** | **9** | | **$65,000/mes** |

### Equipo Expandido (Mes 7-12)

Agregar:
- 1x Marketing Manager ($7,000)
- 2x Customer Support ($3,000 c/u)
- 1x Content Moderator ($4,000)
- 1x Data Analyst ($6,000)

**Total Mes 7-12:** $88,000/mes

---

## 💵 Budget Estimado

### Año 1: Budget Total

| Categoría | Meses 1-6 | Meses 7-12 | Total Año 1 |
|-----------|-----------|------------|-------------|
| **Equipo** | $390,000 | $528,000 | $918,000 |
| **Infraestructura** | | | |
| - AWS | $5,000 | $15,000 | $20,000 |
| - Tools (GitHub, Datadog, etc.) | $2,000 | $3,000 | $5,000 |
| **Legal & Compliance** | $15,000 | $5,000 | $20,000 |
| **Marketing** | $10,000 | $60,000 | $70,000 |
| **Recruiting** | $20,000 | $10,000 | $30,000 |
| **Contingencia (15%)** | $66,300 | $93,150 | $159,450 |
| **TOTAL** | **$508,300** | **$714,150** | **$1,222,450** |

### Runway Recomendado
- **Con $1.5M funding:** 14-16 meses
- **Con $2M funding:** 18-20 meses (ideal)

---

## ⚠️ Riesgos y Mitigación

### Riesgos Técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Escalabilidad (matching lento con muchos usuarios) | Media | Alto | Load testing desde sprint 3, caching agresivo |
| Security breach | Baja | Crítico | Penetration testing, security audits regulares |
| App Store rejection | Media | Alto | Pre-review legal, compliance estricto |
| High churn rate | Alta | Alto | User research continuo, fast iteration |

### Riesgos de Negocio

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Low conversion to Premium | Alta | Alto | A/B testing extensivo, value proposition clara |
| Gender imbalance | Alta | Medio | Marketing segmentado, incentivos para mujeres |
| Legal issues (contenido ilegal) | Media | Crítico | Moderación agresiva, zero-tolerance policy |
| Competencia (Tinder lanza feature similar) | Media | Alto | Velocidad de ejecución, diferenciación clara |

### Riesgos de Producto

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Users no entienden el concepto | Media | Alto | Onboarding claro, educación en marketing |
| Matching quality pobre | Alta | Alto | ML improvements continuas, user feedback |
| Demasiados fake profiles | Alta | Medio | Verificación, trust score, reportes |

---

## 📊 KPIs por Fase

### Fase 1-2: MVP (Mes 1-4)
- ✅ 0 security incidents
- ✅ Test coverage >80%
- ✅ API response time <200ms (p95)
- ✅ Uptime >99%

### Fase 3-4: Beta (Mes 5-6)
- ✅ 200 beta users
- ✅ Retention Day 7: >35%
- ✅ NPS >50
- ✅ Time to first match <5 min
- ✅ Match success rate >40%

### Fase 5: Monetización (Mes 7-8)
- ✅ 5% conversion to Premium
- ✅ MRR >$5,000
- ✅ LTV:CAC >3
- ✅ Churn <10%/month

### Fase 6: Escalamiento (Mes 9-12)
- ✅ 10,000 MAU
- ✅ MRR >$50,000
- ✅ 1,000 matches/día
- ✅ NPS >60
- ✅ Virality coefficient >1.2

---

## 📅 Calendario Visual

```
2025
────────────────────────────────────────────────────────────────

NOV   │ Pre-Dev │ Legal, Design, Infra Setup
DIC   │ Sprint 1-2 │ Auth, Profiles, Frontend Base
ENE   │ Sprint 3-4 │ Matching, Chat Foundation
FEB   │ Sprint 5-6 │ Match/Reveal, Moderation
MAR   │ Sprint 7-8 │ Mobile Apps (iOS/Android)
ABR   │ Sprint 9-10 │ Testing, Pre-Launch Prep
MAY   │ Sprint 11-12 │ BETA LAUNCH 🚀
JUN   │ Sprint 13-14 │ Payments, Premium Features
JUL   │ Sprint 15-16 │ Credits, Optimization
AGO   │ Sprint 17-18 │ PUBLIC LAUNCH 🎉
SEP   │ Sprint 19-20 │ Advanced Features
OCT   │ Sprint 21-22 │ ML Improvements
NOV   │ Sprint 23-24 │ International Expansion
```

---

## ✅ Definition of "Done" por Sprint

Cada sprint debe cumplir:
1. ✅ Todas las user stories completadas y aceptadas
2. ✅ Tests pasando (unit + integration + E2E)
3. ✅ Code review aprobado por al menos 1 peer
4. ✅ Documentación actualizada
5. ✅ Deploy a staging exitoso
6. ✅ QA sign-off
7. ✅ No P0/P1 bugs conocidos
8. ✅ Performance metrics dentro de SLAs

---

## 🎯 Conclusión

Este roadmap es **ambicioso pero realista**. Con el equipo y presupuesto adecuados, Ero Chat puede:

- **Mes 4:** Tener un MVP funcional
- **Mes 6:** Lanzar beta exitosa con usuarios reales
- **Mes 8:** Generar primeros ingresos ($5k MRR)
- **Mes 12:** Llegar a $50k MRR y 10,000 MAU

### Próximos Pasos Inmediatos

1. **Semana 1:** Secure funding ($1.5M-$2M)
2. **Semana 2:** Contratar Tech Lead y Product Manager
3. **Semana 3:** Legal setup y compliance
4. **Semana 4:** Contratar resto del equipo
5. **Semana 5:** KICKOFF 🚀

---

**Documento preparado por:** Equipo de Product & Engineering
**Última revisión:** 19 de Noviembre, 2025
**Siguiente revisión:** Cada 2 sprints

*Este roadmap es un documento vivo. Se actualizará basándose en learnings, cambios de prioridades y feedback de usuarios.*
