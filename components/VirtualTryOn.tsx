import React, { useEffect, useRef, useState } from 'react';
import { Product } from '../types';

interface VirtualTryOnProps {
  product: Product;
  onClose: () => void;
}

export const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ product, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user" } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setLoading(false);
          };
        }
      } catch (err) {
        setError("Camera access denied or not available.");
        setLoading(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[70] bg-black flex flex-col">
      <div className="absolute top-4 right-4 z-50">
        <button onClick={onClose} className="text-white bg-black/50 rounded-full p-2 hover:bg-black/80">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="relative flex-1 bg-gray-900 flex items-center justify-center overflow-hidden">
        {loading && <div className="text-white animate-pulse">Accessing camera...</div>}
        {error && <div className="text-red-400 px-4 text-center">{error}</div>}
        
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />

        {/* Overlay Product */}
        {!loading && !error && (
          <div className="relative z-10 pointer-events-none animate-pulse">
             <div className="border-2 border-dashed border-white/50 rounded-full w-64 h-64 flex items-center justify-center">
                <p className="text-white/80 text-xs absolute -top-8 bg-black/50 px-2 py-1 rounded">Align your wrist here</p>
                <img 
                  src={product.image} 
                  alt="Overlay" 
                  className="w-64 h-64 object-contain drop-shadow-2xl mix-blend-screen opacity-90"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.5))' }}
                />
             </div>
          </div>
        )}
        
        <div className="absolute bottom-10 left-0 right-0 text-center z-20">
           <p className="text-white text-shadow bg-black/30 inline-block px-4 py-2 rounded-lg backdrop-blur">
             Virtual Try-On: {product.name}
           </p>
        </div>
      </div>
    </div>
  );
};
