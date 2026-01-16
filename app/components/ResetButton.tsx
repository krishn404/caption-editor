"use client";

interface Props {
  onReset: () => void;
  theme?: "light" | "dark";
  compact?: boolean;
}

export default function ResetButton({ onReset, theme = "dark", compact = false }: Props) {
  if (compact) {
    return (
      <button
        onClick={onReset}
        className={`flex items-center justify-center w-10 h-10 rounded-lg font-semibold text-sm transition shadow-lg ${
          theme === 'dark'
            ? 'bg-white text-black hover:bg-neutral-200'
            : 'bg-black text-white hover:bg-neutral-800'
        }`}
        title="Upload New Image"
      >
        {/* Standard Upload Icon */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={onReset}
      className={`w-full px-4 py-2 rounded-lg font-semibold text-sm transition uppercase tracking-wider ${
        theme === 'dark'
          ? 'bg-white text-black hover:bg-neutral-200'
          : 'bg-black text-white hover:bg-neutral-800'
      }`}
    >
      Reset Image
    </button>
  );
}