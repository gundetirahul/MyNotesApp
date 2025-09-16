import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Hash, Type } from 'lucide-react';
import { Card } from '../types';
import { format } from 'date-fns';

interface NoteEditorProps {
  card?: Card;
  onSave: (card: Partial<Card>) => void;
  onCancel: () => void;
  isOpen: boolean;
  defaultDate?: string;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  card,
  onSave,
  onCancel,
  isOpen,
  defaultDate
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [targetDate, setTargetDate] = useState(defaultDate || format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    if (card) {
      setTitle(card.title || '');
      setContent(card.content);
      setTags(card.tags);
      setTargetDate(card.targetDate || format(new Date(), 'yyyy-MM-dd'));
    } else {
      setTitle('');
      setContent('');
      setTags([]);
      setTargetDate(defaultDate || format(new Date(), 'yyyy-MM-dd'));
    }
    setTagInput('');
  }, [card, defaultDate, isOpen]);

  const handleSave = () => {
    if (!content.trim()) return;

    const cardData: Partial<Card> = {
      title: title.trim() || undefined,
      content: content.trim(),
      tags,
      targetDate,
    };

    onSave(cardData);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {card ? 'Edit Card' : 'New Card'}
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
          {/* Title */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              <Type size={16} className="mr-2" />
              Title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your card..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            />
          </div>

          {/* Target Date */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              <Calendar size={16} className="mr-2" />
              Date
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here... You can use Markdown formatting."
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none dark:bg-dark-700 dark:text-white"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              <Hash size={16} className="mr-2" />
              Tags
            </label>
            
            {/* Tag Input */}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type a tag and press Enter..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            />
            
            {/* Tag List */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
                  >
                    <Hash size={12} className="mr-1" />
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-primary-600"
                    >
                      <X size={12} />
                    </button>
                  </span>
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
            disabled={!content.trim()}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={16} className="mr-2" />
            {card ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;