
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCountdown } from "@/hooks/useCountdown";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import type { Booking } from "@shared/schema";

interface BookingCardProps {
  booking: Booking;
}

export const BookingCard = ({ booking }: BookingCardProps) => {
  const timeLeft = useCountdown(new Date(booking.departureDate));

  return (
    <Card className="bg-space-blue-light border-cosmic-purple/20">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-orbitron text-xl mb-2">{booking.destination}</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-cosmic-purple" />
                <span>{new Date(booking.departureDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-cosmic-purple" />
                <span>{booking.destination}</span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-cosmic-purple" />
                <span>{booking.travelers} travelers</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-cosmic-purple" />
                <span>Time until launch: {timeLeft}</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="text-aurora-teal border-aurora-teal">
            {booking.status}
          </Badge>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline">View Details</Button>
          <Button className="bg-cosmic-purple hover:bg-cosmic-purple/80">
            Manage Booking
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
