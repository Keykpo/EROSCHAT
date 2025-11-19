# Ero Chat - Mobile App (React Native + Expo)

Aplicación móvil cross-platform (iOS + Android) para Ero Chat.

## 🚀 Tecnologías

- **React Native** con **Expo**
- **TypeScript**
- **React Navigation** (navegación nativa)
- **Zustand** (state management)
- **Socket.io-client** (WebSocket real-time)
- **Axios** (HTTP client)
- **AsyncStorage** (persistencia local)
- **Expo Image Picker** (subida de fotos)
- **Expo Notifications** (push notifications)

## 📱 Características Implementadas

### Autenticación
- ✅ Login con email/password
- ✅ Registro de usuarios
- ✅ Persistencia de sesión con AsyncStorage
- ✅ Auto-refresh de tokens

### Onboarding
- ✅ 3 pasos: Info básica, Preferencias, Intereses & Fotos
- ✅ Subida de fotos (hasta 6)
- ✅ Selección de intereses
- ✅ Configuración de preferencias de matching

### Chat Anónimo
- ✅ Búsqueda de chat en tiempo real
- ✅ Chat con Socket.io
- ✅ Timer de 20 minutos
- ✅ Indicador de escritura
- ✅ Sistema de match durante el chat

### Matches
- ✅ Lista de matches activos
- ✅ Chat permanente con matches
- ✅ Unmatch con bloqueo

### Perfil
- ✅ Vista del perfil completo
- ✅ Gestión de fotos
- ✅ Edición de preferencias
- ✅ Logout

## 📂 Estructura del Proyecto

```
apps/mobile/
├── src/
│   ├── api/              # API client y Socket.io
│   │   ├── client.ts     # HTTP client con Axios
│   │   └── socket.ts     # Socket.io client
│   ├── components/       # Componentes reutilizables
│   ├── navigation/       # React Navigation setup
│   │   ├── AppNavigator.tsx       # Navegador principal
│   │   └── MainTabNavigator.tsx   # Tabs del bottom
│   ├── screens/          # Pantallas de la app
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   ├── MatchesScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── store/            # Zustand stores
│   │   ├── authStore.ts
│   │   ├── chatStore.ts
│   │   └── matchStore.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   └── utils/            # Utilidades
├── App.tsx               # Entry point
├── app.json             # Expo config
└── package.json

```

## 🛠️ Instalación

Desde la raíz del monorepo:

```bash
# Instalar dependencias
npm install

# Navegar a la app mobile
cd apps/mobile

# Iniciar Expo
npm start
```

O desde la raíz del monorepo:

```bash
npm run dev:mobile
```

## 📱 Ejecutar en Dispositivos

### iOS (requiere macOS)

```bash
npm run ios
```

### Android

```bash
npm run android
```

### Web (para desarrollo rápido)

```bash
npm run web
```

### Expo Go (recomendado para testing)

1. Instala **Expo Go** en tu dispositivo móvil ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
2. Ejecuta `npm start`
3. Escanea el código QR con Expo Go

## ⚙️ Configuración

### Backend URL

Edita `/home/user/EROSCHAT/apps/mobile/src/api/client.ts:5` y `/home/user/EROSCHAT/apps/mobile/src/api/socket.ts:4`:

```typescript
const API_URL = __DEV__
  ? 'http://localhost:3000/api/v1'  // Development
  : 'https://api.erochat.com/api/v1'; // Production
```

**Nota para Android Emulator:** Usa `http://10.0.2.2:3000/api/v1` en lugar de `localhost`

**Nota para dispositivos físicos:** Usa la IP local de tu computadora (ej: `http://192.168.1.100:3000/api/v1`)

### AsyncStorage

Las sesiones se persisten automáticamente usando AsyncStorage:
- `accessToken` - JWT access token
- `refreshToken` - JWT refresh token
- `user` - Datos del usuario

## 🎨 Tema y Estilos

La app usa el mismo esquema de colores que el web:
- Background: `#0a0a0b`
- Cards: `#1a1a1b`
- Borders: `#2a2a2b`
- Primary (Rojo): `#ef4444`
- Text: `#fff`, `#e5e7eb`, `#9ca3af`, `#6b7280`

## 🔌 WebSocket Events

La app se conecta a Socket.io y escucha:
- `matching:found` - Match encontrado
- `chat:message` - Nuevo mensaje
- `chat:typing` - Usuario escribiendo
- `chat:ended` - Chat terminado
- `chat:matched` - Match aceptado

## 📝 TODO / Mejoras Futuras

- [ ] Implementar push notifications reales (actualmente solo setup básico)
- [ ] Agregar imágenes reales en lugar de placeholders
- [ ] Implementar geolocalización real
- [ ] Agregar animaciones con Reanimated
- [ ] Implementar deep linking
- [ ] Agregar tests (Jest + React Native Testing Library)
- [ ] Optimizar rendimiento de listas con FlashList
- [ ] Agregar manejo de errores más robusto
- [ ] Implementar modo offline
- [ ] Agregar analytics (Firebase/Amplitude)

## 🐛 Debugging

### React Native Debugger

```bash
# Instalar
brew install --cask react-native-debugger

# Ejecutar
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

### Logs

```bash
# Ver logs de iOS
npm run ios -- --verbose

# Ver logs de Android
npm run android -- --verbose

# Logs de Expo
npx expo start --dev-client
```

## 📦 Build para Producción

### Con Expo Application Services (EAS)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Configurar build
eas build:configure

# Build para iOS
eas build --platform ios

# Build para Android
eas build --platform android
```

### Submit a App Stores

```bash
# iOS App Store
eas submit --platform ios

# Google Play Store
eas submit --platform android
```

## 📄 Licencia

Proprietary - Ero Chat Platform
