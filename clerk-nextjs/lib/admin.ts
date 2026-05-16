import { auth } from "@clerk/nextjs/server"

export async function requireAdmin(): Promise<void> {
  const { userId } = await auth()
  
  if (userId !== process.env.ADMIN_USER_ID) {
    // notFound() gives 404 — does not reveal 
    // the route exists to non-admins
    const { notFound } = await import("next/navigation")
    notFound()
  }
}
