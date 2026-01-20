import React, { useState } from 'react';
import { COMPONENT_SCHEMAS } from './schemas';
import { X, Trash2, Settings, Palette } from 'lucide-react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function PropertiesPanel({ selectedItem, onUpdateItem, onDelete, onClose }) {
  const [activeTab, setActiveTab] = useState('content'); // 'content' or 'styles'

  // If no item is selected, we might want to render nothing or a placeholder.
  // In `ProfileBuilder.jsx`, we control visibility with width/transform.
  // So here we should always render structure if selectedItem is present.

  if (!selectedItem) {
      // Return something that fills the space if it's "open" but empty?
      // Actually `ProfileBuilder` hides it if `!selectedItem`.
      // But let's be safe.
      return null;
  }

  const schema = COMPONENT_SCHEMAS[selectedItem.type];
  if (!schema) return null;

  const handleChange = (fieldName, value) => {
    onUpdateItem(selectedItem.id, {
        ...selectedItem.content,
        [fieldName]: value
    });
  };

  const renderField = (field) => {
      const value = selectedItem.content?.[field.name] ?? field.default;

      if (field.type === 'textarea') {
          return (
            <textarea
                key={field.name}
                value={value}
                onChange={(e) => handleChange(field.name, e.target.value)}
                rows={4}
                className="w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm border p-2.5 bg-gray-50/50 hover:bg-white transition-colors"
            />
          );
      }

      if (field.type === 'color') {
          return (
              <div key={field.name} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-sm border border-gray-200 shrink-0">
                    <input
                        type="color"
                        value={value}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 m-0 opacity-100"
                    />
                  </div>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="flex-1 rounded-md border-gray-200 text-sm border p-1.5 uppercase font-mono text-gray-600 focus:ring-1 focus:ring-indigo-500"
                  />
              </div>
          );
      }

      if (field.type === 'range') {
          return (
              <div key={field.name} className="flex items-center gap-4 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                  <input
                    type="range"
                    min={field.min}
                    max={field.max}
                    value={value}
                    onChange={(e) => handleChange(field.name, parseInt(e.target.value, 10))}
                    className="flex-1 accent-indigo-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs font-mono w-8 text-right text-gray-600">{value}px</span>
              </div>
          );
      }

      return (
        <input
            key={field.name}
            type="text"
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm border p-2.5 bg-gray-50/50 hover:bg-white transition-colors"
        />
      );
  };

  // Note: The container styles (fixed/width/etc) are handled by the parent in ProfileBuilder.
  // This component just fills that container.
  return (
    <div className="h-full flex flex-col font-sans bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
        <h3 className="font-bold text-gray-900 text-sm tracking-wide">{schema.label}</h3>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 px-2">
          <button
            onClick={() => setActiveTab('content')}
            className={classNames(
                "flex-1 py-3 text-xs font-semibold border-b-2 transition-all flex items-center justify-center gap-2",
                activeTab === 'content'
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-t-lg"
            )}
          >
              <Settings size={14} />
              Settings
          </button>
          <button
            onClick={() => setActiveTab('styles')}
            className={classNames(
                "flex-1 py-3 text-xs font-semibold border-b-2 transition-all flex items-center justify-center gap-2",
                activeTab === 'styles'
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-t-lg"
            )}
          >
              <Palette size={14} />
              Styles
          </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {activeTab === 'content' && (
            <div className="space-y-5 animate-in fade-in duration-300 slide-in-from-right-2">
                {schema.fields.map((field) => (
                <div key={field.name}>
                    <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider">
                        {field.label}
                    </label>
                    {renderField(field)}
                </div>
                ))}
            </div>
        )}

        {activeTab === 'styles' && (
            <div className="space-y-5 animate-in fade-in duration-300 slide-in-from-right-2">
                {schema.styles ? schema.styles.map((field) => (
                    <div key={field.name}>
                        <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider">
                            {field.label}
                        </label>
                        {renderField(field)}
                    </div>
                )) : (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <Palette size={32} className="mb-2 opacity-50"/>
                        <p className="text-xs">No specific styles available.</p>
                    </div>
                )}
            </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-5 border-t border-gray-100 bg-gray-50/50">
        <button
          onClick={() => onDelete(selectedItem.id)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 hover:shadow-sm transition-all font-semibold text-xs tracking-wide"
        >
          <Trash2 size={15} />
          DELETE BLOCK
        </button>
      </div>
    </div>
  );
}

PropertiesPanel.propTypes = {
  selectedItem: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
    content: PropTypes.object
  }),
  onUpdateItem: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};
