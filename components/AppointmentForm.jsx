// components/AppointmentForm.jsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { format } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Clock } from "lucide-react";

// Appointment form schema
const appointmentFormSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string({
    required_error: "Please select a time",
  }),
  message: z.string().optional(),
});

// No type alias or interface in JS

export function AppointmentForm(props) {
  const { propertyId, propertyTitle, isOpen, onClose } = props;
  const { isSignedIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      date: undefined,
      time: "",
      message: "",
    },
  });

  const onSubmit = async (data) => {
    if (!isSignedIn) {
      toast.error("You must be logged in to schedule a viewing.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Combine date and time
      const [hours, minutes] = data.time.split(":").map(Number);
      const appointmentDate = new Date(data.date);
      appointmentDate.setHours(hours, minutes);

      const appointmentData = {
        propertyId,
        date: appointmentDate.toISOString(),
        message: data.message || "",
      };
      
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to schedule appointment');
      }
      
      toast.success("Your viewing has been scheduled successfully.");
      onClose();
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Viewing</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="font-medium">Property: {propertyTitle}</h3>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 2))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Time</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a time" />
                            <Clock className="h-4 w-4 opacity-50 ml-auto" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                                {time}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Message (Optional)</FormLabel>
                        <FormControl>
                        <Textarea
                            placeholder="Any specific questions or requests for the viewing?"
                            className="resize-none"
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                
                <DialogFooter>
                    <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="mt-2"
                    >
                    Cancel
                    </Button>
                    <Button 
                    type="submit"
                    className="bg-primary text-white hover:bg-primary/90 mt-2"
                    disabled={isSubmitting}
                    >
                    {isSubmitting ? "Scheduling..." : "Schedule Viewing"}
                    </Button>
                </DialogFooter>
                </form>
            </Form>
            </div>
        </DialogContent>
        </Dialog>
    );
    }