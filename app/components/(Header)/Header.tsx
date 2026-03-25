"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import {
  ShoppingCart,
  ArrowLeftRight,
  Settings,
  MessageCircle,
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";

export default function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  const isAdmin = user?.role === "SUPER_ADMIN";

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  const displayName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "User";

  const navItems = [
    // Orders — both roles, different routes
    {
      id: "orders",
      label: "Orders",
      href: isAdmin ? "/dashboard/admin/orders" : "/dashboard/orders",
      icon: ShoppingCart,
      badge: null as number | null,
      color: "text-violet-400",
      activeBg: "bg-violet-500/10 border-violet-500/30",
    },

    // Transactions — both roles, different routes
    {
      id: "transactions",
      label: "Transactions",
      href: isAdmin ? "/dashboard/admin/transactions" : "/dashboard/transactions",
      icon: ArrowLeftRight,
      badge: null as number | null,
      color: "text-cyan-400",
      activeBg: "bg-cyan-500/10 border-cyan-500/30",
    },

    // Contact — all roles
    // {
    //   id: "contact",
    //   label: "Contact",
    //   href: "/dashboard/contact",
    //   icon: MessageCircle,
    //   badge: 3 as number | null,
    //   color: "text-emerald-400",
    //   activeBg: "bg-emerald-500/10 border-emerald-500/30",
    // },

    // Settings — all roles
    {
      id: "settings",
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      badge: null as number | null,
      color: "text-amber-400",
      activeBg: "bg-amber-500/10 border-amber-500/30",
    },
  ];

  return (
    <header className="w-full bg-gray-900 border-b border-gray-700/60">

      {/* Top strip */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800/80">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <span className="text-white font-black text-sm tracking-tighter">V</span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-none tracking-wide">Verrify</p>
            <p className="text-gray-500 text-xs mt-0.5">
              {isAdmin ? "Admin Dashboard" : "Dashboard"}
            </p>
          </div>
        </div>

        {/* Search */}
        {/* <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-gray-800/40 border-gray-700/50 hover:border-gray-600 w-48 cursor-pointer transition-all duration-200">
          <Search size={13} className="text-gray-400 shrink-0" />
          <input
            className="bg-transparent text-gray-300 text-xs placeholder-gray-500 outline-none w-full"
            placeholder="Search..."
          />
          <kbd className="text-gray-600 text-[10px] font-mono border border-gray-700 rounded px-1 py-0.5 shrink-0">
            ⌘K
          </kbd>
        </div> */}

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/dashboard/notification')} className="relative p-1.5 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors group">
            <Bell size={16} className="text-gray-400 group-hover:text-gray-200 transition-colors" />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-gray-900" />
          </button>
          <div className="w-px h-5 bg-gray-700" />
          <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-800 transition-colors group">
            <div className="w-6 h-6 rounded-full bg-linear-to-br from-violet-500 to-pink-500 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">{initials}</span>
            </div>
            <span className="text-gray-300 text-xs font-medium group-hover:text-white transition-colors">
              {displayName}
            </span>
            <ChevronDown size={12} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Nav strip */}
      <nav className="flex items-center gap-1 px-6 py-2">
        {navItems.map(({ id, label, href, icon: Icon, badge, color, activeBg }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <button
              key={id}
              onClick={() => router.push(href)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-medium transition-all duration-200 ${
                isActive
                  ? `${activeBg} ${color}`
                  : "border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/60"
              }`}
            >
              <Icon size={15} />
              <span>{label}</span>
              {badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${isActive ? "bg-white/10" : "bg-gray-700 text-gray-300"}`}>
                  {badge}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-4 right-4 h-px bg-current opacity-40 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}