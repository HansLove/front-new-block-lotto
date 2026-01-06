Brutal. Ya tienes el “core loop” completo (pago → ticket → scheduler → attempts → transparencia + realtime). Los siguientes pasos ya no son “features”, son **hardening + conversión + operación**.

## Siguientes pasos (prioridad real)

### 1) Seguridad + anti-abuso (antes de meter tráfico)

* **Rate limits** en endpoints (stats, attempts, create) y en Socket events.
* **AuthZ**: que un user solo lea *sus* tickets/attempts (y lo público sea explícito).
* **Webhook hardening**: firma verificada, idempotency keys, evitar doble-creación de tickets.
* **Input validation**: address BTC (bech32/base58), frequency/validity locked desde server.

### 2) Correctitud económica / fairness

* Define reglas de participación:

  * Si un ticket se compra a mitad del ciclo: ¿entra en el intento inmediato o en el siguiente?
  * Si expira en medio del ciclo: ¿cuál es el corte?
* **Snapshot por round**: lista de tickets activos *en el instante del intento* (para auditoría).

### 3) Transparencia “audit-grade”

* Página / endpoint público: **Attempt Proof**

  * requestId, blockHeight observado, timestamp, target/difficulty, hash result, seed/headers usados
  * link directo a explorer del blockHeight (aunque sea por UI)
* **Export/CSV** de attempts y tickets (para confianza y para tu operación).

### 4) UX que convierte (rápido y sin fricción)

* En dashboard: 3 elementos que suben conversion:

  1. **Funnel 3 pasos** fijo + CTA
  2. **Tu probabilidad actual** (human readable) + “what changes if I buy another ticket”
  3. **Próximo intento en** + estado live (sin “gambly vibes”)
* “Plus Ultra”: que sea épico pero **con copy sobrio** (“High-Power Attempt”, no “Mega Win”).

### 5) Observabilidad + operación (esto te salva)

* Logs estructurados + metrics:

  * attempts/min, success rate de jobs, latencia de Caos Engine, fallos de payments/webhooks
* Alertas:

  * si scheduler se detiene
  * si block-monitor no detecta blocks por X minutos
  * si hay backlog de attempts

### 6) Performance y escalabilidad

* DB indexes: `ticketId`, `userId`, `createdAt`, `status`, `roundId`.
* Archivado: attempts viejos a cold storage o paginación estricta.
* Socket rooms por user/ticket para no spamear.

### 7) Legal / copy compliance (rápido)

* Disclaimer visible y consistente (“probability-based”, “no guarantee”).
* Términos básicos: condiciones del ticket, expiración, refunds, jurisdicción.

---

## “Next 72h plan” (si quieres momentum)

**Día 1:** webhook idempotency + authz audit + rate limits
**Día 2:** Attempt Proof page + snapshot por round + export CSV
**Día 3:** UX conversion pass (funnel fijo + probabilidad + CTA) + observabilidad/alerts

---

Si me dices qué te duele más ahorita (conversión, confianza, estabilidad, o riesgo de pagos duplicados), te armo un **.md de implementación** con checklist por archivos y tareas para tu equipo.
