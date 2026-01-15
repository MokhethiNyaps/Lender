'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import Logo from '@/components/logo';
import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import { ContextSwitcher } from '@/components/context-switcher';
import Link from 'next/link';
import {
  Home,
  Landmark,
  Users,
  BarChart3,
  UserCircle,
  PanelLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const bottomNavLinks = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/loans', label: 'Loans', icon: Landmark },
  { href: '/dashboard/groups', label: 'Groups', icon: Users },
  { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
  { href: '/dashboard/profile', label: 'Profile', icon: UserCircle },
];

function BottomNavBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t bg-background md:hidden">
      <div className="mx-auto flex h-full max-w-md items-center justify-around">
        {bottomNavLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== '/dashboard' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex flex-col items-center justify-center text-sm font-medium',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <link.icon className="h-6 w-6" />
              <span className="sr-only">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <ContextSwitcher />
          <MainNav />
        </SidebarContent>
        <SidebarFooter className="p-4">{/* Can add footer items here */}</SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="hidden md:block">
            <ContextSwitcher />
          </div>
          <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <div className="ml-auto flex-1 sm:flex-initial">
              {/* Maybe a global search here */}
            </div>
            <UserNav />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 bg-secondary/50 p-4 pb-20 md:gap-8 md:p-8">
          {children}
        </main>
        {isMobile && <BottomNavBar />}
      </SidebarInset>
    </SidebarProvider>
  );
}
