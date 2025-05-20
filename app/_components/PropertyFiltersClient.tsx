// app/_components/PropertyFiltersClient.jsx
"use client";
import { useRouter } from "next/navigation";
import { PropertyFilters } from "@/components/PropertyFilters";
import React from "react";

export default function PropertyFiltersClient({ initialFilters = {}, listingType }) {
  const router = useRouter();

  const handleFilter = (filters) => {
    const queryParams = new URLSearchParams();
    
    // Add listingType to filters if provided
    if (listingType) {
      queryParams.append("listingType", listingType);
    }
    
    // Add all other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) { // Only append if there's a value
        queryParams.append(key, value);
      }
    });
    
    // Determine the path based on listing type
    const path = listingType === "rent" ? "/rent" : "/buy";
    
    // Navigate to the filtered page
    router.push(`${path}?${queryParams.toString()}`);
  };

  return (
    <PropertyFilters
      onFilter={handleFilter}
      initialFilters={initialFilters}
      listingType={listingType}
    />
  );
}