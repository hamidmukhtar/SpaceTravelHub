import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import type { Booking } from "@shared/schema";

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
              <div className="font-space-mono text-lg font-bold text-aurora-teal">${booking.totalPrice.toLocaleString()}</div>
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
  <Card className="bg-space-blue-light border-cosmic-purple/20 mb-4">
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <Skeleton className="h-6 w-48 bg-space-blue-light/50 mb-2" />
          <Skeleton className="h-4 w-32 bg-space-blue-light/50" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full bg-space-blue-light/50" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Skeleton className="h-24 w-full bg-space-blue-light/50 rounded-lg" />
        
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full bg-space-blue-light/50" />
          ))}
        </div>
        
        <Separator className="bg-cosmic-purple/20" />
        
        <div className="flex justify-between items-center">
          <Skeleton className="h-14 w-32 bg-space-blue-light/50" />
          <div className="space-x-2">
            <Skeleton className="h-10 w-28 inline-block bg-space-blue-light/50" />
            <Skeleton className="h-10 w-28 inline-block bg-space-blue-light/50" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("bookings");
  
  const { data: bookings, isLoading, error } = useQuery<Booking[]>({ 
    queryKey: [`/api/users/${user.id}/bookings`],
  });

  if (error) {
    console.error("Failed to load bookings:", error);
  }

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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-space-blue-light border border-cosmic-purple/20 mb-6">
                <TabsTrigger value="bookings" className="data-[state=active]:bg-cosmic-purple data-[state=active]:text-white">
                  My Bookings
                </TabsTrigger>
                <TabsTrigger value="travel-tips" className="data-[state=active]:bg-cosmic-purple data-[state=active]:text-white">
                  Space Travel Tips
                </TabsTrigger>
                <TabsTrigger value="training" className="data-[state=active]:bg-cosmic-purple data-[state=active]:text-white">
                  Pre-Flight Training
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
                <Card className="bg-space-blue-light border-cosmic-purple/20">
                  <CardHeader>
                    <CardTitle className="font-orbitron text-2xl">Space Travel Tips</CardTitle>
                    <CardDescription>Expert advice for your cosmic journey</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TravelTip 
                        icon={<LightbulbIcon className="h-5 w-5" />}
                        title="Prepare for Zero Gravity"
                        content="Practice slow, deliberate movements. In zero-G, small pushes can send you floating across the cabin. Use handrails and secure yourself when resting."
                      />
                      <TravelTip 
                        icon={<Info className="h-5 w-5" />}
                        title="Manage Space Sickness"
                        content="About 60% of travelers experience space sickness. Anti-nausea medication is provided, but fixing your gaze on a stationary point can help."
                      />
                      <TravelTip 
                        icon={<CheckCircle className="h-5 w-5" />}
                        title="Pack Light and Practical"
                        content="Every gram counts in space. Pack essentials only. Special space-approved toiletries will be provided in your cabin."
                      />
                      <TravelTip 
                        icon={<BriefcaseMedical className="h-5 w-5" />}
                        title="Stay Hydrated"
                        content="Dehydration occurs faster in space. Drink the recommended water rations even if you don't feel thirsty."
                      />
                      <TravelTip 
                        icon={<Calendar className="h-5 w-5" />}
                        title="Adjust Your Sleep Cycle"
                        content="Start adjusting your sleep schedule 3 days before launch to match space station time. Use the provided sleep mask for better rest."
                      />
                      <TravelTip 
                        icon={<Rocket className="h-5 w-5" />}
                        title="Launch Day Preparation"
                        content="Arrive at the spaceport 6 hours before scheduled departure. The pre-launch briefing is mandatory for all passengers."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="training">
                <Card className="bg-space-blue-light border-cosmic-purple/20">
                  <CardHeader>
                    <CardTitle className="font-orbitron text-2xl">Pre-Flight Training</CardTitle>
                    <CardDescription>Required training modules before your journey</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-space-blue/40 rounded-lg p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-cosmic-purple/20 flex items-center justify-center mr-4">
                            <span className="text-cosmic-purple">1</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Safety Procedures</h4>
                            <p className="text-xs text-lunar-white/70">Emergency protocols and equipment usage</p>
                          </div>
                        </div>
                        <Badge className="bg-green-600/20 text-green-400">Completed</Badge>
                      </div>
                      
                      <div className="bg-space-blue/40 rounded-lg p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-cosmic-purple/20 flex items-center justify-center mr-4">
                            <span className="text-cosmic-purple">2</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Zero Gravity Adaptation</h4>
                            <p className="text-xs text-lunar-white/70">Movement techniques and spatial orientation</p>
                          </div>
                        </div>
                        <Badge className="bg-green-600/20 text-green-400">Completed</Badge>
                      </div>
                      
                      <div className="bg-space-blue/40 rounded-lg p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-cosmic-purple/20 flex items-center justify-center mr-4">
                            <span className="text-cosmic-purple">3</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Space Habitat Orientation</h4>
                            <p className="text-xs text-lunar-white/70">Navigation and systems familiarization</p>
                          </div>
                        </div>
                        <Badge className="bg-yellow-600/20 text-yellow-400">In Progress</Badge>
                      </div>
                      
                      <div className="bg-space-blue/40 rounded-lg p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-cosmic-purple/20 flex items-center justify-center mr-4">
                            <span className="text-cosmic-purple">4</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Health Monitoring</h4>
                            <p className="text-xs text-lunar-white/70">Vital signs tracking and medical assistance</p>
                          </div>
                        </div>
                        <Badge className="bg-gray-600/20 text-gray-400">Not Started</Badge>
                      </div>
                      
                      <div className="bg-space-blue/40 rounded-lg p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-cosmic-purple/20 flex items-center justify-center mr-4">
                            <span className="text-cosmic-purple">5</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Launch and Re-entry Preparation</h4>
                            <p className="text-xs text-lunar-white/70">G-force management and physical conditioning</p>
                          </div>
                        </div>
                        <Badge className="bg-gray-600/20 text-gray-400">Not Started</Badge>
                      </div>
                      
                      <div className="mt-6 text-center">
                        <Button className="bg-cosmic-purple hover:bg-cosmic-purple/80">
                          Continue Training
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
