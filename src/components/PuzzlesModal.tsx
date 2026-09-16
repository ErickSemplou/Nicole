import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { X, Sparkles, Star, Puzzle, RotateCcw, Eye, Wand2, ChevronLeft, ChevronRight, Volume2, ArrowRight } from 'lucide-react';
import { PUZZLES_DATA, PuzzleItem } from '../data/puzzlesData';
import { audio } from '../utils/audio';

interface PuzzlesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPuzzleCompleted: (puzzleId: string, starsReward: number) => void;
  completedPuzzles: string[];
}

export const PuzzlesModal: React.FC<PuzzlesModalProps> = ({
  isOpen,
  onClose,
  onPuzzleCompleted,
  completedPuzzles,
}) => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState<number>(0);
  const [gridSize, setGridSize] = useState<2 | 3>(2); // 2x2 by default for 4yo
  const [pieces, setPieces] = useState<number[]>([]);
  const [selectedPieceIndex, setSelectedPieceIndex] = useState<number | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isSolved, setIsSolved] = useState<boolean>(false);

  const selectedPuzzle = PUZZLES_DATA[currentPuzzleIndex] || PUZZLES_DATA[0];

  // Shuffle pieces guaranteeing not immediately solved
  const shufflePieces = (size: number = gridSize) => {
    const total = size * size;
    const arr = Array.from({ length: total }, (_, i) => i);
    let shuffled = [...arr];

    // Simple robust shuffle
    do {
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
    } while (shuffled.every((val, index) => val === index) && shuffled.length > 1);

    setPieces(shuffled);
    setSelectedPieceIndex(null);
    setIsSolved(false);
  };

  // Reset when puzzle or grid size changes or modal opens
  useEffect(() => {
    if (isOpen) {
      shufflePieces(gridSize);
      audio.speakUkrainian(`Збираємо картинку: ${selectedPuzzle.title}!`, 'nicole');
    }
  }, [currentPuzzleIndex, gridSize, isOpen]);

  if (!isOpen) return null;

  // Check victory condition
  const checkVictory = (currentPieces: number[]) => {
    const won = currentPieces.every((val, idx) => val === idx);
    if (won) {
      setIsSolved(true);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      audio.playCelebrationFanfare();
      audio.speakUkrainian('Ура! Ти чудово склала пазл, Ніколь! Ти справжня розумниця!', 'nicole');
      const reward = gridSize === 2 ? 2 : 4;
      onPuzzleCompleted(selectedPuzzle.id, reward);
    }
  };

  // Handle tile click to swap
  const handlePieceClick = (index: number) => {
    if (isSolved) return;

    if (selectedPieceIndex === null) {
      audio.playPop(1.2);
      setSelectedPieceIndex(index);
    } else if (selectedPieceIndex === index) {
      audio.playPop(0.9);
      setSelectedPieceIndex(null);
    } else {
      audio.playSparkle();
      // Swap pieces
      const newPieces = [...pieces];
      const temp = newPieces[selectedPieceIndex];
      newPieces[selectedPieceIndex] = newPieces[index];
      newPieces[index] = temp;

      setPieces(newPieces);
      setSelectedPieceIndex(null);
      checkVictory(newPieces);
    }
  };

  // Helper magic wand: auto-place 1 misplaced piece for child friendly play
  const handleMagicHelper = () => {
    if (isSolved) return;
    audio.playSparkle();

    // Find first misplaced piece
    const misplacedIndex = pieces.findIndex((val, idx) => val !== idx);
    if (misplacedIndex !== -1) {
      const correctPieceValue = misplacedIndex;
      const currentPosOfCorrectPiece = pieces.findIndex((val) => val === correctPieceValue);
      if (currentPosOfCorrectPiece !== -1) {
        const newPieces = [...pieces];
        newPieces[currentPosOfCorrectPiece] = newPieces[misplacedIndex];
        newPieces[misplacedIndex] = correctPieceValue;
        setPieces(newPieces);
        setSelectedPieceIndex(null);
        audio.speakUkrainian('Ось так! Чарівна паличка допомогла!', 'nicole');
        checkVictory(newPieces);
      }
    }
  };

  const handlePrevPuzzle = () => {
    audio.playPop();
    const prev = (currentPuzzleIndex - 1 + PUZZLES_DATA.length) % PUZZLES_DATA.length;
    setCurrentPuzzleIndex(prev);
    setIsSolved(false);
  };

  const handleNextPuzzle = () => {
    audio.playPop();
    const next = (currentPuzzleIndex + 1) % PUZZLES_DATA.length;
    setCurrentPuzzleIndex(next);
    setIsSolved(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.88, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.88, opacity: 0, y: 15 }}
          className="relative w-full max-w-xl max-h-[96vh] rounded-3xl sm:rounded-[36px] bg-gradient-to-b from-indigo-100 via-pink-50 to-amber-50 border-4 border-indigo-300 shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-between border-b-2 border-indigo-300 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/20 flex items-center justify-center border-2 border-white/40 shadow-inner shrink-0">
                <Puzzle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-200" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base sm:text-lg font-black truncate">
                    Міні-пазли для Ніколь 🧩
                  </h2>
                  <button
                    onClick={() => audio.speakUkrainian(`Збираємо картинку: ${selectedPuzzle.title}!`, 'nicole')}
                    className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-yellow-200 transition cursor-pointer shrink-0"
                    title="Послухати"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] font-bold text-indigo-100 truncate">
                  Зібрано {completedPuzzles.length} з {PUZZLES_DATA.length} картинок ⭐
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

          {/* Picture Selector (Prev / Next with big friendly buttons and image thumbnail) */}
          <div className="px-3 py-2 bg-white/80 border-b border-indigo-100 flex items-center justify-between gap-2 shrink-0">
            <button
              onClick={handlePrevPuzzle}
              className="px-3 py-1.5 rounded-2xl bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-black text-xs transition flex items-center gap-1 active:scale-95 cursor-pointer shrink-0"
              title="Попередня картинка"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden xs:inline">Назад</span>
            </button>

            <div className="flex items-center gap-2 min-w-0 text-center">
              <span className="text-2xl shrink-0">{selectedPuzzle.emoji}</span>
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-black text-gray-800 truncate block">
                  {selectedPuzzle.title}
                </span>
                <span className="text-[10px] font-bold text-pink-600 truncate block">
                  {selectedPuzzle.storyTitle}
                </span>
              </div>
              {completedPuzzles.includes(selectedPuzzle.id) && (
                <span className="text-sm shrink-0" title="Вже зібрано!">⭐</span>
              )}
            </div>

            <button
              onClick={handleNextPuzzle}
              className="px-3 py-1.5 rounded-2xl bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-black text-xs transition flex items-center gap-1 active:scale-95 cursor-pointer shrink-0"
              title="Наступна картинка"
            >
              <span className="hidden xs:inline">Далі</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Main Puzzle Area */}
          <div className="flex-1 p-2.5 sm:p-4 flex flex-col items-center justify-between overflow-y-auto">
            {/* Top Toolbar: Difficulty + Hint + Wand */}
            <div className="w-full max-w-sm flex items-center justify-between gap-1.5 mb-2 shrink-0">
              {/* Difficulty selector (4 pcs vs 9 pcs) */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-indigo-200 shadow-xs">
                <button
                  onClick={() => {
                    audio.playPop();
                    setGridSize(2);
                  }}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                    gridSize === 2
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>🟢 4 шт (2×2)</span>
                </button>
                <button
                  onClick={() => {
                    audio.playPop();
                    setGridSize(3);
                  }}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                    gridSize === 3
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>🔵 9 шт (3×3)</span>
                </button>
              </div>

              {/* Action Buttons: Hint, Wand, Reset */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    audio.playPop();
                    setShowHint(!showHint);
                    if (!showHint) {
                      audio.speakUkrainian('Ось підказка! Знайди потрібний шматочок!', 'nicole');
                    }
                  }}
                  className={`p-2 rounded-2xl text-xs font-black flex items-center gap-1 transition cursor-pointer border ${
                    showHint
                      ? 'bg-amber-400 border-amber-300 text-amber-950 shadow-xs ring-2 ring-amber-300'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                  title="Підказка (показати малюнок)"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  onClick={handleMagicHelper}
                  className="p-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xs hover:brightness-110 active:scale-95 transition border border-purple-200 cursor-pointer"
                  title="Чарівна допомога (поставити 1 шматочок)"
                >
                  <Wand2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    audio.playSparkle();
                    shufflePieces(gridSize);
                  }}
                  className="p-2 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 transition cursor-pointer"
                  title="Перемішати знову"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* PUZZLE BOARD CONTAINER */}
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[350px] aspect-square rounded-3xl overflow-hidden border-4 border-indigo-400 bg-indigo-950 shadow-xl select-none my-auto">
              {/* Background Ghost for Hint */}
              {showHint && (
                <img
                  src={selectedPuzzle.image}
                  alt={selectedPuzzle.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-45 pointer-events-none z-0"
                />
              )}

              {/* Puzzle Grid */}
              <div
                className="relative z-10 w-full h-full grid gap-1.5 p-1.5"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
                }}
              >
                {pieces.map((pieceId, index) => {
                  const row = Math.floor(pieceId / gridSize);
                  const col = pieceId % gridSize;
                  const isSelected = selectedPieceIndex === index;
                  const isCorrect = pieceId === index;

                  // CSS background positioning percentages
                  const bgPosX = gridSize === 2 ? col * 100 : (col / (gridSize - 1)) * 100;
                  const bgPosY = gridSize === 2 ? row * 100 : (row / (gridSize - 1)) * 100;

                  return (
                    <motion.div
                      key={`${selectedPuzzle.id}-${pieceId}-${index}`}
                      whileHover={!isSolved ? { scale: 1.03 } : {}}
                      whileTap={!isSolved ? { scale: 0.95 } : {}}
                      onClick={() => handlePieceClick(index)}
                      className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-yellow-400 ring-4 ring-yellow-300 z-20 scale-105 shadow-2xl'
                          : isSolved
                          ? 'border-emerald-400 shadow-md'
                          : isCorrect
                          ? 'border-white/80 shadow-xs'
                          : 'border-indigo-200/50 hover:border-yellow-300'
                      }`}
                      style={{
                        backgroundImage: `url(${selectedPuzzle.image})`,
                        backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                        backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                        backgroundColor: '#6366f1',
                      }}
                    >
                      {/* Visual Helper Numbers when Hint is Enabled */}
                      {showHint && (
                        <span className="absolute top-1 left-1.5 w-6 h-6 rounded-full bg-black/60 text-white font-black text-xs flex items-center justify-center border border-white/60 shadow-xs">
                          {pieceId + 1}
                        </span>
                      )}

                      {/* Selected Highlight Overlay */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-yellow-300/35 border-2 border-yellow-400 flex items-center justify-center animate-pulse">
                          <Sparkles className="w-8 h-8 text-yellow-300 drop-shadow-md" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Solved Celebration Overlay */}
              <AnimatePresence>
                {isSolved && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center z-30"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-5xl sm:text-6xl mb-2"
                    >
                      🏆
                    </motion.div>

                    <h3 className="text-xl sm:text-2xl font-black text-yellow-300 drop-shadow-md mb-1">
                      Пазл зібрано! Молодець! ✨
                    </h3>

                    <p className="text-xs sm:text-sm font-bold text-pink-100 mb-4">
                      +{gridSize === 2 ? '2' : '4'} золоті зірочки додано! ⭐
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => shufflePieces(gridSize)}
                        className="px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-2xl font-black text-xs transition flex items-center gap-1 border border-white/40 cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" /> Ще раз
                      </button>

                      <button
                        onClick={handleNextPuzzle}
                        className="px-4 py-2.5 bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 hover:brightness-110 active:scale-95 text-white rounded-2xl font-black text-xs sm:text-sm transition flex items-center gap-1.5 shadow-lg cursor-pointer"
                      >
                        <span>Наступний пазл</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Child-Friendly Hint */}
            <div className="mt-2 flex items-center justify-center gap-2 text-center text-xs font-bold text-gray-600 bg-white/70 px-4 py-1 rounded-full border border-pink-200 shrink-0">
              <span>👉 Натискай на шматочки, щоб міняти їх місцями!</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
