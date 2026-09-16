import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { X, Sparkles, Check, Shuffle, Heart, Volume2 } from 'lucide-react';
import {
  NicoleAppearance,
  HairstyleId,
  OutfitId,
  ShoeId,
  EyeColorId,
  AccessoryId,
  KavusiaAccessory,
} from '../types';
import { NicoleAvatar } from './NicoleAvatar';
import { KavusiaAvatar } from './KavusiaAvatar';
import { audio } from '../utils/audio';

interface WardrobeModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentAppearance: NicoleAppearance;
  kavusiaAccessory?: KavusiaAccessory;
  onSaveAppearance?: (appearance: NicoleAppearance) => void;
  onSave?: (appearance: NicoleAppearance) => void;
  onSaveKavusiaAccessory?: (acc: KavusiaAccessory) => void;
}

export const WardrobeModal: React.FC<WardrobeModalProps> = ({
  isOpen = true,
  onClose,
  currentAppearance,
  kavusiaAccessory = 'bow',
  onSaveAppearance,
  onSave,
  onSaveKavusiaAccessory,
}) => {
  const [appearance, setAppearance] = useState<NicoleAppearance>(currentAppearance);
  const [petAccessory, setPetAccessory] = useState<KavusiaAccessory>(kavusiaAccessory);
  const [activeCategory, setActiveCategory] = useState<'outfit' | 'shoes' | 'hair' | 'eyes' | 'acc' | 'kavusia'>('outfit');

  useEffect(() => {
    setAppearance(currentAppearance);
  }, [currentAppearance, isOpen]);

  useEffect(() => {
    setPetAccessory(kavusiaAccessory);
  }, [kavusiaAccessory, isOpen]);

  if (isOpen !== undefined && !isOpen) return null;

  // 11 Outfits (including Ballerina & Fairy)
  const outfits: { id: OutfitId; name: string; icon: string; desc: string; voice: string; tag?: string }[] = [
    {
      id: 'ballerina_dress',
      name: 'Сукня балерини',
      icon: '🩰',
      desc: 'Рожева пачка з тюлем для танців',
      voice: 'Ура! Я граційна балерина у рожевій пачці!',
      tag: 'Танці',
    },
    {
      id: 'cherry_dress',
      name: 'Вишнева сукенка',
      icon: '🍒',
      desc: 'З джинсовою курточкою',
      voice: 'Моя улюблена сукенка з солодкими вишеньками!',
    },
    {
      id: 'princess_dress',
      name: 'Сукня принцеси',
      icon: '👑',
      desc: 'Казкова фіолетова з блискітками',
      voice: 'Ура! Я справжня казкова принцеса!',
      tag: 'Казка',
    },
    {
      id: 'fairy_princess',
      name: 'Лісова фея з крильцями',
      icon: '🧚‍♀️',
      desc: 'Смарагдова сукня з чарівними крильцями',
      voice: 'Ого, я справжня чарівна фея лісу! Мої крильця сяють!',
      tag: 'Казка',
    },
    {
      id: 'holiday_party',
      name: 'Святкова сукня',
      icon: '🎀',
      desc: 'Яскраво-червона з золотим бантом',
      voice: 'Яка святкова сукня! Час танцювати та святкувати!',
      tag: 'Свято',
    },
    {
      id: 'sunflower_summer',
      name: 'Літній сарафанчик',
      icon: '🌻',
      desc: 'Теплий сонячний з соняшниками',
      voice: 'Мій улюблений літній сарафанчик з соняшниками!',
      tag: 'Літо',
    },
    {
      id: 'raincoat',
      name: 'Червоний дощовик',
      icon: '🐞',
      desc: 'У білий веселий горошок',
      voice: 'Яскравий дощовик у горошок! Мені не страшний дощик!',
      tag: 'Осінь',
    },
    {
      id: 'winter_bear',
      name: 'Зимове пальтечко',
      icon: '❄️',
      desc: 'Тепле з хутром та ведмедиком',
      voice: 'Затишне зимове пальтечко з пухнастим хутром і ведмедиком!',
      tag: 'Зима',
    },
    {
      id: 'sport_tracksuit',
      name: 'Спортивний костюм',
      icon: '🏃‍♀️',
      desc: 'Зручний для самоката',
      voice: 'Тепер я найшвидша на самокаті в парку!',
    },
    {
      id: 'sunny_overalls',
      name: 'Жовтий комбінезончик',
      icon: '🌼',
      desc: 'Сонячний з ромашкою',
      voice: 'Яскравий сонячний комбінезон із ромашкою!',
    },
    {
      id: 'cozy_pajama',
      name: 'Затишна піжамка',
      icon: '☁️',
      desc: 'З хмаринками та зірочками',
      voice: 'Мʼякенька піжамка з зірочками та хмаринками!',
    },
    {
      id: 'superhero_costume',
      name: 'Костюм Супергеройки',
      icon: '🦸‍♀️',
      desc: 'Плащ і супер-костюм',
      voice: 'Ура! Я Супер-Ніколь! Час рятувати світ!',
      tag: 'Герой',
    },
    {
      id: 'mermaid_dress',
      name: 'Сукня Русалоньки',
      icon: '🧜‍♀️',
      desc: 'Переливчаста сукня-луска',
      voice: 'Я красива русалонька із морської казки!',
      tag: 'Казка',
    },
    {
      id: 'unicorn_onesie',
      name: 'Піжамка Єдиноріжка',
      icon: '🦄',
      desc: 'З рожиком та пухнастою гривою',
      voice: 'М мʼякенький рожевий єдиноріжок!',
      tag: 'Казка',
    },
    {
      id: 'chef_outfit',
      name: 'Костюм Шеф-кухаря',
      icon: '👩‍🍳',
      desc: 'Білий фартушок із золотими пуговицями',
      voice: 'Я головний шеф-кухар! Готую найсмачніший пікнік!',
    },
    {
      id: 'snow_queen',
      name: 'Сукня Снігової Королеви',
      icon: '❄️',
      desc: 'Кришталева зі сніжинками',
      voice: 'Я велична Снігова Королева! Моя сукня сяє морозними зірочками!',
      tag: 'Казка',
    },
  ];

  // 7 Shoes
  const shoesList: { id: ShoeId; name: string; icon: string; desc: string; voice: string }[] = [
    {
      id: 'ballet_slippers',
      name: 'Балетні пуанти',
      icon: '🩰',
      desc: 'Рожеві шовкові стрічки для танців',
      voice: 'Рожеві балетні пуанти! Тепер я можу кружляти на пальчиках!',
    },
    {
      id: 'cherry_shoes',
      name: 'Туфельки «Вишенька»',
      icon: '🍒',
      desc: 'Червоні лаковані з вишеньками',
      voice: 'Мої гарні червоні туфельки мері-джейн із вишеньками!',
    },
    {
      id: 'princess_heels',
      name: 'Кришталеві туфельки',
      icon: '👠',
      desc: 'Сяючі фіолетові з золотими зірками',
      voice: 'Казкові кришталеві туфельки, як у Попелюшки!',
    },
    {
      id: 'yellow_rainboots',
      name: 'Гумові чобітки',
      icon: '🥾',
      desc: 'Яскраво-жовті для теплих калюж',
      voice: 'Жовті гумові чобітки! Час весело стрибати по калюжах!',
    },
    {
      id: 'sport_sneakers',
      name: 'Спортивні кросівки',
      icon: '👟',
      desc: 'Мʼятні кросівки з блискавками',
      voice: 'Швидкісні кросівки для бігу й катання на самокаті!',
    },
    {
      id: 'winter_boots',
      name: 'Хутряні уггі',
      icon: '👢',
      desc: 'Теплі зимові чобітки з хутром',
      voice: 'Мʼякенькі теплі уггі! Моїм ніжкам тепло навіть у мороз!',
    },
    {
      id: 'summer_sandals',
      name: 'Літні сандалики',
      icon: '👡',
      desc: 'Легкі босоніжки з соняшниками',
      voice: 'Зручні літні босоніжки для теплого сонечка!',
    },
    {
      id: 'rainbow_glow_sneakers',
      name: 'Райдужні кросівки',
      icon: '👟',
      desc: 'Підсвічуються веселкою',
      voice: 'Ого! Мої кросівки сяють веселковими вогнями при бігу!',
    },
    {
      id: 'unicorn_slippers',
      name: 'Капці-Єдинороги',
      icon: '🦄',
      desc: 'Пухнасті з ріжком',
      voice: 'Найтепліші пухнасті капці-єдиноріжки!',
    },
    {
      id: 'golden_star_boots',
      name: 'Золоті чобітки',
      icon: '👢',
      desc: 'Сяючі з зірочками',
      voice: 'Золоті зоряні чобітки для справжньої принцеси!',
    },
  ];

  // 4 Hairstyles
  const hairstyles: { id: HairstyleId; name: string; icon: string; desc: string; voice: string }[] = [
    {
      id: 'pigtails_flowers',
      name: 'Хвостики з квітами',
      icon: '👱‍♀️',
      desc: 'Два світлих хвостики',
      voice: 'Два веселих хвостики з яскравими квіточками!',
    },
    {
      id: 'buns_bows',
      name: 'Пучечки з бантиками',
      icon: '🎀',
      desc: 'Два кругленьких пучечки',
      voice: 'Ой, які милі кругленькі пучечки з рожевими бантиками!',
    },
    {
      id: 'loose_waves',
      name: 'Хвилясте з обідком',
      icon: '👸',
      desc: 'Розпущене пишне волоссячко',
      voice: 'Красиве розпущене волосся з рожевим обідком!',
    },
    {
      id: 'high_ponytail',
      name: 'Високий хвостик',
      icon: '⭐',
      desc: 'Зірочка на маківці',
      voice: 'Пустотливий високий хвостик із зірочкою!',
    },
  ];

  // 4 Eye Colors
  const eyeColors: { id: EyeColorId; name: string; colorClass: string; icon: string; voice: string }[] = [
    {
      id: 'sky_blue',
      name: 'Небесно-блакитні',
      colorClass: 'bg-sky-400 border-sky-500',
      icon: '💙',
      voice: 'Небесно-блакитні оченята, як літнє сонячне небо!',
    },
    {
      id: 'emerald_green',
      name: 'Смарагдово-зелені',
      colorClass: 'bg-emerald-400 border-emerald-500',
      icon: '💚',
      voice: 'Смарагдові оченята, наче весняні листочки в парку!',
    },
    {
      id: 'warm_hazel',
      name: 'Теплі янтарно-карі',
      colorClass: 'bg-amber-600 border-amber-700',
      icon: '🤎',
      voice: 'Теплі бурштинові оченята, як солодкий мед!',
    },
    {
      id: 'violet',
      name: 'Чарівні фіалкові',
      colorClass: 'bg-purple-500 border-purple-600',
      icon: '💜',
      voice: 'Чарівні фіалкові оченята, як у казкової феї!',
    },
  ];

  // 10 Accessories
  const accessories: { id: AccessoryId; name: string; icon: string; voice: string; tag?: string }[] = [
    { id: 'none', name: 'Без прикрас', icon: '✨', voice: 'Чисто і природно!' },
    { id: 'crown', name: 'Золота корона', icon: '👑', voice: 'Сяюча золота корона принцеси!', tag: 'Казка' },
    { id: 'fairy_wings', name: 'Крильця феї', icon: '🧚', voice: 'Чарівні крильця! Тепер я можу літати!', tag: 'Казка' },
    { id: 'heart_glasses', name: 'Окуляри-сердечка', icon: '🕶️', voice: 'Модні окуляри-сердечка! Дуже стильно!' },
    { id: 'flower_crown', name: 'Квітковий вінок', icon: '🌸', voice: 'Гарний віночок з ніжних квітів!', tag: 'Свято' },
    { id: 'cat_ears', name: 'Вушка котика', icon: '🐱', voice: 'Няв! Тепер я грайливе кошеня!' },
    { id: 'flower', name: 'Рожева квітка', icon: '🌺', voice: 'Ароматна весняна квіточка!' },
    { id: 'party_hat', name: 'Святковий ковпак', icon: '🥳', voice: 'Святковий ковпачок з блискітками!', tag: 'Свято' },
    { id: 'winter_beanie', name: 'Зимова шапочка', icon: '🧶', voice: 'Тепла шапочка з пухнастим помпоном!', tag: 'Зима' },
    { id: 'guinea_pig_pin', name: 'Значок Кавусі', icon: '🐹', voice: 'Мій улюбленець – морська свинка Кавуся зі мною!', tag: 'Улюбленець' },
    { id: 'unicorn_headband', name: 'Обруч Єдинорога', icon: '🦄', voice: 'Чарівний золотий ріжок з квіточками!', tag: 'Казка' },
    { id: 'superhero_mask', name: 'Маска Супергероя', icon: '🦸‍♀️', voice: 'Рожева маска супергероя для секретних місій!', tag: 'Герой' },
    { id: 'magic_star_wand', name: 'Зоряна паличка', icon: '🪄', voice: 'Зоряна паличка випускає чарівні іскри!', tag: 'Магія' },
    { id: 'butterfly_clip', name: 'Заколка Метелик', icon: '🦋', voice: 'Сяюча заколка-метелик на волоссічко!', tag: 'Літо' },
  ];

  // Kavusia accessories
  const kavusiaAccessories: { id: KavusiaAccessory; name: string; icon: string; voice: string }[] = [
    { id: 'bow', name: 'Рожевий бантик', icon: '🎀', voice: 'Кавуся з ніжним шовковим бантиком!' },
    { id: 'crown', name: 'Корона принцеси', icon: '👑', voice: 'Кавуся тепер справжня свинка-принцеса!' },
    { id: 'strawberry', name: 'Полуничний берет', icon: '🍓', voice: 'Смачний полуничний беретик для Кавусі!' },
    { id: 'sunglasses', name: 'Круті окуляри', icon: '🕶️', voice: 'Кавуся в наймодніших сонцезахисних окулярах!' },
    { id: 'chef_hat', name: 'Ковпак кухаря', icon: '👨‍🍳', voice: 'Шеф-кухар Кавуся готує смаколики!' },
    { id: 'warm_scarf', name: 'Теплий шарфик', icon: '🧣', voice: 'Затишний зимовий шарфик зігріває Кавусю!' },
    { id: 'golden_bell', name: 'Золотий дзвіночок', icon: '🔔', voice: 'Мелодійний дзвіночок дзвенить при кожному кроці!' },
    { id: 'fairy_wings', name: 'Крильця феї', icon: '🧚', voice: 'Кавуся літає на чарівних крильцях!' },
    { id: 'flower', name: 'Квіточка', icon: '🌸', voice: 'Кавуся прикрашена ніжною квіточкою!' },
    { id: 'party_hat', name: 'Святковий ковпак', icon: '🎉', voice: 'Кавуся святкує день народження!' },
    { id: 'none', name: 'Без прикрас', icon: '🐹', voice: 'Кавуся в природній пухнастій красі!' },
  ];

  // Select Handlers
  const handleSelectOutfit = (item: typeof outfits[0]) => {
    audio.playSparkle();
    audio.speakUkrainian(item.voice, 'nicole');
    setAppearance(prev => ({ ...prev, outfit: item.id }));
  };

  const handleSelectShoe = (item: typeof shoesList[0]) => {
    audio.playSparkle();
    audio.speakUkrainian(item.voice, 'nicole');
    setAppearance(prev => ({ ...prev, shoes: item.id }));
  };

  const handleSelectHairstyle = (item: typeof hairstyles[0]) => {
    audio.playSparkle();
    audio.speakUkrainian(item.voice, 'nicole');
    setAppearance(prev => ({ ...prev, hairstyle: item.id }));
  };

  const handleSelectEyeColor = (item: typeof eyeColors[0]) => {
    audio.playPop();
    audio.speakUkrainian(item.voice, 'nicole');
    setAppearance(prev => ({ ...prev, eyeColor: item.id }));
  };

  const handleSelectAccessory = (item: typeof accessories[0]) => {
    audio.playSparkle();
    audio.speakUkrainian(item.voice, 'nicole');
    setAppearance(prev => ({ ...prev, accessory: item.id }));
  };

  const handleSelectKavusiaAccessory = (item: typeof kavusiaAccessories[0]) => {
    audio.playGuineaPigSqueak();
    audio.speakUkrainian(item.voice, 'nicole');
    setPetAccessory(item.id);
    if (onSaveKavusiaAccessory) {
      onSaveKavusiaAccessory(item.id);
    }
  };

  // Surprise Randomizer
  const handleRandomize = () => {
    audio.playPop(1.5);
    const randOutfit = outfits[Math.floor(Math.random() * outfits.length)].id;
    const randShoe = shoesList[Math.floor(Math.random() * shoesList.length)].id;
    const randHair = hairstyles[Math.floor(Math.random() * hairstyles.length)].id;
    const randEye = eyeColors[Math.floor(Math.random() * eyeColors.length)].id;
    const randAcc = accessories[Math.floor(Math.random() * accessories.length)].id;
    const randPet = kavusiaAccessories[Math.floor(Math.random() * kavusiaAccessories.length)].id;

    const newLook: NicoleAppearance = {
      outfit: randOutfit,
      shoes: randShoe,
      hairstyle: randHair,
      eyeColor: randEye,
      accessory: randAcc,
    };
    setAppearance(newLook);
    setPetAccessory(randPet);
    if (onSaveKavusiaAccessory) onSaveKavusiaAccessory(randPet);
    audio.speakUkrainian('Ой, який сюрприз! Який цікавий новий образ для нас із Кавусею!', 'nicole');
  };

  // Save Look
  const handleSave = () => {
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    audio.playFanfare();
    audio.speakUkrainian('Ура! Мій новий образ просто чудовий! Дякую!', 'nicole');
    if (onSaveAppearance) {
      onSaveAppearance(appearance);
    }
    if (onSave) {
      onSave(appearance);
    }
    if (onSaveKavusiaAccessory) {
      onSaveKavusiaAccessory(petAccessory);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.88, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.88, opacity: 0, y: 15 }}
          className="relative w-full max-w-4xl max-h-[94vh] overflow-hidden rounded-3xl bg-gradient-to-b from-pink-50 via-rose-50 to-purple-50 border-4 border-pink-300 shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="p-3 sm:p-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 border-b-2 border-pink-300 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border-2 border-white/40 shadow-inner shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-200" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-2xl font-black drop-shadow-sm truncate">
                  Чарівна Вбиральня Ніколь 👗
                </h2>
                <p className="text-xs font-bold text-pink-100 truncate">
                  Приміряй сукні, взуття, зачіски та одягай Кавусю!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleRandomize}
                className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center gap-1.5 font-black text-xs transition border border-white/40 active:scale-95 cursor-pointer"
                title="Випадковий веселий образ"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Сюрприз!</span>
              </button>

              <button
                onClick={() => {
                  audio.playPop();
                  onClose();
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center active:scale-90 transition border border-white/40 cursor-pointer"
                title="Закрити"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Navigation Category Tabs */}
          <div className="p-2 sm:p-2.5 bg-white/85 border-b border-pink-200 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
            <button
              onClick={() => {
                audio.playPop();
                setActiveCategory('outfit');
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
                activeCategory === 'outfit'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                  : 'bg-pink-100/70 text-gray-700 hover:bg-pink-200'
              }`}
            >
              <span>👗</span>
              <span>Вбрання</span>
            </button>

            <button
              onClick={() => {
                audio.playPop();
                setActiveCategory('shoes');
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
                activeCategory === 'shoes'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                  : 'bg-pink-100/70 text-gray-700 hover:bg-pink-200'
              }`}
            >
              <span>🩰</span>
              <span>Взуття</span>
            </button>

            <button
              onClick={() => {
                audio.playPop();
                setActiveCategory('acc');
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
                activeCategory === 'acc'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                  : 'bg-pink-100/70 text-gray-700 hover:bg-pink-200'
              }`}
            >
              <span>🎀</span>
              <span>Прикраси</span>
            </button>

            <button
              onClick={() => {
                audio.playPop();
                setActiveCategory('hair');
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
                activeCategory === 'hair'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                  : 'bg-pink-100/70 text-gray-700 hover:bg-pink-200'
              }`}
            >
              <span>👱‍♀️</span>
              <span>Зачіски</span>
            </button>

            <button
              onClick={() => {
                audio.playPop();
                setActiveCategory('eyes');
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
                activeCategory === 'eyes'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                  : 'bg-pink-100/70 text-gray-700 hover:bg-pink-200'
              }`}
            >
              <span>💙</span>
              <span>Оченята</span>
            </button>

            <button
              onClick={() => {
                audio.playPop();
                setActiveCategory('kavusia');
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
                activeCategory === 'kavusia'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                  : 'bg-amber-100/80 text-amber-900 hover:bg-amber-200'
              }`}
            >
              <span>🐹</span>
              <span>Для Кавусі</span>
            </button>
          </div>

          {/* Main Workspace: Left Live Mirror + Right Selectable Items */}
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row min-h-0">
            {/* Live Interactive Mirror (Nicole full body + Kavusia) */}
            <div className="p-3 bg-gradient-to-b from-pink-100/90 via-purple-100/80 to-amber-100/80 border-b md:border-b-0 md:border-r border-pink-200 flex md:flex-col items-center justify-around md:justify-center gap-2 md:w-64 lg:w-72 shrink-0 shadow-inner">
              <div className="text-center">
                <span className="inline-flex items-center gap-1 bg-white/85 px-3 py-0.5 rounded-full border border-pink-300 shadow-xs text-xs font-black text-pink-700 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" /> Дзеркало Ніколь ✨
                </span>
              </div>

              {/* Nicole Avatar + Kavusia */}
              <div className="flex items-center justify-center gap-2.5">
                <motion.div
                  key={`${appearance.outfit}-${appearance.shoes}-${appearance.accessory}-${appearance.hairstyle}-${appearance.eyeColor}`}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-28 h-44 sm:w-32 sm:h-52 md:w-40 md:h-60 relative flex items-center justify-center bg-white/70 rounded-3xl p-1 shadow-md border-2 border-pink-300"
                >
                  <NicoleAvatar
                    appearance={appearance}
                    mode="full"
                    className="w-full h-full object-contain"
                  />
                </motion.div>

                <motion.div
                  key={petAccessory}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-24 sm:w-24 sm:h-28 md:w-28 md:h-32 relative flex flex-col items-center justify-center bg-amber-100/80 rounded-3xl p-1 shadow-md border-2 border-amber-300"
                >
                  <KavusiaAvatar
                    mood="happy"
                    accessory={petAccessory}
                    className="w-full h-full object-contain"
                  />
                  <span className="text-[10px] font-black text-amber-900 bg-white/80 px-1.5 py-0.5 rounded-full">
                    Кавуся 🐹
                  </span>
                </motion.div>
              </div>

              <button
                onClick={handleSave}
                className="w-full max-w-[200px] py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Зберегти цей образ</span>
              </button>
            </div>

            {/* Selection Grid */}
            <div className="p-3 sm:p-4 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {/* OUTFITS TAB */}
              {activeCategory === 'outfit' &&
                outfits.map((item) => {
                  const isSelected = appearance.outfit === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelectOutfit(item)}
                      className={`relative p-2.5 sm:p-3 rounded-2xl border-2 transition flex flex-col items-center text-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-white border-pink-400 ring-2 ring-pink-300 shadow-md scale-102'
                          : 'bg-white/80 border-pink-100 hover:border-pink-300'
                      }`}
                    >
                      {item.tag && (
                        <span className="absolute top-1.5 right-1.5 text-[9px] font-black bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded-full">
                          {item.tag}
                        </span>
                      )}
                      <div className="text-3xl sm:text-4xl my-1">{item.icon}</div>
                      <div className="min-w-0 w-full">
                        <div className="font-black text-xs sm:text-sm text-gray-900 truncate">
                          {item.name}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-500 line-clamp-1">
                          {item.desc}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="mt-1.5 bg-pink-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Обрано
                        </div>
                      )}
                    </motion.button>
                  );
                })}

              {/* SHOES TAB */}
              {activeCategory === 'shoes' &&
                shoesList.map((item) => {
                  const isSelected = appearance.shoes === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelectShoe(item)}
                      className={`relative p-2.5 sm:p-3 rounded-2xl border-2 transition flex flex-col items-center text-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-white border-purple-400 ring-2 ring-purple-300 shadow-md scale-102'
                          : 'bg-white/80 border-purple-100 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-3xl sm:text-4xl my-1">{item.icon}</div>
                      <div className="min-w-0 w-full">
                        <div className="font-black text-xs sm:text-sm text-gray-900 truncate">
                          {item.name}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-500 line-clamp-1">
                          {item.desc}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="mt-1.5 bg-purple-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Взуто
                        </div>
                      )}
                    </motion.button>
                  );
                })}

              {/* ACCESSORIES TAB */}
              {activeCategory === 'acc' &&
                accessories.map((item) => {
                  const isSelected = appearance.accessory === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelectAccessory(item)}
                      className={`relative p-2.5 sm:p-3 rounded-2xl border-2 transition flex flex-col items-center text-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-white border-rose-400 ring-2 ring-rose-300 shadow-md scale-102'
                          : 'bg-white/80 border-rose-100 hover:border-rose-300'
                      }`}
                    >
                      {item.tag && (
                        <span className="absolute top-1.5 right-1.5 text-[9px] font-black bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full">
                          {item.tag}
                        </span>
                      )}
                      <div className="text-3xl sm:text-4xl my-1">{item.icon}</div>
                      <div className="font-black text-xs sm:text-sm text-gray-900 truncate w-full">
                        {item.name}
                      </div>
                      {isSelected && (
                        <div className="mt-1.5 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Одягнено
                        </div>
                      )}
                    </motion.button>
                  );
                })}

              {/* HAIRSTYLES TAB */}
              {activeCategory === 'hair' &&
                hairstyles.map((item) => {
                  const isSelected = appearance.hairstyle === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelectHairstyle(item)}
                      className={`relative p-2.5 sm:p-3 rounded-2xl border-2 transition flex flex-col items-center text-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-white border-amber-400 ring-2 ring-amber-300 shadow-md scale-102'
                          : 'bg-white/80 border-amber-100 hover:border-amber-300'
                      }`}
                    >
                      <div className="text-3xl sm:text-4xl my-1">{item.icon}</div>
                      <div className="font-black text-xs sm:text-sm text-gray-900 truncate w-full">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-gray-500 truncate w-full">{item.desc}</div>
                      {isSelected && (
                        <div className="mt-1.5 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Заплетено
                        </div>
                      )}
                    </motion.button>
                  );
                })}

              {/* EYE COLORS TAB */}
              {activeCategory === 'eyes' &&
                eyeColors.map((item) => {
                  const isSelected = appearance.eyeColor === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelectEyeColor(item)}
                      className={`relative p-2.5 sm:p-3 rounded-2xl border-2 transition flex flex-col items-center text-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-white border-indigo-400 ring-2 ring-indigo-300 shadow-md scale-102'
                          : 'bg-white/80 border-indigo-100 hover:border-indigo-300'
                      }`}
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full my-1 flex items-center justify-center border-4 border-white shadow-md text-2xl">
                        {item.icon}
                      </div>
                      <div className="font-black text-xs sm:text-sm text-gray-900 truncate w-full">
                        {item.name}
                      </div>
                      {isSelected && (
                        <div className="mt-1.5 bg-indigo-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Обрано
                        </div>
                      )}
                    </motion.button>
                  );
                })}

              {/* KAVUSIA ACCESSORIES TAB */}
              {activeCategory === 'kavusia' &&
                kavusiaAccessories.map((item) => {
                  const isSelected = petAccessory === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelectKavusiaAccessory(item)}
                      className={`relative p-2.5 sm:p-3 rounded-2xl border-2 transition flex flex-col items-center text-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-white border-amber-400 ring-2 ring-amber-300 shadow-md scale-102'
                          : 'bg-white/80 border-amber-100 hover:border-amber-300'
                      }`}
                    >
                      <div className="text-3xl sm:text-4xl my-1">{item.icon}</div>
                      <div className="font-black text-xs sm:text-sm text-gray-900 truncate w-full">
                        {item.name}
                      </div>
                      {isSelected && (
                        <div className="mt-1.5 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> На Кавусі
                        </div>
                      )}
                    </motion.button>
                  );
                })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
