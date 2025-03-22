
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LightbulbIcon } from "lucide-react";

export function TravelTips() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LightbulbIcon className="h-5 w-5" />
          Travel Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li>• Remember to check your passport expiration date</li>
          <li>• Pack essential medications in your carry-on</li>
          <li>• Make copies of important travel documents</li>
          <li>• Check weather forecasts for your destination</li>
        </ul>
      </CardContent>
    </Card>
  );
}
