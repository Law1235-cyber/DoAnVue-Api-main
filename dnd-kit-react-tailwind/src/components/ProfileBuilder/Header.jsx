import React from 'react';
import { Menu, X, Save, Eye, Monitor, Tablet, Smartphone, Undo, Redo, MoreHorizontal } from 'lucide-react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function Header({ onToggleSidebar, isSidebarOpen, viewMode, setViewMode }) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-4 lg:px-6 shadow-sm">
      <div className="flex items-center gap-4 min-w-[200px]">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-md hover:bg-gray-100 lg:hidden text-gray-700"
          aria-label="Toggle Menu"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="flex items-center gap-3">
             {/* Logo / Brand */}
            <div className="w-9 h-9 bg-gray-900 rounded-md flex items-center justify-center">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
            </div>
            <div className="hidden sm:flex flex-col">
                <span className="font-bold text-sm text-gray-900 leading-tight">Site Builder</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Untitled Page</span>
            </div>
        </div>
      </div>

      {/* Device Toggles - Centered Segmented Control */}
      <div className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
        <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => setViewMode('desktop')}
              className={classNames(
                "px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-all duration-200",
                viewMode === 'desktop' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
              )}
              title="Desktop view"
            >
              <Monitor size={16} />
              <span className="hidden lg:inline">Desktop</span>
            </button>
            <button
              onClick={() => setViewMode('tablet')}
              className={classNames(
                "px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-all duration-200",
                viewMode === 'tablet' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
              )}
              title="Tablet view"
            >
              <Tablet size={16} />
              <span className="hidden lg:inline">Tablet</span>
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={classNames(
                "px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-all duration-200",
                viewMode === 'mobile' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
              )}
              title="Mobile view"
            >
              <Smartphone size={16} />
              <span className="hidden lg:inline">Mobile</span>
            </button>
        </div>
      </div>

      <div className="flex items-center gap-2 min-w-[200px] justify-end">
        <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors hidden sm:block" title="Undo">
            <Undo size={18} />
        </button>
        <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors hidden sm:block mr-2" title="Redo">
            <Redo size={18} />
        </button>

        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            <Eye size={16} />
            <span>Preview</span>
        </button>

        <button className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-black transition-colors shadow-sm">
            <span>Publish</span>
        </button>

        <button className="ml-1 p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
             <MoreHorizontal size={20} />
        </button>
      </div>
    </header>
  );
}

Header.propTypes = {
  onToggleSidebar: PropTypes.func.isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
  viewMode: PropTypes.oneOf(['desktop', 'tablet', 'mobile']),
  setViewMode: PropTypes.func
};
