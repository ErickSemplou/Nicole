import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Download } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-full bg-pink-500 px-3 py-1.5 text-xs sm:text-sm font-black text-white shadow-sm border-2 border-pink-600 hover:bg-pink-600 active:scale-95 transition-all"
        title="Встановити гру як додаток (APK/PWA)"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Встановити</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-full bg-pink-500 px-3 py-1.5 text-xs sm:text-sm font-black text-white shadow-sm border-2 border-pink-600 hover:bg-pink-600 active:scale-95 transition-all"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Встановити</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-3xl border-4 border-pink-400 bg-white p-6 shadow-xl">
              <h3 className="text-xl font-black text-pink-600 flex items-center justify-center gap-2">
                <span>🍎</span> Встановити на iPhone / iPad
              </h3>
              <p className="mt-4 text-sm font-bold text-gray-700 space-y-2">
                <span className="block">1. Натисніть кнопку <strong>Поділитися (Share)</strong> внизу Safari.</span>
                <span className="block">2. Прокрутіть вниз та виберіть <strong>На початковий екран (Add to Home Screen)</strong>.</span>
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-2xl bg-pink-100 py-3 text-sm font-black text-pink-700 hover:bg-pink-200"
              >
                Зрозуміло!
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
