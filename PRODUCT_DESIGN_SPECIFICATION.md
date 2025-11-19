# 🔥 Ero Chat - Especificación de Diseño del Producto

## Documento de Arquitectura, MVP y Estrategia de Negocio

**Versión:** 1.0
**Fecha:** 18 de Noviembre, 2025
**Tipo de Producto:** Aplicación de Dating Erótico Anónimo
**Audiencia:** Adultos +18

---

## 📋 Índice

1. [Visión General del Producto](#visión-general-del-producto)
2. [Arquitectura de Sistema](#arquitectura-de-sistema)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Funcionalidades MVP](#funcionalidades-mvp)
5. [Modelo de Negocio y Monetización](#modelo-de-negocio-y-monetización)
6. [Seguridad y Cumplimiento](#seguridad-y-cumplimiento)
7. [Consideraciones Éticas](#consideraciones-éticas)
8. [Roadmap de Implementación](#roadmap-de-implementación)

---

## 🎯 Visión General del Producto

### Concepto Central
**Ero Chat** es una plataforma de dating erótico que revoluciona el enfoque tradicional al priorizar la **conexión mental y química conversacional** antes que la apariencia física. Los usuarios interactúan de forma **completamente anónima** mediante chat de texto, revelando su identidad visual solo cuando ambos deciden hacer match mutuo.

### Propuesta de Valor Única (PVU)
- **Anonimato total inicial**: Rompe los prejuicios basados en la apariencia
- **Conexión mental primero**: Fomenta conversaciones auténticas y eróticas
- **Match basado en química**: Solo se revela la identidad cuando hay conexión mutua
- **Seguridad y privacidad**: Control total sobre la información compartida

### Audiencia Objetivo
- **Demográfico**: Adultos de 18-45 años
- **Psicográfico**: Personas que buscan:
  - Interacciones eróticas discretas
  - Sexting con personas compatibles
  - Citas donde la personalidad importa más que lo físico
  - Exploración sexual en un ambiente seguro y consensuado

---

## 🏗️ Arquitectura de Sistema

### Arquitectura General: Microservicios con Event-Driven Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENTE (Frontend)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Web App    │  │  iOS Native  │  │Android Native│         │
│  │  (React/Next)│  │   (Swift)    │  │  (Kotlin)    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS / WSS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY (Kong/AWS ALB)                   │
│              ┌─────────────────────────────────┐                │
│              │  Rate Limiting / Auth / CORS    │                │
│              └─────────────────────────────────┘                │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│  Authentication Service   │   │   Real-Time Chat Service  │
│  (Node.js/Express)        │   │   (Node.js/Socket.io)     │
│  ┌────────────────────┐   │   │   ┌────────────────────┐  │
│  │ JWT/OAuth2         │   │   │   │ WebSocket Manager  │  │
│  │ Age Verification   │   │   │   │ Message Queue      │  │
│  │ Session Management │   │   │   │ Presence Tracking  │  │
│  └────────────────────┘   │   │   └────────────────────┘  │
└───────────────────────────┘   └───────────────────────────┘
                │                           │
                ▼                           ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│   Matching Service        │   │   Content Service         │
│   (Python/FastAPI)        │   │   (Node.js/Express)       │
│  ┌────────────────────┐   │   │  ┌────────────────────┐   │
│  │ ML Matching Algo   │   │   │  │ Media Upload/CDN   │   │
│  │ Filter Logic       │   │   │  │ Image Processing   │   │
│  │ Queue Management   │   │   │  │ Self-Destruct Logic│   │
│  └────────────────────┘   │   │  └────────────────────┘   │
└───────────────────────────┘   └───────────────────────────┘
                │                           │
                ▼                           ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│  Moderation Service       │   │   Payment Service         │
│  (Python/FastAPI)         │   │   (Node.js/Express)       │
│  ┌────────────────────┐   │   │  ┌────────────────────┐   │
│  │ AI Content Filter  │   │   │  │ Stripe Integration │   │
│  │ Report Management  │   │   │  │ Subscription Logic │   │
│  │ User Flagging      │   │   │  │ Credits System     │   │
│  └────────────────────┘   │   │  └────────────────────┘   │
└───────────────────────────┘   └───────────────────────────┘
                              │
                ┌─────────────┴─────────────────┐
                ▼                               ▼
┌───────────────────────────┐   ┌──────────────────────────────┐
│   Message Queue/Broker    │   │   Notification Service       │
│   (RabbitMQ/AWS SQS)      │   │   (Node.js/FCM/APNS)         │
└───────────────────────────┘   └──────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        CAPA DE DATOS                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  PostgreSQL  │  │    Redis     │  │   MongoDB    │         │
│  │  (User Data) │  │   (Cache/    │  │ (Chat Logs/  │         │
│  │  (Matches)   │  │   Sessions)  │  │  Analytics)  │         │
│  │  (Payments)  │  │   (Presence) │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐                           │
│  │     S3       │  │ Elasticsearch│                           │
│  │  (Media/CDN) │  │  (Search/    │                           │
│  │              │  │   Logs)      │                           │
│  └──────────────┘  └──────────────┘                           │
└─────────────────────────────────────────────────────────────────┘
```

### Justificación de Arquitectura

#### Por qué Microservicios
1. **Escalabilidad independiente**: El chat en tiempo real puede escalar separado del matching
2. **Resiliencia**: Fallos en moderación no afectan al chat
3. **Desarrollo paralelo**: Equipos diferentes pueden trabajar en servicios distintos
4. **Tecnologías especializadas**: Python para ML, Node.js para I/O intensivo

#### Por qué Event-Driven
1. **Desacoplamiento**: Servicios se comunican mediante eventos
2. **Asincronía**: Procesos como moderación no bloquean el flujo principal
3. **Auditoría**: Todos los eventos quedan registrados
4. **Escalabilidad**: Fácil agregar nuevos consumidores de eventos

---

## 💻 Stack Tecnológico

### Frontend

#### Web Application
```
Technology: Next.js 14 (React Framework)
Language: TypeScript
UI Library: Tailwind CSS + shadcn/ui
State Management: Zustand + React Query
Real-time: Socket.io-client
PWA: next-pwa
```

**Justificación:**
- **Next.js 14**: SSR/SSG para SEO, App Router para mejor UX
- **TypeScript**: Seguridad de tipos, mejor DX
- **Tailwind + shadcn**: Desarrollo rápido con componentes accesibles
- **Zustand**: Simple, performante, menos boilerplate que Redux
- **PWA**: Experiencia casi nativa en web

#### Mobile Applications
```
iOS: Swift + SwiftUI
Android: Kotlin + Jetpack Compose
Real-time: SocketIO iOS/Android SDK
```

**Justificación:**
- **Nativo vs React Native**: Mejor rendimiento para chat en tiempo real
- **SwiftUI/Compose**: UI declarativa moderna
- **Mejor integración**: Notificaciones push, permisos, cámara

### Backend

#### Core Services
```
Framework: Node.js 20 LTS + Express.js
Language: TypeScript
Real-time: Socket.io
Validation: Zod
ORM: Prisma
Testing: Jest + Supertest
```

**Justificación:**
- **Node.js**: Excelente para I/O asíncrono (chat, API)
- **Express**: Maduro, gran ecosistema, fácil de escalar
- **Socket.io**: Mejor biblioteca para WebSockets con fallbacks
- **Prisma**: Type-safe ORM, migraciones automáticas

#### Matching & ML Service
```
Framework: Python 3.11 + FastAPI
ML Libraries: scikit-learn, TensorFlow Lite
Validation: Pydantic
Testing: pytest
```

**Justificación:**
- **Python**: Ecosistema ML superior
- **FastAPI**: Alto rendimiento, validación automática, OpenAPI
- **scikit-learn**: Algoritmos de matching simples y efectivos

#### Moderation Service
```
Framework: Python 3.11 + FastAPI
AI/ML: OpenAI Moderation API, TensorFlow
Image Analysis: AWS Rekognition / Google Vision API
```

### Base de Datos

#### Primary Database: PostgreSQL 15+
```sql
-- Uso principal
Users (id, email, age_verified, created_at)
Profiles (user_id, interests, preferences)
Matches (user_a_id, user_b_id, matched_at, status)
Subscriptions (user_id, tier, expires_at)
Payments (user_id, amount, status, created_at)
Reports (reporter_id, reported_id, reason, status)
```

**Justificación:**
- **ACID compliant**: Crítico para pagos y matches
- **Relaciones complejas**: Users ↔ Matches ↔ Profiles
- **JSON support**: Flexible para metadata de perfiles
- **Maduro y confiable**: Excelente para producción

#### Cache & Sessions: Redis 7+
```
- Session storage (JWT blacklist, active sessions)
- User presence tracking (quién está online)
- Rate limiting
- Match queue (usuarios esperando match)
- Real-time analytics
```

**Justificación:**
- **Velocidad**: <1ms latency
- **Pub/Sub**: Notificaciones en tiempo real
- **Expiración automática**: Sessions y cache temporal

#### Chat & Logs: MongoDB 6+
```javascript
// Colecciones
chats: { chat_id, participants[], messages[], created_at, status }
messages: { chat_id, sender_id, content, timestamp, is_deleted }
analytics_events: { user_id, event_type, metadata, timestamp }
moderation_logs: { content_id, action, reason, timestamp }
```

**Justificación:**
- **Flexible schema**: Mensajes pueden tener diferentes estructuras
- **Alto write throughput**: Miles de mensajes por segundo
- **TTL indexes**: Auto-delete de chats temporales
- **Sharding horizontal**: Escala para millones de chats

#### Media Storage: AWS S3 + CloudFront CDN
```
- User profile images (revealed after match)
- Temporary media (self-destruct images/videos)
- Pre-signed URLs for secure uploads
- Lifecycle policies (auto-delete temporary content)
```

#### Search & Analytics: Elasticsearch
```
- Logs centralizados
- Búsqueda de usuarios (admin)
- Analytics de comportamiento
```

### Infraestructura y DevOps

#### Cloud Provider: AWS
```
Compute:
  - ECS Fargate (servicios backend)
  - Lambda (tareas asíncronas, moderación)

Networking:
  - ALB (Application Load Balancer)
  - Route 53 (DNS)
  - VPC (aislamiento de red)

Security:
  - WAF (Web Application Firewall)
  - Secrets Manager
  - Certificate Manager (SSL/TLS)
```

**Alternativa:** Google Cloud Platform o Azure (arquitectura similar)

#### Containerización
```
Docker + Docker Compose (desarrollo)
Amazon ECS / Kubernetes (producción)
```

#### CI/CD
```
GitHub Actions
  - Lint + Test en cada PR
  - Build + Deploy en merge a main
  - Automated security scanning (Snyk)
```

#### Monitoring & Observability
```
Logging: CloudWatch / Datadog
APM: New Relic / Datadog APM
Error Tracking: Sentry
Uptime: Pingdom / UptimeRobot
Analytics: Mixpanel + Google Analytics 4
```

---

## 🚀 Funcionalidades MVP

### FASE 1: Funcionalidades Core del MVP

#### 1. Autenticación y Onboarding

##### 1.1 Registro de Usuario
```
Campos requeridos:
✓ Email (verificado)
✓ Contraseña (mínimo 8 caracteres, hash con bcrypt)
✓ Fecha de nacimiento (verificación de +18)
✓ Género
✓ Interés en (género/géneros)

Opcional:
- Nombre (nickname anónimo, no nombre real)
- Bio corta (max 200 caracteres)
- Intereses/tags (ej: "conversaciones profundas", "roleplay")
```

##### 1.2 Verificación de Edad (+18)
```
Nivel 1 (MVP):
- Confirmación de fecha de nacimiento
- Checkbox legal "Confirmo que soy mayor de 18 años"
- Verificación de email

Nivel 2 (Post-MVP):
- Integración con servicios de verificación de identidad
  (Onfido, Jumio, Stripe Identity)
```

##### 1.3 Configuración de Perfil Anónimo
```
NO se solicita foto inicialmente
Solo metadata:
- Edad (rango visible: "25-30")
- Ubicación (ciudad/región, no dirección exacta)
- Preferencias (qué buscas: chat, citas, ambos)
- Intereses y fantasías (tags predefinidos + personalizados)
```

#### 2. Sistema de Matching Anónimo

##### 2.1 Algoritmo de Matching
```python
# Pseudocódigo del algoritmo

def find_match(user_a):
    """
    Encuentra un match compatible basado en:
    - Filtros geográficos (ciudad/región)
    - Filtros de edad (rango aceptable)
    - Interés en género
    - Disponibilidad (usuarios online en queue)
    """

    # Filtros base
    candidates = User.filter(
        is_online=True,
        in_queue=True,
        age >= user_a.min_age_preference,
        age <= user_a.max_age_preference,
        distance <= user_a.max_distance,
        gender in user_a.interested_in,
        user_a.gender in candidates.interested_in
    )

    # Excluir usuarios ya chateados
    candidates = candidates.exclude(
        id in user_a.past_chat_partners
    )

    # Scoring basado en compatibilidad
    for candidate in candidates:
        score = calculate_compatibility(user_a, candidate)
        # Factores:
        # - Intereses compartidos (peso: 40%)
        # - Preferencias de edad mutuas (peso: 30%)
        # - Actividad/respuesta en chats previos (peso: 30%)

    # Retornar mejor match o random de top 3
    return weighted_random_choice(candidates, top_n=3)
```

##### 2.2 Cola de Matching
```
- Usuario entra en cola al presionar "Buscar Chat"
- Spinner de espera con mensaje motivacional
- Timeout de 60 segundos (si no hay match, reintentar)
- Opción de ampliar filtros si no hay matches
```

#### 3. Chat Anónimo (Core Feature)

##### 3.1 Sala de Chat Temporal
```
Características:
✓ Duración: 20 minutos por defecto
✓ Solo texto inicialmente
✓ Sin fotos de perfil visibles
✓ Avatares genéricos (colores aleatorios)
✓ Indicador de "escribiendo..."
✓ Timestamps de mensajes

UI:
┌─────────────────────────────────────┐
│  Anon_Blue 🔵        Timer: 18:32   │
├─────────────────────────────────────┤
│                                     │
│  🔵 Anon_Blue:                      │
│  Hola! ¿Qué te trae por aquí? 😏   │
│                          19:58      │
│                                     │
│              Anon_Red 🔴:           │
│              Curiosidad... ¿y tú?   │
│                          19:59      │
│                                     │
├─────────────────────────────────────┤
│ [💬 Escribe un mensaje...]          │
│                                     │
│ [⏱️ Extender tiempo] [❌ Salir]     │
│ [❤️ Quiero hacer Match]             │
└─────────────────────────────────────┘
```

##### 3.2 Funciones del Chat
```javascript
// Eventos del chat
const chatEvents = {
  MESSAGE_SENT: 'message:sent',
  MESSAGE_RECEIVED: 'message:received',
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
  USER_LEFT: 'user:left',
  TIME_EXTENDED: 'time:extended',
  MATCH_REQUESTED: 'match:requested',
  MATCH_SUCCESS: 'match:success',
  MATCH_FAILED: 'match:failed'
}

// Rate limiting
const chatLimits = {
  messagesPerMinute: 30,  // Anti-spam
  maxMessageLength: 1000, // caracteres
  maxTimeExtensions: 2    // máximo 2 extensiones = 60 min total
}
```

##### 3.3 Sistema de Extensión de Tiempo
```
- Cualquier usuario puede solicitar extender (+10 min)
- El otro debe aceptar (botón de confirmación)
- Máximo 2 extensiones = 60 minutos totales
- Premium: extensiones ilimitadas
```

#### 4. Sistema de Match/Reveal

##### 4.1 Flujo de Match
```
Escenario 1: Match Exitoso (ambos presionan ❤️)
┌──────────────────────────────────────────────┐
│  🎉 ¡Es un Match!                            │
│                                              │
│  Ambos quieren conocerse mejor.              │
│  Sus perfiles ahora son visibles.            │
│                                              │
│  [Ver Perfil de Anon_Blue]                   │
│                                              │
│  El chat ahora es permanente.                │
│  Pueden compartir fotos y videos.            │
└──────────────────────────────────────────────┘

Escenario 2: Solo uno presiona ❤️
┌──────────────────────────────────────────────┐
│  🤔 Esperando respuesta...                   │
│                                              │
│  Le has enviado una solicitud de match.      │
│  Si acepta en los próximos 2 min,            │
│  podrán revelar sus identidades.             │
└──────────────────────────────────────────────┘

Escenario 3: Uno rechaza o tiempo expira
┌──────────────────────────────────────────────┐
│  👋 El chat ha terminado                     │
│                                              │
│  No hubo match esta vez.                     │
│  No podrás volver a chatear con esta         │
│  persona (a menos que uses Rewind).          │
│                                              │
│  [Buscar Nuevo Chat]                         │
│  [💎 Usar Rewind - 10 créditos]             │
└──────────────────────────────────────────────┘
```

##### 4.2 Post-Match: Perfil Revelado
```
Información visible después del match:
✓ Fotos de perfil (hasta 6)
✓ Nombre/nickname
✓ Edad exacta
✓ Bio completa
✓ Redes sociales (opcional)
✓ Verificación de perfil (badge azul)

Funciones desbloqueadas:
✓ Chat permanente
✓ Compartir fotos/videos temporales
✓ Videollamada (opcional, post-MVP)
```

#### 5. Moderación y Seguridad

##### 5.1 Sistema de Reportes
```
Opciones de reporte:
□ Contenido inapropiado / ilegal
□ Spam / publicidad
□ Acoso / comportamiento abusivo
□ Suplantación de identidad
□ Menor de edad
□ Otro (texto libre)

Proceso:
1. Usuario reporta → captura de contexto (últimos 10 mensajes)
2. Alerta inmediata al equipo de moderación
3. Chat pausado temporalmente
4. Revisión manual + AI
5. Acción: advertencia / suspensión / ban permanente
```

##### 5.2 Filtros Automatizados (IA)
```python
# Integración con OpenAI Moderation API
def moderate_message(message_content):
    """
    Categorías detectadas:
    - sexual/minors (INSTANT BAN)
    - hate speech
    - harassment
    - violence
    - self-harm
    """

    response = openai.Moderation.create(
        input=message_content
    )

    if response.flagged:
        if 'sexual/minors' in response.categories:
            # Ban inmediato + reporte a autoridades
            ban_user_immediately(user_id)
            alert_authorities(user_id, message_content)
        else:
            # Bloquear mensaje + advertencia
            block_message(message_id)
            warn_user(user_id)
```

##### 5.3 Sistema de Bloqueo
```
- Usuario puede bloquear a otro en cualquier momento
- Bloqueado no puede:
  ✗ Ver perfil del bloqueador
  ✗ Hacer match con bloqueador
  ✗ Enviar mensajes
- Bloqueo es permanente (no reversible sin contactar soporte)
```

#### 6. Perfil de Usuario

##### 6.1 Estructura del Perfil
```typescript
interface UserProfile {
  // Información básica (siempre privada hasta match)
  id: string;
  username: string; // nickname anónimo
  age: number;
  gender: 'male' | 'female' | 'non-binary' | 'other';
  interestedIn: ('male' | 'female' | 'non-binary' | 'other')[];

  // Ubicación (aproximada)
  location: {
    city: string;
    region: string;
    coordinates?: { lat: number; lng: number }; // para matching
  };

  // Preferencias
  preferences: {
    minAge: number;
    maxAge: number;
    maxDistance: number; // km
    lookingFor: ('chat' | 'dating' | 'both')[];
  };

  // Intereses (tags)
  interests: string[]; // ej: ['roleplay', 'intellectual', 'kinky']

  // Información revelada post-match
  revealedInfo: {
    photos: string[]; // URLs
    fullBio: string;
    socialLinks?: {
      instagram?: string;
      snapchat?: string;
    };
  };

  // Metadata
  isVerified: boolean;
  isPremium: boolean;
  createdAt: Date;
  lastActive: Date;
}
```

##### 6.2 Configuración de Privacidad
```
Control granular:
□ Mostrar estado online
□ Mostrar última conexión
□ Permitir ser encontrado por ubicación
□ Permitir compartir redes sociales post-match
□ Recibir notificaciones push
```

---

## 💰 Modelo de Negocio y Monetización

### Filosofía del Modelo
**Freemium con valor real**: La versión gratuita debe ser completamente funcional para garantizar masa crítica de usuarios. Premium ofrece conveniencia y ventajas, no características core.

### NIVEL 1: Usuario Gratuito (Free Tier)

#### Acceso Completo a:
✅ **Chats anónimos ilimitados**
✅ **Sistema de matching básico**
✅ **Revelar identidad al hacer match**
✅ **Chat permanente con matches**
✅ **Reportar y bloquear usuarios**
✅ **1 extensión de tiempo por chat**

#### Limitaciones:
⚠️ **Publicidad no intrusiva** (banner sutil al buscar match)
⚠️ **1 "Rewind" gratis por semana** (deshacer unmatch)
⚠️ **Máximo 5 matches activos simultáneos**
⚠️ **Sin filtros avanzados**
⚠️ **Sin ver quién te dio like**

### NIVEL 2: Ero Premium (Suscripción Mensual)

#### Precio Sugerido: $9.99 USD/mes
**Descuentos:**
- 3 meses: $24.99 ($8.33/mes) - 17% descuento
- 6 meses: $44.99 ($7.50/mes) - 25% descuento
- 12 meses: $79.99 ($6.66/mes) - 33% descuento

#### Beneficios Exclusivos:

##### 1. **Peek Feature** 👁️
```
Ver perfil (con fotos) de tu match ANTES de chatear
- Aparece como "Super Match"
- Solo 3 Peeks por día (evitar uso superficial)
- Puedes decidir si entrar al chat o skip
```

##### 2. **Filtros Avanzados** 🎯
```
Matching más específico:
✓ Filtrar por intereses específicos (tags)
✓ Filtrar por nivel de actividad
✓ Priorizar usuarios verificados
✓ Ver distancia exacta
```

##### 3. **Extensiones Ilimitadas** ⏱️
```
Sin límite de extensiones de tiempo en chat
Ideal para conversaciones largas y profundas
```

##### 4. **Contenido Temporal Premium** 📸
```
Enviar fotos/videos self-destruct a matches:
- Detección de screenshot (aviso al emisor)
- Máximo 10 segundos de visualización
- Auto-delete después de ver
```

##### 5. **Rewind Ilimitado** ↩️
```
Deshacer unmatch ilimitado
Recuperar chats que terminaron sin match
```

##### 6. **Matches Ilimitados** ♾️
```
Sin límite de matches activos
Chatear con tantas personas como quieras
```

##### 7. **Sin Publicidad** 🚫
```
Experiencia premium sin anuncios
```

##### 8. **Ver Quién Te Dio Like** 💝
```
Lista de personas que presionaron ❤️ contigo
Puedes revisar y decidir si match o no
```

##### 9. **Badge Premium** 👑
```
Distintivo visual en tu perfil (post-match)
Demuestra compromiso con la plataforma
```

##### 10. **Prioridad en Matching** ⚡
```
Menor tiempo de espera en cola
Match con usuarios más activos
```

### NIVEL 3: Microtransacciones (Créditos)

#### Sistema de Créditos
```
1 Crédito ≈ $0.10 USD

Paquetes:
- 10 créditos: $0.99 (oferta inicial)
- 50 créditos: $4.99
- 100 créditos: $8.99 (10% descuento)
- 250 créditos: $19.99 (20% descuento)
```

#### Uso de Créditos:

##### Super Likes (5 créditos)
```
Enviar un "Super Match" con mensaje personalizado
Aparece destacado para el receptor
Mayor probabilidad de match
```

##### Boosts (10 créditos)
```
Duración: 30 minutos
Efecto: Prioridad máxima en cola de matching
Ideal para momentos de alta actividad
```

##### Rewind Individual (10 créditos)
```
Deshacer un unmatch específico
Para usuarios free (1 gratis/semana)
```

##### Peek Individual (15 créditos)
```
Ver perfil de 1 persona antes de chatear
Para usuarios free que quieren probar la feature
```

##### Extend Time Package (20 créditos)
```
5 extensiones de tiempo adicionales
Para usuarios free en conversaciones importantes
```

##### Virtual Gifts (5-50 créditos)
```
Enviar stickers/gifts premium en chats post-match
Diferentes precios según exclusividad
Gamificación y expresión
```

### NIVEL 4: Publicidad (Para Usuarios Free)

#### Formato de Anuncios:
```
✅ Permitido:
- Banner estático en pantalla de búsqueda de match
- Anuncio de video (5s, skippable) cada 5 chats
- Anuncios nativos en feed de matches

❌ Prohibido:
- Interrumpir chats activos
- Pop-ups invasivos
- Auto-play con sonido
- Contenido inapropiado
```

#### Fuentes de Ingresos Publicitarios:
```
- Google AdMob / AdSense
- Programmatic ads (AppLovin, IronSource)
- Affiliate marketing (productos adultos de alta calidad)
- Sponsorships de marcas de lifestyle/wellness
```

**Ingreso Estimado por Usuario Free:** $0.50 - $1.50 USD/mes

### Proyección de Ingresos (Año 1)

#### Asunciones:
- 100,000 usuarios registrados en mes 12
- 80,000 MAU (Monthly Active Users)
- 5% conversión a Premium = 4,000 Premium users
- 15% realizan microtransacciones al menos 1 vez/mes = 12,000 users
- 75,000 usuarios free con ads

#### Ingresos Mensuales (Mes 12):
```
Premium Subscriptions:
4,000 users × $9.99 = $39,960

Microtransacciones:
12,000 users × $3 (promedio/mes) = $36,000

Publicidad:
75,000 users × $1 (promedio/mes) = $75,000

TOTAL MENSUAL: $150,960
TOTAL ANUAL (proyectado): ~$1,000,000 - $1,500,000
```

### Estrategia de Retención

#### Para Usuarios Free:
✓ Recordatorios de "Rewind gratis disponible"
✓ Ofertas limitadas (50% descuento en primer mes Premium)
✓ Gamificación (logros, streaks de uso)

#### Para Usuarios Premium:
✓ Contenido exclusivo (eventos, funciones beta)
✓ Descuentos en renovación anual
✓ Programa de referidos (1 mes gratis por 3 referidos Premium)

#### Para Todos:
✓ Notificaciones inteligentes (alguien te dio like, nuevo match)
✓ Email marketing personalizado
✓ Push notifications contextuales (no spam)

---

## 🔒 Seguridad y Cumplimiento

### 1. Seguridad de Datos

#### 1.1 Cifrado de Datos

##### En Tránsito:
```
✓ TLS 1.3 obligatorio para todas las conexiones
✓ Certificate Pinning en apps móviles
✓ HSTS (HTTP Strict Transport Security)
✓ WebSocket sobre WSS (WebSocket Secure)
```

##### En Reposo:
```
✓ Cifrado de base de datos (PostgreSQL Transparent Data Encryption)
✓ Cifrado de backups (AES-256)
✓ Contraseñas con bcrypt (cost factor: 12)
✓ Tokens JWT con firma RS256
```

##### Cifrado de Mensajes (Post-MVP):
```
Implementar E2EE (End-to-End Encryption) con Signal Protocol:
- Cada dispositivo genera par de llaves asimétricas
- Mensajes cifrados solo descifrables por emisor y receptor
- El servidor no puede leer el contenido
```

#### 1.2 Autenticación y Autorización

##### Multi-Factor Authentication (MFA):
```
Disponible opcionalmente:
- TOTP (Google Authenticator, Authy)
- SMS (para recuperación)
- Email verification
```

##### Session Management:
```javascript
const sessionConfig = {
  jwtExpiration: '15m',      // Access token corto
  refreshExpiration: '7d',   // Refresh token
  maxActiveSessions: 3,      // Por usuario
  ipValidation: true,        // Detectar cambios sospechosos
  deviceFingerprinting: true // Detectar nuevos dispositivos
}
```

##### Rate Limiting:
```
API Endpoints:
- Login: 5 intentos / 15 min por IP
- Registro: 3 cuentas / hora por IP
- Messages: 30 mensajes / min por usuario
- Reports: 5 reportes / hora por usuario
- API general: 100 requests / min por usuario
```

### 2. Protección Contra Ataques Comunes

#### 2.1 OWASP Top 10

##### A1: Broken Access Control
```
Medidas:
✓ Verificación de ownership en cada request
✓ RBAC (Role-Based Access Control)
✓ Pruebas de autorización en CI/CD
```

##### A2: Cryptographic Failures
```
Medidas:
✓ No almacenar datos sensibles innecesarios
✓ Usar bibliotecas criptográficas estándar (no custom)
✓ Rotación de secretos cada 90 días
```

##### A3: Injection
```
Medidas:
✓ Parametrized queries (Prisma ORM)
✓ Input validation con Zod
✓ Output encoding
✓ CSP (Content Security Policy)
```

##### A4: Insecure Design
```
Medidas:
✓ Threat modeling en fase de diseño
✓ Security reviews en PRs críticos
✓ Principio de privilegio mínimo
```

##### A5: Security Misconfiguration
```
Medidas:
✓ Hardened container images
✓ Secrets en AWS Secrets Manager (nunca en código)
✓ CORS restrictivo
✓ Disable debug endpoints en producción
```

##### A6: Vulnerable Components
```
Medidas:
✓ Dependabot alerts
✓ Snyk security scanning
✓ Actualización regular de dependencias
```

##### A7: Authentication Failures
```
Medidas:
✓ Password strength validation
✓ Breach password detection (HaveIBeenPwned API)
✓ Account lockout después de intentos fallidos
```

##### A8: Software and Data Integrity
```
Medidas:
✓ Firma de releases
✓ Verificación de integridad de dependencias
✓ Immutable infrastructure
```

##### A9: Security Logging Failures
```
Medidas:
✓ Log de todos los eventos de seguridad
✓ Centralización en Elasticsearch
✓ Alertas en tiempo real (Sentry)
```

##### A10: SSRF (Server-Side Request Forgery)
```
Medidas:
✓ Whitelist de dominios permitidos
✓ Validación de URLs
✓ Network segmentation
```

#### 2.2 Protección DDoS
```
Cloudflare / AWS Shield:
- Rate limiting por IP
- Challenge pages para tráfico sospechoso
- Geo-blocking (bloquear países con alto abuse)
```

#### 2.3 XSS (Cross-Site Scripting)
```
Medidas:
✓ CSP headers
✓ Sanitización de inputs (DOMPurify)
✓ Escape de outputs
✓ HttpOnly cookies
```

### 3. Privacidad y Cumplimiento Legal

#### 3.1 GDPR (Europa)
```
Requerimientos:
✓ Consent explícito para datos personales
✓ Right to access (descargar todos tus datos)
✓ Right to be forgotten (eliminar cuenta y datos)
✓ Data portability (exportar en formato JSON)
✓ Breach notification (72 horas)
✓ DPO (Data Protection Officer)
```

#### 3.2 CCPA (California)
```
Requerimientos:
✓ Divulgación de qué datos se recopilan
✓ Opt-out de venta de datos
✓ No discriminar por ejercer derechos
```

#### 3.3 Coppa (Menores de Edad)
```
CRÍTICO: Verificación estricta de +18
- Ban permanente si se detecta menor
- Reportes a NCMEC (National Center for Missing & Exploited Children)
- Cooperación con autoridades
```

#### 3.4 Políticas Requeridas
```
✓ Privacy Policy (detallada)
✓ Terms of Service
✓ Cookie Policy
✓ Community Guidelines
✓ DMCA Policy
✓ Law Enforcement Guidelines
```

### 4. Moderación de Contenido

#### 4.1 Contenido Ilegal: CERO TOLERANCIA
```
Categorías de acción inmediata:
- CSAM (Child Sexual Abuse Material): Ban + reporte a NCMEC + FBI
- Revenge porn / non-consensual: Eliminación inmediata + ban
- Trafficking / prostitución: Reporte a autoridades
- Violencia extrema: Ban + reporte si aplica
```

#### 4.2 Pipeline de Moderación
```
1. AI Screening (OpenAI Moderation API):
   - Análisis de cada mensaje enviado
   - Análisis de cada imagen subida (AWS Rekognition)
   - Flags automáticos de contenido sospechoso

2. User Reports:
   - Queue de reportes para moderadores humanos
   - Prioridad: CSAM > Violence > Harassment > Spam

3. Human Review:
   - Equipo 24/7 (empezar con outsourcing a Scale AI)
   - Decisiones: Approve / Warn / Suspend / Ban
   - Documentación de cada caso

4. Appeals:
   - Usuarios pueden apelar bans (excepto CSAM)
   - Revisión por moderador senior
   - Respuesta en 48 horas
```

#### 4.3 Proactive Monitoring
```
- Análisis de patrones (usuarios que reciben múltiples reportes)
- Detección de spam rings
- Identificación de cuentas fake
- Análisis de imágenes duplicadas (PhotoDNA)
```

### 5. Verificación de Usuarios

#### 5.1 Verificación Opcional de Perfil
```
Proceso:
1. Usuario sube selfie + foto de ID
2. Servicio de verificación (Onfido/Jumio) compara:
   - Liveness detection (video selfie)
   - Face match con ID
   - Validación de documento

3. Si aprobado: Badge azul de verificación

Beneficios:
✓ Más confianza de otros usuarios
✓ Prioridad en matching
✓ Acceso a funciones exclusivas (videollamadas)
```

#### 5.2 Trust Score (Interno)
```python
def calculate_trust_score(user):
    """
    Score 0-100 basado en:
    - Verificación de perfil (+30)
    - Antigüedad de cuenta (+20)
    - Tasa de reportes (-50 por reporte)
    - Tasa de matches exitosos (+10)
    - Actividad regular (+20)
    """
    score = 50  # Base

    if user.is_verified:
        score += 30

    if user.account_age_days > 30:
        score += min(20, user.account_age_days / 10)

    if user.reports_received > 0:
        score -= user.reports_received * 50

    # ... más factores

    return max(0, min(100, score))
```

---

## ⚖️ Consideraciones Éticas

### 1. Principios Fundamentales

#### 1.1 Consentimiento
```
TODO en la plataforma debe ser consensuado:
✓ Chat solo con mutuo interés (matching)
✓ Reveal solo con mutuo acuerdo
✓ Compartir contenido solo si ambos aceptan
✓ Rechazar es siempre una opción respetada
```

#### 1.2 Privacidad y Anonimato
```
✓ Anonimato garantizado hasta que el usuario decida revelarse
✓ No vender datos de usuarios
✓ No compartir datos con terceros (excepto requerimientos legales)
✓ Usuario controla qué información comparte y cuándo
```

#### 1.3 Seguridad
```
✓ Protección contra acoso
✓ Herramientas de bloqueo y reporte accesibles
✓ Moderación activa y responsiva
✓ Educación sobre seguridad online (tips en la app)
```

### 2. Diseño Responsable

#### 2.1 Anti-Adicción
```
Evitar dark patterns:
✗ No notificaciones manipuladoras ("Alguien te extraña")
✗ No timers artificiales ("Solo quedan 2 matches hoy!")
✗ No FOMO engineered

Fomentar uso saludable:
✓ Estadísticas de uso semanal
✓ Opción de "Tomar un descanso"
✓ Limitar notificaciones (respeta Do Not Disturb)
```

#### 2.2 Transparencia del Algoritmo
```
✓ Explicar cómo funciona el matching
✓ Mostrar por qué se sugiere un match
✓ Dar control sobre filtros y preferencias
✓ No ocultar matches para forzar pago
```

#### 2.3 Inclusividad
```
✓ Opciones de género inclusivas (no binario, fluido, etc.)
✓ Orientaciones diversas (asexual, demisexual, etc.)
✓ Accesibilidad (screen readers, alto contraste)
✓ Internacionalización (múltiples idiomas)
```

### 3. Responsabilidad Social

#### 3.1 Educación Sexual
```
Contenido educativo (opcional, blog/recursos):
- Consentimiento
- Sexting seguro
- Reconocer red flags
- Salud mental y relaciones
```

#### 3.2 Recursos de Ayuda
```
Enlaces a:
- Líneas de ayuda para víctimas de abuso
- Recursos de salud mental
- Información sobre ITS
- Centros de crisis (violencia doméstica, etc.)
```

#### 3.3 Partnerships
```
Colaborar con:
- ONGs de salud sexual
- Organizaciones LGBTQ+
- Expertos en seguridad digital
```

### 4. Mitigación de Riesgos

#### 4.1 Riesgos Identificados y Mitigaciones

##### Riesgo: Catfishing
```
Mitigación:
✓ Sistema de verificación opcional
✓ Trust score interno
✓ Reportes de usuarios
✓ Educación (tips para detectar catfishing)
```

##### Riesgo: Acoso
```
Mitigación:
✓ Bloqueo inmediato
✓ No permite contacto después de unmatch (sin Rewind)
✓ Reportes con respuesta rápida
✓ Suspensión automática tras múltiples reportes
```

##### Riesgo: Compartir contenido sin consentimiento
```
Mitigación:
✓ Marca de agua invisible en fotos (para rastrear leaks)
✓ Detección de screenshots (alertar al emisor)
✓ Educación sobre riesgos
✓ DMCA takedown process
```

##### Riesgo: Menores de edad
```
Mitigación:
✓ Verificación de edad en registro
✓ AI para detectar menores en fotos
✓ Reportes de usuarios
✓ Ban inmediato + reporte a autoridades
```

##### Riesgo: Tráfico sexual
```
Mitigación:
✓ Detección de patrones (lenguaje, comportamiento)
✓ Prohibición de solicitud/oferta de servicios sexuales pagos
✓ Colaboración con organizaciones anti-tráfico
✓ Reporte a autoridades
```

---

## 🗓️ Roadmap de Implementación

### FASE 1: MVP (Meses 1-4)

#### Mes 1: Setup y Fundaciones
```
✓ Setup de infraestructura (AWS, CI/CD)
✓ Arquitectura de microservicios base
✓ Base de datos (PostgreSQL + Redis)
✓ Autenticación y registro
✓ Verificación de edad básica
```

#### Mes 2: Core Features
```
✓ Sistema de matching (algoritmo v1)
✓ Chat en tiempo real (WebSockets)
✓ Sistema de match/reveal
✓ Perfiles anónimos
```

#### Mes 3: Moderación y Seguridad
```
✓ Sistema de reportes
✓ Integración con OpenAI Moderation
✓ Bloqueo de usuarios
✓ Dashboard de moderación
```

#### Mes 4: Testing y Lanzamiento Beta
```
✓ Testing exhaustivo (QA)
✓ Security audit
✓ Beta cerrada (100 usuarios)
✓ Iteración basada en feedback
```

### FASE 2: Lanzamiento Público (Mes 5-6)

#### Mes 5: Pre-Lanzamiento
```
✓ Apps iOS + Android (revisión de App Store)
✓ Web app completa
✓ Políticas legales finalizadas
✓ Marketing pre-launch
```

#### Mes 6: Lanzamiento
```
✓ Public launch (ciudad piloto)
✓ Monitoreo 24/7
✓ Soporte al usuario
✓ Recopilación de métricas
```

### FASE 3: Monetización (Mes 7-9)

#### Mes 7-8: Implementar Premium
```
✓ Tier Premium
✓ Sistema de créditos
✓ Integración con Stripe
✓ Features premium (Peek, filtros avanzados)
```

#### Mes 9: Optimización
```
✓ A/B testing de pricing
✓ Optimización de conversión
✓ Publicidad para tier free
```

### FASE 4: Expansión (Mes 10-12)

#### Mes 10-11: Nuevas Features
```
✓ Contenido temporal (fotos/videos self-destruct)
✓ Mejoras al algoritmo de matching (ML)
✓ Verificación de perfil
```

#### Mes 12: Escala
```
✓ Expansión a más ciudades/países
✓ Internacionalización (múltiples idiomas)
✓ Optimización de infraestructura
```

### POST-MVP: Features Futuras

#### Corto Plazo (6-12 meses)
```
- Videollamadas anónimas (con filtros de voz/video)
- Juegos y icebreakers en chat
- Eventos virtuales (speed dating anónimo)
- Integración con Telegram/WhatsApp post-match
```

#### Mediano Plazo (1-2 años)
```
- E2EE (End-to-End Encryption) con Signal Protocol
- IA conversacional (sugerencias de respuestas)
- Matching basado en ML avanzado
- Geolocalización en tiempo real (opcional)
- Verificación de identidad con documento
```

#### Largo Plazo (2+ años)
```
- VR/AR experiences (metaverso erótico)
- Integración con wearables
- Voice-only mode (solo audio anónimo)
- Expansión a web3 (perfiles descentralizados)
```

---

## 📊 Métricas Clave (KPIs)

### Métricas de Producto

#### Adquisición
```
- Registros diarios/mensuales
- CAC (Customer Acquisition Cost)
- Fuentes de tráfico (orgánico, paid, viral)
- Tasa de conversión (visita → registro)
```

#### Activación
```
- % usuarios que completan perfil
- % usuarios que entran en primer chat
- % usuarios que logran primer match
- Time to first match
```

#### Retención
```
- DAU / MAU (Daily/Monthly Active Users)
- Retention curves (Day 1, 7, 30)
- Churn rate
- Frequency de uso (sesiones por semana)
```

#### Engagement
```
- Mensajes enviados por usuario
- Duración promedio de chat
- Matches por usuario
- % usuarios que extienden tiempo de chat
```

#### Monetización
```
- ARPU (Average Revenue Per User)
- ARPPU (Average Revenue Per Paying User)
- Conversion rate (free → premium)
- LTV (Lifetime Value)
- LTV:CAC ratio (objetivo: >3)
```

### Métricas de Seguridad

```
- Reportes recibidos por 1000 usuarios
- Tiempo promedio de resolución de reportes
- % de reportes que resultan en acción
- Tasa de usuarios baneados
- Incidentes de seguridad (objetivo: 0)
```

### Métricas de Negocio

```
- MRR (Monthly Recurring Revenue)
- Revenue por canal (Premium, Créditos, Ads)
- Churn rate de suscripciones
- NPS (Net Promoter Score)
```

---

## 🎨 Anexo: Wireframes y User Flows

### User Flow: Primer Uso

```
[Landing Page]
    │
    ├─ [Registro] → [Verificación Email] → [Onboarding]
    │                                           │
    │                                      [Edad + Género]
    │                                           │
    │                                      [Preferencias]
    │                                           │
    │                                      [Intereses]
    │                                           ↓
    └──────────────────────────────────→ [Home: Buscar Match]
                                              │
                                         [Cola de Matching]
                                              │
                                         [Chat Anónimo]
                                              │
                                    ┌─────────┴─────────┐
                                    │                   │
                              [Match Exitoso]    [No Match / Timeout]
                                    │                   │
                              [Chat Permanente]   [Buscar Nuevo Match]
                              [Perfil Revelado]
```

### Wireframe: Chat Anónimo

```
┌───────────────────────────────────────────┐
│  ← Salir    Anon_Blue 🔵    ⏱️ 18:32  ⚙️  │
├───────────────────────────────────────────┤
│                                           │
│  🔵 Anon_Blue                             │
│  Hola! Me encanta tu energía 😏           │
│                                    19:56  │
│                                           │
│                          Anon_Red 🔴:     │
│                          Gracias! ¿De     │
│                          dónde eres?      │
│                                    19:57  │
│                                           │
│  🔵 Anon_Blue                             │
│  De Barcelona. ¿Y tú?                     │
│                                    19:58  │
│                                           │
│              🔴 está escribiendo...       │
│                                           │
├───────────────────────────────────────────┤
│ 💬  Escribe un mensaje...            [📎]│
├───────────────────────────────────────────┤
│  ⏱️ +10 min    ❤️ Match    🚫 Salir      │
└───────────────────────────────────────────┘
```

### Wireframe: Match Exitoso

```
┌───────────────────────────────────────────┐
│                                           │
│              🎉 ¡ES UN MATCH! 🎉          │
│                                           │
│   ┌─────────────┐     ┌─────────────┐    │
│   │             │     │             │    │
│   │   [Foto 1]  │     │   [Foto 2]  │    │
│   │             │     │             │    │
│   └─────────────┘     └─────────────┘    │
│                                           │
│     Ana, 28              Carlos, 30       │
│     Barcelona            Barcelona        │
│                                           │
│  "Me encanta el arte"  "Fotógrafo amateur"│
│                                           │
├───────────────────────────────────────────┤
│                                           │
│  Ahora pueden compartir fotos y seguir    │
│  chateando sin límite de tiempo.          │
│                                           │
│         [💬 Ir al Chat]                   │
│         [👤 Ver Perfil]                   │
│                                           │
└───────────────────────────────────────────┘
```

---

## 🔧 Anexo: Especificaciones Técnicas

### API Endpoints (Ejemplos)

#### Authentication
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/verify-email
POST   /api/v1/auth/forgot-password
```

#### Matching
```
POST   /api/v1/matching/join-queue
DELETE /api/v1/matching/leave-queue
GET    /api/v1/matching/status
```

#### Chat
```
GET    /api/v1/chats
GET    /api/v1/chats/:chatId
GET    /api/v1/chats/:chatId/messages
POST   /api/v1/chats/:chatId/extend-time
POST   /api/v1/chats/:chatId/match-request
DELETE /api/v1/chats/:chatId/leave
```

#### User
```
GET    /api/v1/users/me
PATCH  /api/v1/users/me
GET    /api/v1/users/:userId/profile
POST   /api/v1/users/me/upload-photo
DELETE /api/v1/users/me/photo/:photoId
```

#### Moderation
```
POST   /api/v1/reports
POST   /api/v1/users/:userId/block
DELETE /api/v1/users/:userId/unblock
GET    /api/v1/users/blocked
```

#### Payment
```
GET    /api/v1/subscriptions
POST   /api/v1/subscriptions/subscribe
POST   /api/v1/subscriptions/cancel
GET    /api/v1/credits/balance
POST   /api/v1/credits/purchase
POST   /api/v1/credits/spend
```

### WebSocket Events

```javascript
// Client → Server
{
  'chat:join': { chatId },
  'chat:leave': { chatId },
  'message:send': { chatId, content },
  'typing:start': { chatId },
  'typing:stop': { chatId },
  'match:request': { chatId }
}

// Server → Client
{
  'chat:joined': { chatId, participants },
  'chat:user_joined': { chatId, userId },
  'chat:user_left': { chatId, userId },
  'message:received': { chatId, message },
  'typing:user_typing': { chatId, userId },
  'chat:time_extended': { chatId, newEndTime },
  'match:success': { chatId, revealedProfiles },
  'match:failed': { chatId, reason },
  'chat:ended': { chatId, reason }
}
```

### Database Schema (Simplified)

```sql
-- users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    age_verified BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    credits INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_active TIMESTAMP,

    CONSTRAINT age_check CHECK (date_of_birth <= CURRENT_DATE - INTERVAL '18 years')
);

-- profiles table
CREATE TABLE profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    gender VARCHAR(20),
    interested_in JSONB, -- ['male', 'female', 'non-binary']
    city VARCHAR(100),
    region VARCHAR(100),
    coordinates POINT,
    bio TEXT,
    interests JSONB, -- array of tags
    preferences JSONB, -- {minAge, maxAge, maxDistance, lookingFor}
    photos JSONB, -- array of photo URLs
    updated_at TIMESTAMP DEFAULT NOW()
);

-- chats table
CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_a_id UUID REFERENCES users(id),
    user_b_id UUID REFERENCES users(id),
    status VARCHAR(20), -- 'active', 'ended', 'matched'
    started_at TIMESTAMP DEFAULT NOW(),
    ends_at TIMESTAMP,
    matched_at TIMESTAMP,

    UNIQUE(user_a_id, user_b_id)
);

-- matches table
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_a_id UUID REFERENCES users(id),
    user_b_id UUID REFERENCES users(id),
    chat_id UUID REFERENCES chats(id),
    matched_at TIMESTAMP DEFAULT NOW(),
    unmatched_at TIMESTAMP,
    status VARCHAR(20), -- 'active', 'unmatched'

    UNIQUE(user_a_id, user_b_id)
);

-- subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    tier VARCHAR(20), -- 'premium'
    stripe_subscription_id VARCHAR(255),
    status VARCHAR(20), -- 'active', 'canceled', 'expired'
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- reports table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID REFERENCES users(id),
    reported_id UUID REFERENCES users(id),
    chat_id UUID REFERENCES chats(id),
    reason VARCHAR(50),
    description TEXT,
    status VARCHAR(20), -- 'pending', 'reviewed', 'resolved'
    created_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP,
    resolved_by UUID REFERENCES users(id)
);
```

---

## 📝 Conclusión

Esta especificación proporciona una base sólida para construir **Ero Chat**, una plataforma de dating erótico que prioriza:

1. **Conexión auténtica** sobre apariencia física
2. **Privacidad y anonimato** como pilares fundamentales
3. **Seguridad y moderación** proactivas
4. **Modelo de negocio sostenible** con valor real para usuarios
5. **Diseño ético y responsable**

### Próximos Pasos

1. **Validación de Concepto**: Encuestas a audiencia objetivo
2. **Prototipo Interactivo**: Figma mockups + clickable prototype
3. **MVP Development**: Iniciar con Fase 1 del roadmap
4. **Legal Review**: Consulta con abogados especializados en apps adultas
5. **Security Audit**: Contratar firma de seguridad para revisión

### Factores Críticos de Éxito

✅ **Masa crítica de usuarios**: Necesario para matching efectivo
✅ **Moderación efectiva**: Confianza y seguridad
✅ **UX excepcional**: Competir con apps establecidas
✅ **Marketing inteligente**: Romper estigma, posicionamiento claro
✅ **Cumplimiento legal**: Evitar problemas regulatorios

---

**Documento creado por:** Experto en Estrategia de Productos Digitales
**Versión:** 1.0
**Fecha:** 18 de Noviembre, 2025

*Este documento es un punto de partida. Debe iterarse basándose en investigación de usuarios, validación de mercado y feedback continuo.*
