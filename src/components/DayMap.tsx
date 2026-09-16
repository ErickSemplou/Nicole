import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Sun, Bus, Sparkles, Trees, Coffee, Home, Play, CheckCircle2, Star, Heart, Music, ArrowLeft, ChevronLeft, ChevronRight, Palette, BookOpen, ShoppingBag, Shirt, Volume2 } from 'lucide-react';
import { DayStageId, GrandmaStageId, GrandpaStageId, DanceStageId, NicoleAppearance, StoryId, KavusiaAccessory } from '../types';
import { GAME_IMAGES } from '../assets/images';
import { NicoleCharacter } from './NicoleCharacter';
import { audio } from '../utils/audio';

interface DayMapProps {
  onSelectStage: (stage: DayStageId) => void;
  onSelectGrandmaStage: (stage: GrandmaStageId) => void;
  onSelectGrandpaStage: (stage: GrandpaStageId) => void;
  onSelectDanceStage: (stage: DanceStageId) => void;
  completedStages: Record<DayStageId, boolean>;
  completedGrandmaStages?: Record<GrandmaStageId, boolean>;
  completedGrandpaStages?: Record<GrandpaStageId, boolean>;
  completedDanceStages?: Record<DanceStageId, boolean>;
  starsCount: number;
  appearance: NicoleAppearance;
  kavusiaAccessory?: KavusiaAccessory;
  onOpenWardrobe: () => void;
  onOpenKavusia?: () => void;
  onOpenDrawing?: () => void;
  onOpenShop?: () => void;
  onOpenPuzzles?: () => void;
  onOpenStickerBook?: () => void;
}

