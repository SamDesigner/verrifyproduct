"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyOrders } from "@/lib/api/payment";
import { useAuthReady } from "@/hooks/useAuthReady";
import {
  OrderCard,
  OrderSkeleton,
  OrderEmptyState,
} from "@/app/components/orders";
import type { Order } from "@/app/components/orders";

export default function UserOrdersPage() {
  const router = useRouter();
  const { isReady } = useAuthReady();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;
    setLoading(true);
    getMyOrders()
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setOrders(data as Order[]);
        } else if (data && typeof data === "object" && "id" in (data as object)) {
          setOrders([data as Order]);
        } else {
          setOrders((data as { data?: Order[] })?.data ?? []);
        }
      })
      .catch((err) => setError(err.message ?? "Something went wrong"))
      .finally(() => setLoading(false));
  }, [isReady]);

  const handleView = (verificationId: string) => {
    router.push(`/dashboard/orders/${verificationId}`);
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#0f1117" }}>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">My Orders</h1>
        {!loading && (
          <p className="text-slate-400 text-sm mt-1">
            {orders.length} order{orders.length !== 1 ? "s" : ""} found
          </p>
        )}
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
            <OrderCard key={order.id} order={order} onView={handleView} />
          ))}
        </div>
      )}
    </div>
  );
}