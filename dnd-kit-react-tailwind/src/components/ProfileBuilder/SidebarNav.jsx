import React from "react";
import classNames from "classnames";
import {
  Palette,
  Shapes,
  Type,
  CloudUpload,
  Folder,
  Layout,
} from "lucide-react";
import { SIDEBAR_CATEGORIES } from "./constants";

const CATEGORY_ICONS = {
  design: Palette,
  elements: Shapes,
  text: Type,
  uploads: CloudUpload,
  projects: Folder,
};

export default function SidebarNav({ activeCategory, onSelect, isDrawerOpen }) {
  return (
    <div
      className={classNames(
        "fixed z-50 bg-white border-r border-gray-200 flex shadow-sm",
        // Desktop: Vertical left column, adjusted for header
        "lg:left-0 lg:top-[56px] lg:bottom-0 lg:w-[72px] lg:flex-col lg:py-2",

        // Mobile: Horizontal bottom bar
        "bottom-0 left-0 w-full h-20 flex-row border-t border-gray-200 justify-around items-center lg:justify-start lg:gap-2",

        // Hide on mobile when drawer is open
        isDrawerOpen && "hidden lg:flex"
      )}
    >
      {SIDEBAR_CATEGORIES.map((cat) => {
        const Icon = CATEGORY_ICONS[cat.id] || Layout;
        const isActive = activeCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelect(isActive ? null : cat.id)}
            className={classNames(
              "flex flex-col items-center justify-center py-2.5 w-full transition-all duration-200 group relative",
              "flex-1 h-full pb-safe lg:h-auto lg:flex-none lg:w-[64px] lg:mx-auto lg:rounded-lg lg:mb-1",
              isActive
                ? "bg-gradient-to-br from-indigo-50 to-indigo-100/50"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
            )}
          >
            <Icon
              size={22}
              strokeWidth={isActive ? 2 : 1.5}
              className={classNames(
                "mb-1.5 transition-all duration-200",
                isActive ? "text-[#5b46e6] scale-110" : "group-hover:scale-105",
              )}
            />
            <span
              className={classNames(
                "text-[10px] font-medium leading-none tracking-wide",
                isActive ? "font-bold text-[#5b46e6]" : "text-gray-500 group-hover:text-gray-900",
              )}
            >
              {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}