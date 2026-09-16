import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, RotateCcw, Moon, Star, Heart, Check } from 'lucide-react';
import { HomeSubStep, NicoleAppearance } from '../../types';
import { GAME_IMAGES } from '../../assets/images';
import { NicoleCharacter } from '../NicoleCharacter';
import { audio } from '../../utils/audio';

interface HomeStageProps {
  onComplete: (stickerIds: string[]) => void;
  onFinishDay: () => void;
  appearance?: NicoleAppearance;
}

export const HomeStage: React.FC<HomeStageProps> = ({
  onComplete,
  onFinishDay,
  appearance,
}) => {
  const [step, setStep] = useState<HomeSubStep>('unpack');

  // Step 1: Unpack items
  const [unpackedItems, setUnpackedItems] = useState<string[]>([]);

  // Step 2: Bubble bath
  const [waterFilled, setWaterFilled] = useState(false);
  const [foamLevel, setFoamLevel] = useState(0);
  const [duckiesTapped, setDuckiesTapped] = useState<number[]>([]);

  // Step 3: Pyjamas & plushie
  const [pajamaOn, setPajamaOn] = useState(false);
  const [chosenPlushie, setChosenPlushie] = useState<string>('teddy');

  // Step 4: Bedtime story & stars
  const [nightlightOn, setNightlightOn] = useState(false);
  const [pagesTurned, setPagesTurned] = useState(0);
  const [starsCounted, setStarsCounted] = useState<number[]>([]);

  const [earnedStickers, setEarnedStickers] = useState<string[]>([]);
  const [stageFinished, setStageFinished] = useState<boolean>(false);

  useEffect(() => {
    if (step === 'unpack') {
      audio.speakUkrainian('Ура, ми повернулися додому! Як тут затишно і тепло!', 'nicole');
    }
  }, [step]);

  // Handle unpack
  const handleUnpack = (id: string, name: string) => {
    if (unpackedItems.includes(id)) return;
    audio.playSparkle();
    const updated = [...unpackedItems, id];
    setUnpackedItems(updated);
    audio.speakUkrainian(
      id === 'jacket'
        ? 'Повісили курточку на вішачок!'
        : id === 'slippers'
        ? 'Взули мʼякенькі пухнасті капці!'
        : 'Дістали з рюкзачка малюнок із садочка!',
      'nicole'
    );
  };

  // Step 2: Bath
  const handleFillWater = () => {
    audio.playWaterSplash();
    setWaterFilled(true);
    audio.speakUkrainian('Тепла водичка набирається у ванну!', 'mom');
  };

  const handleAddFoam = () => {
    if (foamLevel >= 3) return;
    audio.playPop(1.4);
    const next = foamLevel + 1;
    setFoamLevel(next);
    audio.speakUkrainian('Бульк! Багато білосніжної мильної піни!', 'nicole');
  };

  const handleTapDuck = (idx: number) => {
    audio.playDuckQuack();
    if (!duckiesTapped.includes(idx)) {
      setDuckiesTapped(prev => [...prev, idx]);
    }
  };

  // Step 4: Bedtime
  const handleToggleNightlight = () => {
    audio.playSparkle();
    setNightlightOn(prev => !prev);
    audio.speakUkrainian('Сяє чарівний каганчик у формі зірочки!', 'nicole');
  };

  const handleTurnPage = () => {
    audio.playPop(1.5);
    const next = pagesTurned + 1;
    setPagesTurned(next);
    audio.speakUkrainian(
      next === 1
        ? 'Жила-була маленька принцеса Ніколь...'
        : next === 2
        ? 'Вона бігала в парку та каталася на веселому самокаті...'
        : 'А ввечері засинала під золотими зорями...',
      'mom'
    );
  };

  const handleCountStar = (idx: number) => {
    if (starsCounted.includes(idx)) return;
    audio.playSparkle();
    const next = [...starsCounted, idx];
    setStarsCounted(next);
    audio.speakUkrainian(
      next.length === 1
        ? 'Один! Перша зірочка у вікні!'
        : next.length === 2
        ? 'Два! Друга яскрава зірочка!'
        : 'Три! Усі зірочки сяють на небі!',
      'nicole'
    );

    if (next.length >= 3 && !stageFinished) {
      setStageFinished(true);
      const stickers = ['bath', 'dreams'];
      setEarnedStickers(stickers);
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      audio.playFanfare();
      audio.speakUkrainian('Добраніч, матусю! Добраніч, усім! До зустрічі завтра!', 'nicole');
      onComplete(stickers);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] bg-gradient-to-b from-indigo-950 via-purple-900 to-rose-950 p-3 sm:p-6 flex flex-col items-center text-white">
      {/* Visual step navigation tabs */}
      <div className="w-full max-w-2xl flex items-center justify-between gap-1.5 sm:gap-2 mb-4 bg-white/15 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl shadow-sm border border-purple-300/30">
        {[
          { id: 'unpack', icon: '🏡', label: 'Вдома' },
          { id: 'bubble_bath', icon: '🛁', label: 'Ванна' },
          { id: 'cozy_pajama', icon: '🧸', label: 'Піжамка' },
          { id: 'bedtime_story', icon: '🌙', label: 'Казка' },
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
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md scale-102 border border-white/40'
                  : 'text-purple-200 hover:bg-white/10'
              }`}
            >
              <span className="text-base sm:text-lg">{tab.icon}</span>
              <span className="hidden xs:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Card */}
      <div className="w-full max-w-3xl bg-white/95 rounded-3xl p-4 sm:p-6 shadow-2xl border-3 border-purple-300 flex flex-col flex-1 justify-between relative overflow-hidden text-gray-900">
        {/* Background artwork */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src={GAME_IMAGES.home}
            alt="Затишний дім"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Content area */}
        <div className="relative z-10 flex flex-col items-center flex-1 justify-center my-2">
          {/* STEP 1: UNPACK & COAT RACK */}
          {step === 'unpack' && (
            <div className="flex flex-col items-center gap-5 w-full max-w-xl">
              <NicoleCharacter
                size="md"
                mood="happy"
                appearance={appearance}
                speechText="Знімемо курточку, взуємо мʼякі капці та дістанемо речі з рюкзачка!"
              />

              <div className="grid grid-cols-3 gap-3 w-full">
                {[
                  { id: 'jacket', name: 'Вішалка для куртки', icon: '🧥', color: 'bg-sky-50 border-sky-300' },
                  { id: 'slippers', name: 'Мʼякі капці', icon: '🐰', color: 'bg-pink-50 border-pink-300' },
                  { id: 'backpack', name: 'Рюкзачок з малюнком', icon: '🎒', color: 'bg-amber-50 border-amber-300' },
                ].map((item) => {
                  const isDone = unpackedItems.includes(item.id);
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleUnpack(item.id, item.name)}
                      className={`p-4 rounded-3xl border-3 flex flex-col items-center text-center transition shadow-md cursor-pointer ${
                        isDone
                          ? 'bg-emerald-100 border-emerald-500 scale-102'
                          : `${item.color} hover:border-purple-400`
                      }`}
                    >
                      <span className="text-4xl sm:text-5xl mb-1">{item.icon}</span>
                      <span className="text-xs sm:text-sm font-black text-gray-800">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-bold text-gray-500 mt-0.5">
                        {isDone ? '✓ Зроблено' : '+ Торкнись'}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {unpackedItems.length >= 3 && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => {
                    audio.playSparkle();
                    setStep('bubble_bath');
                    audio.speakUkrainian('Час купатися в теплій ванні з жовтими качечками!', 'nicole');
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:brightness-110 active:scale-95 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  <span>Йдемо у ванну 🛁</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              )}
            </div>
          )}

          {/* STEP 2: BUBBLE BATH */}
          {step === 'bubble_bath' && (
            <div className="flex flex-col items-center gap-5 w-full max-w-xl">
              <NicoleCharacter
                size="sm"
                mood="happy"
                appearance={appearance}
                speechText="Набери водичку, збий піну та пограйся з качечками!"
              />

              {/* Bathtub graphic */}
              <div className="relative w-full max-w-md h-48 bg-gradient-to-b from-sky-100 to-blue-200 rounded-3xl border-4 border-sky-400 shadow-inner flex flex-col items-center justify-end p-3 overflow-hidden">
                {/* Water surface */}
                <div
                  className={`w-full transition-all duration-500 rounded-2xl flex flex-col justify-end p-2 relative ${
                    waterFilled ? 'h-32 bg-sky-400/80 border-t-2 border-white' : 'h-6 bg-transparent'
                  }`}
                >
                  {/* Floating Foam Bubbles */}
                  {foamLevel > 0 && (
                    <div className="flex items-center justify-around text-2xl -mt-4">
                      {Array.from({ length: foamLevel * 3 }).map((_, i) => (
                        <span key={i} className="animate-pulse">
                          🫧
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 3 Interactive Yellow Ducks */}
                  {waterFilled && (
                    <div className="flex items-center justify-around z-10">
                      {[0, 1, 2].map((idx) => {
                        const isTapped = duckiesTapped.includes(idx);
                        return (
                          <motion.button
                            key={idx}
                            animate={{ y: [0, -4, 0], rotate: [0, 5, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 + idx * 0.3 }}
                            whileTap={{ scale: 0.8 }}
                            onClick={() => handleTapDuck(idx)}
                            className="text-4xl sm:text-5xl cursor-pointer p-1 hover:scale-110 active:scale-90 transition"
                            title="Кря-кря! Натисни качечку!"
                          >
                            🦆
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Bath Controls */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
                <button
                  onClick={handleFillWater}
                  disabled={waterFilled}
                  className={`p-3 rounded-2xl border-3 flex flex-col items-center font-black transition cursor-pointer shadow-sm ${
                    waterFilled ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'bg-white border-sky-300 hover:bg-sky-50'
                  }`}
                >
                  <span className="text-3xl mb-1">🚿</span>
                  <span className="text-xs sm:text-sm">Набрати воду</span>
                  <span className="text-[10px] mt-0.5">{waterFilled ? '✓ Набрано' : '+ Відкрити кран'}</span>
                </button>

                <button
                  onClick={handleAddFoam}
                  disabled={!waterFilled || foamLevel >= 3}
                  className={`p-3 rounded-2xl border-3 flex flex-col items-center font-black transition cursor-pointer shadow-sm ${
                    foamLevel >= 3 ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'bg-white border-pink-300 hover:bg-pink-50'
                  }`}
                >
                  <span className="text-3xl mb-1">🧼</span>
                  <span className="text-xs sm:text-sm">Мильна піна</span>
                  <span className="text-[10px] mt-0.5">{foamLevel}/3 піни</span>
                </button>

                <button
                  onClick={() => handleTapDuck(0)}
                  disabled={!waterFilled}
                  className="p-3 rounded-2xl border-3 border-amber-300 bg-white hover:bg-amber-50 flex flex-col items-center font-black transition cursor-pointer shadow-sm"
                >
                  <span className="text-3xl mb-1">🦆</span>
                  <span className="text-xs sm:text-sm">Погратися</span>
                  <span className="text-[10px] mt-0.5">Кря-кря!</span>
                </button>
              </div>

              {waterFilled && foamLevel >= 2 && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => {
                    audio.playSparkle();
                    setStep('cozy_pajama');
                    audio.speakUkrainian('Тепер я чистенька! Одягнемо піжамку та візьмемо улюблену іграшку!', 'nicole');
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110 active:scale-95 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  <span>Одягнути піжамку 🧸</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              )}
            </div>
          )}

          {/* STEP 3: COZY PAJAMA & TOY */}
          {step === 'cozy_pajama' && (
            <div className="flex flex-col items-center gap-5 w-full max-w-xl">
              <NicoleCharacter
                size="md"
                mood="sleepy"
                appearance={appearance}
                speechText="Одягни мені зоряну піжамку та обери іграшку, з якою я спатиму!"
              />

              <div className="grid grid-cols-2 gap-4 w-full">
                {/* Pyjamas Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    audio.playSparkle();
                    setPajamaOn(true);
                    audio.speakUkrainian('Мʼякенька піжамка з хмаринками та зірочками!', 'nicole');
                  }}
                  className={`p-4 rounded-3xl border-3 flex flex-col items-center text-center transition shadow-md cursor-pointer ${
                    pajamaOn ? 'bg-purple-100 border-purple-500 ring-4 ring-purple-300' : 'bg-white border-pink-200'
                  }`}
                >
                  <span className="text-5xl mb-1">☁️</span>
                  <span className="text-sm font-black text-gray-800">Зоряна піжамка</span>
                  <span className="text-xs font-bold text-purple-700 mt-1">
                    {pajamaOn ? '✓ Одягнено!' : '+ Одягнути'}
                  </span>
                </motion.button>

                {/* Favorite plushie selection */}
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-black text-purple-900 uppercase">
                    Обери друга для снів:
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'kavusia', icon: '🐹', name: 'Кавуся' },
                      { id: 'teddy', icon: '🧸', name: 'Ведмедик' },
                      { id: 'bunny', icon: '🐰', name: 'Зайчик' },
                      { id: 'kitty', icon: '🐱', name: 'Котик' },
                    ].map((toy) => (
                      <button
                        key={toy.id}
                        onClick={() => {
                          if (toy.id === 'kavusia') {
                            audio.playGuineaPigSqueak();
                            audio.speakUkrainian('Моя улюблена свинка Кавуся солодко сопе поруч!', 'nicole');
                          } else {
                            audio.playPop(1.5);
                            audio.speakUkrainian(`Мій улюблений ${toy.name}!`, 'nicole');
                          }
                          setChosenPlushie(toy.id);
                        }}
                        className={`p-2 rounded-2xl border-2 flex flex-col items-center transition cursor-pointer shadow-sm ${
                          chosenPlushie === toy.id
                            ? 'bg-amber-100 border-amber-500 scale-105 ring-2 ring-amber-300'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <span className="text-2xl sm:text-3xl">{toy.icon}</span>
                        <span className="text-[10px] font-black">{toy.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {pajamaOn && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => {
                    audio.playSparkle();
                    setStep('bedtime_story');
                    audio.speakUkrainian('Вкладаємося в ліжечко! Почитай мені казку на добраніч!', 'nicole');
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:brightness-110 active:scale-95 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  <span>Казка на добраніч 📖</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              )}
            </div>
          )}

          {/* STEP 4: BEDTIME STORY & STARS */}
          {step === 'bedtime_story' && (
            <div className="flex flex-col items-center gap-5 w-full max-w-xl">
              <NicoleCharacter
                size="hero"
                mood="sleepy"
                appearance={appearance}
                speechText={
                  stageFinished
                    ? 'Солодких снів! Я бачу чарівні кольорові сни...'
                    : 'Увімкни нічничок, перегорни сторінки казки та порахуй зірочки у вікні!'
                }
              />

              {/* Night Nursery Scene Interactive Board */}
              <div className="w-full bg-indigo-900/90 text-white rounded-3xl p-5 border-4 border-indigo-400 shadow-2xl flex flex-col items-center gap-4">
                {/* Night Window with Stars */}
                <div className="relative w-full h-32 rounded-2xl bg-gradient-to-b from-indigo-950 to-purple-950 border-3 border-indigo-300 overflow-hidden flex items-center justify-around p-3">
                  <div className="text-4xl animate-pulse">🌙</div>

                  <div className="flex items-center gap-5">
                    {[0, 1, 2].map((idx) => {
                      const isCounted = starsCounted.includes(idx);
                      return (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.8 }}
                          onClick={() => handleCountStar(idx)}
                          className={`text-4xl cursor-pointer transition ${
                            isCounted ? 'scale-125 text-amber-300 drop-shadow-md' : 'opacity-40 text-gray-400'
                          }`}
                          title="Порахувати зірочку"
                        >
                          ⭐
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Nightlight and Storybook Buttons */}
                <div className="grid grid-cols-2 gap-3 w-full">
                  <button
                    onClick={handleToggleNightlight}
                    className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 font-black transition cursor-pointer ${
                      nightlightOn ? 'bg-amber-400 text-amber-950 border-amber-300 shadow-md' : 'bg-indigo-800/80 text-white border-indigo-600'
                    }`}
                  >
                    <span className="text-2xl">💡</span>
                    <span className="text-xs sm:text-sm">
                      {nightlightOn ? 'Нічник увімкнено ✨' : 'Увімкнути нічник'}
                    </span>
                  </button>

                  <button
                    onClick={handleTurnPage}
                    className="p-3 rounded-2xl border-2 border-purple-400 bg-purple-700/80 hover:bg-purple-600 text-white flex items-center justify-center gap-2 font-black transition cursor-pointer shadow-md"
                  >
                    <span className="text-2xl">📖</span>
                    <span className="text-xs sm:text-sm">Читати казку ({pagesTurned}/3)</span>
                  </button>
                </div>
              </div>

              {stageFinished && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-3 flex flex-col items-center gap-3"
                >
                  <div className="flex items-center gap-2 bg-yellow-100 border-2 border-yellow-400 py-1.5 px-4 rounded-full text-yellow-900 font-black text-sm">
                    <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
                    <span>Отримано наліпки: «Тепла ванна» та «Казка на добраніч»!</span>
                  </div>

                  <button
                    onClick={() => {
                      audio.playSparkle();
                      onFinishDay();
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-lg rounded-2xl shadow-2xl flex items-center gap-2 cursor-pointer"
                  >
                    <span>Переглянути наліпки та карту дня! 🌟</span>
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="relative z-10 pt-3 border-t border-purple-200 flex items-center justify-between">
          <button
            onClick={() => {
              audio.playPop();
              setUnpackedItems([]);
              setWaterFilled(false);
              setFoamLevel(0);
              setPajamaOn(false);
              setStarsCounted([]);
              setPagesTurned(0);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Спробувати знову</span>
          </button>

          <div className="flex items-center gap-1">
            <Moon className="w-4 h-4 text-purple-600 fill-purple-300" />
            <span className="text-xs sm:text-sm font-black text-purple-900">
              Теплий вечір вдома 🌙
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
