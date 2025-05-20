// app/dashboard/layout.jsx
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import { Heart, Calendar, Home } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/app/sign-in');
  }
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <Tabs defaultValue="saved" className="mb-8">
        <TabsList className="w-full max-w-md grid grid-cols-3">
          <Link href="/dashboard/saved" passHref legacyBehavior>
            <TabsTrigger value="saved" className="flex items-center gap-2" asChild>
              <a>
                <Heart className="h-4 w-4" />
                <span>Saved Properties</span>
              </a>
            </TabsTrigger>
          </Link>
          <Link href="/dashboard/appointments" passHref legacyBehavior>
            <TabsTrigger value="appointments" className="flex items-center gap-2" asChild>
              <a>
                <Calendar className="h-4 w-4" />
                <span>Appointments</span>
              </a>
            </TabsTrigger>
          </Link>
          <Link href="/dashboard/listings" passHref legacyBehavior>
            <TabsTrigger value="listings" className="flex items-center gap-2" asChild>
              <a>
                <Home className="h-4 w-4" />
                <span>My Listings</span>
              </a>
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
      
      {children}
    </div>
  );
}