import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-6 bg-white">
      <div className="flex flex-col items-center max-w-sm w-full">
        <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
          <i className="ti-wifi-off text-4xl text-gray-300"></i>
        </div>
        
        <h1 className="text-xl font-semibold text-gray-900 mt-6">
          You're offline
        </h1>
        
        <p className="text-sm text-gray-500 text-center mt-2 leading-relaxed">
          Your saved scholarships are still available. Other pages will load when you reconnect.
        </p>
        
        <Link 
          href="/saved"
          className="w-full mt-8 bg-[#1D9E75] text-white rounded-xl px-6 py-3.5 text-sm font-medium text-center shadow-sm hover:bg-[#188a66] transition-colors active:scale-[0.98]"
        >
          View saved scholarships
        </Link>
        
        <p className="text-xs text-gray-400 mt-6">
          Check your internet connection and try again
        </p>
      </div>
    </div>
  )
}
