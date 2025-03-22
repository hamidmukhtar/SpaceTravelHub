import HeroSection from "@/components/home/HeroSection";
import BookingSection from "@/components/home/BookingSection";
import DestinationsSection from "@/components/home/DestinationsSection";
import PackagesSection from "@/components/home/PackagesSection";
import AccommodationsSection from "@/components/home/AccommodationsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CallToAction from "@/components/home/CallToAction";

const Home = () => {
  return (
    <>
      <HeroSection />
      <BookingSection />
      <DestinationsSection />
      <PackagesSection />
      <AccommodationsSection />
      <TestimonialsSection />
      <CallToAction />
    </>
  );
};

export default Home;
