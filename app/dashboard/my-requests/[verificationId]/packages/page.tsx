"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthReady } from "@/hooks/useAuthReady";
import { getVerificationPackages } from "@/lib/api/verification";
import { initializeVerificationPayment } from "@/lib/api/payment";
import { FiArrowLeft, FiCheck } from "react-icons/fi";

interface VerificationPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  isPopular?: boolean;
}

export default function PackagesPage() {
  const { isReady } = useAuthReady();
  const router = useRouter();
  const params = useParams();
  const verificationId = params.verificationId as string;

  const [packages, setPackages] = useState<VerificationPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingPackageId, setPayingPackageId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;

    getVerificationPackages()
      .then((res) => {
        setPackages(res.data as unknown as VerificationPackage[]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isReady]);

  const handlePay = async (packageId: string) => {
    setPayingPackageId(packageId);
    setError(null);

    try {
      const res = await initializeVerificationPayment(
        verificationId,
        packageId
      );

      const accessCode = res.data?.paystackDetails?.access_code;

      const PaystackPop = (await import("@paystack/inline-js")).default;
      const popup = new PaystackPop();

      popup.resumeTransaction(accessCode, {
        onSuccess: () => {
          router.push(
            `/dashboard/verifyproperty/success/${verificationId}`
          );
        },
        onCancel: () => {
          setPayingPackageId(null);
        },
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setPayingPackageId(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", padding: "2rem" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Back */}
        <button
          onClick={() => router.back()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            color: "#818cf8",
            fontSize: 13,
            cursor: "pointer",
            marginBottom: "1.5rem",
            padding: 0,
          }}
        >
          <FiArrowLeft size={14} /> Back to verification
        </button>

        <h1 style={{ fontSize: 22, fontWeight: 500, color: "#f1f5f9", marginBottom: 4 }}>
          Select a verification package
        </h1>

        <p style={{ fontSize: 14, color: "#64748b", marginBottom: "2rem" }}>
          Choose the package that best suits your property verification needs.
        </p>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.3)",
              borderRadius: 8,
              padding: "12px 16px",
              color: "#f87171",
              fontSize: 13,
              marginBottom: "1.5rem",
            }}
          >
            {error}
          </div>
        )}

        {/* Skeleton */}
        {loading && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  background: "#161b27",
                  borderRadius: 12,
                  padding: "1.5rem",
                  border: "1px solid rgba(255,255,255,0.07)",
                  height: 220,
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        )}

        {/* Packages */}
        {!loading && packages.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {packages.map((pkg) => {
              const isPaying = payingPackageId === pkg.id;

              return (
                <div
                  key={pkg.id}
                  style={{
                    background: "#161b27",
                    border: pkg.isPopular
                      ? "2px solid rgba(129,140,248,0.4)"
                      : "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 12,
                    padding: "1.5rem",
                    position: "relative",
                  }}
                >
                  {pkg.isPopular && (
                    <div
                      style={{
                        position: "absolute",
                        top: -12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#818cf8",
                        color: "#fff",
                        fontSize: 11,
                        padding: "3px 12px",
                        borderRadius: 99,
                      }}
                    >
                      Most popular
                    </div>
                  )}

                  <p style={{ fontSize: 16, fontWeight: 500, color: "#f1f5f9", marginBottom: 6 }}>
                    {pkg.name}
                  </p>

                  <p style={{ fontSize: 26, fontWeight: 500, color: "#818cf8", marginBottom: 12 }}>
                    ₦{pkg.price?.toLocaleString()}
                    <span style={{ fontSize: 13, color: "#64748b", fontWeight: 400 }}>
                      {" "} / verification
                    </span>
                  </p>

                  {pkg.description && (
                    <p style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
                      {pkg.description}
                    </p>
                  )}

                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                    {pkg.features?.map((feature, idx) => (
                      <li key={idx} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#94a3b8" }}>
                        <span
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            background: "rgba(52,211,153,0.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FiCheck size={9} color="#34d399" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Pay Button */}
                  <button
                    onClick={() => handlePay(pkg.id)}
                    disabled={!!payingPackageId}
                    style={{
                      marginTop: 16,
                      width: "100%",
                      padding: "10px",
                      background: "#818cf8",
                      border: "none",
                      borderRadius: 6,
                      color: "#fff",
                      fontSize: 13,
                      cursor: payingPackageId ? "not-allowed" : "pointer",
                    }}
                  >
                    {isPaying ? "Processing..." : "Choose & Pay"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty */}
        {!loading && packages.length === 0 && !error && (
          <p style={{ color: "#64748b", textAlign: "center", padding: "3rem 0" }}>
            No packages available at this time.
          </p>
        )}
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}