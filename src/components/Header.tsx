import React, { useState } from 'react';
import { Home, Music, Volume2, VolumeX, Sparkles, BookOpen, Maximize2, Minimize2, ShoppingBag, Puzzle } from 'lucide-react';
import { audio } from '../utils/audio';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentStageName?: string;
  onGoHome: () => void;
  starsCount: number;
  onOpenStickerBook: () => void;
  onOpenWardrobe: () => void;
  onOpenKavusia?: () => void;
  onOpenDrawing?: () => void;
  onOpenShop?: () => void;
  onOpenPuzzles?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStageName,
  onGoHome,
  starsCount,
  onOpenStickerBook,
  onOpenWardrobe,
  onOpenKavusia,
  onOpenDrawing,
  onOpenShop,
  onOpenPuzzles,
}) => {
  const [musicOn, setMusicOn] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleMusic = () => {
    const state = audio.toggleMusic();
    setMusicOn(state);
    audio.playPop();
  };

  const handleToggleSound = () => {
    const state = audio.toggleSound();
    setSoundOn(state);
    if (state) audio.playPop();
  };

  const toggleFullscreen = () => {
    audio.playPop();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-2.5 sm:px-4 md:px-6 py-2 sm:py-2.5 shadow-sm border-b-2 border-pink-100 flex items-center justify-between gap-1.5 sm:gap-2 max-w-full overflow-hidden">
      {/* Left: Home Button & Stage title */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
        {currentStageName && (
          <button
            onClick={() => {
              audio.playPop();
              onGoHome();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3.5 sm:py-2 bg-amber-400 hover:bg-amber-500 active:scale-95 text-amber-950 font-black rounded-xl sm:rounded-2xl shadow-md border-2 border-amber-200 transition-transform cursor-pointer shrink-0"
            title="Повернутися на карту дня"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline text-xs sm:text-sm">Карта</span>
          </button>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white font-black text-base sm:text-lg shadow-md shrink-0">
            Н
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-black text-pink-700 leading-tight truncate">
              День Ніколь
            </h1>
            <p className="text-[10px] sm:text-xs font-bold text-gray-500 truncate max-w-[100px] xs:max-w-[140px] sm:max-w-xs">
              {currentStageName || 'Пригоди маленької Ніколь'}
            </p>
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {/* PWA offline install */}
        <div className="flex">
          <PWAInstallButton />
        </div>

        {/* Star Shop button (hidden on very small mobile to save space) */}
        {onOpenShop && (
          <button
            onClick={() => {
              audio.playSparkle();
              onOpenShop();
            }}
            className="hidden sm:flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 bg-gradient-to-r from-amber-400 to-pink-500 hover:brightness-110 active:scale-95 text-white font-black rounded-xl sm:rounded-2xl shadow-xs border border-amber-200 transition cursor-pointer"
            title="Крамничка за зірочки 🛍️"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-200" />
            <span className="hidden md:inline text-xs font-black">Крамниця</span>
          </button>
        )}

        {/* Mini Puzzles button */}
        {onOpenPuzzles && (
          <button
            onClick={() => {
              audio.playSparkle();
              onOpenPuzzles();
            }}
            className="hidden sm:flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:brightness-110 active:scale-95 text-white font-black rounded-xl sm:rounded-2xl shadow-xs border border-indigo-200 transition cursor-pointer"
            title="Міні-пазли 🧩"
          >
            <Puzzle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-100" />
            <span className="hidden md:inline text-xs font-black">Пазли</span>
          </button>
        )}

        {/* Wardrobe button */}
        <button
          onClick={() => {
            audio.playSparkle();
            onOpenWardrobe();
          }}
          className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 bg-gradient-to-r from-pink-400 to-rose-400 hover:brightness-110 active:scale-95 text-white font-black rounded-xl sm:rounded-2xl shadow-xs border border-pink-200 transition cursor-pointer"
          title="Вбиральня Ніколь: змінити одяг та зачіску"
        >
          <span className="text-sm sm:text-base leading-none">👗</span>
          <span className="hidden md:inline text-xs font-black">Вбрання</span>
        </button>

        {/* Stickers / Stars button */}
        <button
          onClick={() => {
            audio.playSparkle();
            onOpenStickerBook();
          }}
          className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-1.5 bg-gradient-to-r from-amber-300 to-yellow-400 hover:brightness-105 active:scale-95 text-amber-950 font-black rounded-xl sm:rounded-2xl shadow-xs border border-yellow-200 transition cursor-pointer"
          title="Альбом наліпок та зірочок"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-700 fill-amber-500 shrink-0" />
          <span className="text-xs sm:text-sm font-black">{starsCount}</span>
        </button>

        {/* Music button */}
        <button
          onClick={handleToggleMusic}
          className={`p-1.5 sm:p-2 rounded-xl font-bold transition shadow-xs border active:scale-95 ${
            musicOn
              ? 'bg-rose-100 text-rose-600 border-rose-300'
              : 'bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-200'
          }`}
          title={musicOn ? 'Вимкнути музику' : 'Увімкнути музику'}
        >
          <Music className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${musicOn ? 'animate-bounce' : ''}`} />
        </button>

        {/* Sound SFX button */}
        <button
          onClick={handleToggleSound}
          className={`p-1.5 sm:p-2 rounded-xl font-bold transition shadow-xs border active:scale-95 ${
            soundOn
              ? 'bg-sky-100 text-sky-600 border-sky-300'
              : 'bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-200'
          }`}
          title={soundOn ? 'Вимкнути звуки' : 'Увімкнути звуки'}
        >
          {soundOn ? (
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          )}
        </button>

        {/* Fullscreen button (large screens only) */}
        <button
          onClick={toggleFullscreen}
          className="hidden lg:flex p-1.5 sm:p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 hover:bg-purple-100 active:scale-95 shadow-xs transition"
          title="На весь екран"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};

