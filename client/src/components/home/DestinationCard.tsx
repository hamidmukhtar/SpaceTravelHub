import React, { useState, useEffect } from 'react';

function useCountdown(seconds) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(0, prevTime - 1));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formattedTime = formatTime(timeLeft);
  return formattedTime;
}


function formatTime(seconds) {
  const days = Math.floor(seconds / (60 * 60 * 24));
  const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const secs = seconds % 60;

  return `${days}d ${hours}h ${minutes}m ${secs}s`;
}


function HeroSection() {
  return (
    <section className="bg-space-blue-dark py-16">
      <div className="container mx-auto text-center">
        <h1 className="text-6xl font-bold text-lunar-white mb-4">SpaceX Launches</h1>
        <p className="text-2xl text-lunar-white/70 mb-8">Your journey to the stars starts here.</p>
        <div className="bg-space-blue-light/30 p-4 rounded-lg">
          <p className="text-xl text-aurora-teal">Next Launch in:</p>
          <p className="text-4xl font-bold text-lunar-white">{useCountdown(Math.floor(Math.random() * 86400) + 86400)}</p>
        </div>
      </div>
    </section>
  );
}


function DestinationCard({ destination }) {
  return (
    <div className="bg-space-blue-dark rounded-lg shadow-lg overflow-hidden">
      <img
        src={destination.imageUrl}
        alt={destination.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold text-lunar-white">{destination.name}</h2>
        <p className="text-sm text-lunar-white/70">{destination.description}</p>
        <div className="mt-2 bg-space-blue-light/30 p-2 rounded-lg">
          <div className="flex items-center">
            <span className="material-icons text-cosmic-purple mr-2">timer</span>
            <div>
              <p className="text-xs text-aurora-teal">NEXT LAUNCH IN</p>
              <p className="font-space-mono">{useCountdown(Math.floor(Math.random() * 20000) + 3600)}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button className="bg-cosmic-purple hover:bg-cosmic-purple-dark text-lunar-white font-bold py-2 px-4 rounded">
            Learn More
          </button>
          <button className="bg-aurora-teal hover:bg-aurora-teal-dark text-lunar-white font-bold py-2 px-4 rounded">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

export { HeroSection, DestinationCard };