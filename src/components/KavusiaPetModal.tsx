import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { X, Heart, Sparkles, Smile, Star, Droplets, Volume2, Home } from 'lucide-react';
import { KavusiaAvatar, KavusiaMood } from './KavusiaAvatar';
import {
  KavusiaAccessory,
  KavusiaRoomState,
  DEFAULT_KAVUSIA_ROOM,
  KavusiaWallpaperId,
  KavusiaBedId,
  KavusiaHouseId,
  KavusiaToyId,
  KavusiaExtraDecorId,
} from '../types';
import { audio } from '../utils/audio';

interface KavusiaPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAccessory?: KavusiaAccessory;
  onSaveAccessory?: (acc: KavusiaAccessory) => void;
  onUnlockReward?: (title: string) => void;
}

export const KavusiaPetModal: React.FC<KavusiaPetModalProps> = ({
  isOpen,
  onClose,
  currentAccessory = 'bow',
  onSaveAccessory,
  onUnlockReward,
}) => {
  const [mood, setMood] = useState<KavusiaMood>('happy');
  const [accessory, setAccessory] = useState<KavusiaAccessory>(currentAccessory);
  const [happiness, setHappiness] = useState<number>(65);
  const [isChewing, setIsChewing] = useState<boolean>(false);
  const [speech, setSpeech] = useState<string>('Ві-ві-ві! Привіт, я морська свинка Кавуся! Завітай до мого будиночка або прикрась кімнату!');
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [activeTab, setActiveTab] = useState<'room' | 'treats' | 'dress' | 'care'>('room');

  // Kavusia Room State
  const [room, setRoom] = useState<KavusiaRoomState>(() => {
    try {
      const saved = localStorage.getItem('kavusia_room_customization');
      return saved ? JSON.parse(saved) : DEFAULT_KAVUSIA_ROOM;
    } catch {
      return DEFAULT_KAVUSIA_ROOM;
    }
  });

  useEffect(() => {
    if (currentAccessory) {
      setAccessory(currentAccessory);
    }
  }, [currentAccessory, isOpen]);

  useEffect(() => {
    try {
      localStorage.setItem('kavusia_room_customization', JSON.stringify(room));
    } catch {
      // ignore
    }
  }, [room]);

  if (!isOpen) return null;

  // Options for Room customization
  const wallpapers: { id: KavusiaWallpaperId; name: string; icon: string; bgClass: string }[] = [
    { id: 'meadow', name: 'Квітучий Луг', icon: '🌸', bgClass: 'from-emerald-100 via-lime-50 to-amber-100' },
    { id: 'princess_castle', name: 'Замок Принцеси', icon: '🏰', bgClass: 'from-pink-200 via-purple-100 to-rose-100' },
    { id: 'starry_space', name: 'Казковий Космос', icon: '🌌', bgClass: 'from-indigo-900 via-purple-900 to-slate-900 text-white' },
    { id: 'lavender_cozy', name: 'Лавандний Затишок', icon: '💜', bgClass: 'from-purple-100 via-pink-50 to-indigo-100' },
    { id: 'sweet_bakery', name: 'Солодка Пекарня', icon: '🎂', bgClass: 'from-amber-100 via-orange-50 to-pink-100' },
  ];

  const beds: { id: KavusiaBedId; name: string; icon: string }[] = [
    { id: 'pink_velvet_hammock', name: 'Рожевий Гамачок', icon: '🎀' },
    { id: 'soft_hay_bed', name: 'Соломка', icon: '🌾' },
    { id: 'cloud_fluff', name: 'Хмаринка', icon: '☁️' },
    { id: 'royal_throne', name: 'Трон', icon: '👑' },
  ];

  const houses: { id: KavusiaHouseId; name: string; icon: string }[] = [
    { id: 'wooden_log_cabin', name: 'Хатинка з колод', icon: '🪵' },
    { id: 'strawberry_mansion', name: 'Полунична садиба', icon: '🍓' },
    { id: 'castle_tower', name: 'Вежа замку', icon: '🏰' },
    { id: 'mushroom_house', name: 'Грибок', icon: '🍄' },
  ];

  const toys: { id: KavusiaToyId; name: string; icon: string }[] = [
    { id: 'rainbow_tunnel', name: 'Веселковий тунель', icon: '🌈' },
    { id: 'wooden_tunnel', name: 'Деревʼяний тунель', icon: '🪵' },
    { id: 'mini_swing', name: 'Міні-гойдалка', icon: '🎡' },
    { id: 'running_wheel_safe', name: 'Коліщатко', icon: '🛞' },
    { id: 'chew_ball', name: 'Кулька', icon: '🔮' },
  ];

  const extraDecors: { id: KavusiaExtraDecorId; name: string; icon: string }[] = [
    { id: 'disco_ball', name: 'Диско-куля', icon: '🪩' },
    { id: 'fairy_lights', name: 'Гірлянда', icon: '💡' },
    { id: 'sunflower_pot', name: 'Соняшник', icon: '🌻' },
    { id: 'nicole_photo_frame', name: 'Портрет Ніколь', icon: '🖼️' },
  ];

  // Tasty treats
  const treats = [
    { id: 'carrot', name: 'Морквочка', icon: '🥕', text: 'Хрум-хрум-хрум! Найсмачніша солодка морквочка у світі!' },
    { id: 'lettuce', name: 'Салатик', icon: '🥬', text: 'Шурх-шурх! Свіжий хрусткий листочок зеленого салату!' },
    { id: 'apple', name: 'Яблучко', icon: '🍎', text: 'Ммм! Соковитий і солодкий шматочок стиглого яблука!' },
    { id: 'cucumber', name: 'Огірочок', icon: '🥒', text: 'Хрусь-хрусь! Освіжаючий прохолодний огірочок!' },
    { id: 'hay', name: 'Запашне сіно', icon: '🌾', text: 'Ароматне лучне сіно — головна страва для здорової свинки!' },
    { id: 'strawberry', name: 'Полуничка', icon: '🍓', text: 'Ой, яка солодка полуничка! Справжнє свято для Кавусі!' },
  ];

  // Complete accessories for Kavusia
  const accessories: { id: KavusiaAccessory; name: string; icon: string }[] = [
    { id: 'bow', name: 'Бантик', icon: '🎀' },
    { id: 'crown', name: 'Корона', icon: '👑' },
    { id: 'strawberry', name: 'Полуничка', icon: '🍓' },
    { id: 'sunglasses', name: 'Окуляри', icon: '🕶️' },
    { id: 'chef_hat', name: 'Ковпак шефа', icon: '👨‍🍳' },
    { id: 'warm_scarf', name: 'Шарфик', icon: '🧣' },
    { id: 'golden_bell', name: 'Дзвіночок', icon: '🔔' },
    { id: 'fairy_wings', name: 'Крильця', icon: '🧚' },
    { id: 'flower', name: 'Квіточка', icon: '🌸' },
    { id: 'party_hat', name: 'Ковпак', icon: '🥳' },
    { id: 'none', name: 'Без прикрас', icon: '✨' },
  ];

  // Feed treat handler
  const handleFeed = (treat: typeof treats[0]) => {
    audio.playCrunch();
    audio.playGuineaPigSqueak();
    setIsChewing(true);
    setMood('eating');
    setSpeech(treat.text);

    const newHap = Math.min(100, happiness + 12);
    setHappiness(newHap);

    if (newHap === 100 && happiness < 100) {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      audio.playFanfare();
      audio.speakUkrainian('Ура! Кавуся на 100% щаслива та сита! Вона любить Ніколь!', 'nicole');
      if (onUnlockReward) onUnlockReward('Морська свинка Кавуся 🐹');
    }

    setTimeout(() => {
      setIsChewing(false);
      setMood('happy');
    }, 1600);
  };

  // Pet Kavusia handler
  const handlePet = (e: React.MouseEvent<HTMLDivElement>) => {
    audio.playGuineaPigSqueak();
    audio.playPetBrush();
    setMood('petting');
    setSpeech('Курлик-курлик! Ві-ві-ві! Мені так подобається, коли ти мене чухаєш!');

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newHeart = { id: Date.now(), x, y };
    setFloatingHearts(prev => [...prev.slice(-6), newHeart]);

    setHappiness(prev => Math.min(100, prev + 8));

    setTimeout(() => {
      setMood('happy');
    }, 1200);
  };

  // Brush fur
  const handleBrush = () => {
    audio.playPetBrush();
    audio.playSparkle();
    setMood('petting');
    setSpeech('Шубка стала такою гладенькою, мʼякенькою і шовковистою! Дякую, Ніколь!');
    setHappiness(prev => Math.min(100, prev + 10));

    setTimeout(() => {
      setMood('happy');
    }, 1200);
  };

  // Fresh water
  const handleGiveWater = () => {
    audio.playWaterSplash();
    audio.playPop();
    setSpeech('Бульк-бульк! Свіжа чиста водичка з поїлочки! Кавуся дуже вдячна!');
    setHappiness(prev => Math.min(100, prev + 10));
  };

  const handleSelectAccessory = (accId: KavusiaAccessory, accName: string) => {
    audio.playSparkle();
    setAccessory(accId);
    audio.speakUkrainian(`Кавуся приміряла ${accName}!`, 'nicole');
    if (onSaveAccessory) {
      onSaveAccessory(accId);
    }
  };

  // Current wallpaper background style
  const currentWall = wallpapers.find(w => w.id === room.wallpaper) || wallpapers[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 15 }}
          className="relative w-full max-w-3xl max-h-[94vh] overflow-hidden rounded-3xl sm:rounded-[36px] bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 border-4 border-amber-300 shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="p-3 sm:p-4 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 border-b-2 border-amber-300 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white text-amber-700 flex items-center justify-center shadow-md text-2xl shrink-0">
                🐹
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-xl font-black drop-shadow-xs truncate">
                  Будиночок морської свинки Кавусі
                </h2>
                <p className="text-[11px] sm:text-xs font-bold text-amber-100 truncate">
                  Улюблений пухнастик Ніколь • Затишна кімнатка та турбота
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                audio.playPop();
                onClose();
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center active:scale-90 transition border border-white/40 cursor-pointer shrink-0"
              title="Закрити"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-3 sm:p-4 overflow-y-auto flex-1 flex flex-col items-center gap-3 min-h-0">
            {/* Happiness Level Meter */}
            <div className="w-full max-w-md bg-white rounded-2xl p-2 sm:p-2.5 border-2 border-amber-200 shadow-xs flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="flex items-center gap-1 font-black text-xs text-amber-800 shrink-0">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Настрій:</span>
              </div>
              <div className="flex-1 bg-gray-100 h-4 rounded-full overflow-hidden border border-gray-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${happiness}%` }}
                  className="h-full bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-400 rounded-full"
                />
              </div>
              <span className="text-xs font-black text-amber-900 shrink-0">{happiness}%</span>
            </div>

            {/* Interactive Pet Room Stage (Option 3 Cozy Room) */}
            <div
              onClick={handlePet}
              className={`relative w-full max-w-md h-52 sm:h-60 bg-gradient-to-b ${currentWall.bgClass} rounded-3xl border-4 border-amber-300 shadow-inner flex flex-col items-center justify-center p-3 cursor-pointer group select-none shrink-0 overflow-hidden`}
            >
              {/* Extra Room Wall Decor */}
              {room.extraDecor === 'disco_ball' && (
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="absolute top-2 left-1/2 -translate-x-1/2 text-3xl pointer-events-none drop-shadow-md z-10"
                >
                  🪩
                </motion.div>
              )}
              {room.extraDecor === 'fairy_lights' && (
                <div className="absolute top-1 left-0 right-0 flex justify-between px-4 text-xl pointer-events-none z-10 opacity-90">
                  <span>💡</span><span>✨</span><span>💡</span><span>✨</span><span>💡</span>
                </div>
              )}
              {room.extraDecor === 'sunflower_pot' && (
                <div className="absolute top-3 right-3 text-3xl pointer-events-none z-10">
                  🌻
                </div>
              )}
              {room.extraDecor === 'nicole_photo_frame' && (
                <div className="absolute top-3 left-3 bg-amber-100 p-1 rounded-xl border-2 border-amber-400 shadow-xs z-10">
                  <span className="text-xs font-black text-amber-900 block">Ніколь ❤️</span>
                  <span className="text-2xl">🖼️</span>
                </div>
              )}

              {/* Wooden House / Castle / Mushroom in background */}
              <div className="absolute bottom-6 left-4 text-4xl sm:text-5xl pointer-events-none drop-shadow-sm">
                {room.house === 'strawberry_mansion' && '🍓'}
                {room.house === 'castle_tower' && '🏰'}
                {room.house === 'mushroom_house' && '🍄'}
                {room.house === 'wooden_log_cabin' && '🪵'}
              </div>

              {/* Toy / Tunnel / Swing on the right */}
              <div className="absolute bottom-6 right-4 text-4xl sm:text-5xl pointer-events-none drop-shadow-sm">
                {room.toy === 'rainbow_tunnel' && '🌈'}
                {room.toy === 'wooden_tunnel' && '🪵'}
                {room.toy === 'mini_swing' && '🎡'}
                {room.toy === 'running_wheel_safe' && '🛞'}
                {room.toy === 'chew_ball' && '🔮'}
              </div>

              {/* Bed / Hammock under Kavusia */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-5xl pointer-events-none opacity-80">
                {room.bed === 'pink_velvet_hammock' && '🎀'}
                {room.bed === 'soft_hay_bed' && '🌾'}
                {room.bed === 'cloud_fluff' && '☁️'}
                {room.bed === 'royal_throne' && '👑'}
              </div>

              {/* Pet Avatar with accessory */}
              <div className="w-32 h-32 sm:w-36 sm:h-36 z-20">
                <KavusiaAvatar mood={mood} isChewing={isChewing} accessory={accessory} />
              </div>

              {/* Floating Hearts Animation */}
              {floatingHearts.map((heart) => (
                <motion.div
                  key={heart.id}
                  initial={{ opacity: 1, y: 0, scale: 0.8 }}
                  animate={{ opacity: 0, y: -60, scale: 1.4 }}
                  transition={{ duration: 1 }}
                  className="absolute text-rose-500 text-xl pointer-events-none z-30"
                  style={{ left: heart.x, top: heart.y }}
                >
                  ❤️
                </motion.div>
              ))}

              <div className="absolute bottom-2 bg-white/90 backdrop-blur-xs px-3 py-0.5 rounded-full border border-amber-300 text-[11px] font-black text-amber-800 flex items-center gap-1 shadow-xs z-30">
                <span>👆 Торкнися, щоб почухати пузико Кавусі!</span>
              </div>
            </div>

            {/* Speech bubble */}
            <div className="w-full max-w-md bg-white rounded-2xl p-2.5 border-2 border-pink-200 shadow-xs flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => audio.speakUkrainian(speech, 'nicole')}
                className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center hover:bg-pink-200 active:scale-90 transition shrink-0 cursor-pointer"
                title="Послухати"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <p className="text-xs sm:text-sm font-bold text-gray-800 leading-snug">
                {speech}
              </p>
            </div>

            {/* Tabs: Room Decor | Treats | Dressing | Care */}
            <div className="flex items-center gap-1 bg-amber-200/50 p-1 rounded-2xl w-full max-w-md shrink-0">
              <button
                onClick={() => {
                  audio.playPop();
                  setActiveTab('room');
                }}
                className={`flex-1 py-1.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'room'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-gray-700 hover:bg-white/60'
                }`}
              >
                <span>🏡 Будиночок</span>
              </button>

              <button
                onClick={() => {
                  audio.playPop();
                  setActiveTab('treats');
                }}
                className={`flex-1 py-1.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'treats'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-gray-700 hover:bg-white/60'
                }`}
              >
                <span>🥕 Їжа</span>
              </button>

              <button
                onClick={() => {
                  audio.playPop();
                  setActiveTab('dress');
                }}
                className={`flex-1 py-1.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'dress'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-gray-700 hover:bg-white/60'
                }`}
              >
                <span>🎀 Одяг</span>
              </button>

              <button
                onClick={() => {
                  audio.playPop();
                  setActiveTab('care');
                }}
                className={`flex-1 py-1.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'care'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-gray-700 hover:bg-white/60'
                }`}
              >
                <span>✨ Догляд</span>
              </button>
            </div>

            {/* TAB CONTENT 0: ROOM DECORATION (Option 3) */}
            {activeTab === 'room' && (
              <div className="flex flex-col gap-3 w-full max-w-md">
                {/* Wallpapers */}
                <div>
                  <span className="text-xs font-black text-gray-700 block mb-1">🖼️ Казкові Шпалери:</span>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                    {wallpapers.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => {
                          audio.playSparkle();
                          setRoom(r => ({ ...r, wallpaper: w.id }));
                          setSpeech(`Ура! Стіни кімнатки стали: ${w.name}!`);
                        }}
                        className={`p-1.5 rounded-xl border-2 flex flex-col items-center justify-center text-[10px] font-black cursor-pointer transition active:scale-90 ${
                          room.wallpaper === w.id
                            ? 'bg-amber-400 text-amber-950 border-amber-600 shadow-xs'
                            : 'bg-white border-amber-200 text-gray-700 hover:bg-amber-50'
                        }`}
                      >
                        <span className="text-lg">{w.icon}</span>
                        <span className="truncate w-full text-center">{w.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* House & Bed */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs font-black text-gray-700 block mb-1">🪵 Затишна Хатинка:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {houses.map((h) => (
                        <button
                          key={h.id}
                          onClick={() => {
                            audio.playPop();
                            setRoom(r => ({ ...r, house: h.id }));
                            setSpeech(`Кавуся оселилася в хатинці: ${h.name}!`);
                          }}
                          className={`p-1.5 rounded-xl border-2 flex flex-col items-center justify-center text-[10px] font-black cursor-pointer transition active:scale-90 ${
                            room.house === h.id
                              ? 'bg-amber-400 text-amber-950 border-amber-600 shadow-xs'
                              : 'bg-white border-amber-200 text-gray-700 hover:bg-amber-50'
                          }`}
                        >
                          <span className="text-base">{h.icon}</span>
                          <span className="truncate w-full text-center">{h.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-black text-gray-700 block mb-1">🛌 Гамачок / Ліжечко:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {beds.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => {
                            audio.playPop();
                            setRoom(r => ({ ...r, bed: b.id }));
                            setSpeech(`Кавуся постелила м'якеньке: ${b.name}!`);
                          }}
                          className={`p-1.5 rounded-xl border-2 flex flex-col items-center justify-center text-[10px] font-black cursor-pointer transition active:scale-90 ${
                            room.bed === b.id
                              ? 'bg-amber-400 text-amber-950 border-amber-600 shadow-xs'
                              : 'bg-white border-amber-200 text-gray-700 hover:bg-amber-50'
                          }`}
                        >
                          <span className="text-base">{b.icon}</span>
                          <span className="truncate w-full text-center">{b.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Toys & Extra Decor */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs font-black text-gray-700 block mb-1">🌈 Іграшка / Тунель:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {toys.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            audio.playPop();
                            setRoom(r => ({ ...r, toy: t.id }));
                            setSpeech(`В кімнатці з'явилася іграшка: ${t.name}!`);
                          }}
                          className={`p-1.5 rounded-xl border-2 flex flex-col items-center justify-center text-[10px] font-black cursor-pointer transition active:scale-90 ${
                            room.toy === t.id
                              ? 'bg-amber-400 text-amber-950 border-amber-600 shadow-xs'
                              : 'bg-white border-amber-200 text-gray-700 hover:bg-amber-50'
                          }`}
                        >
                          <span className="text-base">{t.icon}</span>
                          <span className="truncate w-full text-center">{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-black text-gray-700 block mb-1">🪩 Прикраса кімнати:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {extraDecors.map((ed) => (
                        <button
                          key={ed.id}
                          onClick={() => {
                            audio.playSparkle();
                            setRoom(r => ({ ...r, extraDecor: ed.id }));
                            setSpeech(`Прикраса в кімнаті: ${ed.name}!`);
                          }}
                          className={`p-1.5 rounded-xl border-2 flex flex-col items-center justify-center text-[10px] font-black cursor-pointer transition active:scale-90 ${
                            room.extraDecor === ed.id
                              ? 'bg-amber-400 text-amber-950 border-amber-600 shadow-xs'
                              : 'bg-white border-amber-200 text-gray-700 hover:bg-amber-50'
                          }`}
                        >
                          <span className="text-base">{ed.icon}</span>
                          <span className="truncate w-full text-center">{ed.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 1: TREATS */}
            {activeTab === 'treats' && (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 w-full max-w-md">
                {treats.map((treat) => (
                  <button
                    key={treat.id}
                    onClick={() => handleFeed(treat)}
                    className="flex flex-col items-center justify-center p-2 bg-white hover:bg-amber-100/60 active:scale-90 border-2 border-amber-200 rounded-2xl shadow-xs transition group cursor-pointer"
                  >
                    <span className="text-2xl sm:text-3xl mb-0.5 group-hover:scale-110 transition-transform">
                      {treat.icon}
                    </span>
                    <span className="text-[11px] font-black text-gray-800 text-center truncate w-full">
                      {treat.name}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* TAB CONTENT 2: DRESS UP */}
            {activeTab === 'dress' && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 w-full max-w-md">
                {accessories.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => handleSelectAccessory(acc.id, acc.name)}
                    className={`flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition active:scale-90 cursor-pointer ${
                      accessory === acc.id
                        ? 'bg-pink-100 border-pink-500 text-pink-700 shadow-sm ring-2 ring-pink-300'
                        : 'bg-white border-amber-200 text-gray-800 hover:bg-amber-50'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl mb-0.5">{acc.icon}</span>
                    <span className="text-[11px] font-black text-center leading-tight truncate w-full">
                      {acc.name}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* TAB CONTENT 3: CARE & GROOMING */}
            {activeTab === 'care' && (
              <div className="flex flex-wrap items-center justify-center gap-2 w-full max-w-md">
                <button
                  onClick={handleBrush}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-amber-50 active:scale-95 border-2 border-amber-300 rounded-2xl shadow-xs text-gray-800 font-black text-xs cursor-pointer"
                >
                  <span className="text-xl">🪮</span>
                  <span>Причесати щіточкою</span>
                </button>

                <button
                  onClick={handleGiveWater}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-sky-50 active:scale-95 border-2 border-sky-300 rounded-2xl shadow-xs text-gray-800 font-black text-xs cursor-pointer"
                >
                  <span className="text-xl">💧</span>
                  <span>Чиста водичка</span>
                </button>

                <button
                  onClick={() => {
                    audio.playGuineaPigSqueak();
                    audio.speakUkrainian('Ві-ві-ві! Кавуся щасливо стрибає в тирсі!', 'nicole');
                    setMood('happy');
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-rose-50 active:scale-95 border-2 border-rose-300 rounded-2xl shadow-xs text-gray-800 font-black text-xs cursor-pointer"
                >
                  <span className="text-xl">🎵</span>
                  <span>Послухати «ві-ві-ві!»</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

