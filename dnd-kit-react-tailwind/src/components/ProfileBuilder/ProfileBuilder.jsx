import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';

import Header from './Header';
import SidebarNav from './SidebarNav';
import SidebarDrawer from './SidebarDrawer';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import HeroProduct from './HeroProduct';
import TrustBadge from './TrustBadge';
import CollectionsGrid from './CollectionsGrid';
import SellerVideo from './SellerVideo';
import UserName from './UserName';
import UserInfo from './UserInfo';
import SocialLinks from './SocialLinks';
import ComponentThumbnail from './ComponentThumbnail';
import { getDefaultsForType } from './schemas';

// Component Registry - Ánh xạ loại component với React Component tương ứng
const COMPONENT_MAP = {
  heroProduct: HeroProduct,
  trustBadge: TrustBadge,
  collectionsGrid: CollectionsGrid,
  sellerVideo: SellerVideo,
  userName: UserName,
  userInfo: UserInfo,
  socialLinks: SocialLinks,
};

export default function ProfileBuilder() {
  // --- Quản lý State ---
  // --- Quản lý State ---
  // Thay đổi: items -> pages
  const [pages, setPages] = useState([{ id: 'page-1', items: [] }]);
  const [activePageId, setActivePageId] = useState('page-1');

  // Computed: Get items for active page
  const activePage = pages.find(p => p.id === activePageId) || pages[0];
  const items = activePage.items;

  // Helper to update items for current page
  const setItems = (newItemsOrFn) => {
    setPages(prevPages => prevPages.map(page => {
      if (page.id !== activePageId) return page;

      const newItems = typeof newItemsOrFn === 'function'
        ? newItemsOrFn(page.items)
        : newItemsOrFn;

      return { ...page, items: newItems };
    }));
  };

  const [activeId, setActiveId] = useState(null); // ID của item đang được kéo
  const [activeItem, setActiveItem] = useState(null); // Thông tin chi tiết item đang được kéo
  const [selectedItemId, setSelectedItemId] = useState(null); // ID của item đang được chọn để chỉnh sửa
  const [activeCategory, setActiveCategory] = useState(null); // Danh mục sidebar đang mở: 'commerce', 'content', etc.
  const [viewMode, setViewMode] = useState('desktop'); // Chế độ xem: 'desktop' hoặc 'mobile'

  // Cấu hình cảm biến kéo thả
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Khoảng cách di chuyển tối thiểu 5px mới bắt đầu kéo (tránh click nhầm)
      },
    })
  );

  // Xử lý khi bắt đầu kéo
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);

    // Tự động đóng sidebar trên thiết bị di động/tablet khi bắt đầu kéo
    if (window.innerWidth < 1024) {
      setActiveCategory(null);
    }

    // Xác định item đang kéo là từ Sidebar hay đã có trên Canvas
    if (active.data.current?.source === 'sidebar') {
      setActiveItem({
        id: active.id,
        type: active.data.current.type,
        label: active.data.current.label,
        source: 'sidebar'
      });
    } else {
      const item = items.find(i => i.id === active.id);
      if (item) {
        setActiveItem({ ...item, source: 'canvas' });
      }
    }
  };

  // Xử lý khi kết thúc kéo
  const handleDragEnd = (event) => {
    const { active, over } = event;

    setActiveId(null);
    setActiveItem(null);

    if (!over) return; // Nếu không thả vào đâu cả thì không làm gì

    // Trường hợp 1: Kéo item từ Sidebar vào Canvas
    if (active.data.current?.source === 'sidebar') {
      // Nếu thả vào vùng canvas chính ('canvas-droppable') hoặc lên trên một item khác
      if (over.id === 'canvas-droppable' || items.some(i => i.id === over.id)) {
        const newItem = {
          id: uuidv4(), // Tạo ID mới duy nhất
          type: active.data.current.type,
          content: getDefaultsForType(active.data.current.type) // Lấy dữ liệu mặc định cho component
        };

        if (over.id !== 'canvas-droppable') {
          // Nếu thả lên một item khác -> chèn vào vị trí đó
          const overIndex = items.findIndex((i) => i.id === over.id);
          const newItems = [...items];
          newItems.splice(overIndex, 0, newItem);
          setItems(newItems);
        } else {
          // Nếu thả vào vùng trống cuối canvas -> thêm vào cuối
          setItems((prev) => [...prev, newItem]);
        }
        setSelectedItemId(newItem.id); // Tự động chọn item mới thêm để chỉnh sửa
      }
    }
    // Trường hợp 2: Sắp xếp lại vị trí các item trên Canvas
    else if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex); // Hoán đổi vị trí
      });
    }
  };

  // Xóa item khỏi Canvas
  const handleDelete = (id) => {
    setItems((prev) => prev.filter(i => i.id !== id));
    if (selectedItemId === id) setSelectedItemId(null); // Bỏ chọn nếu item bị xóa đang được chọn
  };

  // Cập nhật nội dung của item
  const handleUpdateItem = (id, newContent) => {
    setItems((prev) => prev.map(item =>
      item.id === id ? { ...item, content: newContent } : item
    ));
  };

  // Hàm render component dựa trên type
  const renderComponent = (item) => {
    const Component = COMPONENT_MAP[item.type];
    if (!Component) return <div>Unknown Component</div>;
    return <Component content={item.content} />;
  };

  const selectedItem = items.find(i => i.id === selectedItemId);

  // --- Page Management ---
  const handleAddPage = () => {
    const newPageId = uuidv4();
    setPages(prev => [...prev, { id: newPageId, items: [] }]);
    setActivePageId(newPageId);
    setSelectedItemId(null);
  };

  const handleSwitchPage = (pageId) => {
    setActivePageId(pageId);
    setSelectedItemId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col min-h-screen font-sans text-gray-900 bg-[#f0f0f1]">
        {/* Thanh Header trên cùng */}
        <Header
          onToggleSidebar={() => { }} // Không còn dùng
          isSidebarOpen={!!activeCategory} // Không còn dùng
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <div className="flex flex-1 relative overflow-hidden pt-[56px]">
          {/* Cấu trúc Sidebar mới */}
          {/* Menu điều hướng bên trái */}
          <SidebarNav
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
            isDrawerOpen={!!activeCategory}
          />

          {/* Ngăn kéo Sidebar mở rộng khi click category */}
          <SidebarDrawer
            activeCategory={activeCategory}
            onClose={() => setActiveCategory(null)}
          />

          {/* Khu vực Canvas chính hiển thị giao diện */}
          <main className={`flex-1 w-full relative h-full bg-[#f0f0f1] pb-16 lg:pb-0 flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${activeCategory ? 'lg:ml-[392px]' : 'lg:ml-[72px]'} ${selectedItemId ? 'lg:mr-80' : ''}`}>
            <Canvas
              items={items}
              renderComponent={renderComponent}
              onDelete={handleDelete}
              viewMode={viewMode}
              onSelect={setSelectedItemId}
              selectedItemId={selectedItemId}
              pages={pages}
              activePageId={activePageId}
              onAddPage={handleAddPage}
              onSwitchPage={handleSwitchPage}
            />
          </main>

          {/* Panel thuộc tính bên phải (Properties Panel) */}
          <div className={`transition-transform duration-300 ease-in-out border-l border-gray-200 bg-white shadow-xl z-30
                ${selectedItemId ? 'translate-x-0' : 'translate-x-full'}
                fixed right-0 top-[56px] w-80 h-[calc(100vh-56px)]
            `}>
            <PropertiesPanel
              selectedItem={selectedItem}
              onUpdateItem={handleUpdateItem}
              onDelete={handleDelete}
              onClose={() => setSelectedItemId(null)}
            />
          </div>
        </div>
      </div>

      {/* Lớp phủ khi kéo item (hiển thị bản sao của item đang kéo) */}
      <DragOverlay zIndex={100}>
        {activeId ? (
          activeItem?.source === 'sidebar' ? (
            // Kéo từ sidebar
            <div className="cursor-grabbing opacity-90 rotate-2">
              <ComponentThumbnail
                component={COMPONENT_MAP[activeItem.type]}
                scale={0.5}
              />
            </div>
          ) : (
            // Kéo trên canvas (sắp xếp lại)
            <div className="opacity-90 scale-105 shadow-2xl bg-white rounded-lg pointer-events-none ring-2 ring-indigo-500 ring-offset-4 ring-offset-gray-50">
              {activeItem && renderComponent(activeItem)}
            </div>
          )
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}