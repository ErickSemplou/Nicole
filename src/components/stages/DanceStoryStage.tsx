import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Star,
  Check,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Heart,
  Volume2,
  RefreshCw,
  Award,
  Music,
  Play,
  RotateCcw,
} from 'lucide-react';
import { DanceStageId, NicoleAppearance } from '../../types';
import { NicoleAvatar } from '../NicoleAvatar';
import { audio } from '../../utils/audio';

interface DanceStoryStageProps {
  stageId: DanceStageId;
  onComplete: (stickers: string[]) => void;
  onNextStage?: () => void;
  onPrevStage?: () => void;
  onGoToMap: () => void;
  appearance: NicoleAppearance;
}

export const DanceStoryStage: React.FC<DanceStoryStageProps> = ({
  stageId,
  onComplete,
  onNextStage,
  onPrevStage,
  onGoToMap,
  appearance,
}) => {
  const [subStep, setSubStep] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [speechText, setSpeechText] = useState<string>('');

  // 1. DRESSING ROOM STATE
  const [selectedLeotard, setSelectedLeotard] = useState<string>('pink_ballet');
  const [selectedTutu, setSelectedTutu] = useState<string>('pink_fluffy');
  const [selectedShoes, setSelectedShoes] = useState<string>('pointes');
  const [selectedAccessory, setSelectedAccessory] = useState<string>('bow');
  const [bagPackedItems, setBagPackedItems] = useState<string[]>([]);

  // 2. WARMUP STATE
  const [headTiltCount, setHeadTiltCount] = useState<number>(0);
  const [butterflyFlaps, setButterflyFlaps] = useState<number>(0);
  const [toeTouchesCount, setToeTouchesCount] = useState<number>(0);
  const [plieCount, setPlieCount] = useState<number>(0);
  const [activeExercise, setActiveExercise] = useState<'head' | 'butterfly' | 'toes' | 'plie'>('head');

  // 3. DANCE MOVES & CHOREOGRAPHY STATE
  const [danceSequence, setDanceSequence] = useState<string[]>([]);
  const [currentDanceMove, setCurrentDanceMove] = useState<string | null>(null);
  const [isPlayingDance, setIsPlayingDance] = useState<boolean>(false);
  const [selectedRhythm, setSelectedRhythm] = useState<'waltz' | 'disco' | 'hiphop' | 'music_box'>('disco');

  // 4. WATER DRINKING STATE
  const [bottleFilled, setBottleFilled] = useState<boolean>(false);
  const [waterIngredients, setWaterIngredients] = useState<string[]>([]);
  const [hydrationSips, setHydrationSips] = useState<number>(0);

  // 5. STAGE PERFORMANCE STATE
  const [spotlightColor, setSpotlightColor] = useState<string>('pink');
  const [isPerforming, setIsPerforming] = useState<boolean>(false);
  const [performanceDone, setPerformanceDone] = useState<boolean>(false);
  const [flowersGiven, setFlowersGiven] = useState<boolean>(false);
  const [medalReceived, setMedalReceived] = useState<boolean>(false);

  // Initialize speech & audio on stage change
  useEffect(() => {
    setSubStep(0);
    setIsCompleted(false);

    if (stageId === 'dance_dressing') {
      const msg = 'Ура! Ніколь прийшла у затишну роздягальню танцювальної студії! Обери найгарніше вбрання балерини та склади сумочку!';
      setSpeechText(msg);
      audio.playBalletPirouette();
      audio.speakUkrainian(msg, 'nicole');
    } else if (stageId === 'dance_warmup') {
      const msg = 'Перед танцями обовʼязково треба розімʼятися! Зробімо вправи: голівка, метелик, нахили та пліє біля станка!';
      setSpeechText(msg);
      audio.playStretchingChime();
      audio.speakUkrainian(msg, 'nicole');
    } else if (stageId === 'dance_moves') {
      const msg = 'Час творчості! Склади свій власний танець із піруетів, хвиль та стрибків під улюблену музику!';
      setSpeechText(msg);
      audio.playDanceBeat('disco');
      audio.speakUkrainian(msg, 'nicole');
    } else if (stageId === 'dance_water') {
      const msg = 'Після активних рухів час попити смачної освіжаючої водички! Налий воду у пляшечку, додай лимончик та ягідки!';
      setSpeechText(msg);
      audio.speakUkrainian(msg, 'nicole');
    } else if (stageId === 'dance_performance') {
      const msg = 'Свято починається! Ніколь виходить на велику сцену під софітами! Глядачі аплодують найкращій танцівниці!';
      setSpeechText(msg);
      audio.playApplauseCheer();
      audio.speakUkrainian(msg, 'nicole');
    }
  }, [stageId]);

  const handleFinishStage = (earnedStickers: string[]) => {
    setIsCompleted(true);
    audio.playFanfare();
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 },
    });
    onComplete(earnedStickers);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-4 flex flex-col items-center">
      {/* Top Banner Navigation */}
      <div className="w-full flex items-center justify-between gap-2 mb-3 bg-white/90 backdrop-blur-xs p-2.5 sm:p-3.5 rounded-2xl border-2 border-pink-200 shadow-xs">
        <button
          onClick={() => {
            audio.playPop();
            onGoToMap();
          }}
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-black text-xs transition flex items-center gap-1 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>До мапи</span>
        </button>

        <div className="text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
            🩰 Історія: Похід на танці
          </span>
          <h2 className="text-sm sm:text-base font-black text-gray-900 mt-0.5">
            {stageId === 'dance_dressing' && '1. Вбрання балерини та роздягальня 👗'}
            {stageId === 'dance_warmup' && '2. Танцювальна розминка біля дзеркала 🧘‍♀️'}
            {stageId === 'dance_moves' && '3. Студія хореографії та створення танцю 💃'}
            {stageId === 'dance_water' && '4. Смачна освіжаюча водичка 🥤'}
            {stageId === 'dance_performance' && '5. Великий виступ на сцені під оплески 🏆'}
          </h2>
        </div>

        <div className="flex items-center gap-1 bg-pink-50 px-2.5 py-1 rounded-xl border border-pink-200">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span className="text-xs font-black text-pink-700">
            {stageId === 'dance_dressing' && '1/5'}
            {stageId === 'dance_warmup' && '2/5'}
            {stageId === 'dance_moves' && '3/5'}
            {stageId === 'dance_water' && '4/5'}
            {stageId === 'dance_performance' && '5/5'}
          </span>
        </div>
      </div>

      {/* Nicole Speech Bubble */}
      <div className="w-full mb-3 bg-gradient-to-r from-pink-100 via-rose-50 to-purple-100 border-2 border-pink-300 rounded-2xl p-3 sm:p-4 shadow-xs flex items-center gap-3">
        <div className="w-12 h-12 rounded-full border-2 border-pink-400 overflow-hidden shrink-0 bg-pink-200">
          <NicoleAvatar appearance={appearance} size="sm" />
        </div>
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-bold text-gray-800 leading-snug">
            {speechText}
          </p>
        </div>
        <button
          onClick={() => {
            audio.playSparkle();
            audio.speakUkrainian(speechText, 'nicole');
          }}
          className="p-2 rounded-xl bg-white hover:bg-pink-50 border border-pink-200 text-pink-600 transition cursor-pointer shrink-0"
          title="Озвучити ще раз"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Stage Content Container */}
      <div className="w-full bg-white/95 backdrop-blur-xs border-3 border-pink-200 rounded-3xl p-3.5 sm:p-6 shadow-xl min-h-[420px] flex flex-col justify-between">
        {/* ========================================================================= */}
        {/* 1. DRESSING ROOM STAGE */}
        {/* ========================================================================= */}
        {stageId === 'dance_dressing' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Left Column: Nicole Preview in Chosen Dance Outfit */}
              <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-pink-50 to-purple-50 rounded-2xl border-2 border-pink-200">
                <div className="relative w-44 h-56 flex items-center justify-center">
                  <NicoleAvatar appearance={appearance} size="lg" />
                  {/* Floating ballet elements */}
                  <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                    className="absolute -top-2 -right-2 text-2xl"
                  >
                    ✨
                  </motion.div>
                  <motion.div
                    animate={{ rotate: [-8, 8, -8] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -bottom-1 -left-2 text-2xl"
                  >
                    🩰
                  </motion.div>
                </div>

                <div className="mt-2 text-center">
                  <span className="inline-block px-3 py-1 bg-pink-500 text-white font-black text-xs rounded-full shadow-xs">
                    Ніколь готова до танців!
                  </span>
                </div>
              </div>

              {/* Right Column: Outfit Choices & Dance Bag */}
              <div className="space-y-3">
                {/* Leotard Picker */}
                <div>
                  <label className="text-xs font-black text-gray-700 block mb-1">
                    1. Обери танцювальний боді:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'pink_ballet', label: 'Ніжно-рожевий', emoji: '🩰', color: 'bg-pink-100 border-pink-400 text-pink-900' },
                      { id: 'purple_glitter', label: 'Бузковий сяючий', emoji: '✨', color: 'bg-purple-100 border-purple-400 text-purple-900' },
                      { id: 'mint_sport', label: 'Мʼятний енергійний', emoji: '🌿', color: 'bg-emerald-100 border-emerald-400 text-emerald-900' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          audio.playPop();
                          setSelectedLeotard(item.id);
                        }}
                        className={`p-2 rounded-xl border-2 text-xs font-black flex flex-col items-center gap-1 transition cursor-pointer ${
                          selectedLeotard === item.id ? 'ring-2 ring-pink-400 scale-102 ' + item.color : 'bg-gray-50 border-gray-200 text-gray-600'
                        }`}
                      >
                        <span className="text-lg">{item.emoji}</span>
                        <span className="text-[10px] text-center leading-tight">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tutu Skirt Picker */}
                <div>
                  <label className="text-xs font-black text-gray-700 block mb-1">
                    2. Фатинова спідничка-пачка (Tutu):
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'pink_fluffy', label: 'Пишна рожева', emoji: '🌸' },
                      { id: 'rainbow_fairy', label: 'Райдужна фея', emoji: '🌈' },
                      { id: 'white_swan', label: 'Білий лебідь', emoji: '🦢' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          audio.playPop();
                          setSelectedTutu(item.id);
                        }}
                        className={`p-2 rounded-xl border-2 text-xs font-black flex flex-col items-center gap-1 transition cursor-pointer ${
                          selectedTutu === item.id ? 'bg-pink-100 border-pink-400 text-pink-900 ring-2 ring-pink-300' : 'bg-gray-50 border-gray-200 text-gray-600'
                        }`}
                      >
                        <span className="text-lg">{item.emoji}</span>
                        <span className="text-[10px] text-center leading-tight">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shoes Picker */}
                <div>
                  <label className="text-xs font-black text-gray-700 block mb-1">
                    3. Взуття:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'pointes', label: 'Шовкові пуанти', emoji: '🩰' },
                      { id: 'cheshki', label: 'Мʼякі чешки', emoji: '🥿' },
                      { id: 'sneakers', label: 'Хіп-хоп кросівки', emoji: '👟' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          audio.playPop();
                          setSelectedShoes(item.id);
                        }}
                        className={`p-2 rounded-xl border-2 text-xs font-black flex flex-col items-center gap-1 transition cursor-pointer ${
                          selectedShoes === item.id ? 'bg-pink-100 border-pink-400 text-pink-900 ring-2 ring-pink-300' : 'bg-gray-50 border-gray-200 text-gray-600'
                        }`}
                      >
                        <span className="text-lg">{item.emoji}</span>
                        <span className="text-[10px] text-center leading-tight">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Dance Bag Checklist */}
            <div className="p-3 bg-pink-50 rounded-2xl border-2 border-pink-200">
              <h4 className="text-xs font-black text-pink-900 mb-2 flex items-center gap-1">
                <span>🎒 Склади танцювальну сумочку (натисни на предмети):</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'water_bottle', name: 'Пляшечка для води', emoji: '🍶' },
                  { id: 'soft_towel', name: 'Мʼякий рушничок', emoji: '🧼' },
                  { id: 'hair_ribbon', name: 'Рожева стрічка', emoji: '🎀' },
                  { id: 'teddy_talisman', name: 'Ведмедик-талісман', emoji: '🧸' },
                ].map((item) => {
                  const isPacked = bagPackedItems.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        audio.playPop();
                        if (isPacked) {
                          setBagPackedItems(bagPackedItems.filter((i) => i !== item.id));
                        } else {
                          audio.playSparkle();
                          setBagPackedItems([...bagPackedItems, item.id]);
                        }
                      }}
                      className={`p-2.5 rounded-xl border-2 font-black text-xs flex items-center justify-between transition cursor-pointer ${
                        isPacked
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-900 shadow-xs'
                          : 'bg-white border-pink-200 text-gray-700 hover:border-pink-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl">{item.emoji}</span>
                        <span className="text-[11px] text-left leading-tight">{item.name}</span>
                      </div>
                      {isPacked && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Complete button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={() => {
                  handleFinishStage(['sticker_ballet_dress', 'sticker_dance_shoes']);
                  setSpeechText('Чудово! Вбрання одягнено, сумочка зібрана! Час переходити до розминки!');
                }}
                disabled={bagPackedItems.length < 2}
                className={`px-6 py-3 rounded-2xl font-black text-sm transition flex items-center gap-2 shadow-md cursor-pointer ${
                  bagPackedItems.length >= 2
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span>Йдемо на розминку!</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. DANCE WARMUP STAGE */}
        {/* ========================================================================= */}
        {stageId === 'dance_warmup' && (
          <div className="space-y-4">
            {/* Exercise Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'head', name: '1. Голівка «Тік-так»', emoji: '⏰', progress: headTiltCount, target: 4 },
                { id: 'butterfly', name: '2. Поза Метелика', emoji: '🦋', progress: butterflyFlaps, target: 5 },
                { id: 'toes', name: '3. До носочків', emoji: '⭐', progress: toeTouchesCount, target: 4 },
                { id: 'plie', name: '4. Пліє біля станка', emoji: '🩰', progress: plieCount, target: 4 },
              ].map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    audio.playPop();
                    setActiveExercise(ex.id as any);
                  }}
                  className={`p-2.5 rounded-2xl border-2 font-black text-xs flex flex-col items-center gap-1 transition cursor-pointer ${
                    activeExercise === ex.id
                      ? 'bg-pink-500 text-white border-pink-600 shadow-md scale-102'
                      : ex.progress >= ex.target
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-pink-50'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span>{ex.emoji}</span>
                    <span className="text-[11px] truncate">{ex.name}</span>
                  </div>
                  <span className="text-[10px] font-bold opacity-85">
                    {ex.progress >= ex.target ? '✅ Виконано' : `${ex.progress}/${ex.target}`}
                  </span>
                </button>
              ))}
            </div>

            {/* Exercise Interactive Arena */}
            <div className="p-4 sm:p-6 bg-gradient-to-b from-purple-50 via-pink-50 to-amber-50 rounded-3xl border-2 border-pink-200 flex flex-col items-center justify-center min-h-[220px]">
              {/* Exercise 1: Head roll */}
              {activeExercise === 'head' && (
                <div className="text-center space-y-3">
                  <motion.div
                    animate={{ rotate: headTiltCount % 2 === 0 ? -15 : 15 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-24 h-24 mx-auto bg-pink-100 rounded-full flex items-center justify-center text-5xl shadow-inner border-2 border-pink-300"
                  >
                    👧
                  </motion.div>
                  <p className="text-xs sm:text-sm font-bold text-gray-700">
                    Нахиляй голівку вправо та вліво, як годинник! «Тік-так, тік-так!»
                  </p>
                  <button
                    onClick={() => {
                      audio.playStretchingChime();
                      const next = headTiltCount + 1;
                      setHeadTiltCount(next);
                      if (next >= 4) audio.playSparkle();
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer active:scale-95"
                  >
                    Нахилити голівку ({headTiltCount}/4) ⏰
                  </button>
                </div>
              )}

              {/* Exercise 2: Butterfly Pose */}
              {activeExercise === 'butterfly' && (
                <div className="text-center space-y-3">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-24 h-24 mx-auto bg-purple-100 rounded-full flex items-center justify-center text-5xl shadow-inner border-2 border-purple-300"
                  >
                    🦋
                  </motion.div>
                  <p className="text-xs sm:text-sm font-bold text-gray-700">
                    Сидимо на килимку, зʼєднуємо стопи разом і махаємо крильцями метелика!
                  </p>
                  <button
                    onClick={() => {
                      audio.playStretchingChime();
                      const next = butterflyFlaps + 1;
                      setButterflyFlaps(next);
                      if (next >= 5) audio.playSparkle();
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer active:scale-95"
                  >
                    Махати крильцями ({butterflyFlaps}/5) 🦋
                  </button>
                </div>
              )}

              {/* Exercise 3: Toe touches */}
              {activeExercise === 'toes' && (
                <div className="text-center space-y-3">
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="w-24 h-24 mx-auto bg-amber-100 rounded-full flex items-center justify-center text-5xl shadow-inner border-2 border-amber-300"
                  >
                    ⭐
                  </motion.div>
                  <p className="text-xs sm:text-sm font-bold text-gray-700">
                    Тягнемося прямими ніжками та ручками вперед до чарівних зірочок!
                  </p>
                  <button
                    onClick={() => {
                      audio.playSparkle();
                      const next = toeTouchesCount + 1;
                      setToeTouchesCount(next);
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer active:scale-95"
                  >
                    Дотягнутися до зірочки ({toeTouchesCount}/4) ⭐
                  </button>
                </div>
              )}

              {/* Exercise 4: Plie at the bar */}
              {activeExercise === 'plie' && (
                <div className="text-center space-y-3">
                  <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-24 h-24 mx-auto bg-rose-100 rounded-full flex items-center justify-center text-5xl shadow-inner border-2 border-rose-300"
                  >
                    🩰
                  </motion.div>
                  <p className="text-xs sm:text-sm font-bold text-gray-700">
                    Тримаємося ручкою за станок: ніжне пліє та підйом на носочки!
                  </p>
                  <button
                    onClick={() => {
                      audio.playBalletPirouette();
                      const next = plieCount + 1;
                      setPlieCount(next);
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer active:scale-95"
                  >
                    Зробити пліє біля станка ({plieCount}/4) 🩰
                  </button>
                </div>
              )}
            </div>

            {/* Finish Warmup button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={() => {
                  handleFinishStage(['sticker_warmup_butterfly', 'sticker_dance_flexibility']);
                  setSpeechText('Усі мʼязи розігріті та гнучкі! Тепер починаємо складати справжній танець!');
                }}
                disabled={headTiltCount < 2 || butterflyFlaps < 2 || toeTouchesCount < 2 || plieCount < 2}
                className={`px-6 py-3 rounded-2xl font-black text-sm transition flex items-center gap-2 shadow-md cursor-pointer ${
                  headTiltCount >= 2 && butterflyFlaps >= 2 && toeTouchesCount >= 2 && plieCount >= 2
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span>Перейти до студії танцю!</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. DANCE MOVES & CHOREOGRAPHY STAGE */}
        {/* ========================================================================= */}
        {stageId === 'dance_moves' && (
          <div className="space-y-4">
            {/* Music Rhythm Selector */}
            <div className="p-3 bg-indigo-50 rounded-2xl border-2 border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-black text-indigo-900">Музичний ритм для танцю:</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'disco', name: 'Диско-біт 🪩' },
                  { id: 'waltz', name: 'Вальс метеликів 🦋' },
                  { id: 'hiphop', name: 'Хіп-хоп поп 🎧' },
                  { id: 'music_box', name: 'Музична шкатулка 🎶' },
                ].map((rhythm) => (
                  <button
                    key={rhythm.id}
                    onClick={() => {
                      setSelectedRhythm(rhythm.id as any);
                      audio.playDanceBeat(rhythm.id as any);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                      selectedRhythm === rhythm.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
                    }`}
                  >
                    {rhythm.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Dance Studio Stage Simulator */}
            <div className="relative p-6 bg-gradient-to-b from-indigo-950 via-purple-900 to-pink-900 rounded-3xl border-3 border-indigo-400 flex flex-col items-center justify-center min-h-[220px] text-white overflow-hidden shadow-inner">
              {/* Stage Lights */}
              <div className="absolute top-0 inset-x-0 flex justify-around opacity-40">
                <div className="w-16 h-32 bg-pink-400 blur-2xl transform -rotate-12" />
                <div className="w-16 h-32 bg-yellow-400 blur-2xl" />
                <div className="w-16 h-32 bg-purple-400 blur-2xl transform rotate-12" />
              </div>

              {/* Nicole Dancing Animation */}
              <div className="relative z-10 flex flex-col items-center">
                <motion.div
                  animate={
                    currentDanceMove === 'pirouette'
                      ? { rotateY: [0, 360], scale: [1, 1.1, 1] }
                      : currentDanceMove === 'wave'
                      ? { x: [-15, 15, -15], rotate: [-8, 8, -8] }
                      : currentDanceMove === 'disco_jump'
                      ? { y: [0, -25, 0], scale: [1, 1.15, 1] }
                      : currentDanceMove === 'arabesque'
                      ? { rotate: [0, -12, 0], y: [0, -5, 0] }
                      : currentDanceMove === 'star_jump'
                      ? { scale: [1, 1.3, 1], y: [0, -30, 0] }
                      : currentDanceMove === 'curtsey'
                      ? { y: [0, 15, 0], scale: [1, 0.95, 1] }
                      : { y: [-4, 4, -4] }
                  }
                  transition={{ duration: 0.8 }}
                  className="w-36 h-44 flex items-center justify-center"
                >
                  <NicoleAvatar appearance={appearance} size="lg" />
                </motion.div>

                {currentDanceMove && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-2 px-3 py-1 bg-white/25 backdrop-blur-xs rounded-full font-black text-xs text-yellow-300 border border-white/40 flex items-center gap-1"
                  >
                    <span>✨ Рух:</span>
                    <span>
                      {currentDanceMove === 'pirouette' && '🩰 Сяючий Пірует!'}
                      {currentDanceMove === 'wave' && '🌊 Райдужна хвиля ручками!'}
                      {currentDanceMove === 'disco_jump' && '💃 Диско-стрибок!'}
                      {currentDanceMove === 'arabesque' && '🤸 Ластівка балерини!'}
                      {currentDanceMove === 'star_jump' && '⭐ Стрибок-зірочка!'}
                      {currentDanceMove === 'curtsey' && '👑 Королівський реверанс!'}
                    </span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Dance Move Buttons */}
            <div>
              <label className="text-xs font-black text-gray-700 block mb-1.5">
                Обери та додай танцювальні рухи до свого танцю:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { id: 'pirouette', name: 'Пірует', emoji: '🩰' },
                  { id: 'wave', name: 'Хвиля', emoji: '🌊' },
                  { id: 'disco_jump', name: 'Диско-рух', emoji: '💃' },
                  { id: 'arabesque', name: 'Ластівка', emoji: '🤸' },
                  { id: 'star_jump', name: 'Зірочка', emoji: '⭐' },
                  { id: 'curtsey', name: 'Реверанс', emoji: '👑' },
                ].map((move) => (
                  <button
                    key={move.id}
                    onClick={() => {
                      audio.playPop();
                      setCurrentDanceMove(move.id);
                      audio.playDanceBeat(selectedRhythm);
                      if (danceSequence.length < 8) {
                        setDanceSequence([...danceSequence, move.id]);
                      }
                    }}
                    className="p-2 rounded-xl bg-pink-50 hover:bg-pink-100 border-2 border-pink-200 text-pink-950 font-black text-xs flex flex-col items-center gap-1 transition cursor-pointer active:scale-90"
                  >
                    <span className="text-xl">{move.emoji}</span>
                    <span className="text-[10px] truncate">{move.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sequence Timeline Bar */}
            <div className="p-3 bg-pink-50 rounded-2xl border-2 border-pink-200 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                <span className="text-xs font-black text-pink-900 shrink-0">Твій танець:</span>
                {danceSequence.length === 0 ? (
                  <span className="text-xs font-bold text-gray-400">
                    (натисни рухи вгорі, щоб додати їх)
                  </span>
                ) : (
                  danceSequence.map((m, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-white text-pink-700 border border-pink-300 rounded-lg text-xs font-black shrink-0"
                    >
                      {m === 'pirouette' && '🩰'}
                      {m === 'wave' && '🌊'}
                      {m === 'disco_jump' && '💃'}
                      {m === 'arabesque' && '🤸'}
                      {m === 'star_jump' && '⭐'}
                      {m === 'curtsey' && '👑'} {idx + 1}
                    </span>
                  ))
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {danceSequence.length > 0 && (
                  <button
                    onClick={() => {
                      audio.playPop();
                      setDanceSequence([]);
                    }}
                    className="p-1.5 rounded-xl bg-white border border-pink-200 text-pink-600 hover:bg-pink-100 transition cursor-pointer"
                    title="Очистити"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => {
                    if (danceSequence.length === 0) return;
                    setIsPlayingDance(true);
                    audio.playBalletPirouette();
                    let step = 0;
                    const interval = setInterval(() => {
                      if (step < danceSequence.length) {
                        setCurrentDanceMove(danceSequence[step]);
                        audio.playDanceBeat(selectedRhythm);
                        step++;
                      } else {
                        clearInterval(interval);
                        setIsPlayingDance(false);
                        audio.playCelebrationFanfare();
                      }
                    }, 800);
                  }}
                  disabled={danceSequence.length === 0 || isPlayingDance}
                  className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white font-black text-xs rounded-xl transition flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Танцювати свій танець!</span>
                </button>
              </div>
            </div>

            {/* Complete stage button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={() => {
                  handleFinishStage(['sticker_dance_choreography', 'sticker_ballet_star']);
                  setSpeechText('Який неймовірний танець ми створили! А тепер час попити смачної водички!');
                }}
                disabled={danceSequence.length < 3}
                className={`px-6 py-3 rounded-2xl font-black text-sm transition flex items-center gap-2 shadow-md cursor-pointer ${
                  danceSequence.length >= 3
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span>Час попити водички!</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. DANCE WATER DRINKING STAGE */}
        {/* ========================================================================= */}
        {stageId === 'dance_water' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Left: Water Bottle Interactive Display */}
              <div className="p-5 bg-gradient-to-b from-sky-50 to-blue-50 rounded-3xl border-2 border-sky-200 flex flex-col items-center justify-center">
                <div className="relative w-32 h-56 bg-white/70 rounded-full border-4 border-sky-300 overflow-hidden shadow-inner flex flex-col justify-end p-2">
                  {/* Bottle Cap */}
                  <div className="absolute top-0 inset-x-8 h-6 bg-pink-400 rounded-b-xl border-2 border-pink-500" />

                  {/* Water Fill Level */}
                  <motion.div
                    initial={{ height: '0%' }}
                    animate={{ height: bottleFilled ? (hydrationSips > 0 ? `${Math.max(15, 80 - hydrationSips * 20)}%` : '80%') : '0%' }}
                    transition={{ duration: 0.6 }}
                    className="w-full bg-gradient-to-t from-sky-400 to-cyan-200 rounded-b-full flex flex-col items-center justify-center relative overflow-hidden"
                  >
                    {/* Floating Fruit Elements in Water */}
                    {waterIngredients.map((ing, idx) => (
                      <motion.span
                        key={idx}
                        animate={{ y: [-3, 3, -3], rotate: [-10, 10, -10] }}
                        transition={{ repeat: Infinity, duration: 2, delay: idx * 0.2 }}
                        className="text-xl"
                      >
                        {ing === 'lemon' && '🍋'}
                        {ing === 'strawberry' && '🍓'}
                        {ing === 'mint' && '🌿'}
                        {ing === 'berries' && '🫐'}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>

                {/* Hydration Bar */}
                <div className="w-full mt-3">
                  <div className="flex items-center justify-between text-[11px] font-black text-sky-900 mb-1">
                    <span>Рівень бадьорості та енергії:</span>
                    <span>{hydrationSips * 33 > 100 ? 100 : hydrationSips * 33}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: `${Math.min(100, hydrationSips * 34)}%` }}
                      className="h-full bg-gradient-to-r from-sky-400 to-emerald-400"
                    />
                  </div>
                </div>
              </div>

              {/* Right: Step-by-step Preparation & Drinking */}
              <div className="space-y-3">
                {/* Step 1: Fill Water */}
                <div className="p-3 bg-white rounded-2xl border-2 border-sky-200">
                  <span className="text-xs font-black text-sky-900 block mb-1.5">
                    1. Налий чисту прохолодну водичку:
                  </span>
                  <button
                    onClick={() => {
                      audio.playWaterSplash();
                      setBottleFilled(true);
                      audio.speakUkrainian('Буль-буль! Чиста водичка налита!', 'nicole');
                    }}
                    className={`w-full py-2 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      bottleFilled
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-sky-500 hover:bg-sky-600 text-white shadow-xs active:scale-95'
                    }`}
                  >
                    <span>💧</span>
                    <span>{bottleFilled ? 'Водичку налито! ✅' : 'Налити воду у пляшечку'}</span>
                  </button>
                </div>

                {/* Step 2: Add healthy fruits */}
                <div className="p-3 bg-white rounded-2xl border-2 border-sky-200">
                  <span className="text-xs font-black text-sky-900 block mb-1.5">
                    2. Додай смачні вітамінні фрукти та мʼяту:
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'lemon', name: 'Лимончик', emoji: '🍋' },
                      { id: 'strawberry', name: 'Полуничка', emoji: '🍓' },
                      { id: 'mint', name: 'Мʼята', emoji: '🌿' },
                      { id: 'berries', name: 'Ожина', emoji: '🫐' },
                    ].map((item) => {
                      const isAdded = waterIngredients.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          disabled={!bottleFilled}
                          onClick={() => {
                            audio.playPop();
                            if (isAdded) {
                              setWaterIngredients(waterIngredients.filter((i) => i !== item.id));
                            } else {
                              audio.playSparkle();
                              setWaterIngredients([...waterIngredients, item.id]);
                            }
                          }}
                          className={`p-1.5 rounded-xl border-2 text-center font-black text-[10px] flex flex-col items-center gap-0.5 transition cursor-pointer ${
                            isAdded
                              ? 'bg-amber-100 border-amber-400 text-amber-900 ring-1 ring-amber-300'
                              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-sky-50'
                          }`}
                        >
                          <span className="text-xl">{item.emoji}</span>
                          <span>{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3: Drink Refreshing Water */}
                <div className="p-3 bg-white rounded-2xl border-2 border-sky-200">
                  <span className="text-xs font-black text-sky-900 block mb-1.5">
                    3. Пий водичку та відновлюй сили:
                  </span>
                  <button
                    disabled={!bottleFilled || waterIngredients.length === 0}
                    onClick={() => {
                      audio.playWaterGulp();
                      const next = hydrationSips + 1;
                      setHydrationSips(next);
                      if (next >= 3) {
                        audio.playSparkle();
                        audio.speakUkrainian('Ах, як освіжає та смачно! Тепер Ніколь готова виходити на велику сцену!', 'nicole');
                      }
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow-sm ${
                      bottleFilled && waterIngredients.length > 0
                        ? 'bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white cursor-pointer active:scale-95'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <span>🥤</span>
                    <span>Пити смачну водичку ({hydrationSips}/3)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Complete button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={() => {
                  handleFinishStage(['sticker_fresh_water', 'sticker_energy_boost']);
                  setSpeechText('Сили відновлено на всі 100%! Попереду – великий фінальний виступ на сцені!');
                }}
                disabled={hydrationSips < 2}
                className={`px-6 py-3 rounded-2xl font-black text-sm transition flex items-center gap-2 shadow-md cursor-pointer ${
                  hydrationSips >= 2
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span>Йдемо на велику сцену!</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. DANCE PERFORMANCE GALA STAGE */}
        {/* ========================================================================= */}
        {stageId === 'dance_performance' && (
          <div className="space-y-4">
            {/* Spotlight Controls */}
            <div className="p-3 bg-pink-50 rounded-2xl border-2 border-pink-200 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="text-xs font-black text-pink-900 flex items-center gap-1">
                <span>💡 Обери колір софітів на сцені:</span>
              </span>
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'pink', label: 'Рожевий', color: 'bg-pink-500' },
                  { id: 'gold', label: 'Золотий', color: 'bg-amber-400' },
                  { id: 'emerald', label: 'Смарагдовий', color: 'bg-emerald-400' },
                  { id: 'purple', label: 'Фіолетовий', color: 'bg-purple-500' },
                ].map((spot) => (
                  <button
                    key={spot.id}
                    onClick={() => {
                      audio.playPop();
                      setSpotlightColor(spot.id);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                      spotlightColor === spot.id
                        ? 'ring-2 ring-pink-500 scale-105 text-gray-900 bg-white shadow-xs font-black'
                        : 'bg-white/80 text-gray-600 hover:bg-white'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${spot.color}`} />
                    <span>{spot.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Grand Concert Stage */}
            <div className="relative p-6 sm:p-8 bg-gradient-to-b from-indigo-950 via-purple-950 to-pink-950 rounded-3xl border-4 border-amber-300 flex flex-col items-center justify-center min-h-[260px] text-white overflow-hidden shadow-2xl">
              {/* Animated Spotlight Cones */}
              <div
                className={`absolute inset-0 transition-opacity duration-700 pointer-events-none opacity-40 ${
                  spotlightColor === 'pink'
                    ? 'bg-radial from-pink-500/50 via-transparent to-transparent'
                    : spotlightColor === 'gold'
                    ? 'bg-radial from-amber-400/50 via-transparent to-transparent'
                    : spotlightColor === 'emerald'
                    ? 'bg-radial from-emerald-400/50 via-transparent to-transparent'
                    : 'bg-radial from-purple-500/50 via-transparent to-transparent'
                }`}
              />

              {/* Stage Nicole Star */}
              <div className="relative z-10 flex flex-col items-center">
                <motion.div
                  animate={
                    isPerforming
                      ? {
                          y: [0, -20, 0, -10, 0],
                          rotateY: [0, 360, 720],
                          scale: [1, 1.1, 1, 1.05, 1],
                        }
                      : { y: [-4, 4, -4] }
                  }
                  transition={{ repeat: isPerforming ? Infinity : Infinity, duration: isPerforming ? 2 : 2.5 }}
                  className="w-40 h-52 flex items-center justify-center"
                >
                  <NicoleAvatar appearance={appearance} size="lg" />
                </motion.div>

                {/* Performance Title */}
                <div className="mt-3 text-center">
                  <h3 className="text-base sm:text-xl font-black text-amber-300 drop-shadow-md">
                    👑 Сольний виступ: «Зоряна Прима Ніколь» 👑
                  </h3>
                  <p className="text-xs font-bold text-pink-200">
                    Зала аплодує стоячи! Браво, Ніколь! 👏
                  </p>
                </div>
              </div>

              {/* Confetti & Floating Flowers Effect */}
              {performanceDone && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 pointer-events-none flex items-center justify-around"
                >
                  <span className="text-3xl animate-bounce">💐</span>
                  <span className="text-4xl animate-bounce delay-100">⭐</span>
                  <span className="text-3xl animate-bounce delay-200">🌹</span>
                </motion.div>
              )}
            </div>

            {/* Stage Performance Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setIsPerforming(true);
                  audio.playBalletPirouette();
                  audio.playApplauseCheer();
                  confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
                  setTimeout(() => {
                    setIsPerforming(false);
                    setPerformanceDone(true);
                  }, 3500);
                }}
                className="py-3 px-4 bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 hover:brightness-110 active:scale-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>💃</span>
                <span>Виконати танець зірки!</span>
              </button>

              <button
                onClick={() => {
                  audio.playSparkle();
                  setFlowersGiven(true);
                  audio.speakUkrainian('Дякую за чарівний букет квітів! Яка радість!', 'nicole');
                }}
                className={`py-3 px-4 rounded-2xl font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  flowersGiven
                    ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-900'
                    : 'bg-white border-2 border-pink-300 text-pink-700 hover:bg-pink-50'
                }`}
              >
                <span>💐</span>
                <span>{flowersGiven ? 'Букет подаровано! ✅' : 'Подарувати букет квітів'}</span>
              </button>

              <button
                onClick={() => {
                  audio.playCelebrationFanfare();
                  setMedalReceived(true);
                  audio.speakUkrainian('Ура! Золота медаль найкращої танцівниці!', 'nicole');
                  confetti({ particleCount: 70, spread: 70 });
                }}
                className={`py-3 px-4 rounded-2xl font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  medalReceived
                    ? 'bg-amber-100 border-2 border-amber-400 text-amber-900'
                    : 'bg-white border-2 border-amber-300 text-amber-800 hover:bg-amber-50'
                }`}
              >
                <span>🥇</span>
                <span>{medalReceived ? 'Медаль вручено! ✅' : 'Вручити золоту медаль'}</span>
              </button>
            </div>

            {/* Finish Dance Class Story */}
            <div className="flex justify-center pt-2">
              <button
                onClick={() => {
                  handleFinishStage(['sticker_ballerina_prima', 'sticker_gold_dance_trophy', 'sticker_dance_applause']);
                  setSpeechText('Вітаємо! Історію «Похід на танці» успішно пройдено! Ніколь – справжня зірка сцени!');
                }}
                disabled={!performanceDone && !flowersGiven && !medalReceived}
                className={`px-6 py-3 rounded-2xl font-black text-sm transition flex items-center gap-2 shadow-md cursor-pointer ${
                  performanceDone || flowersGiven || medalReceived
                    ? 'bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 hover:brightness-110 text-white active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Award className="w-5 h-5 text-yellow-200" />
                <span>Завершити виступ та забрати нагороди!</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Stage Navigation */}
      <div className="w-full max-w-4xl flex items-center justify-between gap-3 mt-4">
        {onPrevStage ? (
          <button
            onClick={() => {
              audio.playPop();
              onPrevStage();
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-100 active:scale-95 text-gray-800 font-black text-xs sm:text-sm rounded-2xl border-2 border-gray-200 transition cursor-pointer shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Назад</span>
          </button>
        ) : (
          <button
            onClick={() => {
              audio.playPop();
              onGoToMap();
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-100 active:scale-95 text-gray-800 font-black text-xs sm:text-sm rounded-2xl border-2 border-gray-200 transition cursor-pointer shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>До мапи</span>
          </button>
        )}

        {isCompleted && onNextStage && (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              audio.playSparkle();
              onNextStage();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg border-2 border-emerald-200 transition cursor-pointer animate-pulse"
          >
            <span>{stageId === 'dance_performance' ? 'Завершити пригоду! 🩰' : 'Наступна пригода'}</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </div>
  );
};
