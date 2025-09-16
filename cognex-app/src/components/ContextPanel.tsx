import React from 'react';
import { useAppStore } from '../store';
import { Calendar, Hash, Clock, User, Tag } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const ContextPanel: React.FC = () => {
  const { cards, selectedDate, searchQuery, selectedCollection, collections, user } = useAppStore();

  const filteredCards = useAppStore(state => state.filteredCards());
  const currentViewMode = useAppStore(state => state.currentViewMode());

  // Get stats
  const totalCards = cards.length;
  const todayCards = cards.filter(card => card.targetDate === format(new Date(), 'yyyy-MM-dd')).length;
  const recentCards = cards.filter(card => {
    const cardDate = new Date(card.updatedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return cardDate > weekAgo;
  }).length;

  // Get all unique tags
  const allTags = Array.from(new Set(cards.flatMap(card => card.tags)));
  const popularTags = allTags
    .map(tag => ({
      tag,
      count: cards.filter(card => card.tags.includes(tag)).length
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Get current collection info
  const currentCollection = selectedCollection 
    ? collections.find(c => c.id === selectedCollection)
    : null;

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="w-80 bg-white dark:bg-dark-800 border-l border-gray-200 dark:border-dark-700 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-dark-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Context
        </h2>
        <p className="text-sm text-gray-500 dark:text-dark-400">
          Insights and metadata
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Current View Info */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
            <Calendar size={16} className="mr-2" />
            Current View
          </h3>
          
          <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-3 space-y-2">
            {currentViewMode === 'daily' && (
              <>
                <p className="text-sm text-gray-600 dark:text-dark-300">
                  <strong>Date:</strong> {formatDate(selectedDate)}
                </p>
                <p className="text-sm text-gray-600 dark:text-dark-300">
                  <strong>Cards:</strong> {filteredCards.length}
                </p>
              </>
            )}
            
            {currentViewMode === 'collection' && currentCollection && (
              <>
                <p className="text-sm text-gray-600 dark:text-dark-300">
                  <strong>Collection:</strong> {currentCollection.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-dark-300">
                  <strong>Cards:</strong> {filteredCards.length}
                </p>
                {currentCollection.description && (
                  <p className="text-xs text-gray-500 dark:text-dark-400">
                    {currentCollection.description}
                  </p>
                )}
              </>
            )}
            
            {currentViewMode === 'search' && (
              <>
                <p className="text-sm text-gray-600 dark:text-dark-300">
                  <strong>Query:</strong> "{searchQuery}"
                </p>
                <p className="text-sm text-gray-600 dark:text-dark-300">
                  <strong>Results:</strong> {filteredCards.length}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
            <Clock size={16} className="mr-2" />
            Statistics
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {totalCards}
              </p>
              <p className="text-xs text-primary-600 dark:text-primary-400">
                Total Cards
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {todayCards}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                Today
              </p>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {recentCards}
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                This Week
              </p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {allTags.length}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                Tags
              </p>
            </div>
          </div>
        </div>

        {/* Popular Tags */}
        {popularTags.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
              <Hash size={16} className="mr-2" />
              Popular Tags
            </h3>
            
            <div className="space-y-2">
              {popularTags.slice(0, 8).map(({ tag, count }) => (
                <div key={tag} className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-dark-300">
                    <Hash size={10} className="mr-1" />
                    {tag}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-dark-400">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
            <Clock size={16} className="mr-2" />
            Recent Activity
          </h3>
          
          <div className="space-y-2">
            {cards
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .slice(0, 5)
              .map((card) => (
                <div key={card.id} className="bg-gray-50 dark:bg-dark-700 rounded-lg p-2">
                  <p className="text-sm text-gray-900 dark:text-white font-medium truncate">
                    {card.title || 'Untitled'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-dark-400">
                    {formatDate(card.updatedAt)}
                  </p>
                  {card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {card.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-1 py-0.5 rounded text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                        >
                          <Hash size={8} className="mr-0.5" />
                          {tag}
                        </span>
                      ))}
                      {card.tags.length > 2 && (
                        <span className="text-xs text-gray-500 dark:text-dark-400">
                          +{card.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
            <User size={16} className="mr-2" />
            Account
          </h3>
          
          <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.displayName || user?.email || 'Anonymous User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-dark-400">
                  {user?.email ? 'Signed in' : 'Guest session'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextPanel;