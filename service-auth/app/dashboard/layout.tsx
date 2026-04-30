"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Key,
  BarChart3,
  LogOut,
  Shield,
  Search,
  Bell,
  CreditCard,
  Zap,
  LayoutDashboard,
  Webhook,
  Settings,
  Lock,
  ChevronDown,
  User,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [userTier, setUserTier] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      setUserId(localStorage.getItem("userId"));
      setUserTier(localStorage.getItem("userTier"));
    } catch {}
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    router.push("/");
  };

  const isPro = userTier === "pro";

  const sidebarNav = [
    { name: "Dashboard",    href: "/dashboard",             icon: LayoutDashboard, locked: false,   external: false },
    { name: "API Keys",     href: "/dashboard/keys",        icon: Key,             locked: false,   external: false },
    { name: "Scholarships", href: "/dashboard/scholarships",icon: Search,          locked: false,   external: false },
    { name: "Analytics",    href: "/dashboard/analytics",   icon: BarChart3,       locked: !isPro,  external: false },
    { name: "Webhooks",     href: "/dashboard/webhooks",    icon: Webhook,         locked: !isPro,  external: false },
    { name: "Billing",      href: "/dashboard/billing",     icon: CreditCard,      locked: false,   external: false },
    { name: "Settings",     href: "/dashboard/settings",    icon: Settings,        locked: false,   external: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* NAVBAR */}
      <header className="h-14 bg-white border-b border-slate-200 sticky top-0 z-50 flex items-center px-4 gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <div className="h-7 w-7 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-base font-bold text-slate-900 tracking-tight">
            Scholarship API
          </span>
        </Link>

        <div className="flex-1" />

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-emerald-700">System Operational</span>
        </div>

        <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${isPro ? "bg-amber-50 border-amber-200" : "bg-slate-100 border-slate-200"}`}>
          <Zap className={`w-3 h-3 ${isPro ? "text-amber-500" : "text-slate-400"}`} />
          <span className={`text-xs font-semibold ${isPro ? "text-amber-700" : "text-slate-500"}`}>
            {isPro ? "Pro Plan" : "Free Plan"}
          </span>
        </div>

        <a
          href={userId ? `http://localhost:3005/dashboard/notifications?userId=${userId}&tier=${userTier}` : "http://localhost:3005/dashboard/notifications"}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          title="การแจ้งเตือน"
        >
          <Bell className="w-4 h-4" />
        </a>

        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden z-50">
              <Link
                href="/dashboard/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                <Settings className="w-4 h-4 text-slate-400" /> บัญชีของฉัน
              </Link>
              <div className="border-t border-slate-100" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" /> ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      </header>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <aside className="w-56 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {sidebarNav.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              if (item.locked) {
                return (
                  <div
                    key={item.name}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-400 cursor-not-allowed select-none"
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{item.name}</span>
                    <Lock className="w-3 h-3 text-slate-300" />
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <item.icon
                    className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400"}`}
                  />
                  <span className="flex-1">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {!isPro && (
            <div className="m-3 p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
              <p className="text-xs font-semibold text-indigo-800 mb-0.5">อัปเกรดเป็น Pro</p>
              <p className="text-xs text-indigo-600 mb-2 leading-relaxed">ปลดล็อก Analytics และ Webhooks</p>
              <Link
                href="/dashboard/billing"
                className="block text-center text-xs font-semibold px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                ดูแผนราคา
              </Link>
            </div>
          )}
        </aside>

        {/* MAIN */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
        </main>

      </div>
    </div>
  );
}