import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import {
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { db, auth } from '../firebase/config';
import { Card, Collection, User } from '../types';

// Authentication
export const signInAnonymous = async (): Promise<User> => {
  const result = await signInAnonymously(auth);
  const user: User = {
    uid: result.user.uid,
    createdAt: new Date().toISOString(),
  };
  
  // Create user document if it doesn't exist
  await createUserDocument(user);
  return user;
};

export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return {
    uid: result.user.uid,
    email: result.user.email || undefined,
    displayName: result.user.displayName || undefined,
    photoURL: result.user.photoURL || undefined,
    createdAt: new Date().toISOString(),
  };
};

export const signUpWithEmail = async (email: string, password: string): Promise<User> => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const user: User = {
    uid: result.user.uid,
    email: result.user.email || undefined,
    displayName: result.user.displayName || undefined,
    photoURL: result.user.photoURL || undefined,
    createdAt: new Date().toISOString(),
  };
  
  await createUserDocument(user);
  return user;
};

export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || undefined,
        displayName: firebaseUser.displayName || undefined,
        photoURL: firebaseUser.photoURL || undefined,
        createdAt: new Date().toISOString(),
      };
      callback(user);
    } else {
      callback(null);
    }
  });
};

// User Management
const createUserDocument = async (user: User): Promise<void> => {
  const userRef = doc(db, 'users', user.uid);
  await updateDoc(userRef, {
    ...user,
    updatedAt: new Date().toISOString(),
  }).catch(async () => {
    // Document doesn't exist, create it
    await addDoc(collection(db, 'users'), {
      ...user,
      id: user.uid,
    });
  });
};

// Cards CRUD
export const getCards = async (userId: string): Promise<Card[]> => {
  const cardsRef = collection(db, 'users', userId, 'cards');
  const q = query(cardsRef, orderBy('updatedAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Card[];
};

export const createCard = async (userId: string, card: Omit<Card, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Card> => {
  const cardsRef = collection(db, 'users', userId, 'cards');
  const now = new Date().toISOString();
  
  const newCard = {
    ...card,
    userId,
    createdAt: now,
    updatedAt: now,
  };
  
  const docRef = await addDoc(cardsRef, newCard);
  
  return {
    id: docRef.id,
    ...newCard,
  };
};

export const updateCard = async (userId: string, cardId: string, updates: Partial<Card>): Promise<void> => {
  const cardRef = doc(db, 'users', userId, 'cards', cardId);
  await updateDoc(cardRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteCard = async (userId: string, cardId: string): Promise<void> => {
  const cardRef = doc(db, 'users', userId, 'cards', cardId);
  await deleteDoc(cardRef);
};

// Collections CRUD
export const getCollections = async (userId: string): Promise<Collection[]> => {
  const collectionsRef = collection(db, 'users', userId, 'collections');
  const q = query(collectionsRef, orderBy('updatedAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Collection[];
};

export const createCollection = async (userId: string, collection: Omit<Collection, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Collection> => {
  const collectionsRef = collection(db, 'users', userId, 'collections');
  const now = new Date().toISOString();
  
  const newCollection = {
    ...collection,
    userId,
    createdAt: now,
    updatedAt: now,
  };
  
  const docRef = await addDoc(collectionsRef, newCollection);
  
  return {
    id: docRef.id,
    ...newCollection,
  };
};

export const updateCollection = async (userId: string, collectionId: string, updates: Partial<Collection>): Promise<void> => {
  const collectionRef = doc(db, 'users', userId, 'collections', collectionId);
  await updateDoc(collectionRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteCollection = async (userId: string, collectionId: string): Promise<void> => {
  const collectionRef = doc(db, 'users', userId, 'collections', collectionId);
  await deleteDoc(collectionRef);
};

// Real-time listeners
export const subscribeToCards = (userId: string, callback: (cards: Card[]) => void) => {
  const cardsRef = collection(db, 'users', userId, 'cards');
  const q = query(cardsRef, orderBy('updatedAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const cards = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Card[];
    callback(cards);
  });
};

export const subscribeToCollections = (userId: string, callback: (collections: Collection[]) => void) => {
  const collectionsRef = collection(db, 'users', userId, 'collections');
  const q = query(collectionsRef, orderBy('updatedAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const collections = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Collection[];
    callback(collections);
  });
};