import { toast } from "react-hot-toast";

type Variant = "success" | "error" | "info" | "loading";

const variantStyles: Record<Variant, { ring: string; badge: string; emoji: string }> = {
  success: { ring: "ring-emerald-400/30", badge: "from-emerald-500 to-emerald-400", emoji: "✅" },
  error:   { ring: "ring-rose-400/30",    badge: "from-rose-500 to-rose-400",       emoji: "⚠️" },
  info:    { ring: "ring-sky-400/30",     badge: "from-sky-500 to-sky-400",         emoji: "ℹ️" },
  loading: { ring: "ring-orange-400/30",  badge: "from-orange-500 to-orange-400",   emoji: "⏳" },
};

function ToastCard({
  title,
  message,
  variant,
  onClose,
}: { title: string; message?: string; variant: Variant; onClose?: () => void }) {
  const v = variantStyles[variant];
  return (
    <div
      className={[
        "pointer-events-auto w-[min(92vw,420px)] rounded-2xl border border-white/10",
        "bg-gradient-to-b from-neutral-950/95 to-neutral-900/90 backdrop-blur-xl",
        "shadow-[0_20px_80px_-20px_rgba(0,0,0,.7)] px-4 py-3 ring-1", v.ring,
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className={`grid place-items-center h-9 w-9 rounded-xl text-base text-white shadow-lg bg-gradient-to-r ${v.badge}`}>
          {v.emoji}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{title}</p>
          {message ? <p className="mt-0.5 text-xs text-white/70">{message}</p> : null}
        </div>
        {onClose ? (
          <button
            onClick={onClose}
            className="ml-2 rounded-full px-2 text-white/60 hover:text-white hover:bg-white/10 transition"
            aria-label="Dismiss"
          >
            ×
          </button>
        ) : null}
      </div>
    </div>
  );
}

function show(
  variant: Variant,
  title: string,
  message?: string,
  duration = variant === "loading" ? 120000 : 2600
) {
  const id = toast.custom(
    (t) => (
      <ToastCard
        title={title}
        message={message}
        variant={variant}
        onClose={() => toast.dismiss(t.id)}
      />
    ),
    { duration }
  );
  return id;
}

export const prettyToast = {
  success: (title: string, message?: string, duration?: number) =>
    show("success", title, message, duration),
  error: (title: string, message?: string, duration?: number) =>
    show("error", title, message, duration),
  info: (title: string, message?: string, duration?: number) =>
    show("info", title, message, duration),
  loading: (title: string, message?: string) => show("loading", title, message),
  dismiss: (id?: string) => toast.dismiss(id),
};
