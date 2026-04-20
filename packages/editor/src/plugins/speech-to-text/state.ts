export let globalIsListening = false;
export let globalIsProcessing = false;
export const listeners = new Set<
  (state: { isListening: boolean; isProcessing: boolean }) => void
>();

export function setGlobalState(isListening: boolean, isProcessing: boolean) {
  globalIsListening = isListening;
  globalIsProcessing = isProcessing;
  listeners.forEach((listener) => listener({ isListening, isProcessing }));
}
