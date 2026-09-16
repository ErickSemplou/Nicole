import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { BusSubStep, NicoleAppearance } from '../../types';
import { GAME_IMAGES } from '../../assets/images';
import { NicoleCharacter } from '../NicoleCharacter';
import { audio } from '../../utils/audio';

interface BusStageProps {
  onComplete: (stickerIds: string[]) => void;
  onNextStage: () => void;
  appearance?: NicoleAppearance;
}

interface WindowItem {
  id: number;
  type: string;
  name: string;
  icon: string;
  x: number;
  speed: number;
  tapped: boolean;
}

export const BusStage: React.FC<BusStageProps> = ({
  onComplete,
  onNextStage,
  appearance,
}) => {
  const [step, setStep] = useState<BusSubStep>('ticket');
  const [coinsPaid, setCoinsPaid] = useState<number>(0);
  const [itemsSpotted, setItemsSpotted] = useState<number>(0);
  const [steeringAngle, setSteeringAngle] = useState<number>(0);
  const [hornCount, setHornCount] = useState<number>(0);

  const [earnedStickers, setEarnedStickers] = useState<string[]>([]);
  const [stageFinished, setStageFinished] = useState<boolean>(false);

  // 5 rich animated window items
  const [windowItems, setWindowItems] = useState<WindowItem[]>([
    { id: 1, type: 'fire-truck', name: 'Пожежна машинка', icon: '🚒', x: 8, speed: 2, tapped: false },
    { id: 2, type: 'ice-cream', name: 'Фургончик морозива', icon: '🍦', x: 28, speed: 1.5, tapped: false },
    { id: 3, type: 'dog', name: 'Веселий песик', icon: '🐕', x: 48, speed: 1, tapped: false },
    { id: 4, type: 'balloon', name: 'Повітряна кулька', icon: '🎈', x: 68, speed: 1.2, tapped: false },
    { id: 5, type: 'tree', name: 'Зелене деревце з пташкою', icon: '🌳', x: 86, speed: 1.1, tapped: false },
  ]);

  useEffect(() => {
    if (step === 'ticket') {
      audio.speakUkrainian('Сідаємо в жовту маршрутку з мамою! Передаймо дві монетки за проїзд!', 'narrator');
    }
  }, [step]);

  // Paying coins
  const handlePayCoin = () => {
    if (coinsPaid >= 2) return;
    audio.playSparkle();
    const next = coinsPaid + 1;
    setCoinsPaid(next);
    if (next === 1) {
      audio.speakUkrainian('Одна монетка за маму!', 'mom');
    } else if (next === 2) {
      audio.speakUkrainian('І одна монетка за Ніколь! Оплата прийнята, поїхали!', 'mom');
      if (!earnedStickers.includes('ticket')) {
        setEarnedStickers(prev => [...prev, 'ticket']);
      }
    }
  };

  // Spotting items out the window
  const handleTapWindowItem = (item: WindowItem) => {
    if (item.tapped) return;
    audio.playPop(1.2);
    audio.speakUkrainian(`Ось ${item.name}!`, 'nicole');

    setWindowItems(prev =>
      prev.map(i => (i.id === item.id ? { ...i, tapped: true } : i))
    );

    const newSpotted = itemsSpotted + 1;
    setItemsSpotted(newSpotted);

    if (newSpotted >= 4 && !earnedStickers.includes('bus_window')) {
      audio.playSparkle();
      audio.speakUkrainian('Яка уважна Ніколь! Ми роздивилися все місто у віконце!', 'mom');
      setEarnedStickers(prev => [...prev, 'bus_window']);
    }
  };

  // Bus Horn & Wheel
  const handlePressHorn = () => {
    audio.playBusHorn();
    const next = hornCount + 1;
    setHornCount(next);

    if (next === 1) {
      audio.speakUkrainian('Бі-біп! Маршрутка мчить вперед!', 'nicole');
    } else if (next >= 3 && !stageFinished) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      audio.playFanfare();
      audio.speakUkrainian('Ура, зупинка «Дитячий садочок»! Дякуємо водієві, виходимо!', 'mom');
      if (!earnedStickers.includes('horn')) {
        setEarnedStickers(prev => [...prev, 'horn']);
      }
      setStageFinished(true);
      onComplete(['ticket', 'bus_window', 'horn']);
    }
  };

  const stepsList: { id: BusSubStep; label: string; icon: string }[] = [
    { id: 'ticket', label: 'Квиточки', icon: '🎟️' },
    { id: 'window', label: 'У віконце', icon: '🪟' },
    { id: 'drive', label: '«Бі-біп!»', icon: '🎺' },
  ];

  return (
    <div className="relative min-h-[calc(100vh-65px)] bg-gradient-to-b from-yellow-50 via-amber-50 to-orange-50 p-3 sm:p-6 flex flex-col items-center">
      {/* Step Pills */}
      <div className="w-full max-w-2xl flex items-center justify-between gap-1.5 sm:gap-2 mb-4 bg-white/80 p-1.5 sm:p-2 rounded-2xl shadow-sm border border-yellow-200">
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
                  ? 'bg-yellow-400 text-yellow-950 shadow-md scale-102 border-2 border-yellow-500'
                  : 'bg-transparent text-gray-600 hover:bg-yellow-100'
              }`}
            >
              <span className="text-base sm:text-lg">{s.icon}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Bus Container */}
      <div className="w-full max-w-3xl bg-white/95 rounded-3xl p-4 sm:p-6 shadow-xl border-3 border-yellow-300 flex flex-col flex-1 justify-between relative overflow-hidden">
        {/* Background scene overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src={GAME_IMAGES.bus}
            alt="Маршрутка"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Dynamic content */}
        <div className="relative z-10 flex flex-col items-center flex-1 justify-center my-2">
          {/* SUB-STEP 1: PAY FOR TICKETS */}
          {step === 'ticket' && (
            <div className="flex flex-col items-center gap-5 w-full max-w-md">
              <NicoleCharacter
                size="md"
                mood="excited"
                appearance={appearance}
                speechText={
                  coinsPaid === 0
                    ? 'Торкнися блискучих монеток, щоб оплатити проїзд!'
                    : coinsPaid === 1
                    ? 'Чудово! Ще одна монетка для мене!'
                    : 'Квиточки куплені! Нумо дивитися у віконце!'
                }
              />

              <div className="w-full bg-gradient-to-r from-amber-100 to-yellow-100 rounded-3xl p-5 border-3 border-yellow-400 shadow-inner flex flex-col items-center gap-4">
                <div className="flex items-center gap-6">
                  {/* Coin 1 */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={handlePayCoin}
                    disabled={coinsPaid >= 1}
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 flex flex-col items-center justify-center font-black transition cursor-pointer shadow-lg ${
                      coinsPaid >= 1
                        ? 'bg-emerald-400 border-emerald-500 text-white scale-95'
                        : 'bg-yellow-400 border-yellow-500 text-yellow-950 hover:bg-yellow-300 animate-bounce'
                    }`}
                  >
                    <span className="text-3xl sm:text-4xl">🪙</span>
                    <span className="text-xs mt-0.5">{coinsPaid >= 1 ? '✓ Мама' : '1 грн'}</span>
                  </motion.button>

                  {/* Coin 2 */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={handlePayCoin}
                    disabled={coinsPaid < 1 || coinsPaid >= 2}
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 flex flex-col items-center justify-center font-black transition cursor-pointer shadow-lg ${
                      coinsPaid >= 2
                        ? 'bg-emerald-400 border-emerald-500 text-white scale-95'
                        : coinsPaid === 1
                        ? 'bg-yellow-400 border-yellow-500 text-yellow-950 animate-bounce'
                        : 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-3xl sm:text-4xl">🪙</span>
                    <span className="text-xs mt-0.5">{coinsPaid >= 2 ? '✓ Ніколь' : '1 грн'}</span>
                  </motion.button>
                </div>
              </div>

              {coinsPaid >= 2 && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    audio.playSparkle();
                    setStep('window');
                    audio.speakUkrainian('Погляньмо, що цікавого їде за вікном!', 'nicole');
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:brightness-110 active:scale-95 text-amber-950 font-black text-lg rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  <span>Дивитися у віконце 🪟</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              )}
            </div>
          )}

          {/* SUB-STEP 2: WINDOW SPOTTING */}
          {step === 'window' && (
            <div className="flex flex-col items-center gap-4 w-full max-w-xl">
              <NicoleCharacter
                size="sm"
                mood="happy"
                appearance={appearance}
                speechText="Торкнися машинок, собачки та кульки за вікном!"
              />

              {/* Animated City Window */}
              <div className="relative w-full h-52 sm:h-60 rounded-3xl bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100 border-6 border-yellow-400 shadow-2xl overflow-hidden p-3 flex flex-col justify-between">
                {/* Sun and Clouds */}
                <div className="flex items-center justify-between pointer-events-none">
                  <span className="text-3xl animate-pulse">☁️</span>
                  <span className="text-4xl animate-spin">☀️</span>
                  <span className="text-3xl">☁️</span>
                </div>

                {/* Road and interactive items */}
                <div className="relative w-full h-28 bg-gray-600 rounded-2xl border-t-4 border-yellow-300 p-2 flex items-center justify-around">
                  {windowItems.map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={() => handleTapWindowItem(item)}
                      className={`text-4xl sm:text-5xl p-2 rounded-2xl cursor-pointer transition ${
                        item.tapped ? 'bg-emerald-400/60 scale-110 ring-4 ring-white' : 'hover:scale-110'
                      }`}
                      title={item.name}
                    >
                      <span>{item.icon}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {itemsSpotted >= 3 && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    audio.playSparkle();
                    setStep('drive');
                    audio.speakUkrainian('Ми майже приїхали! Посигнальмо водієві: Бі-біп!', 'nicole');
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 active:scale-95 text-white font-black text-lg rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  <span>Сигналити «Бі-біп!» 🎺</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              )}
            </div>
          )}

          {/* SUB-STEP 3: HORN & STEERING WHEEL */}
          {step === 'drive' && (
            <div className="flex flex-col items-center gap-5 w-full max-w-md">
              <NicoleCharacter
                size="md"
                mood="excited"
                appearance={appearance}
                speechText={
                  hornCount === 0
                    ? 'Тисни на кермо! Посигнальмо водієві!'
                    : hornCount < 3
                    ? `Бі-біп! Ще ${3 - hornCount} разочки, і ми на місці!`
                    : 'Ура! Ми приїхали до мого садочка!'
                }
              />

              {/* Big Interactive Steering Wheel */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9, rotate: [0, -20, 20, 0] }}
                onClick={handlePressHorn}
                className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-b from-yellow-400 via-amber-500 to-orange-500 border-8 border-yellow-200 shadow-2xl flex flex-col items-center justify-center text-center text-amber-950 active:ring-8 active:ring-yellow-300 transition-all cursor-pointer"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-yellow-300 border-4 border-yellow-600 flex flex-col items-center justify-center shadow-inner">
                  <span className="text-4xl sm:text-5xl">🎺</span>
                  <span className="text-base sm:text-lg font-black tracking-wider text-amber-950">
                    БІ-БІП!
                  </span>
                </div>
              </motion.button>

              {stageFinished && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-2"
                >
                  <button
                    onClick={() => {
                      audio.playSparkle();
                      onNextStage();
                    }}
                    className="px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 active:scale-95 text-white font-black text-lg rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer"
                  >
                    <span>Йдемо в садочок! 🎨</span>
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="relative z-10 pt-3 border-t border-yellow-200 flex items-center justify-between">
          <button
            onClick={() => {
              audio.playPop();
              setCoinsPaid(0);
              setItemsSpotted(0);
              setWindowItems(w => w.map(i => ({ ...i, tapped: false })));
              setHornCount(0);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Спробувати знову</span>
          </button>

          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="text-xs sm:text-sm font-black text-amber-900">
              Подорож у маршрутці 🚌
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
