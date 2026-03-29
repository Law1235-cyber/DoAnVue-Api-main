import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Plus } from 'lucide-react';
import PropTypes from 'prop-types';

export default function Canvas({ items, renderComponent, onDelete, viewMode, onSelect, selectedItemId }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-droppable',
  });

  const getContainerStyle = () => {
    switch (viewMode) {
      case 'mobile':
        return {
            width: '375px',
            minHeight: '667px',
            borderWidth: '1px',
        };
      case 'tablet':
        return {
            width: '768px',
            minHeight: '1024px',
            borderWidth: '1px',
        };
      default:
        return {
            width: '100%',
            maxWidth: '1024px',
            minHeight: '800px',
            borderWidth: '0px', // Desktop often feels like "full page"
        };
    }
  };

  const containerStyle = getContainerStyle();

  return (
    <div className="pt-24 pb-32 px-4 min-h-full flex flex-col items-center justify-start transition-all duration-300 bg-gray-100/50">

      {/* Canvas Wrapper */}
      <div
        className="transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] flex flex-col items-center"
        style={{ width: viewMode === 'desktop' ? '100%' : 'auto' }}
      >
        <div
          id="canvas-droppable"
          ref={setNodeRef}
          style={{
              width: containerStyle.width,
              minHeight: containerStyle.minHeight
          }}
          className={`
            relative bg-white shadow-sm transition-all duration-300
            ${viewMode !== 'desktop' ? 'border-gray-300 shadow-2xl my-8' : 'border-x border-gray-200 shadow-sm'}
            ${isOver ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
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

        {/* Device Name Label */}
        {viewMode !== 'desktop' && (
            <div className="mt-4 text-xs font-medium text-gray-400 uppercase tracking-widest">
                {viewMode === 'mobile' ? 'iPhone SE' : 'iPad Mini'}
            </div>
        )}
      </div>
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
