"use client";

import { useParams } from "next/navigation";
import { initializeVerificationPayment } from "@/lib/api/payment";
import { useState } from "react";

export default function CheckoutPage() {
  const { verificationId } = useParams();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const response = await initializeVerificationPayment(
        verificationId as string
      );

      // Backend should return something like:
      // response.data.authorizationUrl

      window.location.href = response.data.authorizationUrl;

    } catch (error) {
      console.error(error);
      alert("Failed to initialize payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl text-center">
        <h1 className="text-white text-2xl mb-6">
          Complete Your Payment
        </h1>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-3 rounded-lg"
        >
          {loading ? "Initializing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}