"use client";

// app/buy/page.jsx
import { Suspense } from "react";
import { PropertyFilters } from "@/components/PropertyFilters";
import { PropertyCard } from "@/components/PropertyCard";
import { AppointmentForm } from "@/components/AppointmentForm";
import { Button } from "@/components/ui/button";
import { Grid, List, MapPin } from "lucide-react";

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

// Client component for state management

function BuyRentClient({ listingType = "buy", properties = [] }) {
  const [view, setView] = React.useState("grid");
  const [selectedProperty, setSelectedProperty] = React.useState(null);
  const [appointmentModalOpen, setAppointmentModalOpen] = React.useState(false);
  const [sortOrder, setSortOrder] = React.useState("newest");
  
  // Sort properties based on sort order
  const sortedProperties = React.useMemo(() => {
    if (!properties.length) return [];
    
    const propertiesCopy = [...properties];
    
    switch (sortOrder) {
      case "price_low":
        return propertiesCopy.sort((a, b) => a.price - b.price);
      case "price_high":
        return propertiesCopy.sort((a, b) => b.price - a.price);
      case "newest":
        return propertiesCopy.sort((a, b) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return dateB - dateA;
        });
      default:
        return propertiesCopy;
    }
  }, [properties, sortOrder]);
  
  const handleScheduleViewing = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setAppointmentModalOpen(true);
    }
  };
  
  return (
    <>
      {/* View Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {properties.length} Properties found
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <label htmlFor="sort" className="mr-2 text-sm font-medium">Sort by:</label>
            <select 
              id="sort" 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-1 px-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="newest">Newest</option>
              <option value="price_low">Price (Low to High)</option>
              <option value="price_high">Price (High to Low)</option>
            </select>
          </div>
          
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            <Button 
              variant={view === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("grid")}
              aria-label="Grid view"
              className="px-3 py-1 h-auto rounded-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant={view === "map" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("map")}
              aria-label="Map view"
              className="px-3 py-1 h-auto rounded-none"
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* View Content */}
      {view === "grid" ? (
        sortedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProperties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property}
                onScheduleViewing={handleScheduleViewing}
              />
            ))}
          </div>
        ) : (
          <div className="col-span-full py-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
              <Home className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No properties found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search filters to find more properties.
            </p>
          </div>
        )
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden p-4">
          <div className="aspect-[16/9] relative">
            <Map properties={sortedProperties} />
          </div>
          
          {sortedProperties.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">No properties found in the current map view.</p>
            </div>
          )}
        </div>
      )}
      
      {/* Appointment Modal */}
      {selectedProperty && (
        <AppointmentForm
          propertyId={selectedProperty.id}
          propertyTitle={selectedProperty.title}
          isOpen={appointmentModalOpen}
          onClose={() => {
            setAppointmentModalOpen(false);
            setSelectedProperty(null);
          }}
        />
      )}
    </>
  );
}

// Server component to fetch data
async function getProperties(searchParams) {
  const queryParams = new URLSearchParams(searchParams);
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/properties?${queryParams.toString()}`, {
    cache: "no-store"
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch properties");
  }
  
  return res.json();
}

export default async function BuyRentPage({ params, searchParams }) {
  const listingType = params?.slug?.[0] || "buy";
  
  // Add the listing type to the search params
  const allParams = { ...searchParams, listingType };
  
  return (
    <section className="pt-8 pb-12 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {listingType === "buy" ? "Homes For Sale" : "Homes For Rent"}
        </h1>
        
        {/* Filters Section */}
        <div className="mb-8">
          <PropertyFilters 
            onFilter={(filters) => {
              // This will be handled client-side
              const newParams = new URLSearchParams({ ...filters, listingType });
              window.location.href = `/${listingType}?${newParams.toString()}`;
            }} 
            initialFilters={allParams}
            listingType={listingType}
          />
        </div>
        
        {/* Properties Display */}
        <Suspense fallback={<PropertyCardsSkeleton />}>
          <PropertiesDisplay listingType={listingType} searchParams={allParams} />
        </Suspense>
      </div>
    </section>
  );
}

// This is a separate component to allow for Suspense
async function PropertiesDisplay({ listingType, searchParams }) {
  const properties = await getProperties(searchParams);
  
  return <BuyRentClient listingType={listingType} properties={properties} />;
}

// Dynamic Map component
function Map({ properties = [] }) {
  // In the real implementation we'd use a proper map component
  // This is just a placeholder
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
      <p className="text-gray-500">Map View - {properties.length} properties</p>
    </div>
  );
}