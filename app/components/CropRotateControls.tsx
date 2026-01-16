"use client";

import { Theme } from "../hooks/useTheme";

interface Props {
  onRotate: () => void;
  onCrop: () => void;
  theme: Theme;
}

export default function CropRotateControls({ onRotate, onCrop, theme }: Props) {
  const handleRotate = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRotate();
  };

  const handleCrop = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCrop();
  };

  return (
    <div 
      className="flex gap-2" 
      style={{ 
        touchAction: 'manipulation',
        WebkitTouchCallout: 'none',
        userSelect: 'none'
      }}
    >
      {/* Rotate Button */}
      <button
        onClick={handleRotate}
        onTouchEnd={handleRotate}
        className={`flex items-center justify-center w-10 h-10 rounded-lg font-semibold text-sm shadow-lg select-none cursor-pointer ${
          theme === 'dark'
            ? 'bg-white text-black active:bg-neutral-300'
            : 'bg-black text-white active:bg-neutral-700'
        }`}
        style={{
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          WebkitTouchCallout: 'none'
        }}
        type="button"
        aria-label="Rotate 90°"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pointerEvents: 'none' }}
        >
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
        </svg>
      </button>

      {/* Crop Button */}
      <button
        onClick={handleCrop}
        onTouchEnd={handleCrop}
        className={`flex items-center justify-center w-10 h-10 rounded-lg font-semibold text-sm shadow-lg select-none cursor-pointer ${
          theme === 'dark'
            ? 'bg-white text-black active:bg-neutral-300'
            : 'bg-black text-white active:bg-neutral-700'
        }`}
        style={{
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          WebkitTouchCallout: 'none'
        }}
        type="button"
        aria-label="Crop Image"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pointerEvents: 'none' }}
        >
          <path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"/>
          <path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"/>
        </svg>
      </button>
    </div>
  );
}