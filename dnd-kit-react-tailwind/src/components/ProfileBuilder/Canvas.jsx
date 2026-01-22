import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Plus } from 'lucide-react';
import PropTypes from 'prop-types';

export default function Canvas({ items, renderComponent, onDelete, viewMode, onSelect, selectedItemId, pages, activePageId, onAddPage, onSwitchPage }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-droppable',
  });

  const getContainerStyle = () => {
    switch (viewMode) {
      case 'mobile':
        return {
          width: '375px',
          minHeight: '667px',
        };
      case 'tablet':
        return {
          width: '768px',
          minHeight: '1024px',
        };
      case 'desktop':
      default:
        return {
          width: '895px', // Fixed width for desktop to look like a canvas
          height: '530px', // Fixed height as requested
          overflowY: 'auto', // Allow internal scrolling
          position: 'relative', // Context for absolute positioning if needed
        };
    }
  };

  const containerStyle = getContainerStyle();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center transition-all duration-300">

      {/* Canvas Wrapper */}
      <div
        className="transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] flex flex-col items-center"
        style={{
          width: viewMode === 'desktop' ? '100%' : 'auto',
          marginTop: '30px'
        }}
      >
        <div
          id="canvas-droppable"
          ref={setNodeRef}
          style={containerStyle}
          className={`
            relative bg-white transition-all duration-300 mx-auto
            shadow-[0_0_20px_rgba(139,92,246,0.15)]
            ${isOver ? 'ring-4 ring-indigo-500/30' : ''}
          `}
        >
          {items.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-8 text-center select-none">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300 border-2 border-dashed border-gray-200">
                <Plus size={40} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Start Designing</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Drag blocks from the sidebar to build your page layout.
              </p>
            </div>
          ) : (
            <div className={`
                flex flex-col
                ${viewMode === 'desktop' ? 'p-8 md:p-12' : 'p-4'}
            `}>
              <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                {items.map((item) => (
                  <SortableItem
                    key={item.id}
                    id={item.id}
                    component={renderComponent(item)}
                    onDelete={onDelete}
                    onSelect={onSelect}
                    isSelected={selectedItemId === item.id}
                  />
                ))}
              </SortableContext>

              {/* Drop indicator / Spacer */}
              <div className={`
                    mt-4 h-24 border-2 border-dashed rounded-lg flex items-center justify-center text-sm font-medium transition-colors
                    ${isOver ? 'border-indigo-400 bg-indigo-50 text-indigo-600' : 'border-gray-100 bg-gray-50/50 text-gray-400'}
                `}>
                {isOver ? 'Drop to append' : 'Add more blocks'}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Pagination / Page Thumbnails */}
      {viewMode === 'desktop' && (
        <div className="mt-6 flex items-center justify-center gap-4 animate-in slide-in-from-bottom-4 duration-500">
          {pages.map((page, index) => {
            const isActive = page.id === activePageId;
            return (
              <div key={page.id} className="group relative flex flex-col items-center gap-2">
                <button
                  onClick={() => onSwitchPage(page.id)}
                  className={`
                      w-16 h-10 rounded border-2 transition-all duration-200 relative overflow-hidden bg-white shadow-sm
                      ${isActive
                      ? 'border-indigo-500 ring-2 ring-indigo-500/30 ring-offset-2'
                      : 'border-gray-200 hover:border-gray-300 hover:scale-105'}
                    `}
                >
                  {/* Mini preview lines */}
                  <div className="absolute top-2 left-2 right-2 h-0.5 bg-gray-100 rounded-full"></div>
                  <div className="absolute top-3.5 left-2 right-4 h-0.5 bg-gray-100 rounded-full"></div>
                </button>
                <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                  Page {index + 1}
                </span>
              </div>
            )
          })}

          {/* Add Page Button */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onAddPage}
              className="w-16 h-10 rounded border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 flex items-center justify-center transition-all duration-200 hover:scale-105"
              title="Add New Page"
            >
              <Plus size={20} />
            </button>
            <span className="text-[10px] font-medium text-gray-400 opacity-0">Add</span> {/* Spacer */}
          </div>
        </div>
      )}

      {/* Device Name Label */}
      {viewMode !== 'desktop' && (
        <div className="mt-4 text-xs font-medium text-gray-400 uppercase tracking-widest">
          {viewMode === 'mobile' ? 'iPhone SE' : 'iPad Mini'}
        </div>
      )}
    </div>

  );
}

Canvas.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  })).isRequired,
  renderComponent: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  viewMode: PropTypes.oneOf(['desktop', 'tablet', 'mobile']),
  onSelect: PropTypes.func,
  selectedItemId: PropTypes.string
};
