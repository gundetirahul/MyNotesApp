import React, { useState } from 'react';
import { useAppStore } from '../store';
import { useFirebase } from '../hooks/useFirebase';
import { Plus, Calendar as CalendarIcon, Search, Archive } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import Card from './Card';
import NoteEditor from './NoteEditor';
import { Card as CardType } from '../types';

const MainContent: React.FC = () => {
  const {
    filteredCards,
    selectedDate,
    selectedCollection,
    searchQuery,
    collections,
    currentViewMode,
  } = useAppStore();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardType | undefined>();

  const { createCard, updateCard, deleteCard } = useFirebase();
  const cards = filteredCards();
  const viewMode = currentViewMode();

  const getTitle = () => {
    if (searchQuery) {
      return `Search Results (${cards.length})`;
    }
    if (selectedCollection === 'all') {
      return `All Notes (${cards.length})`;
    }
    if (selectedCollection) {
      const collection = collections.find(c => c.id === selectedCollection);
      return `${collection?.name || 'Collection'} (${cards.length})`;
    }
    
    try {
      const date = parseISO(selectedDate);
      const isToday = format(new Date(), 'yyyy-MM-dd') === selectedDate;
      return isToday ? 'Today' : format(date, 'EEEE, MMMM d, yyyy');
    } catch {
      return selectedDate;
    }
  };

  const getIcon = () => {
    if (searchQuery) return <Search size={20} />;
    if (selectedCollection) return <Archive size={20} />;
    return <CalendarIcon size={20} />;
  };

  const handleNewCard = () => {
    setEditingCard(undefined);
    setIsEditorOpen(true);
  };

  const handleEditCard = (card: CardType) => {
    setEditingCard(card);
    setIsEditorOpen(true);
  };

  const handleSaveCard = async (cardData: Partial<CardType>) => {
    try {
      if (editingCard) {
        await updateCard(editingCard.id, cardData);
      } else {
        await createCard(cardData as Omit<CardType, 'id' | 'userId' | 'createdAt' | 'updatedAt'>);
      }
      setIsEditorOpen(false);
      setEditingCard(undefined);
    } catch (error) {
      console.error('Failed to save card:', error);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      await deleteCard(cardId);
    } catch (error) {
      console.error('Failed to delete card:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditorOpen(false);
    setEditingCard(undefined);
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-50 dark:bg-dark-900">
      {/* Header */}
      <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-primary-600 dark:text-primary-400">
              {getIcon()}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {getTitle()}
              </h1>
              {searchQuery && (
                <p className="text-sm text-gray-500 dark:text-dark-400">
                  Searching for "{searchQuery}"
                </p>
              )}
            </div>
          </div>
          
          <button
            onClick={handleNewCard}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus size={16} />
            <span>New Card</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {cards.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-dark-500 mb-4">
              {getIcon()}
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No cards found' : 'No cards yet'}
            </h3>
            <p className="text-gray-500 dark:text-dark-400 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms or create a new card.'
                : 'Start by creating your first card to capture your thoughts and ideas.'
              }
            </p>
            <button
              onClick={handleNewCard}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus size={16} />
              <span>Create your first card</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                onEdit={handleEditCard}
                onDelete={handleDeleteCard}
              />
            ))}
          </div>
        )}
      </main>

      {/* Note Editor Modal */}
      <NoteEditor
        card={editingCard}
        onSave={handleSaveCard}
        onCancel={handleCancelEdit}
        isOpen={isEditorOpen}
        defaultDate={!selectedCollection && !searchQuery ? selectedDate : undefined}
      />
    </div>
  );
};

export default MainContent;