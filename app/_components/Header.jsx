import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Home, Search, Users } from 'lucide-react';

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
          <span className="text-xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">Logoipsum</span>
        </Link>
        
        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-16">
          <Link href="/for-sale" className="font-medium hover:text-primary transition-colors flex items-center gap-1.5 group">
            <Home size={16} className="group-hover:text-primary transition-colors" />
            <span>For Sale</span>
          </Link>
          <Link href="/for-rent" className="font-medium hover:text-primary transition-colors flex items-center gap-1.5 group">
            <Search size={16} className="group-hover:text-primary transition-colors" />
            <span>For Rent</span>
          </Link>
          <Link href="/agent-finder" className="font-medium hover:text-primary transition-colors flex items-center gap-1.5 group">
            <Users size={16} className="group-hover:text-primary transition-colors" />
            <span>Agent Finder</span>
          </Link>
        </nav>
        
        {/* CTA button */}
        <Button className="bg-primary hover:bg-primary/90 text-white rounded-lg shadow-md hover:shadow-lg transition-all px-5">
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Post Your Ad
          </span>
          <span className="sm:hidden">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </Button>
      </div>
    </header>
  );
}