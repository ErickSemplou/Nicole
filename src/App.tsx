import React, { useState, useEffect } from 'react';
import {
  DayStageId,
  GrandmaStageId,
  GrandpaStageId,
  DanceStageId,
  NicoleAppearance,
  OutfitId,
  AccessoryId,
  ShoeId,
  KavusiaAccessory,
} from './types';
import { Header } from './components/Header';
import { DayMap } from './components/DayMap';
import { MorningStage } from './components/stages/MorningStage';
import { BusStage } from './components/stages/BusStage';
import { KindergartenStage } from './components/stages/KindergartenStage';
import { ParkStage } from './components/stages/ParkStage';
import { CafeStage } from './components/stages/CafeStage';
import { HomeStage } from './components/stages/HomeStage';
import { GrandmaStoryStage } from './components/stages/GrandmaStoryStage';
import { GrandpaStoryStage } from './components/stages/GrandpaStoryStage';
import { DanceStoryStage } from './components/stages/DanceStoryStage';
import { StickerBookModal } from './components/StickerBookModal';
import { WardrobeModal } from './components/WardrobeModal';
import { KavusiaPetModal } from './components/KavusiaPetModal';
import { DrawingStudioModal } from './components/DrawingStudioModal';
import { StarShopModal } from './components/StarShopModal';
import { PuzzlesModal } from './components/PuzzlesModal';
import { ShopItem } from './data/shopItems';
import { DEFAULT_APPEARANCE } from './components/NicoleAvatar';
import { OfflineIndicator } from './components/OfflineIndicator';
import { audio } from './utils/audio';

const STORAGE_KEY = 'nicole_game_progress_v7';

const GRANDPA_STAGES_ORDER: GrandpaStageId[] = [
  'train',
  'knopka',
  'ducklings',
  'fishing',
  'candies',
  'fence_art',
  'rollers',
];

const DANCE_STAGES_ORDER: DanceStageId[] = [
  'dance_dressing',
  'dance_warmup',
  'dance_moves',
  'dance_water',
  'dance_performance',
];

