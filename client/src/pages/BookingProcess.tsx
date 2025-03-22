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
              
              {/* Step 2: Date */}
              {activeStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-space-blue-light border-cosmic-purple/20">
                    <CardHeader>
                      <CardTitle>Select Your Travel Dates</CardTitle>
                      <CardDescription>Choose when you want to depart and return</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="departureDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Departure Date</FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  className="bg-space-blue border border-cosmic-purple/30 text-lunar-white"
                                  min={new Date().toISOString().split('T')[0]}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="returnDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Return Date</FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  className="bg-space-blue border border-cosmic-purple/30 text-lunar-white"
                                  min={watchDepartureDate || new Date().toISOString().split('T')[0]}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {watchDepartureDate && watchReturnDate && (
                        <div className="mt-8 p-4 bg-space-blue/40 rounded-lg">
                          <div className="flex items-center mb-2">
                            <h3 className="font-orbitron font-medium">Travel Summary</h3>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <CalendarDays className="h-4 w-4 text-cosmic-purple mr-2" />
                              <span>Departure: {new Date(watchDepartureDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <CalendarDays className="h-4 w-4 text-cosmic-purple mr-2" />
                              <span>Return: {new Date(watchReturnDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 text-cosmic-purple mr-2" />
                              <span>Travelers: {watchTravelers}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              
              {/* Step 3: Package */}
              {activeStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-space-blue-light border-cosmic-purple/20">
                    <CardHeader>
                      <CardTitle>Choose Your Package</CardTitle>
                      <CardDescription>Select the travel package that suits your needs</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="packageId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Travel Package</FormLabel>
                            <FormControl>
                              <RadioGroup
                                value={field.value ? field.value.toString() : ""}
                                onValueChange={(value) => field.onChange(parseInt(value))}
                                className="space-y-4"
                              >
                                {isLoadingPackages ? (
                                  <>
                                    <Skeleton className="h-24 w-full bg-space-blue-light/50 rounded-lg" />
                                    <Skeleton className="h-24 w-full bg-space-blue-light/50 rounded-lg" />
                                    <Skeleton className="h-24 w-full bg-space-blue-light/50 rounded-lg" />
                                  </>
                                ) : packages?.map((pkg) => (
                                  <div key={pkg.id} className="relative">
                                    <RadioGroupItem
                                      value={pkg.id.toString()}
                                      id={`package-${pkg.id}`}
                                      className="peer sr-only"
                                    />
                                    <label
                                      htmlFor={`package-${pkg.id}`}
                                      className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-cosmic-purple/30 bg-space-blue
                                        peer-data-[state=checked]:border-cosmic-purple peer-data-[state=checked]:bg-cosmic-purple/10
                                        cursor-pointer transition-all"
                                    >
                                      <div className="mb-2 md:mb-0">
                                        <div className="font-medium text-lg">{pkg.name}</div>
                                        <p className="text-sm text-lunar-white/70">{pkg.description}</p>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                          {pkg.features.map((feature, i) => (
                                            <Badge key={i} className="bg-cosmic-purple/20 text-cosmic-purple text-xs">
                                              {feature}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-xl font-orbitron font-bold text-aurora-teal">
                                          AED {pkg.price.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-lunar-white/70">per traveler</div>
                                      </div>
                                    </label>
                                    {pkg.isPopular && (
                                      <div className="absolute -top-2 -right-2 bg-stellar-orange text-space-blue text-xs py-1 px-2 rounded-full">
                                        Popular
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              
              {/* Step 4: Accommodations */}
              {activeStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-space-blue-light border-cosmic-purple/20">
                    <CardHeader>
                      <CardTitle>Select Accommodation</CardTitle>
                      <CardDescription>Choose where you'll stay during your journey (optional)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="accommodationId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Accommodation Options</FormLabel>
                            <FormControl>
                              <RadioGroup
                                value={field.value ? field.value.toString() : ""}
                                onValueChange={(value) => field.onChange(parseInt(value))}
                                className="space-y-4"
                              >
                                {/* Option to skip accommodation */}
                                <div className="relative">
                                  <RadioGroupItem
                                    value="0"
                                    id="accommodation-none"
                                    className="peer sr-only"
                                    onClick={() => form.setValue("accommodationId", undefined)}
                                  />
                                  <label
                                    htmlFor="accommodation-none"
                                    className="flex flex-col p-4 rounded-lg border border-cosmic-purple/30 bg-space-blue
                                      peer-data-[state=checked]:border-cosmic-purple peer-data-[state=checked]:bg-cosmic-purple/10
                                      cursor-pointer transition-all"
                                  >
                                    <div className="font-medium text-lg">No Accommodation Needed</div>
                                    <p className="text-sm text-lunar-white/70">
                                      I'll arrange my own accommodation or I'm taking a short trip.
                                    </p>
                                  </label>
                                </div>
                                
                                {isLoadingAccommodations ? (
                                  <>
                                    <Skeleton className="h-32 w-full bg-space-blue-light/50 rounded-lg" />
                                    <Skeleton className="h-32 w-full bg-space-blue-light/50 rounded-lg" />
                                  </>
                                ) : filteredAccommodations.length > 0 ? (
                                  filteredAccommodations.map((accommodation) => (
                                    <div key={accommodation.id} className="relative">
                                      <RadioGroupItem
                                        value={accommodation.id.toString()}
                                        id={`accommodation-${accommodation.id}`}
                                        className="peer sr-only"
                                      />
                                      <label
                                        htmlFor={`accommodation-${accommodation.id}`}
                                        className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border border-cosmic-purple/30 bg-space-blue
                                          peer-data-[state=checked]:border-cosmic-purple peer-data-[state=checked]:bg-cosmic-purple/10
                                          cursor-pointer transition-all"
                                      >
                                        <div className="md:w-1/4">
                                          <div className="h-24 w-full rounded-lg overflow-hidden">
                                            <img 
                                              src={accommodation.imageUrl} 
                                              alt={accommodation.name}
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                        </div>
                                        <div className="md:w-2/4">
                                          <div className="font-medium text-lg">{accommodation.name}</div>
                                          <div className="flex items-center text-stellar-orange text-sm mb-1">
                                            {[...Array(5)].map((_, i) => (
                                              <Star 
                                                key={i} 
                                                className={`h-3 w-3 ${i < accommodation.rating ? "fill-current" : ""}`} 
                                              />
                                            ))}
                                            <span className="ml-1">({accommodation.reviewCount} reviews)</span>
                                          </div>
                                          <p className="text-sm text-lunar-white/70">{accommodation.description}</p>
                                          <div className="flex flex-wrap gap-1 mt-2">
                                            {accommodation.amenities.map((amenity, i) => (
                                              <Badge key={i} className="bg-cosmic-purple/20 text-cosmic-purple text-xs">
                                                {amenity}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                        <div className="md:w-1/4 text-right">
                                          <div className="text-xl font-orbitron font-bold text-aurora-teal">
                                            AED {accommodation.pricePerNight.toLocaleString()}
                                          </div>
                                          <div className="text-xs text-lunar-white/70">per night / traveler</div>
                                        </div>
                                      </label>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-center p-6 bg-space-blue/40 rounded-lg">
                                    <Building className="h-10 w-10 text-cosmic-purple/50 mx-auto mb-2" />
                                    <h3 className="font-medium">No Accommodations Available</h3>
                                    <p className="text-sm text-lunar-white/70">
                                      There are no accommodations available for this destination.
                                    </p>
                                  </div>
                                )}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              
              {/* Step 5: Review */}
              {activeStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-space-blue-light border-cosmic-purple/20">
                    <CardHeader>
                      <CardTitle>Review Your Booking</CardTitle>
                      <CardDescription>Confirm the details of your space journey</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Destination */}
                        <div className="bg-space-blue/40 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-orbitron font-medium flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                Destination
                              </h3>
                              <div className="mt-2">
                                <div className="font-medium">{selectedDestination?.name}</div>
                                <div className="text-sm text-lunar-white/70">{selectedDestination?.location}</div>
                              </div>
                            </div>
                            {selectedDestination && (
                              <div className="w-16 h-16 rounded-lg overflow-hidden">
                                <img 
                                  src={selectedDestination.imageUrl} 
                                  alt={selectedDestination.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Travel Dates */}
                        <div className="bg-space-blue/40 rounded-lg p-4">
                          <h3 className="font-orbitron font-medium flex items-center">
                            <CalendarDays className="h-4 w-4 mr-1" />
                            Travel Dates
                          </h3>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                              <div className="text-sm text-lunar-white/70">Departure</div>
                              <div>{new Date(watchDepartureDate).toLocaleDateString()}</div>
                            </div>
                            <div>
                              <div className="text-sm text-lunar-white/70">Return</div>
                              <div>{new Date(watchReturnDate).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Package Details */}
                        <div className="bg-space-blue/40 rounded-lg p-4">
                          <h3 className="font-orbitron font-medium flex items-center">
                            <Package className="h-4 w-4 mr-1" />
                            Package
                          </h3>
                          <div className="mt-2">
                            <div className="font-medium">{selectedPackage?.name}</div>
                            <div className="text-sm text-lunar-white/70">{selectedPackage?.description}</div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {selectedPackage?.features.map((feature, i) => (
                                <Badge key={i} className="bg-cosmic-purple/20 text-cosmic-purple text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Accommodation */}
                        <div className="bg-space-blue/40 rounded-lg p-4">
                          <h3 className="font-orbitron font-medium flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            Accommodation
                          </h3>
                          <div className="mt-2">
                            {selectedAccommodation ? (
                              <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-lg overflow-hidden">
                                  <img 
                                    src={selectedAccommodation.imageUrl} 
                                    alt={selectedAccommodation.name} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium">{selectedAccommodation.name}</div>
                                  <div className="text-sm text-lunar-white/70">{selectedAccommodation.location}</div>
                                  <div className="text-sm text-aurora-teal">AED {selectedAccommodation.pricePerNight.toLocaleString()} per night</div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-lunar-white/70">No accommodation selected</div>
                            )}
                          </div>
                        </div>
                        
                        {/* Travelers */}
                        <div className="bg-space-blue/40 rounded-lg p-4">
                          <h3 className="font-orbitron font-medium flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            Travelers
                          </h3>
                          <div className="mt-2">
                            <div>{watchTravelers} {watchTravelers === 1 ? 'traveler' : 'travelers'}</div>
                          </div>
                        </div>
                        
                        {/* Price Calculation */}
                        <div className="bg-cosmic-purple/10 rounded-lg p-4 border border-cosmic-purple/30">
                          <h3 className="font-orbitron font-medium mb-2 flex items-center">
                            <CreditCard className="h-4 w-4 mr-1" />
                            Price Summary
                          </h3>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Package: {selectedPackage?.name}</span>
                              <span>AED {selectedPackage ? (selectedPackage.price * watchTravelers).toLocaleString() : 0}</span>
                            </div>
                            
                            {selectedAccommodation && watchDepartureDate && watchReturnDate && (
                              <div className="flex justify-between">
                                <span>
                                  Accommodation: {selectedAccommodation.name}
                                  <div className="text-xs text-lunar-white/70">
                                    {(() => {
                                      const departureDate = new Date(watchDepartureDate);
                                      const returnDate = new Date(watchReturnDate);
                                      const nights = Math.max(1, Math.round((returnDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24)));
                                      return `${nights} ${nights === 1 ? 'night' : 'nights'} × ${watchTravelers} ${watchTravelers === 1 ? 'traveler' : 'travelers'} × AED ${selectedAccommodation.pricePerNight.toLocaleString()}`;
                                    })()}
                                  </div>
                                </span>
                                <span>
                                  AED {(() => {
                                    const departureDate = new Date(watchDepartureDate);
                                    const returnDate = new Date(watchReturnDate);
                                    const nights = Math.max(1, Math.round((returnDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24)));
                                    return (selectedAccommodation.pricePerNight * nights * watchTravelers).toLocaleString();
                                  })()}
                                </span>
                              </div>
                            )}
                            
                            <Separator className="my-2 bg-cosmic-purple/20" />
                            
                            <div className="flex justify-between font-bold text-lg text-aurora-teal">
                              <span>Total Price</span>
                              <span>AED {totalPrice.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
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
