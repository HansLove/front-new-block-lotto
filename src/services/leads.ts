import { buildUrl, SEND_FORM } from "@/utils/routes";

export interface LeadPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  system?: string;
  systemData?: Record<string, any>;
  marketing?: Record<string, any>;
  metadata?: Record<string, any>;
  tags?: string[];
}

interface LeadResponse {
  ok?: boolean;
  success?: boolean;
  id?: string;
  message?: string;
  [k: string]: any;
}

class LeadError extends Error {
  status: number;
  bodyPreview?: string;
  constructor(msg: string, status: number, bodyPreview?: string) {
    super(msg);
    this.name = "LeadError";
    this.status = status;
    this.bodyPreview = bodyPreview;
  }
}

function parseJsonSafe(text: string, contentType: string | null) {
  if (contentType && contentType.toLowerCase().includes("application/json")) {
    try { return JSON.parse(text || "{}"); } catch { return { message: text }; }
  }
  return { message: text };
}

export async function createLead(payload: LeadPayload): Promise<LeadResponse> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 15000);

  const url = buildUrl(SEND_FORM); // ← usa .env
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
    signal: controller.signal,
  }).catch((e) => {
    throw new LeadError(`Network error: ${e?.message || e}`, 0);
  }).finally(() => clearTimeout(t));

  const contentType = res.headers.get("content-type");
  const text = await res.text();
  const data = parseJsonSafe(text, contentType);

  if (!res.ok) {
    const snippet = (text || "").slice(0, 400);
    throw new LeadError(data?.message || `Lead creation failed (${res.status})`, res.status, snippet);
  }

  return data as LeadResponse;
}
