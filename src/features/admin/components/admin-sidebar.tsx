"use client";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  CreditCard,
} from "lucide-react";

import {
  LayoutDashboard,
  Users,
  Bot,
  Cpu,
  Database,
  Package,
  FileText,
  Mic,
  ScanText,
  BarChart3,
  Activity,
  Settings,
  Image as ImageIcon,
} from "lucide-react";

import {
  LogOut,
} from "lucide-react";




import {
  useAuthStore,
} from "@/stores/auth-store";
import { isSuperAdmin, isRouteRestricted } from "@/features/admin/utils/roles";

const navigation = [
  {
    title: "MAIN",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
      {
        label: "Users",
        href: "/admin/users",
        icon: Users,
      },
      {
        label: "Media Gallery",
        href: "/admin/media",
        icon: ImageIcon,
      },
    ],
  },

  {
  title: "OPERATIONS",
  items: [
    {
      label: "Providers",
      href: "/admin/providers",
      icon: Bot,
    },
    {
      label: "Models",
      href: "/admin/models",
      icon: Package,
    },
    {
      label: "Plans",
      href: "/admin/plans",
      icon: CreditCard,
    },
    {
      label: "Subscriptions",
      href: "/admin/subscriptions",
      icon: CreditCard,
    },
    {
      label: "Payments",
      href: "/admin/payments",
      icon: CreditCard,
    },
    {
      label: "Workers",
      href: "/admin/workers",
      icon: Cpu,
    },
    {
      label: "Queues",
      href: "/admin/queues",
      icon: Database,
    },
  ],
},

  {
    title: "AI SERVICES",
    items: [
      {
        label: "Documents",
        href: "/admin/documents",
        icon: FileText,
      },
      {
        label: "OCR",
        href: "/admin/ocr",
        icon: ScanText,
      },
      {
        label: "Voice",
        href: "/admin/voice",
        icon: Mic,
      },
    ],
  },

  {
    title: "SYSTEM",
    items: [
      {
        label: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
      },
      {
        label: "Monitoring",
        href: "/admin/monitoring",
        icon: Activity,
      },
      {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

export function AdminSidebar() {

  const pathname =
    usePathname();

  const router =
    useRouter();

  const user =
    useAuthStore(
      state => state.user
    );

  const logout =
    useAuthStore(
      state => state.logout
    );

  const handleLogout = () => {

    logout();

    router.replace(
      "/login"
    );
  };

  const isSuper = isSuperAdmin(user?.role);

  // Filter sections and navigation items strictly based on role capabilities
  const visibleSections = navigation
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !isRouteRestricted(user?.role, item.href)),
    }))
    .filter((section) => section.items.length > 0);

  return (

    <aside
  className="
    flex
    h-screen
    w-72
    flex-col
    border-r
    border-zinc-200
    dark:border-zinc-800
    bg-white
    dark:bg-slate-900
    p-4
    shrink-0
  "
>

      <div className="mb-6 shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            AI Platform
          </h1>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide ${
              isSuper
                ? "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                : "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
            }`}
          >
            {isSuper ? "Super Admin" : "Sub Admin"}
          </span>
        </div>

        <p className="text-sm text-zinc-500 mt-0.5">
          Admin Dashboard
        </p>
      </div>

      <nav className="space-y-6 flex-1 overflow-y-auto min-h-0 pr-1.5 [scrollbar-width:thin]">
        {visibleSections.map((section) => (
          <div key={section.title}>
            <p className="mb-2 text-xs font-semibold text-zinc-400">
              {section.title}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;

                const active =
                  pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-3 rounded-lg px-3 py-2 transition
                      ${
                        active
                          ? "bg-black text-white dark:bg-white dark:text-black font-medium"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-slate-800 hover:text-zinc-900 dark:hover:text-zinc-100"
                      }
                    `}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div
  className="
    mt-auto
    border-t
    border-zinc-200
    dark:border-zinc-800
    pt-4
    shrink-0
  "
>

  <button
    onClick={handleLogout}
    className="
      flex
      w-full
      items-center
      justify-center
      gap-2
      rounded-lg
      bg-red-600
      px-4
      py-2.5
      text-sm
      font-medium
      text-white
      transition
      hover:bg-red-700
      active:scale-[0.99]
    "
  >

    <LogOut size={16} />

    Logout

  </button>

  <div
    className="
      mt-3
      flex
      items-center
      gap-3
      rounded-lg
      border
      border-zinc-200
      dark:border-zinc-800
      p-2.5
      bg-zinc-50/50
      dark:bg-slate-800/50
    "
  >

    <div
      className="
        flex
        h-9
        w-9
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-zinc-800
        text-white
        text-xs
        font-semibold
      "
    >

      {user?.email?.[0]?.toUpperCase() ?? "A"}

    </div>

    <div className="min-w-0 flex-1">

      <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">

        {user?.email ?? "Admin"}

      </p>

      <p
        className="
          text-[11px]
          text-zinc-500
          capitalize
        "
      >

        {user?.role ?? "admin"}

      </p>

    </div>

  </div>

</div>

    </aside>
  );
}