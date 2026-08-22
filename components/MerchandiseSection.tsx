"use client";

import React, { useState } from 'react';
import Order from './Order';
import ChatAdmin from './ChatAdmin';
import MerchandiseCard, { PixelBorder } from './MerchandiseCard';

export default function MerchandiseSection() {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <section id="merchandise" className="relative w-full bg-arcade-violet font-body text-white min-h-screen pb-24">
      <PixelBorder/>
      <div 
        className="w-full h-10 bg-repeat-x bg-auto"
        style={{ 
          backgroundImage: "url('/image_775622.png')", 
          imageRendering: "pixelated" 
        }}
      />

      <div className="max-w-6xl mx-auto px-6 pt-12 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        
        {/* KIRI: Grid Produk */}
        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-8">
          
          <MerchandiseCard 
            onClick={() => setIsOrderOpen(true)}
            containerClassName="md:col-span-2"
            imageBoxClassName="aspect-[16/10]"
          />

          <MerchandiseCard 
            onClick={() => setIsOrderOpen(true)}
            containerClassName="md:col-span-1"
            imageBoxClassName="aspect-square"
          />

          {[3, 4, 5].map((item) => (
            <MerchandiseCard 
              key={item}
              onClick={() => setIsOrderOpen(true)}
              containerClassName="col-span-1"
              imageBoxClassName="aspect-square"
            />
          ))}
        </div>

        <div className="w-full lg:w-80 pt-2 lg:pt-0">
          <h2 className="text-arcade-yellow text-4xl font-display font-bold mb-5 drop-shadow-[2px_3px_0_var(--arcade-ink)] leading-tight">
            Detail<br />Merchandise
          </h2>
          <p className="text-white font-semibold text-lg leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>

      <button 
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-white rounded-full flex items-center justify-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all z-40 outline-none"
      >
        <svg className="w-8 h-8 text-arcade-ink" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3c-4.97 0-9 3.358-9 7.5 0 2.38 1.34 4.5 3.38 5.82-.18 1.76-1.19 3.51-1.28 3.66a.75.75 0 00.98 1.05c2.31-1.33 4.14-2.58 5.09-3.23.6.07 1.21.1 1.83.1 4.97 0 9-3.358 9-7.5S16.97 3 12 3z" />
        </svg>
      </button>

      {isOrderOpen && <Order onClose={() => setIsOrderOpen(false)} />}
      {isChatOpen && <ChatAdmin onClose={() => setIsChatOpen(false)} />}
      
    </section>
  );
}