import { Song } from './song';

export interface SearchSongsResponse {
  success: boolean;
  data: {
    total: number;
    start: number;
    results: Song[];
  };
}

export interface SongDetailResponse {
  success: boolean;
  data: Song[];
}

export interface SongSuggestionsResponse {
  success: boolean;
  data: Song[];
}
