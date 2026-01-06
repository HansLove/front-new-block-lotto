# Resumen de Refactorización - Block Lotto Dashboard y Plus Ultra Feature

## Contexto General

Esta refactorización transformó completamente el frontend de Block Lotto desde la identidad visual de Caos Engine (dark theme, colores rojos/naranjas) hacia una identidad propia minimalista y limpia (light theme, colores verdes/azules/teal), e integró la funcionalidad "Plus Ultra" para solicitudes manuales de high entropy mientras se mantiene la automatización de low entropy cada 10 minutos.

---

## Parte 1: Rediseño Completo de Identidad Visual

### Objetivo
Crear una identidad visual completamente nueva para Block Lotto, inspirada en el diseño de referencia que muestra un sistema de lotería limpio, minimalista, con colores neutros, blancos, azules y verdes.

### Cambios Realizados

#### 1. **Sistema de Diseño (Tailwind Config)**
**Archivo**: `tailwind.config.js`
- Añadida paleta de colores Block Lotto:
  - `lotto-green` (primary): #22c55e
  - `lotto-teal` (secondary): #14b8a6
  - `lotto-blue` (accent): #06b6d4
  - `lotto-orange` (status): #f97316
- Añadidas fuentes: sans (Inter), serif (Georgia), display (Inter)

