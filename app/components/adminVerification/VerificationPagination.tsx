import { VerificationMeta } from "@/lib/types/verification";

interface VerificationPaginationProps {
  meta: VerificationMeta;
  onPageChange: (page: number) => void;
}

interface PageBtnProps {
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

function PageBtn({ label, onClick, active, disabled }: PageBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center justify-center"
      style={{
        background: active ? "rgba(99,102,241,0.2)" : "transparent",
        color: active ? "#818cf8" : disabled ? "#334155" : "#94a3b8",
        border: active ? "1px solid rgba(99,102,241,0.4)" : "1px solid transparent",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {label}
    </button>
  );
}

export function VerificationPagination({ meta, onPageChange }: VerificationPaginationProps) {
  const { currentPage, totalPages, totalItems } = meta;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  const withEllipsis: (number | "...")[] = [];
  visible.forEach((p, i) => {
    if (i > 0 && p - (visible[i - 1] as number) > 1) withEllipsis.push("...");
    withEllipsis.push(p);
  });

  return (
    <div
      className="flex items-center justify-between px-6 py-4"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <p className="text-slate-500 text-xs">
        Page <span className="text-slate-300 font-medium">{currentPage}</span> of{" "}
        <span className="text-slate-300 font-medium">{totalPages}</span> —{" "}
        <span className="text-slate-300 font-medium">{totalItems}</span> total items
      </p>

      <div className="flex items-center gap-1">
        <PageBtn
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          label="←"
        />
        {withEllipsis.map((p, i) =>
          p === "..." ? (
            <span key={`e${i}`} className="px-2 text-slate-500 text-sm">…</span>
          ) : (
            <PageBtn
              key={p}
              active={p === currentPage}
              onClick={() => onPageChange(p as number)}
              label={String(p)}
            />
          )
        )}
        <PageBtn
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          label="→"
        />
      </div>
    </div>
  );
}