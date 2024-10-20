import { MMKV } from "react-native-mmkv";

// Initialize the storage
const storage = new MMKV();

interface SimpleMMKVStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

const MMKVStorage: SimpleMMKVStorage = {
  // Get a value from storage
  getItem: (key: string): string | null => {
    return storage.getString(key) ?? null;
  },

  // Set a value in storage
  setItem: (key: string, value: string): void => {
    storage.set(key, value);
  },

  // Remove a specific key from storage
  removeItem: (key: string): void => {
    storage.delete(key);
  },

  // Clear all values from storage
  clear: (): void => {
    storage.clearAll();
  },
};

export default MMKVStorage;
