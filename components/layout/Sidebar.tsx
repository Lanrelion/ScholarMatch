"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, BookmarkSimple, User, MagnifyingGlass } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: House, label: "Dashboard" },
  { href: "/search", icon: MagnifyingGlass, label: "Search" },
  { href: "/saved", icon: BookmarkSimple, label: "Saved" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-[240px] flex-col border-r border-border bg-bg h-screen sticky top-0">
      <div className="p-6 pt-8">
        <h1 className="font-editorial text-2xl font-medium text-ink tracking-tight">ScholarMatch</h1>
      </div>
      <nav className="flex-1 px-4 flex flex-col gap-2 mt-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg font-ui text-sm font-medium transition-colors",
                isActive 
                  ? "bg-moss-light text-moss" 
                  : "text-ink-secondary hover:bg-surface-hover hover:text-ink"
              )}
            >
              <Icon size={20} weight={isActive ? "fill" : "regular"} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
