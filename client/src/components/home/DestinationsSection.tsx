import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { Destination } from "@shared/schema";

const DestinationCard = ({ destination }: { destination: Destination }) => {
  const [, setLocation] = useLocation();

  return (
    <div className="destination-card bg-space-blue-light rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-cosmic-purple/20 hover:-translate-y-1">
      <div className="relative overflow-hidden h-48">
        <img 
          src={destination.imageUrl} 
          alt={destination.name} 
          className="destination-image w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-space-blue/70 backdrop-blur-sm rounded-full px-3 py-1 text-xs">
          <span className="flex items-center text-stellar-orange">
            <Star className="h-3 w-3 mr-1" />
            {destination.rating.toFixed(1)} ({destination.reviewCount})
          </span>
        </div>
        {destination.isNew && (
          <div className="absolute top-4 left-4 bg-stellar-orange text-space-blue rounded-lg px-2 py-1 text-xs font-bold">
            NEW
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-orbitron font-bold text-xl">{destination.name}</h3>
          <span className="bg-cosmic-purple/20 text-cosmic-purple px-2 py-1 rounded-lg text-xs">{destination.location}</span>
        </div>
        <div className="flex items-center text-sm text-lunar-white/70 mb-4">
          <span className="material-icons text-xs mr-1">rocket_launch</span>
          <span>{destination.distance}</span>
          <span className="mx-2">•</span>
          <span className="material-icons text-xs mr-1">schedule</span>
          <span>{destination.travelTime}</span>
        </div>
        <p className="text-sm text-lunar-white/70 mb-4">{destination.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs text-lunar-white/50">Starting from</span>
            <div className="font-space-mono text-lg font-bold text-aurora-teal">
              AED {destination.price.toLocaleString()}
            </div>
          </div>
          <Button 
            variant="outline"
            className="bg-space-blue hover:bg-cosmic-purple/10 border border-cosmic-purple text-cosmic-purple font-medium px-4 py-2 rounded-lg transition duration-300 text-sm"
            onClick={() => setLocation(`/destinations/${destination.id}`)}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

const DestinationCardSkeleton = () => (
  <div className="bg-space-blue-light rounded-xl overflow-hidden">
    <Skeleton className="h-48 w-full bg-space-blue-light/50" />
    <div className="p-6 space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-6 w-36 bg-space-blue-light/50" />
        <Skeleton className="h-6 w-16 bg-space-blue-light/50" />
      </div>
      <Skeleton className="h-4 w-full bg-space-blue-light/50" />
      <Skeleton className="h-16 w-full bg-space-blue-light/50" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-24 bg-space-blue-light/50" />
        <Skeleton className="h-10 w-32 bg-space-blue-light/50" />
      </div>
    </div>
  </div>
);

const DestinationsSection = () => {
  const { data: destinations, isLoading, error } = useQuery<Destination[]>({ 
    queryKey: ['/api/destinations'],
  });

  if (error) {
    console.error("Failed to load destinations:", error);
  }

  return (
    <section id="destinations" className="relative z-10 py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16">
          <div>
            <h2 className="font-orbitron text-3xl font-bold mb-3">Popular Destinations</h2>
            <p className="text-lunar-white/70 max-w-xl">Explore our most sought-after cosmic destinations with breathtaking views and unforgettable experiences.</p>
          </div>
          <div className="mt-6 md:mt-0">
            <Button 
              variant="outline"
              className="border border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple/10 font-medium px-6 py-2 rounded-lg transition duration-300 flex items-center"
            >
              <span>View All</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <>
              <DestinationCardSkeleton />
              <DestinationCardSkeleton />
              <DestinationCardSkeleton />
            </>
          ) : destinations?.length ? (
            destinations.map(destination => (
              <DestinationCard key={destination.id} destination={destination} />
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-lunar-white/70">No destinations available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;
