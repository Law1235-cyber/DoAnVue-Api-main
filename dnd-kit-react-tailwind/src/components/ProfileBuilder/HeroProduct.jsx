import React from 'react';
import { ShoppingBag } from 'lucide-react';

import { COMPONENT_SCHEMAS } from './schemas';

export default function HeroProduct({ content }) {
  const defaults = COMPONENT_SCHEMAS.heroProduct.fields.reduce((acc, f) => ({...acc, [f.name]: f.default}), {});
  const data = { ...defaults, ...content };

  return (
    // Removed fixed background/shadow so wrapper controls it.
    // Added text-inherit to allow wrapper color to cascade where appropriate
    <div className="overflow-hidden group">
      <div className="flex flex-col md:flex-row h-auto md:h-96">
        <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center min-h-[200px] md:min-h-0 relative overflow-hidden rounded-lg md:rounded-r-none md:rounded-l-lg">
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-gray-50 opacity-50"></div>
            <span className="text-gray-400 font-medium text-lg relative z-10">Product Image Area</span>
        </div>
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center text-inherit">
            <div className="uppercase tracking-wide text-xs md:text-sm font-bold mb-2 opacity-70">{data.subtitle}</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 leading-tight">{data.title}</h2>
            <p className="opacity-80 mb-6 text-sm md:text-base leading-relaxed">
                {data.description}
            </p>
            <div className="flex items-center gap-4 mb-6 md:mb-8">
                <span className="text-2xl font-bold">{data.price}</span>
                <span className="text-lg opacity-50 line-through">{data.originalPrice}</span>
            </div>
            <button className="bg-gray-900 text-white px-6 md:px-8 py-3 rounded-lg font-medium hover:bg-black transition-all transform active:scale-95 w-full md:w-fit flex items-center justify-center gap-2 shadow-lg shadow-gray-200">
                <ShoppingBag size={20} /> {data.buttonText}
            </button>
        </div>
      </div>
    </div>
  );
}
