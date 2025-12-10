'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, useUser, SignInButton, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Sparkles, 
  Menu, 
  X,
  Home,
  FolderKanban,
  Plus,
  Key,
  LogIn,
  Eye
} from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const publicNavLinks = [
    { href: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { href: '/templates', label: 'Templates', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const authenticatedNavLinks = [
    { href: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { href: '/dashboards', label: 'Dashboards', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/templates', label: 'Templates', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const navLinks = isSignedIn ? authenticatedNavLinks : publicNavLinks;

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_50px_rgba(6,182,212,0.1)]' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] transition-all hover:scale-110">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              dash.build
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={isActive(link.href) ? 'default' : 'ghost'}
                  className={`gap-2 ${
                    isActive(link.href) 
                      ? 'shadow-[0_0_30px_rgba(6,182,212,0.3)]' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoaded ? (
              // Loading state
              <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
            ) : isSignedIn ? (
              // Authenticated state
              <>
                {process.env.NEXT_PUBLIC_MY_WORK_URL && (
                  <Button 
                    size="sm"
                    variant="outline"
                    className="shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] border-green-500/50 text-green-400 hover:bg-green-500/10"
                    onClick={() => window.open(process.env.NEXT_PUBLIC_MY_WORK_URL, '_blank')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    My Work
                  </Button>
                )}
                <Link href="/dashboards/create">
                  <Button 
                    size="sm"
                    className="shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)]"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Dashboard
                  </Button>
                </Link>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                      userButtonPopoverCard: "bg-gray-900 border-gray-700",
                      userButtonPopoverActionButton: "text-gray-300 hover:text-white hover:bg-gray-800",
                      userButtonPopoverActionButtonText: "text-gray-300",
                      userButtonPopoverFooter: "hidden"
                    }
                  }}
                  userProfileMode="navigation"
                  userProfileUrl="/profile"
                >
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label="Profile & API Tokens"
                      labelIcon={<Key className="w-4 h-4" />}
                      href="/profile"
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </>
            ) : (
              // Unauthenticated state
              <SignInButton mode="modal">
                <Button 
                  size="sm"
                  variant="outline"
                  className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </SignInButton>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 animate-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive(link.href) ? 'default' : 'ghost'}
                    className={`w-full justify-start gap-2 ${
                      isActive(link.href) 
                        ? 'shadow-[0_0_30px_rgba(6,182,212,0.3)]' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Button>
                </Link>
              ))}
              
              {/* Mobile Auth Section */}
              <div className="mt-4 pt-4 border-t border-white/10">
                {!isLoaded ? (
                  <div className="w-full h-10 rounded-lg bg-gray-700 animate-pulse" />
                ) : isSignedIn ? (
                  <>
                    {process.env.NEXT_PUBLIC_MY_WORK_URL && (
                      <Button 
                        variant="outline"
                        className="w-full shadow-[0_0_20px_rgba(34,197,94,0.3)] border-green-500/50 text-green-400 hover:bg-green-500/10 mb-2"
                        onClick={() => {
                          window.open(process.env.NEXT_PUBLIC_MY_WORK_URL, '_blank');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        My Work
                      </Button>
                    )}
                    <Link 
                      href="/dashboards/create"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button 
                        className="w-full shadow-[0_0_30px_rgba(6,182,212,0.3)] mb-2"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Dashboard
                      </Button>
                    </Link>
                    <div className="flex items-center gap-3 px-3 py-2">
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: "w-8 h-8"
                          }
                        }}
                      />
                      <span className="text-gray-300 text-sm">
                        {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                      </span>
                    </div>
                  </>
                ) : (
                  <SignInButton mode="modal">
                    <Button 
                      variant="outline"
                      className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </SignInButton>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
