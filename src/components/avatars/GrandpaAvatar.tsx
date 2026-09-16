import React from 'react';
import { motion } from 'motion/react';

export type GrandpaMood = 'happy' | 'fishing' | 'train' | 'proud' | 'waving';

interface GrandpaAvatarProps {
  mood?: GrandpaMood;
  className?: string;
  isAnimated?: boolean;
}

export const GrandpaAvatar: React.FC<GrandpaAvatarProps> = ({
  mood = 'happy',
  className = 'w-full h-full',
  isAnimated = true,
}) => {
  return (
    <motion.div
      animate={
        isAnimated
          ? mood === 'fishing'
            ? { y: [0, -3, 0], rotate: [0, -1, 1, 0] }
            : { y: [0, -2, 0] }
          : undefined
      }
      transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
      className={`relative flex items-center justify-center select-none ${className}`}
    >
      <svg
        viewBox="0 0 200 240"
        className="w-full h-full overflow-visible drop-shadow-md"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Tweed Flat Cap Gradient */}
          <linearGradient id="grandpaCapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#78716c" />
            <stop offset="50%" stopColor="#57534e" />
            <stop offset="100%" stopColor="#292524" />
          </linearGradient>

          {/* Fisherman Vest Gradient */}
          <linearGradient id="grandpaVestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>

          {/* Plaid Shirt Gradient */}
          <linearGradient id="grandpaShirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="50%" stopColor="#c2410c" />
            <stop offset="100%" stopColor="#9a3412" />
          </linearGradient>

          {/* Skin Tone */}
          <linearGradient id="grandpaSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#fdba74" />
          </linearGradient>
        </defs>

        {/* 1. Body & Plaid Shirt */}
        <path
          d="M 40 170 C 40 140 160 140 160 170 L 180 235 C 180 240 20 240 20 235 Z"
          fill="url(#grandpaShirtGrad)"
        />

        {/* Plaid Shirt Pattern Stripes */}
        <g id="shirt-stripes" opacity="0.4">
          <line x1="50" y1="160" x2="50" y2="235" stroke="#fef08a" strokeWidth="2" />
          <line x1="150" y1="160" x2="150" y2="235" stroke="#fef08a" strokeWidth="2" />
          <line x1="100" y1="160" x2="100" y2="235" stroke="#fef08a" strokeWidth="2" />
          <line x1="30" y1="190" x2="170" y2="190" stroke="#fef08a" strokeWidth="2" />
          <line x1="30" y1="215" x2="170" y2="215" stroke="#fef08a" strokeWidth="2" />
        </g>

        {/* Fisherman Explorer Vest with Pockets */}
        <path
          d="M 45 170 L 75 160 L 75 235 L 35 235 Z"
          fill="url(#grandpaVestGrad)"
        />
        <path
          d="M 155 170 L 125 160 L 125 235 L 165 235 Z"
          fill="url(#grandpaVestGrad)"
        />
        {/* Vest Pockets */}
        <rect x="42" y="195" width="26" height="22" rx="4" fill="#14532d" stroke="#16a34a" strokeWidth="1" />
        <rect x="132" y="195" width="26" height="22" rx="4" fill="#14532d" stroke="#16a34a" strokeWidth="1" />
        <circle cx="55" cy="200" r="2" fill="#fbbf24" />
        <circle cx="145" cy="200" r="2" fill="#fbbf24" />

        {/* Fisherman Gold Badge */}
        <circle cx="60" cy="178" r="4.5" fill="#fbbf24" stroke="#b45309" strokeWidth="1" />
        <text x="56.5" y="181.5" fontSize="6">⭐</text>

        {/* 2. Neck */}
        <rect x="88" y="125" width="24" height="25" rx="6" fill="url(#grandpaSkinGrad)" />

        {/* 3. Gray Sideburns & Back Hair */}
        <ellipse cx="62" cy="98" rx="8" ry="15" fill="#d6d3d1" />
        <ellipse cx="138" cy="98" rx="8" ry="15" fill="#d6d3d1" />

        {/* 4. Head / Face */}
        <ellipse cx="100" cy="98" rx="42" ry="46" fill="url(#grandpaSkinGrad)" />

        {/* Kind Grandpa Wrinkles / Laugh Lines */}
        <path d="M 68 96 Q 64 100 68 104" fill="none" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 132 96 Q 136 100 132 104" fill="none" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />

        {/* Bushy Gray Eyebrows */}
        <path d="M 72 82 Q 83 75 92 82" fill="none" stroke="#e7e5e4" strokeWidth="5" strokeLinecap="round" />
        <path d="M 108 82 Q 117 75 128 82" fill="none" stroke="#e7e5e4" strokeWidth="5" strokeLinecap="round" />

        {/* Cheerful Kind Eyes */}
        <path d="M 76 94 Q 84 87 92 94" fill="none" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" />
        <path d="M 108 94 Q 116 87 124 94" fill="none" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" />
        <circle cx="84" cy="91" r="1.5" fill="#ffffff" />
        <circle cx="116" cy="91" r="1.5" fill="#ffffff" />

        {/* Rosy Cheeks */}
        <ellipse cx="70" cy="110" rx="9" ry="6" fill="#f97316" fillOpacity="0.3" />
        <ellipse cx="130" cy="110" rx="9" ry="6" fill="#f97316" fillOpacity="0.3" />

        {/* Round Friendly Nose */}
        <ellipse cx="100" cy="104" rx="7" ry="5.5" fill="#fb923c" stroke="#ea580c" strokeWidth="1" />

        {/* Grandfather's Iconic Fluffy Gray Mustache (Вуса) */}
        <path
          d="M 100 114 C 88 114 74 118 70 128 C 80 134 94 125 100 120 C 106 125 120 134 130 128 C 126 118 112 114 100 114 Z"
          fill="#f5f5f4"
          stroke="#d6d3d1"
          strokeWidth="1.5"
        />

        {/* Smiling Mouth underneath Mustache */}
        <path
          d="M 90 126 Q 100 135 110 126"
          fill="#991b1b"
          stroke="#7f1d1d"
          strokeWidth="1.5"
        />

        {/* 5. Tweed Newsboy Cap (Кепка) */}
        <ellipse cx="100" cy="62" rx="48" ry="24" fill="url(#grandpaCapGrad)" />
        {/* Cap Visor */}
        <path
          d="M 52 68 C 65 82 135 82 148 68 C 130 63 70 63 52 68 Z"
          fill="#1c1917"
        />
        {/* Cap Button */}
        <circle cx="100" cy="42" r="5" fill="#44403c" stroke="#292524" strokeWidth="1" />

        {/* 6. Special Accessories per Mood */}
        {mood === 'fishing' ? (
          <g id="fishing-rod-hand">
            <line x1="150" y1="200" x2="190" y2="70" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
            <line x1="190" y1="70" x2="185" y2="130" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 2" />
            <text x="175" y="145" fontSize="16">🐟</text>
          </g>
        ) : mood === 'train' ? (
          <g id="train-ticket-pocket">
            <rect x="44" y="180" width="18" height="20" rx="3" fill="#fde047" stroke="#ca8a04" strokeWidth="1" transform="rotate(-15 44 180)" />
            <text x="44" y="194" fontSize="10">🎫</text>
          </g>
        ) : (
          <g id="waving-didus">
            <text x="145" y="170" fontSize="16">✨</text>
          </g>
        )}
      </svg>
    </motion.div>
  );
};
