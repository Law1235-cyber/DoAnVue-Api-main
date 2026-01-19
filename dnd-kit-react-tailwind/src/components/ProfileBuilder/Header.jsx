import React from 'react';
import { Menu, X, Save, Eye, Monitor, Tablet, Smartphone } from 'lucide-react';
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

        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:inline-block">Builder<span className="text-indigo-600">Pro</span></span>
        </div>
      </div>

      {/* Device Toggles - Centered */}
      <div className="hidden md:flex items-center bg-gray-100 p-1 rounded-lg absolute left-1/2 transform -translate-x-1/2">
        <button
          onClick={() => setViewMode('desktop')}
          className={classNames(
            "p-2 rounded-md transition-all duration-200",
            viewMode === 'desktop' ? "bg-white shadow text-indigo-600" : "text-gray-500 hover:text-gray-700"
          )}
          title="Desktop view"
        >
          <Monitor size={20} />
        </button>
        <button
          onClick={() => setViewMode('tablet')}
          className={classNames(
            "p-2 rounded-md transition-all duration-200",
            viewMode === 'tablet' ? "bg-white shadow text-indigo-600" : "text-gray-500 hover:text-gray-700"
          )}
          title="Tablet view"
        >
          <Tablet size={20} />
        </button>
        <button
          onClick={() => setViewMode('mobile')}
          className={classNames(
            "p-2 rounded-md transition-all duration-200",
            viewMode === 'mobile' ? "bg-white shadow text-indigo-600" : "text-gray-500 hover:text-gray-700"
          )}
          title="Mobile view"
        >
          <Smartphone size={20} />
        </button>
      </div>

      <div className="flex items-center gap-3 min-w-[200px] justify-end">
        <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Eye size={16} />
            <span>Preview</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm hover:shadow">
            <Save size={16} />
            <span>Save</span>
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
