"use client";
import { useRouter } from "next/navigation";
import { PropertyFilters } from "@/components/PropertyFilters";
import React from "react";

export default function PropertyFiltersClient({ initialFilters = {}, listingType }) {
  const router = useRouter();

  const handleFilter = (filters) => {
    // Update the URL with filters (or handle as needed)
    router.push(`/buy?${new URLSearchParams(filters).toString()}`);
  };

  return (
    <PropertyFilters
      onFilter={handleFilter}
      initialFilters={initialFilters}
      listingType={listingType}
    />
  );
}