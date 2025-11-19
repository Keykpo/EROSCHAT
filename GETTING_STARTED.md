# 🚀 Getting Started - Ero Chat Development

## Quick Start Guide

Este documento te guiará para levantar el proyecto completo en tu máquina local.

---

## 📋 Prerrequisitos

Asegúrate de tener instalado:

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **Docker** >= 24.0.0
- **Docker Compose** >= 2.0.0

Verificar versiones:
```bash
node --version
npm --version
docker --version
docker-compose --version
```

---

## 🏗️ Setup Inicial

### 1. Clonar el repositorio (si aún no lo has hecho)

```bash
git clone <repository-url>
cd EROSCHAT
```

### 2. Instalar dependencias

Desde la raíz del proyecto:

```bash
npm install
```

Esto instalará las dependencias de todos los workspaces (monorepo).

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con tu configuración. Para desarrollo local, los valores por defecto funcionarán:

```env
# Mínimo requerido para desarrollo:
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/erochat
MONGODB_URL=mongodb://localhost:27017/erochat
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-secret-change-in-production
FRONTEND_URL=http://localhost:3000
```

### 4. Levantar las bases de datos con Docker

```bash
npm run docker:up
```

Esto levantará:
- ✅ PostgreSQL en puerto `5432`
- ✅ MongoDB en puerto `27017`
- ✅ Redis en puerto `6379`
- ✅ RabbitMQ en puerto `5672` (Management UI en `15672`)

Verificar que estén corriendo:
```bash
docker ps
```

Deberías ver 4 contenedores corriendo:
- `erochat-postgres`
- `erochat-mongodb`
- `erochat-redis`
- `erochat-rabbitmq`

### 5. Ejecutar migraciones de la base de datos

```bash
cd services/auth-service
npm run prisma:migrate
npm run prisma:generate
cd ../..
```

Esto creará todas las tablas en PostgreSQL y generará el Prisma Client.

---

## 🚀 Ejecutar el proyecto

### Opción 1: Ejecutar todo en paralelo (Recomendado)

Desde la raíz del proyecto:

```bash
npm run dev
```

Esto levantará:
- 🔐 **Auth Service** en `http://localhost:3001`
- 💬 **Chat Service** en `http://localhost:3002` (cuando esté implementado)
- 🌐 **Frontend Web** en `http://localhost:3000`

### Opción 2: Ejecutar servicios individualmente

**Terminal 1 - Auth Service:**
```bash
cd services/auth-service
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd apps/web
npm run dev
```

---

## 🧪 Verificar que todo funciona

### 1. Verificar Auth Service

```bash
curl http://localhost:3001/health
```

Deberías recibir:
```json
{
  "status": "ok",
  "service": "auth-service",
  "timestamp": "2025-11-19T..."
}
```

### 2. Verificar Frontend

Abre tu navegador en: **http://localhost:3000**

Deberías ver la landing page de Ero Chat.

### 3. Probar registro de usuario

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

Deberías recibir:
```json
{
  "userId": "...",
  "email": "test@example.com",
  "message": "Registration successful. Please check your email to verify your account."
}
```

---

## 🛠️ Herramientas de Desarrollo

### Prisma Studio (Database GUI)

```bash
cd services/auth-service
npm run prisma:studio
```

Se abrirá en `http://localhost:5555` - puedes ver y editar datos de la base de datos.

### RabbitMQ Management

Abre `http://localhost:15672`
- Usuario: `admin`
- Contraseña: `admin`

### Ver logs de Docker

```bash
npm run docker:logs
```

O para un servicio específico:
```bash
docker logs -f erochat-postgres
```

---

## 📁 Estructura del Proyecto

