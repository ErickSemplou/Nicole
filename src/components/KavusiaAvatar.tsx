import React from 'react';
import { KavusiaAccessory } from '../types';

export type KavusiaMood = 'idle' | 'happy' | 'eating' | 'petting' | 'sleeping';

interface KavusiaAvatarProps {
  mood?: KavusiaMood;
  accessory?: KavusiaAccessory;
  className?: string;
  isChewing?: boolean;
}

export const KavusiaAvatar: React.FC<KavusiaAvatarProps> = ({
  mood = 'idle',
  accessory = 'none',
  className = 'w-48 h-48',
  isChewing = false,
}) => {
  return (
    <svg
      viewBox="0 0 240 200"
      className={`${className} overflow-visible transition-transform duration-200 select-none`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Warm golden-brown fur gradient */}
        <linearGradient id="furBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="60%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        {/* Cocoa brown fur patch */}
        <linearGradient id="cocoaFur" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>

        {/* White chest & belly fur */}
        <linearGradient id="whiteFur" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fef3c7" />
        </linearGradient>

        {/* Pink nose & ears */}
        <linearGradient id="earPink" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbcfe8" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>

        {/* Fairy wings gradient */}
        <linearGradient id="kavusiaWingsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c7d2fe" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fbcfe8" stopOpacity="0.75" />
        </linearGradient>
      </defs>

      {/* Fairy Wings (Behind Body) */}
      {accessory === 'fairy_wings' && (
        <g id="kavusia-fairy-wings">
          <ellipse cx="60" cy="85" rx="30" ry="16" transform="rotate(-30 60 85)" fill="url(#kavusiaWingsGrad)" stroke="#818cf8" strokeWidth="1.5" />
          <ellipse cx="180" cy="85" rx="30" ry="16" transform="rotate(30 180 85)" fill="url(#kavusiaWingsGrad)" stroke="#818cf8" strokeWidth="1.5" />
          <text x="45" y="80" fontSize="12">✨</text>
          <text x="175" y="80" fontSize="12">✨</text>
        </g>
      )}

      {/* Shadow */}
      <ellipse cx="120" cy="182" rx="75" ry="14" fill="#000000" opacity="0.12" />

      {/* Back Paws */}
      <ellipse cx="65" cy="172" rx="14" ry="9" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1.5" />
      <ellipse cx="175" cy="172" rx="14" ry="9" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1.5" />

      {/* Chubby Plump Body */}
      <path
        d="M 50 145 C 30 110 50 70 95 65 C 135 60 190 70 200 115 C 208 150 180 178 120 178 C 70 178 55 165 50 145 Z"
        fill="url(#furBody)"
      />

      {/* Dark Cocoa Patch on rear/back */}
      <path
        d="M 55 125 C 45 95 60 75 90 70 C 80 110 70 140 55 125 Z"
        fill="url(#cocoaFur)"
        opacity="0.85"
      />

      {/* White Belly & Front Patch */}
      <path
        d="M 85 110 C 105 95 135 95 155 110 C 165 140 150 176 120 176 C 90 176 75 140 85 110 Z"
        fill="url(#whiteFur)"
      />

      {/* Front Paws */}
      <ellipse cx="95" cy="170" rx="11" ry="8" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1.5" />
      <ellipse cx="145" cy="170" rx="11" ry="8" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1.5" />

      {/* Guinea Pig Head & Face */}
      <ellipse cx="120" cy="98" rx="42" ry="38" fill="url(#furBody)" />

      {/* White Crest Stripe on Forehead */}
      <path
        d="M 112 62 C 116 60 124 60 128 62 L 126 95 C 123 100 117 100 114 95 Z"
        fill="url(#whiteFur)"
      />

      {/* Cute Folded Ears */}
      <g transform={mood === 'petting' ? 'rotate(-10 75 75)' : ''}>
        <ellipse cx="78" cy="74" rx="13" ry="10" transform="rotate(-25 78 74)" fill="url(#furBody)" />
        <ellipse cx="78" cy="74" rx="9" ry="6" transform="rotate(-25 78 74)" fill="url(#earPink)" />
      </g>
      <g transform={mood === 'petting' ? 'rotate(10 162 75)' : ''}>
        <ellipse cx="162" cy="74" rx="13" ry="10" transform="rotate(25 162 74)" fill="url(#furBody)" />
        <ellipse cx="162" cy="74" rx="9" ry="6" transform="rotate(25 162 74)" fill="url(#earPink)" />
      </g>

      {/* Rosy Cheeks */}
      <ellipse cx="92" cy="115" rx="9" ry="6" fill="#f43f5e" opacity="0.3" />
      <ellipse cx="148" cy="115" rx="9" ry="6" fill="#f43f5e" opacity="0.3" />

      {/* Guinea Pig Eyes */}
      {mood === 'sleeping' || mood === 'petting' ? (
        <g id="eyes-closed">
          <path d="M 92 95 Q 100 102 108 95" stroke="#451a03" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 132 95 Q 140 102 148 95" stroke="#451a03" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      ) : (
        <g id="eyes-open">
          <circle cx="100" cy="94" r="8.5" fill="#1c1917" />
          <circle cx="98" cy="91" r="2.5" fill="#ffffff" />
          <circle cx="102" cy="96" r="1.2" fill="#ffffff" />

          <circle cx="140" cy="94" r="8.5" fill="#1c1917" />
          <circle cx="138" cy="91" r="2.5" fill="#ffffff" />
          <circle cx="142" cy="96" r="1.2" fill="#ffffff" />
        </g>
      )}

      {/* Cute Guinea Pig Pink Snout & Nose */}
      <path
        d="M 112 110 C 112 106 128 106 128 110 C 128 116 112 116 112 110 Z"
        fill="#fb7185"
      />

      {/* Cute Guinea Pig Y-Mouth */}
      <path
        d="M 120 114 L 120 119 M 120 119 Q 114 124 110 120 M 120 119 Q 126 124 130 120"
        stroke="#be185d"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Chewing effect */}
      {isChewing && (
        <circle cx="120" cy="120" r="4" fill="#fb7185" className="animate-ping" opacity="0.4" />
      )}

      {/* Whiskers */}
      <g stroke="#92400e" strokeWidth="1.2" strokeLinecap="round" opacity="0.65">
        <line x1="95" y1="112" x2="68" y2="106" />
        <line x1="94" y1="116" x2="65" y2="116" />
        <line x1="95" y1="120" x2="70" y2="126" />
        <line x1="145" y1="112" x2="172" y2="106" />
        <line x1="146" y1="116" x2="175" y2="116" />
        <line x1="145" y1="120" x2="170" y2="126" />
      </g>

      {/* ACCESSORIES LAYER */}
      {accessory === 'bow' && (
        <g id="kavusia-bow" transform="translate(68, 55)">
          <path d="M 0 8 L 16 0 L 16 16 Z" fill="#ec4899" />
          <path d="M 32 8 L 16 0 L 16 16 Z" fill="#ec4899" />
          <circle cx="16" cy="8" r="4" fill="#fbcfe8" />
        </g>
      )}

      {accessory === 'flower' && (
        <g id="kavusia-flower" transform="translate(142, 52)">
          <circle cx="10" cy="10" r="10" fill="#f43f5e" />
          <circle cx="10" cy="10" r="5" fill="#fde047" />
          <text x="3" y="15" fontSize="14">🌸</text>
        </g>
      )}

      {accessory === 'crown' && (
        <g id="kavusia-crown" transform="translate(102, 38)">
          <path d="M 0 22 L 8 4 L 18 14 L 28 4 L 36 22 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
          <circle cx="8" cy="4" r="2.5" fill="#ec4899" />
          <circle cx="18" cy="14" r="2.5" fill="#38bdf8" />
          <circle cx="28" cy="4" r="2.5" fill="#ec4899" />
        </g>
      )}

      {accessory === 'strawberry' && (
        <g id="kavusia-strawberry" transform="translate(104, 38)">
          <path d="M 16 0 C 30 0 32 20 16 28 C 0 20 2 0 16 0 Z" fill="#ef4444" />
          <polygon points="16,0 12,-4 20,-4" fill="#22c55e" />
          <circle cx="12" cy="8" r="1" fill="#fef08a" />
          <circle cx="20" cy="10" r="1" fill="#fef08a" />
          <circle cx="15" cy="16" r="1" fill="#fef08a" />
        </g>
      )}

      {accessory === 'party_hat' && (
        <g id="kavusia-party-hat" transform="translate(105, 28)">
          <polygon points="15,0 0,35 30,35" fill="#ec4899" stroke="#be185d" strokeWidth="1.5" />
          <path d="M 4 24 Q 15 28 26 24" stroke="#facc15" strokeWidth="3" fill="none" />
          <circle cx="15" cy="0" r="4.5" fill="#facc15" />
        </g>
      )}

      {accessory === 'sunglasses' && (
        <g id="kavusia-sunglasses" transform="translate(86, 84)">
          {/* Left Lens */}
          <ellipse cx="14" cy="10" rx="14" ry="11" fill="#1e1b4b" stroke="#facc15" strokeWidth="2.5" />
          <path d="M 5 6 Q 14 3 22 7" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.8" />
          {/* Bridge */}
          <line x1="28" y1="10" x2="40" y2="10" stroke="#facc15" strokeWidth="3" />
          {/* Right Lens */}
          <ellipse cx="54" cy="10" rx="14" ry="11" fill="#1e1b4b" stroke="#facc15" strokeWidth="2.5" />
          <path d="M 45 6 Q 54 3 62 7" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.8" />
        </g>
      )}

      {accessory === 'chef_hat' && (
        <g id="kavusia-chef-hat" transform="translate(98, 22)">
          {/* Chef Hat Puffy Cloud Top */}
          <path
            d="M 6 32 C -4 20 6 5 22 6 C 26 -2 38 -2 42 6 C 58 5 68 20 58 32 Z"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          {/* Hat Base Band */}
          <rect x="6" y="28" width="52" height="12" rx="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="16" y1="30" x2="16" y2="38" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="32" y1="30" x2="32" y2="38" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="48" y1="30" x2="48" y2="38" stroke="#cbd5e1" strokeWidth="1" />
        </g>
      )}

      {accessory === 'warm_scarf' && (
        <g id="kavusia-warm-scarf" transform="translate(78, 126)">
          {/* Cozy Knitted Scarf Ring */}
          <path
            d="M 5 8 Q 42 22 79 8 Q 84 20 74 26 Q 42 34 10 26 Z"
            fill="#e11d48"
            stroke="#9f1239"
            strokeWidth="1.5"
          />
          {/* Scarf Stripes */}
          <line x1="22" y1="12" x2="26" y2="28" stroke="#ffffff" strokeWidth="3" />
          <line x1="42" y1="14" x2="42" y2="30" stroke="#ffffff" strokeWidth="3" />
          <line x1="62" y1="12" x2="58" y2="28" stroke="#ffffff" strokeWidth="3" />
          {/* Hanging tail */}
          <path d="M 56 22 L 68 45 L 82 43 L 72 20 Z" fill="#e11d48" stroke="#9f1239" strokeWidth="1.5" />
          <line x1="66" y1="45" x2="82" y2="43" stroke="#facc15" strokeWidth="3" />
        </g>
      )}

      {accessory === 'golden_bell' && (
        <g id="kavusia-golden-bell" transform="translate(94, 130)">
          {/* Red Ribbon Collar */}
          <path d="M 0 6 Q 26 16 52 6" stroke="#e11d48" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* Golden Bell */}
          <circle cx="26" cy="16" r="9" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
          <circle cx="26" cy="18" r="2.5" fill="#78350f" />
          <line x1="26" y1="18" x2="26" y2="23" stroke="#78350f" strokeWidth="1.5" />
        </g>
      )}

      {/* Hearts when happy or petting */}
      {(mood === 'happy' || mood === 'petting') && (
        <g className="animate-bounce">
          <text x="50" y="55" fontSize="18">💖</text>
          <text x="170" y="55" fontSize="18">✨</text>
        </g>
      )}
    </svg>
  );
};
