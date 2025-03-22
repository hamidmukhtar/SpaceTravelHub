import { useState } from "react";
import { Building, MapPin, Package, Rocket, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookings } from "@/hooks/useBookings";
import { TravelTips } from "@/components/dashboard/TravelTips";
import { BookingCard } from "@/components/dashboard/BookingCard";

const BookingCardSkeleton = () => (
  <Card className="bg-space-blue-light border-cosmic-purple/20">
    <CardContent className="p-6">
      <Skeleton className="h-6 w-48 mb-4" />
      <Skeleton className="h-4 w-64 mb-2" />
      <Skeleton className="h-4 w-32 mb-2" />
      <Skeleton className="h-4 w-40" />
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { data: bookings, isLoading } = useBookings();

  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-orbitron mb-8">Dashboard</h2>

        <Tabs defaultValue="bookings">
          <TabsList className="mb-8">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="travel-tips">Travel Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            {isLoading ? (
              <>
                <BookingCardSkeleton />
                <BookingCardSkeleton />
              </>
            ) : bookings?.length ? (
              bookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <Card className="bg-space-blue-light border-cosmic-purple/20 p-8 text-center">
                <div className="flex flex-col items-center">
                  <Rocket className="h-12 w-12 text-cosmic-purple/50 mb-4" />
                  <h3 className="font-orbitron text-xl mb-2">No Bookings Yet</h3>
                  <p className="text-lunar-white/70 mb-6 max-w-md mx-auto">
                    You haven't booked any space journeys yet. Start your cosmic adventure by booking your first trip!
                  </p>
                  <Button className="bg-cosmic-purple hover:bg-cosmic-purple/80">
                    Explore Destinations
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="travel-tips">
            <TravelTips />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;