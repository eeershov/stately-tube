import { LOCAL_STORAGE_KEY } from "./consts";
import type { VideoRating } from "./types";

export function loadVideoHistoryFromLocalStorage(): VideoRating[] {
  try {
    const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedHistory ? JSON.parse(storedHistory) : [];
  } catch (error) {
    console.error("Failed to load video history from localStorage", error);
    return [];
  }
}

export function saveVideoHistoryToLocalStorage(history: VideoRating[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save video history to localStorage", error);
  }
}
