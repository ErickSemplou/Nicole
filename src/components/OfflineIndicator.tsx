import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from './useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-emerald-600/95 text-white px-4 py-1.5 text-xs sm:text-sm font-bold shadow-lg border border-emerald-300">
      <WifiOff className="w-4 h-4 text-emerald-200" />
      <span>Офлайн режим активний — гра повністю працює без інтернету! 🎈</span>
    </div>
  );
};
