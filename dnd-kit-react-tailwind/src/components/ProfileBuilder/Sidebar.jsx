import React, { useState } from 'react';
import { DraggableSource } from './DraggableSource';
import { SIDEBAR_CATEGORIES } from './constants';
import ComponentThumbnail from './ComponentThumbnail';
import HeroProduct from './HeroProduct';
import TrustBadge from './TrustBadge';
import CollectionsGrid from './CollectionsGrid';
import SellerVideo from './SellerVideo';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ChevronDown, ChevronRight, Layout, Type, ShoppingCart, Image as ImageIcon } from 'lucide-react';

// Registry for sidebar thumbnails
const THUMBNAIL_MAP = {
  heroProduct: HeroProduct,
  trustBadge: TrustBadge,
  collectionsGrid: CollectionsGrid,
  sellerVideo: SellerVideo,
};

// Map categories to icons
const CATEGORY_ICONS = {
  commerce: ShoppingCart,
  media: ImageIcon,
  layout: Layout,
  text: Type
};

export default function Sidebar({ isOpen, onClose }) {
  // State to track expanded categories. Default all open.
  const [expandedCategories, setExpandedCategories] = useState(
    SIDEBAR_CATEGORIES.map(c => c.id)
  );

  const toggleCategory = (id) => {
    setExpandedCategories(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={classNames(
            "fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <div
        className={classNames(
            "fixed top-16 bottom-0 left-0 w-80 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto scrollbar-thin shadow-xl lg:shadow-none flex flex-col font-sans",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Add Blocks</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-6">
                {SIDEBAR_CATEGORIES.map((category) => {
                    const isExpanded = expandedCategories.includes(category.id);
                    // Simple icon mapping fallback
                    const Icon = CATEGORY_ICONS[category.id] || Layout;

                    return (
                        <div key={category.id} className="group">
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className="w-full flex items-center justify-between py-2 mb-2 text-left text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    {/* <Icon size={16} className="text-gray-400 group-hover:text-indigo-500 transition-colors"/> */}
                                    {category.label}
                                </span>
                                {isExpanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                            </button>

                            {isExpanded && (
                                <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-300">
                                    {category.items.map((item) => {
                                        const Component = THUMBNAIL_MAP[item.type];
                                        return (
                                        <DraggableSource
                                            key={item.type}
                                            id={item.type}
                                            type={item.type}
                                            label={item.label}
                                        >
                                            {Component && <ComponentThumbnail component={Component} scale={0.32} />}
                                        </DraggableSource>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </>
  );
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
