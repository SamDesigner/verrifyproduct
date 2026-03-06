
"use client";

import { useParams, useRouter } from "next/navigation";

export default function SuccessPage() {
  const { verificationId } = useParams();
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl text-center max-w-md">
        <h1 className="text-green-500 text-2xl font-semibold mb-4">
          Verification Initiated Successfully!
        </h1>

        <button
          onClick={() => router.push(`/checkout/${verificationId}`)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
