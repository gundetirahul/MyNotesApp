import { create } from 'zustand';
import { AppState, Card, Collection, User, ViewMode } from '../types';
import { format } from 'date-fns';

interface AppStore extends AppState {
  // Actions
  setUser: (user: User | null) => void;
  setCards: (cards: Card[]) => void;
  addCard: (card: Card) => void;
  updateCard: (cardId: string, updates: Partial<Card>) => void;
  deleteCard: (cardId: string) => void;
  setCollections: (collections: Collection[]) => void;
  addCollection: (collection: Collection) => void;
  updateCollection: (collectionId: string, updates: Partial<Collection>) => void;
  deleteCollection: (collectionId: string) => void;
  setSelectedDate: (date: string) => void;
  setSelectedCollection: (collectionId: string | null) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Computed values
  filteredCards: () => Card[];
  currentViewMode: () => ViewMode;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  user: null,
  cards: [],
  collections: [],
  selectedDate: format(new Date(), 'yyyy-MM-dd'),
  selectedCollection: null,
  searchQuery: '',
  isLoading: false,
  error: null,

  // Actions
  setUser: (user) => set({ user }),
  
  setCards: (cards) => set({ cards }),
  
  addCard: (card) => set((state) => ({ 
    cards: [...state.cards, card] 
  })),
  
  updateCard: (cardId, updates) => set((state) => ({
    cards: state.cards.map(card => 
      card.id === cardId ? { ...card, ...updates } : card
    )
  })),
  
  deleteCard: (cardId) => set((state) => ({
    cards: state.cards.filter(card => card.id !== cardId)
  })),
  
  setCollections: (collections) => set({ collections }),
  
  addCollection: (collection) => set((state) => ({ 
    collections: [...state.collections, collection] 
  })),
  
  updateCollection: (collectionId, updates) => set((state) => ({
    collections: state.collections.map(collection => 
      collection.id === collectionId ? { ...collection, ...updates } : collection
    )
  })),
  
  deleteCollection: (collectionId) => set((state) => ({
    collections: state.collections.filter(collection => collection.id !== collectionId)
  })),
  
  setSelectedDate: (date) => set({ selectedDate: date }),
  
  setSelectedCollection: (collectionId) => set({ selectedCollection: collectionId }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),

  // Computed values
  filteredCards: () => {
    const state = get();
    let filtered = [...state.cards];

    // Filter by search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(card => 
        card.content.toLowerCase().includes(query) ||
        card.title?.toLowerCase().includes(query) ||
        card.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by selected date
    if (state.selectedCollection === null && !state.searchQuery) {
      filtered = filtered.filter(card => card.targetDate === state.selectedDate);
    }

    // Filter by collection
    if (state.selectedCollection) {
      const collection = state.collections.find(c => c.id === state.selectedCollection);
      if (collection) {
        filtered = filtered.filter(card => {
          return collection.filters.every(filter => {
            switch (filter.type) {
              case 'tag':
                return filter.operator === 'includes' 
                  ? card.tags.some(tag => tag.includes(filter.value))
                  : card.tags.includes(filter.value);
              case 'content':
                return card.content.toLowerCase().includes(filter.value.toLowerCase());
              case 'date':
                if (filter.operator === 'equals') return card.targetDate === filter.value;
                if (filter.operator === 'before') return (card.targetDate || '') < filter.value;
                if (filter.operator === 'after') return (card.targetDate || '') > filter.value;
                return true;
              default:
                return true;
            }
          });
        });
      }
    }

    return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  currentViewMode: () => {
    const state = get();
    if (state.searchQuery) return 'search';
    if (state.selectedCollection) return 'collection';
    return 'daily';
  }
}));