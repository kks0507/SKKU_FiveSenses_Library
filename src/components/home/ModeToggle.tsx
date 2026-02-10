'use client';

type ModeToggleProps = {
  mode: 'emax' | 'insta';
  onModeChange: (mode: 'emax' | 'insta') => void;
};

export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex justify-center py-6">
      <div className="inline-flex rounded-full bg-warm-gray-100 p-1">
        <button
          type="button"
          onClick={() => onModeChange('emax')}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
            mode === 'emax'
              ? 'bg-primary text-white shadow-sm'
              : 'text-warm-gray-600 hover:text-foreground'
          }`}
        >
          이맥스
        </button>
        <button
          type="button"
          onClick={() => onModeChange('insta')}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
            mode === 'insta'
              ? 'bg-primary text-white shadow-sm'
              : 'text-warm-gray-600 hover:text-foreground'
          }`}
        >
          인스타
        </button>
      </div>
    </div>
  );
}
