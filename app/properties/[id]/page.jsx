"use client";

// app/properties/[id]/page.jsx
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { PropertyMap } from "@/components/PropertyMap";
import { AppointmentForm } from "@/components/AppointmentForm";
import { PropertyRating } from "@/components/PropertyRating";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Heart, Phone } from "lucide-react";

// Skeleton for the property details
function PropertyDetailsSkeleton() {
  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto">
        <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-8"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

// Client component for interactive elements

function PropertyDetailsClient({ property }) {
  const [appointmentModalOpen, setAppointmentModalOpen] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(property.isSaved || false);
  const [avgRating, setAvgRating] = React.useState(property.avgRating || 0);
  const [ratingCount, setRatingCount] = React.useState(property.ratingCount || 0);
  
  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await fetch(`/api/saved-properties/${property.id}`, {
          method: 'DELETE',
        });
      } else {
        await fetch(`/api/saved-properties/${property.id}`, {
          method: 'POST',
        });
      }
      
      setIsFavorite(!isFavorite);
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };
  
  const handleRatingUpdated = (newAvgRating, newRatingCount) => {
    setAvgRating(newAvgRating);
    setRatingCount(newRatingCount);
  };
  
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
        <div className="relative">
          <div className="w-full h-96 relative">
            <Image 
              src={property.image_url} 
              alt={property.title} 
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
          <button 
            onClick={handleToggleFavorite}
            className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-md hover:text-primary dark:bg-gray-800"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`h-6 w-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Property Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-wrap justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{property.title}</h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg">{property.address}, {property.city}, {property.state} {property.zip_code}</p>
                <div className="mt-2">
                  <PropertyRating 
                    propertyId={property.id}
                    avgRating={avgRating}
                    ratingCount={ratingCount}
                    onRatingUpdated={handleRatingUpdated}
                  />
                </div>
              </div>
              <div className="text-2xl font-bold text-primary mt-2 lg:mt-0">
                {formatPrice(property.price)}
                {property.listing_type === 'rent' && <span className="text-gray-500 dark:text-gray-400 text-lg font-normal">/month</span>}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-6 mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 13H13.5V16.5H10.5V13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Bedrooms</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{property.bedrooms}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <svg className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 8V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 8V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 8V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Bathrooms</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{property.bathrooms}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <svg className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 11.9999H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 7.07178L12 3L21 7.07178" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.5 11.9999V14.9999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 11.9999V14.9999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.5 11.9999V14.9999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Square Feet</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{property.square_feet.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <svg className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 5H21V21H3V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{property.property_type}</p>
                </div>
              </div>
              
              {property.year_built && (
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 14H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 14H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 14H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 18H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 18H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 18H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Year Built</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{property.year_built}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Description</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-line">{property.description}</p>
            </div>
          </div>
          
          {/* Map Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Location</h2>
            <PropertyMap property={property} />
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Contact/Schedule Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Interested in this property?</h2>
            <Button 
              onClick={() => setAppointmentModalOpen(true)}
              className="w-full mb-4"
              size="lg"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Schedule a Viewing
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="w-full mb-4 flex items-center justify-center"
              onClick={() => window.location.href = `tel:+11234567890`}
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Agent
            </Button>
            
            <Button 
              variant="outline"
              className="w-full"
              onClick={handleToggleFavorite}
            >
              <Heart className={`mr-2 h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              {isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}
            </Button>
          </div>
          
          {/* Property Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Property Details</h2>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Property ID:</span>
                <span className="font-medium text-gray-900 dark:text-white">{property.id}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Price:</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatPrice(property.price)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Property Type:</span>
                <span className="font-medium text-gray-900 dark:text-white">{property.property_type}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Listing Type:</span>
                <span className="font-medium text-gray-900 dark:text-white">{property.listing_type === 'buy' ? 'For Sale' : 'For Rent'}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Bedrooms:</span>
                <span className="font-medium text-gray-900 dark:text-white">{property.bedrooms}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Bathrooms:</span>
                <span className="font-medium text-gray-900 dark:text-white">{property.bathrooms}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Square Feet:</span>
                <span className="font-medium text-gray-900 dark:text-white">{property.square_feet.toLocaleString()}</span>
              </li>
              {property.year_built && (
                <li className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Year Built:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{property.year_built}</span>
                </li>
              )}
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Listed:</span>
                <span className="font-medium text-gray-900 dark:text-white">{new Date(property.created_at).toLocaleDateString()}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Appointment Modal */}
      <AppointmentForm
        propertyId={property.id}
        propertyTitle={property.title}
        isOpen={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
      />
    </>
  );
}

// Server component to fetch property data
async function getProperty(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/properties/${id}`, {
    cache: "no-store"
  });
  
  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch property");
  }
  
  return res.json();
}

// Check if property is saved by the current user
async function checkIfPropertyIsSaved(propertyId) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/saved-properties`, {
      cache: "no-store"
    });
    
    if (!res.ok) {
      return false;
    }
    
    const savedProperties = await res.json();
    return savedProperties.some(p => p.id === propertyId);
  } catch (error) {
    return false;
  }
}

// Main component
export default async function PropertyDetailsPage({ params }) {
  const propertyId = params.id;
  
  const property = await getProperty(propertyId);
  
  if (!property) {
    notFound();
  }
  
  // Check if this property is saved by the current user
  const isSaved = await checkIfPropertyIsSaved(propertyId);
  
  // Add the saved status to the property object
  const propertyWithSavedStatus = {
    ...property,
    isSaved
  };
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <Suspense fallback={<PropertyDetailsSkeleton />}>
            <PropertyDetailsClient property={propertyWithSavedStatus} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}