"use client";

import { Theme } from "../hooks/useTheme";

interface Props {
  isBold: boolean;
  setIsBold: (val: boolean) => void;
  isItalic: boolean;
  setIsItalic: (val: boolean) => void;
  isUnderline: boolean;
  setIsUnderline: (val: boolean) => void;
  theme: Theme;
}

export default function TextStyles({
  isBold,
  setIsBold,
  isItalic,
  setIsItalic,
  isUnderline,
  setIsUnderline,
  theme,
}: Props) {
  return (
    <div>
      <label className={`block text-xs font-semibold mb-3 uppercase tracking-wider ${
        theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
      }`}>
        Text Styles
      </label>
      <div className="flex gap-2">
        {/* Bold Button */}
        <button
          onClick={() => setIsBold(!isBold)}
          className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition ${
            isBold
              ? theme === 'dark'
                ? 'bg-white text-black'
                : 'bg-black text-white'
              : theme === 'dark'
              ? 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
          }`}
          title="Bold"
        >
          <span style={{ fontWeight: 'bold' }}>B</span>
        </button>

        {/* Italic Button */}
        <button
          onClick={() => setIsItalic(!isItalic)}
          className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition ${
            isItalic
              ? theme === 'dark'
                ? 'bg-white text-black'
                : 'bg-black text-white'
              : theme === 'dark'
              ? 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
          }`}
          title="Italic"
        >
          <span style={{ fontStyle: 'italic' }}>I</span>
        </button>

        {/* Underline Button */}
        <button
          onClick={() => setIsUnderline(!isUnderline)}
          className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition ${
            isUnderline
              ? theme === 'dark'
                ? 'bg-white text-black'
                : 'bg-black text-white'
              : theme === 'dark'
              ? 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
          }`}
          title="Underline"
        >
          <span style={{ textDecoration: 'underline' }}>U</span>
        </button>
      </div>
    </div>
  );
}
