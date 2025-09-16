import React, { useEffect } from 'react';
import { useAppStore } from './store';
import { onAuthStateChange } from './services/firebase';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import ContextPanel from './components/ContextPanel';
import Auth from './components/Auth';

function App() {
  const { user, setUser, isLoading, setLoading } = useAppStore();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [setUser, setLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-dark-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-900">
      <Sidebar />
      <MainContent />
      <ContextPanel />
    </div>
  );
}

export default App;
