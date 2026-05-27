'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, LogOut, LayoutDashboard, ChevronDown, User, Settings } from 'lucide-react';
import { getCategories } from '@/lib/actions/categories';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<{id: string, name: string, slug: string}[]>([]);
  const { user, isLoading: loading, logout } = useAuth();

  // Get the appropriate dashboard link based on user role
  const getDashboardLink = () => {
    if (!user) return '/student';
    switch (user.role) {
      case 'STUDENT':
        return '/student';
      case 'INSTRUCTOR':
        return '/instructor';
      case 'ADMIN':
        return '/admin';
      case 'CLIENT':
        return '/client';
      case 'DONOR':
        return '/donor';
      default:
        return '/student';
    }
  };

  // Get initials from user name
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <nav className="z-50 border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <span className="text-primary">LLA</span>
            </Link>
          </div>

          {/* Desktop Menu - Center */}
          <div className="hidden gap-8 md:flex md:items-center">
            <Link href="/" className="text-sm hover:text-primary transition">
              Home
            </Link>

            <div className="relative group">
              <button className="text-sm hover:text-primary transition flex items-center gap-1 py-4">
                Categories
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 hidden group-hover:block w-48 pt-2 z-50">
                <div className="bg-background border rounded-md shadow-lg p-2 flex flex-col gap-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/courses/${cat.slug}`}
                      className="px-4 py-2 text-sm hover:bg-muted rounded-md transition"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  {categories.length === 0 && (
                    <div className="px-4 py-2 text-sm text-muted-foreground">No categories</div>
                  )}
                </div>
              </div>
            </div>

            <Link href="/about" className="text-sm hover:text-primary transition">
              About
            </Link>
            <Link href="/outsourcing" className="text-sm hover:text-primary transition">
              Outsourcing
            </Link>
            <Link href="/scholarships" className="text-sm hover:text-primary transition">
              Scholarships
            </Link>
            <Link href="/blog" className="text-sm hover:text-primary transition">
              Blog
            </Link>
            <Link href="/contact" className="text-sm hover:text-primary transition">
              Contact
            </Link>
          </div>

          {/* Desktop Auth - Right */}
          <div className="hidden gap-4 md:flex items-center flex-shrink-0">
            {loading ? (
              <div className="h-8 w-24 animate-pulse bg-muted rounded" />
            ) : user ? (
              <>
                <Link href={getDashboardLink()}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl || undefined} alt={user.name || 'User'} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {user.name || user.email}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile" className="gap-2 cursor-pointer">
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings" className="gap-2 cursor-pointer">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer gap-2">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-4">
            <Link href="/" className="block text-sm hover:text-primary py-2">
              Home
            </Link>

            <div className="space-y-2 py-2">
              <div className="font-medium text-sm text-foreground/80 px-2">Categories</div>
              <div className="pl-4 flex flex-col gap-2 border-l-2 ml-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/courses/${cat.slug}`}
                    className="block text-sm hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
                {categories.length === 0 && (
                  <div className="text-sm text-muted-foreground">No categories</div>
                )}
              </div>
            </div>

            <Link href="/about" className="block text-sm hover:text-primary py-2">
              About
            </Link>
            <Link href="/outsourcing" className="block text-sm hover:text-primary py-2">
              Outsourcing
            </Link>
            <Link href="/scholarships" className="block text-sm hover:text-primary py-2">
              Scholarships
            </Link>
            <Link href="/blog" className="block text-sm hover:text-primary py-2">
              Blog
            </Link>
            <Link href="/contact" className="block text-sm hover:text-primary py-2">
              Contact
            </Link>
            <div className="pt-4 border-t space-y-2">
              {loading ? (
                <div className="h-8 w-full animate-pulse bg-muted rounded" />
              ) : user ? (
                <>
                  <div className="flex items-center gap-2 px-2 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl || undefined} alt={user.name || 'User'} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user.name || user.email}</span>
                  </div>
                  <Link href={getDashboardLink()} onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/dashboard/profile" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full gap-2 justify-start">
                      <User className="h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                  <Link href="/dashboard/settings" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full gap-2 justify-start">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Button>
                  </Link>
                  <Button onClick={handleSignOut} variant="ghost" size="sm" className="w-full gap-2 justify-start text-destructive">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
