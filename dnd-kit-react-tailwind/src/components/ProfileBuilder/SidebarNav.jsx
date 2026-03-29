import React from 'react';
import classNames from 'classnames';
import { ShoppingCart, Image as ImageIcon, Layout, Type, X } from 'lucide-react';
import { SIDEBAR_CATEGORIES } from './constants';

const CATEGORY_ICONS = {
  commerce: ShoppingCart,
  content: ImageIcon,
  layout: Layout,
  text: Type
};

export default function SidebarNav({ activeCategory, onSelect }) {
  return (
    <div className={classNames(
      "fixed z-50 bg-gray-900 border-gray-800 flex shadow-xl",
      // Changed breakpoints from lg to md to support Tablet Left Sidebar
      "md:left-0 md:top-16 md:bottom-0 md:w-20 md:flex-col md:border-r",
      // Mobile only (below md)
      // FIX: Tailwind 'md:hidden' hides the element on md+ screens.
      // But here we are applying classes to the SAME div.
      // We want the div to be flex-row on mobile, flex-col on md.
      // We need to be careful with conflicting display properties.
      // 'flex' is applied first.
      // 'md:flex-col' overrides flex direction.
      // 'flex-row' is default.
      // 'bottom-0 left-0 w-full h-20 justify-around items-center' -> Mobile styles.
      // 'md:justify-start md:pt-4 md:gap-6' -> Desktop overrides.

      // Let's rewrite strictly:
      "flex justify-around items-center", // Default mobile layout (flex-row implied or explicit)
      "bottom-0 left-0 w-full h-20 border-t", // Mobile positioning

      // Desktop/Tablet Overrides:
      "md:flex-col md:justify-start md:items-center md:pt-4 md:gap-6", // Layout changes
      "md:left-0 md:top-16 md:bottom-0 md:w-20 md:h-auto md:border-r md:border-t-0" // Positioning changes
    )}>
      {SIDEBAR_CATEGORIES.map((cat) => {
        const Icon = CATEGORY_ICONS[cat.id] || Layout;
        const isActive = activeCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelect(isActive ? null : cat.id)}
            className={classNames(
              "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 group relative",
              "md:w-16 md:h-16 md:mx-auto", // Desktop/Tablet square
              "flex-1 h-full pb-safe", // Mobile
              isActive
                ? "text-white bg-gray-800 shadow-inner"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            )}
          >
            {/* Active Indicator Line */}
            {isActive && (
                <>
                    {/* Left indicator for Desktop/Tablet */}
                    <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-indigo-500 rounded-r-full" />
                    {/* Top indicator for Mobile */}
                    <div className="md:hidden absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-indigo-500 rounded-b-full" />
                </>
            )}

            <Icon
              size={24}
              strokeWidth={1.5}
              className={classNames(
                "mb-1.5 transition-transform duration-300 ease-out",
                isActive ? "scale-110 text-indigo-400" : "group-hover:scale-105"
              )}
            />
            <span className={classNames(
                "text-[10px] font-medium leading-none tracking-wide transition-colors",
                isActive ? "text-indigo-200" : "text-gray-500 group-hover:text-gray-300"
            )}>
                {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
