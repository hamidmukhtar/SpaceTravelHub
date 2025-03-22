import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [, setLocation] = useLocation();

  return (
    <section className="relative pt-20 pb-32 z-10 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-6 mb-10 md:mb-0">
            <div>
              <span className="bg-cosmic-purple/20 text-cosmic-purple px-4 py-1 rounded-full text-sm font-medium">NEW DESTINATION</span>
            </div>
            <h1 className="font-orbitron text-4xl md:text-6xl font-bold leading-tight">
              Experience the <span className="text-cosmic-purple">Ultimate</span> Space <span className="text-aurora-teal">Adventure</span>
            </h1>
            <p className="text-lunar-white/70 text-lg max-w-lg">
              Book your journey to space stations, lunar hotels, and beyond. Discover the cosmos like never before with premium space travel packages.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <Button 
                className="bg-aurora-teal hover:bg-aurora-teal/80 text-space-blue font-medium px-8 py-3 rounded-lg transition duration-300"
                onClick={() => setLocation('/booking')}
              >
                <span>Book Your Trip</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline"
                className="border border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple/10 font-medium px-8 py-3 rounded-lg transition duration-300"
                onClick={() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Destinations
              </Button>
            </div>
          </div>
          
          <motion.div 
            className="md:w-1/2 relative"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <img 
              src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Space station orbiting Earth" 
              className="rounded-2xl shadow-2xl w-full max-w-lg mx-auto"
            />
            <div className="absolute -bottom-5 -right-5 bg-space-blue-light glass-effect p-4 rounded-xl shadow-lg max-w-xs">
              <div className="flex items-start">
                <div className="bg-cosmic-purple/20 p-2 rounded-lg mr-3">
                  <span className="material-icons text-cosmic-purple">flight_takeoff</span>
                </div>
                <div>
                  <h4 className="font-orbitron text-sm text-aurora-teal">NEXT LAUNCH</h4>
                  <p className="font-space-mono text-xl">{useCountdown(10800)}</p>
                  <p className="text-xs text-lunar-white/70">Reserve your spot now</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-24 flex flex-col md:flex-row justify-center md:justify-between items-center bg-space-blue-light/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center mb-6 md:mb-0">
            <div className="text-sm text-lunar-white/70 mr-3">Trusted by:</div>
            <div className="flex space-x-8">
              <div className="text-lunar-white/90 font-orbitron">SPACETECH</div>
              <div className="text-lunar-white/90 font-orbitron">LUNARBASE</div>
              <div className="text-lunar-white/90 font-orbitron">ORBITALX</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-sm text-stellar-orange mr-3">4.9</div>
            <div className="flex text-stellar-orange">
              <span className="material-icons text-sm">star</span>
              <span className="material-icons text-sm">star</span>
              <span className="material-icons text-sm">star</span>
              <span className="material-icons text-sm">star</span>
              <span className="material-icons text-sm">star_half</span>
            </div>
            <div className="text-sm text-lunar-white/70 ml-2">from 2,500+ travelers</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
