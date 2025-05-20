// components/PropertyMap.jsx
"use client";

import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

export function PropertyMap({ property, height = "500px" }) {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  useEffect(() => {
    // Check if Google Maps script is already loaded
    if (!document.getElementById('google-maps-script') && !window.google?.maps) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
    
    return () => {
      // Cleanup if needed
    };
  }, []);
  
  useEffect(() => {
    if (mapLoaded && property && mapRef.current) {
      const { lat, lng } = property;
      const mapOptions = {
        center: { lat: parseFloat(lat), lng: parseFloat(lng) },
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
      };
      
      const map = new window.google.maps.Map(mapRef.current, mapOptions);
      
      // Add marker for the property
      new window.google.maps.Marker({
        position: { lat: parseFloat(lat), lng: parseFloat(lng) },
        map,
        title: property.title,
        animation: window.google.maps.Animation.DROP,
      });
    }
  }, [mapLoaded, property]);
  
  // Function to get Google Maps URL for opening the location
  const getGoogleMapsUrl = () => {
    if (!property) return '#';
    const address = `${property.address}, ${property.city}, ${property.state} ${property.zip_code}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };
  
  // Function to get Google Maps directions URL
  const getDirectionsUrl = () => {
    if (!property) return '#';
    const address = `${property.address}, ${property.city}, ${property.state} ${property.zip_code}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  };
  
  if (!property) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <div className="text-center text-gray-500 p-6">
          <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">Location Information</h3>
          <p>Property location details not available.</p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="w-full shadow-lg overflow-hidden">
      <div className="relative w-full" style={{ height }}>
        <div ref={mapRef} className="w-full h-full"></div>
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start mb-3">
          <MapPin className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium">{property.address}</p>
            <p className="text-gray-600 text-sm">{property.city}, {property.state} {property.zip_code}</p>
          </div>
        </div>
        
        <div className="flex space-x-4 mt-4">
          <a 
            href={getGoogleMapsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary flex items-center text-sm hover:underline"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            View on Google Maps
          </a>
          
          <a 
            href={getDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary flex items-center text-sm hover:underline"
          >
            <Navigation className="h-4 w-4 mr-1" />
            Get Directions
          </a>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-primary font-semibold">{formatPrice(property.price)}</p>
          <p className="text-gray-700 text-sm">{property.bedrooms} beds • {property.bathrooms} baths • {property.square_feet.toLocaleString()} sq ft</p>
        </div>
      </div>
    </Card>
  );
}