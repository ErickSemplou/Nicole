import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, Heart, RefreshCw } from 'lucide-react';
import { GAME_IMAGES } from '../assets/images';
import { audio } from '../utils/audio';
import { NicoleAppearance, KavusiaAccessory } from '../types';
import { NicoleAvatar, DEFAULT_APPEARANCE } from './NicoleAvatar';
import { KavusiaAvatar } from './KavusiaAvatar';

interface NicoleCharacterProps {
  mood?: 'happy' | 'sleepy' | 'eating' | 'excited' | 'curious';
  speechText?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSpeechBubble?: boolean;
  appearance?: NicoleAppearance;
  kavusiaAccessory?: KavusiaAccessory;
  displayMode?: 'photo' | 'avatar' | 'duo';
  onTap?: () => void;
  className?: string;
}

export const NicoleCharacter: React.FC<NicoleCharacterProps> = ({
  mood = 'happy',
  speechText,
  size = 'md',
  showSpeechBubble = true,
  appearance = DEFAULT_APPEARANCE,
  kavusiaAccessory = 'bow',
  displayMode = 'duo',
  onTap,
  className = '',
}) => {
  const [currentDisplayMode, setCurrentDisplayMode] = useState<'photo' | 'avatar' | 'duo'>(displayMode);

  const handleCharacterTap = () => {
    audio.playPop(1.4);
    if (speechText) {
      audio.speakUkrainian(speechText, 'nicole');
    } else {
      audio.speakUkrainian('Привіт! Я Ніколь!', 'nicole');
    }
    if (onTap) onTap();
  };

  const toggleViewMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    audio.playSparkle();
    setCurrentDisplayMode((prev) => (prev === 'photo' ? 'duo' : 'photo'));
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble */}
      <AnimatePresence>
        {showSpeechBubble && speechText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-2 max-w-xs sm:max-w-md bg-white rounded-3xl p-3 sm:p-4 shadow-xl border-3 border-pink-300 relative z-20"
          >
            <div className="flex items-start gap-2.5">
              <button
                onClick={() => audio.speakUkrainian(speechText, 'nicole')}
                className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center hover:bg-pink-200 active:scale-90 transition-transform shadow-xs cursor-pointer"
                title="Послухати ще раз"
              >
                <Volume2 className="w-5 h-5 animate-pulse" />
              </button>
              <div className="flex-1">
                <div className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-pink-500 mb-0.5 flex items-center gap-1">
                  <span>Ніколь каже:</span>
                  <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
                </div>
                <p className="text-sm sm:text-base font-bold text-gray-800 leading-snug">
                  {speechText}
                </p>
              </div>
            </div>
            {/* Speech bubble arrow */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-pink-300"></div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-7 border-x-transparent border-t-7 border-t-white"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Visual Character Stage */}
      {currentDisplayMode === 'photo' ? (
        /* Photo Mode */
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={
            mood === 'sleepy'
              ? { y: [0, 4, 0], rotate: [0, 2, -2, 0] }
              : mood === 'excited'
              ? { y: [0, -8, 0], rotate: [-2, 2, -2] }
              : { y: [0, -4, 0] }
          }
          transition={{
            repeat: Infinity,
            duration: mood === 'excited' ? 1.4 : 2.5,
            ease: 'easeInOut',
          }}
          onClick={handleCharacterTap}
          className="relative cursor-pointer rounded-full p-1 sm:p-1.5 bg-gradient-to-tr from-pink-400 via-rose-300 to-amber-200 shadow-xl border-4 border-white flex items-center justify-center w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56"
        >
          <img
            src={GAME_IMAGES.nicole}
            alt="Ніколь 4 рочки"
            className="w-full h-full object-cover rounded-full pointer-events-none"
            referrerPolicy="no-referrer"
          />

          {/* Floating reaction icon */}
          <div className="absolute -bottom-1 -right-1 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-pink-300 text-base z-10">
            {mood === 'sleepy' && '💤'}
            {mood === 'eating' && '🍓'}
            {mood === 'excited' && '⭐'}
            {mood === 'curious' && '🎀'}
            {mood === 'happy' && '🌸'}
          </div>

          {/* View mode toggle button */}
          <button
            onClick={toggleViewMode}
            className="absolute -bottom-2 -left-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl p-1.5 shadow-md border-2 border-white flex items-center gap-1 text-[10px] font-black z-20 cursor-pointer"
            title="Перемкнути на вбрання з Кавусею"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Вбрання</span>
          </button>
        </motion.div>
      ) : (
        /* Duo / Full Avatar Mode (Nicole in her real chosen outfit & shoes + Kavusia) */
        <div className="relative flex items-end justify-center gap-2 cursor-pointer" onClick={handleCharacterTap}>
          {/* Nicole Full Body Avatar */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            animate={
              mood === 'excited'
                ? { y: [0, -6, 0] }
                : { y: [0, -3, 0] }
            }
            transition={{
              repeat: Infinity,
              duration: 2.2,
              ease: 'easeInOut',
            }}
            className="w-32 h-48 sm:w-40 sm:h-60 md:w-48 md:h-68 relative flex items-center justify-center bg-white/60 backdrop-blur-xs rounded-3xl p-1 shadow-xl border-3 border-pink-300"
          >
            <NicoleAvatar
              appearance={appearance}
              mode="full"
              className="w-full h-full object-contain"
            />

            {/* View mode toggle button */}
            <button
              onClick={toggleViewMode}
              className="absolute -top-2 -left-2 bg-gradient-to-r from-amber-400 to-rose-400 text-white rounded-2xl px-2 py-1 shadow-md border-2 border-white flex items-center gap-1 text-[10px] font-black z-20 cursor-pointer"
              title="Показати фото Ніколь"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Фото 📸</span>
            </button>
          </motion.div>

          {/* Kavusia Pet Companion */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, delay: 0.3 }}
            onClick={(e) => {
              e.stopPropagation();
              audio.playGuineaPigSqueak();
              audio.speakUkrainian('Ві-ві-ві! Кавуся рада бути поруч із Ніколь!', 'nicole');
            }}
            className="w-20 h-24 sm:w-24 sm:h-28 md:w-28 md:h-32 bg-amber-100/90 rounded-3xl p-1 shadow-lg border-2 border-amber-300 flex flex-col items-center justify-center cursor-pointer"
            title="Морська свинка Кавуся"
          >
            <KavusiaAvatar
              mood="happy"
              accessory={kavusiaAccessory}
              className="w-full h-full object-contain"
            />
            <span className="text-[9px] font-black text-amber-950 bg-white/80 px-1.5 py-0.5 rounded-full shadow-xs">
              Кавуся 🐹
            </span>
          </motion.div>
        </div>
      )}
    </div>
  );
};
