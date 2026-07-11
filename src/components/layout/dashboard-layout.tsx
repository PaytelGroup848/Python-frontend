"use client";

import {
  MessageSquare,
  ScanText,
  BarChart3,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Link,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/auth-store";

import { useState } from "react";
import { motion } from "framer-motion";
interface DashboardLayoutProps {
  children: React.ReactNode;
}

const sidebarItems = [
  {
    title: "Chat",
    icon: MessageSquare,
  },
  // {
  //   title: "Voice",
  //   icon: Mic,
  // },
  // {
  //   title: "Documents",
  //   icon: FileText,
  // },
  {
    title: "OCR",
    icon: ScanText,
  },
  {
    title: "Analytics",
    icon: BarChart3,
  },
  // {
  //   title: "API Keys",
  //   icon: KeyRound,
  // },
  {
    title: "Settings",
    icon: Settings,
  },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();

    localStorage.removeItem("ai-platform-auth");

    router.push("/login");
  }
  return (
    <div
      className="
        flex
        min-h-screen
        bg-white
        text-black
      "
    >
      {/* Sidebar */}

      <aside
        className={`
          hidden
          border-r
          border-zinc-200
          bg-white
          lg:flex
          lg:flex-col
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-16" : "w-72"}
        `}
      >
        {/* Logo */}

        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <Link
            className="relative flex items-center justify-center"
            href={"/"}
          >
            <motion.span className="text-xl md:text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 bg-clip-text text-transparent">
                Patwatoli
              </span>
            </motion.span>
          </Link>
        </motion.div>

        {/* Navigation */}

        <nav className="flex-1 space-y-1 p-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.title}
                onClick={() =>
                  router.push(
                    item.title === "Chat"
                      ? "/chat"
                      : item.title === "OCR"
                        ? "/ocr"
                        : item.title === "Analytics"
                          ? "/analytics"
                          : "/settings",
                  )
                }
                title={isCollapsed ? item.title : undefined}
                className={`
                  group
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-2xl
                  px-4
                  py-3
                  text-sm
                  text-zinc-600
                  transition-all
                  hover:bg-zinc-200
                  hover:text-black
                  ${isCollapsed ? "justify-center px-0" : ""}
                `}
              >
                <Icon
                  className="
                    h-5
                    w-5
                    shrink-0
                    transition-transform
                    group-hover:scale-110
                  "
                />

                {!isCollapsed && item.title}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}

        <div
          className="
            border-t
            border-zinc-200
            p-4
          "
        >
          <div
            className={`
              rounded-2xl
              border
              border-zinc-200
              bg-white
              ${isCollapsed ? "p-2" : "p-4"}
            `}
          >
            {!isCollapsed && (
              <>
                <p className="text-sm font-medium">Enterprise Plan</p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-zinc-600
                  "
                >
                  AI Infrastructure By Patwatoli
                </p>
              </>
            )}

            <button
              onClick={handleLogout}
              title={isCollapsed ? "Logout" : undefined}
              className={`
                ${isCollapsed ? "" : "mt-4"}
                flex
                w-full
                items-center
                cursor-pointer
                justify-center
                gap-2
                rounded-xl
                border
                border-zinc-200
                bg-red-100
                px-4
                py-2
                text-sm
                text-red-700
                transition-all
                hover:bg-red-500/10
                hover:text-red-400
              `}
            >
              <LogOut className="h-4 w-4 shrink-0" />

              {!isCollapsed && "Logout"}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Section */}

      <div className="flex flex-1 flex-col">
        {/* Topbar */}

        {/* <header
          className="
            sticky
            top-0
            z-50
            flex
            h-16
            items-center
            justify-between
            border-b
            border-zinc-200
            bg-white/80
            px-6
            backdrop-blur-xl
          "
        >

          <div
            className="
              hidden
              items-center
              gap-3
              rounded-2xl
              border
              border-zinc-200
              bg-zinc-100
              px-4
              py-2
              md:flex
            "
          >
            <Search className="h-4 w-4 text-zinc-500" />

            <input
              placeholder="Search workspace..."
              className="
                bg-transparent
                text-sm
                text-black
                outline-none
                placeholder:text-zinc-500
              "
            />
          </div>


          <div className="flex items-center gap-4">

            <button
              aria-label="Notifications"
              title="Notifications"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-zinc-200
                bg-white
                text-black
                transition-all
                hover:bg-zinc-100
              "
            >
              <Bell className="h-4 w-4" />
            </button>

            <div
              className="
                h-10
                w-10
                rounded-full
                bg-gradient-to-br
                from-zinc-700
                to-zinc-900
              "
            />
          </div>
        </header> */}

        {/* Workspace */}

        <main
          className="
            flex-1
            bg-white
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}
