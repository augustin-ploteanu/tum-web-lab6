export interface MediaItem {
  id: number;
  /** Movies use `title`, TV shows use `name` */
  title?: string;
  name?: string;
  poster_path: string | null;
  /** Movies: "YYYY-MM-DD" */
  release_date?: string;
  /** TV shows: "YYYY-MM-DD" */
  first_air_date?: string;
  media_type: 'movie' | 'tv' | 'person';
  overview: string;
  vote_average: number;
}

export interface TMDBSearchResponse {
  page: number;
  results: MediaItem[];
  total_pages: number;
  total_results: number;
}

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error';
export type WatchableItem = MediaItem & { media_type: 'movie' | 'tv' };

export type Category = 'all' | 'completed' | 'watching' | 'plan_to_watch' | 'dropped';
export type EntryCategory = Exclude<Category, 'all'>;

export const CATEGORY_LABELS: Record<Category, string> = {
  all: 'All Entries',
  completed: 'Completed',
  watching: 'Watching',
  plan_to_watch: 'Plan to Watch',
  dropped: 'Dropped',
};

export interface ListEntry {
  /** `${media_type}-${id}` */
  id: string;
  item: WatchableItem;
  category: EntryCategory;
  /** 1–10, or null when not graded */
  grade: number | null;
  note: string;
  addedAt: number;
}
