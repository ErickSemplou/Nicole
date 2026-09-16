import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Sun, Check, ArrowRight, RotateCcw, Volume2, Shirt } from 'lucide-react';
import { MorningSubStep, NicoleAppearance } from '../../types';
import { GAME_IMAGES } from '../../assets/images';
import { NicoleCharacter } from '../NicoleCharacter';
import { audio } from '../../utils/audio';

interface MorningStageProps {
  onComplete: (stickerIds: string[]) => void;
  onNextStage: () => void;
  appearance?: NicoleAppearance;
  onOpenWardrobe?: () => void;
}

export const MorningStage: React.FC<MorningStageProps> = ({
  onComplete,
  onNextStage,
  appearance,
  onOpenWardrobe,
}) => {
  const [step, setStep] = useState<MorningSubStep>('wake');
  const [isAwake, setIsAwake] = useState(false);
  const [curtainsOpen, setCurtainsOpen] = useState(false);

  // Face wash state
  const [soapedFace, setSoapedFace] = useState(false);
  const [rinsedFace, setRinsedFace] = useState(false);
  const [driedFace, setDriedFace] = useState(false);

  // Teeth brushing state (4 zones)
  const [teethCleaned, setTeethCleaned] = useState<number[]>([0, 0, 0, 0]);

  // Breakfast state
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [pancakeBites, setPancakeBites] = useState<number>(0);

  // Backpack packing
  const [packedItems, setPackedItems] = useState<string[]>([]);

  // Dress items
  const [dressedItems, setDressedItems] = useState<string[]>([]);

  const [earnedStickers, setEarnedStickers] = useState<string[]>([]);
  const [stageFinished, setStageFinished] = useState(false);

  useEffect(() => {
    if (step === 'wake') {
      audio.speakUkrainian('Доброго ранку, сонечко! Відкрий шторки та розбуди Ніколь!', 'narrator');
    }
  }, [step]);

  const handleOpenCurtains = () => {
    audio.playSparkle();
    setCurtainsOpen(true);
    setIsAwake(true);
    audio.speakUkrainian('Доброго ранку! Які яскраві промінчики сонця!', 'nicole');
    if (!earnedStickers.includes('sun')) {
      setEarnedStickers(prev => [...prev, 'sun']);
    }
  };

  // Face washing
  const handleSoap = () => {
    audio.playPop(1.4);
    setSoapedFace(true);
    audio.speakUkrainian('Мильна пінка на щічках та носику!', 'nicole');
  };

  const handleRinse = () => {
    if (!soapedFace) return;
    audio.playWaterSplash();
    setRinsedFace(true);
    audio.speakUkrainian('Змиваємо теплою чистою водичкою!', 'mom');
  };

  const handleDry = () => {
    if (!rinsedFace) return;
    audio.playSparkle();
    setDriedFace(true);
    audio.speakUkrainian('Витерлися мʼякеньким пухнастим рушничком! Чиста краса!', 'nicole');
  };

  // Teeth brushing
  const handleBrushTooth = (index: number) => {
    audio.playBrush();
    setTeethCleaned(prev => {
      const next = [...prev];
      next[index] = Math.min(3, next[index] + 1);
      const allClean = next.every(val => val >= 2);
      if (allClean && !earnedStickers.includes('brush')) {
        audio.playSparkle();
        audio.speakUkrainian('Ура! Зубки блищать чистотою!', 'nicole');
        setEarnedStickers(s => [...s, 'brush']);
      }
      return next;
    });
  };

  // Breakfast feeding
  const handleBitePancake = () => {
    if (pancakeBites >= 3) return;
    audio.playYum();
    const next = pancakeBites + 1;
    setPancakeBites(next);
    if (next === 1) audio.speakUkrainian('Ням-ням! Які солодкі теплі панкейки!', 'nicole');
    if (next === 2) audio.speakUkrainian('Дуже смачно з ягідками!', 'nicole');
    if (next >= 3 && !earnedStickers.includes('pancakes')) {
      audio.playSparkle();
      audio.speakUkrainian('Який ситний сніданок! Тепер у мене багато сил!', 'nicole');
      setEarnedStickers(s => [...s, 'pancakes']);
    }
  };

  // Packing backpack
  const handlePackItem = (id: string, name: string) => {
    if (packedItems.includes(id)) return;
    audio.playSparkle();
    const next = [...packedItems, id];
    setPackedItems(next);
    audio.speakUkrainian(`Поклали ${name} у рюкзачок!`, 'nicole');
  };

  // Dressing up
  const handleToggleDress = (itemId: string, itemName: string) => {
    audio.playPop();
    setDressedItems(prev => {
      const isSelected = prev.includes(itemId);
      const next = isSelected ? prev.filter(i => i !== itemId) : [...prev, itemId];
      if (!isSelected) {
        audio.speakUkrainian(`Одягаємо ${itemName}!`, 'nicole');
      }
      if (next.length >= 4 && !stageFinished) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        audio.playFanfare();
        audio.speakUkrainian('Ура! Я готова вирушати в садочок!', 'nicole');
        setEarnedStickers(s => [...s, 'dress']);
        setStageFinished(true);
        onComplete(['sun', 'brush', 'pancakes', 'dress']);
      }
      return next;
    });
  };

  const stepsList: { id: MorningSubStep; label: string; icon: string }[] = [
    { id: 'wake', label: 'Сонце', icon: '🌞' },
    { id: 'wash_face', label: 'Вмивання', icon: '🧼' },
    { id: 'teeth', label: 'Зубки', icon: '🪥' },
    { id: 'breakfast', label: 'Сніданок', icon: '🥞' },
    { id: 'backpack', label: 'Рюкзак', icon: '🎒' },
    { id: 'dress', label: 'Одяг', icon: '👗' },
  ];

  return (
    <div className="relative min-h-[calc(100vh-65px)] bg-gradient-to-b from-amber-50 via-rose-50 to-pink-50 p-3 sm:p-6 flex flex-col items-center">
      {/* Step Selector Pills */}
      <div className="w-full max-w-2xl flex items-center justify-between gap-1.5 sm:gap-2 mb-4 bg-white/80 p-1.5 sm:p-2 rounded-2xl shadow-sm border border-amber-200">
        {stepsList.map((s) => {
          const isActive = step === s.id;
          return (
            <button
              key={s.id}
              onClick={() => {
                audio.playPop();
                setStep(s.id);
              }}
              className={`flex-1 py-2 sm:py-2.5 px-1.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1 transition cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-amber-950 shadow-md scale-102 border-2 border-amber-500'
                  : 'bg-transparent text-gray-600 hover:bg-amber-100'
              }`}
            >
              <span className="text-base sm:text-lg">{s.icon}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main interactive stage container */}
      <div className="w-full max-w-3xl bg-white/95 rounded-3xl p-4 sm:p-6 shadow-xl border-3 border-amber-300 flex flex-col flex-1 justify-between relative overflow-hidden">
        {/* Background scene overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src={GAME_IMAGES.morning}
            alt="Ранок"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Dynamic Step Content */}
        <div className="relative z-10 flex flex-col items-center flex-1 justify-center my-2">
          {/* STEP 1: WAKE UP & OPEN CURTAINS */}
          {step === 'wake' && (
            <div className="flex flex-col items-center gap-5 w-full max-w-md">
              <NicoleCharacter
                mood={isAwake ? 'happy' : 'sleepy'}
                size="hero"
                appearance={appearance}
                speechText={
                  isAwake
                    ? 'Ура, новий чудовий день! Сонечко вже світить!'
                    : 'Потягни за шторки, щоб сонечко розбудило мене!'
                }
              />

              <div className="relative w-full h-44 bg-gradient-to-b from-sky-300 to-amber-100 rounded-3xl overflow-hidden border-4 border-amber-300 shadow-inner flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.15, 1], rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="text-6xl sm:text-7xl cursor-pointer"
                  onClick={handleOpenCurtains}
                >
                  ☀️
                </motion.div>

                {/* Left Curtain */}
                <motion.div
                  animate={{ x: curtainsOpen ? '-80%' : '0%' }}
                  transition={{ type: 'spring', damping: 15 }}
                  onClick={handleOpenCurtains}
                  className="absolute left-0 top-0 bottom-0 w-1/2 bg-yellow-400 border-r-4 border-yellow-500 shadow-lg cursor-pointer flex items-center justify-center text-yellow-800 font-black"
                >
                  <span className="text-3xl">🪟</span>
                </motion.div>

                {/* Right Curtain */}
                <motion.div
                  animate={{ x: curtainsOpen ? '80%' : '0%' }}
                  transition={{ type: 'spring', damping: 15 }}
                  onClick={handleOpenCurtains}
                  className="absolute right-0 top-0 bottom-0 w-1/2 bg-yellow-400 border-l-4 border-yellow-500 shadow-lg cursor-pointer flex items-center justify-center text-yellow-800 font-black"
                >
                  <span className="text-3xl">🪟</span>
                </motion.div>
              </div>

              {isAwake && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    audio.playSparkle();
                    setStep('wash_face');
                    audio.speakUkrainian('Час вмити личко теплою водичкою!', 'nicole');
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-sky-400 to-blue-500 hover:brightness-110 active:scale-95 text-white font-black text-lg rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  <span>Вмивати личко 🧼</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              )}
            </div>
          )}

          {/* STEP 2: WASH FACE */}
          {step === 'wash_face' && (
            <div className="flex flex-col items-center gap-5 w-full max-w-md">
              <NicoleCharacter
                mood="happy"
                size="md"
                appearance={appearance}
                speechText="Збий мильну пінку, вмий личко теплою водичкою та витри рушником!"
              />

              <div className="grid grid-cols-3 gap-3 w-full">
                <button
                  onClick={handleSoap}
                  className={`p-4 rounded-3xl border-3 flex flex-col items-center text-center font-black transition cursor-pointer shadow-md ${
                    soapedFace ? 'bg-pink-100 border-pink-400 text-pink-900 scale-102' : 'bg-white border-amber-200 hover:border-pink-300'
                  }`}
                >
                  <span className="text-5xl mb-1">🧼</span>
                  <span className="text-xs sm:text-sm">Мило з піною</span>
                  <span className="text-[10px] text-gray-500 mt-0.5">{soapedFace ? '✓ Намилено' : '+ Торкнись'}</span>
                </button>

                <button
                  onClick={handleRinse}
                  disabled={!soapedFace}
                  className={`p-4 rounded-3xl border-3 flex flex-col items-center text-center font-black transition cursor-pointer shadow-md ${
                    rinsedFace ? 'bg-sky-100 border-sky-400 text-sky-900 scale-102' : 'bg-white border-amber-200 hover:border-sky-300'
                  }`}
                >
                  <span className="text-5xl mb-1">🚿</span>
                  <span className="text-xs sm:text-sm">Чиста водичка</span>
                  <span className="text-[10px] text-gray-500 mt-0.5">{rinsedFace ? '✓ Вмито' : '+ Змити'}</span>
                </button>

                <button
                  onClick={handleDry}
                  disabled={!rinsedFace}
                  className={`p-4 rounded-3xl border-3 flex flex-col items-center text-center font-black transition cursor-pointer shadow-md ${
                    driedFace ? 'bg-emerald-100 border-emerald-400 text-emerald-900 scale-102' : 'bg-white border-amber-200 hover:border-emerald-300'
                  }`}
                >
                  <span className="text-5xl mb-1">🧖‍♀️</span>
                  <span className="text-xs sm:text-sm">Рушничок</span>
                  <span className="text-[10px] text-gray-500 mt-0.5">{driedFace ? '✓ Сухенько' : '+ Витерти'}</span>
                </button>
              </div>

              {driedFace && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    audio.playSparkle();
                    setStep('teeth');
                    audio.speakUkrainian('А тепер почистимо зубки до сяючого блиску!', 'nicole');
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-teal-400 to-emerald-500 hover:brightness-110 active:scale-95 text-white font-black text-lg rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  <span>Чистити зубки 🪥</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              )}
            </div>
          )}

          {/* STEP 3: TEETH BRUSHING */}
          {step === 'teeth' && (
            <div className="flex flex-col items-center gap-5 w-full max-w-md">
              <NicoleCharacter
                mood="happy"
                size="sm"
                appearance={appearance}
                speechText="Тисни на зубчики кілька разів, щоб вони стали білосніжними!"
              />

              <div className="relative p-6 bg-gradient-to-tr from-pink-100 to-rose-200 rounded-3xl border-4 border-pink-300 shadow-inner flex flex-col items-center gap-4 w-full">
                <div className="flex gap-4">
                  {[0, 1].map((idx) => {
                    const isClean = teethCleaned[idx] >= 2;
                    return (
                      <motion.button
                        key={idx}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => handleBrushTooth(idx)}
                        className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-4 flex flex-col items-center justify-center text-center transition cursor-pointer shadow-md ${
                          isClean
                            ? 'bg-white border-emerald-400 ring-4 ring-emerald-200'
                            : 'bg-amber-100 border-amber-300'
                        }`}
                      >
                        <span className="text-4xl sm:text-5xl">{isClean ? '✨🦷' : '🦷'}</span>
                        <span className="text-[11px] font-black text-gray-700 mt-1">
                          {isClean ? 'Блищить!' : 'Потерти щіткою'}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="flex gap-4">
                  {[2, 3].map((idx) => {
                    const isClean = teethCleaned[idx] >= 2;
                    return (
                      <motion.button
                        key={idx}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => handleBrushTooth(idx)}
                        className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-4 flex flex-col items-center justify-center text-center transition cursor-pointer shadow-md ${
                          isClean
                            ? 'bg-white border-emerald-400 ring-4 ring-emerald-200'
                            : 'bg-amber-100 border-amber-300'
                        }`}
                      >
                        <span className="text-4xl sm:text-5xl">{isClean ? '✨🦷' : '🦷'}</span>
                        <span className="text-[11px] font-black text-gray-700 mt-1">
                          {isClean ? 'Блищить!' : 'Потерти щіткою'}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {teethCleaned.every(v => v >= 2) && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    audio.playSparkle();
                    setStep('breakfast');
                    audio.speakUkrainian('Зубки чисті! Час смачно поснідати!', 'nicole');
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:brightness-110 active:scale-95 text-white font-black text-lg rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  <span>Смачний сніданок 🥞</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              )}
            </div>
          )}

          {/* STEP 4: BREAKFAST */}
          {step === 'breakfast' && (
            <div className="flex flex-col items-center gap-5 w-full max-w-md">
              <NicoleCharacter
                mood="eating"
                size="md"
                appearance={appearance}
                speechText="Обери ягідки та відкуси шматочки теплих панкейків!"
              />

              <div className="w-full bg-amber-50 rounded-3xl p-4 border-3 border-amber-300 shadow-lg flex flex-col items-center gap-4">
                {/* Plate with pancakes */}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleBitePancake}
                  disabled={pancakeBites >= 3}
                  className="w-44 h-44 rounded-full bg-white border-6 border-pink-200 shadow-xl flex flex-col items-center justify-center cursor-pointer p-2"
                >
                  <span className="text-6xl mb-1">
                    {pancakeBites >= 3 ? '✨' : '🥞'}
                  </span>
                  <span className="text-xs font-black text-gray-800">
                    {pancakeBites >= 3 ? 'Зʼїдено! Ням!' : 'Відкусити панкейк'}
                  </span>
                  <span className="text-[10px] text-amber-600 font-bold mt-0.5">
                    {pancakeBites}/3 шматочки
                  </span>
                </motion.button>

                {/* Toppings choice */}
                <div className="flex items-center justify-center gap-2 w-full">
                  {[
                    { id: 'strawberry', icon: '🍓', name: 'Полунички' },
                    { id: 'honey', icon: '🍯', name: 'Медок' },
                    { id: 'berries', icon: '🫐', name: 'Чорниці' },
                  ].map((top) => {
                    const isPicked = selectedToppings.includes(top.id);
                    return (
                      <button
                        key={top.id}
                        onClick={() => {
                          audio.playPop(1.5);
                          if (!isPicked) setSelectedToppings(p => [...p, top.id]);
                        }}
                        className={`p-2.5 rounded-2xl border-2 flex items-center gap-1.5 transition cursor-pointer ${
                          isPicked ? 'bg-amber-200 border-amber-500 font-black' : 'bg-white border-amber-200'
                        }`}
                      >
                        <span className="text-2xl">{top.icon}</span>
                        <span className="text-xs">{top.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {pancakeBites >= 3 && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    audio.playSparkle();
                    setStep('backpack');
                    audio.speakUkrainian('Сніданок закінчено! Складемо мій рюкзачок у садочок!', 'nicole');
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:brightness-110 active:scale-95 text-white font-black text-lg rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  <span>Зібрати рюкзачок 🎒</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              )}
            </div>
          )}

          {/* STEP 5: BACKPACK PACKING */}
          {step === 'backpack' && (
            <div className="flex flex-col items-center gap-5 w-full max-w-md">
              <NicoleCharacter
                mood="excited"
                size="sm"
                appearance={appearance}
                speechText="Поклади в мій рожевий рюкзачок яблучко, пляшечку води та ведмедика!"
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
                {[
                  { id: 'apple', icon: '🍎', name: 'Яблучко' },
                  { id: 'water', icon: '💧', name: 'Водичка' },
                  { id: 'teddy', icon: '🧸', name: 'Ведмедик' },
                  { id: 'crayons', icon: '🖍️', name: 'Олівчики' },
                ].map((item) => {
                  const isPacked = packedItems.includes(item.id);
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handlePackItem(item.id, item.name)}
                      className={`p-3 rounded-2xl border-3 flex flex-col items-center text-center font-black transition cursor-pointer shadow-sm ${
                        isPacked ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'bg-white border-purple-200'
                      }`}
                    >
                      <span className="text-4xl mb-1">{item.icon}</span>
                      <span className="text-xs">{item.name}</span>
                      <span className="text-[10px] mt-0.5">{isPacked ? '✓ У рюкзаку' : '+ Покласти'}</span>
                    </motion.button>
                  );
                })}
              </div>

              {packedItems.length >= 3 && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    audio.playSparkle();
                    setStep('dress');
                    audio.speakUkrainian('Рюкзачок готовий! Тепер одягнемося в гарне вбрання!', 'nicole');
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-110 active:scale-95 text-white font-black text-lg rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  <span>Одягнути вбрання 👗</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              )}
            </div>
          )}

          {/* STEP 6: DRESS UP */}
          {step === 'dress' && (
            <div className="flex flex-col items-center gap-5 w-full max-w-md">
              <NicoleCharacter
                mood="excited"
                size="md"
                appearance={appearance}
                speechText="Одягни мені вишневу сукню, курточку, білі шкарпетки та кросівки!"
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
                {[
                  { id: 'dress', icon: '🍒', name: 'Сукня' },
                  { id: 'jacket', icon: '🧥', name: 'Курточка' },
                  { id: 'socks', icon: '🧦', name: 'Шкарпетки' },
                  { id: 'sneakers', icon: '👟', name: 'Кросівки' },
                ].map((item) => {
                  const isDressed = dressedItems.includes(item.id);
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleDress(item.id, item.name)}
                      className={`p-3 rounded-2xl border-3 flex flex-col items-center text-center font-black transition cursor-pointer shadow-sm ${
                        isDressed ? 'bg-pink-500 text-white border-pink-600' : 'bg-white border-pink-200 text-gray-800'
                      }`}
                    >
                      <span className="text-4xl mb-1">{item.icon}</span>
                      <span className="text-xs">{item.name}</span>
                      <span className="text-[10px] mt-0.5">{isDressed ? '✓ Одягнено' : '+ Одягнути'}</span>
                    </motion.button>
                  );
                })}
              </div>

              {onOpenWardrobe && (
                <button
                  onClick={onOpenWardrobe}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-2xl font-black text-xs sm:text-sm transition cursor-pointer border border-pink-300"
                >
                  <Shirt className="w-4 h-4" />
                  <span>Відкрити повну вбиральню</span>
                </button>
              )}

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
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 active:scale-95 text-white font-black text-lg rounded-2xl shadow-2xl flex items-center gap-2 cursor-pointer mt-2"
                >
                  <span>Сідаємо в маршрутку! 🚌</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-3 border-t border-amber-200 flex items-center justify-between">
          <button
            onClick={() => {
              audio.playPop();
              setCurtainsOpen(false);
              setIsAwake(false);
              setSoapedFace(false);
              setRinsedFace(false);
              setDriedFace(false);
              setTeethCleaned([0, 0, 0, 0]);
              setPancakeBites(0);
              setPackedItems([]);
              setDressedItems([]);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Спробувати знову</span>
          </button>

          <div className="flex items-center gap-1">
            <Sun className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="text-xs sm:text-sm font-black text-amber-900">
              {earnedStickers.length} / 4 наліпок
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
