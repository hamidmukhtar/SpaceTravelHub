import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  Rocket, 
  Clock, 
  ArrowLeft, 
  CalendarDays, 
  Users, 
  MapPin, 
  Building,
  CheckCircle
} from "lucide-react";
import type { Destination, Accommodation } from "@shared/schema";

const DestinationDetails = () => {
  const params = useParams();
  const [, setLocation] = useLocation();
  const destinationId = parseInt(params.id);
  
  const { data: destination, isLoading: isLoadingDestination, error: destinationError } = useQuery<Destination>({ 
    queryKey: [`/api/destinations/${destinationId}`],
    enabled: !isNaN(destinationId)
  });
  
  const { data: accommodations, isLoading: isLoadingAccommodations, error: accommodationsError } = useQuery<Accommodation[]>({ 
    queryKey: [`/api/accommodations`], 
  });

  useEffect(() => {
    if (isNaN(destinationId)) {
      setLocation('/');
    }
  }, [destinationId, setLocation]);

  if (destinationError || accommodationsError) {
    console.error("Error loading data:", destinationError || accommodationsError);
  }

  const filteredAccommodations = accommodations?.filter(
    accommodation => accommodation.location === destination?.name
  ) || [];

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <Button 
          variant="ghost" 
          className="mb-6 text-cosmic-purple hover:text-cosmic-purple/80 hover:bg-cosmic-purple/10 -ml-2"
          onClick={() => setLocation('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to destinations
        </Button>
        
        {isLoadingDestination ? (
          <DestinationDetailsSkeleton />
        ) : destination ? (
          <>
            <div className="flex flex-col lg:flex-row gap-8 mb-10">
              {/* Main Image */}
              <div className="lg:w-7/12 relative">
                <div className="aspect-[16/9] overflow-hidden rounded-2xl">
                  <img 
                    src={destination.imageUrl} 
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {destination.isNew && (
                  <Badge className="absolute top-4 left-4 bg-stellar-orange text-space-blue">NEW</Badge>
                )}
                <div className="absolute top-4 right-4 bg-space-blue/70 backdrop-blur-sm rounded-full px-3 py-1 text-xs">
                  <span className="flex items-center text-stellar-orange">
                    <Star className="h-3 w-3 mr-1" />
                    {destination.rating.toFixed(1)} ({destination.reviewCount} reviews)
                  </span>
                </div>
              </div>
              
              {/* Details */}
              <div className="lg:w-5/12">
                <div className="flex justify-between items-start mb-3">
                  <h1 className="font-orbitron text-3xl font-bold">{destination.name}</h1>
                  <Badge className="bg-cosmic-purple/20 text-cosmic-purple px-2 py-1">{destination.location}</Badge>
                </div>
                
                <div className="flex items-center text-sm text-lunar-white/70 mb-6">
                  <Rocket className="h-4 w-4 mr-1" />
                  <span>{destination.distance}</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{destination.travelTime}</span>
                </div>
                
                <p className="text-lg text-lunar-white/80 mb-8">{destination.description}</p>
                
                <div className="bg-space-blue-light rounded-xl p-6 glass-effect mb-8">
                  <h3 className="font-orbitron text-lg font-bold mb-4">Trip Highlights</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="text-aurora-teal mr-3 h-5 w-5 mt-0.5" />
                      <span>Zero-gravity experiences in specially designed chambers</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-aurora-teal mr-3 h-5 w-5 mt-0.5" />
                      <span>Panoramic Earth views from observation decks</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-aurora-teal mr-3 h-5 w-5 mt-0.5" />
                      <span>Space cuisine prepared by renowned chefs</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-aurora-teal mr-3 h-5 w-5 mt-0.5" />
                      <span>Expert-guided tours of the {destination.name}</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-col space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-lunar-white/70">Base price from:</span>
                      <span className="font-space-mono text-2xl font-bold text-aurora-teal">AED {destination.price.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-lunar-white/50 text-right">Per person, economy package</div>
                  </div>
                  
                  <Button 
                    className="bg-aurora-teal hover:bg-aurora-teal/80 text-space-blue font-medium py-6 rounded-lg transition duration-300 text-lg"
                    onClick={() => setLocation(`/booking?destination=${destination.id}`)}
                  >
                    Book This Journey
                  </Button>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="accommodations" className="mt-12">
              <TabsList className="bg-space-blue-light border border-cosmic-purple/20 mb-6 w-full justify-start">
                <TabsTrigger 
                  value="accommodations" 
                  className="data-[state=active]:bg-cosmic-purple data-[state=active]:text-white"
                >
                  Accommodations
                </TabsTrigger>
                <TabsTrigger 
                  value="itinerary" 
                  className="data-[state=active]:bg-cosmic-purple data-[state=active]:text-white"
                >
                  Itinerary
                </TabsTrigger>
                <TabsTrigger 
                  value="gallery" 
                  className="data-[state=active]:bg-cosmic-purple data-[state=active]:text-white"
                >
                  Gallery
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className="data-[state=active]:bg-cosmic-purple data-[state=active]:text-white"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="accommodations">
                <h2 className="font-orbitron text-2xl font-bold mb-6">Available Accommodations</h2>
                
                {isLoadingAccommodations ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <AccommodationCardSkeleton />
                    <AccommodationCardSkeleton />
                  </div>
                ) : filteredAccommodations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredAccommodations.map(accommodation => (
                      <AccommodationCard key={accommodation.id} accommodation={accommodation} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-space-blue-light/30 rounded-xl">
                    <Building className="h-12 w-12 text-cosmic-purple/50 mx-auto mb-4" />
                    <h3 className="font-orbitron text-xl mb-2">No Accommodations Found</h3>
                    <p className="text-lunar-white/70 max-w-md mx-auto">
                      No specific accommodations are available for this destination currently.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="itinerary">
                <h2 className="font-orbitron text-2xl font-bold mb-6">Journey Itinerary</h2>
                <div className="bg-space-blue-light/30 rounded-xl p-8">
                  <div className="space-y-8">
                    <div className="relative pl-8 pb-8 border-l border-cosmic-purple/30">
                      <div className="absolute left-0 top-0 w-4 h-4 -translate-x-2 rounded-full bg-cosmic-purple"></div>
                      <h3 className="font-orbitron text-xl font-medium mb-2">Day 1: Launch Day</h3>
                      <p className="text-lunar-white/70">
                        Check in at the spaceport 6 hours before your scheduled departure. 
                        Complete final medical checks and briefing. Experience the thrill of 
                        launch as you leave Earth's atmosphere and begin your journey to {destination.name}.
                      </p>
                    </div>
                    
                    <div className="relative pl-8 pb-8 border-l border-cosmic-purple/30">
                      <div className="absolute left-0 top-0 w-4 h-4 -translate-x-2 rounded-full bg-cosmic-purple"></div>
                      <h3 className="font-orbitron text-xl font-medium mb-2">Day 2: Arrival & Orientation</h3>
                      <p className="text-lunar-white/70">
                        Dock at {destination.name} and receive a warm welcome from the crew. 
                        Settle into your accommodation and participate in an orientation tour of the 
                        facilities. Begin adjusting to the unique environment.
                      </p>
                    </div>
                    
                    <div className="relative pl-8 pb-8 border-l border-cosmic-purple/30">
                      <div className="absolute left-0 top-0 w-4 h-4 -translate-x-2 rounded-full bg-cosmic-purple"></div>
                      <h3 className="font-orbitron text-xl font-medium mb-2">Day 3-5: Exploration & Activities</h3>
                      <p className="text-lunar-white/70">
                        Enjoy scheduled activities including zero-gravity experiences, 
                        Earth observation sessions, and guided tours of {destination.name}. 
                        Luxury and VIP package travelers will experience exclusive activities 
                        such as space walks and private observatory time.
                      </p>
                    </div>
                    
                    <div className="relative pl-8 border-l border-cosmic-purple/30">
                      <div className="absolute left-0 top-0 w-4 h-4 -translate-x-2 rounded-full bg-cosmic-purple"></div>
                      <h3 className="font-orbitron text-xl font-medium mb-2">Final Day: Return to Earth</h3>
                      <p className="text-lunar-white/70">
                        Prepare for departure with a farewell ceremony. Board the return 
                        shuttle and experience re-entry into Earth's atmosphere. Land at the 
                        spaceport and complete post-flight medical checks before returning home 
                        with memories that will last a lifetime.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="gallery">
                <h2 className="font-orbitron text-2xl font-bold mb-6">Photo Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <img 
                    src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Space station exterior" 
                    className="rounded-xl aspect-square object-cover"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Space station interior" 
                    className="rounded-xl aspect-square object-cover"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1581822261290-991b38693d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Lunar surface" 
                    className="rounded-xl aspect-square object-cover"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1545156521-77bd85671d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Mars transit view" 
                    className="rounded-xl aspect-square object-cover"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1636953056323-9c09fdd74fa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Lunar habitat" 
                    className="rounded-xl aspect-square object-cover"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1518365050014-70fe7232897f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Orbital pod" 
                    className="rounded-xl aspect-square object-cover"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="reviews">
                <h2 className="font-orbitron text-2xl font-bold mb-6">Traveler Reviews</h2>
                <div className="space-y-6">
                  <div className="bg-space-blue-light rounded-xl p-6 glass-effect">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                        <img 
                          src="https://randomuser.me/api/portraits/women/54.jpg" 
                          alt="Sarah J." 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">Sarah J.</h4>
                        <div className="flex text-stellar-orange text-sm">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                        <div className="text-xs text-lunar-white/50 mt-1">Visited 3 months ago</div>
                      </div>
                    </div>
                    <p className="text-sm text-lunar-white/80 mb-2">
                      "The experience at {destination.name} was beyond words. Watching Earth from this perspective
                      completely changed how I see our planet. The staff was incredibly attentive to safety 
                      while making the experience magical. Worth every penny!"
                    </p>
                    <Badge className="bg-cosmic-purple/20 text-cosmic-purple">Economy Package</Badge>
                  </div>
                  
                  <div className="bg-space-blue-light rounded-xl p-6 glass-effect">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                        <img 
                          src="https://randomuser.me/api/portraits/men/32.jpg" 
                          alt="Marcus T." 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">Marcus T.</h4>
                        <div className="flex text-stellar-orange text-sm">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                          <Star className="h-4 w-4 fill-current opacity-50" />
                        </div>
                        <div className="text-xs text-lunar-white/50 mt-1">Visited 1 month ago</div>
                      </div>
                    </div>
                    <p className="text-sm text-lunar-white/80 mb-2">
                      "I splurged on the VIP package for my 50th birthday and it was mostly worth it. 
                      The private tours and exclusive access were fantastic, though I wish there had been 
                      more time for space walks. The zero-G cuisine was surprisingly delicious!"
                    </p>
                    <Badge className="bg-stellar-orange/20 text-stellar-orange">VIP Experience</Badge>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button 
                      variant="outline"
                      className="border border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple/10 font-medium px-6 py-3 rounded-lg transition duration-300"
                    >
                      View All {destination.reviewCount} Reviews
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-20">
            <h2 className="font-orbitron text-2xl font-bold mb-4">Destination Not Found</h2>
            <p className="text-lunar-white/70 mb-8">
              The space destination you're looking for doesn't exist or has been moved.
            </p>
            <Button 
              className="bg-cosmic-purple hover:bg-cosmic-purple/80"
              onClick={() => setLocation('/')}
            >
              Return to Homepage
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const AccommodationCard = ({ accommodation }: { accommodation: Accommodation }) => {
  return (
    <div className="flex flex-col bg-space-blue-light rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-cosmic-purple/20">
      <div className="h-48">
        <img 
          src={accommodation.imageUrl} 
          alt={accommodation.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-orbitron font-bold text-xl">{accommodation.name}</h3>
          <div className="flex items-center text-stellar-orange">
            <Star className="h-4 w-4" />
            <span className="ml-1">{accommodation.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex items-center text-sm text-lunar-white/70 mb-4">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{accommodation.location}</span>
          <span className="mx-2">•</span>
          <Users className="h-3 w-3 mr-1" />
          <span>{accommodation.capacity}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {accommodation.amenities.map((amenity, index) => (
            <span 
              key={index} 
              className="bg-cosmic-purple/20 text-cosmic-purple text-xs rounded-full px-3 py-1"
            >
              {amenity}
            </span>
          ))}
        </div>
        <p className="text-sm text-lunar-white/70 mb-4">{accommodation.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <div>
            <span className="text-xs text-lunar-white/50">Per night</span>
            <div className="font-space-mono text-lg font-bold text-aurora-teal">
              AED {accommodation.pricePerNight.toLocaleString()}
            </div>
          </div>
          <Button 
            variant="outline"
            className="bg-space-blue hover:bg-cosmic-purple/10 border border-cosmic-purple text-cosmic-purple font-medium px-4 py-2 rounded-lg transition duration-300 text-sm"
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

const AccommodationCardSkeleton = () => (
  <div className="flex flex-col bg-space-blue-light rounded-xl overflow-hidden">
    <Skeleton className="h-48 w-full bg-space-blue-light/50" />
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-6 w-48 bg-space-blue-light/50" />
        <Skeleton className="h-5 w-16 bg-space-blue-light/50" />
      </div>
      <Skeleton className="h-5 w-full bg-space-blue-light/50" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full bg-space-blue-light/50" />
        <Skeleton className="h-6 w-24 rounded-full bg-space-blue-light/50" />
        <Skeleton className="h-6 w-16 rounded-full bg-space-blue-light/50" />
      </div>
      <Skeleton className="h-16 w-full bg-space-blue-light/50" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-20 bg-space-blue-light/50" />
        <Skeleton className="h-10 w-28 bg-space-blue-light/50" />
      </div>
    </div>
  </div>
);

const DestinationDetailsSkeleton = () => (
  <div className="flex flex-col lg:flex-row gap-8 mb-10">
    <div className="lg:w-7/12">
      <Skeleton className="aspect-[16/9] w-full rounded-2xl bg-space-blue-light/50" />
    </div>
    <div className="lg:w-5/12 space-y-6">
      <div className="flex justify-between items-start">
        <Skeleton className="h-10 w-48 bg-space-blue-light/50" />
        <Skeleton className="h-6 w-16 rounded-lg bg-space-blue-light/50" />
      </div>
      <Skeleton className="h-5 w-36 bg-space-blue-light/50" />
      <Skeleton className="h-[120px] w-full bg-space-blue-light/50" />
      <Skeleton className="h-[180px] w-full rounded-xl bg-space-blue-light/50" />
      <div className="space-y-4 pt-4">
        <div className="flex justify-between">
          <Skeleton className="h-6 w-32 bg-space-blue-light/50" />
          <Skeleton className="h-8 w-24 bg-space-blue-light/50" />
        </div>
        <Skeleton className="h-14 w-full rounded-lg bg-space-blue-light/50" />
      </div>
    </div>
  </div>
);

export default DestinationDetails;
