"use client";

// app/dashboard/appointments/page.jsx
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";

// Loading skeleton
function AppointmentsSkeleton() {
  return (
    <div className="space-y-4">
      {Array(3).fill(0).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

// Client component for cancelling appointments

function AppointmentCard({ appointment }) {
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel appointment');
      }
      
      // Refresh the page to show updated status
      window.location.reload();
    } catch (error) {
      toast.error("Failed to cancel appointment");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format appointment date and time
  const appointmentDate = new Date(appointment.date);
  const formattedDate = format(appointmentDate, "MMMM d, yyyy");
  const formattedTime = format(appointmentDate, "h:mm a");
  
  // Determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  const property = appointment.property;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Viewing Appointment</CardTitle>
          <Badge className={getStatusColor(appointment.status)}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </Badge>
        </div>
        <CardDescription className="flex items-center space-x-1">
          <Calendar className="h-3 w-3" />
          <span>Scheduled for {formattedDate} at {formattedTime}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4">
          <div className="w-24 h-24 relative rounded-md overflow-hidden">
            <Image 
              src={property.image_url}
              alt={property.title}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold mb-1">{property.title}</h3>
            <p className="text-sm text-muted-foreground flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {property.address}, {property.city}
            </p>
            <p className="text-sm font-medium text-primary mt-1">
              {formatPrice(property.price)}
              {property.listing_type === 'rent' && <span className="text-muted-foreground font-normal">/month</span>}
            </p>
          </div>
        </div>
        
        {appointment.message && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">Your message:</p>
            <p className="text-sm mt-1">{appointment.message}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/properties/${property.id}`}>
          <Button variant="outline" size="sm">
            View Property
          </Button>
        </Link>
        
        {appointment.status === 'pending' || appointment.status === 'confirmed' ? (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleCancel}
            disabled={isLoading}
          >
            {isLoading ? "Cancelling..." : "Cancel Appointment"}
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}

function AppointmentsClient({ appointments }) {
  if (!appointments || appointments.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <Calendar className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No appointments</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
          You don't have any scheduled property viewings. Browse listings and schedule a viewing to see appointments here.
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
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <AppointmentCard key={appointment.id} appointment={appointment} />
      ))}
    </div>
  );
}

// Server component to fetch appointments
async function getAppointments() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/appointments`, {
    cache: "no-store"
  });
  
  if (!res.ok) {
    return [];
  }
  
  return res.json();
}

export default async function AppointmentsPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Your Appointments</h2>
      </div>
      
      <Suspense fallback={<AppointmentsSkeleton />}>
        <AppointmentsDisplay />
      </Suspense>
    </>
  );
}

// This is a separate component to allow for Suspense
async function AppointmentsDisplay() {
  const appointments = await getAppointments();
  return <AppointmentsClient appointments={appointments} />;
}