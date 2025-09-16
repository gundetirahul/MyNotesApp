import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { Collection, CollectionFilter } from '../types';

interface CollectionModalProps {
  collection?: Collection;
  onSave: (collection: Partial<Collection>) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const CollectionModal: React.FC<CollectionModalProps> = ({
  collection,
  onSave,
  onCancel,
  isOpen,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [filters, setFilters] = useState<CollectionFilter[]>([]);

  useEffect(() => {
    if (collection) {
      setName(collection.name);
      setDescription(collection.description || '');
      setFilters(collection.filters);
    } else {
      setName('');
      setDescription('');
      setFilters([]);
    }
  }, [collection, isOpen]);

  const handleSave = () => {
    if (!name.trim()) return;

    const collectionData: Partial<Collection> = {
      name: name.trim(),
      description: description.trim() || undefined,
      filters,
    };

    onSave(collectionData);
  };

  const addFilter = () => {
    setFilters([
      ...filters,
      {
        type: 'tag',
        value: '',
        operator: 'includes',
      },
    ]);
  };

  const updateFilter = (index: number, updates: Partial<CollectionFilter>) => {
    setFilters(filters.map((filter, i) => 
      i === index ? { ...filter, ...updates } : filter
    ));
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {collection ? 'Edit Collection' : 'New Collection'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter collection name..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this collection contains..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none dark:bg-dark-700 dark:text-white"
            />
          </div>

          {/* Filters */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300">
                Filters
              </label>
              <button
                onClick={addFilter}
                className="flex items-center space-x-1 px-2 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                <Plus size={14} />
                <span>Add Filter</span>
              </button>
            </div>

            {filters.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-dark-400">
                <p className="mb-2">No filters added yet</p>
                <p className="text-sm">Add filters to automatically organize cards in this collection</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filters.map((filter, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    {/* Filter Type */}
                    <select
                      value={filter.type}
                      onChange={(e) => updateFilter(index, { type: e.target.value as CollectionFilter['type'] })}
                      className="px-2 py-1 border border-gray-300 dark:border-dark-600 rounded text-sm dark:bg-dark-800 dark:text-white"
                    >
                      <option value="tag">Tag</option>
                      <option value="content">Content</option>
                      <option value="date">Date</option>
                    </select>

                    {/* Operator */}
                    <select
                      value={filter.operator}
                      onChange={(e) => updateFilter(index, { operator: e.target.value as CollectionFilter['operator'] })}
                      className="px-2 py-1 border border-gray-300 dark:border-dark-600 rounded text-sm dark:bg-dark-800 dark:text-white"
                    >
                      {filter.type === 'date' ? (
                        <>
                          <option value="equals">equals</option>
                          <option value="before">before</option>
                          <option value="after">after</option>
                        </>
                      ) : (
                        <>
                          <option value="includes">includes</option>
                          <option value="equals">equals</option>
                        </>
                      )}
                    </select>

                    {/* Value */}
                    <input
                      type={filter.type === 'date' ? 'date' : 'text'}
                      value={filter.value}
                      onChange={(e) => updateFilter(index, { value: e.target.value })}
                      placeholder={`Enter ${filter.type}...`}
                      className="flex-1 px-2 py-1 border border-gray-300 dark:border-dark-600 rounded text-sm dark:bg-dark-800 dark:text-white"
                    />

                    {/* Remove */}
                    <button
                      onClick={() => removeFilter(index)}
                      className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-4 border-t border-gray-200 dark:border-dark-700">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={16} className="mr-2" />
            {collection ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionModal;