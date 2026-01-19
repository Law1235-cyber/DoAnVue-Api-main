import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';

export function SortableItem({ id, component, onDelete, onSelect, isSelected }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative mb-6 group transition-all ${isSelected ? 'z-20' : ''}`}
      onClick={(e) => {
        // Prevent selecting if we are clicking dragging handle or delete
        if (!e.defaultPrevented) {
             onSelect(id);
        }
      }}
    >
      {/* Selection/Hover Outline */}
      <div className={`absolute -inset-0.5 rounded-lg border-2 transition-colors pointer-events-none
        ${isSelected ? 'border-indigo-600 shadow-[0_0_0_4px_rgba(79,70,229,0.1)]' : 'border-transparent group-hover:border-indigo-500/50'}
      `} />

      {/* Toolbar - appears on hover or selection */}
      <div className={`absolute -top-10 right-0 flex justify-end opacity-0 transition-all duration-200 z-30 pointer-events-none
        ${(isSelected || isDragging) ? 'opacity-100 pointer-events-auto' : 'group-hover:opacity-100 group-hover:pointer-events-auto'}
      `}>
         <div className="bg-gray-900 text-white rounded-lg shadow-xl flex items-center overflow-hidden transform translate-y-2 group-hover:translate-y-0 transition-transform">
             <button
                className="p-1.5 hover:bg-gray-700 cursor-grab active:cursor-grabbing border-r border-gray-700"
                {...listeners}
                {...attributes}
                title="Drag to reorder"
             >
                <GripVertical size={16} />
             </button>
             <button
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onDelete(id);
                }}
                className="p-1.5 hover:bg-red-600 text-gray-300 hover:text-white transition-colors"
                title="Delete section"
             >
                <Trash2 size={16} />
             </button>
         </div>
      </div>

      <div className="relative bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow overflow-hidden cursor-pointer">
          {component}
      </div>
    </div>
  );
}

SortableItem.propTypes = {
  id: PropTypes.string.isRequired,
  component: PropTypes.node.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
  isSelected: PropTypes.bool
};
