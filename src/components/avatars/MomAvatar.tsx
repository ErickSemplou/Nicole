import React from 'react';
import { motion } from 'motion/react';

export type MomMood = 'loving' | 'happy' | 'proud' | 'waving';

interface MomAvatarProps {
  mood?: MomMood;
  className?: string;
  isAnimated?: boolean;
}

export const MomAvatar: React.FC<MomAvatarProps> = ({
  mood = 'loving',
  className = 'w-full h-full',
  isAnimated = true,
}) => {
  return (
    <motion.div
      animate={
        isAnimated
          ? mood === 'waving'
            ? { y: [0, -3, 0], rotate: [0, 1, -1, 0] }
            : { y: [0, -2.5, 0] }
          : undefined
      }
      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      className={`relative flex items-center justify-center select-none ${className}`}
    >
      <svg
        viewBox="0 0 200 240"
        className="w-full h-full overflow-visible drop-shadow-md"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Chestnut Wavy Hair */}
          <linearGradient id="momHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="40%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>

          {/* Cozy Pastel Lilac Sweater */}
          <linearGradient id="momSweaterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="50%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>

          {/* Skin Tone */}
          <linearGradient id="momSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffedd5" />
            <stop offset="100%" stopColor="#fed7aa" />
          </linearGradient>
        </defs>

        {/* 1. Back Long Wavy Hair */}
        <path
          d="M 40 90 C 25 140 30 200 65 225 C 80 190 75 130 85 90 Z"
          fill="url(#momHairGrad)"
        />
        <path
          d="M 160 90 C 175 140 170 200 135 225 C 120 190 125 130 115 90 Z"
          fill="url(#momHairGrad)"
        />

        {/* 2. Body & Elegant Cozy Sweater */}
        <path
          d="M 45 165 C 45 135 155 135 155 165 L 170 235 C 170 240 30 240 30 235 Z"
          fill="url(#momSweaterGrad)"
        />

        {/* Soft Knit Neckline */}
        <path
          d="M 78 140 Q 100 160 122 140 Q 100 150 78 140 Z"
          fill="#fdf4ff"
          stroke="#f0abfc"
          strokeWidth="1.5"
        />

        {/* Gold Heart Pendant Necklace */}
        <path d="M 85 145 Q 100 162 115 145" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
        <path
          d="M 100 164 C 98 160 93 160 93 164 C 93 168 100 172 100 172 C 100 172 107 168 107 164 C 107 160 102 160 100 164 Z"
          fill="#f59e0b"
          stroke="#b45309"
          strokeWidth="0.8"
        />

        {/* 3. Neck */}
        <rect x="88" y="118" width="24" height="28" rx="7" fill="url(#momSkinGrad)" />

        {/* 4. Head / Face */}
        <ellipse cx="100" cy="90" rx="38" ry="42" fill="url(#momSkinGrad)" />

        {/* Pearl / Daisy Earrings */}
        <circle cx="60" cy="96" r="4.5" fill="#fef08a" stroke="#f59e0b" strokeWidth="1" />
        <circle cx="140" cy="96" r="4.5" fill="#fef08a" stroke="#f59e0b" strokeWidth="1" />
        <circle cx="60" cy="96" r="2" fill="#ffffff" />
        <circle cx="140" cy="96" r="2" fill="#ffffff" />

        {/* 5. Front Chestnut Waves Hair */}
        <path
          d="M 58 85 C 55 45 145 45 142 85 C 135 60 120 52 100 52 C 80 52 65 60 58 85 Z"
          fill="url(#momHairGrad)"
        />
        {/* Side Waves framing face */}
        <path
          d="M 62 82 C 65 110 50 140 68 165 C 72 135 72 105 78 85 Z"
          fill="url(#momHairGrad)"
        />
        <path
          d="M 138 82 C 135 110 150 140 132 165 C 128 135 128 105 122 85 Z"
          fill="url(#momHairGrad)"
        />

        {/* 6. Facial Features */}
        {/* Elegant Eyebrows */}
        <path d="M 75 76 Q 84 71 92 75" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 108 75 Q 116 71 125 76" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />

        {/* Sparkly Warm Hazel Eyes with Lashes */}
        <ellipse cx="84" cy="87" rx="7" ry="8" fill="#ffffff" />
        <ellipse cx="116" cy="87" rx="7" ry="8" fill="#ffffff" />
        {/* Iris */}
        <circle cx="84" cy="87" r="5" fill="#92400e" />
        <circle cx="116" cy="87" r="5" fill="#92400e" />
        {/* Pupil */}
        <circle cx="84" cy="87" r="3" fill="#1c1917" />
        <circle cx="116" cy="87" r="3" fill="#1c1917" />
        {/* Eye Glints */}
        <circle cx="82" cy="85" r="1.8" fill="#ffffff" />
        <circle cx="114" cy="85" r="1.8" fill="#ffffff" />
        <circle cx="86" cy="89" r="0.9" fill="#ffffff" />
        <circle cx="118" cy="89" r="0.9" fill="#ffffff" />

        {/* Eyelashes */}
        <path d="M 77 82 L 74 79" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 84 80 L 84 76" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 91 82 L 94 79" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round" />

        <path d="M 109 82 L 106 79" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 116 80 L 116 76" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 123 82 L 126 79" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round" />

        {/* Soft Blush Cheeks */}
        <ellipse cx="73" cy="98" rx="8" ry="5" fill="#f43f5e" fillOpacity="0.3" />
        <ellipse cx="127" cy="98" rx="8" ry="5" fill="#f43f5e" fillOpacity="0.3" />

        {/* Small Nose */}
        <path d="M 98 92 Q 100 96 102 92" fill="none" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" />

        {/* Loving Sweet Smile with Gloss */}
        <path
          d="M 88 106 Q 100 118 112 106"
          fill="#f43f5e"
          stroke="#e11d48"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path d="M 92 108 Q 100 113 108 108" fill="#ffffff" stroke="#fbcfe8" strokeWidth="0.5" />

        {/* Flower clip in hair */}
        <circle cx="128" cy="62" r="5" fill="#ec4899" />
        <circle cx="128" cy="62" r="2.5" fill="#fde047" />

        {/* Floating Heart / Sparkle */}
        <text x="145" y="60" fontSize="16">💖</text>
      </svg>
    </motion.div>
  );
};