export const DayMap: React.FC<DayMapProps> = ({
  onSelectStage,
  onSelectGrandmaStage,
  onSelectGrandpaStage,
  onSelectDanceStage,
  completedStages,
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
  appearance,
  kavusiaAccessory = 'bow',
  onOpenWardrobe,
  onOpenKavusia,
  onOpenDrawing,
  onOpenShop,
  onOpenPuzzles,
  onOpenStickerBook,
}) => {
  const [viewMode, setViewMode] = useState<'home' | 'choose_story'>('home');
  const [selectedStory, setSelectedStory] = useState<StoryId>('city_day');
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      audio.playPop();
    }
  };

  // Carousel Shortcuts for extra quests and games
  const extraQuests = [
    {
      id: 'wardrobe',
      title: 'Вбиральня Ніколь',
      subtitle: 'Сукні, зачіски та бантики',
      emoji: '👗',
      gradient: 'from-pink-500 to-rose-400',
      bgColor: 'bg-pink-50 border-pink-200',
      action: () => {
        audio.playSparkle();
        audio.speakUkrainian('Ура! Давай приміряємо новий одяг у моїй вбиральні!', 'nicole');
        onOpenWardrobe();
      },
    },
    {
      id: 'shop',
      title: 'Зоряна Крамничка',
      subtitle: '34+ іграшок та подарунків',
      emoji: '🛍️',
      gradient: 'from-amber-500 to-orange-400',
      bgColor: 'bg-amber-50 border-amber-200',
      action: () => {
        if (onOpenShop) {
          audio.playSparkle();
          audio.speakUkrainian('Ласкаво просимо до зоряної крамнички!', 'nicole');
          onOpenShop();
        }
      },
    },
    {
      id: 'puzzles',
      title: 'Міні-пазли',
      subtitle: 'Яскраві картинки для збирання',
      emoji: '🧩',
      gradient: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50 border-indigo-200',
      action: () => {
        if (onOpenPuzzles) {
          audio.playSparkle();
          audio.speakUkrainian('Нумо збирати яскраві пазли разом!', 'nicole');
          onOpenPuzzles();
        }
      },
    },
    {
      id: 'kavusia',
      title: 'Свинка Кавуся',
      subtitle: 'Купання, яблучка та ігри',
      emoji: '🐷',
      gradient: 'from-rose-400 to-pink-500',
      bgColor: 'bg-rose-50 border-rose-200',
      action: () => {
        if (onOpenKavusia) {
          audio.playPop();
          audio.speakUkrainian('Хрю-хрю! Давай піклуватися про свинку Кавусю!', 'nicole');
          onOpenKavusia();
        }
      },
    },
    {
      id: 'drawing',
      title: 'Малювалка',
      subtitle: 'Пензлики, барви та печатки',
      emoji: '🎨',
      gradient: 'from-emerald-500 to-teal-400',
      bgColor: 'bg-emerald-50 border-emerald-200',
      action: () => {
        if (onOpenDrawing) {
          audio.playSparkle();
          audio.speakUkrainian('Малюємо разом найкращі картини!', 'nicole');
          onOpenDrawing();
        }
      },
    },
    {
      id: 'stickers',
      title: 'Альбом досягнень',
      subtitle: 'Колекція наліпок за квести',
      emoji: '🏆',
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 border-purple-200',
      action: () => {
        if (onOpenStickerBook) {
          audio.playSparkle();
          audio.speakUkrainian('Погляньмо на наші зібрані наліпки!', 'nicole');
          onOpenStickerBook();
        }
      },
    },
  ];

  // Story 1: City Day Stages
  const cityStages = [
    {
      id: 'morning' as DayStageId,
      title: 'Ранок вдома',
      subtitle: 'Прокидання, вмивання, сніданок та збори',
      description: 'Сонечко світить у віконце! Допоможи Ніколь почати день бадьоро.',
      icon: <Sun className="w-7 h-7 sm:w-8 sm:h-8 text-amber-500 fill-amber-400" />,
      color: 'from-amber-200 via-orange-100 to-rose-100 border-amber-300',
      badgeColor: 'bg-amber-500 text-white',
      image: GAME_IMAGES.morning,
      steps: ['Вмивання', 'Зубки', 'Сніданок', 'Рюкзачок', 'Одяг'],
    },
    {
      id: 'bus' as DayStageId,
      title: 'Подорож на маршрутці',
      subtitle: 'З мамою містом до садочка',
      description: 'Передай квиточок, розглядай місто у віконце та посигналь «Бі-біп»!',
      icon: <Bus className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-500" />,
      color: 'from-yellow-200 via-amber-100 to-emerald-100 border-yellow-300',
      badgeColor: 'bg-yellow-600 text-white',
      image: GAME_IMAGES.bus,
      steps: ['Оплата квитка', 'Місто у вікні', 'Кермо «Бі-біп»'],
    },
    {
      id: 'kindergarten' as DayStageId,
      title: 'Веселий садочок',
      subtitle: 'Ігри з друзями, музика та малювання',
      description: 'Будуй вежу з кубиків, зіграй на ксилофоні та малюй на мольберті!',
      icon: <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-500" />,
      color: 'from-blue-200 via-indigo-100 to-purple-100 border-indigo-300',
      badgeColor: 'bg-indigo-600 text-white',
      image: GAME_IMAGES.kindergarten,
      steps: ['Друзі', 'Вежа', 'Ксилофон', 'Малювання'],
    },
    {
      id: 'park' as DayStageId,
      title: 'Парк пригод',
      subtitle: 'Самокат, високі гойдалки та скарби в піску',
      description: 'Мчи на рожевому самокаті, злітай на гойдалці та будуй піщаний замок!',
      icon: <Trees className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-500" />,
      color: 'from-emerald-200 via-teal-100 to-lime-100 border-emerald-300',
      badgeColor: 'bg-emerald-600 text-white',
      image: GAME_IMAGES.park,
      steps: ['Самокат', 'Гойдалки', 'Скарби', 'Піщаний замок'],
    },
    {
      id: 'cafe' as DayStageId,
      title: 'Пончик та какао',
      subtitle: 'Затишне кафе з мамою після парку',
      description: 'Прикрашай круглий пончик смачною посипкою та готуй тепле какао з зефірками!',
      icon: <Coffee className="w-7 h-7 sm:w-8 sm:h-8 text-rose-500" />,
      color: 'from-rose-200 via-pink-100 to-amber-100 border-rose-300',
      badgeColor: 'bg-rose-500 text-white',
      image: GAME_IMAGES.cafe,
      steps: ['Пончик', 'Посипка', 'Тепле какао', 'Смакуємо'],
    },
    {
      id: 'home' as DayStageId,
      title: 'Повернення додому',
      subtitle: 'Тепла ванна з піною, піжамка та казка',
      description: 'Знімай курточку, купайся з качечками та слухай казку під зірками!',
      icon: <Home className="w-7 h-7 sm:w-8 sm:h-8 text-purple-500" />,
      color: 'from-purple-200 via-indigo-100 to-pink-100 border-purple-300',
      badgeColor: 'bg-purple-600 text-white',
      image: GAME_IMAGES.home,
      steps: ['Капці', 'Ванна з качечками', 'Піжамка', 'Казка під зорями'],
    },
  ];

  // Story 2: Grandma Village Adventure Stages
  const grandmaStages = [
    {
      id: 'chickens' as GrandmaStageId,
      title: 'Годуємо курочок',
      subtitle: 'Зернятко для курочок та збір свіжих яєчок',
      description: 'Посипай зернятка на подвірʼї, клич курчаток «ціп-ціп» та збирай теплі яєчка у кошик!',
      icon: <span className="text-3xl">🌾</span>,
      color: 'from-amber-200 via-yellow-100 to-orange-100 border-amber-300',
      badgeColor: 'bg-amber-600 text-white',
      badgeText: 'Подвірʼя',
      steps: ['Зернятка', 'Курчатка', 'Збір яєчок'],
    },
    {
      id: 'plants' as GrandmaStageId,
      title: 'Поливаємо вазонки',
      subtitle: 'Турбота про квіти бабусі на веранді',
      description: 'Візьми яскраву поливальничку, напої герань, соняшники й полуничку та створи веселковий туман!',
      icon: <span className="text-3xl">🌺</span>,
      color: 'from-emerald-200 via-lime-100 to-pink-100 border-emerald-300',
      badgeColor: 'bg-emerald-600 text-white',
      badgeText: 'Тераса',
      steps: ['Поливальничка', 'Квітуча герань', 'Веселковий туман'],
    },
    {
      id: 'cats' as GrandmaStageId,
      title: 'Котики: Жменя, Райян і Лапич',
      subtitle: 'Веселі ігри з трьома пухнастиками',
      description: 'Грай пірʼїнкою з Жменею, катай клубочок з Райяном, чухай пузико й частуй рибкою Лапича!',
      icon: <span className="text-3xl">🐱</span>,
      color: 'from-pink-200 via-rose-100 to-amber-100 border-pink-300',
      badgeColor: 'bg-pink-600 text-white',
      badgeText: 'Пухнастики',
      steps: ['Жменя', 'Райян', 'Лапич', 'Рибка та ласка'],
    },
    {
      id: 'mushrooms' as GrandmaStageId,
      title: 'У ліс по гриби',
      subtitle: 'Сосновий ліс та плетений кошик',
      description: 'Шукай під духмяними листочками білі гриби, лисички та маслюки, а мухомор залиш для звірят!',
      icon: <span className="text-3xl">🍄</span>,
      color: 'from-emerald-200 via-amber-100 to-emerald-100 border-emerald-400',
      badgeColor: 'bg-emerald-700 text-white',
      badgeText: 'Сосновий ліс',
      steps: ['Соснова стежка', 'Білий гриб', 'Лисички', 'Кошик'],
    },
    {
      id: 'puddles' as GrandmaStageId,
      title: 'Таляпаємося в калюжах!',
      subtitle: 'Веселі стрибки у гумових чобітках',
      description: 'Після теплого дощику визирнула веселка! Взувай чобітки, пускай кораблики та стрибай: «Хлюп-хлюп!»',
      icon: <span className="text-3xl">🌧️</span>,
      color: 'from-sky-200 via-indigo-100 to-emerald-100 border-sky-300',
      badgeColor: 'bg-sky-600 text-white',
      badgeText: 'Веселка',
      steps: ['Жовті чобітки', 'Кораблик', 'Веселкові бризки', 'Хлюп-хлюп!'],
    },
  ];

  // Story 3: Grandpa Tolik & Grandma Natalia Story Stages
  const grandpaStages = [
    {
      id: 'train' as GrandpaStageId,
      title: 'Подорож потягом',
      subtitle: 'Їдемо до Дідуся Толіка та Бабусі Наталі',
      description: 'Покажи квиточок, посигналь «Ту-ту!», роздивляйся краєвиди у віконці та пий чай з лимоном!',
      icon: <span className="text-3xl">🚂</span>,
      color: 'from-sky-200 via-indigo-100 to-amber-100 border-sky-300',
      badgeColor: 'bg-sky-600 text-white',
      badgeText: 'Потяг',
      steps: ['Квиточок', 'Гудок «Ту-ту!»', 'Віконце', 'Чай'],
    },
    {
      id: 'knopka' as GrandpaStageId,
      title: 'Собачка Кнопка',
      subtitle: 'Зустріч з веселою собачкою у дворі',
      description: 'Грайся мʼячиком, пригощай цукровою кісточкою, чеши шовковисту шубку та приміряй бантик!',
      icon: <span className="text-3xl">🐶</span>,
      color: 'from-amber-200 via-orange-100 to-rose-100 border-amber-300',
      badgeColor: 'bg-amber-600 text-white',
      badgeText: 'Подвірʼя',
      steps: ['Мʼячик', 'Кісточка', 'Шубка', 'Прикраса'],
    },
    {
      id: 'ducklings' as GrandpaStageId,
      title: 'Маленькі каченята',
      subtitle: 'Доглядаємо та годуємо пухнастих каченят',
      description: 'Насипай золоті зернятка, наливай свіжу водичку в басейн та вкладай усіх 5 каченят у гніздечко!',
      icon: <span className="text-3xl">🐥</span>,
      color: 'from-emerald-200 via-teal-100 to-amber-100 border-emerald-300',
      badgeColor: 'bg-emerald-600 text-white',
      badgeText: 'Каченята',
      steps: ['Зернятка', 'Водичка', 'Басейн', 'Гніздечко'],
    },
    {
      id: 'fishing' as GrandpaStageId,
      title: 'Риболовля з Дідусем',
      subtitle: 'Ловимо рибку на річці з Дідусем Толіком',
      description: 'Начепи наживку, закинь вудку у прозору річку, чекай покльовки та витягай чарівну золоту рибку!',
      icon: <span className="text-3xl">🎣</span>,
      color: 'from-cyan-200 via-blue-100 to-emerald-100 border-cyan-300',
      badgeColor: 'bg-cyan-600 text-white',
      badgeText: 'Річка',
      steps: ['Наживка', 'Вудка', 'Поплавок', 'Золота рибка'],
    },
    {
      id: 'candies' as GrandpaStageId,
      title: 'Цукерки в магазині',
      subtitle: 'Безкоштовні смаколики для онучки',
      description: 'У сільській крамничці Ніколь чекає святковий подарунок: обирай 4 улюблені цукерки безкоштовно!',
      icon: <span className="text-3xl">🍬</span>,
      color: 'from-pink-200 via-rose-100 to-purple-100 border-pink-300',
      badgeColor: 'bg-pink-600 text-white',
      badgeText: 'Крамничка',
      steps: ['Льодяники', 'Шоколад', 'Мармелад', 'Подарунок'],
    },
    {
      id: 'fence_art' as GrandpaStageId,
      title: 'Малюнки на огорожі',
      subtitle: 'Творчість кольоровою крейдою на камені',
      description: 'Малюй сонечко, квіточки, веселку та котиків на камʼяному паркані на радість дідусю й бабусі!',
      icon: <span className="text-3xl">🎨</span>,
      color: 'from-violet-200 via-fuchsia-100 to-amber-100 border-violet-300',
      badgeColor: 'bg-violet-600 text-white',
      badgeText: 'Творчість',
      steps: ['Крейда', 'Сонечко', 'Веселка', 'Паркан'],
    },
    {
      id: 'rollers' as GrandpaStageId,
      title: 'Катання на роликах',
      subtitle: 'Швидкі ролики, шолом та весела доріжка',
      description: 'Одягай шолом і захист, взувай швидкі яскраві ролики та котися рівною парковою доріжкою!',
      icon: <span className="text-3xl">🛼</span>,
      color: 'from-amber-200 via-rose-100 to-sky-100 border-amber-300',
      badgeColor: 'bg-rose-600 text-white',
      badgeText: 'Спорт',
      steps: ['Шолом', 'Захист', 'Ролики', 'Вперед!'],
    },
  ];

  // Story 4: Dance Class Adventure Stages
  const danceStages = [
    {
      id: 'dance_dressing' as DanceStageId,
      title: 'Вбрання балерини',
      subtitle: 'Роздягальня, сумочка, пуанти та пачка',
      description: 'Одягай сяючий купальник, пишну фатинову пачку, шовкові пуанти та склади речі у танцювальну сумочку!',
      icon: <span className="text-3xl">👗</span>,
      color: 'from-pink-200 via-purple-100 to-rose-100 border-pink-300',
      badgeColor: 'bg-pink-600 text-white',
      badgeText: 'Роздягальня',
      steps: ['Купальник', 'Пачка Tutu', 'Пуанти', 'Сумочка'],
    },
    {
      id: 'dance_warmup' as DanceStageId,
      title: 'Танцювальна розминка',
      subtitle: 'Вправи біля дзеркального станка',
      description: 'Розігрій мʼязи перед танцями: голівка «Тік-так», поза метелика, нахили до зірочок та балетне пліє!',
      icon: <span className="text-3xl">🧘‍♀️</span>,
      color: 'from-purple-200 via-pink-100 to-amber-100 border-purple-300',
      badgeColor: 'bg-purple-600 text-white',
      badgeText: 'Розминка',
      steps: ['Голівка', 'Метелик', 'До носочків', 'Пліє'],
    },
    {
      id: 'dance_moves' as DanceStageId,
      title: 'Студія хореографії',
      subtitle: 'Створення унікального танцю та ритм',
      description: 'Обирай музику, поєднуй піруети, плавні хвилі, стрибки та реверанси у свій власний неповторний танець!',
      icon: <span className="text-3xl">💃</span>,
      color: 'from-indigo-200 via-pink-100 to-purple-100 border-indigo-300',
      badgeColor: 'bg-indigo-600 text-white',
      badgeText: 'Хореографія',
      steps: ['Музика', 'Піруети', 'Хвиля', 'Мій танець'],
    },
    {
      id: 'dance_water' as DanceStageId,
      title: 'Смачна освіжаюча водичка',
      subtitle: 'Відновлення сил з вітамінами',
      description: 'Налий чисту воду у пляшечку, додай лимончик, полуничку та мʼяту, пий «буль-буль» і заряджайся енергією!',
      icon: <span className="text-3xl">🥤</span>,
      color: 'from-sky-200 via-cyan-100 to-emerald-100 border-sky-300',
      badgeColor: 'bg-sky-600 text-white',
      badgeText: 'Енергія',
      steps: ['Вода', 'Лимончик', 'Полуничка', 'Пити буль-буль'],
    },
    {
      id: 'dance_performance' as DanceStageId,
      title: 'Великий виступ на сцені',
      subtitle: 'Софіти, оплески, квіти та золота медаль',
      description: 'Сяй на великій сцені під оплески глядачів! Отримуй чарівний букет квітів та золоту медаль танцівниці!',
      icon: <span className="text-3xl">🏆</span>,
      color: 'from-amber-200 via-rose-100 to-pink-100 border-amber-300',
      badgeColor: 'bg-amber-600 text-white',
      badgeText: 'Фінал',
      steps: ['Софіти', 'Танець зірки', 'Букет', 'Золота медаль'],
    },
  ];

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gradient-to-b from-pink-50 via-rose-50 to-amber-50 p-3 sm:p-6 md:p-8 flex flex-col items-center select-none">
      {/* ===================== HOME VIEW ===================== */}
      {viewMode === 'home' && (
        <div className="w-full max-w-5xl flex flex-col items-center">
          {/* Top Carousel of Extra Quests & Games */}
          <div className="w-full mb-6">
            <div className="flex items-center justify-between mb-2.5 px-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌟</span>
                <h3 className="text-sm sm:text-base md:text-lg font-black text-gray-800 tracking-tight">
                  Додаткові квести та ігри
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollCarousel('left')}
                  className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-sm border border-pink-200 flex items-center justify-center transition active:scale-90 cursor-pointer"
                  title="Прокрутити вліво"
                  aria-label="Прокрутити вліво"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-sm border border-pink-200 flex items-center justify-center transition active:scale-90 cursor-pointer"
                  title="Прокрутити вправо"
                  aria-label="Прокрутити вправо"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Scrollable Carousel */}
            <div
              ref={carouselRef}
              className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 px-1 scroll-smooth no-scrollbar snap-x snap-mandatory"
            >
              {extraQuests.map((quest) => (
                <motion.div
                  key={quest.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={quest.action}
                  className={`snap-start shrink-0 w-[200px] sm:w-[220px] p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border-2 ${quest.bgColor} shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${quest.gradient} text-white flex items-center justify-center text-2xl shadow-sm`}>
                        {quest.emoji}
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-pink-700 bg-white/80 px-2 py-0.5 rounded-full border border-pink-100">
                        Грати
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-gray-900 leading-snug">
                      {quest.title}
                    </h4>
                    <p className="text-xs text-gray-600 font-medium mt-0.5 line-clamp-1">
                      {quest.subtitle}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-xs font-black text-pink-700">
                    <span>Відкрити</span>
                    <span>✨</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Nicole Welcome Hero Section with Single 'Почати Пригоду' Button */}
          <div className="w-full bg-white/90 backdrop-blur-xs p-6 sm:p-8 md:p-10 rounded-3xl sm:rounded-[36px] border-3 border-pink-200 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="flex-1 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100 text-pink-700 text-xs sm:text-sm font-black mb-3">
                <Star className="w-4 h-4 fill-pink-500 text-pink-500" />
                Інтерактивна українська гра для малечі
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-3">
                Привіт! Я Ніколь! Мені 4 рочки 🌸
              </h2>

              <p className="text-sm sm:text-base md:text-lg font-bold text-gray-600 mb-6 max-w-xl">
                Нумо гратися та пізнавати світ разом! Натискай кнопку та обирай улюблену історію серед 4 захоплюючих пригод!
              </p>

              {/* ONLY THE SINGLE MAIN ACTION BUTTON */}
              <div className="flex justify-center md:justify-start">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    audio.playSparkle();
                    audio.speakUkrainian('Ура! Обирай свою улюблену пригоду!', 'nicole');
                    setViewMode('choose_story');
                  }}
                  className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-lg sm:text-2xl rounded-3xl shadow-2xl border-4 border-white/60 flex items-center justify-center gap-3.5 transition cursor-pointer"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-white ml-0.5" />
                  </div>
                  <span>Почати Пригоду ✨</span>
                </motion.button>
              </div>
            </div>

            <div className="shrink-0">
              <NicoleCharacter
                size="hero"
                mood="excited"
                appearance={appearance}
                kavusiaAccessory={kavusiaAccessory}
                speechText="Привіт! Тисни «Почати Пригоду», щоб грати разом!"
                onTap={() => {
                  audio.speakUkrainian('Привіт! Я рада тобі! Нумо гратися разом!', 'nicole');
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ===================== CHOOSE STORY VIEW ===================== */}
      {viewMode === 'choose_story' && (
        <div className="w-full max-w-5xl flex flex-col items-center">
          {/* Top Bar with Back Button */}
          <div className="w-full flex items-center justify-between mb-6">
            <button
              onClick={() => {
                audio.playPop();
                setViewMode('home');
              }}
              className="flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-white hover:bg-pink-50 text-pink-700 font-black rounded-2xl shadow-md border-2 border-pink-200 transition active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm sm:text-base">На головну</span>
            </button>

            <div className="text-right">
              <h2 className="text-lg sm:text-2xl font-black text-gray-900 leading-tight">
                Обери свою історію ✨
              </h2>
              <p className="text-xs sm:text-sm font-bold text-pink-700 hidden sm:block">
                4 великі інтерактивні пригоди для Ніколь
              </p>
            </div>
          </div>

          {/* 4 Story Big Selection Cards */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {/* Story 1 */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                audio.playPop();
                setSelectedStory('city_day');
              }}
              className={`p-4 sm:p-5 rounded-3xl border-3 transition-all cursor-pointer flex flex-col justify-between ${
                selectedStory === 'city_day'
                  ? 'bg-gradient-to-br from-pink-200 via-rose-100 to-amber-100 border-pink-400 shadow-lg ring-4 ring-pink-300/50'
                  : 'bg-white/80 border-pink-200 shadow-md hover:bg-pink-50/70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl sm:text-4xl">☀️</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        audio.speakUkrainian('День у місті! Ранок, маршрутка, садок, парк і пончики!', 'nicole');
                      }}
                      className="p-1 rounded-full bg-white/60 hover:bg-white text-pink-600 transition"
                      title="Послухати"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-pink-500 text-white shadow-xs">
                      6 етапів
                    </span>
                  </div>
                </div>
                <h4 className="text-lg font-black text-gray-900 mb-1">День у місті</h4>
                <p className="text-xs text-gray-600 font-medium mb-3">
                  Ранок, маршрутка, садок, парк з гойдалками, кафе та затишний вечір.
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  audio.playSparkle();
                  audio.speakUkrainian('Ура! Починаємо день у місті!', 'nicole');
                  setSelectedStory('city_day');
                  onSelectStage('morning');
                }}
                className="w-full py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs rounded-xl shadow-xs hover:brightness-110 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Грати весь день</span>
              </button>
            </motion.div>

            {/* Story 2 */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                audio.playPop();
                setSelectedStory('grandma');
              }}
              className={`p-4 sm:p-5 rounded-3xl border-3 transition-all cursor-pointer flex flex-col justify-between ${
                selectedStory === 'grandma'
                  ? 'bg-gradient-to-br from-emerald-200 via-teal-100 to-sky-100 border-emerald-400 shadow-lg ring-4 ring-emerald-300/50'
                  : 'bg-white/80 border-emerald-200 shadow-md hover:bg-emerald-50/70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl sm:text-4xl">🏡</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        audio.speakUkrainian('У бабусі в селі! Курочки, котики та теплі калюжі!', 'nicole');
                      }}
                      className="p-1 rounded-full bg-white/60 hover:bg-white text-emerald-600 transition"
                      title="Послухати"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-xs">
                      5 ігор
                    </span>
                  </div>
                </div>
                <h4 className="text-lg font-black text-gray-900 mb-1">У бабусі в селі</h4>
                <p className="text-xs text-gray-600 font-medium mb-3">
                  Курочки, вазонки, троє пухнастих котиків, грибочки в лісі та калюжі.
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  audio.playSparkle();
                  audio.speakUkrainian('Ура! Їдемо до бабусі в село!', 'nicole');
                  setSelectedStory('grandma');
                  onSelectGrandmaStage('chickens');
                }}
                className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xs rounded-xl shadow-xs hover:brightness-110 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>До бабусі</span>
              </button>
            </motion.div>

            {/* Story 3 */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                audio.playPop();
                setSelectedStory('grandpa');
              }}
              className={`p-4 sm:p-5 rounded-3xl border-3 transition-all cursor-pointer flex flex-col justify-between ${
                selectedStory === 'grandpa'
                  ? 'bg-gradient-to-br from-sky-200 via-indigo-100 to-amber-100 border-sky-400 shadow-lg ring-4 ring-sky-300/50'
                  : 'bg-white/80 border-sky-200 shadow-md hover:bg-sky-50/70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl sm:text-4xl">🚂</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        audio.speakUkrainian('Поїздка до дідуся! Потяг, песик Кнопка і риболовля!', 'nicole');
                      }}
                      className="p-1 rounded-full bg-white/60 hover:bg-white text-sky-600 transition"
                      title="Послухати"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-sky-600 text-white shadow-xs">
                      7 пригод
                    </span>
                  </div>
                </div>
                <h4 className="text-lg font-black text-gray-900 mb-1">Поїздка до дідуся</h4>
                <p className="text-xs text-gray-600 font-medium mb-3">
                  Потяг, песик Кнопка, каченята, риболовля, цукерки, малюнки та ролики.
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  audio.playTrainWhistle();
                  audio.speakUkrainian('Ура! Сідаємо в потяг до дідуся!', 'nicole');
                  setSelectedStory('grandpa');
                  onSelectGrandpaStage('train');
                }}
                className="w-full py-2 bg-gradient-to-r from-sky-500 via-indigo-500 to-amber-500 text-white font-black text-xs rounded-xl shadow-xs hover:brightness-110 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>До дідуся</span>
              </button>
            </motion.div>

            {/* Story 4 */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                audio.playPop();
                setSelectedStory('dance');
              }}
              className={`p-4 sm:p-5 rounded-3xl border-3 transition-all cursor-pointer flex flex-col justify-between ${
                selectedStory === 'dance'
                  ? 'bg-gradient-to-br from-purple-200 via-pink-100 to-rose-100 border-purple-400 shadow-lg ring-4 ring-purple-300/50'
                  : 'bg-white/80 border-purple-200 shadow-md hover:bg-purple-50/70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl sm:text-4xl">🩰</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        audio.speakUkrainian('Похід на танці! Гарна сукня, розминка і виступ на сцені!', 'nicole');
                      }}
                      className="p-1 rounded-full bg-white/60 hover:bg-white text-purple-600 transition"
                      title="Послухати"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-purple-600 text-white shadow-xs">
                      5 етапів
                    </span>
                  </div>
                </div>
                <h4 className="text-lg font-black text-gray-900 mb-1">Похід на танці</h4>
                <p className="text-xs text-gray-600 font-medium mb-3">
                  Вбрання балерини, розминка біля станка, хореографія, водичка та виступ.
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  audio.playBalletPirouette();
                  audio.speakUkrainian('Ура! Йдемо на танці!', 'nicole');
                  setSelectedStory('dance');
                  onSelectDanceStage('dance_dressing');
                }}
                className="w-full py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 text-white font-black text-xs rounded-xl shadow-xs hover:brightness-110 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>На танці</span>
              </button>
            </motion.div>
          </div>

          {/* Story Selector Tabs */}
          <div className="w-full mb-6">
            <div className="flex items-center justify-center sm:justify-start gap-2 bg-white/90 p-1.5 sm:p-2 rounded-2xl border-2 border-pink-200 shadow-sm flex-wrap">
              <button
                onClick={() => {
                  audio.playPop();
                  setSelectedStory('city_day');
                }}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm md:text-base transition cursor-pointer ${
                  selectedStory === 'city_day'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                    : 'bg-pink-50/70 text-gray-700 hover:bg-pink-100'
                }`}
              >
                <span>☀️</span>
                <span>День у місті (6 етапів)</span>
              </button>

              <button
                onClick={() => {
                  audio.playPop();
                  setSelectedStory('grandma');
                }}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm md:text-base transition cursor-pointer ${
                  selectedStory === 'grandma'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                    : 'bg-emerald-50/70 text-gray-700 hover:bg-emerald-100'
                }`}
              >
                <span>🏡</span>
                <span>До бабусі (5 ігор)</span>
              </button>

              <button
                onClick={() => {
                  audio.playPop();
                  setSelectedStory('grandpa');
                }}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm md:text-base transition cursor-pointer ${
                  selectedStory === 'grandpa'
                    ? 'bg-gradient-to-r from-sky-500 via-indigo-500 to-amber-500 text-white shadow-md'
                    : 'bg-sky-50/70 text-gray-700 hover:bg-sky-100'
                }`}
              >
                <span>🚂</span>
                <span>Поїздка до дідуся (7 пригод)</span>
              </button>

              <button
                onClick={() => {
                  audio.playBalletPirouette();
                  setSelectedStory('dance');
                }}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm md:text-base transition cursor-pointer ${
                  selectedStory === 'dance'
                    ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 text-white shadow-md'
                    : 'bg-purple-50/70 text-gray-700 hover:bg-purple-100'
                }`}
              >
                <span>🩰</span>
                <span>Похід на танці (5 етапів)</span>
              </button>
            </div>
          </div>

      {/* Stages Grid Container */}
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-lg sm:text-2xl font-black text-gray-800 flex items-center gap-2">
            <span>
              {selectedStory === 'city_day'
                ? 'Пригоди нашого дня'
                : selectedStory === 'grandma'
                ? 'Пригода в селі у бабусі'
                : selectedStory === 'grandpa'
                ? 'Поїздка до Дідуся Толіка та Бабусі Наталі'
                : 'Похід на танці з Ніколь'}
            </span>
            <span className="text-xs sm:text-sm font-bold bg-pink-200 text-pink-900 px-3 py-1 rounded-full">
              {selectedStory === 'city_day'
                ? '6 етапів'
                : selectedStory === 'grandma'
                ? '5 ігор'
                : selectedStory === 'grandpa'
                ? '7 інтерактивних пригод'
                : '5 танцювальних етапів'}
            </span>
          </h3>
          <span className="text-xs sm:text-sm font-bold text-gray-500 hidden sm:inline">
            Торкніться картки для початку гри
          </span>
        </div>

        {/* Story 1: City Day Grid */}
        {selectedStory === 'city_day' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {cityStages.map((stage, index) => {
              const isCompleted = completedStages[stage.id];
              return (
                <motion.div
                  key={stage.id}
                  whileHover={{ y: -5, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    audio.playSparkle();
                    audio.speakUkrainian(`Починаємо етап: ${stage.title}`, 'nicole');
                    onSelectStage(stage.id);
                  }}
                  className={`bg-gradient-to-br ${stage.color} rounded-3xl p-4 sm:p-5 border-3 shadow-md flex flex-col justify-between cursor-pointer transition-all hover:shadow-xl`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="p-2.5 bg-white rounded-2xl shadow-sm border border-pink-100">
                        {stage.icon}
                      </span>
                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 ${
                          isCompleted
                            ? 'bg-emerald-500 text-white'
                            : stage.badgeColor
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Пройдено!
                          </>
                        ) : (
                          `Етап ${index + 1}`
                        )}
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-black text-gray-900 mb-1">
                      {stage.title}
                    </h4>
                    <p className="text-xs sm:text-sm font-bold text-pink-700 mb-2">
                      {stage.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium line-clamp-2 mb-4">
                      {stage.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {stage.steps.map((step, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] sm:text-xs font-black bg-white/70 text-gray-700 px-2 py-0.5 rounded-md border border-white/40"
                        >
                          {step}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        audio.playSparkle();
                        onSelectStage(stage.id);
                      }}
                      className="w-full py-2.5 sm:py-3 bg-white hover:bg-pink-50 active:scale-95 text-pink-700 font-black text-xs sm:text-sm rounded-2xl shadow-sm border border-pink-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-pink-600 text-pink-600" />
                      <span>{isCompleted ? 'Грати знову' : 'Почати гру!'}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Story 2: Grandma Village Grid */}
        {selectedStory === 'grandma' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {grandmaStages.map((stage, index) => {
              const isCompleted = completedGrandmaStages[stage.id];
              return (
                <motion.div
                  key={stage.id}
                  whileHover={{ y: -5, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    audio.playSparkle();
                    audio.speakUkrainian(`Починаємо гру: ${stage.title}`, 'nicole');
                    onSelectGrandmaStage(stage.id);
                  }}
                  className={`bg-gradient-to-br ${stage.color} rounded-3xl p-4 sm:p-5 border-3 shadow-md flex flex-col justify-between cursor-pointer transition-all hover:shadow-xl`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="p-2.5 bg-white rounded-2xl shadow-sm border border-amber-200">
                        {stage.icon}
                      </span>
                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 ${
                          isCompleted
                            ? 'bg-emerald-500 text-white'
                            : stage.badgeColor
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Пройдено!
                          </>
                        ) : (
                          `Гра ${index + 1}`
                        )}
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-black text-gray-900 mb-1">
                      {stage.title}
                    </h4>
                    <p className="text-xs sm:text-sm font-bold text-amber-900 mb-2">
                      {stage.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700 font-medium line-clamp-2 mb-4">
                      {stage.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {stage.steps.map((step, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] sm:text-xs font-black bg-white/80 text-gray-800 px-2 py-0.5 rounded-md border border-white/60"
                        >
                          {step}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        audio.playSparkle();
                        onSelectGrandmaStage(stage.id);
                      }}
                      className="w-full py-2.5 sm:py-3 bg-white hover:bg-amber-50 active:scale-95 text-emerald-800 font-black text-xs sm:text-sm rounded-2xl shadow-sm border border-emerald-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                      <span>{isCompleted ? 'Грати знову' : 'Почати гру!'}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Story 3: Grandpa Tolik & Grandma Natalia Grid */}
        {selectedStory === 'grandpa' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {grandpaStages.map((stage, index) => {
              const isCompleted = completedGrandpaStages[stage.id];
              return (
                <motion.div
                  key={stage.id}
                  whileHover={{ y: -5, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    audio.playSparkle();
                    audio.speakUkrainian(`Починаємо пригоду: ${stage.title}`, 'nicole');
                    onSelectGrandpaStage(stage.id);
                  }}
                  className={`bg-gradient-to-br ${stage.color} rounded-3xl p-4 sm:p-5 border-3 shadow-md flex flex-col justify-between cursor-pointer transition-all hover:shadow-xl`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="p-2.5 bg-white rounded-2xl shadow-sm border border-sky-200">
                        {stage.icon}
                      </span>
                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 ${
                          isCompleted
                            ? 'bg-emerald-500 text-white'
                            : stage.badgeColor
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Пройдено!
                          </>
                        ) : (
                          `Пригода ${index + 1}`
                        )}
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-black text-gray-900 mb-1">
                      {stage.title}
                    </h4>
                    <p className="text-xs sm:text-sm font-bold text-sky-900 mb-2">
                      {stage.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700 font-medium line-clamp-2 mb-4">
                      {stage.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {stage.steps.map((step, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] sm:text-xs font-black bg-white/80 text-gray-800 px-2 py-0.5 rounded-md border border-white/60"
                        >
                          {step}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        audio.playSparkle();
                        onSelectGrandpaStage(stage.id);
                      }}
                      className="w-full py-2.5 sm:py-3 bg-white hover:bg-sky-50 active:scale-95 text-sky-800 font-black text-xs sm:text-sm rounded-2xl shadow-sm border border-sky-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-sky-600 text-sky-600" />
                      <span>{isCompleted ? 'Грати знову' : 'Почати пригоду!'}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Story 4: Dance Class Grid */}
        {selectedStory === 'dance' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {danceStages.map((stage, index) => {
              const isCompleted = completedDanceStages[stage.id];
              return (
                <motion.div
                  key={stage.id}
                  whileHover={{ y: -5, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    audio.playBalletPirouette();
                    audio.speakUkrainian(`Починаємо: ${stage.title}`, 'nicole');
                    onSelectDanceStage(stage.id);
                  }}
                  className={`bg-gradient-to-br ${stage.color} rounded-3xl p-4 sm:p-5 border-3 shadow-md flex flex-col justify-between cursor-pointer transition-all hover:shadow-xl`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="p-2.5 bg-white rounded-2xl shadow-sm border border-pink-200">
                        {stage.icon}
                      </span>
                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 ${
                          isCompleted
                            ? 'bg-emerald-500 text-white'
                            : stage.badgeColor
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Пройдено!
                          </>
                        ) : (
                          `Етап ${index + 1}`
                        )}
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-black text-gray-900 mb-1">
                      {stage.title}
                    </h4>
                    <p className="text-xs sm:text-sm font-bold text-pink-900 mb-2">
                      {stage.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700 font-medium line-clamp-2 mb-4">
                      {stage.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {stage.steps.map((step, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] sm:text-xs font-black bg-white/80 text-gray-800 px-2 py-0.5 rounded-md border border-white/60"
                        >
                          {step}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        audio.playBalletPirouette();
                        onSelectDanceStage(stage.id);
                      }}
                      className="w-full py-2.5 sm:py-3 bg-white hover:bg-pink-50 active:scale-95 text-pink-800 font-black text-xs sm:text-sm rounded-2xl shadow-sm border border-pink-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-pink-600 text-pink-600" />
                      <span>{isCompleted ? 'Грати знову' : 'Почати етап!'}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
        </div>
      )}
    </div>
  );
};
