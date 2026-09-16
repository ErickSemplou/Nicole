import React from 'react';
import { motion } from 'motion/react';

export type GrandmaMood = 'happy' | 'proud' | 'baking' | 'waving' | 'smiling';

interface GrandmaAvatarProps {
  mood?: GrandmaMood;
  className?: string;
  isAnimated?: boolean;
}

export const GrandmaAvatar: React.FC<GrandmaAvatarProps> = ({
  mood = 'happy',
  className = 'w-full h-full',
  isAnimated = true,
}) => {
  return (
    <motion.div
      animate={
        isAnimated
          ? mood === 'waving'
            ? { y: [0, -3, 0], rotate: [0, 1.5, -1.5, 0] }
            : { y: [0, -2, 0] }
          : undefined
      }
      transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
      className={`relative flex items-center justify-center select-none ${className}`}
    >
      <svg
        viewBox="0 0 200 240"
        className="w-full h-full overflow-visible drop-shadow-md"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Floral Kerchief Gradient */}
          <linearGradient id="grandmaScarfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="50%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#9f1239" />
          </linearGradient>

          {/* Cozy Cardigan Gradient */}
          <linearGradient id="grandmaDressGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>

          {/* Embroidered Apron */}
          <linearGradient id="grandmaApronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>

          {/* Skin Tone */}
          <linearGradient id="grandmaSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#fdba74" />
          </linearGradient>
        </defs>

        {/* 1. Body & Cozy Dress */}
        <path
          d="M 45 170 C 45 140 155 140 155 170 L 175 235 C 175 240 25 240 25 235 Z"
          fill="url(#grandmaDressGrad)"
        />

        {/* White Lace Collar */}
        <path
          d="M 75 145 Q 100 165 125 145 Q 100 155 75 145 Z"
          fill="#ffffff"
          stroke="#e2e8f0"
          strokeWidth="1.5"
        />

        {/* Ukrainian Coral Beads (Намисто) */}
        <g id="coral-beads">
          <path d="M 78 152 Q 100 172 122 152" fill="none" stroke="#e11d48" strokeWidth="3" />
          <circle cx="82" cy="155" r="3.5" fill="#e11d48" stroke="#9f1239" strokeWidth="0.8" />
          <circle cx="91" cy="161" r="4" fill="#f43f5e" stroke="#9f1239" strokeWidth="0.8" />
          <circle cx="100" cy="163" r="4.5" fill="#e11d48" stroke="#9f1239" strokeWidth="0.8" />
          <circle cx="109" cy="161" r="4" fill="#f43f5e" stroke="#9f1239" strokeWidth="0.8" />
          <circle cx="118" cy="155" r="3.5" fill="#e11d48" stroke="#9f1239" strokeWidth="0.8" />
        </g>

        {/* Ukrainian Embroidered Apron (Фартушок) */}
        <path
          d="M 65 175 L 135 175 L 140 235 L 60 235 Z"
          fill="url(#grandmaApronGrad)"
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />
        {/* Apron Embroidery Patterns */}
        <g id="apron-embroidery" opacity="0.85">
          <line x1="68" y1="185" x2="132" y2="185" stroke="#e11d48" strokeWidth="2" strokeDasharray="3 2" />
          <circle cx="85" cy="195" r="3" fill="#e11d48" />
          <circle cx="100" cy="195" r="4" fill="#3b82f6" />
          <circle cx="115" cy="195" r="3" fill="#e11d48" />
          <line x1="68" y1="205" x2="132" y2="205" stroke="#16a34a" strokeWidth="1.5" />
          <line x1="68" y1="220" x2="132" y2="220" stroke="#e11d48" strokeWidth="3" strokeDasharray="4 2" />
        </g>

        {/* 2. Neck */}
        <rect x="88" y="125" width="24" height="25" rx="6" fill="url(#grandmaSkinGrad)" />

        {/* 3. Back Kerchief */}
        <path
          d="M 40 90 C 35 30 165 30 160 90 C 160 145 140 165 100 165 C 60 165 40 145 40 90 Z"
          fill="url(#grandmaScarfGrad)"
        />

        {/* 4. Head / Face */}
        <ellipse cx="100" cy="95" rx="42" ry="46" fill="url(#grandmaSkinGrad)" />

        {/* Gray Hair Wisps */}
        <path
          d="M 65 80 Q 100 65 135 80 Q 120 70 100 70 Q 80 70 65 80 Z"
          fill="#e2e8f0"
        />
        <circle cx="68" cy="85" r="6" fill="#cbd5e1" />
        <circle cx="132" cy="85" r="6" fill="#cbd5e1" />

        {/* Traditional Ukrainian Floral Kerchief Fold (Хустка) */}
        <path
          d="M 50 68 C 70 42 130 42 150 68 C 160 85 145 60 100 58 C 55 60 40 85 50 68 Z"
          fill="#be123c"
        />
        {/* Scarf Flowers */}
        <circle cx="75" cy="55" r="4" fill="#fde047" />
        <circle cx="85" cy="50" r="3.5" fill="#38bdf8" />
        <circle cx="115" cy="50" r="3.5" fill="#fde047" />
        <circle cx="125" cy="55" r="4" fill="#34d399" />
        <circle cx="100" cy="46" r="4" fill="#f43f5e" />

        {/* Scarf Knot & Hanging Tails under Chin */}
        <ellipse cx="100" cy="140" rx="10" ry="7" fill="#be123c" />
        <path d="M 94 144 L 85 165 L 98 150 Z" fill="#9f1239" />
        <path d="M 106 144 L 115 165 L 102 150 Z" fill="#9f1239" />

        {/* 5. Facial Features */}
        {/* Cute Grandma Glasses */}
        <circle cx="82" cy="94" r="13" fill="#ffffff" fillOpacity="0.35" stroke="#f59e0b" strokeWidth="2.5" />
        <circle cx="118" cy="94" r="13" fill="#ffffff" fillOpacity="0.35" stroke="#f59e0b" strokeWidth="2.5" />
        <line x1="95" y1="94" x2="105" y2="94" stroke="#f59e0b" strokeWidth="2.5" />

        {/* Kind Eyes */}
        <path d="M 76 94 Q 82 89 88 94" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 112 94 Q 118 89 124 94" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        {/* Sparkles */}
        <circle cx="82" cy="92" r="1.5" fill="#ffffff" />
        <circle cx="118" cy="92" r="1.5" fill="#ffffff" />

        {/* Soft Eyebrows */}
        <path d="M 74 83 Q 82 79 90 83" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
        <path d="M 110 83 Q 118 79 126 83" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />

        {/* Rosy Cheeks */}
        <ellipse cx="70" cy="108" rx="8" ry="5" fill="#f43f5e" fillOpacity="0.35" />
        <ellipse cx="130" cy="108" rx="8" ry="5" fill="#f43f5e" fillOpacity="0.35" />

        {/* Cute Small Nose */}
        <path d="M 98 102 Q 100 106 102 102" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />

        {/* Warm Loving Smile */}
        <path
          d="M 88 116 Q 100 128 112 116"
          fill="#be123c"
          stroke="#9f1239"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* 6. Hand Waving or Holding Fresh Pie */}
        {mood === 'waving' ? (
          <g id="waving-hand">
            <ellipse cx="160" cy="130" rx="10" ry="12" fill="url(#grandmaSkinGrad)" stroke="#f97316" strokeWidth="1" />
            <circle cx="164" cy="122" r="3" fill="url(#grandmaSkinGrad)" />
            <circle cx="167" cy="126" r="3" fill="url(#grandmaSkinGrad)" />
            <text x="155" y="115" fontSize="16">👋</text>
          </g>
        ) : (
          <g id="holding-treat">
            <ellipse cx="100" cy="188" rx="20" ry="9" fill="#fef08a" stroke="#d97706" strokeWidth="1.5" />
            <text x="91" y="193" fontSize="15">🥧</text>
          </g>
        )}
      </svg>
    </motion.div>
  );
};
