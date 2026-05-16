"use client";

import { useRouter } from "next/navigation";

interface Props {
  firstName: string | null;
  nationality: string | null;
  currentDegree: string | null;
  fieldOfStudy: string | null;
}

export default function DashboardHeader({ 
  firstName, 
  nationality, 
  currentDegree, 
  fieldOfStudy 
}: Props) {
  const router = useRouter();
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const greeting = getGreeting();
  const displayName = firstName ? `, ${firstName}` : "";

  return (
    <header className="px-4 pt-4 pb-4 flex flex-col gap-4 bg-white">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h1 className="text-lg font-medium text-gray-900 leading-tight">
            {greeting}{displayName}
          </h1>
          <p className="text-gray-500 text-sm font-normal" id="discovery-subtext">
            Find your scholarship
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            aria-label="Search scholarships"
            className="w-11 h-11 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
          >
            <i className="ti-search text-[20px]"></i>
          </button>
          <button
            aria-label="Notifications"
            className="w-11 h-11 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
          >
            <i className="ti-bell text-[20px]"></i>
          </button>
        </div>
      </div>

      {/* Profile Summary Row */}
      <div 
        onClick={() => router.push("/profile")}
        className="bg-gray-50 rounded-xl px-3 py-2.5 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center gap-1.5 flex-wrap">
          {nationality && (
            <div className="bg-white border border-gray-200 rounded-full px-2 py-0.5 text-[10px] font-medium text-gray-600 flex items-center gap-1">
              <span className="text-xs">{nationality === 'NG' ? '🇳🇬' : nationality === 'KE' ? '🇰🇪' : '🌍'}</span>
              {nationality}
            </div>
          )}
          {currentDegree && (
            <div className="bg-white border border-gray-200 rounded-full px-2 py-0.5 text-[10px] font-medium text-gray-600">
              {currentDegree.charAt(0) + currentDegree.slice(1).toLowerCase()}
            </div>
          )}
          {fieldOfStudy && (
            <div className="bg-white border border-gray-200 rounded-full px-2 py-0.5 text-[10px] font-medium text-gray-600 max-w-[120px] truncate">
              {fieldOfStudy}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 text-[#1D9E75] font-semibold text-[10px] shrink-0 ml-2">
          <span>Edit</span>
          <i className="ti-pencil"></i>
        </div>
      </div>
    </header>
  );
}
