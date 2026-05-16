import { db } from "@/lib/db";
import Link from "next/link";
import { ToggleActiveButton } from "./ToggleActiveButton";
import { AdminTabs } from "./AdminTabs";
import { AdminFilters } from "./AdminFilters";
import { AdminControls } from "@/components/admin/AdminControls";
import { Search, Filter, ArrowUpRight, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string; verified?: string; active?: string; minSaves?: string; page?: string }> }) {
  const params = await searchParams;
  const tab = params.tab || "all";
  const verifiedFilter = params.verified;
  const activeFilter = params.active;
  const page = parseInt(params.page || "1", 10);
  const limit = 20;
  const skip = (page - 1) * limit;

  const isPendingTab = tab === "pending";

  const whereClause: any = {};
  if (isPendingTab) {
    whereClause.isActive = false;
    whereClause.verified = false;
  }
  if (verifiedFilter !== undefined) whereClause.verified = verifiedFilter === "true";
  if (activeFilter !== undefined) whereClause.isActive = activeFilter === "true";

  // Fetch scholarships for the current page and counts for stats in parallel
  const [scholarships, totalCount, activeCount, verifiedCount, globalSaves] = await Promise.all([
    db.scholarship.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        provider: true,
        deadline: true,
        isActive: true,
        verified: true,
        lastCrawledAt: true,
        sourceUrl: true,
        eligibleDegrees: true,
        fieldsOfStudy: true,
        _count: { select: { savedBy: true } }
      }
    }),
    db.scholarship.count({ where: whereClause }),
    db.scholarship.count({ where: { ...whereClause, isActive: true } }),
    db.scholarship.count({ where: { ...whereClause, verified: true } }),
    db.savedScholarship.count()
  ]);

  const hasMore = skip + limit < totalCount;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight mb-2">Control Panel</h1>
          <p className="text-sm font-medium text-[var(--color-text-secondary)] opacity-70">Manage scholarship opportunities and data validation.</p>
        </div>
        <AdminControls />
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard label="Total Result" value={totalCount} icon={Filter} color="gray" />
        <AdminStatCard label="Active Feed" value={activeCount} icon={CheckCircle} color="green" />
        <AdminStatCard label="Verified" value={verifiedCount} icon={ArrowUpRight} color="blue" />
        <AdminStatCard label="Global Saves" value={globalSaves} icon={Clock} color="orange" />
      </div>

      <div className="space-y-6">
        <AdminFilters />
        <AdminTabs currentTab={tab} />

        {/* TABLE */}
        <div className="bg-[var(--color-white)] border border-[var(--color-border)] rounded-[32px] overflow-hidden shadow-2xl shadow-black/5">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                  <th className="px-6 py-5 text-[10px] font-black text-[var(--color-text-tertiary)] uppercase tracking-[0.2em]">Title & Source</th>
                  <th className="px-6 py-5 text-[10px] font-black text-[var(--color-text-tertiary)] uppercase tracking-[0.2em]">Provider</th>
                  <th className="px-6 py-5 text-[10px] font-black text-[var(--color-text-tertiary)] uppercase tracking-[0.2em]">Deadline</th>
                  {!isPendingTab && <th className="px-6 py-5 text-[10px] font-black text-[var(--color-text-tertiary)] uppercase tracking-[0.2em]">Status</th>}
                  {!isPendingTab && <th className="px-6 py-5 text-[10px] font-black text-[var(--color-text-tertiary)] uppercase tracking-[0.2em]">Saves</th>}
                  <th className="px-6 py-5 text-[10px] font-black text-[var(--color-text-tertiary)] uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {scholarships.length > 0 ? scholarships.map((s) => (
                  <tr key={s.id} className="hover:bg-[var(--color-surface)] transition-colors group">
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1 max-w-[320px]">
                        <a 
                          href={s.sourceUrl || "#"} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[14px] font-black text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors leading-tight"
                        >
                          {s.title}
                        </a>
                        <span className="text-[10px] text-[var(--color-text-tertiary)] font-bold truncate">
                          {s.sourceUrl}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-xs font-bold text-[var(--color-text-secondary)]">{s.provider}</span>
                    </td>
                    <td className="px-6 py-6">
                      <span className={cn(
                        "text-xs font-black",
                        s.deadline ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-tertiary)] italic"
                      )}>
                        {s.deadline ? new Date(s.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }) : "Open"}
                      </span>
                    </td>
                    {!isPendingTab && (
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                          {s.isActive ? (
                            <span className="h-2 w-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)]" />
                          ) : (
                            <span className="h-2 w-2 rounded-full bg-[var(--color-border)]" />
                          )}
                          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">
                            {s.isActive ? "Active" : "Hidden"}
                          </span>
                        </div>
                      </td>
                    )}
                    {!isPendingTab && (
                      <td className="px-6 py-6">
                        <span className="text-sm font-black text-[var(--color-text-primary)]">{s._count.savedBy}</span>
                      </td>
                    )}
                    <td className="px-6 py-6 text-right">
                      <div className="flex justify-end items-center gap-6">
                        <Link 
                          href={`/admin/${s.id}/edit`}
                          className="text-[11px] font-black text-[var(--color-text-primary)] uppercase tracking-[0.15em] hover:text-[var(--color-primary)] transition-all flex items-center gap-1 opacity-60 hover:opacity-100"
                        >
                          {isPendingTab ? "Review" : "Edit"}
                          <ArrowUpRight size={14} />
                        </Link>
                        <ToggleActiveButton id={s.id} isActive={s.isActive} isPendingReview={isPendingTab} />
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <p className="text-sm font-bold text-[var(--color-text-tertiary)] italic">No scholarships found in this category.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION FOOTER */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-[var(--color-surface)] border-t border-[var(--color-border)] flex items-center justify-between">
              <p className="text-[10px] font-black text-[var(--color-text-tertiary)] uppercase tracking-widest">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin?tab=${tab}&page=${Math.max(1, page - 1)}&verified=${verifiedFilter || ""}&active=${activeFilter || ""}`}
                  className={cn(
                    "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                    page === 1 ? "opacity-30 cursor-not-allowed pointer-events-none" : "bg-[var(--color-white)] text-[var(--color-text-primary)] hover:bg-[var(--color-primary)] hover:text-white"
                  )}
                >
                  Previous
                </Link>
                <Link
                  href={`/admin?tab=${tab}&page=${Math.min(totalPages, page + 1)}&verified=${verifiedFilter || ""}&active=${activeFilter || ""}`}
                  className={cn(
                    "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                    page === totalPages ? "opacity-30 cursor-not-allowed pointer-events-none" : "bg-[var(--color-white)] text-[var(--color-text-primary)] hover:bg-[var(--color-primary)] hover:text-white"
                  )}
                >
                  Next
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminStatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  const colorStyles = {
    gray: "bg-[var(--color-surface)] text-[var(--color-text-tertiary)] border-[var(--color-border)]",
    green: "bg-[var(--color-primary-surface)] text-[var(--color-primary)] border-[var(--color-primary-border)]",
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 border-blue-100 dark:border-blue-900/30",
    orange: "bg-orange-50 dark:bg-orange-900/20 text-orange-500 dark:text-orange-400 border-orange-100 dark:border-orange-900/30",
  }[color as "gray" | "green" | "blue" | "orange"];

  return (
    <div className="bg-[var(--color-white)] border border-[var(--color-border)] rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-500 group">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500", colorStyles)}>
        <Icon size={24} />
      </div>
      <p className="text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-[0.2em] font-black mb-2">{label}</p>
      <p className="text-4xl font-black text-[var(--color-text-primary)] tracking-tighter">{value}</p>
    </div>
  );
}
