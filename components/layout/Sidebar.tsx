"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, BookmarkSimple, Clock, Bell, Gear } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";
import { useNavCounts } from "@/hooks/useNavCounts";
import { useEffect, useState } from "react";

const topNavItems = [
  { href: "/dashboard", icon: Compass, label: "Discover", badgeKey: "discoverCount" },
  { href: "/saved", icon: BookmarkSimple, label: "Saved", badgeKey: "savedCount" },
  { href: "/deadlines", icon: Clock, label: "Deadlines", badgeKey: "deadlinesCount" },
  { href: "/alerts", icon: Bell, label: "Alerts", badgeKey: "alertsCount" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const { fetchCounts, ...counts } = useNavCounts();

  useEffect(() => {
    setMounted(true);
    fetchCounts();
  }, [fetchCounts]);

  return (
    <aside className="hidden md:flex w-[240px] flex-col border-r border-border bg-surface h-screen sticky top-0 z-40">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <h1 className="font-editorial text-[22px] text-ink">ScholarMatch</h1>
      </div>
      
      <nav className="flex-1 px-2 py-4 flex flex-col gap-1">
        {topNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          // Dynamically read the badge count from our global state
          const countValue = counts[item.badgeKey as keyof typeof counts];
          const hasBadge = mounted && typeof countValue === "number" && countValue > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-2.5 px-4 py-2.5 mx-2 rounded-md font-ui text-[14px] transition-all duration-180",
                isActive 
                  ? "bg-moss-light text-moss font-medium" 
                  : "text-ink-secondary hover:bg-surface-hover hover:text-ink font-normal"
              )}
            >
              {isActive && (
                <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-moss rounded-sm" />
              )}
              <Icon size={18} weight={isActive ? "fill" : "regular"} />
              {item.label}
              {hasBadge && (
                <span className="ml-auto bg-moss text-white text-[11px] font-semibold px-[7px] py-[2px] rounded-full min-w-[20px] text-center">
                  {countValue > 99 ? "99+" : countValue}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-border flex flex-col gap-1">
        <Link
          href="/profile"
          className={cn(
            "group relative flex items-center gap-2.5 px-4 py-2.5 mx-2 rounded-md font-ui text-[14px] transition-all duration-180",
            pathname === "/profile"
              ? "bg-moss-light text-moss font-medium" 
              : "text-ink-secondary hover:bg-surface-hover hover:text-ink font-normal"
          )}
        >
          {pathname === "/profile" && (
            <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-moss rounded-sm" />
          )}
          <Gear size={18} weight={pathname === "/profile" ? "fill" : "regular"} />
          Profile
        </Link>
        <div className="px-4 py-3 mx-2 mt-2 flex items-center gap-3">
          <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
          <span className="font-ui text-[14px] text-ink-secondary truncate">
            {user?.firstName || "Account"}
          </span>
        </div>
      </div>
    </aside>
  );
}
