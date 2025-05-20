// app/_components/Header.jsx

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, Users, PlusCircle, Heart, Calendar } from 'lucide-react';
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';

export default function Header() {
  return (
    <header className="w-full border-b border-border py-4 shadow-sm bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 relative">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 36C27.9411 36 36 27.9411 36 18C36 8.05887 27.9411 0 18 0C8.05887 0 0 8.05887 0 18C0 27.9411 8.05887 36 18 36Z" fill="#7C5DFA"/>
              <path d="M18 27C23.5228 27 28 22.5228 28 17C28 11.4772 23.5228 7 18 7C12.4772 7 8 11.4772 8 17C8 22.5228 12.4772 27 18 27Z" fill="#9277FF"/>
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">HomeFinder</span>
        </Link>
        
        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/buy" className="font-medium hover:text-primary transition-colors flex items-center gap-1.5 group">
            <Home size={16} className="group-hover:text-primary transition-colors" />
            <span>Buy</span>
          </Link>
          <Link href="/rent" className="font-medium hover:text-primary transition-colors flex items-center gap-1.5 group">
            <Search size={16} className="group-hover:text-primary transition-colors" />
            <span>Rent</span>
          </Link>
          <Link href="/sell" className="font-medium hover:text-primary transition-colors flex items-center gap-1.5 group">
            <PlusCircle size={16} className="group-hover:text-primary transition-colors" />
            <span>Sell</span>
          </Link>
          <Link href="/assistant" className="font-medium hover:text-primary transition-colors flex items-center gap-1.5 group">
            <Users size={16} className="group-hover:text-primary transition-colors" />
            <span>AI Assistant</span>
          </Link>
        </nav>
        
        {/* Auth / CTA buttons */}
        <div className="flex items-center gap-3">
          <SignedIn>
            <div className="hidden md:flex items-center gap-3 mr-2">
              <Link href="/dashboard/saved">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Heart size={16} />
                  <span>Saved</span>
                </Button>
              </Link>
              <Link href="/dashboard/appointments">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>Appointments</span>
                </Button>
              </Link>
            </div>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/app/sign-in">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link href="/app/sign-up">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
            <div className="sm:hidden">
              <Link href="/app/sign-in">
                <Button variant="outline" size="icon" className="w-9 h-9 rounded-full">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Button>
              </Link>
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}