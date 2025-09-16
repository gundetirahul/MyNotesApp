import React, { useState } from 'react';
import { useAppStore } from '../store';
import { useFirebase } from '../hooks/useFirebase';
import { 
  Home, 
  Calendar, 
  Search, 
  Plus, 
  Hash, 
  Archive,
  Settings,
  User,
  LogOut
} from 'lucide-react';
import { format } from 'date-fns';
import { signOut } from '../services/firebase';
import CollectionModal from './CollectionModal';
import { Collection } from '../types';

const Sidebar: React.FC = () => {
  const { 
    collections, 
    selectedCollection, 
    setSelectedCollection,
    selectedDate,
    setSelectedDate,
    searchQuery,
    setSearchQuery,
    user,
    setUser
  } = useAppStore();

  const [showNewCollection, setShowNewCollection] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | undefined>();

  const { createCollection, updateCollection } = useFirebase();

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNewCollection = () => {
    setEditingCollection(undefined);
    setIsCollectionModalOpen(true);
  };

  const handleSaveCollection = async (collectionData: Partial<Collection>) => {
    try {
      if (editingCollection) {
        await updateCollection(editingCollection.id, collectionData);
      } else {
        await createCollection(collectionData as Omit<Collection, 'id' | 'userId' | 'createdAt' | 'updatedAt'>);
      }
      setIsCollectionModalOpen(false);
      setEditingCollection(undefined);
    } catch (error) {
      console.error('Failed to save collection:', error);
    }
  };

  const handleCancelCollection = () => {
    setIsCollectionModalOpen(false);
    setEditingCollection(undefined);
  };

  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="w-64 bg-dark-900 text-white flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-dark-700">
        <h1 className="text-xl font-bold text-primary-400">Cognex</h1>
        <p className="text-sm text-dark-400">Your Second Brain</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {/* Today */}
        <button
          onClick={() => {
            setSelectedDate(today);
            setSelectedCollection(null);
            setSearchQuery('');
          }}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
            selectedDate === today && !selectedCollection && !searchQuery
              ? 'bg-primary-600 text-white'
              : 'text-dark-300 hover:bg-dark-800 hover:text-white'
          }`}
        >
          <Home size={18} />
          <span>Today</span>
        </button>

        {/* Calendar */}
        <div className="space-y-1">
          <div className="flex items-center space-x-3 px-3 py-2 text-dark-400">
            <Calendar size={18} />
            <span className="text-sm font-medium">Calendar</span>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedCollection(null);
              setSearchQuery('');
            }}
            className="w-full px-3 py-1 bg-dark-800 border border-dark-700 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        {/* Search */}
        <div className="space-y-1">
          <div className="flex items-center space-x-3 px-3 py-2 text-dark-400">
            <Search size={18} />
            <span className="text-sm font-medium">Search</span>
          </div>
          <input
            type="text"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedCollection(null);
            }}
            className="w-full px-3 py-1 bg-dark-800 border border-dark-700 rounded text-white text-sm placeholder-dark-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        {/* Collections */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-3 py-2 text-dark-400">
            <div className="flex items-center space-x-3">
              <Archive size={18} />
              <span className="text-sm font-medium">Collections</span>
            </div>
            <button
              onClick={handleNewCollection}
              className="p-1 rounded hover:bg-dark-800"
            >
              <Plus size={14} />
            </button>
          </div>
          
          {/* All Notes */}
          <button
            onClick={() => {
              setSelectedCollection('all');
              setSearchQuery('');
            }}
            className={`w-full flex items-center space-x-3 px-6 py-1 rounded text-sm transition-colors ${
              selectedCollection === 'all'
                ? 'bg-primary-600 text-white'
                : 'text-dark-300 hover:bg-dark-800 hover:text-white'
            }`}
          >
            <Hash size={14} />
            <span>All Notes</span>
          </button>

          {/* Collection List */}
          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => {
                setSelectedCollection(collection.id);
                setSearchQuery('');
              }}
              className={`w-full flex items-center space-x-3 px-6 py-1 rounded text-sm transition-colors ${
                selectedCollection === collection.id
                  ? 'bg-primary-600 text-white'
                  : 'text-dark-300 hover:bg-dark-800 hover:text-white'
              }`}
            >
              <Hash size={14} />
              <span>{collection.name}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-dark-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            <div>
              <p className="text-sm font-medium">
                {user?.displayName || user?.email || 'Anonymous'}
              </p>
              <p className="text-xs text-dark-400">
                {user?.email ? 'Signed in' : 'Guest'}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 rounded hover:bg-dark-800">
              <Settings size={16} />
            </button>
            <button 
              onClick={handleSignOut}
              className="p-2 rounded hover:bg-dark-800"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Collection Modal */}
      <CollectionModal
        collection={editingCollection}
        onSave={handleSaveCollection}
        onCancel={handleCancelCollection}
        isOpen={isCollectionModalOpen}
      />
    </div>
  );
};

export default Sidebar;