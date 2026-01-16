"use client";

import { Theme } from "../hooks/useTheme";

interface Props {
  theme: Theme;
}

const FILTERS = [
  { value: "none", label: "None" },
  { value: "cinematic", label: "Cinematic" },
  { value: "grainy", label: "Grainy" }, // NEW
  { value: "grayscale", label: "Grayscale" },
  { value: "sepia", label: "Sepia" },
  { value: "blur", label: "Blur" },
  { value: "brightness", label: "Bright" },
  { value: "contrast", label: "Contrast" },
  { value: "saturate", label: "Saturate" },
  { value: "invert", label: "Invert" },
];

export default function DummyFilterPreviews({ theme }: Props) {
  return (
    <div className={`border-t ${
      theme === 'dark' ? 'border-neutral-800 bg-[#0d0d0d]' : 'border-neutral-200 bg-neutral-50'
    } p-4`}>
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <span className={`text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${
          theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
        }`}>
          Filters:
        </span>
        
        <div className="flex gap-3">
          {FILTERS.map((filter) => (
            <div
              key={filter.value}
              className={`flex flex-col items-center gap-2 p-2 rounded-lg ${
                theme === 'dark'
                  ? 'bg-neutral-800'
                  : 'bg-neutral-200'
              }`}
            >
              {/* Dummy Preview Box */}
              <div 
                className={`w-[100px] h-[100px] rounded border flex items-center justify-center ${
                  theme === 'dark'
                    ? 'border-neutral-600 bg-neutral-900'
                    : 'border-neutral-300 bg-neutral-100'
                }`}
              >
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-neutral-600' : 'text-neutral-400'
                }`}>
                  Preview
                </span>
              </div>
              <span className={`text-xs font-medium whitespace-nowrap ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                {filter.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}