import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import DestinationDetails from "@/pages/DestinationDetails";
import BookingProcess from "@/pages/BookingProcess";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { StarsBackground } from "@/components/ui/stars-background";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/dashboard" component={Dashboard}/>
      <Route path="/destinations/:id" component={DestinationDetails}/>
      <Route path="/booking" component={BookingProcess}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-space-blue">
        <StarsBackground />
        <Header />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
