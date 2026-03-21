"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminOrders } from "@/lib/api/adminPayment";
import { useAuthReady } from "@/hooks/useAuthReady";
import { OrderCard, OrderSkeleton, OrderEmptyState } from "@/app/components/orders";
import type { Order } from "@/app/components/orders";

// ── Types ──────────────────────────────────────────────────────────────────

interface AdminOrder extends Order {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string | null;
    role: string;
  };
}

interface AdminOrdersMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const router = useRouter();
  const { isReady } = useAuthReady();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [meta, setMeta] = useState<AdminOrdersMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;
    setLoading(true);
    getAdminOrders()
      .then((res) => {
        const data = res.data as { data: AdminOrder[]; meta: AdminOrdersMeta };
        setOrders(data.data);
        setMeta(data.meta);
      })
      .catch((err) => setError(err.message ?? "Something went wrong"))
      .finally(() => setLoading(false));
  }, [isReady]);

  const handleView = (verificationId: string) => {
    router.push(`/dashboard/admin/orders/${verificationId}`);
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#0f1117" }}>

      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">All Orders</h1>
          {meta && !loading && (
            <p className="text-slate-400 text-sm mt-1">
              {meta.totalItems} order{meta.totalItems !== 1 ? "s" : ""} found
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <OrderSkeleton />
      ) : error ? (
        <div className="rounded-2xl px-6 py-16 text-center"
          style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-3 text-xs text-slate-400 underline">
            Try again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <OrderEmptyState />
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="flex flex-col gap-1">
              {/* User info banner above each card */}
              <div className="flex items-center gap-2 px-1">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}
                >
                  {order.user.firstName?.[0]?.toUpperCase() ?? "?"}
                </div>
                <p className="text-slate-400 text-xs">
                  {`${order.user.firstName} ${order.user.lastName}`.trim()}
                  <span className="text-slate-600 ml-1">· {order.user.email}</span>
                </p>
              </div>
              <OrderCard order={order} onView={handleView} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}