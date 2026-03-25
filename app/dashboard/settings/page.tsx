"use client";
import Link from "next/link";
import { logout } from "@/lib/api/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toastSuccess } from "@/lib/toast/toast";
import { useAuthStore } from "@/store/useAuthStore";

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const settingsData = [
  {
    id: 1,
    title: "Update Password",
    description: "Keep your account secure by updating your password regularly, especially if you suspect it may have been compromised.",
    actionText: "Change Password",
    location: "/update-password",
    icon: <LockIcon />,
    accent: "#818cf8",
    accentBg: "rgba(99,102,241,0.08)",
    accentBorder: "rgba(99,102,241,0.2)",
    badge: "Security",
    badgeIcon: <ShieldIcon />,
    isLogout: false,
  },
  {
    id: 2,
    title: "Update Profile",
    description: "Keep your personal details up to date so your account always reflects the latest information.",
    actionText: "Update Profile",
    location: "/update-profile",
    icon: <UserIcon />,
    accent: "#34d399",
    accentBg: "rgba(52,211,153,0.08)",
    accentBorder: "rgba(52,211,153,0.2)",
    badge: "Profile",
    badgeIcon: null,
    isLogout: false,
  },
  {
    id: 3,
    title: "Logout",
    description: "Sign out of your account on this device. You can log back in any time with your credentials.",
    actionText: "Logout",
    location: "/logout",
    icon: <LogoutIcon />,
    accent: "#f87171",
    accentBg: "rgba(248,113,113,0.08)",
    accentBorder: "rgba(248,113,113,0.2)",
    badge: "Session",
    badgeIcon: null,
    isLogout: true,
  },
];

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const handleLogOut = async () => {
    setLoading(true);
    await logout();
    toastSuccess("Logout Successful 🎉🎉");
    router.push("/");
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900 rounded-xl">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col gap-1 pb-5 border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
              style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.3)" }}
            >
              {user?.firstName?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
                Profile Settings
              </h1>
              <p className="text-slate-500 text-sm">
                {user?.firstName ? `Manage your account, ${user.firstName}` : "Manage your account preferences"}
              </p>
            </div>
          </div>
        </div>

        {/* Settings Cards */}
        <div className="flex flex-col gap-3">
          {settingsData.map((setting) => (
            <div
              key={setting.id}
              onMouseEnter={() => setHoveredId(setting.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background: hoveredId === setting.id ? setting.accentBg : "rgba(255,255,255,0.03)",
                border: `1px solid ${hoveredId === setting.id ? setting.accentBorder : "rgba(255,255,255,0.07)"}`,
                transition: "all 0.2s ease",
              }}
              className="rounded-xl p-5 flex items-center gap-5"
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: setting.accentBg,
                  border: `1px solid ${setting.accentBorder}`,
                  color: setting.accent,
                  transition: "all 0.2s ease",
                }}
              >
                {setting.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-white font-semibold text-[15px] leading-snug">
                    {setting.title}
                  </h3>
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
                    style={{
                      background: setting.accentBg,
                      color: setting.accent,
                      border: `1px solid ${setting.accentBorder}`,
                    }}
                  >
                    {setting.badgeIcon}
                    {setting.badge}
                  </span>
                </div>
                <p className="text-slate-500 text-[13px] leading-relaxed">
                  {setting.description}
                </p>

                {/* Password dots */}
                {setting.id === 1 && (
                  <p className="text-slate-400 text-[12px] mt-2 flex items-center gap-1.5">
                    <span className="text-slate-500">Current password:</span>
                    <span className="tracking-widest" style={{ color: setting.accent }}>••••••••</span>
                  </p>
                )}
              </div>

              {/* Action */}
              <div className="shrink-0">
                {setting.isLogout ? (
                  <button
                    onClick={handleLogOut}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 disabled:opacity-50"
                    style={{
                      background: "rgba(248,113,113,0.1)",
                      color: "#f87171",
                      border: "1px solid rgba(248,113,113,0.25)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.1)")}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".25"/>
                          <path d="M21 12a9 9 0 00-9-9"/>
                        </svg>
                        Signing out...
                      </>
                    ) : (
                      <>
                        {setting.actionText}
                        <ChevronIcon />
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    href={setting.location}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
                    style={{
                      background: setting.accentBg,
                      color: setting.accent,
                      border: `1px solid ${setting.accentBorder}`,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = `${setting.accentBg.replace("0.08", "0.18")}`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = setting.accentBg;
                    }}
                  >
                    {setting.actionText}
                    <ChevronIcon />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-slate-600 text-xs">
          Changes to your account are saved immediately.
        </p>

      </div>
    </div>
  );
};

export default Page;