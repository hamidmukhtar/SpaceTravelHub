import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { 
  CalendarDays, 
  Users, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Rocket,
  CheckCircle,
  X,
  MapPin,
  Building,
  CreditCard,
  Star 
} from "lucide-react";
import type { Destination, Package, Accommodation } from "@shared/schema";

// Steps for the booking process
const steps = ["Destination", "Date", "Package", "Accommodations", "Review"];

// Form schema
const bookingFormSchema = z.object({
  destinationId: z.number().positive("Please select a destination"),
  departureDate: z.string().min(1, "Please select a departure date"),
  returnDate: z.string().min(1, "Please select a return date"),
  travelers: z.number().int().min(1, "At least 1 traveler is required").max(10, "Maximum 10 travelers allowed"),
  packageId: z.number().positive("Please select a package"),
  accommodationId: z.number().optional(),
  // Add mock values for the demo
  userId: z.number().default(1), // Mock user ID
  totalPrice: z.number().min(0).default(0)
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const BookingProcess = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState(0);
  
  // Parse URL query params
  const params = new URLSearchParams(window.location.search);
  const preselectedDestination = params.get("destination") ? parseInt(params.get("destination")!) : undefined;
  const preselectedPackage = params.get("package") ? parseInt(params.get("package")!) : undefined;
  
  // State for total price calculation
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Fetch destinations, packages, and accommodations
  const { data: destinations, isLoading: isLoadingDestinations } = useQuery<Destination[]>({ 
    queryKey: ["/api/destinations"],
  });
  
  const { data: packages, isLoading: isLoadingPackages } = useQuery<Package[]>({ 
    queryKey: ["/api/packages"],
  });
  
  const { data: accommodations, isLoading: isLoadingAccommodations } = useQuery<Accommodation[]>({ 
    queryKey: ["/api/accommodations"],
  });

  // Initialize form
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      destinationId: preselectedDestination || 0,
      departureDate: "",
      returnDate: "",
      travelers: 1,
      packageId: preselectedPackage || 0,
      accommodationId: undefined,
      totalPrice: 0
    }
  });
  
  const watchDestinationId = form.watch("destinationId");
  const watchPackageId = form.watch("packageId");
  const watchAccommodationId = form.watch("accommodationId");
  const watchTravelers = form.watch("travelers");
  const watchDepartureDate = form.watch("departureDate");
  const watchReturnDate = form.watch("returnDate");
  
  // Selected entities
  const selectedDestination = destinations?.find(d => d.id === watchDestinationId);
  const selectedPackage = packages?.find(p => p.id === watchPackageId);
  const selectedAccommodation = accommodations?.find(a => a.id === watchAccommodationId);
  
  // Filter accommodations based on selected destination
  const filteredAccommodations = accommodations?.filter(
    accommodation => accommodation.location === selectedDestination?.name
  ) || [];
  
  // Calculate total price whenever relevant fields change
  useEffect(() => {
    if (!selectedDestination || !selectedPackage) return;
    
    let price = selectedPackage.price * watchTravelers; // Base package price * travelers
    
    // Add accommodation price if selected
    // For simplicity, assume accommodation is per night per person
    if (selectedAccommodation && watchDepartureDate && watchReturnDate) {
      const departureDate = new Date(watchDepartureDate);
      const returnDate = new Date(watchReturnDate);
      const nights = Math.max(1, Math.round((returnDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24)));
      price += selectedAccommodation.pricePerNight * nights * watchTravelers;
    }
    
    setTotalPrice(price);
    form.setValue("totalPrice", price);
  }, [watchDestinationId, watchPackageId, watchAccommodationId, watchTravelers, watchDepartureDate, watchReturnDate, selectedDestination, selectedPackage, selectedAccommodation, form]);
  
  // Handle form submission
  const onSubmit = async (data: BookingFormValues) => {
    try {
      const response = await apiRequest("POST", "/api/bookings", data);
      const booking = await response.json();
      
      toast({
        title: "Booking Confirmed!",
        description: `Your space journey to ${selectedDestination?.name} has been booked successfully!`,
        variant: "default",
      });
      
      // Redirect to dashboard
      setLocation("/dashboard");
    } catch (error) {
      console.error("Booking failed:", error);
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Functions to navigate between steps
  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(current => current + 1);
    }
  };
  
  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(current => current - 1);
    }
  };
  
  // Check if current step is valid before allowing to proceed
  const isStepValid = () => {
    switch (activeStep) {
      case 0: // Destination
        return !!selectedDestination;
      case 1: // Date
        return !!watchDepartureDate && !!watchReturnDate;
      case 2: // Package
        return !!selectedPackage;
      case 3: // Accommodations
        return true; // Accommodation is optional
      case 4: // Review
        return true; // All previous steps are validated
      default:
        return false;
    }
  };
  
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-orbitron text-3xl font-bold mb-10 text-center">Book Your Space Journey</h1>
          
          {/* Progress Bar */}
          <div className="booking-progress-bar flex justify-between mb-10 relative">
            <div className="absolute top-3 left-0 h-0.5 bg-space-blue-light w-full"></div>
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`step relative z-10 text-center flex flex-col items-center ${index <= activeStep ? "active" : ""}`}
              >
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center mb-2
                    ${index < activeStep 
                      ? "bg-success text-space-blue" 
                      : index === activeStep 
                        ? "bg-aurora-teal text-space-blue" 
                        : "bg-space-blue-light text-lunar-white"}`}
                >
                  {index < activeStep ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span className="text-xs md:text-sm">{step}</span>
              </div>
            ))}
          </div>
          
          {/* Booking Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Step 1: Destination */}
              {activeStep === 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-space-blue-light border-cosmic-purple/20">
                    <CardHeader>
                      <CardTitle>Choose Your Destination</CardTitle>
                      <CardDescription>Select where you'd like to travel in the cosmos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="destinationId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Destination</FormLabel>
                            <Select
                              disabled={isLoadingDestinations}
                              value={field.value ? field.value.toString() : ""}
                              onValueChange={(value) => field.onChange(parseInt(value))}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-space-blue border border-cosmic-purple/30 text-lunar-white">
                                  <SelectValue placeholder="Select a destination" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-space-blue border border-cosmic-purple/30 text-lunar-white">
                                {isLoadingDestinations ? (
                                  <div className="p-2">
                                    <Skeleton className="h-5 w-full bg-space-blue-light/50" />
                                  </div>
                                ) : destinations?.map((destination) => (
                                  <SelectItem key={destination.id} value={destination.id.toString()}>
                                    {destination.name}
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
                        name="travelers"
                        render={({ field }) => (
                          <FormItem className="mt-6">
                            <FormLabel>Number of Travelers</FormLabel>
                            <div className="flex items-center">
                              <FormControl>
                                <Input
                                  type="number"
                                  min={1}
                                  max={10}
                                  className="bg-space-blue border border-cosmic-purple/30 text-lunar-white w-20"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <Users className="ml-2 h-5 w-5 text-cosmic-purple" />
                            </div>
                            <FormDescription>Maximum 10 travelers per booking</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {selectedDestination && (
                        <div className="mt-8 p-4 bg-space-blue/40 rounded-lg">
                          <div className="flex items-center mb-2">
                            <h3 className="font-orbitron font-medium">Selected Destination</h3>
                            <Badge className="ml-2 bg-cosmic-purple/20 text-cosmic-purple">{selectedDestination.location}</Badge>
                          </div>
                          <div className="flex items-start space-x-4">
                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={selectedDestination.imageUrl} 
                                alt={selectedDestination.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{selectedDestination.name}</h4>
                              <div className="flex items-center text-sm text-lunar-white/70 my-1">
                                <Rocket className="h-3 w-3 mr-1" />
                                <span>{selectedDestination.distance}</span>
                                <span className="mx-2">•</span>
                                <span>{selectedDestination.travelTime}</span>
                              </div>
                              <div className="flex items-center text-stellar-orange text-sm">
                                <Star className="h-3 w-3 mr-1" />
                                <span>{selectedDestination.rating.toFixed(1)} ({selectedDestination.reviewCount} reviews)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              
              {/* Navigation buttons */}
              <div className="flex justify-between mt-6">
                {activeStep > 0 ? (
                  <Button 
                    type="button"
                    variant="outline" 
                    className="border border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple/10"
                    onClick={prevStep}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                ) : (
                  <Button 
                    type="button"
                    variant="outline" 
                    className="border border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple/10"
                    onClick={() => setLocation("/")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                )}
                
                {activeStep < steps.length - 1 ? (
                  <Button 
                    type="button"
                    className="bg-cosmic-purple hover:bg-cosmic-purple/80 text-lunar-white"
                    onClick={nextStep}
                    disabled={!isStepValid()}
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    className="bg-aurora-teal hover:bg-aurora-teal/80 text-space-blue"
                    disabled={!form.formState.isValid}
                  >
                    Complete Booking
                    <Rocket className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default BookingProcess;
