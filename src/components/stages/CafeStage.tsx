import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, RotateCcw, Heart, Check } from 'lucide-react';
import { CafeSubStep, NicoleAppearance } from '../../types';
import { GAME_IMAGES } from '../../assets/images';
import { NicoleCharacter } from '../NicoleCharacter';
import { audio } from '../../utils/audio';

interface CafeStageProps {
  onComplete: (stickerIds: string[]) => void;
  onNextStage: () => void;
  appearance?: NicoleAppearance;
}

export const CafeStage: React.FC<CafeStageProps> = ({
  onComplete,
  onNextStage,
  appearance,
}) => {
  const [step, setStep] = useState<CafeSubStep>('select_donut');

  // Step 1: Donut selection
  const [selectedDonut, setSelectedDonut] = useState<string>('strawberry');

  // Step 2: Decorating toppings
  const [toppings, setToppings] = useState<string[]>([]);

  // Step 3: Cocoa making
  const [milkPoured, setMilkPoured] = useState(false);
  const [cocoaScoops, setCocoaScoops] = useState(0);
  const [marshmallowsAdded, setMarshmallowsAdded] = useState(0);
  const [cocoaStirred, setCocoaStirred] = useState(false);

  // Step 4: Eating treats
  const [donutBites, setDonutBites] = useState(0);
  const [cocoaSips, setCocoaSips] = useState(0);

  const [earnedStickers, setEarnedStickers] = useState<string[]>([]);
  const [stageFinished, setStageFinished] = useState<boolean>(false);

  useEffect(() => {
    if (step === 'select_donut') {
      audio.speakUkrainian('Ура, ми прийшли в затишне кафе з мамою! Обираймо найсмачніший пончик!', 'nicole');
    }
  }, [step]);

  const donutOptions = [
    { id: 'strawberry', name: 'Полуничний', icon: '🍩', glazeColor: 'bg-pink-400', desc: 'Рожевий з ягідками' },
    { id: 'chocolate', name: 'Шоколадний', icon: '🍩', glazeColor: 'bg-amber-800', desc: 'Густий шоколад' },
    { id: 'blueberry', name: 'Чорничний', icon: '🍩', glazeColor: 'bg-indigo-400', desc: 'Солодкі лісові ягоди' },
    { id: 'caramel', name: 'Карамельний', icon: '🍩', glazeColor: 'bg-amber-400', desc: 'З золотим медом' },
  ];

  const availableToppings = [
    { id: 'rainbow', icon: '🌈', name: 'Веселкова посипка' },
    { id: 'stars', icon: '⭐', name: 'Цукрові зірочки' },
    { id: 'berries', icon: '🍒', name: 'Свіжі вишеньки' },
    { id: 'hearts', icon: '💖', name: 'Рожеві сердечка' },
  ];

  const handleToggleTopping = (id: string, name: string) => {
    audio.playSparkle();
    audio.playPop(1.3);
    if (!toppings.includes(id)) {
      setToppings(prev => [...prev, id]);
      audio.speakUkrainian(`Додали ${name}!`, 'nicole');
    }
  };

  const handlePourMilk = () => {
    if (milkPoured) return;
    audio.playWaterSplash();
    setMilkPoured(true);
    audio.speakUkrainian('Наливаємо біле свіже молочко!', 'mom');
  };

  const handleAddCocoaScoop = () => {
    if (cocoaScoops >= 2) return;
    audio.playPop(1.4);
    const next = cocoaScoops + 1;
    setCocoaScoops(next);
    audio.speakUkrainian(next === 1 ? 'Ложечка ароматного какао!' : 'Ще одна ложечка для смаку!', 'nicole');
  };

  const handleAddMarshmallow = () => {
    if (marshmallowsAdded >= 3) return;
    audio.playPop(1.6);
    const next = marshmallowsAdded + 1;
    setMarshmallowsAdded(next);
    audio.speakUkrainian('Мʼякенька пухнаста зефірка в чашечку!', 'nicole');
  };

  const handleStirCocoa = () => {
    audio.playSparkle();
    setCocoaStirred(true);
    audio.speakUkrainian('Перемішали ложечкою! Яке смачне і тепле какао!', 'nicole');
  };

  const handleBiteDonut = () => {
    if (donutBites >= 3) return;
    audio.playCrunch();
    const next = donutBites + 1;
    setDonutBites(next);
    if (next === 1) audio.speakUkrainian('Ням! Який ніжний та солодкий пончик!', 'nicole');
    if (next === 2) audio.speakUkrainian('Хрум-хрум, дуже смачно!', 'nicole');
    if (next === 3) checkFinish(next, cocoaSips);
  };

  const handleSipCocoa = () => {
    if (cocoaSips >= 3) return;
    audio.playPop(1.5);
    const next = cocoaSips + 1;
    setCocoaSips(next);
    if (next === 1) audio.speakUkrainian('Ковток теплого шоколадного какао! Ммм!', 'nicole');
    if (next === 2) audio.speakUkrainian('Зефірка тане в ротику!', 'nicole');
    if (next === 3) checkFinish(donutBites, next);
  };

  const checkFinish = (bites: number, sips: number) => {
    if (bites >= 3 && sips >= 3 && !stageFinished) {
      setStageFinished(true);
      const stickers = ['donut', 'cocoa'];
      setEarnedStickers(stickers);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      audio.playFanfare();
      audio.speakUkrainian('Ура! Це було найсмачніше частування у світі! Дякую, матусю!', 'nicole');
      onComplete(stickers);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] bg-gradient-to-b from-rose-50 via-amber-50 to-orange-50 p-3 sm:p-6 flex flex-col items-center">
      {/* Visual step navigation tabs */}
      <div className="w-full max-w-2xl flex items-center justify-between gap-1.5 sm:gap-2 mb-4 bg-white/90 p-1.5 sm:p-2 rounded-2xl shadow-sm border border-pink-200">
        {[
          { id: 'select_donut', icon: '🍩', label: 'Пончик' },
          { id: 'decorate_donut', icon: '🎨', label: 'Посипка' },
          { id: 'make_cocoa', icon: '☕', label: 'Какао' },
          { id: 'eat_treats', icon: '😋', label: 'Смакуємо' },
        ].map((tab) => {
          const isActive = step === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                audio.playPop();
                setStep(tab.id as any);
              }}
              className={`flex-1 py-2 sm:py-2.5 px-2 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer ${
                isActive
                  ? 'bg-rose-500 text-white shadow-md scale-102'
                  : 'bg-transparent text-gray-600 hover:bg-rose-50'
              }`}
            >
              <span className="text-base sm:text-lg">{tab.icon}</span>
              <span className="hidden xs:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Card */}
      <div className="w-full max-w-3xl bg-white/95 rounded-3xl p-4 sm:p-6 shadow-xl border-3 border-rose-300 flex flex-col flex-1 justify-between relative overflow-hidden">
        {/* Background artwork */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src={GAME_IMAGES.cafe}
            alt="Кафе"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Content area */}
        <div className="relative z-10 flex flex-col items-center flex-1 justify-center my-2">
          {/* STEP 1: CHOOSE DONUT */}
          {step === 'select_donut' && (
            <div className="flex flex-col items-center gap-5 w-full max-w-xl">
              <NicoleCharacter
                size="md"
                mood="excited"
                appearance={appearance}
                speechText="Який пончик мені обрати? Усі такі гарні та кругленькі!"
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                {donutOptions.map((item) => {
                  const isSelected = selectedDonut === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => {
                        audio.playSparkle();
                        setSelectedDonut(item.id);
                        audio.speakUkrainian(`Обрано смачний ${item.name} пончик!`, 'nicole');
                      }}
                      className={`p-3 sm:p-4 rounded-3xl border-3 flex flex-col items-center text-center transition shadow-md cursor-pointer ${
                        isSelected
                          ? 'bg-rose-100 border-rose-500 scale-105 ring-4 ring-rose-300'
                          : 'bg-white border-amber-200 hover:border-rose-300'
                      }`}
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-4xl sm:text-5xl shadow-inner mb-2 bg-gradient-to-tr from-amber-100 to-rose-100">
                        {item.icon}
                      </div>
                      <span className="text-sm sm:text-base font-black text-gray-800">
                        {item.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  audio.playSparkle();
                  setStep('decorate_donut');
                  audio.speakUkrainian('Давай прикрасимо наш пончик різнокольоровими солодощами!', 'nicole');
                }}
                className="px-8 py-3.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer"
              >
                <span>Прикрашати пончик 🎨</span>
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </div>
          )}

          {/* STEP 2: DECORATE DONUT */}
          {step === 'decorate_donut' && (
            <div className="flex flex-col items-center gap-5 w-full max-w-xl">
              <NicoleCharacter
                size="sm"
                mood="excited"
                appearance={appearance}
                speechText="Торкнися цукерок та зірочок, щоб посипати мій пончик!"
              />

              {/* Big Donut Plate with visual toppings */}
              <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-gradient-to-tr from-pink-100 via-rose-50 to-amber-100 border-8 border-white shadow-2xl flex items-center justify-center">
                {/* Donut Body */}
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-amber-300 border-6 border-amber-400 shadow-lg flex items-center justify-center relative overflow-hidden">
                  {/* Glaze */}
                  <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 opacity-90 border-4 border-pink-300"></div>
                  {/* Donut hole */}
                  <div className="w-14 h-14 rounded-full bg-rose-50 border-4 border-amber-400 shadow-inner z-10"></div>

                  {/* Dynamic scattered toppings */}
                  {toppings.includes('rainbow') && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none text-xl z-20"
                    >
                      <span className="absolute top-4 left-8">✨</span>
                      <span className="absolute bottom-6 right-8">✨</span>
                      <span className="absolute top-8 right-6">✨</span>
                    </motion.div>
                  )}
                  {toppings.includes('stars') && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none text-xl z-20"
                    >
                      <span className="absolute top-7 left-12">⭐</span>
                      <span className="absolute bottom-8 left-8">⭐</span>
                      <span className="absolute top-12 right-6">⭐</span>
                    </motion.div>
                  )}
                  {toppings.includes('berries') && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none text-2xl z-20"
                    >
                      <span className="absolute top-3 left-1/2 -translate-x-1/2">🍒</span>
                      <span className="absolute bottom-3 left-1/2 -translate-x-1/2">🍓</span>
                    </motion.div>
                  )}
                  {toppings.includes('hearts') && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none text-xl z-20"
                    >
                      <span className="absolute left-4 top-1/2 -translate-y-1/2">💖</span>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2">💖</span>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Topping Tap Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
                {availableToppings.map((top) => {
                  const isAdded = toppings.includes(top.id);
                  return (
                    <motion.button
                      key={top.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleToggleTopping(top.id, top.name)}
                      className={`p-3 rounded-2xl border-3 flex flex-col items-center text-center font-black transition shadow-sm cursor-pointer ${
                        isAdded
                          ? 'bg-rose-500 text-white border-rose-600 shadow-md scale-102'
                          : 'bg-white border-pink-200 hover:border-pink-300 text-gray-800'
                      }`}
                    >
                      <span className="text-3xl mb-1">{top.icon}</span>
                      <span className="text-xs sm:text-sm">{top.name}</span>
                      <span className="text-[10px] mt-0.5 opacity-90">
                        {isAdded ? '✓ Додано!' : '+ Посипати'}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {toppings.length >= 2 && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => {
                    audio.playSparkle();
                    setStep('make_cocoa');
                    audio.speakUkrainian('Пончик готовий! А тепер приготуємо ніжне гаряче какао!', 'nicole');
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 active:scale-95 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  <span>Готувати какао ☕</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              )}
            </div>
          )}

          {/* STEP 3: MAKE COCOA */}
          {step === 'make_cocoa' && (
            <div className="flex flex-col items-center gap-5 w-full max-w-xl">
              <NicoleCharacter
                size="sm"
                mood="excited"
                appearance={appearance}
                speechText="Налий молочко, поклади дві ложечки какао та солодкі зефірки!"
              />

              {/* Cocoa Cup Display */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl bg-gradient-to-b from-amber-100 to-orange-100 border-4 border-amber-300 shadow-inner flex flex-col items-center justify-center p-4">
                {/* Mug */}
                <div className="relative w-32 h-36 bg-pink-400 rounded-b-3xl border-4 border-pink-500 shadow-lg flex flex-col items-center justify-end p-2 overflow-hidden">
                  {/* Mug Handle */}
                  <div className="absolute -right-5 top-6 w-8 h-16 rounded-r-2xl border-4 border-pink-500 border-l-0"></div>

                  {/* Cocoa Liquid level */}
                  <div
                    className={`w-full transition-all duration-500 rounded-b-2xl ${
                      !milkPoured
                        ? 'h-2 bg-transparent'
                        : cocoaScoops === 0
                        ? 'h-24 bg-amber-50'
                        : cocoaScoops === 1
                        ? 'h-24 bg-amber-600/70'
                        : 'h-24 bg-amber-800'
                    }`}
                  >
                    {/* Marshmallows floating */}
                    {marshmallowsAdded > 0 && (
                      <div className="flex items-center justify-center gap-1 pt-1">
                        {Array.from({ length: marshmallowsAdded }).map((_, i) => (
                          <span key={i} className="text-base animate-bounce">
                            ☁️
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Steam */}
                {cocoaStirred && (
                  <motion.div
                    animate={{ y: [-2, -8, -2], opacity: [0.4, 0.9, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute top-2 text-2xl"
                  >
                    ♨️
                  </motion.div>
                )}
              </div>

              {/* 4 Interactive Cooking Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
                <button
                  onClick={handlePourMilk}
                  disabled={milkPoured}
                  className={`p-3 rounded-2xl border-3 flex flex-col items-center text-center font-black transition cursor-pointer shadow-sm ${
                    milkPoured ? 'bg-emerald-100 border-emerald-400 text-emerald-800 opacity-80' : 'bg-white border-sky-300 hover:bg-sky-50'
                  }`}
                >
                  <span className="text-3xl mb-1">🥛</span>
                  <span className="text-xs sm:text-sm">Молочко</span>
                  <span className="text-[10px] mt-0.5">{milkPoured ? '✓ Налито' : '+ Налити'}</span>
                </button>

                <button
                  onClick={handleAddCocoaScoop}
                  disabled={!milkPoured || cocoaScoops >= 2}
                  className={`p-3 rounded-2xl border-3 flex flex-col items-center text-center font-black transition cursor-pointer shadow-sm ${
                    cocoaScoops >= 2 ? 'bg-emerald-100 border-emerald-400 text-emerald-800 opacity-80' : 'bg-white border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  <span className="text-3xl mb-1">🍫</span>
                  <span className="text-xs sm:text-sm">Какао-порошок</span>
                  <span className="text-[10px] mt-0.5">{cocoaScoops}/2 ложки</span>
                </button>

                <button
                  onClick={handleAddMarshmallow}
                  disabled={!milkPoured || marshmallowsAdded >= 3}
                  className={`p-3 rounded-2xl border-3 flex flex-col items-center text-center font-black transition cursor-pointer shadow-sm ${
                    marshmallowsAdded >= 3 ? 'bg-emerald-100 border-emerald-400 text-emerald-800 opacity-80' : 'bg-white border-pink-300 hover:bg-pink-50'
                  }`}
                >
                  <span className="text-3xl mb-1">☁️</span>
                  <span className="text-xs sm:text-sm">Зефірки</span>
                  <span className="text-[10px] mt-0.5">{marshmallowsAdded}/3 штучки</span>
                </button>

                <button
                  onClick={handleStirCocoa}
                  disabled={!milkPoured || cocoaScoops === 0 || cocoaStirred}
                  className={`p-3 rounded-2xl border-3 flex flex-col items-center text-center font-black transition cursor-pointer shadow-sm ${
                    cocoaStirred ? 'bg-emerald-100 border-emerald-400 text-emerald-800 opacity-80' : 'bg-white border-orange-300 hover:bg-orange-50'
                  }`}
                >
                  <span className="text-3xl mb-1">🥄</span>
                  <span className="text-xs sm:text-sm">Перемішати</span>
                  <span className="text-[10px] mt-0.5">{cocoaStirred ? '✓ Готово' : 'Збовтати'}</span>
                </button>
              </div>

              {cocoaStirred && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => {
                    audio.playSparkle();
                    setStep('eat_treats');
                    audio.speakUkrainian('Ура! Пончик і какао готові! Нумо смакувати!', 'nicole');
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  <span>Смакувати разом! 😋</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              )}
            </div>
          )}

          {/* STEP 4: EAT TREATS */}
          {step === 'eat_treats' && (
            <div className="flex flex-col items-center gap-5 w-full max-w-xl">
              <NicoleCharacter
                size="hero"
                mood="eating"
                appearance={appearance}
                speechText={
                  stageFinished
                    ? 'Це було неймовірно смачно! Ми з мамою так щасливі!'
                    : 'Торкнися пончика, щоб відкусити шматочок, та випий какао!'
                }
              />

              {/* Cafe Table with Donut and Mug */}
              <div className="w-full bg-amber-100/90 rounded-3xl p-5 border-4 border-amber-300 shadow-xl flex items-center justify-around gap-4">
                {/* Donut Button */}
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleBiteDonut}
                  disabled={donutBites >= 3}
                  className="flex flex-col items-center p-4 bg-white rounded-3xl border-3 border-pink-300 shadow-md cursor-pointer"
                >
                  <span className="text-5xl sm:text-6xl mb-1">
                    {donutBites === 0 && '🍩'}
                    {donutBites === 1 && '🍩'}
                    {donutBites === 2 && '🥯'}
                    {donutBites >= 3 && '✨'}
                  </span>
                  <span className="text-xs sm:text-sm font-black text-gray-800">
                    {donutBites >= 3 ? 'Пончик зʼїдено! 😋' : 'Відкусити пончик'}
                  </span>
                  <span className="text-xs font-bold text-pink-600 mt-0.5">
                    {donutBites}/3 шматочки
                  </span>
                </motion.button>

                {/* Cocoa Mug Button */}
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSipCocoa}
                  disabled={cocoaSips >= 3}
                  className="flex flex-col items-center p-4 bg-white rounded-3xl border-3 border-amber-300 shadow-md cursor-pointer"
                >
                  <span className="text-5xl sm:text-6xl mb-1">
                    {cocoaSips >= 3 ? '✨' : '☕'}
                  </span>
                  <span className="text-xs sm:text-sm font-black text-gray-800">
                    {cocoaSips >= 3 ? 'Какао випито! 💖' : 'Зробити ковток'}
                  </span>
                  <span className="text-xs font-bold text-amber-700 mt-0.5">
                    {cocoaSips}/3 ковточки
                  </span>
                </motion.button>
              </div>

              {stageFinished && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-3 flex flex-col items-center gap-3"
                >
                  <div className="flex items-center gap-2 bg-yellow-100 border-2 border-yellow-400 py-1.5 px-4 rounded-full text-yellow-900 font-black text-sm">
                    <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
                    <span>Отримано наліпки: «Рожевий пончик» та «Тепле какао»!</span>
                  </div>

                  <button
                    onClick={() => {
                      audio.playSparkle();
                      onNextStage();
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 active:scale-95 text-white font-black text-lg rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer"
                  >
                    <span>Повертаємося додому! 🏡</span>
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="relative z-10 pt-3 border-t border-rose-200 flex items-center justify-between">
          <button
            onClick={() => {
              audio.playPop();
              setDonutBites(0);
              setCocoaSips(0);
              setToppings([]);
              setMilkPoured(false);
              setCocoaScoops(0);
              setMarshmallowsAdded(0);
              setCocoaStirred(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Спробувати знову</span>
          </button>

          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-rose-500 fill-rose-400" />
            <span className="text-xs sm:text-sm font-black text-rose-900">
              Смачне кафе з мамою 🍩
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
