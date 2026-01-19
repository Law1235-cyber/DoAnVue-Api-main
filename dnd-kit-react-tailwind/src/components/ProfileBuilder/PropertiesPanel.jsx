import React from 'react';
import { COMPONENT_SCHEMAS } from './schemas';
import { X, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';

export default function PropertiesPanel({ selectedItem, onUpdateItem, onDelete, onClose }) {
  if (!selectedItem) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 h-full overflow-y-auto hidden lg:flex flex-col items-center justify-center p-8 text-center text-gray-500">
        <p>Select an item on the canvas to edit its properties.</p>
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

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-gray-200 shadow-xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-bold text-gray-900">{schema.label}</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded text-gray-500">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {schema.fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                value={selectedItem.content?.[field.name] || field.default}
                onChange={(e) => handleChange(field.name, e.target.value)}
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm border p-2"
              />
            ) : (
              <input
                type="text"
                value={selectedItem.content?.[field.name] || field.default}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm border p-2"
              />
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={() => onDelete(selectedItem.id)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors font-medium text-sm"
        >
          <Trash2 size={16} />
          Delete Section
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
