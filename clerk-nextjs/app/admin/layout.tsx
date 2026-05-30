import { requireAdmin } from "@/lib/admin"
import { ThemeToggle } from "./ThemeToggle"

export default async function AdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  await requireAdmin()
  
  return (
    <div className="min-h-screen bg-[var(--color-surface)] transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-ink)] flex items-center justify-center text-[var(--color-surface)] shadow-xl shadow-black/10">
              <span className="font-black text-xl">S</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-[var(--color-ink)] leading-none tracking-tighter">
                Control Center
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-ink-tertiary)] mt-1.5">
                ScholarMatch Operations
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <ThemeToggle />
          </div>
        </header>
        
        <main className="animate-in slide-in-from-bottom-4 duration-700">
          {children}
        </main>
      </div>
    </div>
  )
}
