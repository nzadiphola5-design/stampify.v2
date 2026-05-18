import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardMobileNav from "@/components/layout/DashboardMobileNav";
import { BusinessProvider } from "@/lib/supabase/business-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <BusinessProvider>
      <div className="min-h-screen bg-dark-950">
        <DashboardSidebar />
        <DashboardMobileNav />
        <main className="md:pl-64 min-h-screen">
          <div className="p-4 md:p-8 pb-24 md:pb-8">
            {children}
          </div>
        </main>
      </div>
    </BusinessProvider>
  );
}
