import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Rocket, PhoneCall } from "lucide-react";

const CallToAction = () => {
  const [, setLocation] = useLocation();

  return (
    <section className="relative z-10 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-cosmic-purple/20 to-aurora-teal/20 rounded-2xl p-10 text-center glass-effect">
          <h2 className="font-orbitron text-3xl font-bold mb-4">Ready for Your Cosmic Adventure?</h2>
          <p className="text-lunar-white/80 mb-8 max-w-2xl mx-auto">
            Take one small step for yourself, and experience a giant leap for your perspective on life. Book your space journey today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              className="bg-aurora-teal hover:bg-aurora-teal/80 text-space-blue font-medium px-8 py-3 rounded-lg transition duration-300 flex items-center justify-center"
              onClick={() => setLocation('/booking')}
            >
              <span>Book Your Trip</span>
              <Rocket className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline"
              className="border border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple/10 font-medium px-8 py-3 rounded-lg transition duration-300 flex items-center justify-center"
            >
              <span>Contact Our Space Agents</span>
              <PhoneCall className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
