import React, { useRef, useEffect, useState } from 'react';

interface ScratchCardProps {
  children: React.ReactNode;
  onScratch: () => void;
}

const ScratchCard: React.FC<ScratchCardProps> = ({ children, onScratch }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratched, setIsScratched] = useState(false);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }

    return (transparentPixels / (canvas.width * canvas.height)) * 100;
  };

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 2 * Math.PI);
    ctx.fill();

    if (getScratchPercentage() > 30) {
      if (!isScratched) {
        onScratch();
        setIsScratched(true);
      }
      // Optional: Clear full card once threshold is met for cleaner look
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // --- MOUSE EVENTS (Desktop) ---
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    scratch(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    scratch(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  // --- TOUCH EVENTS (Mobile) ---
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    // Prevent default to stop scrolling or other gestures while starting
    // e.preventDefault(); // Note: React sometimes warns about this in passive events
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0]; // Get the first finger
    scratch(touch.clientX - rect.left, touch.clientY - rect.top);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    
    // CRITICAL: Prevent the page from scrolling while scratching
    // Note: If you get console warnings about "passive event listeners", 
    // you might need to add a CSS rule touch-action: none; (see below)
    // e.preventDefault(); 
    
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    scratch(touch.clientX - rect.left, touch.clientY - rect.top);
  };

  const handleTouchEnd = () => {
    isDrawing.current = false;
  };

  return (
    <div className="relative w-full h-32 rounded-lg">
      <div className="absolute inset-0 flex items-center justify-center text-center p-2">
        {children}
      </div>
      <canvas
        ref={canvasRef}
        width="300"
        height="128"
        // touch-action: none is important to prevent browser scrolling on mobile
        className="absolute inset-0 w-full h-full rounded-lg cursor-pointer touch-none"
        style={{ touchAction: 'none' }} 
        
        // Mouse Events
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        
        // Touch Events
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      ></canvas>
    </div>
  );
};

export default ScratchCard;