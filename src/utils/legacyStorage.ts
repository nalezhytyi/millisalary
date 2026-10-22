// Keys written by earlier versions (background picker, inputs-collapsed toggle)
const LEGACY_STORAGE_KEYS = ['background', 'isInputsCollapsed']

export const removeLegacyStorageKeys = () => {
  try {
    LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))
  } catch {
    // Storage can be unavailable (private mode); nothing to clean up then
  }
}
