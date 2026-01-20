import React, { useRef } from 'react';
import classNames from 'classnames';
import { DraggableSource } from './DraggableSource';
import ComponentThumbnail from './ComponentThumbnail';
import HeroProduct from './HeroProduct';
import TrustBadge from './TrustBadge';
import CollectionsGrid from './CollectionsGrid';
import SellerVideo from './SellerVideo';
import { X, Minus } from 'lucide-react';
import { SIDEBAR_CATEGORIES } from './constants';

const THUMBNAIL_MAP = {
  heroProduct: HeroProduct,
  trustBadge: TrustBadge,
  collectionsGrid: CollectionsGrid,
  sellerVideo: SellerVideo,
};

export default function SidebarDrawer({ activeCategory, onClose }) {
  const categoryData = SIDEBAR_CATEGORIES.find(c => c.id === activeCategory);

  return (
    <>
      {/* Overlay for Mobile (optional, to click out) */}
      <div
        className={classNames(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-all duration-300 md:hidden",
          activeCategory ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div
        className={classNames(
          "fixed z-40 bg-white shadow-2xl transition-transform cubic-bezier(0.16, 1, 0.3, 1) duration-400 flex flex-col",
          // Desktop/Tablet: Slide out from left (next to nav)
          // Changed lg -> md
          "md:left-20 md:top-16 md:bottom-0 md:w-80 md:border-r md:rounded-none md:translate-y-0 md:max-h-full",
          // Logic for slide out
          activeCategory ? "md:translate-x-0" : "md:-translate-x-full",

          // Mobile: Slide up from bottom (above nav)
          "bottom-20 left-0 w-full max-h-[70vh] rounded-t-3xl border-t shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] md:bottom-auto",
           // Logic for slide up (only applies if NOT md)
          (activeCategory && "translate-y-0") || (!activeCategory && "translate-y-[120%]"),

          // Fix: Ensure Mobile class doesn't override Desktop transform if active
          // The problem is `translate-y` classes might conflict with `translate-x`.
          // We need to ensure that on MD, translate-y is 0 (handled above by md:translate-y-0).
        )}
      >
        {/* Mobile Drag Handle / Header */}
        <div className="flex items-center justify-center pt-3 pb-1 md:hidden" onClick={onClose}>
            <div className="w-12 h-1.5 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400 transition-colors" />
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-white flex justify-between items-center rounded-t-3xl md:rounded-none">
            <div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                {categoryData ? categoryData.label : 'Select'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Drag items to your page</p>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-all md:block hidden"
            >
              <X size={20} />
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {categoryData && (
                <div className="grid grid-cols-2 md:grid-cols-1 gap-5 animate-in fade-in zoom-in-95 duration-300 slide-in-from-bottom-2">
                    {categoryData.items.map((item) => {
                        const Component = THUMBNAIL_MAP[item.type];
                        return (
                        <DraggableSource
                            key={item.type}
                            id={item.type}
                            type={item.type}
                            label={item.label}
                        >
                            {/* Make thumbnails look professional */}
                            <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-indigo-500 hover:ring-2 hover:ring-indigo-500/20 transition-all shadow-sm hover:shadow-md group">
                                <div className="p-3 bg-white border-b border-gray-100 flex justify-center items-center h-24 overflow-hidden">
                                     {Component ? <ComponentThumbnail component={Component} scale={0.4} /> : <div className="text-gray-300">No Preview</div>}
                                </div>
                                <div className="px-3 py-2 bg-gray-50 flex justify-between items-center">
                                    <span className="text-xs font-semibold text-gray-700 group-hover:text-indigo-700">{item.label}</span>
                                    <div className="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                    </div>
                                </div>
                            </div>
                        </DraggableSource>
                        );
                    })}
                </div>
            )}
        </div>
      </div>
    </>
  );
}
