// components/PropertyCard.jsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Heart, Star } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function PropertyCard({ property, onScheduleViewing }) {
  const { userId, isSignedIn } = useAuth();
  const [isFavorite, setIsFavorite] = useState(property.isSaved || false);
  const [isLoading, setIsLoading] = useState(false);

  const createdDate = new Date(property.created_at);
  const daysAgo = Math.floor((new Date().getTime() - createdDate.getTime()) / (1000 * 3600 * 24));
  const listedText = daysAgo === 0 ? "Listed today" : `Listed ${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`;

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isSignedIn) {
      toast.error("Please sign in to save properties");
      return;
    }
    
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const endpoint = `/api/saved-properties/${property.id}`;
      const method = isFavorite ? 'DELETE' : 'POST';
      
      const response = await fetch(endpoint, { method });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update favorites');
      }
      
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
    } catch (error) {
      console.error('Error updating favorites:', error);
      toast.error("Failed to update favorites");
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleViewing = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isSignedIn) {
      toast.error("Please sign in to schedule a viewing");
      return;
    }
    
    if (onScheduleViewing) {
      onScheduleViewing(property.id);
    }
  };

  // Ensure the price is always a number before formatting
  const price = typeof property.price === 'string' 
    ? parseFloat(property.price) 
    : property.price;

  return (
    <Link href={`/properties/${property.id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:translate-y-[-4px] duration-300">
        <div className="relative">
          <div className="aspect-[4/3] relative">
            <Image 
              src={property.image_url} 
              alt={property.title || 'Property image'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
          </div>
          
          {property.featured && (
            <Badge className="absolute top-2 left-2 bg-primary text-white">
              Featured
            </Badge>
          )}
          
          <button 
            className={`absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:text-primary dark:bg-gray-700 dark:text-gray-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleFavoriteClick}
            disabled={isLoading}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between">
            <span className="text-lg font-bold text-primary">
              {formatPrice(price)}
              {property.listing_type === 'rent' && <span className="text-gray-500 dark:text-gray-400 text-sm font-normal">/month</span>}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{listedText}</span>
          </div>
          
          <h3 className="text-lg font-semibold mt-2 text-gray-900 dark:text-gray-100 line-clamp-1">{property.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{property.city}, {property.state} {property.zip_code}</p>
          
          <div className="flex items-center mt-2">
            {property.avgRating && property.avgRating > 0 ? (
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{Number(property.avgRating).toFixed(1)} ({property.ratingCount || 0})</span>
              </div>
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">No ratings yet</span>
            )}
          </div>
          
          <div className="flex justify-between mt-3">
            <div className="flex items-center">
              <svg className="h-4 w-4 text-gray-400 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 13H13.5V16.5H10.5V13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-300">{property.bedrooms} beds</span>
            </div>
            <div className="flex items-center">
              <svg className="h-4 w-4 text-gray-400 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 8V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 8V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 8V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-300">{property.bathrooms} baths</span>
            </div>
            <div className="flex items-center">
              <svg className="h-4 w-4 text-gray-400 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 11.9999H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 7.07178L12 3L21 7.07178" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.5 11.9999V14.9999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11.9999V14.9999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.5 11.9999V14.9999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-300">{property.square_feet?.toLocaleString() || 0} sq ft</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between">
            <Button variant="link" className="p-0 h-auto text-primary font-medium text-sm hover:underline">
              View Details
            </Button>
            <Button 
              variant="ghost"
              size="sm"
              onClick={handleScheduleViewing}
              className="h-auto p-0 text-gray-600 dark:text-gray-300 text-sm hover:text-primary"
            >
              <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Schedule Viewing
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}