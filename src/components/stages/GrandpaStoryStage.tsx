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
} from 'lucide-react';
import { GrandpaStageId, NicoleAppearance } from '../../types';
import { NicoleAvatar } from '../NicoleAvatar';
import { audio } from '../../utils/audio';

interface GrandpaStoryStageProps {
  stageId: GrandpaStageId;
  onComplete: (stickers: string[]) => void;
  onNextStage?: () => void;
  onPrevStage?: () => void;
  onGoToMap: () => void;
  appearance: NicoleAppearance;
}

export const GrandpaStoryStage: React.FC<GrandpaStoryStageProps> = ({
  stageId,
  onComplete,
  onNextStage,
  onPrevStage,
  onGoToMap,
  appearance,
}) => {
  // Common Stage State
  const [subStep, setSubStep] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [speechText, setSpeechText] = useState<string>('');

  // 1. TRAIN STAGE STATE
  const [trainTicketChecked, setTrainTicketChecked] = useState(false);
  const [trainWhistleBlown, setTrainWhistleBlown] = useState(false);
  const [windowItemsCount, setWindowItemsCount] = useState<number>(0);
  const [windowFoundItems, setWindowFoundItems] = useState<string[]>([]);
  const [hasTea, setHasTea] = useState(false);

  // 2. DOG KNOPKA STAGE STATE
  const [knopkaHappiness, setKnopkaHappiness] = useState<number>(40);
  const [knopkaAction, setKnopkaAction] = useState<'idle' | 'running' | 'eating' | 'barking' | 'petting'>('idle');
  const [knopkaTreatsGiven, setKnopkaTreatsGiven] = useState<number>(0);
  const [knopkaBallThrows, setKnopkaBallThrows] = useState<number>(0);
  const [knopkaAccessory, setKnopkaAccessory] = useState<'none' | 'red_collar' | 'pink_bow' | 'flower'>('red_collar');
  const [knopkaSpeech, setKnopkaSpeech] = useState<string>('Гав-гав! Я собачка Кнопка! Я так рада бачити Ніколь!');

  // 3. DUCKLINGS STAGE STATE
  const [ducklingsFed, setDucklingsFed] = useState<number>(0);
  const [waterBowlFilled, setWaterBowlFilled] = useState(false);
  const [ducklingsCleaned, setDucklingsCleaned] = useState<number[]>([]);
  const [ducklingsInNest, setDucklingsInNest] = useState<number[]>([]);

  // 4. FISHING STAGE STATE
  const [hasBait, setHasBait] = useState(false);
  const [isLineCast, setIsLineCast] = useState(false);
  const [isBiting, setIsBiting] = useState(false);
  const [caughtFish, setCaughtFish] = useState<Array<{ id: number; name: string; icon: string; points: number }>>([]);
  const [fishingTries, setFishingTries] = useState(0);

  // 5. CANDIES SHOP STATE
  const [selectedCandies, setSelectedCandies] = useState<Array<{ id: string; name: string; icon: string }>>([]);
  const [giftBoxPacked, setGiftBoxPacked] = useState(false);

  // 6. FENCE ART STATE
  const [selectedChalkColor, setSelectedChalkColor] = useState<string>('#f43f5e');
  const [selectedChalkStamp, setSelectedChalkStamp] = useState<string>('🌸');
  const [fenceDrawings, setFenceDrawings] = useState<Array<{ id: number; x: number; y: number; stamp: string; color: string }>>([]);

  // 7. ROLLER SKATING STATE
  const [gearEquipped, setGearEquipped] = useState<{ helmet: boolean; pads: boolean; skates: boolean }>({
    helmet: false,
    pads: false,
    skates: false,
  });
  const [selectedSkatesColor, setSelectedSkatesColor] = useState<'pink' | 'gold' | 'rainbow'>('pink');
  const [skatingProgress, setSkatingProgress] = useState<number>(0);
  const [skatingStarsCollected, setSkatingStarsCollected] = useState<number>(0);

  // Initial stage speech setup
  useEffect(() => {
    setSubStep(0);
    setIsCompleted(false);

    if (stageId === 'train') {
      const msg = 'Ура! Ніколь сідає у швидкий потяг і їде до Дідуся Толіка та бабусі Наталі! Покажи свій квиточок!';
      setSpeechText(msg);
      audio.playTrainWhistle();
      audio.speakUkrainian(msg, 'nicole');
    } else if (stageId === 'knopka') {
      const msg = 'Приїхали до бабусі й дідуся! Нас зустрічає мила собачка Кнопка! Погладь її та пограйся мʼячиком!';
      setSpeechText(msg);
      audio.playDogKnopkaBark();
      audio.speakUkrainian(msg, 'nicole');
    } else if (stageId === 'ducklings') {
      const msg = 'Які милі жовтенькі каченята! Погодуймо їх зернятками та налиймо чистої водички у басейн!';
      setSpeechText(msg);
      audio.playDucklings();
      audio.speakUkrainian(msg, 'nicole');
    } else if (stageId === 'fishing') {
      const msg = 'Дідусь Толік кличе Ніколь на річку ловити рибку! Начепи наживку на вудку та чекай, поки поплавок смикнеться!';
      setSpeechText(msg);
      audio.speakUkrainian(msg, 'nicole');
    } else if (stageId === 'candies') {
      const msg = 'У сільському магазині для Ніколь підготували подарунок – безкоштовні смачні цукерки! Обери свої улюблені!';
      setSpeechText(msg);
      audio.playCandyChime();
      audio.speakUkrainian(msg, 'nicole');
    } else if (stageId === 'fence_art') {
      const msg = 'Камʼяна огорожа біля будинку – це чудове полотно для крейди! Намалюй сонечко, квіти та веселку!';
      setSpeechText(msg);
      audio.speakUkrainian(msg, 'nicole');
    } else if (stageId === 'rollers') {
      const msg = 'Час вчитися кататися на роликах! Одягни шолом, захист і яскраві ролики, і поїхали рівною доріжкою!';
      setSpeechText(msg);
      audio.playRollerSkate();
      audio.speakUkrainian(msg, 'nicole');
    }
  }, [stageId]);

  // Stage Titles & Meta
  const stageInfo: Record<
    GrandpaStageId,
    { title: string; subtitle: string; icon: string; bgGradient: string; stickerName: string }
  > = {
    train: {
      title: 'Подорож потягом',
      subtitle: 'Їдемо до Дідуся Толіка та Бабусі Наталі',
      icon: '🚂',
      bgGradient: 'from-sky-400 via-indigo-300 to-amber-200',
      stickerName: 'Квиток на потяг 🚂',
    },
    knopka: {
      title: 'Собачка Кнопка',
      subtitle: 'Зустріч з пухнастою собачкою у дворі',
      icon: '🐶',
      bgGradient: 'from-amber-300 via-orange-200 to-rose-200',
      stickerName: 'Собачка Кнопка 🐶',
    },
    ducklings: {
      title: 'Маленькі каченята',
      subtitle: 'Доглядаємо та годуємо пухнастих каченят',
      icon: '🐥',
      bgGradient: 'from-emerald-300 via-teal-200 to-amber-200',
      stickerName: 'Жовте каченя 🐥',
    },
    fishing: {
      title: 'Риболовля з Дідусем',
      subtitle: 'Ловимо рибку на річці з Дідусем Толіком',
      icon: '🎣',
      bgGradient: 'from-cyan-400 via-blue-300 to-emerald-200',
      stickerName: 'Золота рибка 🐟',
    },
    candies: {
      title: 'Цукерки в магазині',
      subtitle: 'Безкоштовні смаколики для онучки',
      icon: '🍬',
      bgGradient: 'from-pink-400 via-rose-300 to-purple-300',
      stickerName: 'Смачні цукерки 🍬',
    },
    fence_art: {
      title: 'Малюнки на огорожі',
      subtitle: 'Творчість кольоровою крейдою на камені',
      icon: '🎨',
      bgGradient: 'from-violet-400 via-fuchsia-300 to-amber-200',
      stickerName: 'Камʼяна огорожа 🎨',
    },
    rollers: {
      title: 'Катання на роликах',
      subtitle: 'Швидкі ролики, шолом та весела доріжка',
      icon: '🛼',
      bgGradient: 'from-amber-400 via-rose-300 to-sky-300',
      stickerName: 'Швидкі ролики 🛼',
    },
  };

  const currentInfo = stageInfo[stageId];

  // Finish Stage
  const finishStage = () => {
    setIsCompleted(true);
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    audio.playFanfare();
    audio.speakUkrainian('Ура! Молодець, Ніколь! Завдання чудово виконано!', 'nicole');
    onComplete([currentInfo.stickerName]);
  };

  // Re-read current speech
  const handleRepeatVoice = () => {
    audio.playPop();
    if (speechText) {
      audio.speakUkrainian(speechText, 'nicole');
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-start p-2 sm:p-4 md:p-6">
      {/* Top Banner with Navigation */}
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-3xl p-3 sm:p-5 border-3 border-amber-300 shadow-xl mb-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <button
            onClick={onGoToMap}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-100 hover:bg-amber-200 active:scale-95 text-amber-900 font-black text-xs sm:text-sm rounded-2xl border-2 border-amber-300 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>До пригод</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">{currentInfo.icon}</span>
            <div>
              <h2 className="text-base sm:text-xl font-black text-gray-800 leading-tight">
                {currentInfo.title}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-amber-800">
                {currentInfo.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isCompleted && (
              <span className="px-3 py-1 bg-emerald-500 text-white font-black text-xs rounded-full flex items-center gap-1 shadow-sm">
                <Check className="w-3.5 h-3.5" /> Виконано!
              </span>
            )}
            <button
              onClick={handleRepeatVoice}
              className="p-2 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-2xl active:scale-95 transition cursor-pointer border border-pink-300"
              title="Повторити голос"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Nicole Voice Balloon */}
        <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 rounded-2xl p-3 border-2 border-pink-200 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 shrink-0 rounded-full border-2 border-pink-400 overflow-hidden bg-white shadow-sm">
            <NicoleAvatar appearance={appearance} mood="happy" className="w-full h-full" />
          </div>
          <p className="text-xs sm:text-sm font-bold text-gray-800 flex-1 leading-relaxed">
            {speechText}
          </p>
        </div>
      </div>

      {/* STAGE 1: TRAIN TO GRANDPA TOLIK & GRANDMA NATALIA */}
      {stageId === 'train' && (
        <div className="w-full max-w-4xl bg-gradient-to-b from-sky-100 via-indigo-50 to-amber-50 rounded-3xl p-3 sm:p-6 border-3 border-sky-300 shadow-xl flex flex-col gap-4">
          {/* Main Train Carriage Scene */}
          <div className="relative w-full h-72 sm:h-84 bg-gradient-to-b from-sky-300 via-sky-200 to-amber-200 rounded-3xl overflow-hidden border-4 border-white shadow-inner flex flex-col justify-between p-3 sm:p-4">
            {/* Moving landscape background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                animate={{ x: [0, -400] }}
                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                className="flex gap-12 text-5xl opacity-40 absolute top-4 left-0"
              >
                <span>☁️</span>
                <span>☁️</span>
                <span>🌲</span>
                <span>🌻</span>
                <span>🐄</span>
                <span>🏡</span>
                <span>🌲</span>
                <span>🌻</span>
                <span>☁️</span>
                <span>🌲</span>
              </motion.div>
            </div>

            {/* Train Window View Header */}
            <div className="relative z-10 flex items-center justify-between bg-white/80 backdrop-blur-xs rounded-2xl p-2 px-3 border border-sky-200">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚂</span>
                <span className="text-xs sm:text-sm font-black text-sky-900">
                  Потяг «Експрес до Дідуся Толіка та Бабусі Наталі»
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded-xl">
                <span>Знайдено за вікном:</span>
                <span className="text-sm font-black text-rose-600">{windowFoundItems.length}/5</span>
              </div>
            </div>

            {/* Train Seats: Nicole and Mom */}
            <div className="relative z-10 flex items-end justify-around mt-auto pb-2">
              {/* Mom & Nicole sitting */}
              <div className="flex items-end gap-2 bg-indigo-900/15 backdrop-blur-xs p-2.5 rounded-3xl border border-white/50">
                <div className="flex flex-col items-center">
                  <div className="text-3xl">👩</div>
                  <span className="text-[10px] font-black text-indigo-900">Мама</span>
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white p-1 shadow-md border-2 border-pink-300">
                  <NicoleAvatar appearance={appearance} mood="excited" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs font-black text-pink-700 bg-white px-2 py-0.5 rounded-full shadow-xs">
                    Ніколь 🌸
                  </span>
                </div>
              </div>

              {/* Table with warm tea */}
              <div className="flex flex-col items-center justify-center bg-amber-100/90 border-2 border-amber-300 rounded-2xl p-2 px-3 shadow-md">
                <span className="text-2xl">{hasTea ? '🍵' : '🫖'}</span>
                <span className="text-[10px] font-black text-amber-900">Чай з лимоном</span>
              </div>
            </div>
          </div>

          {/* Interactive Train Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Ticket button */}
            <button
              onClick={() => {
                audio.playPop();
                audio.playSparkle();
                setTrainTicketChecked(true);
                const msg = 'Квиточок перевірено! Провідник усміхнувся і побажав гарної дороги до дідуся!';
                setSpeechText(msg);
                audio.speakUkrainian(msg, 'nicole');
              }}
              className={`p-3 rounded-2xl border-2 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                trainTicketChecked
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                  : 'bg-white hover:bg-amber-50 border-amber-300 text-amber-900 shadow-sm'
              }`}
            >
              <span className="text-2xl">🎟️</span>
              <span>{trainTicketChecked ? 'Квиток перевірено ✓' : 'Показати квиток'}</span>
            </button>

            {/* 2. Whistle button */}
            <button
              onClick={() => {
                audio.playTrainWhistle();
                audio.playTrainChug();
                setTrainWhistleBlown(true);
                const msg = 'Ту-ту-у-у! Потяг мчить рейками, колеса весело стукають!';
                setSpeechText(msg);
                audio.speakUkrainian(msg, 'nicole');
              }}
              className="p-3 bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-500 hover:to-indigo-600 active:scale-95 text-white rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
            >
              <span className="text-2xl animate-bounce">📢</span>
              <span>Посигналити «Ту-ту!»</span>
            </button>

            {/* 3. Hot tea button */}
            <button
              onClick={() => {
                audio.playWaterSplash();
                audio.playSparkle();
                setHasTea(true);
                const msg = 'Ммм, смачний теплий чай у підскляннику з лимончиком та цукром!';
                setSpeechText(msg);
                audio.speakUkrainian(msg, 'nicole');
              }}
              className={`p-3 rounded-2xl border-2 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                hasTea
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                  : 'bg-white hover:bg-amber-50 border-amber-300 text-amber-900 shadow-sm'
              }`}
            >
              <span className="text-2xl">🍵</span>
              <span>{hasTea ? 'Чай випито ✓' : 'Випити чай з мамою'}</span>
            </button>
          </div>

          {/* Interactive Window Spotting Minigame */}
          <div className="bg-white/90 rounded-2xl p-3 border-2 border-sky-200">
            <h4 className="text-xs sm:text-sm font-black text-sky-950 mb-2 flex items-center gap-1.5">
              <span>👀</span>
              <span>Торкнися предметів, які Ніколь бачить за вікном поїзда:</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'sunflower', name: 'Соняшники', icon: '🌻', sound: 'Поле золотих соняшників!' },
                { id: 'cow', name: 'Корівка', icon: '🐄', sound: 'Му-у-у! Корівка пасеться на лузі!' },
                { id: 'windmill', name: 'Казковий млин', icon: '🏰', sound: 'Старовинний вітрячок крутить крилами!' },
                { id: 'forest', name: 'Сосновий ліс', icon: '🌲', sound: 'Високі зелені сосни та ялинки!' },
                { id: 'station', name: 'Станція Бабусі', icon: '🏡', sound: 'Ось і станція! Дідусь Толік і Бабуся Наталя вже махають руками!' },
              ].map((item) => {
                const isFound = windowFoundItems.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (!isFound) {
                        audio.playSparkle();
                        audio.speakUkrainian(item.sound, 'nicole');
                        const next = [...windowFoundItems, item.id];
                        setWindowFoundItems(next);
                        if (next.length === 5 && !isCompleted) {
                          finishStage();
                        }
                      }
                    }}
                    className={`p-2.5 rounded-2xl border-2 flex flex-col items-center justify-center transition active:scale-90 cursor-pointer ${
                      isFound
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                        : 'bg-sky-50 hover:bg-sky-100 border-sky-200 text-sky-900 shadow-xs'
                    }`}
                  >
                    <span className="text-3xl mb-1">{item.icon}</span>
                    <span className="text-xs font-black text-center leading-tight">{item.name}</span>
                    {isFound && <span className="text-[10px] font-bold text-emerald-600">Помічено ✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: DOG KNOPKA */}
      {stageId === 'knopka' && (
        <div className="w-full max-w-4xl bg-gradient-to-b from-amber-100 via-orange-50 to-rose-50 rounded-3xl p-3 sm:p-6 border-3 border-amber-300 shadow-xl flex flex-col gap-4">
          {/* Main Yard Play Scene */}
          <div className="relative w-full h-72 sm:h-80 bg-gradient-to-b from-amber-200 via-yellow-100 to-emerald-200 rounded-3xl overflow-hidden border-4 border-white shadow-inner flex flex-col items-center justify-between p-4">
            {/* Happiness & Love Bar */}
            <div className="w-full max-w-md bg-white/90 rounded-2xl p-2 px-3 border border-amber-300 flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
                <span>Радість Кнопки:</span>
              </div>
              <div className="flex-1 h-4 bg-amber-100 rounded-full overflow-hidden border border-amber-300">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-rose-400 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, knopkaHappiness)}%` }}
                />
              </div>
              <span className="text-xs font-black text-rose-600">{Math.min(100, knopkaHappiness)}%</span>
            </div>

            {/* Dog Knopka Interactive Avatar */}
            <div className="flex items-end justify-center gap-6 my-auto">
              {/* Nicole Avatar */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white p-1 shadow-md border-2 border-pink-300">
                  <NicoleAvatar appearance={appearance} mood="excited" />
                </div>
                <span className="text-xs font-black text-pink-700 bg-white px-2 py-0.5 rounded-full mt-1 shadow-xs">
                  Ніколь
                </span>
              </div>

              {/* Dog Knopka Animated Character */}
              <motion.div
                animate={
                  knopkaAction === 'running'
                    ? { x: [0, 20, -20, 0], y: [0, -10, 0] }
                    : knopkaAction === 'eating'
                    ? { y: [0, -4, 0], scale: [1, 1.05, 1] }
                    : knopkaAction === 'petting'
                    ? { scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] }
                    : { y: [0, -3, 0] }
                }
                transition={{ repeat: Infinity, duration: 1.5 }}
                onClick={() => {
                  audio.playDogKnopkaBark();
                  audio.playPetBrush();
                  setKnopkaAction('petting');
                  const newHap = knopkaHappiness + 15;
                  setKnopkaHappiness(newHap);
                  const msg = 'Кнопка радісно крутить хвостиком і лиже ручки Ніколь! Вона так скучила!';
                  setSpeechText(msg);
                  setTimeout(() => setKnopkaAction('idle'), 1500);
                  if (newHap >= 90 && !isCompleted) finishStage();
                }}
                className="flex flex-col items-center cursor-pointer group"
                title="Торкнися собачки Кнопки!"
              >
                <div className="relative text-7xl sm:text-8xl select-none group-hover:scale-110 transition-transform">
                  🐶
                  {knopkaAccessory === 'pink_bow' && (
                    <span className="absolute -top-2 right-2 text-2xl">🎀</span>
                  )}
                  {knopkaAccessory === 'flower' && (
                    <span className="absolute -top-2 right-2 text-2xl">🌸</span>
                  )}
                  {knopkaAccessory === 'red_collar' && (
                    <span className="absolute bottom-2 left-4 text-xl">🧣</span>
                  )}
                </div>
                <span className="text-xs font-black text-amber-900 bg-amber-200 px-3 py-0.5 rounded-full shadow-xs border border-amber-300">
                  Собачка Кнопка ✨
                </span>
              </motion.div>
            </div>

            {/* Knopka Speech bubble */}
            <div className="bg-white/90 rounded-2xl p-2 px-3 border border-amber-200 text-xs sm:text-sm font-bold text-amber-950 text-center shadow-xs">
              💬 {knopkaSpeech}
            </div>
          </div>

          {/* Action buttons: Treats, Ball, Collar, Brush */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* 1. Fetch Ball */}
            <button
              onClick={() => {
                audio.playDogKnopkaBark();
                audio.playWhoosh();
                setKnopkaAction('running');
                setKnopkaBallThrows(prev => prev + 1);
                const newHap = knopkaHappiness + 15;
                setKnopkaHappiness(newHap);
                const msg = 'Ніколь кинула жовтий мʼячик, а Кнопка хутко принесла його назад у зубах!';
                setSpeechText(msg);
                setKnopkaSpeech('Гав-гав! Кидай ще раз! Я найшвидша собачка!');
                audio.speakUkrainian(msg, 'nicole');
                setTimeout(() => setKnopkaAction('idle'), 2000);
                if (newHap >= 90 && !isCompleted) finishStage();
              }}
              className="p-3 bg-white hover:bg-amber-100 border-2 border-amber-300 rounded-2xl flex flex-col items-center justify-center gap-1 active:scale-95 transition cursor-pointer shadow-xs"
            >
              <span className="text-3xl">🎾</span>
              <span className="text-xs font-black text-gray-800">Кинути мʼячик</span>
              <span className="text-[10px] text-amber-700 font-bold">Кинуто: {knopkaBallThrows}</span>
            </button>

            {/* 2. Feed Biscuit */}
            <button
              onClick={() => {
                audio.playCrunch();
                audio.playDogKnopkaBark();
                setKnopkaAction('eating');
                setKnopkaTreatsGiven(prev => prev + 1);
                const newHap = knopkaHappiness + 20;
                setKnopkaHappiness(newHap);
                const msg = 'Хрум-хрум! Кнопка з задоволенням схрумала смачне собаче печиво-кісточку!';
                setSpeechText(msg);
                setKnopkaSpeech('Ням-ням! Дякую, Ніколь, це неймовірно смачно!');
                audio.speakUkrainian(msg, 'nicole');
                setTimeout(() => setKnopkaAction('idle'), 2000);
                if (newHap >= 90 && !isCompleted) finishStage();
              }}
              className="p-3 bg-white hover:bg-amber-100 border-2 border-amber-300 rounded-2xl flex flex-col items-center justify-center gap-1 active:scale-95 transition cursor-pointer shadow-xs"
            >
              <span className="text-3xl">🦴</span>
              <span className="text-xs font-black text-gray-800">Дати кісточку</span>
              <span className="text-[10px] text-amber-700 font-bold">Зʼїдено: {knopkaTreatsGiven}</span>
            </button>

            {/* 3. Brush fur */}
            <button
              onClick={() => {
                audio.playPetBrush();
                audio.playSparkle();
                setKnopkaAction('petting');
                const newHap = knopkaHappiness + 15;
                setKnopkaHappiness(newHap);
                const msg = 'Шубка Кнопки стала мʼякенькою, чистою та блискучою!';
                setSpeechText(msg);
                audio.speakUkrainian(msg, 'nicole');
                setTimeout(() => setKnopkaAction('idle'), 1500);
                if (newHap >= 90 && !isCompleted) finishStage();
              }}
              className="p-3 bg-white hover:bg-amber-100 border-2 border-amber-300 rounded-2xl flex flex-col items-center justify-center gap-1 active:scale-95 transition cursor-pointer shadow-xs"
            >
              <span className="text-3xl">🪮</span>
              <span className="text-xs font-black text-gray-800">Розчесати шубку</span>
              <span className="text-[10px] text-amber-700 font-bold">Ніжний догляд</span>
            </button>

            {/* 4. Change accessory */}
            <button
              onClick={() => {
                audio.playPop();
                audio.playSparkle();
                const accs: Array<'none' | 'red_collar' | 'pink_bow' | 'flower'> = ['red_collar', 'pink_bow', 'flower', 'none'];
                const next = accs[(accs.indexOf(knopkaAccessory) + 1) % accs.length];
                setKnopkaAccessory(next);
                const msg = 'Який гарний аксесуар для собачки Кнопки!';
                setSpeechText(msg);
              }}
              className="p-3 bg-white hover:bg-amber-100 border-2 border-amber-300 rounded-2xl flex flex-col items-center justify-center gap-1 active:scale-95 transition cursor-pointer shadow-xs"
            >
              <span className="text-3xl">🎀</span>
              <span className="text-xs font-black text-gray-800">Прикраса Кнопки</span>
              <span className="text-[10px] text-amber-700 font-bold">Змінити стиль</span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3: DUCKLINGS */}
      {stageId === 'ducklings' && (
        <div className="w-full max-w-4xl bg-gradient-to-b from-emerald-100 via-teal-50 to-amber-50 rounded-3xl p-3 sm:p-6 border-3 border-emerald-300 shadow-xl flex flex-col gap-4">
          {/* Main Ducklings Pond Scene */}
          <div className="relative w-full h-72 sm:h-80 bg-gradient-to-b from-sky-200 via-emerald-100 to-amber-100 rounded-3xl overflow-hidden border-4 border-white shadow-inner flex flex-col justify-between p-3 sm:p-4">
            {/* Water Pond */}
            <div className="absolute inset-x-4 bottom-4 h-36 bg-gradient-to-r from-sky-400 via-teal-300 to-cyan-400 rounded-3xl border-3 border-white/60 shadow-inner flex items-center justify-around p-2">
              {/* Ripples */}
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:12px_12px]" />

              {/* 5 Ducklings in the pond */}
              {[0, 1, 2, 3, 4].map((duckIndex) => {
                const isFed = ducklingsFed > duckIndex;
                const isInNest = ducklingsInNest.includes(duckIndex);

                return (
                  <motion.button
                    key={duckIndex}
                    animate={
                      isInNest
                        ? { y: -50, scale: 0.9 }
                        : { y: [0, -6, 0], x: [0, 4, -4, 0] }
                    }
                    transition={{ repeat: Infinity, duration: 2 + duckIndex * 0.3 }}
                    onClick={() => {
                      audio.playDucklings();
                      if (!ducklingsInNest.includes(duckIndex)) {
                        const next = [...ducklingsInNest, duckIndex];
                        setDucklingsInNest(next);
                        const msg = `Каченя №${duckIndex + 1} затишно вмостилося у гніздечку!`;
                        setSpeechText(msg);
                        audio.speakUkrainian(msg, 'nicole');
                        if (next.length === 5 && !isCompleted) finishStage();
                      }
                    }}
                    className="relative flex flex-col items-center cursor-pointer active:scale-90 transition group z-10"
                    title="Торкнися каченяти!"
                  >
                    <div className="text-4xl sm:text-5xl group-hover:scale-125 transition-transform">
                      🐥
                    </div>
                    <span className="text-[10px] font-black text-teal-900 bg-white/80 px-1.5 rounded-full shadow-xs">
                      {['Крячик', 'Пушок', 'Жовтик', 'Пірʼїнка', 'Стрибок'][duckIndex]}
                    </span>
                    {isFed && (
                      <span className="absolute -top-1 -right-1 text-xs">🌾</span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Cozy Duckhouse & Nest */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="bg-amber-100/90 rounded-2xl p-2 px-3 border border-amber-300 flex items-center gap-2 shadow-xs">
                <span className="text-2xl">🏡</span>
                <div>
                  <div className="text-xs font-black text-amber-900">Затишний будиночок каченят</div>
                  <div className="text-[10px] font-bold text-emerald-700">У гніздечку: {ducklingsInNest.length}/5</div>
                </div>
              </div>

              {/* Water bowl status */}
              <div className="bg-white/90 rounded-2xl p-2 px-3 border border-sky-300 flex items-center gap-2 shadow-xs">
                <span className="text-2xl">{waterBowlFilled ? '🥣💧' : '🥣'}</span>
                <span className="text-xs font-black text-sky-900">
                  {waterBowlFilled ? 'Водичка свіжа ✓' : 'Налий водички'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Feed grain */}
            <button
              onClick={() => {
                audio.playCrunch();
                audio.playDucklings();
                const nextFed = Math.min(5, ducklingsFed + 1);
                setDucklingsFed(nextFed);
                const msg = 'Ніколь насипала смачного золотого зернятка! Каченята радісно покрякують!';
                setSpeechText(msg);
                audio.speakUkrainian(msg, 'nicole');
              }}
              className="p-3 bg-white hover:bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-center justify-center gap-2 font-black text-xs sm:text-sm text-amber-900 active:scale-95 transition cursor-pointer shadow-xs"
            >
              <span className="text-2xl">🌾</span>
              <span>Погодувати зернятками ({ducklingsFed}/5)</span>
            </button>

            {/* Fill water */}
            <button
              onClick={() => {
                audio.playWaterSplash();
                audio.playSparkle();
                setWaterBowlFilled(true);
                const msg = 'Чиста прохолодна водичка налита у басейн для плавання!';
                setSpeechText(msg);
                audio.speakUkrainian(msg, 'nicole');
              }}
              className="p-3 bg-white hover:bg-sky-50 border-2 border-sky-300 rounded-2xl flex items-center justify-center gap-2 font-black text-xs sm:text-sm text-sky-900 active:scale-95 transition cursor-pointer shadow-xs"
            >
              <span className="text-2xl">💧</span>
              <span>{waterBowlFilled ? 'Водичка налита ✓' : 'Налити чистої водички'}</span>
            </button>

            {/* Put all to nest */}
            <button
              onClick={() => {
                audio.playDucklings();
                audio.playSparkle();
                setDucklingsInNest([0, 1, 2, 3, 4]);
                const msg = 'Усі 5 каченят слухняно пішли відпочивати у тепле гніздечко!';
                setSpeechText(msg);
                audio.speakUkrainian(msg, 'nicole');
                if (!isCompleted) finishStage();
              }}
              className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white rounded-2xl flex items-center justify-center gap-2 font-black text-xs sm:text-sm shadow-md transition cursor-pointer"
            >
              <span className="text-2xl">🪺</span>
              <span>Усі до гніздечка!</span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE 4: FISHING WITH GRANDPA TOLIK */}
      {stageId === 'fishing' && (
        <div className="w-full max-w-4xl bg-gradient-to-b from-cyan-100 via-blue-50 to-emerald-50 rounded-3xl p-3 sm:p-6 border-3 border-cyan-300 shadow-xl flex flex-col gap-4">
          {/* River Fishing Scene */}
          <div className="relative w-full h-72 sm:h-84 bg-gradient-to-b from-sky-300 via-cyan-200 to-blue-400 rounded-3xl overflow-hidden border-4 border-white shadow-inner flex flex-col justify-between p-3 sm:p-4">
            {/* Shore and Wooden Dock */}
            <div className="relative z-10 flex items-start justify-between">
              {/* Grandpa Tolik and Nicole on the dock */}
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xs p-2.5 rounded-3xl border border-cyan-200 shadow-sm">
                <div className="flex flex-col items-center">
                  <span className="text-3xl">👴</span>
                  <span className="text-[10px] font-black text-cyan-950">Дідусь Толік</span>
                </div>
                <div className="w-14 h-14 rounded-full bg-white p-1 border-2 border-pink-300 shadow-sm">
                  <NicoleAvatar appearance={appearance} mood="excited" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-pink-700">Ніколь</span>
                  <span className="text-[10px] font-bold text-gray-600">Вудка: {hasBait ? 'З наживкою 🪱' : 'Без наживки'}</span>
                </div>
              </div>

              {/* Bucket with fish */}
              <div className="bg-amber-100/95 rounded-2xl p-2 px-3 border border-amber-300 shadow-sm flex items-center gap-2">
                <span className="text-2xl">🪣</span>
                <div>
                  <div className="text-xs font-black text-amber-950">Відерце з рибкою</div>
                  <div className="text-[10px] font-bold text-rose-600">{caughtFish.length}/3 рибок спіймано</div>
                </div>
              </div>
            </div>

            {/* Fishing Bobber in River */}
            <div className="relative z-10 flex flex-col items-center justify-center my-auto">
              {isLineCast ? (
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={
                      isBiting
                        ? { y: [0, 15, -5, 15, 0], rotate: [-10, 10, -10, 0] }
                        : { y: [0, -4, 0] }
                    }
                    transition={{ repeat: Infinity, duration: isBiting ? 0.3 : 1.5 }}
                    onClick={() => {
                      if (isBiting) {
                        audio.playFishingCatch();
                        const fishes = [
                          { id: Date.now(), name: 'Золота чарівна рибка', icon: '🐠', points: 10 },
                          { id: Date.now() + 1, name: 'Срібний карасик', icon: '🐟', points: 5 },
                          { id: Date.now() + 2, name: 'Смугастий окунець', icon: '🐡', points: 8 },
                        ];
                        const randomFish = fishes[caughtFish.length % fishes.length];
                        const nextList = [...caughtFish, randomFish];
                        setCaughtFish(nextList);
                        setIsLineCast(false);
                        setIsBiting(false);
                        setHasBait(false);
                        const msg = `Плюсь! Ніколь витягнула: ${randomFish.name}! Дідусь Толік аплодує!`;
                        setSpeechText(msg);
                        audio.speakUkrainian(msg, 'nicole');
                        if (nextList.length >= 3 && !isCompleted) finishStage();
                      }
                    }}
                    className={`text-5xl cursor-pointer select-none transition-transform ${
                      isBiting ? 'scale-125 animate-bounce' : 'hover:scale-110'
                    }`}
                    title={isBiting ? 'ТЯГНИ ВУДКУ ЗАРАЗ!' : 'Поплавок гойдається на хвилях'}
                  >
                    🏮
                  </motion.div>
                  {isBiting ? (
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 0.4 }}
                      className="bg-rose-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-lg mt-2 animate-pulse cursor-pointer"
                    >
                      🎣 ТЯГНИ! КЛЮЄ!
                    </motion.div>
                  ) : (
                    <span className="text-[10px] font-black text-cyan-950 bg-white/70 px-2 py-0.5 rounded-full mt-1">
                      Чекаємо на клювання... 🌊
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-xs sm:text-sm font-black text-white bg-black/40 backdrop-blur-xs px-4 py-2 rounded-2xl border border-white/40">
                  Начепи наживку та закинь вудку у річку! 🐟
                </div>
              )}
            </div>

            {/* River bed silhouettes */}
            <div className="relative z-0 flex justify-around opacity-30 text-2xl pointer-events-none">
              <span>🐟</span>
              <span>🐠</span>
              <span>🌿</span>
              <span>🐡</span>
              <span>🐟</span>
            </div>
          </div>

          {/* Fishing Action Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Put bait */}
            <button
              onClick={() => {
                audio.playPop();
                setHasBait(true);
                const msg = 'Наживка на гачку! Тепер можна закидати вудку у воду!';
                setSpeechText(msg);
                audio.speakUkrainian(msg, 'nicole');
              }}
              disabled={hasBait || isLineCast}
              className={`p-3 rounded-2xl border-2 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                hasBait
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                  : 'bg-white hover:bg-amber-50 border-amber-300 text-amber-900 shadow-sm'
              }`}
            >
              <span className="text-2xl">🪱</span>
              <span>{hasBait ? 'Наживка надіта ✓' : '1. Начепити наживку'}</span>
            </button>

            {/* 2. Cast line */}
            <button
              onClick={() => {
                if (!hasBait) {
                  const msg = 'Спочатку начепи наживку на гачок!';
                  setSpeechText(msg);
                  audio.speakUkrainian(msg, 'nicole');
                  return;
                }
                audio.playWhoosh();
                audio.playWaterSplash();
                setIsLineCast(true);
                setIsBiting(false);
                const msg = 'Вудку закинуто! Дивись уважно на червоний поплавок!';
                setSpeechText(msg);
                audio.speakUkrainian(msg, 'nicole');

                // Simulate fish bite after 2-3 seconds
                setTimeout(() => {
                  audio.playSparkle();
                  setIsBiting(true);
                }, 2200);
              }}
              disabled={!hasBait || isLineCast}
              className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 active:scale-95 disabled:opacity-50 text-white rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
            >
              <span className="text-2xl">🎣</span>
              <span>2. Закинути вудку</span>
            </button>

            {/* 3. Pull line */}
            <button
              onClick={() => {
                if (isBiting) {
                  audio.playFishingCatch();
                  const fishes = [
                    { id: Date.now(), name: 'Золота чарівна рибка', icon: '🐠', points: 10 },
                    { id: Date.now() + 1, name: 'Срібний карасик', icon: '🐟', points: 5 },
                    { id: Date.now() + 2, name: 'Смугастий окунець', icon: '🐡', points: 8 },
                  ];
                  const randomFish = fishes[caughtFish.length % fishes.length];
                  const nextList = [...caughtFish, randomFish];
                  setCaughtFish(nextList);
                  setIsLineCast(false);
                  setIsBiting(false);
                  setHasBait(false);
                  const msg = `Плюсь! Ніколь спіймала: ${randomFish.name}! Дідусь Толік пишається онучкою!`;
                  setSpeechText(msg);
                  audio.speakUkrainian(msg, 'nicole');
                  if (nextList.length >= 3 && !isCompleted) finishStage();
                } else {
                  audio.playPop();
                  const msg = 'Почекай, поки поплавок засмикається!';
                  setSpeechText(msg);
                }
              }}
              disabled={!isLineCast}
              className={`p-3 rounded-2xl border-2 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                isBiting
                  ? 'bg-rose-500 text-white border-rose-300 animate-pulse shadow-lg'
                  : 'bg-white hover:bg-gray-100 border-gray-300 text-gray-700'
              }`}
            >
              <span className="text-2xl">🐟</span>
              <span>{isBiting ? '3. ТЯГНИ РИБКУ!' : '3. Тягти вудку'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE 5: CANDIES IN STORE */}
      {stageId === 'candies' && (
        <div className="w-full max-w-4xl bg-gradient-to-b from-pink-100 via-rose-50 to-purple-50 rounded-3xl p-3 sm:p-6 border-3 border-pink-300 shadow-xl flex flex-col gap-4">
          {/* Candy Store Counter */}
          <div className="relative w-full h-72 sm:h-80 bg-gradient-to-b from-pink-200 via-purple-100 to-amber-100 rounded-3xl overflow-hidden border-4 border-white shadow-inner flex flex-col justify-between p-3 sm:p-4">
            {/* Header: Shopkeeper & Gift Ribbon */}
            <div className="relative z-10 flex items-center justify-between bg-white/90 backdrop-blur-xs rounded-2xl p-2 px-3 border border-pink-200 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏪</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-pink-950">Сільська крамничка солодощів</h4>
                  <p className="text-[10px] font-bold text-emerald-700">🎁 Безкоштовний подарунок для Ніколь!</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-pink-100 px-3 py-1 rounded-xl border border-pink-300">
                <span className="text-xs font-black text-pink-900">Обрано:</span>
                <span className="text-sm font-black text-rose-600">{selectedCandies.length}/4</span>
              </div>
            </div>

            {/* Gift Bag / Box with collected treats */}
            <div className="relative z-10 flex items-center justify-center my-auto">
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-3 sm:p-4 border-3 border-pink-300 shadow-lg flex flex-col items-center gap-2 max-w-sm w-full">
                <div className="flex items-center gap-1 text-2xl">
                  {selectedCandies.length > 0 ? (
                    selectedCandies.map((c, i) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="p-1 bg-pink-50 rounded-xl border border-pink-200 shadow-xs"
                      >
                        {c.icon}
                      </motion.span>
                    ))
                  ) : (
                    <span className="text-xs font-bold text-gray-500 py-2">
                      Торкнися цукерок на вітрині нижче! 🍭
                    </span>
                  )}
                </div>
                <span className="text-xs font-black text-pink-900">
                  {giftBoxPacked ? '🎀 Святковий пакунок запаковано!' : 'Пакуночок смаколиків Ніколь'}
                </span>
              </div>
            </div>

            {/* Shop Shelves Preview */}
            <div className="relative z-0 flex justify-around opacity-40 text-3xl pointer-events-none">
              <span>🍭</span>
              <span>🍫</span>
              <span>🧁</span>
              <span>🍬</span>
              <span>🍩</span>
            </div>
          </div>

          {/* Candy Jars Selection Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'lollipop', name: 'Райдужний льодяник', icon: '🍭', voice: 'Солодкий барвистий льодяник на паличці!' },
              { id: 'chocolate', name: 'Шоколадний трюфель', icon: '🍫', voice: 'Ніжний молочний шоколад з горішком!' },
              { id: 'gummy', name: 'Полуничні ведмедики', icon: '🐻', voice: 'Мʼякенькі ягідні мармеладні ведмежата!' },
              { id: 'caramel', name: 'Медова карамелька', icon: '🍯', voice: 'Запашна золота карамелька з пасіки!' },
              { id: 'candy_pink', name: 'Вишнева помадка', icon: '🍬', voice: 'Соковита вишнева цукерка у блискучій обгортці!' },
              { id: 'cupcake', name: 'Святковий кексик', icon: '🧁', voice: 'Маленький ніжний кексик з кремом!' },
              { id: 'icecream', name: 'Вафельний ріжок', icon: '🍦', voice: 'Хрустке вершкове морозиво!' },
              { id: 'cookie', name: 'Зіркове печиво', icon: '⭐', voice: 'Хрумке цукрове печиво-зірочка!' },
            ].map((candy) => {
              const isPicked = selectedCandies.some(c => c.id === candy.id);

              return (
                <button
                  key={candy.id}
                  onClick={() => {
                    audio.playCandyChime();
                    audio.speakUkrainian(candy.voice, 'nicole');
                    if (!isPicked && selectedCandies.length < 4) {
                      const next = [...selectedCandies, { id: candy.id, name: candy.name, icon: candy.icon }];
                      setSelectedCandies(next);
                      if (next.length === 4) {
                        setGiftBoxPacked(true);
                        const msg = 'Ура! Ніколь зібрала повний пакунок найсмачніших безкоштовних цукерок!';
                        setSpeechText(msg);
                        if (!isCompleted) finishStage();
                      }
                    }
                  }}
                  className={`p-2.5 sm:p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 active:scale-90 transition cursor-pointer ${
                    isPicked
                      ? 'bg-pink-100 border-pink-400 text-pink-900 shadow-inner'
                      : 'bg-white hover:bg-pink-50 border-pink-200 text-gray-800 shadow-xs'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl">{candy.icon}</span>
                  <span className="text-xs font-black text-center">{candy.name}</span>
                  {isPicked ? (
                    <span className="text-[10px] font-black text-rose-600 bg-white px-2 py-0.5 rounded-full">
                      У пакунку ✓
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-600">Взяти безкоштовно</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STAGE 6: DRAWING ON STONE FENCE */}
      {stageId === 'fence_art' && (
        <div className="w-full max-w-4xl bg-gradient-to-b from-violet-100 via-fuchsia-50 to-amber-50 rounded-3xl p-3 sm:p-6 border-3 border-violet-300 shadow-xl flex flex-col gap-4">
          {/* Stone Fence Canvas Area */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              audio.playChalkScratch();
              const newDrawing = {
                id: Date.now(),
                x,
                y,
                stamp: selectedChalkStamp,
                color: selectedChalkColor,
              };
              const next = [...fenceDrawings, newDrawing];
              setFenceDrawings(next);
              const msg = 'Гарний штрих крейдою на камʼяному паркані!';
              setSpeechText(msg);
              if (next.length >= 6 && !isCompleted) finishStage();
            }}
            className="relative w-full h-72 sm:h-84 bg-gradient-to-b from-stone-400 via-stone-300 to-stone-500 rounded-3xl overflow-hidden border-4 border-stone-600 shadow-inner flex flex-col justify-between p-3 cursor-crosshair select-none"
            title="Торкнися паркану, щоб намалювати візерунок!"
          >
            {/* Stone texture pattern */}
            <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#292524_2px,transparent_2px)] [background-size:20px_20px]" />

            {/* Header info */}
            <div className="relative z-10 flex items-center justify-between bg-white/90 backdrop-blur-xs rounded-2xl p-2 px-3 border border-stone-300 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧱</span>
                <span className="text-xs sm:text-sm font-black text-stone-900">
                  Камʼяна огорожа: торкайся пальчиком та малюй!
                </span>
              </div>
              <span className="text-xs font-black text-violet-700 bg-violet-100 px-2.5 py-1 rounded-xl">
                Малюнків: {fenceDrawings.length}/6
              </span>
            </div>

            {/* Rendered drawings on stone */}
            {fenceDrawings.map((draw) => (
              <motion.div
                key={draw.id}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                className="absolute text-4xl sm:text-5xl pointer-events-none select-none drop-shadow-md"
                style={{ left: `${draw.x}%`, top: `${draw.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                {draw.stamp}
              </motion.div>
            ))}

            {/* Bottom characters admiring */}
            <div className="relative z-10 flex items-end justify-between pointer-events-none">
              <div className="flex items-center gap-1.5 bg-black/40 text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full backdrop-blur-xs">
                <span>👴 Дідусь: «Яка гарна художниця!»</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/40 text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full backdrop-blur-xs">
                <span>👵 Бабуся: «Справжня прикраса подвірʼя!»</span>
              </div>
            </div>
          </div>

          {/* Chalk Stamps & Colors Toolbar */}
          <div className="bg-white/95 rounded-2xl p-3 border-2 border-violet-200 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-black text-gray-700">Обери фігурку крейди:</span>
              <button
                onClick={() => {
                  audio.playWaterSplash();
                  setFenceDrawings([]);
                }}
                className="text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-xl transition cursor-pointer"
              >
                Очистити паркан 🧽
              </button>
            </div>

            {/* Stamps picker */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {[
                { stamp: '☀️', name: 'Сонечко' },
                { stamp: '🌸', name: 'Квіточка' },
                { stamp: '💖', name: 'Сердечко' },
                { stamp: '🌈', name: 'Веселка' },
                { stamp: '🐱', name: 'Котик' },
                { stamp: '🐶', name: 'Кнопка' },
                { stamp: '⭐', name: 'Зірочка' },
                { stamp: '🦋', name: 'Метелик' },
              ].map((item) => (
                <button
                  key={item.stamp}
                  onClick={() => {
                    audio.playPop();
                    setSelectedChalkStamp(item.stamp);
                  }}
                  className={`p-2 rounded-2xl border-2 flex flex-col items-center justify-center transition cursor-pointer ${
                    selectedChalkStamp === item.stamp
                      ? 'bg-violet-600 text-white border-violet-700 shadow-md scale-105'
                      : 'bg-violet-50 hover:bg-violet-100 border-violet-200 text-gray-800'
                  }`}
                >
                  <span className="text-2xl">{item.stamp}</span>
                  <span className="text-[10px] font-black">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STAGE 7: LEARNING TO ROLLERSKATE */}
      {stageId === 'rollers' && (
        <div className="w-full max-w-4xl bg-gradient-to-b from-amber-100 via-rose-50 to-sky-50 rounded-3xl p-3 sm:p-6 border-3 border-amber-300 shadow-xl flex flex-col gap-4">
          {/* Skating Track Scene */}
          <div className="relative w-full h-72 sm:h-84 bg-gradient-to-b from-sky-300 via-emerald-200 to-amber-200 rounded-3xl overflow-hidden border-4 border-white shadow-inner flex flex-col justify-between p-3 sm:p-4">
            {/* Paved path track */}
            <div className="absolute inset-x-0 bottom-4 h-36 bg-gradient-to-r from-stone-300 via-stone-200 to-stone-400 border-y-4 border-amber-400/60 shadow-inner flex items-center justify-between px-6">
              {/* Distance stars */}
              {[20, 40, 60, 80, 100].map((mark) => (
                <div key={mark} className="flex flex-col items-center">
                  <span className={`text-2xl ${skatingProgress >= mark ? 'opacity-100 scale-125' : 'opacity-40'}`}>
                    ⭐
                  </span>
                  <span className="text-[10px] font-black text-stone-700">{mark}м</span>
                </div>
              ))}
            </div>

            {/* Header gear check */}
            <div className="relative z-10 flex items-center justify-between bg-white/90 backdrop-blur-xs rounded-2xl p-2 px-3 border border-amber-300 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛼</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-amber-950">Алея для катання на роликах</h4>
                  <p className="text-[10px] font-bold text-gray-600">
                    Безпека: {gearEquipped.helmet ? '🪖' : '❌'} {gearEquipped.pads ? '🛡️' : '❌'}{' '}
                    {gearEquipped.skates ? '🛼' : '❌'}
                  </p>
                </div>
              </div>

              <div className="bg-amber-100 px-3 py-1 rounded-xl border border-amber-300 text-xs font-black text-amber-900">
                Проїхали: <span className="text-rose-600 font-black">{skatingProgress}м</span>
              </div>
            </div>

            {/* Roller-skating Nicole on the track */}
            <div className="relative z-10 flex items-center justify-start h-28">
              <motion.div
                animate={{
                  x: `${skatingProgress * 2.8}px`,
                  y: [0, -4, 0],
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-xs p-2 rounded-3xl border border-pink-300 shadow-md"
              >
                <div className="w-14 h-14 rounded-full bg-white p-1 border-2 border-pink-400">
                  <NicoleAvatar appearance={appearance} mood="excited" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-pink-800">Ніколь на роликах 🛼</span>
                  <span className="text-[10px] font-bold text-emerald-700">Рівновага і швидкість!</span>
                </div>
              </motion.div>
            </div>

            {/* Cheering grandparents */}
            <div className="relative z-10 flex justify-between text-xs font-black text-white bg-black/30 backdrop-blur-xs px-3 py-1 rounded-full">
              <span>👴 Дідусь Толік: «Тримай спинку рівно!»</span>
              <span>👵 Бабуся Наталя: «Молодець, Ніколь!»</span>
            </div>
          </div>

          {/* Safety Gear & Skates Color Selection */}
          <div className="bg-white/95 rounded-2xl p-3 border-2 border-amber-200 flex flex-col gap-3">
            <h4 className="text-xs sm:text-sm font-black text-gray-800">
              1. Одягни захисне спорядження:
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  audio.playPop();
                  setGearEquipped(prev => ({ ...prev, helmet: true }));
                  const msg = 'Рожевий захисний шолом надійно застебнуто!';
                  setSpeechText(msg);
                  audio.speakUkrainian(msg, 'nicole');
                }}
                className={`p-2.5 rounded-2xl border-2 flex items-center justify-center gap-2 font-black text-xs transition cursor-pointer ${
                  gearEquipped.helmet
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                    : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                }`}
              >
                <span className="text-2xl">🪖</span>
                <span>{gearEquipped.helmet ? 'Шолом надіто ✓' : 'Одягти шолом'}</span>
              </button>

              <button
                onClick={() => {
                  audio.playPop();
                  setGearEquipped(prev => ({ ...prev, pads: true }));
                  const msg = 'Наколінники та налокітники одягнуто!';
                  setSpeechText(msg);
                  audio.speakUkrainian(msg, 'nicole');
                }}
                className={`p-2.5 rounded-2xl border-2 flex items-center justify-center gap-2 font-black text-xs transition cursor-pointer ${
                  gearEquipped.pads
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                    : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                }`}
              >
                <span className="text-2xl">🛡️</span>
                <span>{gearEquipped.pads ? 'Захист надіто ✓' : 'Наколінники'}</span>
              </button>

              <button
                onClick={() => {
                  audio.playRollerSkate();
                  setGearEquipped(prev => ({ ...prev, skates: true }));
                  const msg = 'Яскраві роликові ковзани взуто! Готові до старту!';
                  setSpeechText(msg);
                  audio.speakUkrainian(msg, 'nicole');
                }}
                className={`p-2.5 rounded-2xl border-2 flex items-center justify-center gap-2 font-black text-xs transition cursor-pointer ${
                  gearEquipped.skates
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                    : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                }`}
              >
                <span className="text-2xl">🛼</span>
                <span>{gearEquipped.skates ? 'Ролики взуто ✓' : 'Взути ролики'}</span>
              </button>
            </div>

            {/* Skate Forward Controls */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                onClick={() => {
                  if (!gearEquipped.helmet || !gearEquipped.pads || !gearEquipped.skates) {
                    const msg = 'Одягни повний захист (шолом, наколінники та ролики) перед катанням!';
                    setSpeechText(msg);
                    audio.speakUkrainian(msg, 'nicole');
                    return;
                  }

                  audio.playRollerSkate();
                  const nextProgress = Math.min(100, skatingProgress + 20);
                  setSkatingProgress(nextProgress);
                  const msg = `Вжух-вжух! Ніколь прокотилася ще 20 метрів! Разом: ${nextProgress}м!`;
                  setSpeechText(msg);
                  audio.speakUkrainian(msg, 'nicole');

                  if (nextProgress >= 100 && !isCompleted) {
                    finishStage();
                  }
                }}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 active:scale-95 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg border-2 border-white flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span className="text-2xl animate-spin">🛼</span>
                <span>Котитися вперед! (+20м)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Stage Navigation */}
      <div className="w-full max-w-4xl flex items-center justify-between gap-3 mt-4">
        {onPrevStage ? (
          <button
            onClick={onPrevStage}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-100 active:scale-95 text-gray-800 font-black text-xs sm:text-sm rounded-2xl border-2 border-gray-200 transition cursor-pointer shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Назад</span>
          </button>
        ) : (
          <div />
        )}

        {isCompleted && onNextStage && (
          <button
            onClick={onNextStage}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg border-2 border-emerald-200 transition cursor-pointer animate-pulse"
          >
            <span>Наступна пригода</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
