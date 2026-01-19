import React from 'react';

export default function CollectionsGrid() {
  const collections = [
    { name: 'New Arrivals', count: 42, color: 'bg-rose-50' },
    { name: 'Best Sellers', count: 18, color: 'bg-amber-50' },
    { name: 'Accessories', count: 56, color: 'bg-emerald-50' },
    { name: 'Sale', count: 24, color: 'bg-indigo-50' },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-end mb-6">
         <h3 className="text-xl font-bold text-gray-900">Featured Collections</h3>
         <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {collections.map((col, idx) => (
            <div key={idx} className="group cursor-pointer">
                <div className={`${col.color} aspect-square rounded-xl mb-3 flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-md relative overflow-hidden`}>
                     <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-gray-400 font-medium text-sm">Img</span>
                </div>
                <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">{col.name}</h4>
                <p className="text-xs text-gray-500">{col.count} items</p>
            </div>
        ))}
      </div>
    </div>
  );
}
