export interface Haiku {
  id: string;
  japanese: string;
  romaji: string;
  english: string;
  author: string;
  authorJp: string;
  tags: string[];
}

export type ViewMode = 'list' | 'grid';

export interface DailyStat {
  day: string;
  count: number;
  isTarget?: boolean; // For highlighting specific bars
}
