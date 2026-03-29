import { useState, useEffect } from 'react';

export const useOfflineMode = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingDrafts, setPendingDrafts] = useState<any[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const drafts = localStorage.getItem('expense_drafts');
    if (drafts) {
      setPendingDrafts(JSON.parse(drafts));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveDraft = (data: any) => {
    const updatedDrafts = [...pendingDrafts, { ...data, id: Date.now(), createdAt: new Date().toISOString() }];
    setPendingDrafts(updatedDrafts);
    localStorage.setItem('expense_drafts', JSON.stringify(updatedDrafts));
    return updatedDrafts;
  };

  const clearDrafts = () => {
    setPendingDrafts([]);
    localStorage.removeItem('expense_drafts');
  };

  return { isOnline, pendingDrafts, saveDraft, clearDrafts };
};
