interface VerificationDocumentRowProps {
  label: string;
  value?: string | null;
}

export function VerificationDocumentRow({ label, value }: VerificationDocumentRowProps) {
  return (
    <div
      className="flex items-center justify-between gap-4 py-2"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
    >
      <span className="text-slate-500 text-xs">{label}</span>
      {value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View ↗
        </a>
      ) : (
        <span className="text-slate-700 text-xs">Not provided</span>
      )}
    </div>
  );
}