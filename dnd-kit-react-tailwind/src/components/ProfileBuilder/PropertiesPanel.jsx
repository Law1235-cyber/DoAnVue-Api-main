import React, { useState } from 'react';
import { COMPONENT_SCHEMAS } from './schemas';
import { X, Trash2, ChevronDown, ChevronRight, Settings, Palette } from 'lucide-react';
import PropTypes from 'prop-types';

export default function PropertiesPanel({ selectedItem, onUpdateItem, onDelete, onClose }) {
  const [activeTab, setActiveTab] = useState('content'); // 'content' or 'styles'

  if (!selectedItem) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 h-full overflow-y-auto hidden lg:flex flex-col items-center justify-center p-8 text-center text-gray-500">
        <p className="text-sm">Select an item on the canvas to edit its properties.</p>
      </div>
    );
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
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm border p-2"
            />
          );
      }

      if (field.type === 'color') {
          return (
              <div key={field.name} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="h-8 w-8 rounded cursor-pointer border border-gray-200 p-0.5"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm border p-1.5 uppercase"
                  />
              </div>
          );
      }

      if (field.type === 'range') {
          return (
              <div key={field.name} className="flex items-center gap-3">
                  <input
                    type="range"
                    min={field.min}
                    max={field.max}
                    value={value}
                    onChange={(e) => handleChange(field.name, parseInt(e.target.value, 10))}
                    className="flex-1"
                  />
                  <span className="text-xs font-mono w-8 text-right text-gray-500">{value}</span>
              </div>
          );
      }

      return (
        <input
            key={field.name}
            type="text"
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm border p-2"
        />
      );
  };

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-gray-200 shadow-xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <h3 className="font-bold text-gray-900 text-sm">{schema.label}</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded text-gray-500">
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'content' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
              <Settings size={14} />
              Settings
          </button>
          <button
            onClick={() => setActiveTab('styles')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'styles' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
              <Palette size={14} />
              Styles
          </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {activeTab === 'content' && (
            <div className="space-y-4 animate-in fade-in duration-300">
                {schema.fields.map((field) => (
                <div key={field.name}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                        {field.label}
                    </label>
                    {renderField(field)}
                </div>
                ))}
            </div>
        )}

        {activeTab === 'styles' && (
            <div className="space-y-6 animate-in fade-in duration-300">
                {schema.styles ? schema.styles.map((field) => (
                    <div key={field.name}>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                            {field.label}
                        </label>
                        {renderField(field)}
                    </div>
                )) : (
                    <p className="text-sm text-gray-400 text-center py-4">No specific styles for this component.</p>
                )}
            </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={() => onDelete(selectedItem.id)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors font-medium text-sm shadow-sm"
        >
          <Trash2 size={16} />
          Delete Block
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
