export interface Card {
  id: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  targetDate?: string; // YYYY-MM-DD format
  title?: string;
  userId: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  filters: CollectionFilter[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionFilter {
  type: 'tag' | 'content' | 'date';
  value: string;
  operator: 'includes' | 'equals' | 'before' | 'after';
}

export interface User {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
}

export interface AppState {
  user: User | null;
  cards: Card[];
  collections: Collection[];
  selectedDate: string;
  selectedCollection: string | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

export type ViewMode = 'daily' | 'collection' | 'search' | 'all';

export interface NoteEditorProps {
  card?: Card;
  onSave: (card: Partial<Card>) => void;
  onCancel: () => void;
  isOpen: boolean;
}