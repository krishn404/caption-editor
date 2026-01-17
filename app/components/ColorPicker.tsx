"use client";

import { useState } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { Theme } from "../hooks/useTheme";

interface Props {
  title: string;
  value: string;
  onChange: (val: string) => void;
  theme: Theme;
}

// Generate a comprehensive color palette with multiple hues and brightness levels
const generateColorPalette = () => {
  const colors: string[] = [];
  const hues = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345];
  const saturations = [100, 80, 60];
  const brightnesses = [90, 70, 50, 30];

  // Add pure hues with variations
  for (const hue of hues) {
    for (const sat of saturations) {
      for (const bright of brightnesses) {
        const rgb = hslToHex(hue, sat, bright);
        colors.push(rgb);
      }
    }
  }

  // Add grayscale
  for (let i = 0; i <= 100; i += 5) {
    colors.push(hslToHex(0, 0, i));
  }

  // Remove duplicates
  return [...new Set(colors)];
};

const hslToHex = (h: number, s: number, l: number) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const QUICK_COLORS = [
  "#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082",
  "#FF1493", "#FFB6C1", "#FF6347", "#FFA500", "#32CD32", "#87CEEB",
  "#FFFFFF", "#808080", "#000000", "#FFD700", "#00CED1", "#9370DB",
];

