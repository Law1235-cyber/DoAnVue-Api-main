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
import ComponentThumbnail from './ComponentThumbnail';
import { getDefaultsForType } from './schemas';

// Component Registry
const COMPONENT_MAP = {
  heroProduct: HeroProduct,
  trustBadge: TrustBadge,
  collectionsGrid: CollectionsGrid,
  sellerVideo: SellerVideo,
};

export default function ProfileBuilder() {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null); // 'commerce', 'content', etc.
  const [viewMode, setViewMode] = useState('desktop');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Prevent accidental drags
      },
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);

    // Auto-close sidebar on mobile/tablet when dragging starts
    if (window.innerWidth < 1024) {
       setActiveCategory(null);
    }

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

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setActiveId(null);
    setActiveItem(null);

    if (!over) return;

    if (active.data.current?.source === 'sidebar') {
        if (over.id === 'canvas-droppable' || items.some(i => i.id === over.id)) {
            const newItem = {
                id: uuidv4(),
                type: active.data.current.type,
                content: getDefaultsForType(active.data.current.type)
            };

            if (over.id !== 'canvas-droppable') {
                const overIndex = items.findIndex((i) => i.id === over.id);
                const newItems = [...items];
                newItems.splice(overIndex, 0, newItem);
                setItems(newItems);
            } else {
                setItems((prev) => [...prev, newItem]);
            }
            setSelectedItemId(newItem.id);
        }
    }
    else if (active.id !== over.id) {
        setItems((items) => {
            const oldIndex = items.findIndex((i) => i.id === active.id);
            const newIndex = items.findIndex((i) => i.id === over.id);
            return arrayMove(items, oldIndex, newIndex);
        });
    }
  };

  const handleDelete = (id) => {
      setItems((prev) => prev.filter(i => i.id !== id));
      if (selectedItemId === id) setSelectedItemId(null);
  };

  const handleUpdateItem = (id, newContent) => {
      setItems((prev) => prev.map(item =>
          item.id === id ? { ...item, content: newContent } : item
      ));
  };

  const renderComponent = (item) => {
    const Component = COMPONENT_MAP[item.type];
    if (!Component) return <div>Unknown Component</div>;
    // Pass viewMode explicitly for responsive rendering
    return <Component content={item.content} viewMode={viewMode} />;
  };

  const selectedItem = items.find(i => i.id === selectedItemId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col min-h-screen font-sans text-gray-900 bg-[#f0f0f1]">
        <Header
            onToggleSidebar={() => {}} // No longer needed
            isSidebarOpen={!!activeCategory} // No longer needed
            viewMode={viewMode}
            setViewMode={setViewMode}
        />

        <div className="flex flex-1 relative overflow-hidden">
            {/* New Sidebar Structure */}
            <SidebarNav
                activeCategory={activeCategory}
                onSelect={setActiveCategory}
            />

            <SidebarDrawer
                activeCategory={activeCategory}
                onClose={() => setActiveCategory(null)}
            />

            {/* Note: changed lg:ml-20 to md:ml-20 to support Tablet Left Sidebar */}
            <main className="flex-1 w-full relative overflow-y-auto h-[calc(100vh-64px)] scrollbar-hide bg-[#f0f0f1] md:ml-20 pb-20 md:pb-0">
                <Canvas
                    items={items}
                    renderComponent={renderComponent}
                    onDelete={handleDelete}
                    viewMode={viewMode}
                    onSelect={setSelectedItemId}
                    selectedItemId={selectedItemId}
                />
            </main>

            {/* Right Properties Panel */}
            <div className={`transition-all duration-300 ease-in-out border-l border-gray-200 bg-white shadow-xl lg:shadow-none z-30
                ${selectedItemId ? 'w-80 translate-x-0' : 'w-0 translate-x-full lg:translate-x-0 lg:w-0 overflow-hidden'}
                fixed inset-y-0 right-0 lg:relative
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

      <DragOverlay zIndex={100}>
        {activeId ? (
            activeItem?.source === 'sidebar' ? (
                 <div className="cursor-grabbing opacity-90 rotate-2">
                     <ComponentThumbnail
                        component={COMPONENT_MAP[activeItem.type]}
                        scale={0.5}
                     />
                 </div>
            ) : (
                <div className="opacity-90 scale-105 shadow-2xl bg-white rounded-lg pointer-events-none ring-2 ring-indigo-500 ring-offset-4 ring-offset-gray-50">
                     {activeItem && renderComponent(activeItem)}
                </div>
            )
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
