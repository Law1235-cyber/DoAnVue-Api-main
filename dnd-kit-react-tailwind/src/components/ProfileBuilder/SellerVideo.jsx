import React from 'react';
import { Play } from 'lucide-react';

export default function SellerVideo() {
  return (
    <div className="bg-black rounded-xl overflow-hidden shadow-md relative aspect-video group cursor-pointer">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center pl-1">
                <Play size={24} className="text-black" fill="currentColor" />
            </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 p-6 text-white">
        <h3 className="text-xl font-bold mb-2">Meet the Maker: Studio Tour</h3>
        <p className="text-white/80 line-clamp-2">
            Join us behind the scenes to see how we craft our products with care and attention to detail.
        </p>
      </div>
    </div>
  );
}
