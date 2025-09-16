import { useEffect } from 'react';
import { useAppStore } from '../store';
import {
  createCard as firebaseCreateCard,
  updateCard as firebaseUpdateCard,
  deleteCard as firebaseDeleteCard,
  createCollection as firebaseCreateCollection,
  updateCollection as firebaseUpdateCollection,
  deleteCollection as firebaseDeleteCollection,
  subscribeToCards,
  subscribeToCollections,
} from '../services/firebase';
import { Card, Collection } from '../types';

export const useFirebase = () => {
  const {
    user,
    setCards,
    setCollections,
    setError,
    addCard,
    updateCard,
    deleteCard,
    addCollection,
    updateCollection,
    deleteCollection,
  } = useAppStore();

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) return;

    const unsubscribeCards = subscribeToCards(user.uid, (cards) => {
      setCards(cards);
    });

    const unsubscribeCollections = subscribeToCollections(user.uid, (collections) => {
      setCollections(collections);
    });

    return () => {
      unsubscribeCards();
      unsubscribeCollections();
    };
  }, [user, setCards, setCollections]);

  // Card operations
  const createCard = async (cardData: Omit<Card, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      const newCard = await firebaseCreateCard(user.uid, cardData);
      // The real-time listener will update the store
    } catch (error: any) {
      setError(error.message || 'Failed to create card');
      throw error;
    }
  };

  const updateCardData = async (cardId: string, updates: Partial<Card>) => {
    if (!user) return;

    try {
      await firebaseUpdateCard(user.uid, cardId, updates);
      // The real-time listener will update the store
    } catch (error: any) {
      setError(error.message || 'Failed to update card');
      throw error;
    }
  };

  const deleteCardData = async (cardId: string) => {
    if (!user) return;

    try {
      await firebaseDeleteCard(user.uid, cardId);
      // The real-time listener will update the store
    } catch (error: any) {
      setError(error.message || 'Failed to delete card');
      throw error;
    }
  };

  // Collection operations
  const createCollection = async (collectionData: Omit<Collection, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      const newCollection = await firebaseCreateCollection(user.uid, collectionData);
      // The real-time listener will update the store
      return newCollection;
    } catch (error: any) {
      setError(error.message || 'Failed to create collection');
      throw error;
    }
  };

  const updateCollectionData = async (collectionId: string, updates: Partial<Collection>) => {
    if (!user) return;

    try {
      await firebaseUpdateCollection(user.uid, collectionId, updates);
      // The real-time listener will update the store
    } catch (error: any) {
      setError(error.message || 'Failed to update collection');
      throw error;
    }
  };

  const deleteCollectionData = async (collectionId: string) => {
    if (!user) return;

    try {
      await firebaseDeleteCollection(user.uid, collectionId);
      // The real-time listener will update the store
    } catch (error: any) {
      setError(error.message || 'Failed to delete collection');
      throw error;
    }
  };

  return {
    createCard,
    updateCard: updateCardData,
    deleteCard: deleteCardData,
    createCollection,
    updateCollection: updateCollectionData,
    deleteCollection: deleteCollectionData,
  };
};