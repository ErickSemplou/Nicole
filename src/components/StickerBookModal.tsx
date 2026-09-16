import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Star, Award, CheckCircle2, Trophy, Heart, Flame, Compass, Music } from 'lucide-react';
import { audio } from '../utils/audio';
import { DayStageId, GrandmaStageId, GrandpaStageId, DanceStageId } from '../types';

export interface StickerItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
  stageName: string;
  story: 'city' | 'grandma' | 'grandpa' | 'dance' | 'special';
}

export const ALL_STICKERS: StickerItem[] = [
  // Story 1: City Day
  { id: 'sun', name: 'Лагідне сонечко', emoji: '🌞', description: 'Розбудили Ніколь зранку', stageName: 'Ранок', story: 'city' },
  { id: 'brush', name: 'Чисті зубки', emoji: '🪥', description: 'Почистили зубки до білосніжного блиску', stageName: 'Ранок', story: 'city' },
  { id: 'pancakes', name: 'Смачний сніданок', emoji: '🥞', description: 'Зʼїли полуничні панкейки', stageName: 'Ранок', story: 'city' },
  { id: 'dress', name: 'Вишнева сукенка', emoji: '🍒', description: 'Одягнулися в гарне вбрання', stageName: 'Ранок', story: 'city' },
  { id: 'ticket', name: 'Квиток у маршрутку', emoji: '🎟️', description: 'Передали монетку за проїзд', stageName: 'Маршрутка', story: 'city' },
  { id: 'bus_window', name: 'Уважний пасажир', emoji: '🚌', description: 'Порахували машинки за вікном', stageName: 'Маршрутка', story: 'city' },
  { id: 'horn', name: 'Водій «Бі-біп»', emoji: '🎺', description: 'Посигналили та приїхали', stageName: 'Маршрутка', story: 'city' },
  { id: 'tower', name: 'Кольорова вежа', emoji: '🏰', description: 'Побудували фортецю з кубиків', stageName: 'Садочок', story: 'city' },
  { id: 'xylophone', name: 'Маленький музикант', emoji: '🎶', description: 'Зіграли пісеньку на ксилофоні', stageName: 'Садочок', story: 'city' },
  { id: 'scooter', name: 'Швидкий самокат', emoji: '🛴', description: 'Проїхалися алеєю парку', stageName: 'Парк', story: 'city' },
  { id: 'swing', name: 'Політ на гойдалці', emoji: '🦋', description: 'Злетіли високо-високо', stageName: 'Парк', story: 'city' },
  { id: 'treasure', name: 'Золота мушля та скарби', emoji: '💎', description: 'Знайшли всі секрети в пісочниці', stageName: 'Парк', story: 'city' },
  { id: 'donut', name: 'Рожевий пончик', emoji: '🍩', description: 'Прикрасили смачний пончик посипкою', stageName: 'Кафе', story: 'city' },
  { id: 'cocoa', name: 'Тепле какао з зефірками', emoji: '☕', description: 'Приготували ніжне какао з мамою', stageName: 'Кафе', story: 'city' },
  { id: 'bath', name: 'Тепла ванна з качечкою', emoji: '🛁', description: 'Змили денну втому в мильній піні', stageName: 'Вдома', story: 'city' },
  { id: 'dreams', name: 'Казка на добраніч', emoji: '🌙', description: 'Побажали солодких снів під зорями', stageName: 'Вдома', story: 'city' },

  // Story 2: Grandma's Village
  { id: 'chickens', name: 'Золоті зернятка', emoji: '🌾', description: 'Погодували курочок та зібрали яєчка', stageName: 'Курочки', story: 'grandma' },
  { id: 'plants', name: 'Веселкова лійка', emoji: '🌺', description: 'Полили бабусині квіти на веранді', stageName: 'Вазонки', story: 'grandma' },
  { id: 'cats', name: 'Пухнасте тріо', emoji: '🐱', description: 'Погралися з Жменею, Райяном і Лапичем', stageName: 'Котики', story: 'grandma' },
  { id: 'mushrooms', name: 'Лісовий кошик', emoji: '🍄', description: 'Зібрали білі гриби та лисички в лісі', stageName: 'Гриби', story: 'grandma' },
  { id: 'puddles', name: 'Жовті чобітки', emoji: '🌧️', description: 'Стрибали по калюжах після теплого дощику', stageName: 'Калюжі', story: 'grandma' },

  // Story 3: Grandpa's Visit
  { id: 'train_ticket', name: 'Золотий квиток', emoji: '🚂', description: 'Сіли в швидкий потяг та посигналили «Ту-ту!»', stageName: 'Потяг', story: 'grandpa' },
  { id: 'dog_knopka', name: 'Вірна Кнопка', emoji: '🐶', description: 'Погладили та пригостили собачку Кнопку', stageName: 'Кнопка', story: 'grandpa' },
  { id: 'ducklings_nest', name: 'Пухнасті каченята', emoji: '🐥', description: 'Нагодували та вклали спати маленьких каченят', stageName: 'Каченята', story: 'grandpa' },
  { id: 'golden_fish', name: 'Чарівна рибка', emoji: '🎣', description: 'Спіймали золоту рибку на річці з Дідусем', stageName: 'Риболовля', story: 'grandpa' },
  { id: 'sweet_candies', name: 'Солодка радість', emoji: '🍬', description: 'Отримали безкоштовні смаколики в магазині', stageName: 'Цукерки', story: 'grandpa' },
  { id: 'fence_masterpiece', name: 'Камʼяна картина', emoji: '🎨', description: 'Розфарбували огорожу кольоровою крейдою', stageName: 'Малюнки', story: 'grandpa' },
  { id: 'roller_champion', name: 'Швидкі ролики', emoji: '🛼', description: 'Одягли захист та весело каталися на роликах', stageName: 'Ролики', story: 'grandpa' },

  // Story 4: Dance Class Adventure
  { id: 'dance_outfit', name: 'Чарівна балерина', emoji: '🩰', description: 'Підібрали купальник, пуанти та пачку', stageName: 'Вбрання', story: 'dance' },
  { id: 'dance_flex', name: 'Гнучка розминка', emoji: '🧘‍♀️', description: 'Зробили метелика та розігріли ніжки біля станка', stageName: 'Розминка', story: 'dance' },
  { id: 'dance_choreography', name: 'Зірка хореографії', emoji: '💃', description: 'Створили неповторний танець під музику', stageName: 'Хореографія', story: 'dance' },
  { id: 'dance_citrus_water', name: 'Вітамінний напій', emoji: '🥤', description: 'Приготували водичку з полуничкою та мʼятою', stageName: 'Водичка', story: 'dance' },
  { id: 'dance_gala_medal', name: 'Золота медаль та букет', emoji: '🏆', description: 'Виступили на сцені під гучні оплески глядачів', stageName: 'Виступ', story: 'dance' },
];

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  rewardStars: number;
  icon: string;
  isUnlocked: boolean;
  story: 'city' | 'grandma' | 'grandpa' | 'dance' | 'special';
}

