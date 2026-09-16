import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, RotateCcw, Shirt } from 'lucide-react';
import { ParkSubStep, NicoleAppearance } from '../../types';
import { GAME_IMAGES } from '../../assets/images';
import { NicoleCharacter } from '../NicoleCharacter';
import { audio } from '../../utils/audio';

interface ParkStageProps {
  onComplete: (stickerIds: string[]) => void;
  onNextStage: () => void;
  appearance?: NicoleAppearance;
  onOpenWardrobe?: () => void;
}

interface TreasureItem {
  id: string;
  name: string;
  emoji: string;
  dug: boolean;
  xPercent: number;
  yPercent: number;
}

export const ParkStage: React.FC<ParkStageProps> = ({
  onComplete,
  onNextStage,
  appearance,
  onOpenWardrobe,
}) => {
  const [step, setStep] = useState<ParkSubStep>('scooter');

  // Scooter Ride State
  const [scooterX, setScooterX] = useState<number>(50); // percentage 10-90
  const [starsCollected, setStarsCollected] = useState<number>(0);
  const [activeItems, setActiveItems] = useState<{ id: number; x: number; collected: boolean }[]>([
    { id: 1, x: 25, collected: false },
    { id: 2, x: 50, collected: false },
    { id: 3, x: 75, collected: false },
    { id: 4, x: 35, collected: false },
    { id: 5, x: 65, collected: false },
  ]);

  // Swings State
  const [swingHeight, setSwingHeight] = useState<number>(0); // 0 to 4

  // Sandbox Treasures State
  const [treasures, setTreasures] = useState<TreasureItem[]>([
    { id: 't1', name: 'Перлинна мушля', emoji: '🐚', dug: false, xPercent: 20, yPercent: 30 },
    { id: 't2', name: 'Рожевий діамант', emoji: '💎', dug: false, xPercent: 50, yPercent: 25 },
    { id: 't3', name: 'Золота зірочка', emoji: '⭐', dug: false, xPercent: 80, yPercent: 35 },
    { id: 't4', name: 'Іграшковий динозаврик', emoji: '🦕', dug: false, xPercent: 35, yPercent: 70 },
    { id: 't5', name: 'Золотий ключик', emoji: '🗝️', dug: false, xPercent: 70, yPercent: 70 },
  ]);

  // Sandcastle Decorating State
  const [castleParts, setCastleParts] = useState<string[]>([]);

  const [earnedStickers, setEarnedStickers] = useState<string[]>([]);
  const [stageFinished, setStageFinished] = useState<boolean>(false);

  useEffect(() => {
    if (step === 'scooter') {
      audio.speakUkrainian('Ура, ми в парку! Час покататися на моєму рожевому самокаті!', 'nicole');
    }
  }, [step]);

  // Move scooter left/right
  const handleMoveScooter = (direction: 'left' | 'right') => {
    audio.playScooterBell();
    setScooterX(prev => {
      const next = direction === 'left' ? Math.max(15, prev - 15) : Math.min(85, prev + 15);
      setActiveItems(items =>
        items.map(item => {
          if (!item.collected && Math.abs(item.x - next) < 16) {
            audio.playSparkle();
            audio.speakUkrainian('Зірочка!', 'nicole');
            setStarsCollected(c => {
              const count = c + 1;
              if (count >= 5 && !earnedStickers.includes('scooter')) {
                confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
                audio.playFanfare();
                audio.speakUkrainian('Як швидко ми промчали алеєю парку на самокаті!', 'nicole');
                setEarnedStickers(s => [...s, 'scooter']);
              }
              return count;
            });
            return { ...item, collected: true };
          }
          return item;
        })
      );
      return next;
    });
  };

  // Push the swing
  const handlePushSwing = () => {
    audio.playWhoosh();
    setSwingHeight(prev => {
      const next = Math.min(4, prev + 1);
      if (next === 1) audio.speakUkrainian('Вжух! Летимо!', 'nicole');
      if (next === 2) audio.speakUkrainian('Вище, ще вище!', 'nicole');
      if (next === 3) audio.speakUkrainian('Як високо! Я бачу верхівки дерев!', 'nicole');
      if (next >= 4 && !earnedStickers.includes('swing')) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        audio.playSparkle();
        audio.speakUkrainian('Ура, гойдалки — це найкраще! А тепер пошукаймо скарби в пісочниці!', 'nicole');
        setEarnedStickers(s => [...s, 'swing']);
      }
      return next;
    });
  };

  // Dig in sand
  const handleDigSand = (item: TreasureItem) => {
    if (item.dug) return;
    audio.playDig();
    audio.playSparkle();
    audio.speakUkrainian(`Знайшла! Це ${item.name}!`, 'nicole');

    setTreasures(prev =>
      prev.map(t => (t.id === item.id ? { ...t, dug: true } : t))
    );

    const dugCount = treasures.filter(t => t.dug).length + 1;
    if (dugCount === treasures.length && !earnedStickers.includes('treasure')) {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
      audio.playFanfare();
      audio.speakUkrainian('Ура! Ми знайшли всі чарівні скарби в пісочниці!', 'nicole');
      setEarnedStickers(s => [...s, 'treasure']);
    }
  };

  // Build sandcastle
  const handleAddCastlePart = (icon: string, name: string) => {
    audio.playSparkle();
    audio.playPop(1.4);
    const next = [...castleParts, icon];
    setCastleParts(next);
    audio.speakUkrainian(`Поставили ${name}!`, 'nicole');

    if (next.length >= 3 && !stageFinished) {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      audio.playFanfare();
      audio.speakUkrainian('Який казковий піщаний замок ми збудували! А тепер ходімо на пончик з какао!', 'nicole');
      setStageFinished(true);
      onComplete(['scooter', 'swing', 'treasure']);
    }
  };

  const stepsList: { id: ParkSubStep; label: string; icon: string }[] = [
    { id: 'scooter', label: 'Самокат', icon: '🛴' },
    { id: 'swing', label: 'Гойдалки', icon: '🎪' },
    { id: 'sandbox', label: 'Скарби', icon: '🏖️' },
    { id: 'sandcastle', label: 'Замок', icon: '🏰' },
  ];

  return (
    <div className="relative min-h-[calc(100vh-65px)] bg-gradient-to-b from-emerald-50 via-teal-50 to-amber-50 p-3 sm:p-6 flex flex-col items-center">
      {/* Steps Selector */}
      <div className="w-full max-w-2xl flex items-center justify-between gap-1.5 sm:gap-2 mb-4 bg-white/80 p-1.5 sm:p-2 rounded-2xl shadow-sm border border-emerald-200">
        {stepsList.map((s) => {
          const isActive = step === s.id;
          return (
            <button
              key={s.id}
              onClick={() => {
                audio.playPop();
                setStep(s.id);
              }}
              className={`flex-1 py-2 sm:py-2.5 px-2 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1 transition cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-sm scale-102 border-2 border-emerald-600'
                  : 'bg-transparent text-gray-600 hover:bg-emerald-50'
              }`}
            >
              <span className="text-base sm:text-lg">{s.icon}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Container */}
      <div className="w-full max-w-3xl bg-white/95 rounded-3xl p-4 sm:p-6 shadow-xl border-3 border-emerald-300 flex flex-col flex-1 justify-between relative overflow-hidden">
        {/* Background Park art */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src={GAME_IMAGES.park}
            alt="Парк"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Dynamic Step Content */}
        <div className="relative z-10 flex flex-col items-center flex-1 justify-center my-2">
          {/* STEP 1: SCOOTER */}
          {step === 'scooter' && (
            <div className="flex flex-col items-center gap-4 w-full max-w-lg">
              <NicoleCharacter
                size="sm"
                mood="excited"
                appearance={appearance}
                speechText="Керуй самокатом стрілочками вліво та вправо, щоб зібрати всі зірочки!"
              />

              {/* Scooter Track */}
              <div className="relative w-full h-44 sm:h-52 bg-gradient-to-b from-sky-200 via-emerald-100 to-emerald-200 rounded-3xl border-4 border-emerald-400 shadow-inner overflow-hidden flex flex-col justify-between p-3">
                <div className="w-full flex justify-between pointer-events-none text-2xl">
                  <span>🌸</span>
                  <span>🦋</span>
                  <span>🌼</span>
                  <span>🌷</span>
                </div>

                {/* Stars along track */}
                <div className="relative w-full h-12">
                  {activeItems.map((item) => (
                    <div
                      key={item.id}
                      style={{ left: `${item.x}%` }}
                      className={`absolute -translate-x-1/2 text-3xl transition-transform ${
                        item.collected ? 'scale-0 opacity-0' : 'animate-bounce'
                      }`}
                    >
                      ⭐
                    </div>
                  ))}
                </div>

                {/* Road and Nicole on Scooter */}
                <div className="relative w-full h-14 bg-gray-600 rounded-2xl border-t-4 border-yellow-300">
                  <motion.div
                    animate={{ left: `${scooterX}%` }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="absolute -top-7 -translate-x-1/2 flex flex-col items-center"
                  >
                    <span className="text-4xl sm:text-5xl">🛴</span>
                  </motion.div>
                </div>
              </div>

              {/* Left/Right Big Touch Buttons */}
              <div className="flex items-center gap-6">
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => handleMoveScooter('left')}
                  className="w-20 h-20 rounded-full bg-emerald-500 hover:bg-emerald-600 active:scale-90 text-white font-black text-3xl shadow-lg border-4 border-emerald-300 flex items-center justify-center cursor-pointer"
                >
                  ⬅️
                </motion.button>
                <div className="text-center font-black text-emerald-900 text-sm">
                  Зібрано: {starsCollected}/5 ⭐
                </div>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => handleMoveScooter('right')}
                  className="w-20 h-20 rounded-full bg-emerald-500 hover:bg-emerald-600 active:scale-90 text-white font-black text-3xl shadow-lg border-4 border-emerald-300 flex items-center justify-center cursor-pointer"
                >
                  ➡️
                </motion.button>
              </div>

              {starsCollected >= 5 && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    audio.playSparkle();
                    setStep('swing');
                    audio.speakUkrainian('Час літати високо на гойдалках!', 'nicole');
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-110 active:scale-95 text-white font-black text-lg rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  <span>Йдемо на гойдалки 🎪</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              )}
            </div>
          )}

          {/* STEP 2: SWING */}
          {step === 'swing' && (
            <div className="flex flex-col items-center gap-4 w-full max-w-lg">
              <NicoleCharacter
                size="sm"
                mood="excited"
                appearance={appearance}
                speechText="Тисни велику кнопку «Розгойдати», щоб злетіти до неба!"
              />

              {/* Playground Swing View */}
              <div className="relative w-full h-56 bg-gradient-to-b from-sky-300 via-sky-100 to-emerald-100 rounded-3xl border-4 border-sky-400 shadow-inner flex flex-col items-center justify-between p-3 overflow-hidden">
                <div className="w-full flex justify-between text-3xl pointer-events-none">
                  <span>☁️</span>
                  <span>☀️</span>
                  <span>🦋</span>
                </div>

                {/* Animated Swing Rig */}
                <motion.div
                  animate={{
                    rotate: swingHeight === 0 ? 0 : swingHeight === 1 ? [-10, 10, -10] : swingHeight === 2 ? [-20, 20, -20] : [-35, 35, -35],
                    y: swingHeight * -8,
                  }}
                  transition={{ repeat: Infinity, duration: 2 - swingHeight * 0.25, ease: 'easeInOut' }}
                  className="flex flex-col items-center origin-top"
                >
                  <div className="w-1 h-20 bg-amber-700"></div>
                  <div className="px-6 py-2 bg-amber-600 rounded-lg text-4xl shadow-md">
                    🎪
                  </div>
                </motion.div>

                <div className="w-48 h-3 bg-emerald-500 rounded-full"></div>
              </div>

              {/* Swing Push Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePushSwing}
                className="px-8 py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-black text-lg rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer"
              >
                <span>Розгойдати гойдалку! 🦋</span>
              </motion.button>

              {swingHeight >= 4 && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    audio.playSparkle();
                    setStep('sandbox');
                    audio.speakUkrainian('Шукаймо заховані скарби у пісочниці!', 'nicole');
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 active:scale-95 text-white font-black text-lg rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  <span>Шукати скарби 🏖️</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              )}
            </div>
          )}

          {/* STEP 3: SANDBOX */}
          {step === 'sandbox' && (
            <div className="flex flex-col items-center gap-4 w-full max-w-lg">
              <NicoleCharacter
                size="sm"
                mood="excited"
                appearance={appearance}
                speechText="Торкайся пісочку, щоб знайти всі 5 захованих скарбів!"
              />

              {/* Sandbox Pit */}
              <div className="relative w-full h-56 bg-amber-200 rounded-3xl border-8 border-amber-400 shadow-2xl overflow-hidden p-4">
                {treasures.map((item) => (
                  <motion.button
                    key={item.id}
                    style={{ left: `${item.xPercent}%`, top: `${item.yPercent}%` }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleDigSand(item)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {item.dug ? (
                      <span className="text-4xl animate-bounce drop-shadow-md">
                        {item.emoji}
                      </span>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-amber-300 border-2 border-amber-500 flex items-center justify-center text-xl shadow-inner animate-pulse">
                        ⏳
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>

              {treasures.every(t => t.dug) && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    audio.playSparkle();
                    setStep('sandcastle');
                    audio.speakUkrainian('Скарби знайдені! А тепер збудуємо чарівний піщаний замок!', 'nicole');
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 active:scale-95 text-white font-black text-lg rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  <span>Будувати замок 🏰</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              )}
            </div>
          )}

          {/* STEP 4: SANDCASTLE */}
          {step === 'sandcastle' && (
            <div className="flex flex-col items-center gap-4 w-full max-w-lg">
              <NicoleCharacter
                size="sm"
                mood="excited"
                appearance={appearance}
                speechText="Прикрашай піщаний замок баштами, прапорцями та мушлями!"
              />

              {/* Sandcastle Display */}
              <div className="w-full h-48 sm:h-56 bg-gradient-to-b from-sky-100 to-amber-200 rounded-3xl border-4 border-amber-400 shadow-inner flex flex-col items-center justify-end p-4 relative overflow-hidden">
                <div className="text-6xl sm:text-7xl mb-1">🏰</div>

                {/* Dynamic decorated parts */}
                <div className="flex items-center gap-3 z-10">
                  {castleParts.map((p, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-3xl"
                    >
                      {p}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Decoration Buttons */}
              <div className="grid grid-cols-3 gap-3 w-full">
                {[
                  { icon: '🚩', name: 'Прапорець' },
                  { icon: '🐚', name: 'Мушля' },
                  { icon: '⭐', name: 'Зірочка' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAddCastlePart(item.icon, item.name)}
                    className="p-3 bg-white hover:bg-amber-50 rounded-2xl border-2 border-amber-300 flex flex-col items-center font-black text-xs cursor-pointer shadow-sm"
                  >
                    <span className="text-3xl mb-0.5">{item.icon}</span>
                    <span>+ {item.name}</span>
                  </button>
                ))}
              </div>

              {stageFinished && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    audio.playSparkle();
                    onNextStage();
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-lg rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer mt-2"
                >
                  <span>Йдемо на пончик з какао! 🍩☕</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-3 border-t border-emerald-200 flex items-center justify-between">
          <button
            onClick={() => {
              audio.playPop();
              setStarsCollected(0);
              setActiveItems(items => items.map(i => ({ ...i, collected: false })));
              setSwingHeight(0);
              setTreasures(t => t.map(x => ({ ...x, dug: false })));
              setCastleParts([]);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Спробувати знову</span>
          </button>

          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-emerald-500 fill-emerald-400" />
            <span className="text-xs sm:text-sm font-black text-emerald-900">
              Парк пригод 🛴
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
