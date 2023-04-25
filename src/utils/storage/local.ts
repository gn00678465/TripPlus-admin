interface StorageData<T> {
  value: T;
  expire: number | null;
}

export function createLocalStorage<
  T extends StorageInterface.Local = StorageInterface.Local
>() {
  // 預設緩存 7 天
  const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;

  /**
   *
   * @param key 存放的名稱
   * @param value 存放的資料
   * @param expire 緩存的天數
   */
  function set<K extends keyof T>(
    key: K,
    value: T[K],
    expire: number | null = DEFAULT_CACHE_TIME
  ) {
    const storageData: StorageData<T[K]> = {
      value,
      expire: expire !== null ? new Date().getTime() + expire * 1000 : null
    };

    const json = JSON.stringify(storageData);
    window.localStorage.setItem(key as string, json);
  }

  function get<K extends keyof T>(key: K) {
    const json = window.localStorage.getItem(key as string);
    if (json) {
      let storageData: StorageData<T[K]> | null = null;
      try {
        storageData = JSON.parse(json);
      } catch {
        // 解析失敗
      }
      if (storageData) {
        const { value, expire } = storageData;
        if (expire === null || expire >= Date.now()) {
          return value as T[K];
        }
        remove(key);
        return null;
      }
    }
    return null;
  }

  function remove(key: keyof T) {
    window.localStorage.removeItem(key as string);
  }

  function clear() {
    window.localStorage.clear();
  }

  return {
    set,
    get,
    remove,
    clear
  };
}

export const localStg = createLocalStorage();
