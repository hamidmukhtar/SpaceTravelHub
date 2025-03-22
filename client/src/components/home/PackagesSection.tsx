import { useQuery } from "@tanstack/react-query";
import { CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Package } from "@shared/schema";

const PackageCard = ({ pkg, onSelect }: { pkg: Package; onSelect: (id: number) => void }) => {
  const isVip = pkg.type === 'vip';
  const isLuxury = pkg.type === 'luxury';
  
  return (
    <div className={`bg-space-blue-light rounded-xl overflow-hidden 
      ${isLuxury ? 'border-2 border-cosmic-purple' : isVip ? 'border border-stellar-orange/40' : 'border border-cosmic-purple/20'} 
      transition-all duration-300 hover:shadow-lg hover:shadow-${isVip ? 'stellar-orange' : 'cosmic-purple'}/20 hover:-translate-y-1 relative`}
    >
      {isLuxury && (
        <div className="absolute top-0 right-0 left-0 bg-cosmic-purple text-center py-1">
          <span className="text-xs font-medium">MOST POPULAR</span>
        </div>
      )}
      
      <div className={`p-6 border-b border-cosmic-purple/20 ${isLuxury ? 'mt-6' : ''}`}>
        <h3 className="font-orbitron font-bold text-xl mb-1">{pkg.name}</h3>
        <p className="text-lunar-white/70 text-sm mb-4">{pkg.description}</p>
        <div className="flex items-baseline">
          <span className="font-space-mono text-3xl font-bold text-lunar-white">${pkg.price.toLocaleString()}</span>
          <span className="text-lunar-white/70 text-sm ml-2">/ person</span>
        </div>
      </div>
      
      <div className="p-6">
        <ul className="space-y-4">
          {pkg.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className={`${isVip ? 'text-stellar-orange' : 'text-success'} mr-3 h-5 w-5 mt-0.5`} />
              <span>{feature}</span>
            </li>
          ))}
          
          {/* Render missing features */}
          {pkg.type === 'economy' && (
            <>
              <li className="flex items-start">
                <X className="text-lunar-white/30 mr-3 h-5 w-5 mt-0.5" />
                <span className="text-lunar-white/50">Private space walks</span>
              </li>
              <li className="flex items-start">
                <X className="text-lunar-white/30 mr-3 h-5 w-5 mt-0.5" />
                <span className="text-lunar-white/50">Professional space photography</span>
              </li>
            </>
          )}
          
          {pkg.type === 'luxury' && (
            <li className="flex items-start">
              <X className="text-lunar-white/30 mr-3 h-5 w-5 mt-0.5" />
              <span className="text-lunar-white/50">Professional space photography</span>
            </li>
          )}
        </ul>
        
        <Button 
          className={`w-full mt-8 
            ${isLuxury 
              ? 'bg-cosmic-purple hover:bg-cosmic-purple/80 text-lunar-white' 
              : isVip 
                ? 'bg-space-blue hover:bg-stellar-orange/10 border border-stellar-orange text-stellar-orange' 
                : 'bg-space-blue hover:bg-cosmic-purple/10 border border-cosmic-purple text-cosmic-purple'} 
            font-medium py-3 rounded-lg transition duration-300`}
          onClick={() => onSelect(pkg.id)}
        >
          {`Select ${pkg.type.charAt(0).toUpperCase() + pkg.type.slice(1)}`}
        </Button>
      </div>
    </div>
  );
};

const PackageCardSkeleton = () => (
  <div className="bg-space-blue-light rounded-xl overflow-hidden border border-cosmic-purple/20">
    <div className="p-6 border-b border-cosmic-purple/20">
      <Skeleton className="h-7 w-48 bg-space-blue-light/50 mb-2" />
      <Skeleton className="h-4 w-full bg-space-blue-light/50 mb-6" />
      <Skeleton className="h-9 w-32 bg-space-blue-light/50" />
    </div>
    <div className="p-6">
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-start">
            <Skeleton className="h-5 w-5 mr-3 bg-space-blue-light/50" />
            <Skeleton className="h-5 flex-grow bg-space-blue-light/50" />
          </div>
        ))}
      </div>
      <Skeleton className="h-12 w-full bg-space-blue-light/50 mt-8" />
    </div>
  </div>
);

const PackagesSection = () => {
  const { data: packages, isLoading, error } = useQuery<Package[]>({ 
    queryKey: ['/api/packages'] 
  });

  const handleSelectPackage = (packageId: number) => {
    // In a real app, we'd either navigate to a details page or add to state
    console.log(`Selected package: ${packageId}`);
    // redirect to booking with package pre-selected
    window.location.href = `/booking?package=${packageId}`;
  };

  if (error) {
    console.error("Failed to load packages:", error);
  }

  return (
    <section id="packages" className="relative z-10 py-20 bg-space-blue-light/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-orbitron text-3xl font-bold mb-3">Space Travel Packages</h2>
          <p className="text-lunar-white/70 max-w-2xl mx-auto">Choose the perfect travel package that matches your space exploration desires and budget.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            <>
              <PackageCardSkeleton />
              <PackageCardSkeleton />
              <PackageCardSkeleton />
            </>
          ) : packages?.length ? (
            packages.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} onSelect={handleSelectPackage} />
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-lunar-white/70">No packages available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
