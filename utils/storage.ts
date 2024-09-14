import { MMKV } from "react-native-mmkv";

// Initialize the storage
const storage = new MMKV();

interface SimpleMMKVStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  clear(): void;
}

const MMKVStorage: SimpleMMKVStorage = {
  // Get a value from storage
  getItem: (key: string): string | null => {
    return storage.getString(key) ?? null;
  },

  setItem: (key: string, value: string): void => {
    storage.set(key, value);
  },

  // Clear all values from storage
  clear: (): void => {
    storage.clearAll();
  },
};

export default MMKVStorage;
