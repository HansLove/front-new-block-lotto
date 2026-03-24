# NowPayments In-Context Integration Guide

This guide explains how to use **`@taloon/nowpayments-components`** to integrate NowPayments **without sending the user to another page**. The Lotto flow keeps the invoice (QR code, amount, address) **inside the same modal** for a cleaner UI/UX. Other fronts (e.g. API Keys / deposits) that currently send the invoice to another page can follow this approach and still use the same shared package.

---

## 1. The package: `@taloon/nowpayments-components`

The shared package is the **single source** for NowPayments UI and types across fronts. Use it in both the “redirect” and “in-context” flows so behavior and look stay consistent.

### What the package provides

| Export | Where / how to use |
|--------|---------------------|
| **`NowPaymentsProvider`** | Wrap your app (e.g. in `main.tsx`) so payment logic has config (e.g. API key). Required for any flow using the package. |
| **`import '@taloon/nowpayments-components/styles'`** | Import once at app entry so shared payment UI styles apply. |
| **`DepositModal`** | Pre-built modal: form + submit. **By default it may hand off to another view or redirect for the invoice** after `onSuccess`. That’s the “invoice on another page” behavior. |
| **`DepositFormData`** | Type for the form payload (amount, customerEmail, selectedCurrency, etc.). Use this when calling your backend from a deposit form. |
| **`PaymentDetails`** | Type for the payment result (e.g. `address`, `paymentId`). Use this when you receive the invoice payload from your API. |
| **`USDTNetwork`** | Enum of supported USDT networks (e.g. `USDTMATIC`, `USDTTRC20`, `USDTBSC`). Use this for the currency/network selector so both fronts use the same values. |

### Two ways to use the package

- **Option A – Use `DepositModal` as-is**  
  You get form + submit + whatever the package does after success (e.g. redirect or internal invoice view). That’s the current API Keys–style flow; the invoice often ends up on another page.

- **Option B – Use the package’s primitives and your own modal (Lotto-style, in-context)**  
  You keep **`NowPaymentsProvider`**, **styles**, and **`USDTNetwork`** (and optionally **`DepositFormData`** / **`PaymentDetails`** for types). You **do not** use `DepositModal` for the invoice. Instead you call your own backend, get the invoice data, and render the invoice **in the same modal** (or same page). This guide is about Option B.

---

## 2. Setup: use the package in the other front

1. **Install**
   ```bash
   pnpm add @taloon/nowpayments-components
   ```
   Peer deps: `react`, `react-dom`, `react-hook-form` (already in this repo).

2. **App root**
   In your app entry (e.g. `main.tsx`):
   ```ts
   import '@taloon/nowpayments-components/styles';
   import { NowPaymentsProvider } from '@taloon/nowpayments-components';

   // Wrap the app (apiKey from env or config)
   <NowPaymentsProvider apiKey={import.meta.env.VITE_NOWPAYMENTS_API_KEY}>
     <App />
   </NowPaymentsProvider>
   ```

3. **Shared types and enums**
   - Use **`USDTNetwork`** for the currency/network dropdown so both fronts send the same values to the backend.
   - Optionally use **`DepositFormData`** / **`PaymentDetails`** so your payloads align with the package’s types (and with any other front using the package).

---

## 3. The problem: redirect vs in-context

| Approach | What happens | UX |
|----------|--------------|-----|
| **Redirect / other page** | User submits → invoice is shown on another route or inside `DepositModal`’s own flow → user leaves current context. | Context loss, extra navigation. |
| **In-context (this guide)** | User submits → **same modal** (or same page) updates to show QR + amount + address → user pays → status updates in place. | User stays on the same screen; cleaner UX. |

We achieve in-context by **not** handing the invoice to `DepositModal` (or another page). We create the payment via our backend, store the result in React state, and render the invoice ourselves in the **same** modal.

---

## 4. Architecture overview (in-context with the package)

Three layers:

1. **Custom hook** (e.g. `useLottoDeposit`) – Uses **`USDTNetwork`** from the package for `selectedCurrency`. Holds payment state and calls your backend (create intent → submit payment). Returns `paymentData` (invoice) and never redirects.
2. **Page** – Owns modal open/close and payment lifecycle status; uses the hook; passes data and callbacks into the modal; on close calls `resetPayment()`.
3. **Modal component** – **Uses `USDTNetwork` from the package** for the network selector and labels. Two phases in one modal: (1) form when no invoice, (2) invoice (QR, amount, address, status) when `paymentData` is set. No redirect; all actions via callbacks.

So: **the package supplies provider, styles, `USDTNetwork`, and types; your hook + page + modal own the in-context flow and the invoice UI.**

---

## 5. Hook (e.g. `useLottoDeposit.ts`)

**Role:** Payment state and API calls. Use **`USDTNetwork`** from the package for the currency state.

```ts
import { USDTNetwork } from '@taloon/nowpayments-components';
// Your API: createPaymentIntent(btcAddress), submitPayment({ orderId, cryptoCurrency })
```

