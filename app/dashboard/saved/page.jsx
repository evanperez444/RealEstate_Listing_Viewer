"use client";

// app/dashboard/saved/page.jsx
import { Suspense } from "react";
import { PropertyCard } from "@/components/PropertyCard";
import { AppointmentForm } from "@/components/AppointmentForm";

// Loading component for the properties section
function PropertyCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(3).fill(0).map((_, i) => (
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

// Client component for handling appointment scheduling

function SavedPropertiesClient({ properties }) {
  const [selectedProperty, setSelectedProperty] = React.useState(null);
  const [appointmentModalOpen, setAppointmentModalOpen] = React.useState(false);

  const handleScheduleViewing = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setAppointmentModalOpen(true);
    }
  };

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <Heart className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No saved properties</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
          You haven't saved any properties yet. Browse listings and click the heart icon to save properties for later.
        </p>
        <Link href="/buy">
          <Button>
            Browse Properties
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard 
            key={property.id} 
            property={property}
            onScheduleViewing={handleScheduleViewing}
          />
        ))}
      </div>
      
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

// Server component to fetch saved properties
async function getSavedProperties() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/saved-properties`, {
    cache: "no-store"
  });
  
  if (!res.ok) {
    return [];
  }
  
  return res.json();
}

export default async function SavedPropertiesPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Saved Properties</h2>
      </div>
      
      <Suspense fallback={<PropertyCardsSkeleton />}>
        <SavedPropertiesDisplay />
      </Suspense>
    </>
  );
}

// This is a separate component to allow for Suspense
async function SavedPropertiesDisplay() {
  const properties = await getSavedProperties();
  return <SavedPropertiesClient properties={properties} />;
}