/* oxlint-disable */
let state = { isListening: false, isProcessing: false };
const listeners = new Set<() => void>();

export function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function getSnapshot() {
  return state;
}

export function setGlobalState(updates: Partial<typeof state>) {
  const newState = { ...state, ...updates };
  if (state.isListening === newState.isListening && state.isProcessing === newState.isProcessing)
    return;
  state = newState;
  listeners.forEach((listener) => listener());
}
