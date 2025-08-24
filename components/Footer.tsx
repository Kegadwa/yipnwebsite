import React from "react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaEnvelope, FaPhone, FaOm } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary-foreground text-primary flex items-center justify-center font-bold animate-float">
                <FaOm className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold">YIPN™</span>
            </div>
            <p className="text-sm opacity-80">
              Find your flow with Yoga in the Park Nairobi™. Building community through wellness, mindfulness, and connection with nature.
            </p>
            <div className="flex space-x-3">
              <button className="opacity-80 hover:opacity-100 hover:bg-primary-foreground/10 rounded p-2 animate-on-hover">
                <FaFacebookF className="w-4 h-4" />
              </button>
              <button className="opacity-80 hover:opacity-100 hover:bg-primary-foreground/10 rounded p-2 animate-on-hover">
                <FaInstagram className="w-4 h-4" />
              </button>
              <button className="opacity-80 hover:opacity-100 hover:bg-primary-foreground/10 rounded p-2 animate-on-hover">
                <FaTwitter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <div className="space-y-2">
              {[
                { href: '/events', label: 'Events & Tickets' },
                { href: '/shop', label: 'Merchandise' },
                { href: '/instructors', label: 'Instructors' },
                { href: '/gallery', label: 'Gallery' }
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm opacity-80 hover:opacity-100 transition-smooth animate-on-hover"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Wellness */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Wellness</h4>
            <div className="space-y-2">
              {[
                { href: '/blog', label: 'Wellness Tips' },
                { href: '/meditations', label: 'Meditation Clips' },
                { href: '/testimonials', label: 'Testimonials' },
                { href: '/about', label: 'Our Mission' }
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm opacity-80 hover:opacity-100 transition-smooth animate-on-hover"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <FaEnvelope className="w-4 h-4" />
                <span>yogaintheparknairobi@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <FaPhone className="w-4 h-4" />
                <span>+254 733 334 041</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm opacity-60">
            © 2025 Yoga in the Park Nairobi™. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};