export default function ColorPicker({ title, value, onChange, theme }: Props) {
  const [showPalette, setShowPalette] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const colorPalette = generateColorPalette();

  if (isMobile) {
    return (
      <div>
        <label className={`block text-xs font-semibold mb-2 uppercase tracking-wider ${
          theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
        }`}>
          {title}
        </label>
        
        <button
          onClick={() => setShowPalette(!showPalette)}
          className={`w-full p-4 rounded-lg border-2 flex items-center gap-3 transition-all ${
            showPalette
              ? theme === 'dark'
                ? 'border-neutral-400 bg-neutral-900'
                : 'border-neutral-600 bg-neutral-100'
              : theme === 'dark'
              ? 'border-neutral-700 bg-neutral-900'
              : 'border-neutral-300 bg-white'
          }`}
        >
          <div
            className="w-10 h-10 rounded-lg border-2"
            style={{
              backgroundColor: value,
              borderColor: theme === 'dark' ? '#404040' : '#d1d5db',
            }}
          />
          <div className="flex-1 text-left">
            <p className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              {value.toUpperCase()}
            </p>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              Tap to choose color
            </p>
          </div>
        </button>

        {/* Color Palette Modal */}
        {showPalette && (
          <div className={`mt-4 p-4 rounded-xl border ${
            theme === 'dark'
              ? 'bg-neutral-900 border-neutral-700'
              : 'bg-white border-neutral-300'
          }`}>
            {/* Quick Colors */}
            <div className="mb-4">
              <p className={`text-xs font-semibold mb-2 ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
              }`}>Quick Colors</p>
              <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))' }}>
                {QUICK_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      onChange(color);
                      setShowPalette(false);
                    }}
                    className={`h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                      value.toUpperCase() === color.toUpperCase()
                        ? theme === 'dark'
                          ? 'border-white ring-2 ring-white'
                          : 'border-black ring-2 ring-black'
                        : theme === 'dark'
                        ? 'border-neutral-600'
                        : 'border-neutral-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <hr className={theme === 'dark' ? 'border-neutral-700' : 'border-neutral-300'} />

            {/* Full Color Grid */}
            <div className="mt-4">
              <p className={`text-xs font-semibold mb-2 ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
              }`}>All Colors</p>
              <div className="grid gap-1 max-h-64 overflow-y-auto" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(28px, 1fr))' }}>
                {colorPalette.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      onChange(color);
                      setShowPalette(false);
                    }}
                    className={`h-7 rounded border transition-all hover:scale-125 ${
                      value.toUpperCase() === color.toUpperCase()
                        ? theme === 'dark'
                          ? 'border-white ring-2 ring-white'
                          : 'border-black ring-2 ring-black'
                        : theme === 'dark'
                        ? 'border-neutral-600'
                        : 'border-neutral-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`flex-1 px-3 py-2 border rounded text-sm focus:outline-none ${
                  theme === 'dark'
                    ? 'bg-neutral-800 border-neutral-700 focus:border-neutral-500 text-white'
                    : 'bg-neutral-50 border-neutral-300 focus:border-neutral-500 text-black'
                }`}
                placeholder="#000000"
              />
              <button
                onClick={() => setShowPalette(false)}
                className={`px-4 py-2 rounded font-semibold ${
                  theme === 'dark'
                    ? 'bg-neutral-700 hover:bg-neutral-600 text-white'
                    : 'bg-neutral-200 hover:bg-neutral-300 text-black'
                }`}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop version (same as mobile)
  return (
    <div>
      <label className={`block text-xs font-semibold mb-2 uppercase tracking-wider ${
        theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
      }`}>
        {title}
      </label>
      
      <button
        onClick={() => setShowPalette(!showPalette)}
        className={`w-full p-4 rounded-lg border-2 flex items-center gap-3 transition-all ${
          showPalette
            ? theme === 'dark'
              ? 'border-neutral-400 bg-neutral-900'
              : 'border-neutral-600 bg-neutral-100'
            : theme === 'dark'
            ? 'border-neutral-700 bg-neutral-900'
            : 'border-neutral-300 bg-white'
        }`}
      >
        <div
          className="w-10 h-10 rounded-lg border-2"
          style={{
            backgroundColor: value,
            borderColor: theme === 'dark' ? '#404040' : '#d1d5db',
          }}
        />
        <div className="flex-1 text-left">
          <p className={`text-sm font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
            {value.toUpperCase()}
          </p>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            Tap to choose color
          </p>
        </div>
      </button>

      {/* Color Palette Modal */}
      {showPalette && (
        <div className={`mt-4 p-4 rounded-xl border ${
          theme === 'dark'
            ? 'bg-neutral-900 border-neutral-700'
            : 'bg-white border-neutral-300'
        }`}>
          {/* Quick Colors */}
          <div className="mb-4">
            <p className={`text-xs font-semibold mb-2 ${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
            }`}>Quick Colors</p>
            <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))' }}>
              {QUICK_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    onChange(color);
                    setShowPalette(false);
                  }}
                  className={`h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                    value.toUpperCase() === color.toUpperCase()
                      ? theme === 'dark'
                        ? 'border-white ring-2 ring-white'
                        : 'border-black ring-2 ring-black'
                      : theme === 'dark'
                      ? 'border-neutral-600'
                      : 'border-neutral-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <hr className={theme === 'dark' ? 'border-neutral-700' : 'border-neutral-300'} />

          {/* Full Color Grid */}
          <div className="mt-4">
            <p className={`text-xs font-semibold mb-2 ${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
            }`}>All Colors</p>
            <div className="grid gap-1 max-h-64 overflow-y-auto" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(28px, 1fr))' }}>
              {colorPalette.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    onChange(color);
                    setShowPalette(false);
                  }}
                  className={`h-7 rounded border transition-all hover:scale-125 ${
                    value.toUpperCase() === color.toUpperCase()
                      ? theme === 'dark'
                        ? 'border-white ring-2 ring-white'
                        : 'border-black ring-2 ring-black'
                      : theme === 'dark'
                      ? 'border-neutral-600'
                      : 'border-neutral-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={`flex-1 px-3 py-2 border rounded text-sm focus:outline-none ${
                theme === 'dark'
                  ? 'bg-neutral-800 border-neutral-700 focus:border-neutral-500 text-white'
                  : 'bg-neutral-50 border-neutral-300 focus:border-neutral-500 text-black'
              }`}
              placeholder="#000000"
            />
            <button
              onClick={() => setShowPalette(false)}
              className={`px-4 py-2 rounded font-semibold ${
                theme === 'dark'
                  ? 'bg-neutral-700 hover:bg-neutral-600 text-white'
                  : 'bg-neutral-200 hover:bg-neutral-300 text-black'
              }`}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}