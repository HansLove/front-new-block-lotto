// src/utils/routes.ts
const IS_PROD = import.meta.env.NEXT_PUBLIC_TEST_MODE === "1";

const RAW_BASE =
  (IS_PROD
    ? import.meta.env.VITE_PUBLIC_MAINTANCE
    : import.meta.env.VITE_TESTNET_MAINTANCE) || "";

const API_BASE = RAW_BASE.replace(/\/+$/, ""); // sin slash final
export const SEND_FORM =
  import.meta.env.NEXT_PUBLIC_BACKOFFICE_LEADS_PATH || "/leads";

export function buildUrl(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${p}`;
}
