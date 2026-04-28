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
  GraduationCap,
} from 'lucide-react';
import { useState } from 'react';

const mainNavItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Courses',
    href: '/admin/courses',
    icon: BookOpen,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Instructors',
    href: '/admin/instructors',
    icon: GraduationCap,
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
    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

    return (
      <Link href={item.href}>
        <Button
          variant={isActive ? 'secondary' : 'ghost'}
          className={cn(
            'w-full justify-start gap-3 h-11',
            collapsed && 'justify-center px-2',
            isActive && 'bg-primary/10 text-primary hover:bg-primary/20'
          )}
        >
          <Icon className='h-5 w-5 flex-shrink-0' />
          {!collapsed && <span className='truncate'>{item.title}</span>}
        </Button>
      </Link>
    );
  };

  return (
    <div
      className={cn(
        'flex flex-col h-screen bg-card border-r transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className='flex items-center justify-between p-4 h-16 border-b'>
        {!collapsed && (
          <Link href='/admin' className='flex items-center gap-2'>
            <div className='h-8 w-8 rounded-lg bg-primary flex items-center justify-center'>
              <span className='text-primary-foreground font-bold text-sm'>LA</span>
            </div>
            <span className='font-semibold text-foreground'>Admin</span>
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

      {/* Navigation */}
      <ScrollArea className='flex-1 py-4'>
        <div className={cn('space-y-1 px-2', collapsed && 'px-1')}>
          {mainNavItems.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </div>

        {!collapsed && <Separator className='my-4 mx-4' />}
        {collapsed && <Separator className='my-4 mx-2' />}

        <div className={cn('space-y-1 px-2', collapsed && 'px-1')}>
          {!collapsed && (
            <p className='text-xs font-medium text-muted-foreground px-2 mb-2'>
              Analytics
            </p>
          )}
          {analyticsNavItems.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </div>

        {!collapsed && <Separator className='my-4 mx-4' />}
        {collapsed && <Separator className='my-4 mx-2' />}

        <div className={cn('space-y-1 px-2', collapsed && 'px-1')}>
          {settingsNavItems.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className='p-4 border-t'>
        <Link href='/'>
          <Button
            variant='ghost'
            className={cn(
              'w-full justify-start gap-3',
              collapsed && 'justify-center px-2'
            )}
          >
            {!collapsed && <span>Back to Site</span>}
            <ChevronLeft className={cn('h-4 w-4', !collapsed && 'order-first')} />
          </Button>
        </Link>
      </div>
    </div>
  );
}

