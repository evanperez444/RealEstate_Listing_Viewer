// app/dashboard/listings/page.jsx
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home,
  Plus,
  Eye,
  Pencil,
  Trash,
  Building,
  Bath,
  BedDouble,
  SquareFootIcon
} from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Loading skeleton
function ListingsSkeleton() {
  return (
    <div className="space-y-6">
      {Array(3).fill(0).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-4">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="space-y-4 flex-1">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="flex space-x-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex space-x-2">
              <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

// Client component for listings management
"use client";

function MyListingsClient({ properties }) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [propertyToDelete, setPropertyToDelete] = React.useState(null);
  
  const handleDelete = async () => {
    if (!propertyToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/properties/${propertyToDelete}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete property');
      }
      
      // Refresh the page to show updated listings
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete property");
    } finally {
      setIsDeleting(false);
      setPropertyToDelete(null);
    }
  };
  
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <Home className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No properties listed</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
          You haven't listed any properties yet. Create your first property listing to start selling or renting your property.
        </p>
        <Link href="/sell">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Create Listing</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {properties.map((property) => (
          <Card key={property.id}>
            <CardHeader className="pb-4">
              <div className="flex items-center">
                <Badge className={property.listing_type === 'buy' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}>
                  {property.listing_type === 'buy' ? 'For Sale' : 'For Rent'}
                </Badge>
                {property.featured && (
                  <Badge className="ml-2 bg-primary text-white">
                    Featured
                  </Badge>
                )}
                <Badge className="ml-2 capitalize" variant={property.status === 'available' ? 'outline' : 'secondary'}>
                  {property.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 h-48 relative rounded-md overflow-hidden">
                  <Image 
                    src={property.image_url}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{property.title}</h3>
                  <p className="text-primary font-medium mb-2">
                    {formatPrice(property.price)}
                    {property.listing_type === 'rent' && <span className="text-muted-foreground font-normal">/month</span>}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {property.address}, {property.city}, {property.state} {property.zip_code}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <BedDouble className="h-4 w-4 text-muted-foreground" />
                      <span>{property.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4 text-muted-foreground" />
                      <span>{property.bathrooms} Baths</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <SquareFootIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{property.square_feet.toLocaleString()} sq ft</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{property.property_type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex space-x-2">
                <Link href={`/properties/${property.id}`}>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </Button>
                </Link>
                <Link href={`/dashboard/listings/edit/${property.id}`}>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Pencil className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="flex items-center gap-1">
                      <Trash className="h-4 w-4" />
                      <span>Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your property listing and remove it from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDelete(property.id)}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-8">
        <Link href="/sell">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Create New Listing</span>
          </Button>
        </Link>
      </div>
    </>
  );
}

// Server component to fetch user's properties
async function getUserProperties() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/properties/user`, {
    cache: "no-store"
  });
  
  if (!res.ok) {
    return [];
  }
  
  return res.json();
}

export default async function MyListingsPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Your Listings</h2>
        <Link href="/sell">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Listing</span>
          </Button>
        </Link>
      </div>
      
      <Suspense fallback={<ListingsSkeleton />}>
        <MyListingsDisplay />
      </Suspense>
    </>
  );
}

// This is a separate component to allow for Suspense
async function MyListingsDisplay() {
  const properties = await getUserProperties();
  return <MyListingsClient properties={properties} />;
}