// components/PropertyRating.jsx
"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

export function PropertyRating({
  propertyId,
  initialRating = 0,
  avgRating = 0,
  ratingCount = 0,
  className = "",
  onRatingUpdated
}) {
  const { isSignedIn } = useAuth();
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasRated, setHasRated] = useState(!!initialRating);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = (value) => {
    if (!isSignedIn) {
      toast.error("Please sign in to rate this property");
      return;
    }
    
    if (!hasRated) {
      setRating(value);
    }
  };

  const handleSubmit = async () => {
    if (!rating || !isSignedIn) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/properties/${propertyId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }
      
      const data = await response.json();
      
      setHasRated(true);
      toast.success("Thank you for your rating!");
      
      // Update parent component with new rating info
      if (onRatingUpdated) {
        onRatingUpdated(data.avgRating, data.ratingCount);
      }
    } catch (error) {
      toast.error("Error submitting rating. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-center mb-2">
        <span className="text-sm text-gray-600 mr-2">
          {avgRating > 0 ? `${avgRating.toFixed(1)} (${ratingCount} ratings)` : "No ratings yet"}
        </span>
        
        <div className="flex">
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              className={`h-5 w-5 ${
                (hoverRating || rating) >= value
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              } ${hasRated ? "cursor-default" : "cursor-pointer"}`}
              onClick={() => handleClick(value)}
              onMouseEnter={() => !hasRated && setHoverRating(value)}
              onMouseLeave={() => !hasRated && setHoverRating(0)}
            />
          ))}
        </div>
      </div>

      {!hasRated && isSignedIn && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSubmit} 
          disabled={rating === 0 || isSubmitting}
          className="mt-1"
        >
          {isSubmitting ? "Submitting..." : "Rate This Property"}
        </Button>
      )}
    </div>
  );
}