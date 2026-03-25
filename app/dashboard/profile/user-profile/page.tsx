"use client";
import { FaPen } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/api/user";
import type { User } from "@/store/useAuthStore";
import FieldCard from '@/app/components/(Profile)/FieldCard'
function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Avatar skeleton */}
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl" style={{ background: "rgba(255,255,255,0.07)" }} />
        <div className="space-y-2">
          <div className="h-5 w-40 rounded" style={{ background: "rgba(255,255,255,0.07)" }} />
          <div className="h-3 w-28 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>
      </div>
      {/* Fields skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-xl p-4 space-y-2"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="h-2.5 w-20 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="h-4 w-32 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}



export default function ProfilePage() {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getCurrentUser()
      .then((res) => setData(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const initials = data
    ? `${data.firstName?.[0] ?? ""}${data.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  const profileFields = [
    {
      label: "First Name", value: data?.firstName,
      icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    },
    {
      label: "Last Name", value: data?.lastName,
      icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    },
    {
      label: "Email Address", value: data?.email,
      icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
    },
    {
      label: "Username", value: data?.username,
      icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    },
    {
      label: "Date of Birth", value: data?.dob,
      icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    },
    {
      label: "Phone Number", value: data?.phoneNumber,
      icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .94h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>,
    },
    {
      label: "Address", value: data?.address,
      icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>,
    },
    {
      label: "City", value: data?.city,
      icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    },
    {
      label: "State", value: data?.state,
      icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>,
    },
  ];

  return (
    // style={{ background: "#0f1117" }}
    <div className="min-h-screen p-6" >
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {loading ? <ProfileSkeleton /> : (
          <>
            {/* Header card */}
            <div
              className="rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap"
              // style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-5">
                {/* Avatar */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0"
                  style={{
                    background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(167,139,250,0.3))",
                    border: "1px solid rgba(99,102,241,0.3)",
                    color: "#818cf8",
                  }}
                >
                  {initials}
                </div>

                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    {`${data?.firstName ?? ""} ${data?.lastName ?? ""}`.trim() || "Your Profile"}
                  </h1>
                  <p className="text-slate-500 text-sm mt-0.5">{data?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {/* Role badge */}
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: "rgba(99,102,241,0.1)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }}
                    >
                      {data?.role ?? "USER"}
                    </span>
                    {/* Verified badge */}
                    {data?.isVerified && (
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                        style={{ background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit button */}
              <button
                onClick={() => router.push("/update-profile")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
                style={{
                  background: "rgba(99,102,241,0.1)",
                  color: "#818cf8",
                  border: "1px solid rgba(99,102,241,0.2)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.1)")}
              >
                <FaPen size={12} />
                Edit Profile
              </button>
            </div>

            {/* Section title */}
            <div className="flex items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Personal Information
              </p>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
            </div>

            {/* Fields grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {profileFields.map((field) => (
                <FieldCard key={field.label} {...field} />
              ))}
            </div>

            {/* Account status row */}
            {/* <div
              className="rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4"
              style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {[
                { label: "2FA", value: data?.is2fa ? "Enabled" : "Disabled", active: data?.is2fa },
                { label: "Google Login", value: data?.isGoogleLogin ? "Yes" : "No", active: data?.isGoogleLogin },
                { label: "Company Profile", value: data?.hasCompanyProfile ? "Yes" : "No", active: data?.hasCompanyProfile },
                { label: "Account", value: data?.isEnabled ? "Active" : "Disabled", active: data?.isEnabled },
              ].map(({ label, value, active }) => (
                <div key={label} className="flex flex-col gap-1">
                  <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "#475569" }}>{label}</p>
                  <p className="text-sm font-semibold" style={{ color: active ? "#34d399" : "#f87171" }}>{value}</p>
                </div>
              ))}
            </div> */}
          </>
        )}
      </div>
    </div>
  );
}