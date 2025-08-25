'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaShoppingCart, FaBars, FaChevronDown } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const mainNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/events', label: 'Events & Tickets' },
    { href: '/shop', label: 'Merchandise' }
  ];

  const aboutDropdown = [
    { href: '/about', label: 'About Us' },
    { href: '/instructors', label: 'Instructors' }
  ];

  const resourcesDropdown = [
    { href: '/blog', label: 'Wellness Tips' },
    { href: '/meditations', label: 'Meditations' },
    { href: '/testimonials', label: 'Testimonials' }
  ];

  const galleryDropdown = [
    { href: '/gallery-edition-1', label: 'Edition 1' },
    { href: '/gallery-edition-2', label: 'Edition 2' }
  ];

  const allNavLinks = [
    ...mainNavLinks,
    ...aboutDropdown,
    ...resourcesDropdown,
    { href: '/gallery', label: 'Gallery' },
    { href: '/community', label: 'Community' },
    { href: '/admin', label: 'Admin' }
  ];

  const isActiveLink = (href: string) => pathname === href;
  
  // Check if current page should show cart
  const shouldShowCart = pathname === '/shop';
  
  // Simple admin check (in production, use proper authentication)
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check localStorage only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAdmin(localStorage.getItem('yipn_admin') === 'true');
    }
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border transition-smooth">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img 
              src="/2.png" 
              alt="YIPN Logo" 
              className="w-10 h-10 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-smooth hover:text-secondary ${
                  isActiveLink(link.href) ? 'text-secondary' : 'text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* About Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-secondary transition-smooth">
                <span>About</span>
                <FaChevronDown className="w-3 h-3 animate-float" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-md shadow-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 animate-slide-down">
                {aboutDropdown.map((link) => (
                  <Link key={link.href} href={link.href} className="block px-4 py-2 text-foreground hover:text-secondary hover:bg-muted animate-on-hover">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Gallery Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-secondary transition-smooth">
                <span>Gallery</span>
                <FaChevronDown className="w-3 h-3 animate-float" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-md shadow-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 animate-slide-down">
                {galleryDropdown.map((link) => (
                  <Link key={link.href} href={link.href} className="block px-4 py-2 text-foreground hover:text-secondary hover:bg-muted animate-on-hover">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Resources Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-secondary transition-smooth">
                <span>Resources</span>
                <FaChevronDown className="w-3 h-3 animate-float" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-md shadow-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 animate-slide-down">
                {resourcesDropdown.map((link) => (
                  <Link key={link.href} href={link.href} className="block px-4 py-2 text-foreground hover:text-secondary hover:bg-muted animate-on-hover">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Community Link */}
            <Link
              href="/community"
              className={`text-sm font-medium transition-smooth hover:text-secondary ${
                isActiveLink('/community') ? 'text-secondary' : 'text-foreground'
              }`}
            >
              Community
            </Link>

            {/* Admin Link (only show if admin) */}
            {isAdmin && (
              <Link
                href="/admin"
                className={`text-sm font-medium transition-smooth hover:text-secondary ${
                  isActiveLink('/admin') ? 'text-secondary' : 'text-foreground'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground hover:text-secondary transition-smooth"
          >
            <FaBars className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            <div className="py-4 space-y-2">
              {allNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2 text-sm font-medium transition-smooth hover:text-secondary hover:bg-muted ${
                    isActiveLink(link.href) ? 'text-secondary bg-muted' : 'text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;