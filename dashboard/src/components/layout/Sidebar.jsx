"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Clock, 
  Building2, 
  Route, 
  Network 
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Delay Prediction", href: "/delay-prediction", icon: Clock },
  { name: "Airport Profiling", href: "/airport-profiling", icon: Building2 },
  { name: "Shortest Path", href: "/shortest-path", icon: Route },
  { name: "MST Optimization", href: "/mst-optimization", icon: Network },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-[#1f1f1f] h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-[#1f1f1f]">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          SkyNet Analytics
        </h1>
        <p className="text-xs text-gray-500 mt-1">B.Tech Project</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 relative">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive ? "text-white" : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-bg"
                    className="absolute inset-0 bg-blue-500/10 border border-blue-500/20 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon className={`w-5 h-5 relative z-10 ${isActive ? "text-blue-400" : "text-gray-400 group-hover:text-gray-300"}`} />
                <span className="font-medium relative z-10">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}
