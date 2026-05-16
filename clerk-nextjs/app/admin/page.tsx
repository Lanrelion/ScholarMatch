import { db } from "@/lib/db";
import Link from "next/link";
import { ToggleActiveButton } from "./ToggleActiveButton";
import { AdminTabs } from "./AdminTabs";

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const params = await searchParams;
  const tab = params.tab || "all";
  console.log("ADMIN PAGE RENDERED - TAB:", tab);

  const isPendingTab = tab === "pending";

  const scholarships = await db.scholarship.findMany({
    where: isPendingTab ? { isActive: false, verified: false } : undefined,
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
  });

  const totalSaves = scholarships.reduce((acc, s) => acc + s._count.savedBy, 0);
  const activeCount = scholarships.filter(s => s.isActive).length;
  const verifiedCount = scholarships.filter(s => s.verified).length;

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-600 mb-4">ADMIN V2 - CRAWLER READY</h1>
      {/* STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
          <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900">{scholarships.length}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
          <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mb-1">Active</p>
          <p className="text-2xl font-bold text-[#1D9E75]">{activeCount}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
          <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mb-1">Verified</p>
          <p className="text-2xl font-bold text-blue-600">{verifiedCount}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
          <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mb-1">Total Saves</p>
          <p className="text-2xl font-bold text-orange-600">{totalSaves}</p>
        </div>
      </div>

      <AdminTabs currentTab={tab} />

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Provider</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Deadline</th>
                {!isPendingTab && <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>}
                {!isPendingTab && <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Verified</th>}
                {isPendingTab && <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Degrees & Fields</th>}
                {!isPendingTab && <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Saves</th>}
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {scholarships.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-[250px]" title={s.title}>
                      {s.sourceUrl ? (
                        <a href={s.sourceUrl} target="_blank" rel="noreferrer" className="hover:underline text-blue-600">
                          {s.title}
                        </a>
                      ) : (
                        s.title
                      )}
                    </div>
                    {s.lastCrawledAt && (
                      <p className="text-[10px] text-gray-400 mt-1">
                        Crawled {new Date(s.lastCrawledAt).toLocaleDateString()}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{s.provider}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {s.deadline ? new Date(s.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : "Open"}
                  </td>
                  {!isPendingTab && (
                    <td className="px-4 py-4">
                      {s.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </td>
                  )}
                  {!isPendingTab && (
                    <td className="px-4 py-4 text-center">
                      {s.verified ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  )}
                  {isPendingTab && (
                    <td className="px-4 py-4 text-xs text-gray-600">
                      <div><span className="font-semibold">Degrees:</span> {s.eligibleDegrees?.join(", ") || "Any"}</div>
                      <div className="mt-1"><span className="font-semibold">Fields:</span> {s.fieldsOfStudy?.join(", ") || "Any"}</div>
                    </td>
                  )}
                  {!isPendingTab && (
                    <td className="px-4 py-4 text-sm text-gray-600 font-medium">{s._count.savedBy}</td>
                  )}
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end items-center gap-3">
                      <Link 
                        href={`/admin/${s.id}/edit`}
                        className="text-[#1D9E75] hover:text-[#0F6E56] text-xs font-semibold"
                      >
                        {isPendingTab ? "Edit first" : "Edit"}
                      </Link>
                      <ToggleActiveButton id={s.id} isActive={s.isActive} isPendingReview={isPendingTab} />
                    </div>
                  </td>
                </tr>
              ))}
              {scholarships.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                    No scholarships found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
