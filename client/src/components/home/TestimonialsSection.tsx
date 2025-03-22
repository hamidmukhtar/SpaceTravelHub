import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Testimonial } from "@shared/schema";

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="bg-space-blue-light rounded-xl p-6 glass-effect">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
          <img 
            src={testimonial.avatarUrl} 
            alt={testimonial.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-medium">{testimonial.name}</h4>
          <div className="flex text-stellar-orange text-sm">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < testimonial.rating ? 'fill-current' : 'stroke-current fill-none'}`} 
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm text-lunar-white/80 mb-4">
        "{testimonial.testimonial}"
      </p>
      <div className="text-xs text-lunar-white/50">
        {testimonial.destination} • {testimonial.packageType}
      </div>
    </div>
  );
};

const TestimonialCardSkeleton = () => (
  <div className="bg-space-blue-light rounded-xl p-6 glass-effect">
    <div className="flex items-center mb-4">
      <Skeleton className="w-12 h-12 rounded-full bg-space-blue-light/50 mr-4" />
      <div>
        <Skeleton className="h-5 w-24 bg-space-blue-light/50 mb-2" />
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-4 bg-space-blue-light/50" />
          ))}
        </div>
      </div>
    </div>
    <Skeleton className="h-20 w-full bg-space-blue-light/50 mb-4" />
    <Skeleton className="h-4 w-40 bg-space-blue-light/50" />
  </div>
);

const TestimonialsSection = () => {
  const { data: testimonials, isLoading, error } = useQuery<Testimonial[]>({ 
    queryKey: ['/api/testimonials'] 
  });

  if (error) {
    console.error("Failed to load testimonials:", error);
  }

  return (
    <section className="relative z-10 py-20 bg-space-blue-light/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-orbitron text-3xl font-bold mb-3">What Space Travelers Say</h2>
          <p className="text-lunar-white/70 max-w-2xl mx-auto">Hear from those who've experienced our cosmic journeys and returned with unforgettable memories.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            <>
              <TestimonialCardSkeleton />
              <TestimonialCardSkeleton />
              <TestimonialCardSkeleton />
            </>
          ) : testimonials?.length ? (
            testimonials.map(testimonial => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-lunar-white/70">No testimonials available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
