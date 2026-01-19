import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';
import PropTypes from 'prop-types';

export function DraggableSource({ id, type, label, children, isOverlay }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: {
      type: type,
      source: 'sidebar',
      label: label
    },
    disabled: isOverlay
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={classNames(
        "mb-6 cursor-move group transition-all duration-200 ease-in-out",
        isOverlay ? "opacity-90 z-50 cursor-grabbing shadow-2xl scale-105" : "hover:scale-[1.02]"
      )}
      title={label}
    >
        {children ? (
            <div className="flex flex-col gap-2">
                <div className="text-sm font-bold text-gray-600 group-hover:text-indigo-600 transition-colors ml-1">{label}</div>
                <div className="ring-2 ring-transparent group-hover:ring-indigo-100 rounded-lg transition-all">
                   {children}
                </div>
            </div>
        ) : (
             <div className="p-4 bg-white rounded shadow border border-gray-200">
                <span className="font-medium text-gray-700">{label}</span>
             </div>
        )}
    </div>
  );
}

DraggableSource.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
  isOverlay: PropTypes.bool,
};
