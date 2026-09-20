import React, { useState } from 'react';

export interface SnippetShareConfig {
  quote: string;
  author: string;
  storyTitle: string;
  theme: 'dark' | 'firuze' | 'amber' | 'emerald';
}

interface SnippetShareModalProps {
  quote: string;
  author?: string;
  storyTitle?: string;
  isOpen: boolean;
  onClose: () => void;
  onGenerateImage?: (config: SnippetShareConfig) => void;
}

export const SnippetShareModal: React.FC<SnippetShareModalProps> = ({
  quote,
  author = 'Anonim',
  storyTitle = 'Mosaica Hikayesi',
  isOpen,
  onClose,
  onGenerateImage,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<SnippetShareConfig['theme']>('firuze');

  if (!isOpen) return null;

  const themeStyles: Record<SnippetShareConfig['theme'], { bg: string; text: string; accent: string }> = {
    dark: { bg: 'bg-zinc-950', text: 'text-zinc-100', accent: 'border-zinc-700' },
    firuze: { bg: 'bg-slate-900', text: 'text-cyan-100', accent: 'border-cyan-500' },
    amber: { bg: 'bg-stone-900', text: 'text-amber-100', accent: 'border-amber-500' },
    emerald: { bg: 'bg-emerald-950', text: 'text-emerald-100', accent: 'border-emerald-500' },
  };

  const activeStyle = themeStyles[selectedTheme];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <h3 className="text-lg font-bold text-zinc-100">Alıntı Plaketi Oluştur</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200">✕</button>
        </div>

        {/* Live Preview Card */}
        <div className={`p-8 rounded-xl border ${activeStyle.bg} ${activeStyle.accent} ${activeStyle.text} space-y-4 shadow-lg transition-all`}>
          <p className="text-lg font-serif italic leading-relaxed">“{quote}”</p>
          <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs opacity-80">
            <span>{storyTitle}</span>
            <span>— {author}</span>
          </div>
        </div>

        {/* Theme Selector */}
        <div className="flex justify-center space-x-3">
          {(['firuze', 'dark', 'amber', 'emerald'] as const).map(theme => (
            <button
              key={theme}
              onClick={() => setSelectedTheme(theme)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${
                selectedTheme === theme ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200' : 'border-zinc-800 text-zinc-400'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800">İptal</button>
          <button
            onClick={() => onGenerateImage?.({ quote, author, storyTitle, theme: selectedTheme })}
            className="px-4 py-2 rounded-lg text-sm bg-cyan-600 hover:bg-cyan-500 text-white font-medium shadow-md"
          >
            Plaketi İndir / Paylaş
          </button>
        </div>
      </div>
    </div>
  );
};
