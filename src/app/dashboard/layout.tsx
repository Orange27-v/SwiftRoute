import { Navbar } from '@/components/shared/Navbar';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/shared/Logo';
import { DashboardNav } from './sidebar-nav';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SettingsPopover } from '@/components/dashboard/SettingsPopover';


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login'); // Protect dashboard routes
  }
  
  const navItems = user.role === 'business' ? [
    { href: '/dashboard/business', label: 'Overview', icon: 'LayoutDashboard' as const },
    { href: '/dashboard/business/create-order', label: 'New Delivery', icon: 'PlusCircle' as const },
    { href: '/dashboard/business/orders', label: 'My Orders', icon: 'Package' as const },
    { href: '/dashboard/business/payments', label: 'Payments', icon: 'CreditCard' as const },
  ] : user.role === 'logistics' ? [
    { href: '/dashboard/logistics', label: 'Available Orders', icon: 'LayoutList' as const },
    { href: '/dashboard/logistics/my-deliveries', label: 'My Deliveries', icon: 'Truck' as const },
    { href: '/dashboard/logistics/earnings', label: 'Earnings', icon: 'DollarSign' as const },
    { href: '/dashboard/logistics/profile', label: 'Profile', icon: 'UserCircle' as const },
  ] : [ // Admin items
    { href: '/dashboard/admin', label: 'Overview', icon: 'ShieldCheck' as const }, // Added Admin Overview
    { href: '/dashboard/admin/users', label: 'Manage Users', icon: 'Users' as const },
    { href: '/dashboard/admin/orders', label: 'All Orders', icon: 'PackageSearch' as const },
    { href: '/dashboard/admin/disputes', label: 'Disputes', icon: 'AlertTriangle' as const },
  ];


  return (
    <SidebarProvider defaultOpen>
        <Navbar />
        <div className="flex min-h-[calc(100vh-4rem)]"> {/* Adjust min-height based on Navbar height */}
          <Sidebar collapsible="icon" className="border-r">
            <SidebarHeader className="p-4 flex items-center justify-between">
              <Logo textSize="text-lg hidden group-data-[state=expanded]:block" />
              <SidebarTrigger className="group-data-[state=expanded]:hidden" />
            </SidebarHeader>
            <SidebarContent className="pt-4"> {/* Added padding top */}
                <DashboardNav items={navItems} />
            </SidebarContent>
            <SidebarFooter className="p-2 mt-auto border-t border-border group-data-[state=collapsed]:p-2 group-data-[state=expanded]:px-2 group-data-[state=expanded]:py-2">
                <div className="flex items-center group-data-[state=collapsed]:justify-center group-data-[state=expanded]:justify-start">
                  <SettingsPopover user={user} />
                </div>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className="flex-1 overflow-y-auto">
              <div className="p-4 md:p-6 lg:p-8">
                {children}
              </div>
          </SidebarInset>
        </div>
    </SidebarProvider>
  );
}
