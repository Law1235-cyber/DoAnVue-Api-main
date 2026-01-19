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
import { ChevronDown, ChevronRight } from 'lucide-react';

// Registry for sidebar thumbnails
const THUMBNAIL_MAP = {
  heroProduct: HeroProduct,
  trustBadge: TrustBadge,
  collectionsGrid: CollectionsGrid,
  sellerVideo: SellerVideo,
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
            "fixed top-16 bottom-0 left-0 w-80 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto scrollbar-thin shadow-xl lg:shadow-none flex flex-col",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 pb-2">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">Components</h2>
            <p className="text-xs text-gray-500">Drag to build your page.</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6">
            <div className="flex flex-col gap-2">
                {SIDEBAR_CATEGORIES.map((category) => {
                    const isExpanded = expandedCategories.includes(category.id);

                    return (
                        <div key={category.id} className="border-b border-gray-100 last:border-0 pb-2">
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className="w-full flex items-center justify-between p-2 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <span>{category.label}</span>
                                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>

                            {isExpanded && (
                                <div className="flex flex-col gap-4 mt-2 px-2 animate-in slide-in-from-top-2 duration-200">
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
