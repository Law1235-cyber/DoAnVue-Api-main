import React from 'react';
import { ShoppingBag } from 'lucide-react';
import classNames from 'classnames';

import { COMPONENT_SCHEMAS } from './schemas';

export default function HeroProduct({ content, viewMode }) {
  const defaults = COMPONENT_SCHEMAS.heroProduct.fields.reduce((acc, f) => ({...acc, [f.name]: f.default}), {});
  const data = { ...defaults, ...content };

  const isStacked = viewMode === 'mobile' || viewMode === 'tablet';

  return (
    <div className="overflow-hidden group">
      <div className={classNames(
          "flex h-auto transition-all duration-300",
          isStacked ? "flex-col" : "flex-row h-96"
      )}>
        {/* Image Area */}
        <div className={classNames(
            "bg-gray-100 flex items-center justify-center relative overflow-hidden transition-all duration-300",
            isStacked ? "w-full min-h-[250px] rounded-lg mb-4" : "w-1/2 rounded-l-lg"
        )}>
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-gray-50 opacity-50"></div>
            <span className="text-gray-400 font-medium text-lg relative z-10">Product Image Area</span>
        </div>

        {/* Content Area */}
        <div className={classNames(
            "flex flex-col justify-center text-inherit transition-all duration-300",
            isStacked ? "w-full p-2" : "w-1/2 p-8 pl-10"
        )}>
            <div className="uppercase tracking-wide text-xs font-bold mb-2 opacity-70">{data.subtitle}</div>
            <h2 className="text-3xl font-bold mb-3 leading-tight">{data.title}</h2>
            <p className="opacity-80 mb-6 text-base leading-relaxed">
                {data.description}
            </p>
            <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-bold">{data.price}</span>
                <span className="text-lg opacity-50 line-through">{data.originalPrice}</span>
            </div>
            <button className={classNames(
                "bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-black transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-gray-200",
                isStacked ? "w-full" : "w-fit px-8"
            )}>
                <ShoppingBag size={20} /> {data.buttonText}
            </button>
        </div>
      </div>
    </div>
  );
}