#### 2. **Variables CSS**
**Archivo**: `src/index.css`
- Actualizado de tema dark (slate-950, red) a tema light (white, gray-50, green)
- Cambiado `--np-primary` de red (#e53e3e) a green (#22c55e)
- Actualizado `--np-surface` de dark (#0a0e1a) a light (#ffffff)
- Actualizado todos los gradientes y efectos glow

#### 3. **Componentes Rediseñados**

**Hero Section** (`src/pages/LandingPage/Hero.tsx`):
- Fondo blanco en lugar de dark gradient
- Headline: "Decentralized luck. Powered by math." en estilo italic serif
- Botón verde "Start Playing" en lugar de red
- Status bar con indicador verde operacional
- Integración de sección Active Lottos directamente en el hero

**Navbar** (`src/components/Navbar/Navbar.tsx`):
- Simplificado de dropdowns complejos a links simples
- Links: "How it works", "Transparency", "Stats"
- Botón verde "+ New Lotto"
- Botón outline "Connect"
- Fondo blanco con blur

**Landing Page** (`src/pages/LandingPage/LandingPage.tsx`):
- Removida sección "aboutcaos" (Caos Engine content)
- Layout limpio y enfocado
- Solo Hero + Login Modal

**TicketCard** (`src/components/lotto/TicketCard.tsx`):
- Rediseñado completamente:
  - Fondo blanco con bordes de color superior
  - Border teal para ACTIVE, orange para MINING
  - Badges de estado con colores apropiados
  - Tipografía clara y legible

**Footer** (`src/components/footer.tsx`):
- Tema light completo
- Colores verdes/azules en lugar de red
- Background blanco

**Loader** (`src/components/Loader/Loader.jsx`):
- Fondo blanco
- Logo Block Lotto (letra "B" en círculo azul)
- Spinner verde

**Auth Components** (Login, Modals):
- Fondos blancos
- Inputs con bordes grises claros
- Botones verdes
- Texto dark en lugar de white

**App Layouts** (`src/App.tsx`):
- Removidos efectos de partículas rojas
- Fondos blancos/grises claros

---

## Parte 2: Integración de Plus Ultra Feature

### Objetivo
Añadir funcionalidad para que los usuarios puedan hacer solicitudes manuales de high entropy (Plus Ultra) mientras el sistema continúa con las llamadas automáticas de low entropy cada 10 minutos manejadas por el backend scheduler.

### Arquitectura

```
Backend Scheduler (cada 10 min) 
  → requestLowEntropy 
  → LottoAttempt DB 
  → Socket: lotto:attempt 
  → Frontend Update

Usuario presiona "Plus Ultra"
  → requestHighEntropy (12 stars)
  → Entropy Service
  → Socket: entropy:completed
  → Frontend Update + Notificación
```

### Cambios Realizados

#### 1. **Servicios de Entropía**
**Archivo**: `src/services/entropy.ts`
- Exportado tipos `EntropyCompleted` y `LowEntropyResponse` para reutilización
- Funciones `requestHighEntropy` y `requestLowEntropy` ya existían y se reutilizan

**Archivo**: `src/services/lotto.ts`
- **Nueva función**: `requestTicketHighEntropy(ticket, stars=12, seed?)`
  - Reutiliza `requestHighEntropy` de entropy.ts
  - Genera hex seed automáticamente si no se provee
  - Retorna `EntropyCompleted`
  
- **Nueva función**: `requestTicketLowEntropy(ticket, stars=5)`
  - Reutiliza `requestLowEntropy` de entropy.ts
  - Para futuras implementaciones de intentos manuales low entropy

#### 2. **Hook useLotto**
**Archivo**: `src/hooks/useLotto.ts`
- **Nuevos estados**:
  - `highEntropyPending`: Record de ticket IDs con solicitudes pendientes
  - `highEntropyResults`: Record de resultados de high entropy por ticket

- **Nueva función**: `requestHighEntropyAttempt(ticket, stars=12, seed?)`
  - Maneja el estado de pending
  - Llama a `requestTicketHighEntropy`
  - Actualiza estados cuando se completa
  - Maneja errores

- **Nuevo listener de socket**: `entropy:completed`
  - Escucha eventos de high entropy completados
  - Actualiza tickets con nuevos intentos
  - Actualiza estados de pending/results

- **Retorna**: 
  - Nuevos valores: `requestHighEntropyAttempt`, `highEntropyPending`, `highEntropyResults`

#### 3. **Componente TicketCard**
**Archivo**: `src/components/lotto/TicketCard.tsx`
- **Nuevas props**:
  - `onPlusUltra?: (ticket: LottoTicket) => void` - Callback para Plus Ultra
  - `isPlusUltraPending?: boolean` - Estado de loading

- **Nuevo botón "Plus Ultra"**:
  - Aparece solo en tickets activos
  - Estilo: gradient orange, icono Zap
  - Muestra spinner cuando está pending
  - Deshabilitado durante solicitudes pendientes

#### 4. **Dashboard de Lotto**
**Archivo**: `src/pages/lotto/lottodashboard.tsx`
- **Verificación de sesión**:
  - Redirige a login si no está autenticado
  - Usa `isSessionActive` del hook `useAuth`

- **Nueva función**: `handlePlusUltra(ticket)`
  - Muestra toast de inicio
  - Llama a `requestHighEntropyAttempt`
  - Muestra toast de éxito con leading zeros
  - Maneja errores y timeouts
  - Refresca tickets después de completar

- **Integración de Plus Ultra**:
  - Pasa `handlePlusUltra` como prop a TicketCard
  - Pasa `highEntropyPending[ticket.ticketId]` para estado de loading
  - ToastContainer para notificaciones

- **Sección de información actualizada**:
  - Añadido paso 3 explicando "Plus Ultra - High Entropy Mining"

#### 5. **Login Component**
**Archivo**: `src/components/Login/Login.tsx`
- **Fix de sesión**:
  - Ahora guarda el token en localStorage después de login por email
  - `handleEmailLogin` ahora incluye: `localStorage.setItem('token', token)`
  - La sesión se mantiene correctamente después del login

---

## Flujo de Plus Ultra

1. **Usuario presiona "Plus Ultra"** en un ticket activo
2. **Frontend**:
   - Llama a `handlePlusUltra(ticket)` en dashboard
   - Muestra toast "Initiating Plus Ultra..."
   - Actualiza estado `highEntropyPending[ticketId] = true`
   - TicketCard muestra botón con spinner

3. **Solicitud**:
   - `handlePlusUltra` → `requestHighEntropyAttempt(ticket, 12)`
   - `requestHighEntropyAttempt` → `requestTicketHighEntropy(ticket, 12)`
   - `requestTicketHighEntropy` genera seed automáticamente si no se provee
   - `requestTicketHighEntropy` → `requestHighEntropy(address, 12, seed)`

4. **Backend procesa**:
   - `requestHighEntropy` hace POST a `/api/entropy/high`
   - Backend mina high entropy (12 stars)
   - Cuando completa, emite socket event `entropy:completed`

5. **Frontend recibe resultado**:
   - Socket listener en `useLotto` recibe `entropy:completed`
   - Actualiza ticket con nuevo intento
   - Actualiza `highEntropyPending[ticketId] = false`
   - Guarda resultado en `highEntropyResults[ticketId]`
   - Promise en `requestHighEntropyAttempt` se resuelve

6. **UI actualiza**:
   - Toast de éxito con leading zeros
   - TicketCard muestra botón normal (sin spinner)
   - Contador de intentos se actualiza
   - Tickets se refrescan para mostrar datos más recientes

---

## Diferencias Clave: Automático vs Plus Ultra

| Aspecto | Automático (Backend Scheduler) | Plus Ultra (Manual) |
|---------|-------------------------------|---------------------|
| **Frecuencia** | Cada 10 minutos | Cuando el usuario presiona el botón |
| **Stars** | 5 (default del ticket) | 12 (hardcoded) |
| **Entropy Type** | Low | High |
| **Tiempo** | ~15 segundos | Hasta 60 segundos |
| **Socket Event** | `lotto:attempt` | `entropy:completed` |
| **Seed** | No requiere | Hex seed de 8 caracteres (auto-generado) |
| **Probabilidad de Block** | Estándar | Mayor (más leading zeros) |

---

## Archivos Modificados

### Diseño Visual
1. `tailwind.config.js` - Paleta de colores Block Lotto
2. `src/index.css` - Variables CSS light theme
3. `src/pages/LandingPage/Hero.tsx` - Rediseño completo
4. `src/pages/LandingPage/LandingPage.tsx` - Simplificación
5. `src/components/Navbar/Navbar.tsx` - Simplificación
6. `src/components/lotto/TicketCard.tsx` - Rediseño + Plus Ultra button
7. `src/components/footer.tsx` - Light theme
8. `src/components/Loader/Loader.jsx` - Light theme + Block Lotto branding
9. `src/components/Login/Login.tsx` - Light theme + fix de token storage
10. `src/components/modals/LoginRequiredModal.tsx` - Light theme
11. `src/components/modals/HeadlessModal.tsx` - Light theme
12. `src/App.tsx` - Removidos efectos dark theme

### Plus Ultra Feature
1. `src/services/entropy.ts` - Exportación de tipos
2. `src/services/lotto.ts` - Funciones de entropía para tickets
3. `src/hooks/useLotto.ts` - Manejo de high entropy y socket events
4. `src/pages/lotto/lottodashboard.tsx` - Integración completa de Plus Ultra
5. `src/components/lotto/TicketCard.tsx` - Botón Plus Ultra

---

## Notas Técnicas Importantes

1. **Sockets**: El sistema usa dos sockets diferentes:
   - Socket en `useLotto` para eventos de lotto (`lotto:attempt`, `lotto:block_mined`)
   - Socket en `entropy.ts` (getSocket) para eventos de entropy (`entropy:completed`)
   - Ambos se conectan al mismo API_URL pero manejan diferentes eventos

2. **Estados de Loading**: 
   - `highEntropyPending` es un Record<string, boolean> para trackear múltiples tickets
   - Cada ticket puede tener su propio estado de pending independiente

3. **Seed Generation**:
   - Se genera automáticamente si no se provee
   - Debe ser exactamente 8 caracteres hex
   - Función `generateHexSeed()` en `entropy.ts`

4. **Error Handling**:
   - Timeout de 60 segundos para high entropy
   - Toasts informativos para el usuario
   - Errores se capturan y se muestran apropiadamente

5. **Session Management**:
   - Token se guarda en localStorage después de login
   - Dashboard verifica sesión y redirige si no está autenticado
   - useLotto requiere token para funcionar

---

## Próximos Pasos Sugeridos

1. **Backend**: Verificar que el scheduler de lotto sigue funcionando correctamente
2. **Testing**: Probar flujo completo de Plus Ultra
3. **UI/UX**: Considerar añadir animaciones cuando se completa Plus Ultra
4. **Optimización**: Considerar debouncing para prevenir múltiples clicks rápidos
5. **Documentación**: Actualizar documentación de usuario sobre Plus Ultra

