import { useState, useEffect } from 'react';
import api from '@/services/api';

export const useOfflineMode = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingDrafts, setPendingDrafts] = useState<any[]>([]);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      await syncDrafts();
    };
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

  const syncDrafts = async () => {
    const drafts = localStorage.getItem('expense_drafts');
    if (drafts) {
      const parsedDrafts = JSON.parse(drafts);
      if (parsedDrafts.length > 0) {
        try {
          // Attempt to sync drafts
          for (const draft of parsedDrafts) {
             await api.post('/expenses/submit', draft);
          }
          // Clear after a successful sync
          clearDrafts();
          alert('Offline drafts have been successfully synced!');
        } catch (error) {
          console.error('Failed to sync offline drafts', error);
        }
      }
    }
  };

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
