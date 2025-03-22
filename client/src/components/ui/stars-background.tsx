import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  animationDelay: number;
}

export const StarsBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Clear any existing stars
    container.innerHTML = "";
    
    // Generate stars
    const starCount = 100;
    const stars: Star[] = [];
    
    for (let i = 0; i < starCount; i++) {
      const star: Star = {
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5,
        opacity: 0.3 + Math.random() * 0.4,
        animationDelay: Math.random() * 4
      };
      stars.push(star);
      
      const starElement = document.createElement("div");
      starElement.className = "star";
      starElement.style.left = `${star.x}%`;
      starElement.style.top = `${star.y}%`;
      starElement.style.width = `${star.size}px`;
      starElement.style.height = `${star.size}px`;
      starElement.style.opacity = star.opacity.toString();
      starElement.style.animationDelay = `${star.animationDelay}s`;
      
      container.appendChild(starElement);
    }
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className="stars-container fixed inset-0 z-0 pointer-events-none"
    ></div>
  );
};
