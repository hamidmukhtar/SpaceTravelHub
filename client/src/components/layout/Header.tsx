import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Rocket } from "lucide-react";
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="relative z-10 bg-space-blue-light/40 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-aurora-teal">
              <Rocket className="h-6 w-6" />
            </div>
            <h1 className="font-orbitron text-2xl font-bold tracking-wider">
              Dubai<span className="text-aurora-teal">2Stars</span>
            </h1>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link href="/#destinations" className="hover:text-aurora-teal transition duration-300">
              Destinations
            </Link>
            <Link href="/#packages" className="hover:text-aurora-teal transition duration-300">
              Packages
            </Link>
            <Link href="/#accommodations" className="hover:text-aurora-teal transition duration-300">
              Accommodations
            </Link>
            <Link href="/dashboard" className="hover:text-aurora-teal transition duration-300">
              Dashboard
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="default" 
              className="hidden md:block bg-cosmic-purple hover:bg-cosmic-purple/80 px-5 py-2 rounded-full font-medium transition duration-300"
              onClick={() => setLocation('/dashboard')}
            >
              Sign In
            </Button>
            
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <span className="material-icons">menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-space-blue-light border-cosmic-purple/20">
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link href="/#destinations" className="text-lg hover:text-aurora-teal transition duration-300" onClick={closeMenu}>
                    Destinations
                  </Link>
                  <Link href="/#packages" className="text-lg hover:text-aurora-teal transition duration-300" onClick={closeMenu}>
                    Packages
                  </Link>
                  <Link href="/#accommodations" className="text-lg hover:text-aurora-teal transition duration-300" onClick={closeMenu}>
                    Accommodations
                  </Link>
                  <Link href="/dashboard" className="text-lg hover:text-aurora-teal transition duration-300" onClick={closeMenu}>
                    Dashboard
                  </Link>
                  <Button 
                    variant="default" 
                    className="bg-cosmic-purple hover:bg-cosmic-purple/80 mt-4 w-full"
                    onClick={() => {
                      setLocation('/dashboard');
                      closeMenu();
                    }}
                  >
                    Sign In
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
