'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  Award,
  CreditCard,
  FileText,
  ChevronLeft,
  ChevronRight,
  FolderTree,
  PenTool,
  DollarSign,
  Briefcase,
  Handshake,
  Home,
  LogOut,
} from 'lucide-react';
import { useState } from 'react';

const mainNavItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Courses',
    href: '/admin/courses',
    icon: BookOpen,
  },
  {
    title: 'Course Categories',
    href: '/admin/categories',
    icon: FolderTree,
  },
  {
    title: 'Blogs',
    href: '/admin/blogs',
    icon: PenTool,
  },
  {
    title: 'Blog Categories',
    href: '/admin/blog-categories',
    icon: FolderTree,
  },
  {
    title: 'Scholarships',
    href: '/admin/scholarships',
    icon: DollarSign,
  },
  {
    title: 'Projects',
    href: '/admin/projects',
    icon: Briefcase,
  },
  {
    title: 'Partnerships',
    href: '/admin/partnerships',
    icon: Handshake,
  },
  {
    title: 'Certificates',
    href: '/admin/certificates',
    icon: Award,
  },
];

const analyticsNavItems = [
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Payments',
    href: '/admin/payments',
    icon: CreditCard,
  },
  {
    title: 'Reports',
    href: '/admin/reports',
    icon: FileText,
  },
];

const settingsNavItems = [
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const NavItem = ({ item }: { item: typeof mainNavItems[0] }) => {
    const Icon = item.icon;
    // Fix dashboard highlighting - only highlight when exactly on /admin, not when it starts with /admin/
    const isActive = item.href === '/admin' ? pathname === '/admin' : pathname === item.href || pathname?.startsWith(item.href + '/');

    return (
      <Button
        asChild
        variant={isActive ? 'secondary' : 'ghost'}
        className={cn(
          'w-full justify-start gap-3 h-11 transition-all px-3',
          collapsed && 'justify-center px-2',
          isActive && 'bg-primary/10 text-primary hover:bg-primary/20 font-medium'
        )}
      >
        <Link href={item.href}>
          <Icon className='h-5 w-5 flex-shrink-0' />
          {!collapsed && <span className='truncate'>{item.title}</span>}
        </Link>
      </Button>
    );
  };

  return (
    <div
      className={cn(
        'flex flex-col h-screen bg-card border-r transition-all duration-300 select-none',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className='flex items-center justify-between p-4 h-16 border-b flex-shrink-0'>
        {!collapsed && (
          <Link href='/' className='flex items-center gap-2 group'>
            <div className='h-8 w-8 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105'>
              <span className='text-primary-foreground font-bold text-sm'>LA</span>
            </div>
            <span className='font-semibold text-foreground tracking-tight'>Back to Site</span>
          </Link>
        )}
        {collapsed && (
          <Link href='/' className='mx-auto'>
            <div className='h-8 w-8 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105'>
              <span className='text-primary-foreground font-bold text-sm'>LA</span>
            </div>
          </Link>
        )}
        <Button
          variant='ghost'
          size='icon'
          className={cn('h-8 w-8', collapsed && 'mx-auto')}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className='h-4 w-4' />
          ) : (
            <ChevronLeft className='h-4 w-4' />
          )}
        </Button>
      </div>

      {/* Navigation Viewport with hidden scrollbar */}
      <ScrollArea className='flex-1 h-[calc(100vh-8rem)] [&>div>div]:!block [&>div>div]:scrollbar-hide'>
        <div className='py-4'>
          {/* Main Navigation Group - space-y-2 spaces out the links */}
          <div className={cn('space-y-2 px-2', collapsed && 'px-1')}>
            {mainNavItems.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>

          <Separator className={cn('my-4 mx-4', collapsed && 'mx-2')} />

          {/* Analytics Group */}
          <div className={cn('space-y-2 px-2', collapsed && 'px-1')}>
            {!collapsed && (
              <p className='text-[11px] font-bold tracking-wider uppercase text-muted-foreground px-2 mb-2'>
                Analytics
              </p>
            )}
            {analyticsNavItems.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>

          <Separator className={cn('my-4 mx-4', collapsed && 'mx-2')} />

          {/* Settings Group */}
          <div className={cn('space-y-2 px-2', collapsed && 'px-1')}>
            {settingsNavItems.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className='p-4 border-t flex-shrink-0 bg-card'>
        <form action='/api/auth/logout' method='POST'>
          <Button
            type='submit'
            variant='ghost'
            className={cn(
              'w-full justify-start gap-3 h-11 text-muted-foreground hover:text-destructive hover:bg-destructive/10 px-3',
              collapsed && 'justify-center px-2'
            )}
          >
            <LogOut className='h-5 w-5 flex-shrink-0' />
            {!collapsed && <span className='font-medium'>Logout</span>}
          </Button>
        </form>
      </div>
    </div>
  );
}