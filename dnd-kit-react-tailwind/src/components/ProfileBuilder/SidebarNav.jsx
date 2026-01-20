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
      "fixed z-50 bg-gray-900 border-gray-800 flex shadow-xl", // Changed to dark theme for "Canva-like" Pro look
      // Desktop: Vertical left column
      "lg:left-0 lg:top-16 lg:bottom-0 lg:w-20 lg:flex-col lg:border-r",
      // Mobile: Horizontal bottom bar
      "bottom-0 left-0 w-full h-20 flex-row border-t justify-around items-center lg:justify-start lg:pt-4 lg:gap-6"
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
              "lg:w-16 lg:h-16 lg:mx-auto",
              "flex-1 h-full pb-safe", // Handle safe area on mobile
              isActive
                ? "text-white bg-gray-800 shadow-inner"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            )}
          >
            {/* Active Indicator Line (Left on Desktop, Top on Mobile) */}
            {isActive && (
                <>
                    <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-indigo-500 rounded-r-full" />
                    <div className="lg:hidden absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-indigo-500 rounded-b-full" />
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
