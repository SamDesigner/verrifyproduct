interface VerificationDetailRowProps {
  label: string;
  value?: string | number | boolean | null;
}

export function VerificationDetailRow({ label, value }: VerificationDetailRowProps) {
  const display =
    typeof value === "boolean" ? (value ? "Yes" : "No") : value ?? "—";

  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-slate-500 text-xs shrink-0">{label}</span>
      <span className="text-slate-300 text-xs font-medium text-right break-all">
        {String(display)}
      </span>
    </div>
  );
}