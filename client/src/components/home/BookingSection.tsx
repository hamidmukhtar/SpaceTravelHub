import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const steps = ["Destination", "Date", "Package", "Accommodations", "Review"];

const BookingSection = () => {
  const [, setLocation] = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [destination, setDestination] = useState("");
  const [travelerCount, setTravelerCount] = useState("1");
  const [departureDate, setDepartureDate] = useState("");

  const handleNext = () => {
    if (destination) {
      // In a real app, we'd save the selection to state or context
      // For demo, we'll just navigate to the full booking process
      setLocation('/booking');
    }
  };

  return (
    <section id="booking" className="relative z-10 py-16 bg-space-blue-light/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto glass-effect rounded-2xl p-6 md:p-10">
          <div className="flex flex-col items-center mb-10">
            <h2 className="font-orbitron text-3xl font-bold mb-4 text-center">Plan Your Space Journey</h2>
            <p className="text-lunar-white/70 text-center max-w-2xl">Choose your destination, select travel dates, and explore our range of space travel packages tailored to your preferences.</p>
          </div>
          
          <div className="booking-progress-bar flex justify-between mb-10 relative">
            <div className="absolute top-3 left-0 h-0.5 bg-space-blue-light w-full"></div>
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`step relative z-10 text-center flex flex-col items-center ${index <= activeStep ? 'active' : ''}`}
              >
                <div className={`w-6 h-6 rounded-full ${index <= activeStep ? 'bg-aurora-teal text-space-blue' : 'bg-space-blue-light text-lunar-white'} flex items-center justify-center mb-2`}>
                  {index + 1}
                </div>
                <span className="text-xs md:text-sm">{step}</span>
              </div>
            ))}
          </div>
          
          <div className="booking-form space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="form-group">
                <Label className="text-sm font-medium mb-2">Destination</Label>
                <div className="relative">
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger className="w-full bg-space-blue border border-cosmic-purple/30 text-lunar-white rounded-lg px-4 py-6 focus:outline-none focus:ring-2 focus:ring-cosmic-purple">
                      <SelectValue placeholder="Select Destination" />
                    </SelectTrigger>
                    <SelectContent className="bg-space-blue border border-cosmic-purple/30 text-lunar-white">
                      <SelectItem value="orbital">Orbital Space Station</SelectItem>
                      <SelectItem value="lunar">Lunar Colony Alpha</SelectItem>
                      <SelectItem value="mars">Mars Transit Hotel</SelectItem>
                      <SelectItem value="venus">Venus Observatory</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="material-icons absolute right-3 top-3 text-cosmic-purple pointer-events-none">expand_more</span>
                </div>
              </div>
              
              <div className="form-group">
                <Label className="text-sm font-medium mb-2">Departure</Label>
                <div className="relative">
                  <input 
                    type="date" 
                    className="w-full bg-space-blue border border-cosmic-purple/30 text-lunar-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cosmic-purple"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <span className="material-icons absolute right-3 top-3 text-cosmic-purple pointer-events-none">calendar_today</span>
                </div>
              </div>
              
              <div className="form-group">
                <Label className="text-sm font-medium mb-2">Travelers</Label>
                <div className="relative">
                  <Select value={travelerCount} onValueChange={setTravelerCount}>
                    <SelectTrigger className="w-full bg-space-blue border border-cosmic-purple/30 text-lunar-white rounded-lg px-4 py-6 focus:outline-none focus:ring-2 focus:ring-cosmic-purple">
                      <SelectValue placeholder="Select Travelers" />
                    </SelectTrigger>
                    <SelectContent className="bg-space-blue border border-cosmic-purple/30 text-lunar-white">
                      <SelectItem value="1">1 Traveler</SelectItem>
                      <SelectItem value="2">2 Travelers</SelectItem>
                      <SelectItem value="3">3 Travelers</SelectItem>
                      <SelectItem value="4">4 Travelers</SelectItem>
                      <SelectItem value="group">Group (5+)</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="material-icons absolute right-3 top-3 text-cosmic-purple pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                className="bg-cosmic-purple hover:bg-cosmic-purple/80 text-lunar-white font-medium px-8 py-3 rounded-lg transition duration-300"
                onClick={handleNext}
                disabled={!destination}
              >
                <span>Next: Select Date</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
