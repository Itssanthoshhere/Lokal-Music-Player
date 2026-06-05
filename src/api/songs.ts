import apiClient from './client';
import { SearchSongsResponse, SongDetailResponse, SongSuggestionsResponse } from '../types';

export const searchSongs = async (
  query: string,
  page: number = 0,
  limit: number = 20
): Promise<SearchSongsResponse> => {
  const response = await apiClient.get<SearchSongsResponse>('/api/search/songs', {
    params: { query, page, limit },
  });
  return response.data;
};

export const getSongById = async (id: string): Promise<SongDetailResponse> => {
  const response = await apiClient.get<SongDetailResponse>(`/api/songs/${id}`);
  return response.data;
};

export const getSongSuggestions = async (
  id: string,
  limit: number = 10
): Promise<SongSuggestionsResponse> => {
  const response = await apiClient.get<SongSuggestionsResponse>(
    `/api/songs/${id}/suggestions`,
    { params: { limit } }
  );
  return response.data;
};
