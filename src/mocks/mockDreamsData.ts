export interface MockDreamEntry {
  id: string;
  title: string;
  date: string;
  lucidityLevel: number; // 1 to 5
  clarityLevel: number;  // 1 to 5
  tags: string[];
  coordinates: { x: number; y: number; z: number };
  clusterCategory: 'Cosmic' | 'Subconscious' | 'Memory' | 'Lucid';
}

export const MOCK_DREAMS_DATA: MockDreamEntry[] = [
  {
    id: 'drm_1',
    title: 'Kristal Okyanus Üzerinde Uçuş',
    date: '2026-09-18',
    lucidityLevel: 5,
    clarityLevel: 4,
    tags: ['Uçmak', 'Okyanus', 'Kristal', 'Mavi Işık'],
    coordinates: { x: 120, y: 80, z: 45 },
    clusterCategory: 'Lucid',
  },
  {
    id: 'drm_2',
    title: 'Kayıp Kütüphane Labirenti',
    date: '2026-09-15',
    lucidityLevel: 3,
    clarityLevel: 5,
    tags: ['Kitaplar', 'Labirent', 'Eski Kitaplık'],
    coordinates: { x: 240, y: 190, z: 12 },
    clusterCategory: 'Memory',
  },
  {
    id: 'drm_3',
    title: 'Neon Şehirde Gece Yürüyüşü',
    date: '2026-09-10',
    lucidityLevel: 2,
    clarityLevel: 3,
    tags: ['Cyberpunk', 'Gece', 'Yağmur'],
    coordinates: { x: 310, y: 110, z: 88 },
    clusterCategory: 'Subconscious',
  },
  {
    id: 'drm_4',
    title: 'Yıldız Kapısından Geçiş',
    date: '2026-09-02',
    lucidityLevel: 5,
    clarityLevel: 5,
    tags: ['Uzay', 'Astro', 'Kapı', 'Işık'],
    coordinates: { x: 180, y: 290, z: 120 },
    clusterCategory: 'Cosmic',
  },
];