export default function App() {
  const [currentStage, setCurrentStage] = useState<'map' | DayStageId | GrandmaStageId | GrandpaStageId | DanceStageId>('map');
  const [completedStages, setCompletedStages] = useState<Record<DayStageId, boolean>>({
    morning: false,
    bus: false,
    kindergarten: false,
    park: false,
    cafe: false,
    home: false,
  });
  const [completedGrandmaStages, setCompletedGrandmaStages] = useState<Record<GrandmaStageId, boolean>>({
    chickens: false,
    plants: false,
    cats: false,
    mushrooms: false,
    puddles: false,
  });
  const [completedGrandpaStages, setCompletedGrandpaStages] = useState<Record<GrandpaStageId, boolean>>({
    train: false,
    knopka: false,
    ducklings: false,
    fishing: false,
    candies: false,
    fence_art: false,
    rollers: false,
  });
  const [completedDanceStages, setCompletedDanceStages] = useState<Record<DanceStageId, boolean>>({
    dance_dressing: false,
    dance_warmup: false,
    dance_moves: false,
    dance_water: false,
    dance_performance: false,
  });
  const [unlockedStickers, setUnlockedStickers] = useState<string[]>([]);
  const [starsCount, setStarsCount] = useState<number>(0);
  const [appearance, setAppearance] = useState<NicoleAppearance>(DEFAULT_APPEARANCE);
  const [kavusiaAccessory, setKavusiaAccessory] = useState<KavusiaAccessory>('bow');
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [completedPuzzles, setCompletedPuzzles] = useState<string[]>([]);

  const [isStickerBookOpen, setIsStickerBookOpen] = useState(false);
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [isKavusiaOpen, setIsKavusiaOpen] = useState(false);
  const [isDrawingOpen, setIsDrawingOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isPuzzlesOpen, setIsPuzzlesOpen] = useState(false);

  // Load saved progress from localStorage (offline friendly)
  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem('nicole_game_progress_v6') ||
        localStorage.getItem('nicole_game_progress_v4') ||
        localStorage.getItem('nicole_game_progress_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.completedStages) {
          setCompletedStages((prev) => ({ ...prev, ...parsed.completedStages }));
        }
        if (parsed.completedGrandmaStages) {
          setCompletedGrandmaStages((prev) => ({ ...prev, ...parsed.completedGrandmaStages }));
        }
        if (parsed.completedGrandpaStages) {
          setCompletedGrandpaStages((prev) => ({ ...prev, ...parsed.completedGrandpaStages }));
        }
        if (parsed.completedDanceStages) {
          setCompletedDanceStages((prev) => ({ ...prev, ...parsed.completedDanceStages }));
        }
        if (parsed.unlockedStickers) setUnlockedStickers(parsed.unlockedStickers);
        if (typeof parsed.starsCount === 'number') setStarsCount(parsed.starsCount);
        if (parsed.appearance) setAppearance(parsed.appearance);
        if (parsed.kavusiaAccessory) setKavusiaAccessory(parsed.kavusiaAccessory);
        if (Array.isArray(parsed.purchasedItems)) setPurchasedItems(parsed.purchasedItems);
        if (Array.isArray(parsed.completedPuzzles)) setCompletedPuzzles(parsed.completedPuzzles);
      }
    } catch {
      // ignore
    }
  }, []);

  const saveProgress = (
    nextStages: Record<DayStageId, boolean>,
    nextGrandmaStages: Record<GrandmaStageId, boolean>,
    nextGrandpaStages: Record<GrandpaStageId, boolean>,
    nextDanceStages: Record<DanceStageId, boolean>,
    nextStickers: string[],
    newStars: number,
    newAppearance: NicoleAppearance,
    newKavusiaAcc: KavusiaAccessory = kavusiaAccessory,
    newPurchased: string[] = purchasedItems,
    newPuzzles: string[] = completedPuzzles
  ) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          completedStages: nextStages,
          completedGrandmaStages: nextGrandmaStages,
          completedGrandpaStages: nextGrandpaStages,
          completedDanceStages: nextDanceStages,
          unlockedStickers: nextStickers,
          starsCount: newStars,
          appearance: newAppearance,
          kavusiaAccessory: newKavusiaAcc,
          purchasedItems: newPurchased,
          completedPuzzles: newPuzzles,
        })
      );
    } catch {
      // ignore
    }
  };

  const handleStageCompleted = (stageId: DayStageId, earnedStickers: string[]) => {
    setCompletedStages((prev) => {
      const nextStages = { ...prev, [stageId]: true };
      const uniqueStickers = Array.from(new Set([...unlockedStickers, ...earnedStickers]));
      const newStars = starsCount + 3;
      setUnlockedStickers(uniqueStickers);
      setStarsCount(newStars);
      saveProgress(
        nextStages,
        completedGrandmaStages,
        completedGrandpaStages,
        completedDanceStages,
        uniqueStickers,
        newStars,
        appearance,
        kavusiaAccessory,
        purchasedItems,
        completedPuzzles
      );
      return nextStages;
    });
  };

  const handleGrandmaStageCompleted = (stageId: GrandmaStageId, earnedStickers: string[]) => {
    setCompletedGrandmaStages((prev) => {
      const nextGrandma = { ...prev, [stageId]: true };
      const uniqueStickers = Array.from(new Set([...unlockedStickers, ...earnedStickers]));
      const newStars = starsCount + 3;
      setUnlockedStickers(uniqueStickers);
      setStarsCount(newStars);
      saveProgress(
        completedStages,
        nextGrandma,
        completedGrandpaStages,
        completedDanceStages,
        uniqueStickers,
        newStars,
        appearance,
        kavusiaAccessory,
        purchasedItems,
        completedPuzzles
      );
      return nextGrandma;
    });
  };

  const handleGrandpaStageCompleted = (stageId: GrandpaStageId, earnedStickers: string[]) => {
    setCompletedGrandpaStages((prev) => {
      const nextGrandpa = { ...prev, [stageId]: true };
      const uniqueStickers = Array.from(new Set([...unlockedStickers, ...earnedStickers]));
      const newStars = starsCount + 3;
      setUnlockedStickers(uniqueStickers);
      setStarsCount(newStars);
      saveProgress(
        completedStages,
        completedGrandmaStages,
        nextGrandpa,
        completedDanceStages,
        uniqueStickers,
        newStars,
        appearance,
        kavusiaAccessory,
        purchasedItems,
        completedPuzzles
      );
      return nextGrandpa;
    });
  };

  const handleDanceStageCompleted = (stageId: DanceStageId, earnedStickers: string[]) => {
    setCompletedDanceStages((prev) => {
      const nextDance = { ...prev, [stageId]: true };
      const uniqueStickers = Array.from(new Set([...unlockedStickers, ...earnedStickers]));
      const newStars = starsCount + 3;
      setUnlockedStickers(uniqueStickers);
      setStarsCount(newStars);
      saveProgress(
        completedStages,
        completedGrandmaStages,
        completedGrandpaStages,
        nextDance,
        uniqueStickers,
        newStars,
        appearance,
        kavusiaAccessory,
        purchasedItems,
        completedPuzzles
      );
      return nextDance;
    });
  };

  const handleSaveAppearance = (newLook: NicoleAppearance) => {
    setAppearance(newLook);
    saveProgress(
      completedStages,
      completedGrandmaStages,
      completedGrandpaStages,
      completedDanceStages,
      unlockedStickers,
      starsCount,
      newLook,
      kavusiaAccessory,
      purchasedItems,
      completedPuzzles
    );
  };

  const handleSaveKavusiaAccessory = (acc: KavusiaAccessory) => {
    setKavusiaAccessory(acc);
    saveProgress(
      completedStages,
      completedGrandmaStages,
      completedGrandpaStages,
      completedDanceStages,
      unlockedStickers,
      starsCount,
      appearance,
      acc,
      purchasedItems,
      completedPuzzles
    );
  };

  const handlePurchaseShopItem = (item: ShopItem) => {
    if (starsCount < item.price) return;
    const newStars = starsCount - item.price;
    const newPurchased = Array.from(new Set([...purchasedItems, item.id]));
    setStarsCount(newStars);
    setPurchasedItems(newPurchased);

    let nextAppearance = { ...appearance };
    let nextKavusiaAcc = kavusiaAccessory;

    if (item.outfitId) {
      nextAppearance.outfit = item.outfitId;
      setAppearance(nextAppearance);
    }
    if (item.shoeId) {
      nextAppearance.shoes = item.shoeId;
      setAppearance(nextAppearance);
    }
    if (item.accessoryId) {
      nextAppearance.accessory = item.accessoryId;
      setAppearance(nextAppearance);
    }
    if (item.kavusiaAccessoryId) {
      nextKavusiaAcc = item.kavusiaAccessoryId;
      setKavusiaAccessory(nextKavusiaAcc);
    }

    saveProgress(
      completedStages,
      completedGrandmaStages,
      completedGrandpaStages,
      completedDanceStages,
      unlockedStickers,
      newStars,
      nextAppearance,
      nextKavusiaAcc,
      newPurchased,
      completedPuzzles
    );
  };

  const handleEquipOutfit = (outfitId: OutfitId) => {
    const updated = { ...appearance, outfit: outfitId };
    setAppearance(updated);
    saveProgress(
      completedStages,
      completedGrandmaStages,
      completedGrandpaStages,
      completedDanceStages,
      unlockedStickers,
      starsCount,
      updated,
      kavusiaAccessory,
      purchasedItems,
      completedPuzzles
    );
  };

  const handleEquipShoe = (shoeId: ShoeId) => {
    const updated = { ...appearance, shoes: shoeId };
    setAppearance(updated);
    saveProgress(
      completedStages,
      completedGrandmaStages,
      completedGrandpaStages,
      completedDanceStages,
      unlockedStickers,
      starsCount,
      updated,
      kavusiaAccessory,
      purchasedItems,
      completedPuzzles
    );
  };

  const handleEquipAccessory = (accessoryId: AccessoryId) => {
    const updated = { ...appearance, accessory: accessoryId };
    setAppearance(updated);
    saveProgress(
      completedStages,
      completedGrandmaStages,
      completedGrandpaStages,
      completedDanceStages,
      unlockedStickers,
      starsCount,
      updated,
      kavusiaAccessory,
      purchasedItems,
      completedPuzzles
    );
  };

  const handlePuzzleCompleted = (puzzleId: string, starsReward: number) => {
    const newPuzzles = Array.from(new Set([...completedPuzzles, puzzleId]));
    const newStars = starsCount + starsReward;
    setCompletedPuzzles(newPuzzles);
    setStarsCount(newStars);
    saveProgress(
      completedStages,
      completedGrandmaStages,
      completedGrandpaStages,
      completedDanceStages,
      unlockedStickers,
      newStars,
      appearance,
      kavusiaAccessory,
      purchasedItems,
      newPuzzles
    );
  };

  const stageTitles: Record<DayStageId | GrandmaStageId | GrandpaStageId | DanceStageId, string> = {
    morning: 'Ранок вдома ☀️',
    bus: 'Маршрутка з мамою 🚌',
    kindergarten: 'Веселий садочок 🎨',
    park: 'Парк пригод 🛴',
    cafe: 'Пончик та какао 🍩',
    home: 'Повернення додому 🏡',
    chickens: 'Годуємо курочок 🌾',
    plants: 'Поливаємо вазонки 🌺',
    cats: 'Котики Жменя, Райян і Лапич 🐱',
    mushrooms: 'У ліс по гриби 🍄',
    puddles: 'Таляпаємося в калюжах! 🌧️',
    train: 'Подорож потягом 🚂',
    knopka: 'Собачка Кнопка 🐶',
    ducklings: 'Маленькі каченята 🐥',
    fishing: 'Риболовля з Дідусем 🎣',
    candies: 'Цукерки в магазині 🍬',
    fence_art: 'Малюнки на огорожі 🎨',
    rollers: 'Катання на роликах 🛼',
    dance_dressing: 'Збори на танці 🩰',
    dance_warmup: 'Розминка у залі 🤸‍♀️',
    dance_moves: 'Танцювальні рухи 🎵',
    dance_water: 'Відпочинок та водичка 💧',
    dance_performance: 'Зоряний виступ 🌟',
  };

  const isGrandmaStage = ['chickens', 'plants', 'cats', 'mushrooms', 'puddles'].includes(currentStage);
  const isGrandpaStage = ['train', 'knopka', 'ducklings', 'fishing', 'candies', 'fence_art', 'rollers'].includes(currentStage);
  const isDanceStage = ['dance_dressing', 'dance_warmup', 'dance_moves', 'dance_water', 'dance_performance'].includes(currentStage);

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col font-sans text-gray-900 select-none">
      {/* Offline Status indicator badge */}
      <OfflineIndicator />

      {/* Global Application Header */}
      <Header
        currentStageName={currentStage === 'map' ? undefined : stageTitles[currentStage]}
        onGoHome={() => setCurrentStage('map')}
        starsCount={starsCount}
        onOpenStickerBook={() => setIsStickerBookOpen(true)}
        onOpenWardrobe={() => setIsWardrobeOpen(true)}
        onOpenKavusia={() => setIsKavusiaOpen(true)}
        onOpenDrawing={() => setIsDrawingOpen(true)}
        onOpenShop={() => setIsShopOpen(true)}
        onOpenPuzzles={() => setIsPuzzlesOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {currentStage === 'map' && (
          <DayMap
            onSelectStage={(stage) => {
              setCurrentStage(stage);
            }}
            onSelectGrandmaStage={(stage) => {
              setCurrentStage(stage);
            }}
            onSelectGrandpaStage={(stage) => {
              setCurrentStage(stage);
            }}
            onSelectDanceStage={(stage) => {
              setCurrentStage(stage);
            }}
            completedStages={completedStages}
            completedGrandmaStages={completedGrandmaStages}
            completedGrandpaStages={completedGrandpaStages}
            completedDanceStages={completedDanceStages}
            starsCount={starsCount}
            appearance={appearance}
            kavusiaAccessory={kavusiaAccessory}
            onOpenWardrobe={() => setIsWardrobeOpen(true)}
            onOpenKavusia={() => setIsKavusiaOpen(true)}
            onOpenDrawing={() => setIsDrawingOpen(true)}
            onOpenShop={() => setIsShopOpen(true)}
            onOpenPuzzles={() => setIsPuzzlesOpen(true)}
            onOpenStickerBook={() => setIsStickerBookOpen(true)}
          />
        )}

        {/* CITY STORY STAGES */}
        {currentStage === 'morning' && (
          <MorningStage
            onComplete={(stickers) => handleStageCompleted('morning', stickers)}
            onNextStage={() => {
              audio.playSparkle();
              setCurrentStage('bus');
            }}
            appearance={appearance}
            onOpenWardrobe={() => setIsWardrobeOpen(true)}
          />
        )}

        {currentStage === 'bus' && (
          <BusStage
            onComplete={(stickers) => handleStageCompleted('bus', stickers)}
            onNextStage={() => {
              audio.playSparkle();
              setCurrentStage('kindergarten');
            }}
            appearance={appearance}
          />
        )}

        {currentStage === 'kindergarten' && (
          <KindergartenStage
            onComplete={(stickers) => handleStageCompleted('kindergarten', stickers)}
            onNextStage={() => {
              audio.playSparkle();
              setCurrentStage('park');
            }}
            appearance={appearance}
          />
        )}

        {currentStage === 'park' && (
          <ParkStage
            onComplete={(stickers) => handleStageCompleted('park', stickers)}
            onNextStage={() => {
              audio.playSparkle();
              setCurrentStage('cafe');
            }}
            appearance={appearance}
            onOpenWardrobe={() => setIsWardrobeOpen(true)}
          />
        )}

        {currentStage === 'cafe' && (
          <CafeStage
            onComplete={(stickers) => handleStageCompleted('cafe', stickers)}
            onNextStage={() => {
              audio.playSparkle();
              setCurrentStage('home');
            }}
            appearance={appearance}
          />
        )}

        {currentStage === 'home' && (
          <HomeStage
            onComplete={(stickers) => handleStageCompleted('home', stickers)}
            onFinishDay={() => {
              audio.playCelebrationFanfare();
              setIsStickerBookOpen(true);
              setCurrentStage('map');
            }}
            appearance={appearance}
          />
        )}

        {/* GRANDMA VILLAGE STORY STAGES */}
        {isGrandmaStage && (
          <GrandmaStoryStage
            stageId={currentStage as GrandmaStageId}
            appearance={appearance}
            onComplete={(stickers) => handleGrandmaStageCompleted(currentStage as GrandmaStageId, stickers)}
            onNextStage={() => {
              const order: GrandmaStageId[] = ['chickens', 'plants', 'cats', 'mushrooms', 'puddles'];
              const currentIndex = order.indexOf(currentStage as GrandmaStageId);
              if (currentIndex >= 0 && currentIndex < order.length - 1) {
                audio.playSparkle();
                setCurrentStage(order[currentIndex + 1]);
              } else {
                audio.playCelebrationFanfare();
                setIsStickerBookOpen(true);
                setCurrentStage('map');
              }
            }}
            onPrevStage={() => {
              const order: GrandmaStageId[] = ['chickens', 'plants', 'cats', 'mushrooms', 'puddles'];
              const currentIndex = order.indexOf(currentStage as GrandmaStageId);
              if (currentIndex > 0) {
                audio.playPop();
                setCurrentStage(order[currentIndex - 1]);
              } else {
                setCurrentStage('map');
              }
            }}
            onGoToMap={() => setCurrentStage('map')}
          />
        )}

        {/* GRANDPA TOLIK STORY STAGES */}
        {isGrandpaStage && (
          <GrandpaStoryStage
            stageId={currentStage as GrandpaStageId}
            appearance={appearance}
            onComplete={(stickers) => handleGrandpaStageCompleted(currentStage as GrandpaStageId, stickers)}
            onNextStage={() => {
              const currentIndex = GRANDPA_STAGES_ORDER.indexOf(currentStage as GrandpaStageId);
              if (currentIndex >= 0 && currentIndex < GRANDPA_STAGES_ORDER.length - 1) {
                audio.playSparkle();
                setCurrentStage(GRANDPA_STAGES_ORDER[currentIndex + 1]);
              } else {
                audio.playSparkle();
                setIsStickerBookOpen(true);
                setCurrentStage('map');
              }
            }}
            onPrevStage={() => {
              const currentIndex = GRANDPA_STAGES_ORDER.indexOf(currentStage as GrandpaStageId);
              if (currentIndex > 0) {
                audio.playPop();
                setCurrentStage(GRANDPA_STAGES_ORDER[currentIndex - 1]);
              } else {
                setCurrentStage('map');
              }
            }}
            onGoToMap={() => setCurrentStage('map')}
          />
        )}

        {/* DANCE CLASS STORY STAGES */}
        {isDanceStage && (
          <DanceStoryStage
            stageId={currentStage as DanceStageId}
            appearance={appearance}
            onComplete={(stickers) => handleDanceStageCompleted(currentStage as DanceStageId, stickers)}
            onNextStage={() => {
              const currentIndex = DANCE_STAGES_ORDER.indexOf(currentStage as DanceStageId);
              if (currentIndex >= 0 && currentIndex < DANCE_STAGES_ORDER.length - 1) {
                audio.playSparkle();
                setCurrentStage(DANCE_STAGES_ORDER[currentIndex + 1]);
              } else {
                audio.playSparkle();
                setIsStickerBookOpen(true);
                setCurrentStage('map');
              }
            }}
            onPrevStage={() => {
              const currentIndex = DANCE_STAGES_ORDER.indexOf(currentStage as DanceStageId);
              if (currentIndex > 0) {
                audio.playPop();
                setCurrentStage(DANCE_STAGES_ORDER[currentIndex - 1]);
              } else {
                setCurrentStage('map');
              }
            }}
            onGoToMap={() => setCurrentStage('map')}
          />
        )}
      </main>

      {/* Star Shop Modal (34+ Unique items with Live Mirror) */}
      <StarShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        starsCount={starsCount}
        purchasedItems={purchasedItems}
        currentAppearance={appearance}
        kavusiaAccessory={kavusiaAccessory}
        onPurchaseItem={handlePurchaseShopItem}
        onEquipOutfit={handleEquipOutfit}
        onEquipShoe={handleEquipShoe}
        onEquipAccessory={handleEquipAccessory}
        onEquipKavusiaAccessory={handleSaveKavusiaAccessory}
      />

      {/* Mini Puzzles Modal (12 Interactive Puzzles for 4yo) */}
      <PuzzlesModal
        isOpen={isPuzzlesOpen}
        onClose={() => setIsPuzzlesOpen(false)}
        onPuzzleCompleted={handlePuzzleCompleted}
        completedPuzzles={completedPuzzles}
      />

      {/* Wardrobe Modal with full-body mirror & Kavusia styling */}
      {isWardrobeOpen && (
        <WardrobeModal
          currentAppearance={appearance}
          kavusiaAccessory={kavusiaAccessory}
          onSave={handleSaveAppearance}
          onSaveKavusiaAccessory={handleSaveKavusiaAccessory}
          onClose={() => setIsWardrobeOpen(false)}
        />
      )}

      {/* Guinea Pig Kavusia Pet Modal */}
      <KavusiaPetModal
        isOpen={isKavusiaOpen}
        currentAccessory={kavusiaAccessory}
        onSaveAccessory={handleSaveKavusiaAccessory}
        onClose={() => setIsKavusiaOpen(false)}
        onUnlockReward={(reward) => {
          setUnlockedStickers((prev) => (prev.includes(reward) ? prev : [...prev, reward]));
          setStarsCount((s) => s + 3);
        }}
      />

      {/* Drawing Studio Modal */}
      <DrawingStudioModal
        isOpen={isDrawingOpen}
        onClose={() => setIsDrawingOpen(false)}
        onRewardSticker={(sticker) => {
          setUnlockedStickers((prev) => (prev.includes(sticker) ? prev : [...prev, sticker]));
          setStarsCount((s) => s + 2);
        }}
      />

      {/* Sticker Book Modal with Stars & Achievements */}
      {isStickerBookOpen && (
        <StickerBookModal
          isOpen={isStickerBookOpen}
          unlockedStickers={unlockedStickers}
          starsCount={starsCount}
          completedStages={completedStages}
          completedGrandmaStages={completedGrandmaStages}
          completedGrandpaStages={completedGrandpaStages}
          completedDanceStages={completedDanceStages}
          onClose={() => setIsStickerBookOpen(false)}
        />
      )}
    </div>
  );
}
