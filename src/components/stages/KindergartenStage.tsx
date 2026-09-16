import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { KindergartenSubStep, NicoleAppearance } from '../../types';
import { GAME_IMAGES } from '../../assets/images';
import { NicoleCharacter } from '../NicoleCharacter';
import { audio } from '../../utils/audio';

interface KindergartenStageProps {
  onComplete: (stickerIds: string[]) => void;
  onNextStage: () => void;
  appearance?: NicoleAppearance;
}

interface BlockItem {
  id: string;
  name: string;
  shape: string;
  color: string;
  bgClass: string;
  placed: boolean;
}

export const KindergartenStage: React.FC<KindergartenStageProps> = ({
  onComplete,
  onNextStage,
  appearance,
}) => {
  const [step, setStep] = useState<KindergartenSubStep>('greeting');
  const [greetedFriends, setGreetedFriends] = useState<string[]>([]);

  // Blocks Tower State
  const [blocks, setBlocks] = useState<BlockItem[]>([
    { id: 'b1', name: 'Червоний кубик', shape: '🟩', color: 'Червоний', bgClass: 'bg-rose-500 text-white', placed: false },
    { id: 'b2', name: 'Синій циліндр', shape: '🔵', color: 'Синій', bgClass: 'bg-blue-500 text-white', placed: false },
    { id: 'b3', name: 'Жовта зірочка', shape: '⭐', color: 'Жовтий', bgClass: 'bg-amber-400 text-amber-950', placed: false },
    { id: 'b4', name: 'Зелений дашок', shape: '🔺', color: 'Зелений', bgClass: 'bg-emerald-500 text-white', placed: false },
  ]);

  // Xylophone State
  const [notesPlayed, setNotesPlayed] = useState<number>(0);

  // Drawing Easel State
  const [stamps, setStamps] = useState<string[]>([]);

  const [earnedStickers, setEarnedStickers] = useState<string[]>([]);
  const [stageFinished, setStageFinished] = useState<boolean>(false);

  useEffect(() => {
    if (step === 'greeting') {
      audio.speakUkrainian('Привіт, садочок! Давай привітаємося з нашими друзями!', 'nicole');
    }
  }, [step]);

  // Friend greetings
  const handleGreetFriend = (id: string, name: string, greeting: string) => {
    if (greetedFriends.includes(id)) return;
    audio.playSparkle();
    audio.speakUkrainian(greeting, 'narrator');

    const updated = [...greetedFriends, id];
    setGreetedFriends(updated);

    if (updated.length >= 3) {
      audio.speakUkrainian('Всі друзі зібралися! Час будувати велику вежу з кубиків!', 'nicole');
    }
  };

  // Block placement
  const handlePlaceBlock = (block: BlockItem) => {
    if (block.placed) return;
    audio.playPop(1.3);
    audio.speakUkrainian(block.name, 'nicole');

    setBlocks(prev =>
      prev.map(b => (b.id === block.id ? { ...b, placed: true } : b))
    );

    const placedCount = blocks.filter(b => b.placed).length + 1;
    if (placedCount === blocks.length && !earnedStickers.includes('tower')) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      audio.playFanfare();
      audio.speakUkrainian('Ура! Ми збудували міцну і високу вежу! Яка краса!', 'nicole');
      setEarnedStickers(s => [...s, 'tower']);
    }
  };

  // Xylophone note press
  const handleXylophoneNote = (index: number, noteName: string) => {
    audio.playXylophone(index);
    const next = notesPlayed + 1;
    setNotesPlayed(next);

    if (next === 5 && !earnedStickers.includes('xylophone')) {
      audio.playSparkle();
      audio.speakUkrainian('Яка дзвінка та чарівна пісенька! Ніколь — справжній музикант!', 'narrator');
      setEarnedStickers(s => [...s, 'xylophone']);
    }
  };

  // Drawing stamps
  const handleAddStamp = (stampIcon: string, stampName: string) => {
    audio.playSparkle();
    audio.playPop(1.4);
    const next = [...stamps, stampIcon];
    setStamps(next);
    audio.speakUkrainian(`Намалювали ${stampName}!`, 'nicole');

    if (next.length >= 3 && !stageFinished) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      audio.playFanfare();
      audio.speakUkrainian('Який дивовижний малюнок! Покажемо матусі!', 'nicole');
      setStageFinished(true);
      onComplete(['tower', 'xylophone']);
    }
  };

  const stepsList: { id: KindergartenSubStep; label: string; icon: string }[] = [
    { id: 'greeting', label: 'Друзі', icon: '👫' },
    { id: 'blocks', label: 'Кубики', icon: '🧱' },
    { id: 'music', label: 'Музика', icon: '🎵' },
    { id: 'drawing', label: 'Малювання', icon: '🎨' },
  ];

  const xylophoneKeys = [
    { name: 'До', color: 'bg-rose-500 hover:bg-rose-600 text-white', height: 'h-48' },
    { name: 'Ре', color: 'bg-orange-500 hover:bg-orange-600 text-white', height: 'h-44' },
    { name: 'Мі', color: 'bg-amber-400 hover:bg-amber-500 text-amber-950', height: 'h-40' },
    { name: 'Фа', color: 'bg-emerald-500 hover:bg-emerald-600 text-white', height: 'h-36' },
    { name: 'Соль', color: 'bg-sky-500 hover:bg-sky-600 text-white', height: 'h-32' },
    { name: 'Ля', color: 'bg-indigo-500 hover:bg-indigo-600 text-white', height: 'h-28' },
    { name: 'Сі', color: 'bg-purple-500 hover:bg-purple-600 text-white', height: 'h-24' },
  ];

  return (
    <div className="relative min-h-[calc(100vh-65px)] bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 p-3 sm:p-6 flex flex-col items-center">
      {/* Steps Selector */}
      <div className="w-full max-w-2xl flex items-center justify-between gap-1.5 sm:gap-2 mb-4 bg-white/80 p-1.5 sm:p-2 rounded-2xl shadow-sm border border-indigo-200">
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
                  ? 'bg-indigo-500 text-white shadow-sm scale-102 border-2 border-indigo-600'
                  : 'bg-transparent text-gray-600 hover:bg-indigo-50'
              }`}
            >
              <span className="text-base sm:text-lg">{s.icon}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Container */}
      <div className="w-full max-w-3xl bg-white/95 rounded-3xl p-4 sm:p-6 shadow-xl border-3 border-indigo-200 flex flex-col flex-1 justify-between relative overflow-hidden">
        {/* Background Kindergarten art */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <img
            src={GAME_IMAGES.kindergarten}
            alt="Садочок"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Dynamic Content */}
        <div className="relative z-10 flex flex-col items-center flex-1 justify-center my-2">
          {/* STEP 1: GREETING FRIENDS */}
          {step === 'greeting' && (
            <div className="flex flex-col items-center gap-5 w-full max-w-lg">
              <NicoleCharacter
                size="md"
                mood="happy"
                appearance={appearance}
                speechText={
                  greetedFriends.length === 0
                    ? 'Привіт, друзі! Я рада вас бачити!'
                    : greetedFriends.length < 3
                    ? 'Ура, мої друзі тут! Пограємося!'
                    : 'Всі привіталися! Ходімо будувати вежу з кубиків!'
                }
              />

              {/* Friends Cards */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full">
                {[
                  { id: 'f1', name: 'Максимко', icon: '👦', role: 'Друг з ведмедиком', greeting: 'Привіт, Ніколь! Давай гратися разом!' },
                  { id: 'f2', name: 'Софійка', icon: '👧', role: 'Подружка з пензликом', greeting: 'Привіт, Ніколь! Я намалюю для тебе сонечко!' },
                  { id: 'f3', name: 'Олена Іванівна', icon: '👩‍🏫', role: 'Вихователька', greeting: 'Доброго ранку, люба Ніколь! Рада тебе бачити в садочку!' },
                ].map((f) => {
                  const isGreeted = greetedFriends.includes(f.id);
                  return (
                    <motion.button
                      key={f.id}
                      whileHover={!isGreeted ? { scale: 1.05 } : {}}
                      whileTap={!isGreeted ? { scale: 0.92 } : {}}
                      onClick={() => handleGreetFriend(f.id, f.name, f.greeting)}
                      className={`p-3 sm:p-4 rounded-3xl border-3 flex flex-col items-center text-center transition shadow-md cursor-pointer ${
                        isGreeted
                          ? 'bg-indigo-100 border-indigo-500 scale-102'
                          : 'bg-white border-amber-300 hover:border-indigo-400'
                      }`}
                    >
                      <span className="text-4xl sm:text-5xl mb-1">{f.icon}</span>
                      <span className="text-xs sm:text-sm font-black text-gray-800">
                        {f.name}
                      </span>
                      <span className="text-[10px] font-bold text-gray-500 mt-0.5">
                        {isGreeted ? '✓ Привітався' : f.role}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {greetedFriends.length >= 3 && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    audio.playSparkle();
                    setStep('blocks');
                    audio.speakUkrainian('Будуймо високу різнокольорову вежу з кубиків!', 'nicole');
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 active:scale-95 text-white font-black text-lg rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  <span>Будувати вежу 🧱</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              )}
            </div>
          )}

          {/* STEP 2: BLOCKS TOWER */}
          {step === 'blocks' && (
            <div className="flex flex-col items-center gap-4 w-full max-w-lg">
              <NicoleCharacter
                size="sm"
                mood="excited"
                appearance={appearance}
                speechText="Тисни на кубики внизу, щоб поставити їх один на один!"
              />

              {/* Tower View */}
              <div className="relative w-full h-56 bg-gradient-to-t from-amber-100 via-amber-50 to-sky-50 rounded-3xl border-4 border-amber-300 shadow-inner flex flex-col-reverse items-center justify-start p-3 gap-1.5 overflow-hidden">
                <div className="w-48 h-3 bg-amber-400 rounded-full"></div>

                {blocks.filter(b => b.placed).map((b) => (
                  <motion.div
                    key={b.id}
                    initial={{ y: -50, scale: 0 }}
                    animate={{ y: 0, scale: 1 }}
                    className={`w-36 h-10 sm:h-12 rounded-2xl ${b.bgClass} flex items-center justify-center font-black text-sm shadow-md border-2 border-white`}
                  >
                    <span className="text-xl mr-1">{b.shape}</span>
                    <span>{b.color}</span>
                  </motion.div>
                ))}
              </div>

              {/* Unplaced blocks selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
                {blocks.map((b) => (
                  <motion.button
                    key={b.id}
                    whileHover={!b.placed ? { scale: 1.05 } : {}}
                    whileTap={!b.placed ? { scale: 0.9 } : {}}
                    onClick={() => handlePlaceBlock(b)}
                    disabled={b.placed}
                    className={`p-3 rounded-2xl border-3 flex flex-col items-center text-center font-black transition cursor-pointer shadow-sm ${
                      b.placed
                        ? 'bg-gray-100 border-gray-300 text-gray-400 opacity-60'
                        : 'bg-white border-amber-300 hover:border-indigo-400'
                    }`}
                  >
                    <span className="text-3xl mb-1">{b.shape}</span>
                    <span className="text-xs">{b.color}</span>
                  </motion.button>
                ))}
              </div>

              {blocks.every(b => b.placed) && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    audio.playSparkle();
                    setStep('music');
                    audio.speakUkrainian('Вежа готова! А тепер зіграймо пісеньку на веселому ксилофоні!', 'nicole');
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-110 active:scale-95 text-white font-black text-lg rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  <span>Грати музику 🎵</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              )}
            </div>
          )}

          {/* STEP 3: XYLOPHONE */}
          {step === 'music' && (
            <div className="flex flex-col items-center gap-4 w-full max-w-xl">
              <NicoleCharacter
                size="sm"
                mood="excited"
                appearance={appearance}
                speechText="Торкайся різнокольорових клавіш та слухай чарівну музику!"
              />

              {/* Xylophone Instrument */}
              <div className="flex items-end justify-center gap-2 sm:gap-3 p-4 bg-amber-100 rounded-3xl border-4 border-amber-300 shadow-xl w-full">
                {xylophoneKeys.map((k, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleXylophoneNote(idx, k.name)}
                    className={`${k.height} w-10 sm:w-14 rounded-2xl ${k.color} border-3 border-white shadow-lg flex flex-col items-center justify-between py-2 transition active:brightness-125 cursor-pointer`}
                  >
                    <span className="w-3 h-3 rounded-full bg-white/70"></span>
                    <span className="font-black text-xs sm:text-sm drop-shadow-sm">{k.name}</span>
                    <span className="w-3 h-3 rounded-full bg-white/70"></span>
                  </motion.button>
                ))}
              </div>

              {notesPlayed >= 5 && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    audio.playSparkle();
                    setStep('drawing');
                    audio.speakUkrainian('Час малювати на мольберті яскравими фарбами!', 'nicole');
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 active:scale-95 text-white font-black text-lg rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  <span>Малювати фарбами 🎨</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              )}
            </div>
          )}

          {/* STEP 4: DRAWING EASEL */}
          {step === 'drawing' && (
            <div className="flex flex-col items-center gap-4 w-full max-w-xl">
              <NicoleCharacter
                size="sm"
                mood="happy"
                appearance={appearance}
                speechText="Тисни на штампики з сонечком, веселкою та метеликом, щоб намалювати картину!"
              />

              {/* Painting Easel Canvas */}
              <div className="w-full h-48 sm:h-56 bg-white rounded-3xl border-6 border-amber-300 shadow-inner p-4 flex flex-wrap items-center justify-around relative overflow-hidden">
                {stamps.length === 0 ? (
                  <span className="text-gray-400 font-bold text-sm">
                    Торкайся штампиків внизу, щоб додати фарби!
                  </span>
                ) : (
                  stamps.map((s, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="text-5xl sm:text-6xl p-2 animate-bounce"
                    >
                      {s}
                    </motion.div>
                  ))
                )}
              </div>

              {/* Stamp Palette Buttons */}
              <div className="grid grid-cols-4 gap-2.5 w-full">
                {[
                  { icon: '☀️', name: 'Сонечко' },
                  { icon: '🌈', name: 'Веселку' },
                  { icon: '🌸', name: 'Квіточку' },
                  { icon: '🦋', name: 'Метелика' },
                ].map((item, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.88 }}
                    onClick={() => handleAddStamp(item.icon, item.name)}
                    className="p-3 bg-gradient-to-tr from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 rounded-2xl border-3 border-purple-300 shadow-sm flex flex-col items-center font-black text-xs cursor-pointer"
                  >
                    <span className="text-3xl mb-0.5">{item.icon}</span>
                    <span>{item.name}</span>
                  </motion.button>
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
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 active:scale-95 text-white font-black text-lg rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer mt-2"
                >
                  <span>Йдемо в парк на самокаті! 🛴</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-3 border-t border-indigo-200 flex items-center justify-between">
          <button
            onClick={() => {
              audio.playPop();
              setGreetedFriends([]);
              setBlocks(b => b.map(x => ({ ...x, placed: false })));
              setNotesPlayed(0);
              setStamps([]);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Спробувати знову</span>
          </button>

          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-indigo-500 fill-indigo-400" />
            <span className="text-xs sm:text-sm font-black text-indigo-900">
              Веселий садочок 🎨
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
