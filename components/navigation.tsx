'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { getCategories } from '@/lib/actions/categories';
import { useAuth } from '@/hooks/use-auth';

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

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <nav className="z-50 border-b bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">LA</span>
            <span className="hidden sm:inline">Loyal Academy</span>
          </Link>

          {/* Desktop Menu */}
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

          {/* Desktop Auth */}
          <div className="hidden gap-4 md:flex items-center">
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
                    <Button variant="ghost" size="sm">
                      {user.name || user.email?.split('@')[0]}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
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
                  <Link href={getDashboardLink()}>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button onClick={handleSignOut} variant="ghost" size="sm" className="w-full gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
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
