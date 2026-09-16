import React from 'react';
import { HairstyleId, OutfitId, EyeColorId, AccessoryId, ShoeId, NicoleAppearance } from '../types';

export const DEFAULT_APPEARANCE: NicoleAppearance = {
  hairstyle: 'pigtails_flowers',
  outfit: 'cherry_dress',
  eyeColor: 'sky_blue',
  accessory: 'none',
  shoes: 'cherry_shoes',
};

interface NicoleAvatarProps {
  appearance?: NicoleAppearance;
  mood?: 'happy' | 'sleepy' | 'eating' | 'excited' | 'curious';
  mode?: 'bust' | 'full';
  className?: string;
}

export const NicoleAvatar: React.FC<NicoleAvatarProps> = ({
  appearance = DEFAULT_APPEARANCE,
  mood = 'happy',
  mode = 'bust',
  className = 'w-full h-full',
}) => {
  const { hairstyle, outfit, eyeColor, accessory, shoes = 'cherry_shoes' } = appearance;

  // Eye color palette
  const eyePalette: Record<EyeColorId, { main: string; dark: string; light: string }> = {
    sky_blue: { main: '#38bdf8', dark: '#0284c7', light: '#bae6fd' },
    emerald_green: { main: '#34d399', dark: '#059669', light: '#a7f3d0' },
    warm_hazel: { main: '#d97706', dark: '#92400e', light: '#fde68a' },
    violet: { main: '#a855f7', dark: '#7e22ce', light: '#e9d5ff' },
  };

  const currentEye = eyePalette[eyeColor] || eyePalette.sky_blue;
  const isFull = mode === 'full';

  return (
    <svg
      viewBox={isFull ? '0 0 320 410' : '0 0 320 320'}
      className={`${className} overflow-visible`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Blonde Hair Gradients */}
        <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>

        {/* Skin Tone */}
        <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffedd5" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>

        {/* Outfit Gradients */}
        <linearGradient id="cherryDressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>

        <linearGradient id="princessGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#9333ea" />
        </linearGradient>

        <linearGradient id="ballerinaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>

        <linearGradient id="tutuGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fce7f3" />
          <stop offset="50%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#fda4af" />
        </linearGradient>

        <linearGradient id="sportGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        <linearGradient id="overallsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>

        <linearGradient id="raincoatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>

        <linearGradient id="pajamaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a5f3fc" />
          <stop offset="100%" stopColor="#67e8f9" />
        </linearGradient>

        <linearGradient id="fairyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="50%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        <linearGradient id="partyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="50%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#be123c" />
        </linearGradient>

        <linearGradient id="summerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>

        <linearGradient id="winterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0e7ff" />
          <stop offset="50%" stopColor="#c7d2fe" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>

        <linearGradient id="wingsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.75" />
        </linearGradient>
      </defs>

      {/* BACK FAIRY WINGS */}
      {(accessory === 'fairy_wings' || outfit === 'fairy_princess') && (
        <g id="fairy-wings-back">
          {/* Left Top Wing */}
          <ellipse cx="75" cy="180" rx="45" ry="25" transform="rotate(-35 75 180)" fill="url(#wingsGrad)" stroke="#38bdf8" strokeWidth="2.5" />
          <ellipse cx="65" cy="210" rx="30" ry="18" transform="rotate(-15 65 210)" fill="url(#wingsGrad)" stroke="#38bdf8" strokeWidth="2" />
          {/* Right Top Wing */}
          <ellipse cx="245" cy="180" rx="45" ry="25" transform="rotate(35 245 180)" fill="url(#wingsGrad)" stroke="#38bdf8" strokeWidth="2.5" />
          <ellipse cx="255" cy="210" rx="30" ry="18" transform="rotate(15 255 210)" fill="url(#wingsGrad)" stroke="#38bdf8" strokeWidth="2" />
          {/* Sparkles on wings */}
          <text x="60" y="180" fontSize="16">✨</text>
          <text x="240" y="180" fontSize="16">✨</text>
        </g>
      )}

      {/* 1. BACK HAIR (for loose waves or pigtails) */}
      {hairstyle === 'loose_waves' && (
        <g id="back-hair-waves">
          <path
            d="M 70 120 C 40 180 50 250 85 270 C 110 240 100 180 110 130 Z"
            fill="url(#hairGrad)"
          />
          <path
            d="M 250 120 C 280 180 270 250 235 270 C 210 240 220 180 210 130 Z"
            fill="url(#hairGrad)"
          />
        </g>
      )}

      {hairstyle === 'pigtails_flowers' && (
        <g id="back-hair-pigtails">
          {/* Left Pigtail */}
          <circle cx="70" cy="140" r="34" fill="url(#hairGrad)" />
          <path d="M 60 140 C 45 175 60 210 75 220 C 85 195 80 160 70 140 Z" fill="url(#hairGrad)" />
          {/* Left Flower */}
          <circle cx="85" cy="120" r="13" fill="#f43f5e" />
          <circle cx="85" cy="120" r="6" fill="#fef08a" />

          {/* Right Pigtail */}
          <circle cx="250" cy="140" r="34" fill="url(#hairGrad)" />
          <path d="M 260 140 C 275 175 260 210 245 220 C 235 195 240 160 250 140 Z" fill="url(#hairGrad)" />
          {/* Right Flower */}
          <circle cx="235" cy="120" r="13" fill="#facc15" />
          <circle cx="235" cy="120" r="6" fill="#fb7185" />
        </g>
      )}

      {hairstyle === 'buns_bows' && (
        <g id="back-hair-buns">
          {/* Left Space Bun */}
          <circle cx="80" cy="70" r="32" fill="url(#hairGrad)" />
          {/* Left Bow */}
          <path d="M 65 85 L 95 85 L 80 95 Z" fill="#ec4899" />
          <circle cx="80" cy="88" r="5" fill="#f472b6" />

          {/* Right Space Bun */}
          <circle cx="240" cy="70" r="32" fill="url(#hairGrad)" />
          {/* Right Bow */}
          <path d="M 225 85 L 255 85 L 240 95 Z" fill="#ec4899" />
          <circle cx="240" cy="88" r="5" fill="#f472b6" />
        </g>
      )}

      {hairstyle === 'high_ponytail' && (
        <g id="back-hair-ponytail">
          {/* High top ponytail swoosh */}
          <path
            d="M 160 70 C 210 20 260 40 270 90 C 260 120 220 100 175 75 Z"
            fill="url(#hairGrad)"
          />
          {/* Scrunchie */}
          <circle cx="170" cy="70" r="12" fill="#f59e0b" />
          <text x="165" y="75" fontSize="12">⭐</text>
        </g>
      )}

      {/* FULL BODY LEGS & SHOES LAYER */}
      {isFull && (
        <g id="legs-and-shoes-layer">
          {/* Left Leg */}
          <rect x="125" y="295" width="22" height="75" rx="10" fill="url(#skinGrad)" />
          {/* Right Leg */}
          <rect x="173" y="295" width="22" height="75" rx="10" fill="url(#skinGrad)" />

          {/* Socks (White Frilly by default, or athletic for tracksuit) */}
          {outfit !== 'raincoat' && outfit !== 'winter_bear' && (
            <g id="socks">
              <rect x="123" y="340" width="26" height="25" rx="5" fill="#ffffff" stroke="#fbcfe8" strokeWidth="1" />
              <path d="M 121 340 Q 136 335 151 340" stroke="#f472b6" strokeWidth="2" fill="none" />
              <rect x="171" y="340" width="26" height="25" rx="5" fill="#ffffff" stroke="#fbcfe8" strokeWidth="1" />
              <path d="M 169 340 Q 184 335 199 340" stroke="#f472b6" strokeWidth="2" fill="none" />
            </g>
          )}

          {/* 1. CHERRY SHOES (Red Mary Janes) */}
          {shoes === 'cherry_shoes' && (
            <g id="shoes-cherry">
              {/* Left Shoe */}
              <ellipse cx="134" cy="385" rx="20" ry="12" fill="#e11d48" stroke="#be123c" strokeWidth="1.5" />
              <rect x="124" y="375" width="20" height="5" rx="2.5" fill="#fb7185" />
              <circle cx="146" cy="380" r="4" fill="#be123c" />
              <circle cx="143" cy="378" r="1" fill="#ffffff" />
              {/* Right Shoe */}
              <ellipse cx="186" cy="385" rx="20" ry="12" fill="#e11d48" stroke="#be123c" strokeWidth="1.5" />
              <rect x="176" y="375" width="20" height="5" rx="2.5" fill="#fb7185" />
              <circle cx="198" cy="380" r="4" fill="#be123c" />
              <circle cx="195" cy="378" r="1" fill="#ffffff" />
            </g>
          )}

          {/* 2. PRINCESS HEELS (Sparkling Violet / Glass) */}
          {shoes === 'princess_heels' && (
            <g id="shoes-princess">
              {/* Left Shoe */}
              <ellipse cx="134" cy="385" rx="20" ry="12" fill="#a855f7" stroke="#7e22ce" strokeWidth="1.5" />
              <circle cx="134" cy="382" r="5" fill="#facc15" />
              <text x="128" y="386" fontSize="10">⭐</text>
              {/* Right Shoe */}
              <ellipse cx="186" cy="385" rx="20" ry="12" fill="#a855f7" stroke="#7e22ce" strokeWidth="1.5" />
              <circle cx="186" cy="382" r="5" fill="#facc15" />
              <text x="180" y="386" fontSize="10">⭐</text>
            </g>
          )}

          {/* 3. BALLET SLIPPERS (Pink Satin Pointe with criss-cross ribbons) */}
          {shoes === 'ballet_slippers' && (
            <g id="shoes-ballet">
              {/* Left Ribbons */}
              <line x1="125" y1="330" x2="147" y2="350" stroke="#f472b6" strokeWidth="2.5" />
              <line x1="147" y1="330" x2="125" y2="350" stroke="#f472b6" strokeWidth="2.5" />
              <line x1="125" y1="350" x2="147" y2="370" stroke="#f472b6" strokeWidth="2.5" />
              <line x1="147" y1="350" x2="125" y2="370" stroke="#f472b6" strokeWidth="2.5" />
              {/* Left Slipper */}
              <ellipse cx="134" cy="385" rx="19" ry="11" fill="#f472b6" stroke="#db2777" strokeWidth="1.5" />
              <path d="M 125 382 Q 134 388 143 382" stroke="#ffffff" strokeWidth="1.5" fill="none" />
              {/* Right Ribbons */}
              <line x1="173" y1="330" x2="195" y2="350" stroke="#f472b6" strokeWidth="2.5" />
              <line x1="195" y1="330" x2="173" y2="350" stroke="#f472b6" strokeWidth="2.5" />
              <line x1="173" y1="350" x2="195" y2="370" stroke="#f472b6" strokeWidth="2.5" />
              <line x1="195" y1="350" x2="173" y2="370" stroke="#f472b6" strokeWidth="2.5" />
              {/* Right Slipper */}
              <ellipse cx="186" cy="385" rx="19" ry="11" fill="#f472b6" stroke="#db2777" strokeWidth="1.5" />
              <path d="M 177 382 Q 186 388 195 382" stroke="#ffffff" strokeWidth="1.5" fill="none" />
            </g>
          )}

          {/* 4. YELLOW RAINBOOTS (Rubber Boots) */}
          {shoes === 'yellow_rainboots' && (
            <g id="shoes-rainboots">
              {/* Left Boot */}
              <rect x="122" y="335" width="26" height="45" rx="6" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
              <ellipse cx="134" cy="386" rx="21" ry="12" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
              <rect x="120" y="388" width="28" height="6" rx="3" fill="#374151" />
              {/* Right Boot */}
              <rect x="172" y="335" width="26" height="45" rx="6" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
              <ellipse cx="186" cy="386" rx="21" ry="12" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
              <rect x="172" y="388" width="28" height="6" rx="3" fill="#374151" />
            </g>
          )}

          {/* 5. SPORT SNEAKERS (Cyan & Yellow) */}
          {shoes === 'sport_sneakers' && (
            <g id="shoes-sneakers">
              {/* Left Sneaker */}
              <ellipse cx="134" cy="385" rx="21" ry="12" fill="#06b6d4" stroke="#0891b2" strokeWidth="1.5" />
              <path d="M 120 380 L 140 375 L 148 385 Z" fill="#facc15" />
              <line x1="126" y1="378" x2="138" y2="378" stroke="#ffffff" strokeWidth="2" strokeDasharray="2 2" />
              <rect x="118" y="390" width="30" height="5" rx="2.5" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
              {/* Right Sneaker */}
              <ellipse cx="186" cy="385" rx="21" ry="12" fill="#06b6d4" stroke="#0891b2" strokeWidth="1.5" />
              <path d="M 172 380 L 192 375 L 200 385 Z" fill="#facc15" />
              <line x1="178" y1="378" x2="190" y2="378" stroke="#ffffff" strokeWidth="2" strokeDasharray="2 2" />
              <rect x="170" y="390" width="30" height="5" rx="2.5" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
            </g>
          )}

          {/* 6. WINTER BOOTS (Warm fluffy snow boots) */}
          {shoes === 'winter_boots' && (
            <g id="shoes-winter">
              {/* Left Boot */}
              <rect x="122" y="330" width="26" height="50" rx="7" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
              <rect x="119" y="325" width="32" height="12" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <ellipse cx="134" cy="385" rx="21" ry="13" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
              {/* Right Boot */}
              <rect x="172" y="330" width="26" height="50" rx="7" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
              <rect x="169" y="325" width="32" height="12" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <ellipse cx="186" cy="385" rx="21" ry="13" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
            </g>
          )}

          {/* 7. SUMMER SANDALS (Golden Sunflower) */}
          {shoes === 'summer_sandals' && (
            <g id="shoes-sandals">
              {/* Left Sandal */}
              <ellipse cx="134" cy="387" rx="19" ry="10" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
              <line x1="122" y1="384" x2="146" y2="384" stroke="#f59e0b" strokeWidth="3" />
              <circle cx="134" cy="384" r="5" fill="#fef08a" stroke="#d97706" strokeWidth="1" />
              <text x="129" y="388" fontSize="8">🌻</text>
              {/* Right Sandal */}
              <ellipse cx="186" cy="387" rx="19" ry="10" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
              <line x1="174" y1="384" x2="198" y2="384" stroke="#f59e0b" strokeWidth="3" />
              <circle cx="186" cy="384" r="5" fill="#fef08a" stroke="#d97706" strokeWidth="1" />
              <text x="181" y="388" fontSize="8">🌻</text>
            </g>
          )}

          {/* 8. RAINBOW GLOW SNEAKERS */}
          {shoes === 'rainbow_glow_sneakers' && (
            <g id="shoes-rainbow-sneakers">
              <ellipse cx="134" cy="385" rx="21" ry="12" fill="#ec4899" stroke="#db2777" strokeWidth="1.5" />
              <path d="M 115 385 Q 134 372 153 385" stroke="#38bdf8" strokeWidth="3" fill="none" />
              <circle cx="134" cy="385" r="4" fill="#facc15" />
              <rect x="118" y="390" width="30" height="5" rx="2.5" fill="#a855f7" />
              
              <ellipse cx="186" cy="385" rx="21" ry="12" fill="#ec4899" stroke="#db2777" strokeWidth="1.5" />
              <path d="M 167 385 Q 186 372 205 385" stroke="#38bdf8" strokeWidth="3" fill="none" />
              <circle cx="186" cy="385" r="4" fill="#facc15" />
              <rect x="170" y="390" width="30" height="5" rx="2.5" fill="#a855f7" />
            </g>
          )}

          {/* 9. UNICORN SLIPPERS */}
          {shoes === 'unicorn_slippers' && (
            <g id="shoes-unicorn">
              <ellipse cx="134" cy="384" rx="22" ry="14" fill="#fce7f3" stroke="#f472b6" strokeWidth="1.5" />
              <polygon points="144,372 148,362 152,374" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
              <circle cx="140" cy="378" r="2" fill="#000" />

              <ellipse cx="186" cy="384" rx="22" ry="14" fill="#fce7f3" stroke="#f472b6" strokeWidth="1.5" />
              <polygon points="196,372 200,362 204,374" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
              <circle cx="192" cy="378" r="2" fill="#000" />
            </g>
          )}

          {/* 10. GOLDEN STAR BOOTS */}
          {shoes === 'golden_star_boots' && (
            <g id="shoes-golden-star">
              <rect x="122" y="335" width="26" height="45" rx="6" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
              <ellipse cx="134" cy="386" rx="21" ry="12" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
              <text x="127" y="365" fontSize="14">⭐</text>

              <rect x="172" y="335" width="26" height="45" rx="6" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
              <ellipse cx="186" cy="386" rx="21" ry="12" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
              <text x="179" y="365" fontSize="14">⭐</text>
            </g>
          )}
        </g>
      )}

      {/* 2. BODY & OUTFIT (LOWER) */}
      <g id="outfit-layer">
        {/* Neck */}
        <rect x="145" y="195" width="30" height="24" rx="6" fill="url(#skinGrad)" />

        {/* --- OUTFIT 1: CHERRY DRESS --- */}
        {outfit === 'cherry_dress' && (
          <g id="outfit-cherry-dress">
            {/* Pink Dress Base */}
            <path d="M 115 215 C 105 240 95 300 90 320 L 230 320 C 225 300 215 240 205 215 Z" fill="url(#cherryDressGrad)" />
            {/* White/Pink Collar */}
            <path d="M 115 215 Q 160 235 205 215 L 195 240 Q 160 250 125 240 Z" fill="#fdf2f8" stroke="#f472b6" strokeWidth="2" />
            {/* Denim Jacket overlay sleeves */}
            <path d="M 95 220 C 80 240 80 280 90 300 L 115 285 L 115 225 Z" fill="#38bdf8" />
            <path d="M 225 220 C 240 240 240 280 230 300 L 205 285 L 205 225 Z" fill="#38bdf8" />
            {/* Cherries Pattern */}
            <circle cx="150" cy="275" r="7" fill="#e11d48" />
            <circle cx="165" cy="278" r="7" fill="#e11d48" />
            <path d="M 150 275 Q 158 260 160 255" stroke="#15803d" strokeWidth="2" fill="none" />
            <path d="M 165 278 Q 160 260 160 255" stroke="#15803d" strokeWidth="2" fill="none" />
            <circle cx="185" cy="295" r="6" fill="#e11d48" />
            <circle cx="196" cy="298" r="6" fill="#e11d48" />
          </g>
        )}

        {/* --- OUTFIT 2: PRINCESS DRESS --- */}
        {outfit === 'princess_dress' && (
          <g id="outfit-princess">
            <circle cx="105" cy="225" r="20" fill="#e9d5ff" />
            <circle cx="215" cy="225" r="20" fill="#e9d5ff" />
            <path d="M 120 215 Q 160 230 200 215 L 245 320 L 75 320 Z" fill="url(#princessGrad)" />
            <rect x="125" y="245" width="70" height="12" rx="4" fill="#fbbf24" />
            <polygon points="160,250 155,265 165,265" fill="#f59e0b" />
            <text x="110" y="295" fontSize="16" fill="#ffffff">✨</text>
            <text x="185" y="285" fontSize="18" fill="#ffffff">✨</text>
            <text x="150" y="315" fontSize="14" fill="#ffffff">⭐</text>
          </g>
        )}

        {/* --- OUTFIT 3: BALLERINA DRESS (NEW) --- */}
        {outfit === 'ballerina_dress' && (
          <g id="outfit-ballerina">
            {/* Satin Straps & Bodice */}
            <path d="M 120 215 L 110 270 L 210 270 L 200 215 Z" fill="url(#ballerinaGrad)" />
            <path d="M 120 215 Q 160 232 200 215 L 195 240 Q 160 250 125 240 Z" fill="#fdf2f8" stroke="#f472b6" strokeWidth="2" />
            {/* Criss-cross bodice sparkles */}
            <line x1="130" y1="230" x2="190" y2="265" stroke="#fbcfe8" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="190" y1="230" x2="130" y2="265" stroke="#fbcfe8" strokeWidth="2" strokeDasharray="3 3" />
            {/* Puffy layered tulle tutu */}
            <path d="M 85 270 Q 160 255 235 270 L 260 318 Q 160 332 60 318 Z" fill="url(#tutuGrad)" opacity="0.95" />
            <path d="M 75 278 Q 160 265 245 278 L 265 322 Q 160 338 55 322 Z" fill="#ffffff" opacity="0.35" />
            {/* Sparkles on Tutu */}
            <circle cx="115" cy="295" r="3.5" fill="#ffffff" />
            <circle cx="160" cy="305" r="4" fill="#ffffff" />
            <circle cx="205" cy="295" r="3.5" fill="#ffffff" />
            <text x="148" y="268" fontSize="16">🩰</text>
          </g>
        )}

        {/* --- OUTFIT 4: SPORT TRACKSUIT --- */}
        {outfit === 'sport_tracksuit' && (
          <g id="outfit-sport">
            <path d="M 105 215 L 85 300 L 120 300 L 120 320 L 200 320 L 200 300 L 235 300 L 215 215 Z" fill="url(#sportGrad)" />
            <path d="M 105 220 L 95 300" stroke="#facc15" strokeWidth="6" strokeLinecap="round" />
            <path d="M 215 220 L 225 300" stroke="#facc15" strokeWidth="6" strokeLinecap="round" />
            <line x1="160" y1="220" x2="160" y2="300" stroke="#ffffff" strokeWidth="3" strokeDasharray="4,2" />
            <circle cx="140" cy="245" r="10" fill="#facc15" />
            <text x="135" y="249" fontSize="10" fontWeight="bold">⚡</text>
          </g>
        )}

        {/* --- OUTFIT 5: SUNNY OVERALLS --- */}
        {outfit === 'sunny_overalls' && (
          <g id="outfit-overalls">
            <path d="M 105 215 L 215 215 L 225 250 L 95 250 Z" fill="#ffffff" />
            <rect x="120" y="235" width="80" height="85" rx="10" fill="url(#overallsGrad)" />
            <rect x="125" y="215" width="14" height="40" rx="4" fill="#eab308" />
            <circle cx="132" cy="248" r="4" fill="#78350f" />
            <rect x="181" y="215" width="14" height="40" rx="4" fill="#eab308" />
            <circle cx="188" cy="248" r="4" fill="#78350f" />
            <circle cx="160" cy="285" r="18" fill="#fef08a" opacity="0.6" />
            <text x="148" y="293" fontSize="24">🌼</text>
          </g>
        )}

        {/* --- OUTFIT 6: RAINCOAT & POLKA DOTS --- */}
        {outfit === 'raincoat' && (
          <g id="outfit-raincoat">
            <path d="M 105 215 L 80 310 L 240 310 L 215 215 Z" fill="url(#raincoatGrad)" />
            <circle cx="160" cy="240" r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
            <circle cx="160" cy="265" r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
            <circle cx="160" cy="290" r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
            <circle cx="125" cy="250" r="6" fill="#ffffff" opacity="0.85" />
            <circle cx="195" cy="255" r="6" fill="#ffffff" opacity="0.85" />
            <circle cx="135" cy="285" r="7" fill="#ffffff" opacity="0.85" />
            <circle cx="185" cy="295" r="7" fill="#ffffff" opacity="0.85" />
            <circle cx="110" cy="295" r="5" fill="#ffffff" opacity="0.85" />
          </g>
        )}

        {/* --- OUTFIT 7: COZY PAJAMA --- */}
        {outfit === 'cozy_pajama' && (
          <g id="outfit-pajama">
            <path d="M 110 215 L 85 310 L 235 310 L 210 215 Z" fill="url(#pajamaGrad)" />
            <text x="120" y="260" fontSize="20">☁️</text>
            <text x="175" y="270" fontSize="18">🌙</text>
            <text x="135" y="300" fontSize="16">⭐</text>
            <text x="180" y="305" fontSize="18">☁️</text>
          </g>
        )}

        {/* --- OUTFIT 8: FAIRY PRINCESS --- */}
        {outfit === 'fairy_princess' && (
          <g id="outfit-fairy">
            <path d="M 110 215 L 75 310 L 245 310 L 210 215 Z" fill="url(#fairyGrad)" />
            <path d="M 75 310 Q 105 295 130 310 Q 160 295 190 310 Q 215 295 245 310" stroke="#bef264" strokeWidth="3" fill="none" />
            <rect x="110" y="235" width="100" height="8" rx="4" fill="#fef08a" />
            <circle cx="160" cy="239" r="8" fill="#f43f5e" />
            <circle cx="160" cy="239" r="4" fill="#fef08a" />
            <text x="125" y="280" fontSize="18">✨</text>
            <text x="175" y="280" fontSize="18">🌸</text>
          </g>
        )}

        {/* --- OUTFIT 9: HOLIDAY PARTY --- */}
        {outfit === 'holiday_party' && (
          <g id="outfit-party">
            <path d="M 108 215 L 78 310 L 242 310 L 212 215 Z" fill="url(#partyGrad)" />
            <line x1="82" y1="302" x2="238" y2="302" stroke="#fbbf24" strokeWidth="4" />
            <path d="M 140 235 L 160 242 L 180 235 L 175 252 L 160 245 L 145 252 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
            <circle cx="160" cy="242" r="5" fill="#fef08a" />
            <text x="120" y="285" fontSize="16">⭐</text>
            <text x="180" y="285" fontSize="16">⭐</text>
          </g>
        )}

        {/* --- OUTFIT 10: SUNFLOWER SUMMER --- */}
        {outfit === 'sunflower_summer' && (
          <g id="outfit-summer">
            <path d="M 112 215 L 82 310 L 238 310 L 208 215 Z" fill="url(#summerGrad)" />
            <text x="115" y="265" fontSize="20">🌻</text>
            <text x="175" y="265" fontSize="20">🌻</text>
            <text x="145" y="300" fontSize="22">🌻</text>
            <line x1="86" y1="305" x2="234" y2="305" stroke="#ffffff" strokeWidth="4" strokeDasharray="6 4" />
          </g>
        )}

        {/* --- OUTFIT 11: WINTER BEAR COAT --- */}
        {outfit === 'winter_bear' && (
          <g id="outfit-winter">
            <path d="M 105 215 L 80 310 L 240 310 L 215 215 Z" fill="url(#winterGrad)" />
            <rect x="105" y="212" width="110" height="14" rx="7" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="78" y="298" width="164" height="14" rx="7" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <circle cx="160" cy="265" r="14" fill="#fed7aa" />
            <circle cx="152" cy="254" r="5" fill="#fed7aa" />
            <circle cx="168" cy="254" r="5" fill="#fed7aa" />
            <text x="150" y="272" fontSize="14">🧸</text>
          </g>
        )}

        {/* --- OUTFIT 12: SUPERHERO COSTUME --- */}
        {outfit === 'superhero_costume' && (
          <g id="outfit-superhero">
            {/* Cape */}
            <path d="M 100 215 C 60 250 50 320 40 340 L 280 340 C 270 320 260 250 220 215 Z" fill="#f43f5e" />
            {/* Suit */}
            <path d="M 110 215 L 90 310 L 230 310 L 210 215 Z" fill="#3b82f6" />
            {/* Belt */}
            <rect x="110" y="260" width="100" height="12" rx="4" fill="#fbbf24" />
            {/* Emblem */}
            <polygon points="160,230 145,245 152,260 168,260 175,245" fill="#facc15" stroke="#d97706" strokeWidth="1.5" />
            <text x="153" y="253" fontSize="14" fontWeight="bold" fill="#be123c">⭐</text>
          </g>
        )}

        {/* --- OUTFIT 13: MERMAID DRESS --- */}
        {outfit === 'mermaid_dress' && (
          <g id="outfit-mermaid">
            <path d="M 112 215 L 95 285 Q 160 300 225 285 L 208 215 Z" fill="#2dd4bf" />
            {/* Fin Skirt */}
            <path d="M 95 285 L 75 325 Q 160 300 245 325 L 225 285 Z" fill="#06b6d4" />
            <text x="118" y="250" fontSize="18">🧜‍♀️</text>
            <text x="175" y="250" fontSize="18">✨</text>
          </g>
        )}

        {/* --- OUTFIT 14: UNICORN ONESIE --- */}
        {outfit === 'unicorn_onesie' && (
          <g id="outfit-unicorn-onesie">
            <path d="M 105 215 L 80 315 L 240 315 L 215 215 Z" fill="#fce7f3" stroke="#f472b6" strokeWidth="2" />
            <circle cx="160" cy="265" r="22" fill="#ffffff" />
            <text x="148" y="272" fontSize="20">🦄</text>
          </g>
        )}

        {/* --- OUTFIT 15: CHEF OUTFIT --- */}
        {outfit === 'chef_outfit' && (
          <g id="outfit-chef">
            <path d="M 105 215 L 80 310 L 240 310 L 215 215 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <rect x="120" y="230" width="80" height="70" rx="6" fill="#f87171" opacity="0.8" />
            <circle cx="145" cy="250" r="4" fill="#fbbf24" />
            <circle cx="175" cy="250" r="4" fill="#fbbf24" />
            <circle cx="145" cy="275" r="4" fill="#fbbf24" />
            <circle cx="175" cy="275" r="4" fill="#fbbf24" />
            <text x="150" y="295" fontSize="16">👩‍🍳</text>
          </g>
        )}

        {/* --- OUTFIT 16: SNOW QUEEN --- */}
        {outfit === 'snow_queen' && (
          <g id="outfit-snow-queen">
            <path d="M 108 215 L 70 320 L 250 320 L 212 215 Z" fill="#7dd3fc" stroke="#0284c7" strokeWidth="1.5" />
            <path d="M 90 250 Q 160 270 230 250 L 245 320 L 75 320 Z" fill="#e0f2fe" opacity="0.7" />
            <text x="120" y="280" fontSize="20">❄️</text>
            <text x="175" y="280" fontSize="20">❄️</text>
            <text x="148" y="305" fontSize="18">✨</text>
          </g>
        )}
      </g>

      {/* 3. HEAD & FACE */}
      <g id="head-layer">
        {/* Face oval */}
        <circle cx="160" cy="140" r="64" fill="url(#skinGrad)" />

        {/* Ears */}
        <circle cx="95" cy="145" r="14" fill="url(#skinGrad)" />
        <circle cx="225" cy="145" r="14" fill="url(#skinGrad)" />

        {/* Rosy Cheeks */}
        <ellipse cx="122" cy="160" rx="14" ry="9" fill="#f43f5e" opacity="0.35" />
        <ellipse cx="198" cy="160" rx="14" ry="9" fill="#f43f5e" opacity="0.35" />

        {/* Cute 4-year-old Button Nose */}
        <circle cx="160" cy="148" r="3.5" fill="#fb7185" opacity="0.6" />

        {/* Eyes (Customizable Color) */}
        {mood === 'sleepy' ? (
          <g id="eyes-sleepy">
            <path d="M 125 138 Q 138 148 150 138" stroke="#713f12" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 170 138 Q 182 148 195 138" stroke="#713f12" strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
        ) : (
          <g id="eyes-open">
            {/* Left Eye */}
            <circle cx="136" cy="136" r="14" fill="#ffffff" />
            <circle cx="136" cy="136" r="11" fill={currentEye.dark} />
            <circle cx="136" cy="136" r="9" fill={currentEye.main} />
            <circle cx="136" cy="136" r="5" fill="#0f172a" />
            <circle cx="133" cy="132" r="3.5" fill="#ffffff" />
            <circle cx="139" cy="138" r="1.5" fill="#ffffff" />
            <path d="M 124 126 Q 136 122 148 126" stroke="#451a03" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* Right Eye */}
            <circle cx="184" cy="136" r="14" fill="#ffffff" />
            <circle cx="184" cy="136" r="11" fill={currentEye.dark} />
            <circle cx="184" cy="136" r="9" fill={currentEye.main} />
            <circle cx="184" cy="136" r="5" fill="#0f172a" />
            <circle cx="181" cy="132" r="3.5" fill="#ffffff" />
            <circle cx="187" cy="138" r="1.5" fill="#ffffff" />
            <path d="M 172 126 Q 184 122 196 126" stroke="#451a03" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* Mouth */}
        {mood === 'eating' ? (
          <path d="M 148 168 Q 160 184 172 168 Q 160 178 148 168 Z" fill="#e11d48" />
        ) : (
          <path
            d="M 146 166 Q 160 182 174 166"
            stroke="#be185d"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
        )}
      </g>

      {/* 4. FRONT HAIR (BANGS & STYLES) */}
      <g id="front-hair">
        <path
          d="M 98 125 C 105 85 140 78 160 92 C 180 78 215 85 222 125 C 205 105 180 102 160 110 C 140 102 115 105 98 125 Z"
          fill="url(#hairGrad)"
        />

        {hairstyle === 'loose_waves' && (
          <g>
            <path
              d="M 100 120 C 90 150 95 180 105 200 C 108 175 110 140 115 125 Z"
              fill="url(#hairGrad)"
            />
            <path
              d="M 220 120 C 230 150 225 180 215 200 C 212 175 210 140 205 125 Z"
              fill="url(#hairGrad)"
            />
            <path
              d="M 100 115 Q 160 75 220 115"
              stroke="#ec4899"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        )}
      </g>

      {/* 5. ACCESSORIES OVERLAY */}
      <g id="accessory-layer">
        {accessory === 'flower' && (
          <g transform="translate(195, 75)">
            <circle cx="15" cy="15" r="14" fill="#f43f5e" />
            <circle cx="15" cy="15" r="7" fill="#fde047" />
            <text x="6" y="22" fontSize="16">🌸</text>
          </g>
        )}

        {accessory === 'crown' && (
          <g transform="translate(130, 45)">
            <path d="M 0 30 L 10 5 L 30 20 L 50 5 L 60 30 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
            <circle cx="10" cy="5" r="4" fill="#ec4899" />
            <circle cx="30" cy="18" r="4" fill="#38bdf8" />
            <circle cx="50" cy="5" r="4" fill="#ec4899" />
            <circle cx="30" cy="28" r="3" fill="#ffffff" />
          </g>
        )}

        {accessory === 'heart_glasses' && (
          <g id="heart-glasses" transform="translate(112, 122)">
            <path
              d="M 25 10 A 8 8 0 0 0 10 18 C 10 26 25 36 25 36 C 25 36 40 26 40 18 A 8 8 0 0 0 25 10 Z"
              fill="#f43f5e"
              opacity="0.85"
              stroke="#be123c"
              strokeWidth="2.5"
            />
            <line x1="38" y1="18" x2="58" y2="18" stroke="#be123c" strokeWidth="3" />
            <path
              d="M 71 10 A 8 8 0 0 0 56 18 C 56 26 71 36 71 36 C 71 36 86 26 86 18 A 8 8 0 0 0 71 10 Z"
              fill="#f43f5e"
              opacity="0.85"
              stroke="#be123c"
              strokeWidth="2.5"
            />
          </g>
        )}

        {accessory === 'cat_ears' && (
          <g id="cat-ears">
            <path d="M 115 95 Q 160 70 205 95" stroke="#ec4899" strokeWidth="4" fill="none" />
            <polygon points="110,95 125,55 140,85" fill="#f472b6" stroke="#db2777" strokeWidth="2" />
            <polygon points="116,90 126,65 135,85" fill="#fbcfe8" />
            <polygon points="210,95 195,55 180,85" fill="#f472b6" stroke="#db2777" strokeWidth="2" />
            <polygon points="204,90 194,65 185,85" fill="#fbcfe8" />
          </g>
        )}

        {accessory === 'flower_crown' && (
          <g id="flower-crown" transform="translate(100, 75)">
            <path d="M 0 35 Q 60 10 120 35" stroke="#22c55e" strokeWidth="3" fill="none" />
            <text x="5" y="32" fontSize="16">🌸</text>
            <text x="32" y="24" fontSize="16">🌼</text>
            <text x="56" y="20" fontSize="18">🌹</text>
            <text x="82" y="24" fontSize="16">🌼</text>
            <text x="105" y="32" fontSize="16">🌸</text>
          </g>
        )}

        {accessory === 'guinea_pig_pin' && (
          <g id="guinea-pig-pin" transform="translate(125, 230)">
            <circle cx="16" cy="16" r="15" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
            <text x="6" y="22" fontSize="18">🐹</text>
            <circle cx="25" cy="8" r="4" fill="#ec4899" />
          </g>
        )}

        {accessory === 'party_hat' && (
          <g id="party-hat" transform="translate(138, 25)">
            <polygon points="22,0 0,60 44,60" fill="#ec4899" stroke="#db2777" strokeWidth="2" />
            <path d="M 6 42 Q 22 46 38 42" stroke="#fef08a" strokeWidth="4" fill="none" />
            <path d="M 12 25 Q 22 28 32 25" stroke="#38bdf8" strokeWidth="4" fill="none" />
            <circle cx="22" cy="0" r="7" fill="#fef08a" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="28" y="15" fontSize="12">✨</text>
          </g>
        )}

        {accessory === 'winter_beanie' && (
          <g id="winter-beanie" transform="translate(108, 60)">
            <path d="M 0 50 Q 52 5 104 50 Z" fill="#818cf8" stroke="#4f46e5" strokeWidth="2" />
            <rect x="-2" y="44" width="108" height="14" rx="7" fill="#c7d2fe" stroke="#4f46e5" strokeWidth="1.5" />
            <circle cx="52" cy="16" r="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <text x="44" y="21" fontSize="14">❄️</text>
          </g>
        )}

        {accessory === 'unicorn_headband' && (
          <g id="unicorn-headband" transform="translate(110, 50)">
            <path d="M 0 45 Q 50 25 100 45" stroke="#ec4899" strokeWidth="5" fill="none" />
            <polygon points="50,0 42,35 58,35" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
            <text x="32" y="40" fontSize="14">🌸</text>
            <text x="54" y="40" fontSize="14">🌸</text>
          </g>
        )}

        {accessory === 'superhero_mask' && (
          <g id="superhero-mask" transform="translate(112, 125)">
            <path d="M 0 12 Q 24 -5 48 15 Q 72 -5 96 12 Q 85 40 48 25 Q 11 40 0 12 Z" fill="#f43f5e" stroke="#be123c" strokeWidth="2" />
            <ellipse cx="24" cy="12" rx="10" ry="6" fill="#ffffff" />
            <ellipse cx="72" cy="12" rx="10" ry="6" fill="#ffffff" />
          </g>
        )}

        {accessory === 'magic_star_wand' && (
          <g id="magic-star-wand" transform="translate(200, 160)">
            <line x1="10" y1="60" x2="35" y2="10" stroke="#fbbf24" strokeWidth="4" />
            <text x="22" y="15" fontSize="24">⭐</text>
          </g>
        )}

        {accessory === 'butterfly_clip' && (
          <g id="butterfly-clip" transform="translate(190, 85)">
            <text x="0" y="20" fontSize="24">🦋</text>
          </g>
        )}
      </g>
    </svg>
  );
};