```
EROSCHAT/
├── services/
│   ├── auth-service/          # ✅ Servicio de autenticación (COMPLETO)
│   ├── chat-service/          # ⏳ Próximamente
│   └── matching-service/      # ⏳ Próximamente
│
├── apps/
│   └── web/                   # ✅ Frontend Next.js (Landing page lista)
│
├── shared/                    # 📦 Código compartido
│   ├── types/
│   ├── utils/
│   └── constants/
│
├── infrastructure/
│   └── docker/                # 🐳 Docker configs
│
├── docs/                      # 📚 Documentación
│   ├── PRODUCT_DESIGN_SPECIFICATION.md
│   ├── TECHNICAL_ARCHITECTURE.md
│   └── ROADMAP.md
│
└── docker-compose.yml         # Bases de datos
```

---

## 🔍 Scripts Disponibles

### Root (Monorepo)

```bash
npm run dev              # Ejecutar todos los servicios
npm run build            # Build de todos los servicios
npm run test             # Tests de todos los servicios
npm run lint             # Lint de todos los servicios
npm run docker:up        # Levantar bases de datos
npm run docker:down      # Bajar bases de datos
npm run docker:logs      # Ver logs de Docker
```

### Auth Service

```bash
npm run dev              # Development con hot reload
npm run build            # Build TypeScript
npm run start            # Production
npm run test             # Run tests
npm run prisma:migrate   # Run database migrations
npm run prisma:generate  # Generate Prisma Client
npm run prisma:studio    # Open Prisma Studio
```

### Frontend (Web)

```bash
npm run dev              # Development server
npm run build            # Production build
npm run start            # Production server
npm run lint             # ESLint
```

---

## 🐛 Troubleshooting

### Error: "Port already in use"

Si ves errores de puertos en uso:

```bash
# Ver qué está usando el puerto
lsof -i :3001
lsof -i :5432

# Matar el proceso
kill -9 <PID>
```

### Error: "Cannot connect to database"

```bash
# Reiniciar Docker containers
npm run docker:down
npm run docker:up

# Verificar que estén corriendo
docker ps
```

### Error: "Prisma Client not generated"

```bash
cd services/auth-service
npm run prisma:generate
```

### Limpiar todo y empezar de nuevo

```bash
# Bajar Docker
npm run docker:down

# Eliminar volumes de Docker
docker volume prune

# Limpiar node_modules
rm -rf node_modules
rm -rf services/*/node_modules
rm -rf apps/*/node_modules

# Reinstalar
npm install

# Levantar Docker de nuevo
npm run docker:up

# Migrations
cd services/auth-service
npm run prisma:migrate
npm run prisma:generate
```

---

## 📚 Siguiente Pasos

Una vez que tengas todo corriendo:

1. **Familiarízate con la documentación:**
   - Lee `PRODUCT_DESIGN_SPECIFICATION.md` para entender el producto
   - Lee `TECHNICAL_ARCHITECTURE.md` para entender la arquitectura
   - Lee `ROADMAP.md` para ver el plan de desarrollo

2. **Explora el código:**
   - Mira `services/auth-service/src/` para ver cómo está estructurado el backend
   - Mira `apps/web/src/` para ver el frontend

3. **Próximas tareas del roadmap:**
   - Implementar páginas de registro y login en el frontend
   - Crear el Profile Service
   - Implementar el Chat Service
   - Desarrollar el algoritmo de matching

---

## 🆘 Necesitas Ayuda?

- **Documentación del proyecto:** Ver carpeta `/docs`
- **Issues:** Reportar en GitHub Issues
- **Slack/Discord:** (si aplica)

---

## ✅ Checklist de Setup Completado

Marca cuando hayas completado cada paso:

- [ ] Node.js y Docker instalados
- [ ] Repositorio clonado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Variables de entorno configuradas (`.env`)
- [ ] Docker containers corriendo (`docker ps`)
- [ ] Migraciones ejecutadas
- [ ] Auth Service corriendo en `localhost:3001`
- [ ] Frontend corriendo en `localhost:3000`
- [ ] Test de health check exitoso
- [ ] Test de registro de usuario exitoso
- [ ] Prisma Studio funcionando

---

**¡Feliz desarrollo! 🚀**

Si todo está funcionando correctamente, estás listo para empezar a construir las próximas features del roadmap.
