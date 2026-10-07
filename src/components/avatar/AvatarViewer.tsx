import React, { useState } from 'react';
import { AvatarCustomization } from '../../types/roblox';

interface AvatarViewerProps {
  config: AvatarCustomization;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  animate?: boolean;
}

export const AvatarViewer: React.FC<AvatarViewerProps> = ({
  config,
  size = 'lg',
  interactive = true,
  animate = true
}) => {
  const [rotation, setRotation] = useState<number>(15);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [currentAnim] = useState<'idle' | 'dance' | 'wave'>('idle');

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startX;
    setRotation(prev => (prev + delta * 0.8) % 360);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const dimensions = {
    sm: { width: 44, height: 44, viewBox: '0 0 200 240' },
    md: { width: 90, height: 100, viewBox: '0 0 200 240' },
    lg: { width: 220, height: 260, viewBox: '0 0 200 240' },
    xl: { width: 320, height: 380, viewBox: '0 0 200 240' }
  }[size];

  const skin = config.skinColor || '#facc15';
  const torso = config.torsoColor || config.skinColor || '#0284c7';
  const leftLeg = config.leftLegColor || '#16a34a';
  const rightLeg = config.rightLegColor || '#16a34a';

  // Equipped cosmetics
  const hasWings = config.equippedAccessory?.id === 'acc-wings';
  const hasKatana = config.equippedAccessory?.id === 'acc-katana';
  const hatType = config.equippedHat?.id;
  const faceType = config.equippedFace?.id;
  const shirtColor = config.equippedShirt?.colorHex || torso;
  const pantsColor = config.equippedPants?.colorHex || leftLeg;

  // Calculate faux 3D skew based on rotation angle
  const rad = (rotation * Math.PI) / 180;
  const perspectiveOffsetX = Math.sin(rad) * 12;

  return (
    <div 
      className={`relative select-none flex items-center justify-center ${interactive ? 'cursor-grab active:cursor-grabbing' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      title={interactive ? 'Click and drag left/right to rotate avatar' : ''}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={dimensions.viewBox}
        className={`overflow-visible filter drop-shadow-md transition-transform duration-75 ${animate ? 'hover:scale-105' : ''}`}
      >
        <defs>
          <linearGradient id="avatarShading" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
        </defs>

        {/* Back Accessory: Sparkle Time Wings */}
        {hasWings && (
          <g transform={`translate(${100 + perspectiveOffsetX * -0.5}, 110)`} filter="url(#glow)">
            <path
              d="M -15 -20 C -60 -70, -95 -40, -85 10 C -80 35, -50 40, -10 15 Z"
              fill="#9333ea"
              fillOpacity="0.9"
            />
            <path
              d="M 15 -20 C 60 -70, 95 -40, 85 10 C 80 35, 50 40, 10 15 Z"
              fill="#9333ea"
              fillOpacity="0.9"
            />
            {/* Sparkles */}
            <circle cx="-60" cy="-30" r="3" fill="#FFFFFF" className="animate-ping" />
            <circle cx="60" cy="-30" r="3" fill="#FFFFFF" className="animate-ping" />
          </g>
        )}

        {/* Back Accessory: Golden Katana Sheath */}
        {hasKatana && (
          <g transform={`translate(${100 + perspectiveOffsetX * -0.3}, 115) rotate(35)`}>
            <rect x="-6" y="-65" width="12" height="110" rx="3" fill="#1e293b" stroke="#eab308" strokeWidth="2" />
            <rect x="-10" y="-70" width="20" height="6" rx="2" fill="#ca8a04" />
            <rect x="-4" y="-95" width="8" height="25" rx="2" fill="#facc15" stroke="#854d0e" strokeWidth="1" />
          </g>
        )}

        {/* Left Arm */}
        <g transform={`translate(${48 - perspectiveOffsetX * 0.4}, 90)`}>
          <rect
            x="0"
            y="0"
            width="26"
            height="72"
            rx="4"
            fill={shirtColor}
            stroke="#18181b"
            strokeWidth="1.5"
          />
          {/* Hand */}
          <rect
            x="1"
            y="52"
            width="24"
            height="18"
            rx="3"
            fill={skin}
          />
        </g>

        {/* Right Arm */}
        <g transform={`translate(${126 + perspectiveOffsetX * 0.4}, 90)`}>
          <rect
            x="0"
            y="0"
            width="26"
            height="72"
            rx="4"
            fill={shirtColor}
            stroke="#18181b"
            strokeWidth="1.5"
          />
          {/* Hand */}
          <rect
            x="1"
            y="52"
            width="24"
            height="18"
            rx="3"
            fill={skin}
          />
        </g>

        {/* Left Leg */}
        <g transform={`translate(${74 - perspectiveOffsetX * 0.2}, 152)`}>
          <rect
            x="0"
            y="0"
            width="24"
            height="70"
            rx="3"
            fill={pantsColor}
            stroke="#18181b"
            strokeWidth="1.5"
          />
          {/* Shoe */}
          <rect
            x="0"
            y="58"
            width="24"
            height="12"
            rx="2"
            fill="#09090b"
          />
        </g>

        {/* Right Leg */}
        <g transform={`translate(${102 + perspectiveOffsetX * 0.2}, 152)`}>
          <rect
            x="0"
            y="0"
            width="24"
            height="70"
            rx="3"
            fill={pantsColor}
            stroke="#18181b"
            strokeWidth="1.5"
          />
          {/* Shoe */}
          <rect
            x="0"
            y="58"
            width="24"
            height="12"
            rx="2"
            fill="#09090b"
          />
        </g>

        {/* Torso */}
        <g transform={`translate(74, 90)`}>
          <rect
            x="0"
            y="0"
            width="52"
            height="64"
            rx="5"
            fill={shirtColor}
            stroke="#18181b"
            strokeWidth="1.5"
          />
          <rect
            x="0"
            y="0"
            width="52"
            height="64"
            rx="5"
            fill="url(#avatarShading)"
          />
          {/* Roblox Chest Logo if Classic Blue */}
          {config.equippedShirt?.id === 'shirt-retro' && (
            <g transform="translate(18, 18)">
              <rect x="0" y="0" width="16" height="16" rx="2" fill="#FFFFFF" />
              <rect x="4" y="4" width="8" height="8" rx="1" fill="#e11d48" />
            </g>
          )}
          {/* Belt line */}
          <line x1="0" y1="62" x2="52" y2="62" stroke="#0f172a" strokeWidth="2" />
        </g>

        {/* Head */}
        <g transform={`translate(${80 + perspectiveOffsetX * 0.1}, 44)`}>
          {/* Head Block */}
          <rect
            x="0"
            y="0"
            width="40"
            height="42"
            rx="7"
            fill={skin}
            stroke="#18181b"
            strokeWidth="1.5"
          />
          <rect
            x="0"
            y="0"
            width="40"
            height="42"
            rx="7"
            fill="url(#avatarShading)"
          />

          {/* Facial Expression */}
          {faceType === 'face-epic' ? (
            /* Epic Face :D */
            <g transform="translate(6, 10)">
              {/* Giant happy eyes */}
              <circle cx="9" cy="8" r="4.5" fill="#18181b" />
              <circle cx="19" cy="8" r="4.5" fill="#18181b" />
              <circle cx="8" cy="7" r="1.5" fill="#FFFFFF" />
              <circle cx="18" cy="7" r="1.5" fill="#FFFFFF" />
              {/* Epic wide open D mouth */}
              <path d="M 5 18 Q 14 30 23 18 Z" fill="#991b1b" stroke="#18181b" strokeWidth="1.5" />
              <path d="M 7 18 Q 14 22 21 18 Z" fill="#FFFFFF" />
            </g>
          ) : faceType === 'face-super-happy' ? (
            /* Super Super Happy Face */
            <g transform="translate(6, 12)">
              <path d="M 6 6 Q 10 2 14 6" fill="none" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 16 6 Q 20 2 24 6" fill="none" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" />
              {/* Rosy cheeks */}
              <circle cx="5" cy="12" r="3" fill="#f43f5e" opacity="0.6" />
              <circle cx="23" cy="12" r="3" fill="#f43f5e" opacity="0.6" />
              <path d="M 8 13 Q 14 24 20 13 Z" fill="#e11d48" stroke="#18181b" strokeWidth="1.2" />
            </g>
          ) : (
            /* Chill Face / Standard smile */
            <g transform="translate(8, 12)">
              {/* Chill sunglasses / calm eyes */}
              <line x1="5" y1="8" x2="11" y2="8" stroke="#18181b" strokeWidth="3" strokeLinecap="round" />
              <line x1="15" y1="8" x2="21" y2="8" stroke="#18181b" strokeWidth="3" strokeLinecap="round" />
              {/* Chill gentle smirk */}
              <path d="M 8 16 Q 13 20 18 16" fill="none" stroke="#18181b" strokeWidth="2.2" strokeLinecap="round" />
            </g>
          )}

          {/* Equipped Hats / Hair */}
          {hatType === 'hat-valk' && (
            /* Valkyrie Helm */
            <g transform="translate(-10, -18)">
              {/* Wings on helm */}
              <path d="M 0 10 C -15 -10, -5 -30, 15 -10 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
              <path d="M 60 10 C 75 -10, 65 -30, 45 -10 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
              {/* Gold Circlet */}
              <path d="M 5 22 Q 30 14 55 22" fill="none" stroke="#facc15" strokeWidth="5" />
              <circle cx="30" cy="16" r="4" fill="#38bdf8" stroke="#facc15" strokeWidth="2" />
            </g>
          )}

          {hatType === 'hat-dominus' && (
            /* Dominus Aureus Hood */
            <g transform="translate(-8, -12)">
              <path
                d="M 5 44 C 0 10, 15 -10, 28 -10 C 41 -10, 56 10, 51 44 Z"
                fill="#d97706"
                stroke="#78350f"
                strokeWidth="2"
              />
              <path
                d="M 12 38 C 16 12, 24 6, 28 6 C 32 6, 40 12, 44 38 Z"
                fill="#18181b"
              />
              {/* Golden buttons and feathers */}
              <circle cx="16" cy="30" r="3.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
              <circle cx="40" cy="30" r="3.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
            </g>
          )}

          {hatType === 'hat-fedora' && (
            /* Classic Black Fedora */
            <g transform="translate(-10, -16)">
              {/* Fedora Brim */}
              <ellipse cx="30" cy="24" rx="34" ry="10" fill="#18181b" stroke="#09090b" strokeWidth="1.5" />
              {/* Fedora Crown */}
              <path d="M 14 22 C 14 2, 22 2, 30 4 C 38 2, 46 2, 46 22 Z" fill="#27272a" />
              {/* Crimson Band */}
              <path d="M 14 20 Q 30 24 46 20" fill="none" stroke="#ef4444" strokeWidth="4" />
            </g>
          )}

          {hatType === 'hat-clockwork' && (
            /* Clockwork Headphones */
            <g transform="translate(-12, -4)">
              <path d="M 8 20 C 8 -12, 56 -12, 56 20" fill="none" stroke="#0284c7" strokeWidth="5" />
              {/* Left ear cup */}
              <circle cx="6" cy="22" r="10" fill="#0369a1" stroke="#facc15" strokeWidth="2.5" />
              {/* Right ear cup */}
              <circle cx="58" cy="22" r="10" fill="#0369a1" stroke="#facc15" strokeWidth="2.5" />
              {/* Gear cog accents */}
              <circle cx="6" cy="22" r="3" fill="#facc15" />
              <circle cx="58" cy="22" r="3" fill="#facc15" />
            </g>
          )}
        </g>
      </svg>

      {/* Floating 360 label */}
      {interactive && size !== 'sm' && (
        <div className="absolute bottom-1 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] text-zinc-300 pointer-events-none flex items-center gap-1 border border-zinc-700/60 shadow">
          <span>🔄</span>
          <span>Drag to rotate</span>
        </div>
      )}
    </div>
  );
};
