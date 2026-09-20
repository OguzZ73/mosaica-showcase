export interface MockReadingSession {
  id: string;
  storyTitle: string;
  author: string;
  wordCount: number;
  readTimeSeconds: number;
  scrollSpeedPxPerSec: number;
  completionRate: number; // 0 to 1
  heatmapData: { paragraphIndex: number; dwellTimeMs: number }[];
  timestamp: string;
}

export const MOCK_READING_SESSION: MockReadingSession = {
  id: 'sess_9921',
  storyTitle: 'Firuze Gecenin Uğultusu',
  author: 'Oğuz Z.',
  wordCount: 1420,
  readTimeSeconds: 340,
  scrollSpeedPxPerSec: 14.2,
  completionRate: 0.92,
  heatmapData: [
    { paragraphIndex: 0, dwellTimeMs: 12400 },
    { paragraphIndex: 1, dwellTimeMs: 18500 },
    { paragraphIndex: 2, dwellTimeMs: 24100 },
    { paragraphIndex: 3, dwellTimeMs: 15300 },
    { paragraphIndex: 4, dwellTimeMs: 31000 },
  ],
  timestamp: '2026-09-19T22:15:00Z',
};

export const MOCK_TURKISH_SAMPLE_TEXT = `
Oğuz, kitap okurken saatine baktı. Yanlış giden birşeyler vardı fakat farketmek zordu. 
Gözlerini kapatıp bir an düşündü. Yarın sabah istanbul için yola çıkıcaktı. 
Herşey yolunda gitmeliydi.
`;
