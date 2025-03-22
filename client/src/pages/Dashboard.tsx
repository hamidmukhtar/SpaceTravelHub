import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookingCard } from '@/components/dashboard/BookingCard';
import { TravelTips } from '@/components/dashboard/TravelTips';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Calendar,
  MessageCircle,
  Rocket,
  BriefcaseMedical,
  Info,
  CheckCircle,
  LightbulbIcon,
  User,
  MapPin,
  Package,
  Building,
  CreditCard,
  Users
} from "lucide-react";
import type { Booking } from '@shared/schema';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("bookings");
  const user = { id: 1, name: "Alex Spacebound", email: "alex@example.com", avatar: "https://randomuser.me/api/portraits/men/32.jpg" }; // Replace with actual user context

  const { data: bookings, isLoading, error } = useQuery<Booking[]>({
    queryKey: [`/api/users/${user.id}/bookings`],
  });

  if (isLoading) return <div>Loading your space adventures...</div>;
  if (error) return <div>Failed to load bookings</div>;

  const sortedBookings = bookings?.sort((a, b) =>
    new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime()
  ) || [];

  const upcomingBookings = sortedBookings.filter(b =>
    new Date(b.departureDate) > new Date() && b.status !== 'cancelled'
  );

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar / User Profile */}
          <div className="md:w-1/4">
            <Card className="bg-space-blue-light border-cosmic-purple/20">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-cosmic-purple">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <h2 className="font-orbitron text-xl font-bold mb-1">{user.name}</h2>
                  <p className="text-lunar-white/70 text-sm mb-4">{user.email}</p>

                  <div className="w-full bg-space-blue/40 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs">Space Miles</span>
                      <span className="text-aurora-teal font-medium">Silver Status</span>
                    </div>
                    <div className="text-xl font-space-mono mb-2">24,500</div>
                    <div className="w-full bg-space-blue-light h-2 rounded-full overflow-hidden">
                      <div className="bg-aurora-teal h-full rounded-full" style={{ width: "65%" }}></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-lunar-white/50">
                      <span>0</span>
                      <span>Gold: 35,000</span>
                    </div>
                  </div>

                  <div className="w-full space-y-2">
                    <Button variant="outline" className="border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple/10 w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Profile Settings
                    </Button>
                    <Button variant="outline" className="border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple/10 w-full justify-start">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Support Tickets
                    </Button>
                    <Button variant="outline" className="border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple/10 w-full justify-start">
                      <BriefcaseMedical className="h-4 w-4 mr-2" />
                      Medical Clearance
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            <div className="mb-8">
              <h1 className="font-orbitron text-3xl mb-4">Mission Control</h1>
              <TravelTips />
            </div>
            <Tabs defaultValue="bookings" className="space-y-4">
              <TabsList>
                <TabsTrigger value="bookings">
                  Upcoming Launches ({upcomingBookings.length})
                </TabsTrigger>
                <TabsTrigger value="history">
                  Launch History ({sortedBookings.length - upcomingBookings.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bookings" className="space-y-4">
                {upcomingBookings.length === 0 ? (
                  <Card className="bg-space-blue-light border-cosmic-purple/20 p-8 text-center">
                    <div className="flex flex-col items-center">
                      <Rocket className="h-12 w-12 text-cosmic-purple/50 mb-4" />
                      <h3 className="font-orbitron text-xl mb-2">No Upcoming Bookings</h3>
                      <p className="text-lunar-white/70 mb-6 max-w-md mx-auto">
                        You haven't booked any upcoming space journeys yet. Start your cosmic adventure by booking your first trip!
                      </p>
                      <Button className="bg-cosmic-purple hover:bg-cosmic-purple/80">
                        Explore Destinations
                      </Button>
                    </div>
                  </Card>
                ) : (
                  upcomingBookings.map(booking => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                {sortedBookings
                  .filter(b => new Date(b.departureDate) <= new Date() || b.status === 'cancelled')
                  .map(booking => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;