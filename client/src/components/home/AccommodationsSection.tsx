import { useQuery } from "@tanstack/react-query";
import { FilterX, SortAsc, Star, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Accommodation } from "@shared/schema";

const AccommodationCard = ({ accommodation }: { accommodation: Accommodation }) => {
  return (
    <div className="flex flex-col md:flex-row bg-space-blue-light rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-cosmic-purple/20">
      <div className="md:w-2/5 h-48 md:h-auto">
        <img 
          src={accommodation.imageUrl} 
          alt={accommodation.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="md:w-3/5 p-6">
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
              ${accommodation.pricePerNight.toLocaleString()}
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
  <div className="flex flex-col md:flex-row bg-space-blue-light rounded-xl overflow-hidden">
    <div className="md:w-2/5 h-48 md:h-auto">
      <Skeleton className="w-full h-full bg-space-blue-light/50" />
    </div>
    <div className="md:w-3/5 p-6">
      <div className="flex justify-between items-start mb-2">
        <Skeleton className="h-7 w-40 bg-space-blue-light/50" />
        <Skeleton className="h-5 w-16 bg-space-blue-light/50" />
      </div>
      <Skeleton className="h-5 w-48 bg-space-blue-light/50 mb-4" />
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-24 rounded-full bg-space-blue-light/50" />
        <Skeleton className="h-6 w-32 rounded-full bg-space-blue-light/50" />
        <Skeleton className="h-6 w-28 rounded-full bg-space-blue-light/50" />
      </div>
      <Skeleton className="h-16 w-full bg-space-blue-light/50 mb-4" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-24 bg-space-blue-light/50" />
        <Skeleton className="h-10 w-28 bg-space-blue-light/50" />
      </div>
    </div>
  </div>
);

const AccommodationsSection = () => {
  const { data: accommodations, isLoading, error } = useQuery<Accommodation[]>({ 
    queryKey: ['/api/accommodations'] 
  });

  if (error) {
    console.error("Failed to load accommodations:", error);
  }

  return (
    <section id="accommodations" className="relative z-10 py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16">
          <div>
            <h2 className="font-orbitron text-3xl font-bold mb-3">Space Accommodations</h2>
            <p className="text-lunar-white/70 max-w-xl">Find your perfect stay among our selection of cosmic lodgings designed for comfort in zero gravity.</p>
          </div>
          <div className="mt-6 md:mt-0 flex space-x-3">
            <Button 
              className="bg-cosmic-purple hover:bg-cosmic-purple/80 text-lunar-white font-medium px-4 py-2 rounded-lg transition duration-300 flex items-center text-sm"
            >
              <FilterX className="mr-1 h-4 w-4" />
              Filter
            </Button>
            <Button 
              variant="outline"
              className="border border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple/10 font-medium px-4 py-2 rounded-lg transition duration-300 flex items-center text-sm"
            >
              <SortAsc className="mr-1 h-4 w-4" />
              Sort By
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading ? (
            <>
              <AccommodationCardSkeleton />
              <AccommodationCardSkeleton />
            </>
          ) : accommodations?.length ? (
            accommodations.map(accommodation => (
              <AccommodationCard key={accommodation.id} accommodation={accommodation} />
            ))
          ) : (
            <div className="col-span-2 text-center py-10">
              <p className="text-lunar-white/70">No accommodations available at the moment.</p>
            </div>
          )}
        </div>
        
        <div className="mt-10 text-center">
          <Button 
            variant="outline"
            className="border border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple/10 font-medium px-6 py-3 rounded-lg transition duration-300"
          >
            View More Accommodations
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AccommodationsSection;
