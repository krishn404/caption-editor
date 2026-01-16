"use client";

import { Theme } from "../hooks/useTheme";


interface Props {
  subtitle: string;
  setSubtitle: (val: string) => void;
  theme: Theme;
}

export default function SubtitleInput({ subtitle, setSubtitle, theme }: Props) {
  return (
    <div>
      <label className={`block text-xs font-semibold mb-2 uppercase tracking-wider ${
        theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
      }`}>
        Subtitle
      </label>
      <textarea
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        placeholder="Enter subtitle text..."
        className={`w-full px-3 py-2 border rounded text-sm focus:outline-none resize-none ${
          theme === 'dark'
            ? 'bg-neutral-900 border-neutral-700 focus:border-neutral-500 text-white placeholder-neutral-500'
            : 'bg-white border-neutral-300 focus:border-neutral-500 text-black placeholder-neutral-400'
        }`}
        rows={4}
      />
      <p className={`text-xs mt-1 ${
        theme === 'dark' ? 'text-neutral-600' : 'text-neutral-500'
      }`}>
        Press Shift+Enter for line breaks
      </p>
    </div>
  );
}