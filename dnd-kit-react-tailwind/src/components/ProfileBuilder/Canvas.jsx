import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Plus } from 'lucide-react';
import PropTypes from 'prop-types';

export default function Canvas({ items, renderComponent, onDelete, viewMode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-droppable',
  });

  const getMaxWidth = () => {
    switch (viewMode) {
      case 'mobile': return 'max-w-[375px]';
      case 'tablet': return 'max-w-[768px]';
      default: return 'max-w-5xl';
    }
  };

  return (
    <div className="pt-24 pb-32 px-4 md:px-8 lg:ml-80 min-h-full flex flex-col items-center transition-all duration-300">

      {/* Title section - only show on desktop view mode or if screen is large enough */}
      <div className="w-full max-w-5xl mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Profile Layout</h1>
            <p className="text-gray-500 mt-2">Customize how visitors see your store.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-600 shadow-sm border border-gray-200 whitespace-nowrap">
           {items.length} {items.length === 1 ? 'Section' : 'Sections'}
        </div>
      </div>

      <div className={`w-full ${getMaxWidth()} transition-all duration-500 ease-in-out`}>
        <div
          ref={setNodeRef}
          className={`
            min-h-[600px] rounded-xl transition-all duration-300 relative
            ${items.length === 0 ? 'border-2 border-dashed border-gray-300 bg-white' : 'bg-white shadow-2xl border border-gray-200'}
            ${isOver
                ? 'ring-4 ring-indigo-100 border-indigo-500'
                : ''
            }
          `}
        >
          {items.length === 0 ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-indigo-300 group-hover:text-indigo-500 transition-colors">
                    <Plus size={32} strokeWidth={3} />
                </div>
                <p className="text-lg font-medium text-gray-600">Start Building</p>
                <p className="text-sm mt-2 max-w-xs text-gray-400">
                    Drag components from the sidebar to create your page.
                </p>
             </div>
          ) : (
            <div className="p-4 md:p-8 pb-12 min-h-[600px]">
                <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                {items.map((item) => (
                    <SortableItem
                        key={item.id}
                        id={item.id}
                        component={renderComponent(item)}
                        onDelete={onDelete}
                    />
                ))}
                </SortableContext>

                {/* Drop indicator at bottom */}
                <div className={`h-24 border-2 border-dashed border-gray-200 rounded-lg mt-4 flex items-center justify-center text-gray-400 text-sm transition-all duration-200 ${isOver ? 'bg-indigo-50 border-indigo-300 text-indigo-500' : 'bg-gray-50'}`}>
                    {isOver ? 'Drop here to add to bottom' : 'Drag more items here'}
                </div>
            </div>
          )}
        </div>
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
};
