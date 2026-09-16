import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Star, Heart, Volume2, ArrowRight, Home, CheckCircle2, RotateCcw } from 'lucide-react';
import { NicoleAvatar } from '../NicoleAvatar';
import { NicoleAppearance, GrandmaStageId } from '../../types';
import { audio } from '../../utils/audio';

interface GrandmaStoryStageProps {
  stageId: GrandmaStageId;
  appearance: NicoleAppearance;
  onCompleteStage: (stageId: GrandmaStageId, stickers: string[]) => void;
  onNextStage: (nextStageId: GrandmaStageId) => void;
  onGoHome: () => void;
  onOpenWardrobe: () => void;
}

export const GrandmaStoryStage: React.FC<GrandmaStoryStageProps> = ({
  stageId,
  appearance,
  onCompleteStage,
  onNextStage,
  onGoHome,
  onOpenWardrobe,
}) => {
  // Common state
  const [speechText, setSpeechText] = useState<string>('');
  const [isStageDone, setIsStageDone] = useState<boolean>(false);

  // STAGE 1: CHICKENS STATE
  const [seedsCount, setSeedsCount] = useState<number>(0);
  const [scatteredSeeds, setScatteredSeeds] = useState<{ id: number; x: number; y: number }[]>([]);
  const [collectedEggs, setCollectedEggs] = useState<number[]>([]); // egg indices 0, 1, 2
  const [chickensEating, setChickensEating] = useState<boolean>(false);

  // STAGE 2: PLANTS STATE
  // 5 plants: geranium, marigold, strawberry, sunflower, fern
  const [wateredPlants, setWateredPlants] = useState<Record<string, number>>({
    geranium: 0,
    marigold: 0,
    strawberry: 0,
    sunflower: 0,
    fern: 0,
  });
  const [isSprinkling, setIsSprinkling] = useState<boolean>(false);

  // STAGE 3: CATS STATE (Жменя, Райян, Лапич)
  type CatId = 'zhmenia' | 'ryan' | 'lapych';
  const [activeCat, setActiveCat] = useState<CatId>('zhmenia');
  const [catsHappiness, setCatsHappiness] = useState<Record<CatId, number>>({
    zhmenia: 30,
    ryan: 30,
    lapych: 30,
  });
  const [catActionAnim, setCatActionAnim] = useState<string>('idle');
  const [catFloatingHearts, setCatFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  // STAGE 4: MUSHROOMS STATE
  interface ForestSpot {
    id: number;
    name: string;
    type: 'boletus' | 'chanterelle' | 'butter' | 'blueberry' | 'toadstool';
    icon: string;
    description: string;
    isEdible: boolean;
    discovered: boolean;
    picked: boolean;
  }
  const [forestSpots, setForestSpots] = useState<ForestSpot[]>([
    { id: 1, name: 'Білий гриб', type: 'boletus', icon: '🍄', description: 'Справжній король лісу — міцний боровик!', isEdible: true, discovered: false, picked: false },
    { id: 2, name: 'Лисичка', type: 'chanterelle', icon: '🦊', description: 'Золотиста смачна лисичка біля берізки!', isEdible: true, discovered: false, picked: false },
    { id: 3, name: 'Мухомор', type: 'toadstool', icon: '🍄', description: 'Гарний, але отруйний! Залишаємо для лісових лосів!', isEdible: false, discovered: false, picked: false },
    { id: 4, name: 'Маслюк', type: 'butter', icon: '🌰', description: 'Блискучий молодий маслючок під хвоєю!', isEdible: true, discovered: false, picked: false },
    { id: 5, name: 'Лісова чорничка', type: 'blueberry', icon: '🫐', description: 'Солодка вітамінна чорничка на галявині!', isEdible: true, discovered: false, picked: false },
    { id: 6, name: 'Лисичка-сестричка', type: 'chanterelle', icon: '🦊', description: 'Ще одна весела жовтенька лисичка!', isEdible: true, discovered: false, picked: false },
  ]);

  // STAGE 5: PUDDLES STATE
  const [puddleJumps, setPuddleJumps] = useState<number>(0);
  const [puddleSplashes, setPuddleSplashes] = useState<{ id: number; puddleIndex: number; x: number; y: number }[]>([]);
  const [nicolePosIndex, setNicolePosIndex] = useState<number>(0);

  // Initialize stage speech
  useEffect(() => {
    setIsStageDone(false);
    if (stageId === 'chickens') {
      const intro = 'Курочки та маленькі курчатка чекають на сніданок! Насип їм зерняток та заглянь у гніздечка!';
      setSpeechText(intro);
      audio.speakUkrainian(intro, 'nicole');
    } else if (stageId === 'plants') {
      const intro = 'У бабусі на терасі пишно цвітуть вазонки! Візьми поливальничку і напої кожну квіточку!';
      setSpeechText(intro);
      audio.speakUkrainian(intro, 'nicole');
    } else if (stageId === 'cats') {
      const intro = 'Ось і наші пухнасті друзі: Жменя, Райян та Лапич! Пограйся з ними пірʼїнкою, клубочком та почухай пузико!';
      setSpeechText(intro);
      audio.speakUkrainian(intro, 'nicole');
    } else if (stageId === 'mushrooms') {
      const intro = 'Ми прийшли в сосновий ліс по гриби! Шукай під листочками білі гриби та лисички, а мухомори не чіпай!';
      setSpeechText(intro);
      audio.speakUkrainian(intro, 'nicole');
    } else if (stageId === 'puddles') {
      const intro = 'Після літнього дощику визирнуло сонечко й засяяла веселка! Одягай чобітки й таляпайся в калюжах!';
      setSpeechText(intro);
      audio.speakUkrainian(intro, 'nicole');
    }
  }, [stageId]);

  // ----------------------------------------------------
  // HANDLERS FOR STAGE 1: CHICKENS
  // ----------------------------------------------------
  const handleScatterSeeds = (e: React.MouseEvent<HTMLDivElement>) => {
    audio.playChickenCluck();
    audio.playCrunch();
    setChickensEating(true);
    setSeedsCount(c => c + 1);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(20, Math.min(rect.width - 20, e.clientX - rect.left));
    const y = Math.max(20, Math.min(rect.height - 20, e.clientY - rect.top));

    const newSeeds = [
      { id: Date.now(), x, y },
      { id: Date.now() + 1, x: x + 15, y: y + 8 },
      { id: Date.now() + 2, x: x - 12, y: y + 14 },
    ];
    setScatteredSeeds(prev => [...prev.slice(-15), ...newSeeds]);

    setSpeechText('Ко-ко-ко! Ціп-ціп-ціп! Курочки та маленькі курчатка радісно дзьобають зернятка!');

    setTimeout(() => {
      setChickensEating(false);
    }, 1200);
  };

  const handleCollectEgg = (idx: number) => {
    if (collectedEggs.includes(idx)) return;
    audio.playSparkle();
    const updated = [...collectedEggs, idx];
    setCollectedEggs(updated);
    setSpeechText(`Ой, яке тепле свіже яєчко у гніздечку! (${updated.length}/3 зібрано)`);

    if (updated.length === 3 && seedsCount >= 3) {
      triggerStageSuccess('chickens', ['Золоте яєчко 🥚', 'Курочка Рябуха 🐔']);
    }
  };

  // ----------------------------------------------------
  // HANDLERS FOR STAGE 2: PLANTS
  // ----------------------------------------------------
  const handleWaterPlant = (plantKey: string) => {
    audio.playWaterPlants();
    audio.playSparkle();

    setWateredPlants(prev => {
      const current = prev[plantKey] || 0;
      const nextVal = Math.min(100, current + 35);
      const updated = { ...prev, [plantKey]: nextVal };

      const allWatered = (Object.values(updated) as number[]).every(val => val >= 90);
      if (allWatered && !isStageDone) {
        triggerStageSuccess('plants', ['Квітучий вазонок 🌺', 'Золотий поливальник 💧']);
      }
      return updated;
    });

    setSpeechText('Бульк-бульк! Квіточка напилася водички, розправила пелюсточки і сяє!');
  };

  const handleRainbowMist = () => {
    audio.playSparkle();
    audio.playWaterSplash();
    setIsSprinkling(true);
    setSpeechText('Веселковий туман освіжив усі квіточки бабусі! Яка краса!');

    setWateredPlants(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(k => {
        updated[k] = Math.min(100, updated[k] + 25);
      });
      const allWatered = (Object.values(updated) as number[]).every(val => val >= 90);
      if (allWatered && !isStageDone) {
        triggerStageSuccess('plants', ['Квітучий вазонок 🌺', 'Золотий поливальник 💧']);
      }
      return updated;
    });

    setTimeout(() => setIsSprinkling(false), 1500);
  };

  // ----------------------------------------------------
  // HANDLERS FOR STAGE 3: CATS (Жменя, Райян, Лапич)
  // ----------------------------------------------------
  const catNames: Record<CatId, { name: string; trait: string; color: string; bg: string }> = {
    zhmenia: { name: 'Жменя', trait: 'Пухнаста триколірна кішечка, любить ловити пірʼїнку!', color: 'text-pink-600', bg: 'bg-pink-100' },
    ryan: { name: 'Райян', trait: 'Сміливий рудий бешкетник, катає клубочки вовни!', color: 'text-amber-600', bg: 'bg-amber-100' },
    lapych: { name: 'Лапич', trait: 'Вгодований котик з великими білими лапками, обожнює рибку й пузико!', color: 'text-indigo-600', bg: 'bg-indigo-100' },
  };

  const handlePlayWithCat = (action: 'feather' | 'yarn' | 'fish' | 'pet') => {
    audio.playCatPurrMeow(activeCat);
    setCatActionAnim(action);

    setCatsHappiness(prev => {
      const cur = prev[activeCat];
      const nextVal = Math.min(100, cur + 25);
      const updated = { ...prev, [activeCat]: nextVal };

      const allHappy = (Object.values(updated) as number[]).every(v => v >= 90);
      if (allHappy && !isStageDone) {
        triggerStageSuccess('cats', ['Котик Жменя 🐱', 'Котик Райян 🐈', 'Котик Лапич 🐾']);
      }
      return updated;
    });

    if (action === 'feather') {
      setSpeechText(`${catNames[activeCat].name} весело стрибає і ловить пірʼїнку мʼякенькими лапками!`);
    } else if (action === 'yarn') {
      setSpeechText(`${catNames[activeCat].name} ганяє пухнастий клубочок вовни по всьому килимку!`);
    } else if (action === 'fish') {
      audio.playCrunch();
      setSpeechText(`Хрум-хрум! ${catNames[activeCat].name} поласував смачною рибкою та солодко муркоче!`);
    } else {
      audio.playPetBrush();
      setSpeechText(`Мур-мур-мур! ${catNames[activeCat].name} мружиться від щастя, коли Ніколь його чухає!`);
    }

    // floating heart
    setCatFloatingHearts(prev => [...prev.slice(-6), { id: Date.now(), x: 120 + Math.random() * 80, y: 80 }]);

    setTimeout(() => {
      setCatActionAnim('idle');
    }, 1200);
  };

  // ----------------------------------------------------
  // HANDLERS FOR STAGE 4: MUSHROOMS
  // ----------------------------------------------------
  const handleSpotClick = (spot: ForestSpot) => {
    if (!spot.discovered) {
      audio.playBrush();
      setForestSpots(prev =>
        prev.map(s => (s.id === spot.id ? { ...s, discovered: true } : s))
      );
      if (spot.isEdible) {
        setSpeechText(`Ой, під листочками ховався ${spot.name}! Торкнись його, щоб покласти у кошик!`);
      } else {
        audio.playPop();
        setSpeechText('Ой, це мухомор! Він дуже красивий, але отруйний. Ми його не зриваємо, нехай білочки й лосі милуються!');
      }
    } else if (spot.isEdible && !spot.picked) {
      audio.playMushroomFound();
      setForestSpots(prev => {
        const updated = prev.map(s => (s.id === spot.id ? { ...s, picked: true } : s));
        const pickedCount = updated.filter(s => s.isEdible && s.picked).length;
        const totalEdible = updated.filter(s => s.isEdible).length;

        setSpeechText(`Ніколь обережно поклала ${spot.name} у плетений кошик! (${pickedCount}/${totalEdible})`);

        if (pickedCount === totalEdible && !isStageDone) {
          triggerStageSuccess('mushrooms', ['Королівський білий гриб 🍄', 'Лісовий кошик 🧺']);
        }
        return updated;
      });
    }
  };

  // ----------------------------------------------------
  // HANDLERS FOR STAGE 5: PUDDLES
  // ----------------------------------------------------
  const puddles = [
    { id: 0, name: 'Маленька калюжка', x: '15%', y: '65%', size: 'w-24 h-14' },
    { id: 1, name: 'Велика весела калюжа', x: '45%', y: '50%', size: 'w-36 h-20' },
    { id: 2, name: 'Калюжка з паперовим човником', x: '75%', y: '68%', size: 'w-28 h-16' },
    { id: 3, name: 'Блискуча калюжа біля соняшників', x: '35%', y: '80%', size: 'w-32 h-18' },
  ];

  const handleJumpInPuddle = (puddleIdx: number) => {
    audio.playPuddleSplash();
    setNicolePosIndex(puddleIdx);
    const newJumps = puddleJumps + 1;
    setPuddleJumps(newJumps);

    const newSplash = {
      id: Date.now(),
      puddleIndex: puddleIdx,
      x: Math.random() * 40 - 20,
      y: Math.random() * 20 - 10,
    };
    setPuddleSplashes(prev => [...prev.slice(-8), newSplash]);

    const phrases = [
      'Плюсь-плюсь! Які теплі прозорі бризки розлітаються довкола!',
      'Хлюп-хлюп! Жовті чобітки Ніколь дзвінко таляпаються по воді!',
      'Ура! Паперовий кораблик гойдається на хвилях від стрибка!',
      'Веселкові краплинки сяють на сонечку! Як же весело!',
    ];
    setSpeechText(phrases[newJumps % phrases.length]);

    if (newJumps >= 5 && !isStageDone) {
      triggerStageSuccess('puddles', ['Веселкові чобітки 👢', 'Калюжний сплеск 🌧️']);
    }
  };

  // Trigger stage completion
  const triggerStageSuccess = (stId: GrandmaStageId, stickers: string[]) => {
    setIsStageDone(true);
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    audio.playFanfare();
    onCompleteStage(stId, stickers);

    const congratsMap: Record<GrandmaStageId, string> = {
      chickens: 'Ура! Курочки та курчатка ситі, а свіжі яєчка у кошику! Ніколь — чудова помічниця!',
      plants: 'Неймовірно! Усі вазонки та квіти напоєні і радісно сяють пелюстками!',
      cats: 'Усі три котики — Жменя, Райян і Лапич — нагодовані, набавилися і солодко муркочуть!',
      mushrooms: 'Кошик повний ароматних білих грибів та лисичок! Бабуся приготує смачний обід!',
      puddles: 'Ура! Найвеселіше таляпання в калюжах вдалося на славу! Повна перемога!',
    };
    const message = congratsMap[stId];
    setSpeechText(message);
    audio.speakUkrainian(message, 'nicole');
  };

  // Next Stage navigation map
  const nextStageMapping: Record<GrandmaStageId, GrandmaStageId | 'done'> = {
    chickens: 'plants',
    plants: 'cats',
    cats: 'mushrooms',
    mushrooms: 'puddles',
    puddles: 'done',
  };

  const stageTitles: Record<GrandmaStageId, { title: string; subtitle: string; icon: string }> = {
    chickens: { title: 'Годуємо курочок', subtitle: 'Зернятко для курочок та збір теплих яєчок', icon: '🌾' },
    plants: { title: 'Поливаємо вазонки', subtitle: 'Дбайливий полив квітів бабусі', icon: '🌺' },
    cats: { title: 'Граємося з котиками', subtitle: 'Жменя, Райян та Лапич чекають на гру!', icon: '🐱' },
    mushrooms: { title: 'У ліс по гриби', subtitle: 'Шукаємо білі гриби та лисички в сосновому лісі', icon: '🍄' },
    puddles: { title: 'Таляпаємося в калюжах!', subtitle: 'Веселі літні стрибки в гумових чобітках', icon: '🌧️' },
  };

  return (
    <div className="flex-1 w-full bg-gradient-to-b from-amber-50 via-emerald-50 to-sky-50 flex flex-col items-center p-3 sm:p-5 md:p-7 select-none">
      <div className="w-full max-w-5xl flex flex-col gap-4">
        {/* Stage Header Card */}
        <div className="bg-white/90 backdrop-blur-xs rounded-3xl p-4 sm:p-5 border-3 border-amber-200 shadow-md flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl p-2 bg-amber-100 rounded-2xl border border-amber-300 shadow-xs">
              {stageTitles[stageId].icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                  Історія: Поїхати до бабусі 🏡
                </span>
                {isStageDone && (
                  <span className="text-xs font-black bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Виконано!
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                {stageTitles[stageId].title}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-gray-600">
                {stageTitles[stageId].subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                audio.playPop();
                onGoHome();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-100 hover:bg-amber-200 active:scale-95 text-amber-900 rounded-2xl font-black text-xs sm:text-sm transition cursor-pointer"
              title="Повернутися на карту історій"
            >
              <Home className="w-4 h-4" />
              <span>Карта</span>
            </button>

            <button
              onClick={() => {
                audio.playSparkle();
                onOpenWardrobe();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-pink-100 hover:bg-pink-200 active:scale-95 text-pink-900 rounded-2xl font-black text-xs sm:text-sm transition cursor-pointer"
              title="Переодягнути Ніколь"
            >
              <span>👗</span>
              <span className="hidden sm:inline">Одяг</span>
            </button>
          </div>
        </div>

        {/* Speech Bubble */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border-2 border-emerald-200 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-300 shrink-0 shadow-xs">
              <NicoleAvatar appearance={appearance} className="w-full h-full" />
            </div>
            <p className="text-xs sm:text-base font-bold text-gray-800 leading-snug">
              {speechText}
            </p>
          </div>

          <button
            onClick={() => audio.speakUkrainian(speechText, 'nicole')}
            className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl transition cursor-pointer shrink-0"
            title="Озвучити"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE PLAYGROUND PER STAGE */}
        {/* ========================================================================= */}

        {/* -------------------- STAGE 1: CHICKENS -------------------- */}
        {stageId === 'chickens' && (
          <div className="bg-gradient-to-b from-amber-100 via-yellow-50 to-emerald-100 rounded-3xl p-4 sm:p-6 border-4 border-amber-300 shadow-xl flex flex-col gap-4 relative overflow-hidden">
            {/* Top Prompt & Egg Count */}
            <div className="flex flex-wrap items-center justify-between gap-2 z-10">
              <div className="flex items-center gap-2 bg-white/90 px-3.5 py-1.5 rounded-2xl border border-amber-200 shadow-xs">
                <span className="text-xl">🌾</span>
                <span className="text-xs sm:text-sm font-black text-gray-800">
                  Зерняток насипано: <strong className="text-amber-600">{seedsCount}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white/90 px-3.5 py-1.5 rounded-2xl border border-amber-200 shadow-xs">
                <span className="text-xl">🧺</span>
                <span className="text-xs sm:text-sm font-black text-gray-800">
                  Яєчок зібрано: <strong className="text-rose-600">{collectedEggs.length}/3</strong>
                </span>
              </div>
            </div>

            {/* Farm Barnyard Interactive Area */}
            <div
              onClick={handleScatterSeeds}
              className="relative w-full h-72 sm:h-80 bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-200 rounded-2xl border-2 border-amber-300 shadow-inner overflow-hidden cursor-pointer group"
              title="Торкнись подвірʼя, щоб насипати зерняток курочкам!"
            >
              {/* Rustic fence & sunflowers background */}
              <div className="absolute top-2 left-4 text-3xl select-none opacity-80">🌻 🌻 🌻</div>
              <div className="absolute top-2 right-4 text-3xl select-none opacity-80">🌻 🌻 🌻</div>
              <div className="absolute top-8 left-0 right-0 border-b-2 border-amber-400/40" />

              {/* Scattered grain spots */}
              {scatteredSeeds.map(s => (
                <div
                  key={s.id}
                  className="absolute w-2.5 h-2.5 bg-amber-400 rounded-full border border-amber-600 pointer-events-none shadow-xs"
                  style={{ left: s.x, top: s.y }}
                />
              ))}

              {/* Nicole Feeding Chickens */}
              <div className="absolute left-6 bottom-4 w-24 h-28 pointer-events-none">
                <NicoleAvatar appearance={appearance} className="w-full h-full" />
              </div>

              {/* Chickens & Chicks on Yard */}
              <motion.div
                animate={chickensEating ? { y: [0, 8, 0], rotate: [-2, 3, -2] } : { y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: chickensEating ? 0.3 : 1.8 }}
                className="absolute left-[38%] bottom-8 flex items-end gap-3 pointer-events-none"
              >
                {/* Hen Ryabuha */}
                <div className="text-center">
                  <span className="text-5xl drop-shadow-md">🐔</span>
                  <div className="text-[10px] font-black bg-white/80 px-1.5 py-0.5 rounded-md">Рябуха</div>
                </div>

                {/* Yellow Chicks */}
                <div className="text-center">
                  <span className="text-3xl animate-bounce">🐤</span>
                  <div className="text-[9px] font-black bg-white/80 px-1 rounded-md">Ціпа</div>
                </div>
                <div className="text-center">
                  <span className="text-3xl">🐥</span>
                  <div className="text-[9px] font-black bg-white/80 px-1 rounded-md">Жовтик</div>
                </div>
              </motion.div>

              {/* 3 Straw Nests with Warm Eggs */}
              <div className="absolute right-4 bottom-4 flex flex-col gap-2 z-10">
                <span className="text-[10px] font-black text-amber-900 bg-white/80 px-2 py-0.5 rounded-full text-center">
                  Гніздечка з яєчками:
                </span>
                <div className="flex gap-2">
                  {[0, 1, 2].map(idx => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCollectEgg(idx);
                      }}
                      className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition active:scale-90 border-2 cursor-pointer shadow-md ${
                        collectedEggs.includes(idx)
                          ? 'bg-amber-100 border-amber-300 opacity-60'
                          : 'bg-amber-200 border-amber-400 hover:scale-105 animate-pulse'
                      }`}
                      title="Взяти тепленьке яєчко у кошик"
                    >
                      <span className="text-xs">🪹</span>
                      <span className="text-xl">
                        {collectedEggs.includes(idx) ? '✨' : '🥚'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Click prompt overlay */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded-full text-xs font-black text-amber-900 shadow-sm border border-amber-200 pointer-events-none">
                👆 Торкнись галявини, щоб сипати зерно!
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  audio.playChickenCluck();
                  setSeedsCount(c => c + 1);
                  setSpeechText('Ціп-ціп-ціп! Ніколь кличе всіх курочок до годівнички!');
                }}
                className="px-5 py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-sm rounded-2xl shadow-md border-2 border-amber-300 flex items-center gap-2 cursor-pointer"
              >
                <span>🌾</span>
                <span>Насипати повну жменю зерна!</span>
              </button>
            </div>
          </div>
        )}

        {/* -------------------- STAGE 2: PLANTS -------------------- */}
        {stageId === 'plants' && (
          <div className="bg-gradient-to-b from-emerald-100 via-lime-50 to-pink-100 rounded-3xl p-4 sm:p-6 border-4 border-emerald-300 shadow-xl flex flex-col gap-4 relative overflow-hidden">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs sm:text-sm font-black text-gray-800 bg-white/90 px-3 py-1.5 rounded-2xl border border-emerald-200">
                💧 Напоєно вазонків: <strong className="text-emerald-700">
                  {(Object.values(wateredPlants) as number[]).filter(v => v >= 90).length}/5
                </strong>
              </div>

              <button
                onClick={handleRainbowMist}
                className="px-4 py-2 bg-gradient-to-r from-sky-400 to-indigo-400 hover:brightness-105 active:scale-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md flex items-center gap-1.5 cursor-pointer"
                title="Освіжити все веселковим туманом"
              >
                <span>🌈</span>
                <span>Веселковий розпилювач</span>
              </button>
            </div>

            {/* 5 Plant Pots Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {[
                { key: 'geranium', name: 'Герань', icon: '🌸', color: 'from-pink-100 to-rose-50', pot: '🪴' },
                { key: 'marigold', name: 'Чорнобривці', icon: '🌼', color: 'from-amber-100 to-yellow-50', pot: '🪴' },
                { key: 'strawberry', name: 'Полуничка', icon: '🍓', color: 'from-red-100 to-pink-50', pot: '🪴' },
                { key: 'sunflower', name: 'Соняшник', icon: '🌻', color: 'from-yellow-100 to-amber-50', pot: '🪴' },
                { key: 'fern', name: 'Папороть', icon: '🌿', color: 'from-emerald-100 to-teal-50', pot: '🪴' },
              ].map(p => {
                const progress = wateredPlants[p.key] || 0;
                const isBloomed = progress >= 90;
                return (
                  <div
                    key={p.key}
                    onClick={() => handleWaterPlant(p.key)}
                    className={`p-3.5 rounded-3xl border-3 flex flex-col items-center justify-between transition cursor-pointer active:scale-95 shadow-md bg-gradient-to-b ${p.color} ${
                      isBloomed ? 'border-emerald-400 ring-2 ring-emerald-300' : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="text-center mb-1">
                      <span className="text-xs font-black text-gray-800">{p.name}</span>
                    </div>

                    <motion.div
                      animate={isBloomed ? { scale: [1, 1.1, 1] } : { y: [0, -2, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="relative my-2"
                    >
                      <span className="text-4xl sm:text-5xl">{p.icon}</span>
                      {isBloomed && (
                        <span className="absolute -top-1 -right-2 text-base animate-ping">✨</span>
                      )}
                    </motion.div>

                    <div className="w-full mt-2">
                      <div className="h-3 w-full bg-white rounded-full overflow-hidden border border-emerald-200 p-0.5 shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-sky-400 to-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-emerald-800 block text-center mt-1">
                        {isBloomed ? 'Розквітла! 💖' : 'Хоче водички 💧'}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWaterPlant(p.key);
                      }}
                      className="mt-2 w-full py-1.5 bg-emerald-500 hover:bg-emerald-600 active:scale-90 text-white font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>🚿</span>
                      <span>Полити</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* -------------------- STAGE 3: CATS (Жменя, Райян, Лапич) -------------------- */}
        {stageId === 'cats' && (
          <div className="bg-gradient-to-b from-pink-100 via-rose-50 to-amber-100 rounded-3xl p-4 sm:p-6 border-4 border-pink-300 shadow-xl flex flex-col gap-4 relative overflow-hidden">
            {/* Cats Selector Tabs */}
            <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3 bg-white/90 p-2 rounded-2xl border border-pink-200">
              <div className="flex items-center gap-2">
                {(['zhmenia', 'ryan', 'lapych'] as CatId[]).map(catId => (
                  <button
                    key={catId}
                    onClick={() => {
                      audio.playCatPurrMeow(catId);
                      setActiveCat(catId);
                      setSpeechText(`Ніколь підійшла до котика ${catNames[catId].name}! ${catNames[catId].trait}`);
                    }}
                    className={`px-3.5 py-2 rounded-xl font-black text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer ${
                      activeCat === catId
                        ? 'bg-pink-500 text-white shadow-md'
                        : 'bg-pink-50 text-pink-900 hover:bg-pink-100'
                    }`}
                  >
                    <span>{catId === 'zhmenia' ? '🐱' : catId === 'ryan' ? '🐈' : '🐾'}</span>
                    <span>{catNames[catId].name}</span>
                    <span className="text-[10px] opacity-80">({catsHappiness[catId]}%)</span>
                  </button>
                ))}
              </div>

              <div className="text-xs font-black text-gray-700">
                Загальне щастя котиків: <strong>{Math.round((catsHappiness.zhmenia + catsHappiness.ryan + catsHappiness.lapych) / 3)}%</strong>
              </div>
            </div>

            {/* Cozy Cat Lounge Interactive Stage */}
            <div className="relative w-full h-64 sm:h-72 bg-gradient-to-b from-amber-50 via-pink-50 to-rose-100 rounded-2xl border-2 border-pink-300 shadow-inner flex flex-col items-center justify-center overflow-hidden">
              {/* Cozy rug */}
              <div className="absolute bottom-2 w-72 h-20 bg-rose-200/60 rounded-full blur-xs border border-rose-300" />

              {/* Floating hearts */}
              {catFloatingHearts.map(h => (
                <motion.span
                  key={h.id}
                  initial={{ opacity: 1, y: 0, scale: 0.8 }}
                  animate={{ opacity: 0, y: -50, scale: 1.4 }}
                  transition={{ duration: 1 }}
                  className="absolute text-2xl pointer-events-none"
                  style={{ left: h.x, top: h.y }}
                >
                  💖
                </motion.span>
              ))}

              {/* Active Cat Visual Display */}
              <motion.div
                animate={
                  catActionAnim === 'feather'
                    ? { y: [0, -25, 0], rotate: [-4, 4, -4] }
                    : catActionAnim === 'yarn'
                    ? { x: [-15, 15, -15] }
                    : catActionAnim === 'fish'
                    ? { scale: [1, 1.08, 1] }
                    : { y: [0, -3, 0] }
                }
                transition={{ repeat: Infinity, duration: 1 }}
                className="flex flex-col items-center z-10 select-none"
              >
                <div className="text-7xl sm:text-8xl filter drop-shadow-lg">
                  {activeCat === 'zhmenia' ? '🐱' : activeCat === 'ryan' ? '🐈' : '😻'}
                </div>

                <div className="mt-2 bg-white/90 px-3 py-1 rounded-full shadow-xs border border-pink-200 text-center">
                  <span className="text-sm font-black text-gray-900">
                    Котик {catNames[activeCat].name}
                  </span>
                  <p className="text-[11px] font-bold text-pink-700">
                    {catNames[activeCat].trait}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Cat Toys & Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => handlePlayWithCat('feather')}
                className="p-3 bg-white hover:bg-pink-50 active:scale-95 border-2 border-pink-300 rounded-2xl shadow-sm flex items-center justify-center gap-2 cursor-pointer font-black text-xs sm:text-sm text-gray-800"
              >
                <span className="text-2xl">🪶</span>
                <span>Пірʼїнка</span>
              </button>

              <button
                onClick={() => handlePlayWithCat('yarn')}
                className="p-3 bg-white hover:bg-pink-50 active:scale-95 border-2 border-pink-300 rounded-2xl shadow-sm flex items-center justify-center gap-2 cursor-pointer font-black text-xs sm:text-sm text-gray-800"
              >
                <span className="text-2xl">🧶</span>
                <span>Клубочок вовни</span>
              </button>

              <button
                onClick={() => handlePlayWithCat('fish')}
                className="p-3 bg-white hover:bg-pink-50 active:scale-95 border-2 border-pink-300 rounded-2xl shadow-sm flex items-center justify-center gap-2 cursor-pointer font-black text-xs sm:text-sm text-gray-800"
              >
                <span className="text-2xl">🐟</span>
                <span>Смачна рибка</span>
              </button>

              <button
                onClick={() => handlePlayWithCat('pet')}
                className="p-3 bg-white hover:bg-pink-50 active:scale-95 border-2 border-pink-300 rounded-2xl shadow-sm flex items-center justify-center gap-2 cursor-pointer font-black text-xs sm:text-sm text-gray-800"
              >
                <span className="text-2xl">🪮</span>
                <span>Почухати за вушком</span>
              </button>
            </div>
          </div>
        )}

        {/* -------------------- STAGE 4: MUSHROOMS -------------------- */}
        {stageId === 'mushrooms' && (
          <div className="bg-gradient-to-b from-emerald-100 via-amber-50 to-emerald-200 rounded-3xl p-4 sm:p-6 border-4 border-emerald-400 shadow-xl flex flex-col gap-4 relative overflow-hidden">
            {/* Basket Counter */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-white/90 p-2.5 rounded-2xl border border-emerald-300 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧺</span>
                <span className="text-xs sm:text-sm font-black text-gray-800">
                  У кошику: <strong className="text-emerald-700">
                    {forestSpots.filter(s => s.isEdible && s.picked).length} / {forestSpots.filter(s => s.isEdible).length}
                  </strong> лісових смаколиків
                </span>
              </div>

              <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                🌲 Сосновий ліс бабусі
              </span>
            </div>

            {/* Forest Trail Spots Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {forestSpots.map(spot => (
                <div
                  key={spot.id}
                  onClick={() => handleSpotClick(spot)}
                  className={`relative p-4 rounded-3xl border-3 flex flex-col items-center justify-center min-h-[140px] transition cursor-pointer active:scale-95 shadow-md ${
                    spot.picked
                      ? 'bg-emerald-50 border-emerald-300 opacity-70'
                      : spot.discovered
                      ? spot.isEdible
                        ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-300 animate-pulse'
                        : 'bg-rose-100 border-rose-300'
                      : 'bg-gradient-to-br from-emerald-200 to-amber-200 border-emerald-300 hover:brightness-105'
                  }`}
                >
                  {!spot.discovered ? (
                    /* Hidden under forest leaves */
                    <div className="flex flex-col items-center text-center">
                      <span className="text-4xl mb-1">🍂</span>
                      <span className="text-xs font-black text-emerald-950">
                        Опале листячко
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 mt-1">
                        👆 Поворуши!
                      </span>
                    </div>
                  ) : (
                    /* Discovered mushroom or berry */
                    <div className="flex flex-col items-center text-center">
                      <span className="text-4xl mb-1">{spot.icon}</span>
                      <span className="text-xs font-black text-gray-900">{spot.name}</span>
                      <span className="text-[10px] font-bold text-gray-600 mt-0.5 leading-tight">
                        {spot.picked ? 'Вже у кошику! ✨' : spot.isEdible ? 'Торкнись, щоб зірвати!' : 'Не зриваємо! 🦌'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------- STAGE 5: PUDDLES -------------------- */}
        {stageId === 'puddles' && (
          <div className="bg-gradient-to-b from-sky-100 via-indigo-50 to-emerald-100 rounded-3xl p-4 sm:p-6 border-4 border-sky-300 shadow-xl flex flex-col gap-4 relative overflow-hidden">
            {/* Top Rainbow & Splash Meter */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-white/90 p-2.5 rounded-2xl border border-sky-200 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌈</span>
                <span className="text-xs sm:text-sm font-black text-gray-800">
                  Стрибків у калюжах: <strong className="text-sky-600">{puddleJumps}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 hidden sm:inline">Сплеск радості:</span>
                <div className="w-32 h-4 bg-sky-100 rounded-full overflow-hidden border border-sky-300 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 via-indigo-400 to-pink-400 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (puddleJumps / 5) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Puddle Path Area */}
            <div className="relative w-full h-72 sm:h-80 bg-gradient-to-b from-sky-200 via-amber-100 to-emerald-100 rounded-2xl border-2 border-sky-300 shadow-inner overflow-hidden flex items-center justify-center">
              {/* Huge Rainbow in sky */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-4xl sm:text-5xl opacity-80 pointer-events-none">
                🌈
              </div>

              {/* Rain puddles on path */}
              {puddles.map((puddle, idx) => (
                <div
                  key={puddle.id}
                  onClick={() => handleJumpInPuddle(idx)}
                  className={`absolute rounded-[50%] bg-gradient-to-br from-sky-300 via-blue-200 to-sky-400 border-2 border-sky-400/80 shadow-md cursor-pointer hover:scale-105 active:scale-95 transition flex items-center justify-center ${puddle.size}`}
                  style={{ left: puddle.x, top: puddle.y }}
                  title="Стрибнути сюди!"
                >
                  {/* Floating paper boat or leaf */}
                  <span className="text-lg animate-bounce pointer-events-none">
                    {idx === 2 ? '⛵' : '🍃'}
                  </span>

                  {/* Water rings */}
                  <div className="absolute inset-1 rounded-[50%] border border-white/50 opacity-60 pointer-events-none" />
                </div>
              ))}

              {/* Nicole Avatar in Boots */}
              <motion.div
                animate={{
                  y: [0, -12, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 0.4 }}
                className="absolute z-20 pointer-events-none"
                style={{
                  left: puddles[nicolePosIndex]?.x || '45%',
                  top: `calc(${puddles[nicolePosIndex]?.y || '50%'} - 60px)`,
                }}
              >
                <div className="w-24 h-28 relative">
                  <NicoleAvatar appearance={appearance} className="w-full h-full" />
                  <span className="absolute -bottom-2 -left-2 text-2xl">👢</span>
                  <span className="absolute -bottom-2 -right-2 text-2xl">👢</span>
                </div>
              </motion.div>

              {/* Splashes flying */}
              {puddleSplashes.map(s => (
                <motion.span
                  key={s.id}
                  initial={{ opacity: 1, scale: 0.5, y: 0 }}
                  animate={{ opacity: 0, scale: 2, y: -40 }}
                  transition={{ duration: 0.7 }}
                  className="absolute pointer-events-none text-2xl z-30"
                  style={{
                    left: puddles[s.puddleIndex]?.x || '50%',
                    top: puddles[s.puddleIndex]?.y || '50%',
                  }}
                >
                  💦
                </motion.span>
              ))}

              {/* Click prompt */}
              <div className="absolute bottom-2 bg-white/90 px-3 py-1 rounded-full text-xs font-black text-sky-900 shadow-sm pointer-events-none">
                👆 Торкнись будь-якої калюжі, щоб стрибнути: «Хлюп-хлюп!»
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FOOTER NAVIGATION */}
        {/* ========================================================================= */}
        <div className="bg-white/90 rounded-2xl p-4 border border-amber-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              audio.playPop();
              onGoHome();
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 font-black text-xs sm:text-sm rounded-xl transition cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>До карти</span>
          </button>

          {isStageDone && (
            <button
              onClick={() => {
                audio.playSparkle();
                const next = nextStageMapping[stageId];
                if (next === 'done') {
                  onGoHome();
                } else {
                  onNextStage(next);
                }
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-105 active:scale-95 text-white font-black text-sm sm:text-base rounded-2xl shadow-md cursor-pointer animate-pulse"
            >
              <span>{nextStageMapping[stageId] === 'done' ? 'Завершити пригоду! 🏡' : 'Наступна гра! 🌟'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
