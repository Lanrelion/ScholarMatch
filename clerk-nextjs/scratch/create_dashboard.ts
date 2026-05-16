import * as fs from 'fs';
import * as path from 'path';

const dashboardDir = path.resolve('app', 'dashboard');
if (!fs.existsSync(dashboardDir)) {
  fs.mkdirSync(dashboardDir, { recursive: true });
}

const dashboardPage = `import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import NavBar from "@/components/NavBar";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const profile = await db.profile.findUnique({
    where: { userId },
  });

  if (!profile) redirect("/onboarding/step/1");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar isSignedIn={true} />
      <main className="flex-1 p-8 pt-24 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {profile.firstName || 'Student'}!</h1>
            <p className="text-gray-500">Here are your personalized scholarship matches.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* We will implement the ScholarshipCard component soon */}
            <div className="p-12 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center col-span-full bg-white shadow-sm">
               <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 text-2xl font-bold">✓</div>
               <h3 className="text-xl font-semibold text-gray-900">Matches Found</h3>
               <p className="text-gray-500 mt-2">Scholarships matching your profile are being loaded...</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}`;

fs.writeFileSync(path.join(dashboardDir, 'page.tsx'), dashboardPage);
console.log("Dashboard directory and page created!");
