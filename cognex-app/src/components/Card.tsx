import React, { useState } from 'react';
import { Card as CardType } from '../types';
import { MoreVertical, Edit, Trash2, Calendar, Hash } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface CardProps {
  card: CardType;
  onEdit: (card: CardType) => void;
  onDelete: (cardId: string) => void;
}

const Card: React.FC<CardProps> = ({ card, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleEdit = () => {
    onEdit(card);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      onDelete(card.id);
    }
    setShowMenu(false);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-4 hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {card.title && (
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              {card.title}
            </h3>
          )}
          {card.targetDate && (
            <div className="flex items-center text-sm text-gray-500 dark:text-dark-400 mb-2">
              <Calendar size={14} className="mr-1" />
              {formatDate(card.targetDate)}
            </div>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-dark-700"
          >
            <MoreVertical size={16} className="text-gray-500" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
              <button
                onClick={handleEdit}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                <Edit size={14} className="mr-2" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 size={14} className="mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {card.content}
        </ReactMarkdown>
      </div>

      {/* Tags */}
      {card.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-dark-700">
          {card.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
            >
              <Hash size={10} className="mr-1" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-dark-700 text-xs text-gray-500 dark:text-dark-400">
        <span>Created {formatDate(card.createdAt)}</span>
        {card.updatedAt !== card.createdAt && (
          <span>Updated {formatDate(card.updatedAt)}</span>
        )}
      </div>
    </div>
  );
};

export default Card;