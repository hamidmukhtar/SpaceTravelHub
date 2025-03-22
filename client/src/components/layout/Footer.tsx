import { Link } from "wouter";
import { Rocket, Facebook, Globe, Camera, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative z-10 bg-space-blue-light/80 backdrop-blur-md pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="text-aurora-teal">
                <Rocket className="h-5 w-5" />
              </div>
              <h3 className="font-orbitron text-xl font-bold tracking-wider">
                Dubai<span className="text-aurora-teal">2Stars</span>
              </h3>
            </div>
            <p className="text-lunar-white/70 text-sm mb-6">
              Pioneering space tourism for the adventurous traveler. Making the cosmos accessible, one journey at a time.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-lunar-white/70 hover:text-aurora-teal transition duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-lunar-white/70 hover:text-aurora-teal transition duration-300">
                <Globe size={20} />
              </a>
              <a href="#" className="text-lunar-white/70 hover:text-aurora-teal transition duration-300">
                <Camera size={20} />
              </a>
              <a href="#" className="text-lunar-white/70 hover:text-aurora-teal transition duration-300">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-orbitron font-bold mb-6">Destinations</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-lunar-white/70 hover:text-aurora-teal transition duration-300">Orbital Space Station</a></li>
              <li><a href="#" className="text-lunar-white/70 hover:text-aurora-teal transition duration-300">Lunar Colony Alpha</a></li>
              <li><a href="#" className="text-lunar-white/70 hover:text-aurora-teal transition duration-300">Mars Transit Hotel</a></li>
              <li><a href="#" className="text-lunar-white/70 hover:text-aurora-teal transition duration-300">Venus Observatory</a></li>
              <li><a href="#" className="text-lunar-white/70 hover:text-aurora-teal transition duration-300">Asteroid Mining Outpost</a></li>
              <li><a href="#" className="text-lunar-white/70 hover:text-aurora-teal transition duration-300">View All Destinations</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-orbitron font-bold mb-6">Packages</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-lunar-white/70 hover:text-aurora-teal transition duration-300">Economy Shuttle</a></li>
              <li><a href="#" className="text-lunar-white/70 hover:text-aurora-teal transition duration-300">Luxury Cabin</a></li>
              <li><a href="#" className="text-lunar-white/70 hover:text-aurora-teal transition duration-300">VIP Experience</a></li>
              <li><a href="#" className="text-lunar-white/70 hover:text-aurora-teal transition duration-300">Group Expeditions</a></li>
              <li><a href="#" className="text-lunar-white/70 hover:text-aurora-teal transition duration-300">Research Missions</a></li>
              <li><a href="#" className="text-lunar-white/70 hover:text-aurora-teal transition duration-300">Compare Packages</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-orbitron font-bold mb-6">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-lunar-white/70 hover:text-aurora-teal transition duration-300">Space Travel FAQ</a></li>
              <li><a href="#" className="text-lunar-white/70 hover:text-aurora-teal transition duration-300">Training Requirements</a></li>
              <li><a href="#" className="text-lunar-white/70 hover:text-aurora-teal transition duration-300">Medical Clearance</a></li>
              <li><a href="#" className="text-lunar-white/70 hover:text-aurora-teal transition duration-300">Cancellation Policy</a></li>
              <li><a href="#" className="text-lunar-white/70 hover:text-aurora-teal transition duration-300">Contact Us</a></li>
              <li><a href="#" className="text-lunar-white/70 hover:text-aurora-teal transition duration-300">Privacy & Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-cosmic-purple/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-lunar-white/50 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Dubai2Stars. All rights reserved. Earth and Beyond.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-lunar-white/50 hover:text-aurora-teal transition duration-300">Privacy Policy</a>
            <a href="#" className="text-lunar-white/50 hover:text-aurora-teal transition duration-300">Terms of Service</a>
            <a href="#" className="text-lunar-white/50 hover:text-aurora-teal transition duration-300">Safety Protocols</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
