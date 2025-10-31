"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";

export default function PaystackCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your payment...");

  const reference = useMemo(() => {
    // Paystack may send either 'reference' or 'trxref'
    return searchParams.get("reference") || searchParams.get("trxref") || "";
  }, [searchParams]);

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      setMessage("Missing transaction reference.");
      return;
    }

    let cancelled = false;

    async function verify() {
      try {
        const res = await api.verifyPaystack(reference);
        if (cancelled) return;
        setStatus("success");
        setMessage("Payment verified! Redirecting...");
        // Redirect to dashboard wallet after short delay
        setTimeout(() => {
          router.replace("/dashboard");
        }, 1500);
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setMessage(
          err?.message || "Could not verify payment. Please contact support."
        );
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [reference, router]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "24px",
        textAlign: "center",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <h1 style={{ margin: 0 }}>
        {status === "verifying" && "Verifying Payment"}
        {status === "success" && "Payment Successful"}
        {status === "error" && "Payment Verification Failed"}
      </h1>
      <p style={{ color: "#666", maxWidth: 520 }}>{message}</p>
      {status !== "verifying" && (
        <button
          onClick={() => router.replace("/dashboard")}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "1px solid #ddd",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Go to Dashboard
        </button>
      )}
    </div>
  );
}