- **State:** `btcAddress`, `selectedCurrency: USDTNetwork`, `paymentData` (invoice payload or `null`), `orderId`, `isPending`, `isSubmitting`, `error`.
- **Two-phase API:** (1) Create intent → `orderId`. (2) Submit payment with `orderId` + `selectedCurrency` → get back invoice (`payAddress`, `payAmount`, `payCurrency`, etc.). Set `paymentData` and `isPending`; **no redirect**.
- **Reset:** Clear everything so the next open shows the form again.

Your backend should return an object that matches what your modal needs (and can match **`PaymentDetails`** or your own type). The important part is: the hook **never navigates**; it only updates state so the modal can show the invoice in place.

---

## 6. Page (e.g. `LottoDashboardPage.tsx`)

**Role:** Modal visibility, payment lifecycle status, real-time updates (e.g. socket), success handling.

- Use the hook for all payment state and actions.
- Maintain `paymentStatus`: `'idle' | 'waiting' | 'confirming' | 'confirmed'` and pass it into the modal.
- If your backend emits socket events (e.g. payment_waiting, payment_confirming), subscribe and update `paymentStatus` by `orderId`.
- On modal close: call `resetPayment()` and, if payment is still pending, show a toast so the user knows the payment will still complete.
- On success (e.g. new resource in list): set status to `'confirmed'`, then `resetPayment()` and close the modal.

---

## 7. Modal (e.g. `BuyTicketModal.tsx`) – use package for network selector

**Role:** Present form then invoice in the **same** modal. Use **`USDTNetwork`** from the package so the selector matches the other front.

```ts
import { USDTNetwork } from '@taloon/nowpayments-components';
// Optional: local labels map
const USDT_NETWORK_LABELS: Record<USDTNetwork, string> = {
  [USDTNetwork.USDTMATIC]: 'USDT (Polygon)',
  [USDTNetwork.USDTTRC20]: 'USDT (Tron)',
  // ...
};
```

- **Phase 1 – No invoice (`paymentData === null`):** Form with address, **`USDTNetwork`** dropdown (and any other fields). Submit calls `onSubmitPayment()` → hook runs create + submit and sets `paymentData` → modal re-renders.
- **Phase 2 – Invoice ready (`paymentData !== null`):** Show QR, amount, network label, pay address, copy button, status pipeline. Close button calls `onClose` / `onForceClose`; page calls `resetPayment()` and closes modal.

So the **only** place we use the package in the modal is **`USDTNetwork`** (and optionally types for `paymentData`). The rest is your own layout and copy; no `DepositModal` for the invoice.

---

## 8. Service layer

- **Create intent** – POST to your backend (e.g. with btc_address or user id); backend creates order, returns `orderId`.
- **Submit payment** – POST with `orderId` + `cryptoCurrency` (use **`USDTNetwork`** values from the package). Backend calls NowPayments (or your payment service), returns invoice fields: address, amount, currency, paymentId, etc.

Your API response shape can align with **`PaymentDetails`** or your own type; the front just needs to display that data in the same modal.

---

## 9. Real-time status (optional)

- Backend: on “payment received” / “confirming”, emit socket events with `orderId`.
- Frontend: subscribe in the page (or a hook), update `paymentStatus` only when `event.orderId === currentOrderId` (use a ref for current order).
- Lifecycle: `idle` → `waiting` → `confirming` → `confirmed`. This keeps the user informed without leaving the page.

---

## 10. UX summary

| Practice | Reason |
|----------|--------|
| Use **`@taloon/nowpayments-components`** for provider, styles, **`USDTNetwork`**, and types | Same package across fronts; consistent networks and types. |
| Keep invoice in the **same modal** | No redirect, no context switch. |
| Don’t use **`DepositModal`** for the invoice step | You keep full control and show the invoice in your modal. |
| Reset payment state on close | Next open shows the form, not a stale invoice. |
| Toast on close while pending | User knows the payment will still complete. |

---

## 11. Checklist for the other front

- [ ] **Package:** Install `@taloon/nowpayments-components`; in app entry import styles and wrap app with **`NowPaymentsProvider`**.
- [ ] **Backend:** Create intent (return `orderId`); create payment with `orderId` + crypto (use **`USDTNetwork`** values); return invoice fields (address, amount, currency).
- [ ] **Hook:** Use **`USDTNetwork`** for `selectedCurrency`; one hook with form state, `paymentData`, `orderId`, loading, error; one `submitPayment()` that does both API steps and sets `paymentData`; one `resetPayment()`.
- [ ] **Page:** Owns modal open/close and `paymentStatus`; uses the hook; passes `paymentData`, status, and callbacks to the modal; on close calls `resetPayment()`; handles success and then resets + closes.
- [ ] **Modal:** Uses **`USDTNetwork`** for the network selector and labels. Two phases: form when `paymentData === null`, invoice (QR, amount, address, status) when `paymentData !== null`. No redirect; no `DepositModal` for the invoice step.
- [ ] **Optional:** Socket events keyed by `orderId` to drive `paymentStatus`.

Using the package this way gives you a single, consistent NowPayments integration across fronts while keeping the invoice in-context for a cleaner UI/UX.
