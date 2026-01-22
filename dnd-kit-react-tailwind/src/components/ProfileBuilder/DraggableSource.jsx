import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';
import PropTypes from 'prop-types';

/**
 * Component DraggableSource
 * Đại diện cho một item trong sidebar có thể kéo ra ngoài.
 *
 * @param {string} id - ID duy nhất của item
 * @param {string} type - Loại component (ví dụ: 'heroProduct')
 * @param {string} label - Nhãn hiển thị cho user
 * @param {ReactNode} children - Nội dung con (nếu có)
 * @param {boolean} isOverlay - Có phải đang render trong DragOverlay không
 */
export function DraggableSource({ id, type, label, children, isOverlay }) {
  // Hook useDraggable cung cấp các thuộc tính và event handler để biến thẻ div thành vật có thể kéo
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: {
      type: type,
      source: 'sidebar', // Đánh dấu nguồn là từ sidebar
      label: label
    },
    disabled: isOverlay // Vô hiệu hóa kéo nếu đây là overlay (bản sao khi đang kéo)
  });

  // Chuyển đổi transform thành CSS style để di chuyển item khi kéo
  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  return (
    <div
      ref={setNodeRef} // Gắn ref để dnd-kit quản lý DOM element này
      style={style}
      {...listeners} // Gắn các event listeners (mousedown, touchstart, ...)
      {...attributes} // Gắn các thuộc tính ARIA
      className={classNames(
        "mb-6 cursor-move group transition-all duration-200 ease-in-out",
        isOverlay ? "opacity-90 z-50 cursor-grabbing shadow-2xl scale-105" : "hover:scale-[1.02]"
      )}
      title={label}
    >
      {children ? (
        // Render với children tùy chỉnh (dùng cho component thumbnail)
        <div className="flex flex-col gap-2">
          <div className="text-sm font-bold text-gray-600 group-hover:text-indigo-600 transition-colors ml-1">{label}</div>
          <div className="ring-2 ring-transparent group-hover:ring-indigo-100 rounded-lg transition-all">
            {children}
          </div>
        </div>
      ) : (
        // Render mặc định: Hộp trắng đơn giản với nhãn text
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
