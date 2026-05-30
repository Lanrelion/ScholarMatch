"use client";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface text-center">
      <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256" className="text-moss">
          <path d="M197.58,69.58a113.88,113.88,0,0,0-139.16,0,8,8,0,1,1-10.84-11.16,130,130,0,0,1,160.84,0,8,8,0,0,1-10.84,11.16ZM168,102.77a74.1,74.1,0,0,0-80,0,8,8,0,1,0,9,13.25,58,58,0,0,1,62,0,8,8,0,0,0,9-13.25Zm-28,34.05a33.72,33.72,0,0,0-24,0,8,8,0,1,0,7.18,14.34,17.84,17.84,0,0,1,10.64,0,8,8,0,0,0,6.18-14.34ZM128,176a12,12,0,1,0,12,12A12,12,0,0,0,128,176Z"></path>
        </svg>
      </div>
      <h1 className="text-2xl font-editorial font-medium text-ink mb-2">You're Offline</h1>
      <p className="text-ink-secondary font-ui text-[15px] max-w-sm mx-auto mb-8">
        It looks like you've lost your internet connection. ScholarMatch needs the internet to find your latest opportunities.
      </p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-6 py-2.5 bg-moss text-white rounded-full font-ui text-[14px] font-medium hover:bg-moss-dark transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
