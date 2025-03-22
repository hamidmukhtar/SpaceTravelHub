import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TravelTips } from "@/components/dashboard/TravelTips";
import { BookingCard } from "@/components/dashboard/BookingCard";
import { Rocket } from "lucide-react";
import type { Booking } from "@shared/schema";
import {
  Clock,
  Calendar,
  MessageCircle,
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

// Mock user data
const user = {
  id: 1,
  name: "Alex Spacebound",
  email: "alex@example.com",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg"
};

const TravelTip = ({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) => (
  <div className="bg-space-blue-light rounded-lg p-4 flex space-x-3">
    <div className="flex-shrink-0 text-cosmic-purple mt-1">
      {icon}
    </div>
    <div>
      <h4 className="font-medium text-sm mb-1">{title}</h4>
      <p className="text-xs text-lunar-white/70">{content}</p>
    </div>
  </div>
);

const BookingCard = ({ booking }: { booking: Booking }) => {
  const launchDate = new Date(booking.departureDate);
  const today = new Date();
  const daysUntilLaunch = Math.max(0, Math.floor((launchDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  const statusColors = {
    pending: "bg-yellow-600/20 text-yellow-400",
    confirmed: "bg-green-600/20 text-green-400",
    cancelled: "bg-red-600/20 text-red-400",
  };

  return (
    <Card className="bg-space-blue-light border-cosmic-purple/20 mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-orbitron">Mission #BK-{booking.id}</CardTitle>
            <CardDescription>Booked on {new Date(booking.createdAt).toLocaleDateString()}</CardDescription>
          </div>
          <Badge className={statusColors[booking.status as keyof typeof statusColors]}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-space-blue/40 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-aurora-teal mr-2" />
                <span className="font-orbitron">LAUNCH COUNTDOWN</span>
              </div>
              <div className="font-space-mono text-xl">{daysUntilLaunch} days</div>
            </div>
            <div className="w-full bg-space-blue-light h-2 rounded-full overflow-hidden">
              <div className="bg-aurora-teal h-full rounded-full" style={{ width: `${Math.min(100, 100 - (daysUntilLaunch / 30) * 100)}%` }}></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-lunar-white/50">Destination</span>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-cosmic-purple mr-1" />
                <span>Destination #{booking.destinationId}</span>
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-lunar-white/50">Package</span>
              <div className="flex items-center">
                <Package className="h-4 w-4 text-cosmic-purple mr-1" />
                <span>Package #{booking.packageId}</span>
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-lunar-white/50">Accommodation</span>
              <div className="flex items-center">
                <Building className="h-4 w-4 text-cosmic-purple mr-1" />
                <span>{booking.accommodationId ? `Accommodation #${booking.accommodationId}` : "None"}</span>
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-lunar-white/50">Travelers</span>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-cosmic-purple mr-1" />
                <span>{booking.travelers} {booking.travelers === 1 ? "Person" : "People"}</span>
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-lunar-white/50">Departure</span>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-cosmic-purple mr-1" />
                <span>{new Date(booking.departureDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-lunar-white/50">Return</span>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-cosmic-purple mr-1" />
                <span>{new Date(booking.returnDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <Separator className="bg-cosmic-purple/20" />

          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs text-lunar-white/50">Total Price</span>
              <div className="font-space-mono text-lg font-bold text-aurora-teal">AED {booking.totalPrice.toLocaleString()}</div>
            </div>
            <div className="space-x-2">
              <Button variant="outline" className="border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple/10">
                <MessageCircle className="h-4 w-4 mr-1" />
                Support
              </Button>
              <Button
                className="bg-cosmic-purple hover:bg-cosmic-purple/80"
                disabled={booking.status !== "pending"}
              >
                <CreditCard className="h-4 w-4 mr-1" />
                Pay Now
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

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
  const [activeTab, setActiveTab] = useState("bookings");

  const { data: bookings, isLoading, error } = useQuery<Booking[]>({
    queryKey: [`/api/users/${user.id}/bookings`],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-orbitron text-3xl font-bold">Dashboard</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-space-blue-light mb-6">
            <TabsTrigger value="bookings" className="data-[state=active]:bg-cosmic-purple data-[state=active]:text-white">
              My Bookings
            </TabsTrigger>
            <TabsTrigger value="travel-tips" className="data-[state=active]:bg-cosmic-purple data-[state=active]:text-white">
              Space Travel Tips
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-orbitron text-2xl font-bold">My Space Journeys</h2>
              <Button className="bg-aurora-teal hover:bg-aurora-teal/80 text-space-blue">
                <Rocket className="h-4 w-4 mr-2" />
                Book New Trip
              </Button>
            </div>

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