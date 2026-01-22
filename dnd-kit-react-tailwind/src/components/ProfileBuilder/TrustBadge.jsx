import React from 'react';
import { ShieldCheck, Star, Truck } from 'lucide-react';

import { COMPONENT_SCHEMAS } from './schemas';

export default function TrustBadge({ content }) {
  const defaults = COMPONENT_SCHEMAS.trustBadge.fields.reduce((acc, f) => ({...acc, [f.name]: f.default}), {});
  const data = { ...defaults, ...content };

  const accentColor = content?.accentColor || '#4f46e5';

  return (
    // Removed the bg-gradient and fixed styling to allow the wrapper to control background
    // However, for this component, let's keep it clean and just use the wrapper for background
    <div className="h-full w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">

        <div className="flex items-center gap-4 w-full md:w-auto">
            <div
                className="p-3 bg-white rounded-full shadow-sm ring-1 ring-black/5"
                style={{ color: accentColor }}
            >
                <ShieldCheck size={24} />
            </div>
            <div>
                <h3 className="font-bold text-inherit text-base md:text-lg">{data.badge1Title}</h3>
                <p className="text-sm opacity-80">{data.badge1Text}</p>
            </div>
        </div>

        <div className="w-full h-px bg-current md:w-px md:h-12 hidden md:block opacity-10"></div>

        <div className="flex items-center gap-4 w-full md:w-auto">
            <div
                className="p-3 bg-white rounded-full shadow-sm ring-1 ring-black/5"
                style={{ color: accentColor }}
            >
                <Star size={24} fill="currentColor" />
            </div>
            <div>
                <h3 className="font-bold text-inherit text-base md:text-lg">{data.badge2Title}</h3>
                <p className="text-sm opacity-80">{data.badge2Text}</p>
            </div>
        </div>

        <div className="w-full h-px bg-current md:w-px md:h-12 hidden md:block opacity-10"></div>

        <div className="flex items-center gap-4 w-full md:w-auto">
            <div
                className="p-3 bg-white rounded-full shadow-sm ring-1 ring-black/5"
                style={{ color: accentColor }}
            >
                <Truck size={24} />
            </div>
            <div>
                <h3 className="font-bold text-inherit text-base md:text-lg">{data.badge3Title}</h3>
                <p className="text-sm opacity-80">{data.badge3Text}</p>
            </div>
        </div>

      </div>
    </div>
  );
}
