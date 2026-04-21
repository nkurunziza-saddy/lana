let state = { isListening: false, isProcessing: false };
const listeners = new Set<() => void>();

export function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function getSnapshot() {
  return state;
}

export function setGlobalState(isListening: boolean, isProcessing: boolean) {
  if (state.isListening === isListening && state.isProcessing === isProcessing) return;
  state = { isListening, isProcessing };
  listeners.forEach((listener) => listener());
}