interface StickerBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedStickers: string[];
  starsCount: number;
  completedStages?: Record<DayStageId, boolean>;
  completedGrandmaStages?: Record<GrandmaStageId, boolean>;
  completedGrandpaStages?: Record<GrandpaStageId, boolean>;
  completedDanceStages?: Record<DanceStageId, boolean>;
}

export const StickerBookModal: React.FC<StickerBookModalProps> = ({
  isOpen,
  onClose,
  unlockedStickers,
  starsCount,
  completedStages = {
    morning: false,
    bus: false,
    kindergarten: false,
    park: false,
    cafe: false,
    home: false,
  },
  completedGrandmaStages = {
    chickens: false,
    plants: false,
    cats: false,
    mushrooms: false,
    puddles: false,
  },
  completedGrandpaStages = {
    train: false,
    knopka: false,
    ducklings: false,
    fishing: false,
    candies: false,
    fence_art: false,
    rollers: false,
  },
  completedDanceStages = {
    dance_dressing: false,
    dance_warmup: false,
    dance_moves: false,
    dance_water: false,
    dance_performance: false,
  },
}) => {
  const [activeTab, setActiveTab] = useState<'stickers' | 'achievements'>('achievements');
  const [storyFilter, setStoryFilter] = useState<'all' | 'city' | 'grandma' | 'grandpa' | 'dance'>('all');

  if (!isOpen) return null;

  // Build achievement list based on real completion state
  const achievements: AchievementItem[] = [
    // City Story
    {
      id: 'city_morning',
      title: 'Бадьорий ранок',
      description: 'Умилися, почистили зубки, смачно поснідали та зібралися',
      rewardStars: 3,
      icon: '☀️',
      isUnlocked: completedStages.morning,
      story: 'city',
    },
    {
      id: 'city_bus',
      title: 'Міський мандрівник',
      description: 'Проїхалися у маршрутці та посигналили «Бі-біп»',
      rewardStars: 3,
      icon: '🚌',
      isUnlocked: completedStages.bus,
      story: 'city',
    },
    {
      id: 'city_kindergarten',
      title: 'Талановитий малюк',
      description: 'Збудували високу вежу та зіграли мелодію в садочку',
      rewardStars: 3,
      icon: '🎨',
      isUnlocked: completedStages.kindergarten,
      story: 'city',
    },
    {
      id: 'city_park',
      title: 'Королева парку',
      description: 'Покаталися на самокаті, злетіли на гойдалці й знайшли скарб',
      rewardStars: 3,
      icon: '🛴',
      isUnlocked: completedStages.park,
      story: 'city',
    },
    {
      id: 'city_cafe',
      title: 'Шеф-кондитер',
      description: 'Прикрасили рожевий пончик та зварили тепле какао',
      rewardStars: 3,
      icon: '🍩',
      isUnlocked: completedStages.cafe,
      story: 'city',
    },
    {
      id: 'city_home',
      title: 'Солодкі сни',
      description: 'Прийняли теплу ванну та послухали казочку на ніч',
      rewardStars: 3,
      icon: '🏡',
      isUnlocked: completedStages.home,
      story: 'city',
    },

    // Grandma Story
    {
      id: 'gm_chickens',
      title: 'Господиня подвірʼя',
      description: 'Нагодували курочок зернятком та зібрали свіжі яєчка',
      rewardStars: 3,
      icon: '🌾',
      isUnlocked: completedGrandmaStages.chickens,
      story: 'grandma',
    },
    {
      id: 'gm_plants',
      title: 'Квіткова фея',
      description: 'Полили всі вазонки бабусі й створили веселковий туман',
      rewardStars: 3,
      icon: '🌺',
      isUnlocked: completedGrandmaStages.plants,
      story: 'grandma',
    },
    {
      id: 'gm_cats',
      title: 'Друг котиків',
      description: 'Погралися з Жменею, Райяном і почухали пузико Лапичу',
      rewardStars: 3,
      icon: '🐱',
      isUnlocked: completedGrandmaStages.cats,
      story: 'grandma',
    },
    {
      id: 'gm_mushrooms',
      title: 'Лісовий грибник',
      description: 'Знайшли білі гриби та лисички в сосновому лісі',
      rewardStars: 3,
      icon: '🍄',
      isUnlocked: completedGrandmaStages.mushrooms,
      story: 'grandma',
    },
    {
      id: 'gm_puddles',
      title: 'Веселі чобітки',
      description: 'Запустили кораблик та весело стрибали по теплих калюжах',
      rewardStars: 3,
      icon: '🌧️',
      isUnlocked: completedGrandmaStages.puddles,
      story: 'grandma',
    },

    // Grandpa Story
    {
      id: 'gp_train',
      title: 'Пасажир експресу',
      description: 'Показали квиточок, посигналили «Ту-ту!» та випили смачного чаю',
      rewardStars: 3,
      icon: '🚂',
      isUnlocked: completedGrandpaStages.train,
      story: 'grandpa',
    },
    {
      id: 'gp_knopka',
      title: 'Найкращий друг Кнопки',
      description: 'Погралися мʼячиком, пригостили кісточкою та прикрасили бантиком',
      rewardStars: 3,
      icon: '🐶',
      isUnlocked: completedGrandpaStages.knopka,
      story: 'grandpa',
    },
    {
      id: 'gp_ducklings',
      title: 'Турбота про каченят',
      description: 'Насипали зерняток, покупали у басейні та вклали в гніздечко',
      rewardStars: 3,
      icon: '🐥',
      isUnlocked: completedGrandpaStages.ducklings,
      story: 'grandpa',
    },
    {
      id: 'gp_fishing',
      title: 'Вправний рибалка',
      description: 'Закинули вудку з Дідусем Толіком та спіймали золоту рибку',
      rewardStars: 3,
      icon: '🎣',
      isUnlocked: completedGrandpaStages.fishing,
      story: 'grandpa',
    },
    {
      id: 'gp_candies',
      title: 'Солодка коробочка',
      description: 'Отримали безкоштовні цукерки в крамниці та зібрали пакуночок',
      rewardStars: 3,
      icon: '🍬',
      isUnlocked: completedGrandpaStages.candies,
      story: 'grandpa',
    },
    {
      id: 'gp_fence',
      title: 'Художниця на паркані',
      description: 'Розфарбували камʼяну огорожу сонечком, квіточками й веселками',
      rewardStars: 3,
      icon: '🎨',
      isUnlocked: completedGrandpaStages.fence_art,
      story: 'grandpa',
    },
    {
      id: 'gp_rollers',
      title: 'Зірка на роликах',
      description: 'Одягли повний захист і швидко проїхали сонячною доріжкою',
      rewardStars: 3,
      icon: '🛼',
      isUnlocked: completedGrandpaStages.rollers,
      story: 'grandpa',
    },

    // Dance Story
    {
      id: 'dance_dressing',
      title: 'Маленька балерина',
      description: 'Підібрали купальник, пуанти, пачку та зібрали танцювальну сумочку',
      rewardStars: 3,
      icon: '👗',
      isUnlocked: completedDanceStages.dance_dressing,
      story: 'dance',
    },
    {
      id: 'dance_warmup',
      title: 'Гнучкість та грація',
      description: 'Виконали розминку біля станка: «Тік-так», метелик, нахили та пліє',
      rewardStars: 3,
      icon: '🧘‍♀️',
      isUnlocked: completedDanceStages.dance_warmup,
      story: 'dance',
    },
    {
      id: 'dance_moves',
      title: 'Хореограф-початківець',
      description: 'Поєднали піруети, плавні хвилі та стрибки у власний танець',
      rewardStars: 3,
      icon: '💃',
      isUnlocked: completedDanceStages.dance_moves,
      story: 'dance',
    },
    {
      id: 'dance_water',
      title: 'Освіжаюча пауза',
      description: 'Приготували смачну водичку з лимончиком, полуничкою та мʼятою',
      rewardStars: 3,
      icon: '🥤',
      isUnlocked: completedDanceStages.dance_water,
      story: 'dance',
    },
    {
      id: 'dance_performance',
      title: 'Сяйво софітів',
      description: 'Блискуче станцювали на великій сцені та здобули золоту медаль',
      rewardStars: 3,
      icon: '🏆',
      isUnlocked: completedDanceStages.dance_performance,
      story: 'dance',
    },
  ];

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const filteredAchievements = achievements.filter(
    (a) => storyFilter === 'all' || a.story === storyFilter
  );
  const filteredStickers = ALL_STICKERS.filter(
    (s) => storyFilter === 'all' || s.story === storyFilter
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          className="relative w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-3xl bg-gradient-to-b from-amber-50 via-rose-50 to-pink-50 border-4 border-amber-300 shadow-2xl flex flex-col"
        >
          {/* Header Banner */}
          <div className="p-3.5 sm:p-5 bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 border-b-2 border-amber-300 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border-2 border-white/40 shadow-inner">
                {activeTab === 'achievements' ? (
                  <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-200 fill-yellow-300" />
                ) : (
                  <Award className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-200" />
                )}
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-black drop-shadow-sm flex items-center gap-2">
                  <span>{activeTab === 'achievements' ? 'Зірки та Досягнення Ніколь' : 'Альбом наліпок'}</span>
                </h2>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-yellow-100 flex-wrap">
                  <span className="flex items-center gap-1 bg-black/20 px-2.5 py-0.5 rounded-full font-black">
                    <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
                    {starsCount} накопичених зірок
                  </span>
                  <span>•</span>
                  <span>{unlockedCount} з {achievements.length} виконано</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                audio.playPop();
                onClose();
              }}
              className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center active:scale-90 transition border border-white/40 cursor-pointer"
              title="Закрити"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Tabs (Achievements vs Stickers) */}
          <div className="p-2 sm:p-3 bg-white/80 border-b border-amber-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  audio.playPop();
                  setActiveTab('achievements');
                }}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition cursor-pointer ${
                  activeTab === 'achievements'
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                    : 'bg-amber-100/60 text-gray-700 hover:bg-amber-200/60'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Зірки та Досягнення ({unlockedCount}/{achievements.length})</span>
              </button>

              <button
                onClick={() => {
                  audio.playPop();
                  setActiveTab('stickers');
                }}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition cursor-pointer ${
                  activeTab === 'stickers'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                    : 'bg-pink-100/60 text-gray-700 hover:bg-pink-200/60'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Альбом наліпок ({unlockedStickers.length}/{ALL_STICKERS.length})</span>
              </button>
            </div>

            {/* Story Filter Chips */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => {
                  audio.playPop();
                  setStoryFilter('all');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer whitespace-nowrap ${
                  storyFilter === 'all'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Всі історії
              </button>
              <button
                onClick={() => {
                  audio.playPop();
                  setStoryFilter('city');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer whitespace-nowrap ${
                  storyFilter === 'city'
                    ? 'bg-pink-600 text-white'
                    : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                }`}
              >
                ☀️ Місто
              </button>
              <button
                onClick={() => {
                  audio.playPop();
                  setStoryFilter('grandma');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer whitespace-nowrap ${
                  storyFilter === 'grandma'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                }`}
              >
                🏡 Бабуся
              </button>
              <button
                onClick={() => {
                  audio.playPop();
                  setStoryFilter('grandpa');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer whitespace-nowrap ${
                  storyFilter === 'grandpa'
                    ? 'bg-sky-600 text-white'
                    : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
                }`}
              >
                🚂 Дідусь
              </button>
              <button
                onClick={() => {
                  audio.playPop();
                  setStoryFilter('dance');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer whitespace-nowrap ${
                  storyFilter === 'dance'
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                🩰 Танці
              </button>
            </div>
          </div>

          {/* TAB 1: ACHIEVEMENTS & STARS */}
          {activeTab === 'achievements' && (
            <div className="p-3 sm:p-5 overflow-y-auto flex-1 space-y-3">
              {/* Stars Summary Bar */}
              <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 rounded-2xl p-4 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shadow-inner">
                    ⭐
                  </div>
                  <div>
                    <h3 className="font-black text-lg sm:text-xl">
                      Всього зароблено: {starsCount} золотих зірок!
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-amber-100">
                      Кожна завершена міні-гра приносить +3 зірки та нову наліпку!
                    </p>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/30 text-center">
                  <span className="text-xs font-bold block text-yellow-100">Прогрес пригод</span>
                  <span className="text-base sm:text-lg font-black">
                    {unlockedCount} / {achievements.length} ({Math.round((unlockedCount / achievements.length) * 100)}%)
                  </span>
                </div>
              </div>

              {/* Achievements List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredAchievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    whileHover={achievement.isUnlocked ? { scale: 1.01 } : {}}
                    onClick={() => {
                      if (achievement.isUnlocked) {
                        audio.playSparkle();
                        audio.speakUkrainian(achievement.title, 'nicole');
                      }
                    }}
                    className={`p-3.5 rounded-2xl border-2 flex items-start gap-3 transition cursor-pointer relative ${
                      achievement.isUnlocked
                        ? 'bg-white border-amber-300 shadow-sm hover:shadow-md'
                        : 'bg-white/50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-inner ${
                        achievement.isUnlocked
                          ? 'bg-gradient-to-tr from-amber-100 to-rose-100 border border-amber-300'
                          : 'bg-gray-100 grayscale'
                      }`}
                    >
                      {achievement.isUnlocked ? achievement.icon : '🔒'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="font-black text-sm text-gray-900 truncate">
                          {achievement.title}
                        </h4>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                            achievement.isUnlocked
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {achievement.isUnlocked ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Виконано
                            </>
                          ) : (
                            'В процесі'
                          )}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-gray-600 leading-snug mb-1.5">
                        {achievement.description}
                      </p>

                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          +{achievement.rewardStars} зірки
                        </span>
                        <span className="text-[10px] font-bold text-gray-500">
                          {achievement.story === 'city'
                            ? 'День у місті'
                            : achievement.story === 'grandma'
                            ? 'У бабусі'
                            : 'До дідуся'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: STICKERS COLLECTION */}
          {activeTab === 'stickers' && (
            <div className="p-3 sm:p-5 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredStickers.map((sticker) => {
                const isUnlocked = unlockedStickers.includes(sticker.id);

                return (
                  <motion.div
                    key={sticker.id}
                    whileHover={isUnlocked ? { scale: 1.04 } : {}}
                    onClick={() => {
                      if (isUnlocked) {
                        audio.playSparkle();
                        audio.speakUkrainian(sticker.name, 'nicole');
                      }
                    }}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center transition cursor-pointer relative ${
                      isUnlocked
                        ? 'bg-white border-amber-300 shadow-md hover:border-pink-400'
                        : 'bg-white/40 border-dashed border-gray-300 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-1.5 shadow-inner ${
                        isUnlocked
                          ? 'bg-gradient-to-tr from-amber-100 to-pink-100'
                          : 'bg-gray-100 grayscale'
                      }`}
                    >
                      {isUnlocked ? sticker.emoji : '❓'}
                    </div>

                    <span className="text-xs sm:text-sm font-black text-gray-800 leading-tight">
                      {isUnlocked ? sticker.name : 'Секрет'}
                    </span>

                    <span className="text-[10px] sm:text-xs font-bold text-gray-500 mt-1 line-clamp-2">
                      {isUnlocked ? sticker.description : 'Виконай гру для наліпки'}
                    </span>

                    {isUnlocked && (
                      <div className="absolute top-1.5 right-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Footer praise */}
          <div className="p-3 bg-white/80 border-t border-amber-200 flex items-center justify-between flex-wrap gap-2 text-center sm:text-left">
            <p className="text-xs sm:text-sm font-bold text-pink-800">
              Грайте у всі 3 історії Ніколь, щоб назбирати найбільше зірочок та відкрити всі наліпки! 💖
            </p>
            <button
              onClick={() => {
                audio.playPop();
                onClose();
              }}
              className="px-4 py-1.5 bg-pink-500 hover:bg-pink-600 text-white font-black text-xs sm:text-sm rounded-xl transition cursor-pointer shadow-sm ml-auto"
            >
              Чудово!
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
