// This file is no longer used for primary navigation and can be removed or repurposed.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Landmark, Users, LayoutDashboard, UserCircle, Settings, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/loans", label: "Loans", icon: Landmark },
  { href: "/dashboard/groups", label: "Groups", icon: Users },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex flex-col gap-1 px-4 pt-4", className)}
      {...props}
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            (pathname === link.href || (pathname !== "/" && link.href !== "/dashboard" && pathname.startsWith(link.href))) && "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
          )}
        >
          <link.icon className="h-4 w-4" />
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
