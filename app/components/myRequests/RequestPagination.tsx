import { MyRequestsMeta } from "@/lib/types/verification";

interface RequestPaginationProps {
  meta: MyRequestsMeta;
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
        color: active ? "#818cf8" : disabled ? "#1e293b" : "#64748b",
        border: active ? "1px solid rgba(99,102,241,0.4)" : "1px solid transparent",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {label}
    </button>
  );
}

export function RequestPagination({ meta, onPageChange }: RequestPaginationProps) {
  const { currentPage, totalPages, totalItems, itemsPerPage } = meta;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  const withEllipsis: (number | "...")[] = [];
  visible.forEach((p, i) => {
    if (i > 0 && p - (visible[i - 1] as number) > 1) withEllipsis.push("...");
    withEllipsis.push(p);
  });

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className="flex items-center justify-between px-2 py-3"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <p className="text-slate-600 text-xs">
        Showing <span className="text-slate-400 font-medium">{start}–{end}</span> of{" "}
        <span className="text-slate-400 font-medium">{totalItems}</span>
      </p>

      <div className="flex items-center gap-1">
        <PageBtn
          label="←"
          disabled={!meta.hasPreviousPage}
          onClick={() => onPageChange(currentPage - 1)}
        />
        {withEllipsis.map((p, i) =>
          p === "..." ? (
            <span key={`e${i}`} className="px-1 text-slate-600 text-xs">…</span>
          ) : (
            <PageBtn
              key={p}
              label={String(p)}
              active={p === currentPage}
              onClick={() => onPageChange(p as number)}
            />
          )
        )}
        <PageBtn
          label="→"
          disabled={!meta.hasNextPage}
          onClick={() => onPageChange(currentPage + 1)}
        />
      </div>
    </div>
  );
}