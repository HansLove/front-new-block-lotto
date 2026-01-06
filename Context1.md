Block-Lotto

### Frontend Migration & Product Transformation Guide

**Version:** 1.1
**Status:** Ready for execution
**Base:** Caos Engine Frontend (auth + payments + entropy already implemented)

---

## 1. Objetivo del Fork

Transformar el frontend actual de **Caos Engine** en un nuevo producto llamado **Block-Lotto**, sin romper infraestructura existente.

Block-Lotto es:

- ❌ No una lotería tradicional
- ❌ No un casino
- ✅ Un **sistema de participación probabilística**
- ✅ Basado en **intentos reales de Proof-of-Work**
- ✅ Totalmente transparente y verificable

El sistema ejecuta **intentos automáticos de minado cada 10 minutos** (5 estrellas / 5 ceros), y **si ocurre el evento real de minar un bloque de Bitcoin**, el premio se envía **directamente a la dirección BTC del usuario activo**.

---

## 2. Qué se conserva (NO tocar)

⚠️ **Nada de esto se reescribe, solo se reutiliza**

- Sistema de autenticación (wallet / email / sesión)
- Sistema de pagos Taloon + NowPayments
- Gestión de balances / depósitos
- API de Caos Engine (entropy + PoW)
- Infraestructura de randomization
- Soporte de minería real (High Quality Randomization)
- Backend existente de eventos y jobs

---

## 3. Cambio central: Ángulo del Producto

### Antes (Caos Engine)

- Entropía como servicio
- Resultados abstractos
- Uso técnico

### Ahora (Block-Lotto)

- Participación continua
- Intentos visibles
- Evento único y real (bloque BTC)
- Narrativa clara: **participas siempre, ganas solo si ocurre**

---

## 4. Modelo Mental del Usuario (clave UX)

El frontend debe comunicar **solo estas 3 verdades**:

1. 🟢 El sistema está activo todo el tiempo
2. 🔍 Cada intento es real y verificable
3. 🎲 Participar aumenta presencia, **no garantiza resultados**

Nada más.

---

## 5. Funnel de Participación (núcleo del producto)

Este funnel debe ser **visible, repetido y obvio** en toda la UI.

### Funnel Oficial

**Paga $10 → Incrementan creditos → ganas si se mina un bloque a la direccion de Bitcoin definida**

#### Paso 1 — Paga $10

- Compra una instancia de lotto(un ticket de loteria que se renueva cada que se mina un bloque de Bitcoin)
- Acceso inmediato

#### Paso 2 — Participas siempre

- Intentos automáticos cada 10 minutos(aprox)
- Ticket activo = participación continua
- No necesitas volver a hacer nada

#### Paso 3 — Ganas si se mina un bloque

- Probabilidad pura
- Evento real
- BTC enviado directo a tu address

**Texto aclaratorio obligatorio (debajo):**

> Block-Lotto se basa en probabilidad.
> No todos los intentos generan un bloque.
> El sistema nunca se detiene.

---

## 6. Ticket = Estado Persistente

El ticket NO es un “boleto”, es un **estado activo del sistema**.

### Ticket Properties

- Ticket ID verificable
- Frecuencia: cada 10 minutos
- Validez: X días (ej. 30)
- Dirección BTC asociada
- Participa automáticamente en **todos** los intentos

---

## 7. Arquitectura de Requests (clave técnica)

### Flujo normal (default)

1. Nuevo bloque detectado / nuevo ciclo
2. Block-Lotto solicita a Caos Engine:
   - PoW request de **5 estrellas**

3. Request incluye:
   - BTC address del usuario activo

4. Resultado:
   - Hash generado
   - Block minado ❌ / ✅

5. Resultado visible en frontend

⚠️ **Nunca ocultar intentos fallidos**

---

## 8. Transparencia Total (Sección obligatoria)

### Card: Último Intento del Sistema

Debe existir **siempre visible**, no escondida.

Mostrar:

- Request ID
- Nonce
- Hash generado
- Altura del bloque
- Dificultad
- Timestamp
- Resultado visual:
  - ❌ Intento no ganador
  - ✅ Bloque minado

Texto de confianza:

> Este fue un intento real de minado.
> El sistema continuará automáticamente con el siguiente intento.

---

## 9. Relación Funnel + Datos Técnicos

Debajo del intento técnico, texto fijo:

> Cada ticket activo participa en **todos los intentos automáticos** del sistema.
> Cuando ocurre un bloque real, los participantes activos son los beneficiados.

CTA inmediato:
**Participar en el próximo intento**

---

## 10. CTA Principal

**Comprar Ticket Mensual — $10**

- Botón verde elegante
- Hover suave
- Microcopy debajo:

  > Participas automáticamente cada 10 minutos

---

## 11. Identidad Visual (resumen)

- Fondo: Blanco cálido
- Cards: Gris claro
- Bordes: Plateado
- CTA principal: Verde
- Detalles técnicos / cripto: Naranja BTC
- Urgencia temporal: Rojo suave
- Tipografía clara, no agresiva

implying seriousness, not gambling.

---

## 12. Estados del Sistema (muy importante)

### Estado Normal

- Intentos de 5 estrellas
- Ritmo constante
- UI estable

### Estado Especial — **PLUS ULTRA MODE** 🚀

Este modo usa **minería real de gran escala**.

#### Activación

- Evento especial
- Llamada a minería de **12–14 estrellas**
- Duración: segundos

#### UX Requerida

- Card del lotto entra en estado **“Super Charged”**
- Animación tipo _Guitar Hero_:
  - Barras de energía
  - Pulso intenso
  - Feedback visual de carga

- Copy sugerido:

  > High-Power Mining in Progress
  > Increased Difficulty Attempt

⚠️ Importante:

- No prometer nada
- No cambiar probabilidades visibles
- Solo comunicar que el intento es **más costoso y más intenso**
