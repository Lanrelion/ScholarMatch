import { requireAdmin } from "@/lib/admin"

export default async function AdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  await requireAdmin()
  
  return (
    <div style={{ maxWidth: "1000px", 
                  margin: "0 auto", 
                  padding: "24px 16px" }}>
      <div style={{ 
        display: "flex", 
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "24px",
        paddingBottom: "16px",
        borderBottom: "1px solid #e5e7eb"
      }}>
        <div>
          <h1 style={{ fontSize: "18px", 
                       fontWeight: "600",
                       margin: 0,
                       color: "#111827" }}>
            ScholarMatch Admin
          </h1>
          <p style={{ fontSize: "13px", 
                      color: "#6B7280",
                      marginTop: "2px" }}>
            Internal operations panel
          </p>
        </div>
        <a href="/dashboard" 
           style={{ fontSize: "13px", 
                    color: "#1D9E75",
                    textDecoration: "none",
                    fontWeight: "500" }}>
          ← Back to app
        </a>
      </div>
      {children}
    </div>
  )
}
