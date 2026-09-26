import { useEffect, useState } from 'react';
import { StorageService } from '../services/storage';

export function useNetwork() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [lowDataMode, setLowDataModeState] = useState<boolean>(() => {
    return StorageService.getLowDataMode();
  });
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-trigger sync simulation
      const queue = StorageService.getOfflineQueue();
      if (queue.length > 0) {
        setPendingSyncCount(queue.length);
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check of queue
    const queue = StorageService.getOfflineQueue();
    setPendingSyncCount(queue.length);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleLowDataMode = () => {
    const updated = !lowDataMode;
    setLowDataModeState(updated);
    StorageService.setLowDataMode(updated);
  };

  const triggerSync = () => {
    const queue = StorageService.getOfflineQueue();
    if (queue.length > 0) {
      // Simulate sync to server
      setTimeout(() => {
        StorageService.clearOfflineQueue();
        setPendingSyncCount(0);
      }, 800);
    }
  };

  return {
    isOnline,
    lowDataMode,
    toggleLowDataMode,
    pendingSyncCount,
    setPendingSyncCount,
    triggerSync,
  };
}
