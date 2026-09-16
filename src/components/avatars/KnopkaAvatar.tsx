import React from 'react';
import { motion } from 'motion/react';

export type KnopkaAction = 'idle' | 'running' | 'eating' | 'barking' | 'petting' | 'happy';
export type KnopkaAccessory = 'none' | 'red_collar' | 'pink_bow' | 'flower';

interface KnopkaAvatarProps {
  action?: KnopkaAction;
  accessory?: KnopkaAccessory;
  className?: string;
  isAnimated?: boolean;
}

export const KnopkaAvatar: React.FC<KnopkaAvatarProps> = ({
  action = 'idle',
  accessory = 'red_collar',
  className = 'w-full h-full',
  isAnimated = true,
}) => {
  return (
    <motion.div
      animate={
        isAnimated
          ? action === 'barking'
            ? { y: [0, -6, 0], scale: [1, 1.05, 1] }
            : action === 'running'
            ? { y: [0, -8, 0], rotate: [-3, 3, -3] }
            : action === 'eating'
            ? { y: [0, 4, 0], rotate: [0, 2, -2, 0] }
            : { y: [0, -3, 0] }
          : undefined
      }
      transition={{
        repeat: Infinity,
        duration: action === 'barking' ? 0.6 : action === 'running' ? 0.8 : 2.2,
        ease: 'easeInOut',
      }}
      className={`relative flex items-center justify-center select-none ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full overflow-visible drop-shadow-md"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Fluffy Golden Puppy Fur */}
          <linearGradient id="knopkaFurGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="60%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          {/* Ears Inner Shadow */}
          <linearGradient id="earGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Collar Gradient */}
          <linearGradient id="redCollarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
        </defs>

        {/* 1. Wagging Fluffy Tail */}
        <motion.path
          d="M 140 145 C 165 140 185 110 175 90 C 160 95 150 120 135 135 Z"
          fill="url(#knopkaFurGrad)"
          stroke="#d97706"
          strokeWidth="1.5"
          animate={{ rotate: [-15, 20, -15] }}
          transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
          style={{ originX: '135px', originY: '140px' }}
        />

        {/* 2. Puppy Body */}
        <ellipse cx="100" cy="140" rx="52" ry="42" fill="url(#knopkaFurGrad)" />
        {/* Soft White Chest Patch */}
        <path
          d="M 85 125 C 80 155 120 155 115 125 C 105 132 95 132 85 125 Z"
          fill="#ffffff"
          opacity="0.9"
        />

        {/* 3. Front Paws */}
        <g id="paws">
          <ellipse cx="75" cy="172" rx="14" ry="11" fill="url(#knopkaFurGrad)" stroke="#d97706" strokeWidth="1" />
          <ellipse cx="125" cy="172" rx="14" ry="11" fill="url(#knopkaFurGrad)" stroke="#d97706" strokeWidth="1" />
          {/* Paw Pads */}
          <circle cx="71" cy="170" r="2.5" fill="#fbcfe8" />
          <circle cx="75" cy="168" r="2.5" fill="#fbcfe8" />
          <circle cx="79" cy="170" r="2.5" fill="#fbcfe8" />
          <ellipse cx="75" cy="175" rx="5" ry="3.5" fill="#fbcfe8" />

          <circle cx="121" cy="170" r="2.5" fill="#fbcfe8" />
          <circle cx="125" cy="168" r="2.5" fill="#fbcfe8" />
          <circle cx="129" cy="170" r="2.5" fill="#fbcfe8" />
          <ellipse cx="125" cy="175" rx="5" ry="3.5" fill="#fbcfe8" />
        </g>

        {/* 4. Collar & Bell */}
        {accessory === 'red_collar' && (
          <g id="red-collar">
            <path d="M 68 116 Q 100 134 132 116 Q 100 126 68 116 Z" fill="url(#redCollarGrad)" stroke="#9f1239" strokeWidth="1" />
            <circle cx="100" cy="128" r="6" fill="#fbbf24" stroke="#b45309" strokeWidth="1.2" />
            <circle cx="100" cy="128" r="2.5" fill="#f59e0b" />
          </g>
        )}

        {accessory === 'pink_bow' && (
          <g id="pink-bow">
            <ellipse cx="90" cy="125" rx="8" ry="6" fill="#ec4899" stroke="#be185d" strokeWidth="1" transform="rotate(-20 90 125)" />
            <ellipse cx="110" cy="125" rx="8" ry="6" fill="#ec4899" stroke="#be185d" strokeWidth="1" transform="rotate(20 110 125)" />
            <circle cx="100" cy="125" r="4" fill="#f472b6" />
          </g>
        )}

        {/* 5. Puppy Head */}
        <ellipse cx="100" cy="82" rx="46" ry="42" fill="url(#knopkaFurGrad)" />

        {/* 6. Floppy Puppy Ears */}
        {/* Left Ear */}
        <motion.path
          d="M 62 60 C 35 60 25 105 45 115 C 60 115 65 85 62 60 Z"
          fill="url(#earGrad)"
          stroke="#b45309"
          strokeWidth="1.5"
          animate={{ rotate: action === 'barking' ? [-6, 6, -6] : [0, 2, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
        {/* Right Ear */}
        <motion.path
          d="M 138 60 C 165 60 175 105 155 115 C 140 115 135 85 138 60 Z"
          fill="url(#earGrad)"
          stroke="#b45309"
          strokeWidth="1.5"
          animate={{ rotate: action === 'barking' ? [6, -6, 6] : [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />

        {/* Soft Muzzle */}
        <ellipse cx="100" cy="94" rx="24" ry="18" fill="#ffffff" />

        {/* 7. Eyes (Big Sparkling Anime Puppy Eyes) */}
        <ellipse cx="80" cy="74" rx="9" ry="11" fill="#1c1917" />
        <ellipse cx="120" cy="74" rx="9" ry="11" fill="#1c1917" />
        {/* Eye Glints */}
        <circle cx="77" cy="70" r="3.5" fill="#ffffff" />
        <circle cx="117" cy="70" r="3.5" fill="#ffffff" />
        <circle cx="83" cy="77" r="1.8" fill="#ffffff" />
        <circle cx="123" cy="77" r="1.8" fill="#ffffff" />

        {/* Puppy Eyebrow Dots */}
        <circle cx="76" cy="60" r="3.5" fill="#d97706" />
        <circle cx="124" cy="60" r="3.5" fill="#d97706" />

        {/* Rosy Puppy Cheeks */}
        <ellipse cx="68" cy="88" rx="7" ry="4.5" fill="#f43f5e" fillOpacity="0.3" />
        <ellipse cx="132" cy="88" rx="7" ry="4.5" fill="#f43f5e" fillOpacity="0.3" />

        {/* 8. Shiny Button Nose ("Кнопка") */}
        <ellipse cx="100" cy="88" rx="7.5" ry="5.5" fill="#0f172a" />
        <ellipse cx="98" cy="86" rx="2.5" ry="1.5" fill="#ffffff" />

        {/* 9. Puppy Mouth & Tongue */}
        {action === 'barking' || action === 'happy' ? (
          <g id="open-mouth-tongue">
            <path d="M 92 94 Q 100 106 108 94 Z" fill="#be123c" />
            <ellipse cx="100" cy="102" rx="5" ry="6" fill="#f43f5e" />
          </g>
        ) : (
          <path
            d="M 92 94 Q 96 98 100 94 Q 104 98 108 94"
            fill="none"
            stroke="#1c1917"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}

        {/* Flower Accessory if selected */}
        {accessory === 'flower' && (
          <g id="flower-ear">
            <circle cx="60" cy="55" r="5" fill="#f43f5e" />
            <circle cx="56" cy="50" r="4.5" fill="#f43f5e" />
            <circle cx="64" cy="50" r="4.5" fill="#f43f5e" />
            <circle cx="60" cy="52" r="3" fill="#fde047" />
          </g>
        )}

        {/* Barking sound bubbles or sparkle */}
        {action === 'barking' && (
          <text x="145" y="55" fontSize="16">💬 Гав!</text>
        )}
      </svg>
    </motion.div>
  );
};
