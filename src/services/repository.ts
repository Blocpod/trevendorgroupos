import { AppState } from "../domain/types";
import { createSeedState } from "../data/seed";

const key = "vendorgroupos-state-v1";

export function loadState(): AppState {
  const saved = localStorage.getItem(key);
  if (!saved) return createSeedState();
  try {
    return JSON.parse(saved) as AppState;
  } catch {
    return createSeedState();
  }
}

export function saveState(state: AppState) {
  localStorage.setItem(key, JSON.stringify(state));
}

export function resetState() {
  const state = createSeedState();
  saveState(state);
  return state;
}
