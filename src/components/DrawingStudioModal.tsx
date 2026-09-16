import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { X, Sparkles, Undo2, Trash2, Download, Palette, Heart, Check } from 'lucide-react';
import { audio } from '../utils/audio';

interface DrawingStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardSticker?: (name: string) => void;
}

export const DrawingStudioModal: React.FC<DrawingStudioModalProps> = ({
  isOpen,
  onClose,
  onRewardSticker,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState<string>('#ec4899');
  const [isRainbow, setIsRainbow] = useState<boolean>(false);
  const [rainbowHue, setRainbowHue] = useState<number>(0);
  const [lineWidth, setLineWidth] = useState<number>(10);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'stamp'>('brush');
  const [selectedStamp, setSelectedStamp] = useState<string>('🌸');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<number>(0);

  // Template outlines
  const templates = [
    { id: 0, title: 'Чисте полотно', icon: '🎨' },
    { id: 1, title: 'Свинка Кавуся', icon: '🐹' },
    { id: 2, title: 'Принцеса Ніколь', icon: '👑' },
    { id: 3, title: 'Веселий метелик', icon: '🦋' },
    { id: 4, title: 'Святковий торт', icon: '🎂' },
    { id: 5, title: 'Сонечко та веселка', icon: '🌈' },
  ];

  const colors = [
    '#ec4899', // pink
    '#f43f5e', // rose
    '#ef4444', // red
    '#f97316', // orange
    '#eab308', // yellow
    '#22c55e', // green
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#a855f7', // purple
    '#92400e', // brown
    '#1f2937', // charcoal
    '#ffffff', // white
  ];

  const stamps = ['🐹', '🌸', '⭐', '💖', '🦋', '🌈', '☀️', '🍓', '🍦', '👑'];

  // Initialize canvas
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high resolution canvas dimensions
    canvas.width = 800;
    canvas.height = 550;

    // Fill initial white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    loadTemplate(selectedTemplate, ctx, canvas);
  }, [isOpen]);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => [...prev.slice(-10), data]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    audio.playPop();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lastState = history[history.length - 1];
    ctx.putImageData(lastState, 0, 0);
    setHistory(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    audio.playWaterSplash();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    saveToHistory();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (selectedTemplate !== 0) {
      drawTemplateOutline(selectedTemplate, ctx, canvas);
    }
  };

  const loadTemplate = (id: number, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (id !== 0) {
      drawTemplateOutline(id, ctx, canvas);
    }
    setHistory([]);
  };

  const drawTemplateOutline = (id: number, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.save();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (id === 1) {
      // Guinea Pig Outline
      ctx.beginPath();
      // Body
      ctx.ellipse(400, 300, 160, 120, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Head
      ctx.beginPath();
      ctx.ellipse(300, 260, 90, 80, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Ears
      ctx.beginPath();
      ctx.ellipse(250, 200, 25, 20, -0.3, 0, Math.PI * 2);
      ctx.ellipse(350, 200, 25, 20, 0.3, 0, Math.PI * 2);
      ctx.stroke();
      // Carrot outline
      ctx.beginPath();
      ctx.moveTo(330, 330);
      ctx.lineTo(440, 370);
      ctx.lineTo(430, 320);
      ctx.closePath();
      ctx.stroke();
    } else if (id === 2) {
      // Princess Nicole Outline
      ctx.beginPath();
      // Head
      ctx.arc(400, 220, 80, 0, Math.PI * 2);
      ctx.stroke();
      // Crown
      ctx.beginPath();
      ctx.moveTo(340, 150);
      ctx.lineTo(360, 90);
      ctx.lineTo(400, 130);
      ctx.lineTo(440, 90);
      ctx.lineTo(460, 150);
      ctx.closePath();
      ctx.stroke();
      // Dress
      ctx.beginPath();
      ctx.moveTo(350, 300);
      ctx.lineTo(250, 500);
      ctx.lineTo(550, 500);
      ctx.lineTo(450, 300);
      ctx.closePath();
      ctx.stroke();
    } else if (id === 3) {
      // Butterfly Outline
      ctx.beginPath();
      // Body
      ctx.ellipse(400, 280, 20, 90, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Top Wings
      ctx.beginPath();
      ctx.ellipse(280, 220, 110, 80, -0.3, 0, Math.PI * 2);
      ctx.ellipse(520, 220, 110, 80, 0.3, 0, Math.PI * 2);
      ctx.stroke();
      // Bottom Wings
      ctx.beginPath();
      ctx.ellipse(310, 350, 80, 60, 0.2, 0, Math.PI * 2);
      ctx.ellipse(490, 350, 80, 60, -0.2, 0, Math.PI * 2);
      ctx.stroke();
    } else if (id === 4) {
      // Birthday Cake Outline
      ctx.beginPath();
      // Bottom layer
      ctx.rect(260, 360, 280, 110);
      // Top layer
      ctx.rect(310, 250, 180, 110);
      ctx.stroke();
      // Candles
      for (let i = 0; i < 4; i++) {
        const cx = 335 + i * 42;
        ctx.strokeRect(cx, 190, 14, 60);
        ctx.beginPath();
        ctx.ellipse(cx + 7, 175, 7, 12, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (id === 5) {
      // Sun & Rainbow Outline
      // Sun
      ctx.beginPath();
      ctx.arc(200, 180, 70, 0, Math.PI * 2);
      ctx.stroke();
      // Rainbow arches
      for (let r = 240; r <= 360; r += 30) {
        ctx.beginPath();
        ctx.arc(520, 480, r, Math.PI, Math.PI * 1.6);
        ctx.stroke();
      }
    }
    ctx.restore();
  };

  // Coordinate helper
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  // Start Drawing
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    saveToHistory();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);

    if (tool === 'stamp') {
      audio.playPop(1.2);
      ctx.font = `${lineWidth * 3.5 + 24}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedStamp, x, y);
      return;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  // Move Drawing
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || tool === 'stamp') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
    } else if (isRainbow) {
      const newHue = (rainbowHue + 4) % 360;
      setRainbowHue(newHue);
      ctx.strokeStyle = `hsl(${newHue}, 90%, 60%)`;
    } else {
      ctx.strokeStyle = color;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // Stop Drawing
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Save / Share Masterpiece
  const handleSaveMasterpiece = () => {
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    audio.playFanfare();
    audio.speakUkrainian('Ура! Який неймовірний шедевр намалювала Ніколь! Справжня художниця!', 'nicole');

    if (onRewardSticker) {
      onRewardSticker('Творчий шедевр Ніколь 🎨');
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const link = document.createElement('a');
      link.download = 'malyunok-nikol.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-5xl max-h-[96vh] overflow-hidden rounded-3xl bg-gradient-to-b from-purple-50 via-pink-50 to-amber-50 border-4 border-pink-300 shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="p-3 sm:p-4 bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 border-b-2 border-pink-300 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white text-purple-600 flex items-center justify-center shadow-md text-2xl">
                🎨
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-black drop-shadow-xs leading-tight">
                  Малювалка Ніколь
                </h2>
                <p className="text-xs sm:text-sm font-bold text-pink-100">
                  Вільне малювання, яскраві кольори, штампики та розмальовки
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveMasterpiece}
                className="flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md border-2 border-emerald-200 transition cursor-pointer"
                title="Зберегти малюнок та показати мамі"
              >
                <Download className="w-4 h-4" />
                <span>Зберегти!</span>
              </button>

              <button
                onClick={() => {
                  audio.playPop();
                  onClose();
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/80 hover:bg-white text-gray-700 flex items-center justify-center active:scale-90 transition shadow-sm cursor-pointer"
                title="Закрити"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="bg-white/90 border-b border-pink-200 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
            {/* Template selector */}
            <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full">
              <span className="font-bold text-gray-500 shrink-0 mr-1 hidden sm:inline">Тема:</span>
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => {
                    audio.playPop();
                    setSelectedTemplate(tpl.id);
                    const canvas = canvasRef.current;
                    if (canvas) {
                      const ctx = canvas.getContext('2d');
                      if (ctx) loadTemplate(tpl.id, ctx, canvas);
                    }
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-black text-xs shrink-0 transition cursor-pointer ${
                    selectedTemplate === tpl.id
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                  }`}
                >
                  <span>{tpl.icon}</span>
                  <span>{tpl.title}</span>
                </button>
              ))}
            </div>

            {/* Undo & Clear */}
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                onClick={handleUndo}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 rounded-xl font-bold transition cursor-pointer"
                title="Скасувати штрих"
              >
                <Undo2 className="w-4 h-4" />
                <span className="hidden sm:inline">Назад</span>
              </button>

              <button
                onClick={handleClear}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 active:scale-95 text-rose-700 rounded-xl font-bold transition cursor-pointer"
                title="Очистити все"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Очистити</span>
              </button>
            </div>
          </div>

          {/* Main Drawing Canvas Area */}
          <div className="flex-1 overflow-hidden p-2 sm:p-4 flex flex-col items-center justify-center bg-gray-100/60">
            <div className="relative w-full max-w-4xl h-[48vh] sm:h-[54vh] bg-white rounded-2xl shadow-lg border-3 border-pink-200 overflow-hidden touch-none flex items-center justify-center">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-full object-contain cursor-crosshair"
              />
            </div>
          </div>

          {/* Bottom Toolbar: Color Palette, Brush Size & Stamps */}
          <div className="p-3 bg-white border-t border-pink-200 flex flex-col gap-2.5">
            {/* Tools & Colors */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Tool Mode selector */}
              <div className="flex items-center gap-1 bg-pink-50 p-1 rounded-2xl border border-pink-200">
                <button
                  onClick={() => {
                    audio.playPop();
                    setTool('brush');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center gap-1 cursor-pointer ${
                    tool === 'brush'
                      ? 'bg-pink-500 text-white shadow-xs'
                      : 'text-gray-700 hover:bg-pink-100'
                  }`}
                >
                  <span>🖌️</span>
                  <span>Пензлик</span>
                </button>

                <button
                  onClick={() => {
                    audio.playPop();
                    setTool('stamp');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center gap-1 cursor-pointer ${
                    tool === 'stamp'
                      ? 'bg-pink-500 text-white shadow-xs'
                      : 'text-gray-700 hover:bg-pink-100'
                  }`}
                >
                  <span>⭐</span>
                  <span>Штампик</span>
                </button>

                <button
                  onClick={() => {
                    audio.playPop();
                    setTool('eraser');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center gap-1 cursor-pointer ${
                    tool === 'eraser'
                      ? 'bg-pink-500 text-white shadow-xs'
                      : 'text-gray-700 hover:bg-pink-100'
                  }`}
                >
                  <span>🧽</span>
                  <span>Ластик</span>
                </button>
              </div>

              {/* Brush Thickness */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 hidden sm:inline">Розмір:</span>
                {[
                  { w: 5, label: 'Тонкий', sizeClass: 'w-3 h-3' },
                  { w: 12, label: 'Середній', sizeClass: 'w-5 h-5' },
                  { w: 24, label: 'Товстий', sizeClass: 'w-7 h-7' },
                ].map((s) => (
                  <button
                    key={s.w}
                    onClick={() => {
                      audio.playPop();
                      setLineWidth(s.w);
                    }}
                    className={`p-1.5 rounded-xl border-2 flex items-center justify-center transition cursor-pointer ${
                      lineWidth === s.w
                        ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-200'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    title={s.label}
                  >
                    <div
                      className={`rounded-full bg-gray-800 ${s.sizeClass}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Colors Palette or Stamp Palette */}
            {tool !== 'stamp' ? (
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1">
                {/* Rainbow magic color button */}
                <button
                  onClick={() => {
                    audio.playSparkle();
                    setIsRainbow(!isRainbow);
                    setTool('brush');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 text-white shadow-xs transition shrink-0 cursor-pointer ${
                    isRainbow
                      ? 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500 ring-2 ring-purple-400 scale-105'
                      : 'bg-gradient-to-r from-red-400 via-yellow-400 to-purple-400 opacity-80'
                  }`}
                >
                  <span>🌈</span>
                  <span>Веселка</span>
                </button>

                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      audio.playPop(1.4);
                      setColor(c);
                      setIsRainbow(false);
                      setTool('brush');
                    }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition transform active:scale-90 shrink-0 cursor-pointer ${
                      color === c && !isRainbow
                        ? 'ring-3 ring-pink-500 scale-110 border-white shadow-md'
                        : 'border-gray-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            ) : (
              /* Stamp icons palette */
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                <span className="text-xs font-bold text-gray-500 shrink-0 mr-1">Штампи:</span>
                {stamps.map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      audio.playPop(1.5);
                      setSelectedStamp(st);
                    }}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-xl transition active:scale-90 shrink-0 cursor-pointer ${
                      selectedStamp === st
                        ? 'bg-pink-200 border-2 border-pink-500 scale-110 shadow-sm'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
