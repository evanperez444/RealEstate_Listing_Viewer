// app/sell/page.jsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';
import { PropertyForm } from '@/components/PropertyForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Building2, Globe, Zap, TrendingUp } from 'lucide-react';

// Client component for sell page content

function SellPageContent({ isAuthenticated }) {
  return (
    <>
      {/* Main Content */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
            {isAuthenticated ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create a Property Listing</h2>
                <PropertyForm />
              </>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 11V7C7 5.93913 7.42143 4.92172 8.17157 4.17157C8.92172 3.42143 9.93913 3 11 3H13C14.0609 3 15.0783 3.42143 15.8284 4.17157C16.5786 4.92172 17 5.93913 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sign In to List Your Property</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
                  You need to be logged in to create a property listing. Please sign in to your account or create a new one.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/app/sign-in">
                    <Button>
                      Log In
                    </Button>
                  </Link>
                  <Link href="/app/sign-up">
                    <Button variant="outline">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Why List With Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Wider Reach</h3>
              <p className="text-gray-600 dark:text-gray-300">Your property will be seen by thousands of potential buyers or renters actively searching for their next home.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Faster Results</h3>
              <p className="text-gray-600 dark:text-gray-300">Our platform helps you sell or rent your property faster with targeted exposure to qualified buyers and renters.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Better Value</h3>
              <p className="text-gray-600 dark:text-gray-300">Get the best possible price for your property with our market insights and professional presentation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">How It Works</h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            Listing your property with HomeFinder is simple and straightforward. Follow these easy steps:
          </p>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center mb-8">
              <div className="flex-shrink-0 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 md:mb-0 md:mr-6">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Create an Account</h3>
                <p className="text-gray-600 dark:text-gray-300">Sign up for a free HomeFinder account to get started with your listing.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center mb-8">
              <div className="flex-shrink-0 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 md:mb-0 md:mr-6">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Add Your Property Details</h3>
                <p className="text-gray-600 dark:text-gray-300">Fill out our property form with all the important information buyers and renters need to know.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center mb-8">
              <div className="flex-shrink-0 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 md:mb-0 md:mr-6">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Upload Photos</h3>
                <p className="text-gray-600 dark:text-gray-300">Add high-quality photos to showcase your property in the best light.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-shrink-0 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 md:mb-0 md:mr-6">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Connect with Buyers</h3>
                <p className="text-gray-600 dark:text-gray-300">Receive inquiries and appointment requests directly through our platform.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to List Your Property?</h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">Join thousands of successful sellers and landlords who found the right buyers and tenants with HomeFinder.</p>
          {isAuthenticated ? (
            <Button
              size="lg"
              variant="secondary"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Create Your Listing Now
            </Button>
          ) : (
            <Link href="/app/sign-up">
              <Button size="lg" variant="secondary">
                Get Started
              </Button>
            </Link>
          )}
        </div>
      </section>
    </>
  );
}

// Server component for auth check
export default function SellPage() {
  const { userId } = auth();
  
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">List Your Property with HomeFinder</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Reach thousands of potential buyers and renters looking for their next home.
          </p>
        </div>
      </section>

      <SellPageContent isAuthenticated={!!userId} />
    </>
  );
}