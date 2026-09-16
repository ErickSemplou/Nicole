import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Star, ShoppingBag, Check, Heart, Wand2, Shirt, Sparkle, Gift, Trophy, Volume2 } from 'lucide-react';
import { SHOP_ITEMS, ShopItem, ShopCategory } from '../data/shopItems';
import { NicoleAppearance, OutfitId, AccessoryId, ShoeId, KavusiaAccessory } from '../types';
import { NicoleAvatar } from './NicoleAvatar';
import { KavusiaAvatar } from './KavusiaAvatar';
import { audio } from '../utils/audio';

interface StarShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  starsCount: number;
  purchasedItems: string[];
  currentAppearance: NicoleAppearance;
  kavusiaAccessory?: KavusiaAccessory;
  onPurchaseItem: (item: ShopItem) => void;
  onEquipOutfit: (outfitId: OutfitId) => void;
  onEquipAccessory: (accessoryId: AccessoryId) => void;
  onEquipShoe?: (shoeId: ShoeId) => void;
  onEquipKavusiaAccessory?: (acc: KavusiaAccessory) => void;
  onFeedPet?: (petName: string, treatName: string) => void;
}

export const StarShopModal: React.FC<StarShopModalProps> = ({
  isOpen,
  onClose,
  starsCount,
  purchasedItems,
  currentAppearance,
  kavusiaAccessory = 'bow',
  onPurchaseItem,
  onEquipOutfit,
  onEquipAccessory,
  onEquipShoe,
  onEquipKavusiaAccessory,
  onFeedPet,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory | 'all'>('all');
  const [interactiveMessage, setInteractiveMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories: { id: ShopCategory | 'all'; name: string; emoji: string }[] = [
    { id: 'all', name: 'Все', emoji: '🌟' },
    { id: 'outfits', name: 'Вбрання', emoji: '👗' },
    { id: 'shoes', name: 'Взуття', emoji: '🩰' },
    { id: 'accessories', name: 'Аксесуари', emoji: '🎀' },
    { id: 'pets', name: 'Для Кавусі', emoji: '🐹' },
    { id: 'toys', name: 'Іграшки', emoji: '🪄' },
  ];

  const filteredItems = SHOP_ITEMS.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  const handleBuy = (item: ShopItem) => {
    if (starsCount < item.price) {
      audio.playPop(0.8);
      audio.speakUkrainian('Зіграй у міні-ігри або пройди пригоду, щоб назбирати більше зірочок!', 'nicole');
      return;
    }
    audio.playSparkle();
    audio.speakUkrainian(`Ура! Ти придбала ${item.name}!`, 'nicole');
    onPurchaseItem(item);

    // Auto-equip upon purchase for instant visual feedback
    if (item.outfitId) {
      onEquipOutfit(item.outfitId);
    } else if (item.shoeId && onEquipShoe) {
      onEquipShoe(item.shoeId);
    } else if (item.accessoryId) {
      onEquipAccessory(item.accessoryId);
    } else if (item.kavusiaAccessoryId && onEquipKavusiaAccessory) {
      onEquipKavusiaAccessory(item.kavusiaAccessoryId);
    }
  };

  const handleInteract = (item: ShopItem) => {
    audio.playSparkle();

    if (item.outfitId) {
      onEquipOutfit(item.outfitId);
      audio.speakUkrainian(`Ніколь одягла ${item.name}! Яка краса!`, 'nicole');
      setInteractiveMessage(`✨ Одягнено: ${item.name}!`);
    } else if (item.shoeId && onEquipShoe) {
      onEquipShoe(item.shoeId);
      audio.speakUkrainian(`Приміряли чудове взуття: ${item.name}!`, 'nicole');
      setInteractiveMessage(`🩰 Взуто: ${item.name}!`);
    } else if (item.accessoryId) {
      onEquipAccessory(item.accessoryId);
      audio.speakUkrainian(`Чудовий аксесуар: ${item.name}!`, 'nicole');
      setInteractiveMessage(`🎀 Прикрашено: ${item.name}!`);
    } else if (item.kavusiaAccessoryId && onEquipKavusiaAccessory) {
      onEquipKavusiaAccessory(item.kavusiaAccessoryId);
      audio.playGuineaPigSqueak();
      audio.speakUkrainian(`Кавуся приміряла: ${item.name}! Вона дуже щаслива!`, 'nicole');
      setInteractiveMessage(`🐹 Кавуся одягла: ${item.name}!`);
    } else if (item.category === 'pets') {
      const petName = item.petTarget === 'knopka' ? 'собачки Кнопки' : 'свинки Кавусі';
      audio.speakUkrainian(`Смаколик для ${petName}! Ням-ням!`, 'nicole');
      if (item.petTarget === 'kavusia') {
        audio.playGuineaPigSqueak();
      } else {
        audio.playDogBark();
      }
      setInteractiveMessage(`💖 Порадували улюбленця: ${item.name}!`);
      if (onFeedPet) onFeedPet(petName, item.name);
    } else {
      // Magic Toys
      audio.playCelebrationFanfare();
      audio.speakUkrainian(`Магічна іграшка ${item.name} активована!`, 'nicole');
      setInteractiveMessage(`🎉 ${item.interactiveAction || 'Магія засяяла!'} ✨`);
    }

    setTimeout(() => {
      setInteractiveMessage(null);
    }, 3000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.88, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.88, opacity: 0, y: 15 }}
          className="relative w-full max-w-5xl max-h-[94vh] overflow-hidden rounded-3xl bg-gradient-to-b from-amber-50 via-rose-50 to-pink-50 border-4 border-amber-300 shadow-2xl flex flex-col"
        >
          {/* Header Banner */}
          <div className="p-3 sm:p-4 bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 border-b-2 border-amber-300 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border-2 border-white/40 shadow-inner shrink-0">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-200" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-2xl font-black drop-shadow-sm truncate">
                  Зоряна Крамничка Ніколь 🛍️
                </h2>
                <div className="flex items-center gap-2 text-xs font-bold text-yellow-100 flex-wrap">
                  <span className="flex items-center gap-1 bg-black/25 px-2.5 py-0.5 rounded-full font-black text-amber-200 border border-amber-300/40">
                    <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300 animate-pulse" />
                    {starsCount} ⭐
                  </span>
                  <span className="hidden xs:inline">•</span>
                  <span className="truncate">Придбано {purchasedItems.length} з {SHOP_ITEMS.length}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                audio.playPop();
                onClose();
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center active:scale-90 transition border border-white/40 cursor-pointer shrink-0 ml-2"
              title="Закрити крамничку"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Toast interaction alert */}
          <AnimatePresence>
            {interactiveMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs sm:text-sm px-4 py-1.5 text-center shadow-md flex items-center justify-center gap-2 shrink-0"
              >
                <Sparkles className="w-4 h-4 text-yellow-200 fill-yellow-200" />
                <span>{interactiveMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Filter Chips */}
          <div className="p-2 sm:p-2.5 bg-white/85 border-b border-amber-200 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    audio.playPop();
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                      : 'bg-amber-100/70 text-gray-700 hover:bg-amber-200/70'
                  }`}
                >
                  <span className="text-sm sm:text-base leading-none">{cat.emoji}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Main Content Area: Left = Live Visual Avatar Mirror, Right = Items Grid */}
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row min-h-0">
            {/* Live Visual Avatar Mirror (Nicole + Kavusia) */}
            <div className="p-3 bg-gradient-to-b from-pink-100/80 to-amber-100/80 border-b md:border-b-0 md:border-r border-amber-200 flex md:flex-col items-center justify-around md:justify-center gap-2 md:w-60 lg:w-72 shrink-0 shadow-inner">
              <div className="text-center">
                <div className="inline-flex items-center gap-1 bg-white/80 px-2.5 py-0.5 rounded-full border border-pink-300 shadow-xs mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                  <span className="text-[11px] sm:text-xs font-black text-pink-700">Дзеркало примірки ✨</span>
                </div>
              </div>

              {/* Characters Preview: Nicole Full Body + Kavusia */}
              <div className="flex items-center justify-center gap-3">
                {/* Nicole Full Body */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-24 h-40 sm:w-28 sm:h-48 md:w-36 md:h-56 relative flex items-center justify-center bg-white/70 rounded-3xl p-1 shadow-md border-2 border-pink-300"
                >
                  <NicoleAvatar
                    appearance={currentAppearance}
                    mode="full"
                    className="w-full h-full object-contain"
                  />
                </motion.div>

                {/* Kavusia Pet Avatar */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="w-20 h-24 sm:w-24 sm:h-28 md:w-28 md:h-32 relative flex flex-col items-center justify-center bg-amber-100/80 rounded-3xl p-1 shadow-md border-2 border-amber-300"
                >
                  <KavusiaAvatar
                    mood="happy"
                    accessory={kavusiaAccessory}
                    className="w-full h-full object-contain"
                  />
                  <span className="text-[10px] font-black text-amber-900 bg-white/80 px-1.5 py-0.5 rounded-full">
                    Кавуся 🐹
                  </span>
                </motion.div>
              </div>

              <div className="hidden md:block text-center text-[11px] font-bold text-gray-600 bg-white/60 p-2 rounded-2xl border border-pink-200 max-w-[220px]">
                💡 Натискай «Одягти», щоб миттєво побачити зміни на Ніколь та Кавусі!
              </div>
            </div>

            {/* Shop Items Grid */}
            <div className="p-3 sm:p-4 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
              {filteredItems.map((item) => {
                const isBought = purchasedItems.includes(item.id);
                const canAfford = starsCount >= item.price;
                const isEquipped =
                  (item.outfitId && currentAppearance.outfit === item.outfitId) ||
                  (item.shoeId && currentAppearance.shoes === item.shoeId) ||
                  (item.accessoryId && currentAppearance.accessory === item.accessoryId) ||
                  (item.kavusiaAccessoryId && kavusiaAccessory === item.kavusiaAccessoryId);

                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    className={`rounded-2xl border-2 p-2.5 sm:p-3 flex flex-col justify-between transition relative ${
                      isBought
                        ? 'bg-white border-amber-300 shadow-sm'
                        : canAfford
                        ? 'bg-white border-pink-200 hover:border-pink-400 shadow-xs'
                        : 'bg-white/60 border-gray-200 opacity-80'
                    }`}
                  >
                    {/* Top Item Row */}
                    <div>
                      <div className="flex items-start justify-between gap-1.5 mb-1.5">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-100 via-rose-50 to-pink-100 border border-amber-200 flex items-center justify-center text-2xl sm:text-3xl shadow-inner shrink-0">
                          {item.emoji}
                        </div>

                        <div className="text-right">
                          {isBought ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3" /> Придбано
                            </span>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded-full ${
                                canAfford
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-500" />
                              {item.price} ⭐
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h3 className="font-black text-xs sm:text-sm text-gray-900 leading-tight truncate">
                          {item.name}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            audio.speakUkrainian(`${item.name}. ${item.description}`, 'nicole');
                          }}
                          className="p-1 rounded-full text-pink-500 hover:bg-pink-100 transition shrink-0"
                          title="Послухати опис"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] font-bold text-gray-500 leading-snug mb-2 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom Action Button */}
                    <div>
                      {isBought ? (
                        <button
                          onClick={() => handleInteract(item)}
                          className={`w-full py-1.5 sm:py-2 px-3 rounded-xl font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95 ${
                            isEquipped
                              ? 'bg-emerald-500 text-white'
                              : item.category === 'outfits' || item.category === 'shoes' || item.category === 'accessories'
                              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600'
                              : item.category === 'pets'
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                              : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600'
                          }`}
                        >
                          {isEquipped ? (
                            <>
                              <Sparkles className="w-3.5 h-3.5" /> Одягнено ✨
                            </>
                          ) : item.category === 'outfits' || item.category === 'shoes' || item.category === 'accessories' ? (
                            <>
                              <Shirt className="w-3.5 h-3.5" /> Одягти зараз
                            </>
                          ) : item.category === 'pets' ? (
                            <>
                              <Heart className="w-3.5 h-3.5 fill-white" /> {item.kavusiaAccessoryId ? 'Одягти на свинку' : 'Порадувати'}
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-3.5 h-3.5" /> Грати
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBuy(item)}
                          disabled={!canAfford}
                          className={`w-full py-1.5 sm:py-2 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 shadow-sm ${
                            canAfford
                              ? 'bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white active:scale-95 cursor-pointer'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{canAfford ? `Купити за ${item.price} ⭐` : `Потрібно ${item.price} ⭐`}</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Footer bar */}
          <div className="p-2.5 sm:p-3 bg-white/90 border-t border-amber-200 flex items-center justify-between flex-wrap gap-2 shrink-0">
            <p className="text-xs font-bold text-pink-800">
              💡 Заробляй зірочки в 4 історіях та пазлах, щоб зібрати всю колекцію!
            </p>
            <button
              onClick={() => {
                audio.playPop();
                onClose();
              }}
              className="px-4 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-xs sm:text-sm rounded-xl transition cursor-pointer shadow-sm ml-auto"
            >
              Закрити
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
