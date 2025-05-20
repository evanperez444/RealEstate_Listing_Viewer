// app/page.jsx
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Home, Building2, Tag, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyFilters } from "@/components/PropertyFilters";
import { PropertyCard } from "@/components/PropertyCard";
import PropertyFiltersClient from "./_components/PropertyFiltersClient";

async function getFeaturedProperties() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/properties/featured`, {
    cache: "no-store"
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch properties");
  }
  
  return res.json();
}

// Loading component for the properties section
function PropertyCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6).fill(0).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <div className="p-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3 animate-pulse"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full mt-4 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-black text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1000')" }}
        ></div>
        <div className="container relative z-10 py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Home</h1>
            <p className="text-lg md:text-xl mb-8">Search through thousands of listings to find the perfect home for you and your family.</p>
            
            {/* Search Filters */}
            <PropertyFiltersClient />
          </div>
        </div>
      </section>

      {/* All Listings Section */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Featured Properties</h2>
            <Link href="/buy" className="text-primary font-medium hover:underline flex items-center">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {/* Property Cards Grid */}
          <Suspense fallback={<PropertyCardsSkeleton />}>
            <FeaturedProperties />
          </Suspense>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Our Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary bg-opacity-10 dark:bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Buy a Home</h3>
              <p className="text-gray-600 dark:text-gray-300">Find your place with an immersive photo experience and the most listings, including things you won't find anywhere else.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-500 bg-opacity-10 dark:bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="text-blue-500 h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Rent a Home</h3>
              <p className="text-gray-600 dark:text-gray-300">We're creating a seamless online experience from shopping on the largest rental network, to applying, to paying rent.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500 bg-opacity-10 dark:bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="text-green-500 h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Sell a Home</h3>
              <p className="text-gray-600 dark:text-gray-300">No matter what path you take to sell your home, we can help you navigate a successful sale.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Find Your Dream Home?</h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">Join thousands of satisfied customers who found their perfect property with HomeFinder.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/buy">
              <Button size="lg" variant="secondary">
                Search Properties
              </Button>
            </Link>
            <Link href="/sell">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                List Your Property
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Assistant Promo */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-1/2">
              <div className="aspect-video relative rounded-lg overflow-hidden shadow-lg">
                <Image 
                  src="/images/ai-assistant-demo.jpg" 
                  alt="AI Real Estate Assistant Demo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">Meet Your AI Real Estate Assistant</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Get answers to all your real estate questions, mortgage advice, market trends, and personalized recommendations with our intelligent AI assistant.</p>
              <Link href="/assistant">
                <Button className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>Try AI Assistant</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Featured properties component
async function FeaturedProperties() {
  const properties = await getFeaturedProperties();
  
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No properties available</h3>
        <p className="text-gray-500">Check back soon for new listings!</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard 
          key={property.id} 
          property={property}
        />
      ))}
    </div>
  );
}