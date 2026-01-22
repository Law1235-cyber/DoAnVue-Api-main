import React from 'react';
import { Menu, X, Undo, Redo, Monitor, Tablet, Smartphone, ChevronDown, Share2, Play, Plus } from 'lucide-react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function Header({ onToggleSidebar, isSidebarOpen, viewMode, setViewMode }) {
  return (
    <header className=" fixed top-0 left-0 right-0 h-[56px] bg-gradient-to-r from-[#00c4cc] via-[#5b46e6] to-[#7d2ae8] z-100 flex items-center justify-between px-3 shadow-md text-white">
      {/* Left Section: Home, File, Resize */}
      <div className="flex items-center gap-1">
        <button
          className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-md transition-colors"
          title="Home"
        >
          <Menu size={20} className="text-white" />
        </button>

        <div className="flex items-center gap-1 ml-1 text-[13px] font-medium">
          <button className="px-3 py-1.5 hover:bg-white/20 rounded-md transition-colors hidden sm:block">
            File
          </button>
          <button className="px-3 py-1.5 hover:bg-white/20 rounded-md transition-colors hidden sm:block">
            Resize
          </button>
          {/* Mobile / Tablet Toggle inside header? Or kept separate? Let's keep the Undo/Redo here as well */}
          <div className="h-4 w-[1px] bg-white/30 mx-2 hidden sm:block"></div>
          <button className="p-1.5 hover:bg-white/20 rounded-md transition-colors hidden sm:block" title="Undo">
            <Undo size={16} />
          </button>
          <button className="p-1.5 hover:bg-white/20 rounded-md transition-colors hidden sm:block" title="Redo">
            <Redo size={16} />
          </button>
        </div>
      </div>

      {/* Center Section: Document Title (Canva style) */}
      <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
        {/* Simple View Mode Toggles (optional, keep it small) */}
        <div className="flex items-center bg-black/20 p-0.5 rounded-lg border border-white/10 mr-4">
          <button
            onClick={() => setViewMode('desktop')}
            className={classNames(
              "p-1.5 rounded-md transition-colors",
              viewMode === 'desktop' ? "bg-white text-[#7d2ae8]" : "text-white/80 hover:bg-white/10"
            )}
            title="Desktop view"
          >
            <Monitor size={14} />
          </button>
          <button
            onClick={() => setViewMode('tablet')}
            className={classNames(
              "p-1.5 rounded-md transition-colors",
              viewMode === 'tablet' ? "bg-white text-[#7d2ae8]" : "text-white/80 hover:bg-white/10"
            )}
            title="Tablet view"
          >
            <Tablet size={14} />
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={classNames(
              "p-1.5 rounded-md transition-colors",
              viewMode === 'mobile' ? "bg-white text-[#7d2ae8]" : "text-white/80 hover:bg-white/10"
            )}
            title="Mobile view"
          >
            <Smartphone size={14} />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <span className="font-semibold text-sm tracking-wide">
            {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Design
          </span>
        </div>
      </div>

      {/* Right Section: User, Share, etc */}
      <div className="flex items-center gap-2 justify-end">
        <div className="flex items-center -space-x-2 mr-2">
          {/* Fake Collaborators */}
          <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-800">
            JD
          </div>
          <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 border-2 border-transparent flex items-center justify-center transition-colors">
            <Plus size={16} />
          </button>
        </div>

        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md font-semibold text-sm transition-colors border border-white/20">
          <Monitor size={16} />
          <span className="hidden sm:inline">Present</span>
        </button>

        <button className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-[#7d2ae8] hover:bg-gray-100 rounded-md font-bold text-sm shadow-sm transition-colors">
          <Share2 size={16} />
          <span>Share</span>
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

Header.propTypes = {
  onToggleSidebar: PropTypes.func.isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
  viewMode: PropTypes.oneOf(['desktop', 'tablet', 'mobile']),
  setViewMode: PropTypes.func
};
