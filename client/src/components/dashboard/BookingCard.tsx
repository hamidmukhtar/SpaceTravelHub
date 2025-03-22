
import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { MapPin, Package, Building, Calendar, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCountdown } from '@/hooks/useCountdown';
import { formatDistanceToNow } from 'date-fns';

export const BookingCard = ({ booking }) => {
  const queryClient = useQueryClient();
  const [isModifying, setIsModifying] = useState(false);
  const departureDate = new Date(booking.departureDate);
  const { days, hours } = useCountdown(departureDate);

  const cancelBooking = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/bookings/${booking.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });
      if (!response.ok) throw new Error('Failed to cancel booking');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries([`/api/users/${booking.userId}/bookings`]);
    }
  });

  const daysUntilLaunch = Math.max(0, days);
  const hoursUntilLaunch = Math.max(0, hours);

  return (
    <div className="glass-effect p-6 rounded-xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-orbitron text-xl mb-2">Launch in {daysUntilLaunch}d {hoursUntilLaunch}h</h3>
          <p className="text-sm text-lunar-white/70">Booked {formatDistanceToNow(new Date(booking.createdAt))} ago</p>
        </div>
        <div className="space-x-2">
          {booking.status === 'pending' && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => cancelBooking.mutate()}
              disabled={cancelBooking.isLoading}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="w-full bg-space-blue-light h-2 rounded-full overflow-hidden mb-6">
        <div 
          className="bg-aurora-teal h-full rounded-full transition-all" 
          style={{ width: `${Math.min(100, 100 - (daysUntilLaunch / 30) * 100)}%` }}
        />
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
          <span className="text-xs text-lunar-white/50">Launch Date</span>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-cosmic-purple mr-1" />
            <span>{new Date(booking.departureDate).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-xs text-lunar-white/50">Travelers</span>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-cosmic-purple mr-1" />
            <span>{booking.travelers} travelers</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-space-blue-light">
        <div className="flex items-center">
          <Clock className="h-4 w-4 text-cosmic-purple mr-1" />
          <span className="text-sm">Status: </span>
          <span className={`ml-2 text-sm ${
            booking.status === 'confirmed' ? 'text-aurora-teal' :
            booking.status === 'cancelled' ? 'text-red-500' :
            'text-yellow-500'
          }`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
};
