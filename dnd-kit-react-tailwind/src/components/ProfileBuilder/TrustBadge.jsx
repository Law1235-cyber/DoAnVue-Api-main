import React from 'react';
import { ShieldCheck, Star, Truck } from 'lucide-react';

export default function TrustBadge() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">

        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="p-3 bg-white rounded-full text-blue-600 shadow-sm ring-1 ring-blue-100">
                <ShieldCheck size={24} />
            </div>
            <div>
                <h3 className="font-bold text-gray-900 text-base md:text-lg">Verified Seller</h3>
                <p className="text-sm text-gray-600">Identity confirmed</p>
            </div>
        </div>

        <div className="w-full h-px bg-blue-200 md:w-px md:h-12 hidden md:block opacity-50"></div>

        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="p-3 bg-white rounded-full text-amber-500 shadow-sm ring-1 ring-amber-100">
                <Star size={24} fill="currentColor" />
            </div>
            <div>
                <h3 className="font-bold text-gray-900 text-base md:text-lg">99% Positive</h3>
                <p className="text-sm text-gray-600">Based on 1.2k reviews</p>
            </div>
        </div>

        <div className="w-full h-px bg-blue-200 md:w-px md:h-12 hidden md:block opacity-50"></div>

        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="p-3 bg-white rounded-full text-emerald-600 shadow-sm ring-1 ring-emerald-100">
                <Truck size={24} />
            </div>
            <div>
                <h3 className="font-bold text-gray-900 text-base md:text-lg">Fast Shipper</h3>
                <p className="text-sm text-gray-600">Ships within 24h</p>
            </div>
        </div>

      </div>
    </div>
  );
}
