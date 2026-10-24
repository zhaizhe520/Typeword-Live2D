
import { toRaw } from 'vue';
import { addExp } from '~/core/doMain/ExpStateCore';
import { exchangeWordToExp } from '~/core/doMain/FunctionCore';

const DB_NAME = 'GameDB';
const STORE_NAME = 'gameState';
const DB_VERSION = 1;

export const useGameStore = () => {
  // 响应式状态
  const expState = useState('expState', () => ({ exp: 0, expLevel: 1 }));
  const mooState = useState('mooState', () => ({ moo: 0, mooLevel: 1 }));
  const isReady = useState('dbReady', () => false);

  // 初始化 IndexedDB
  const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      if (!import.meta.client) return; // 确保仅在客户端运行 IndexedDB

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  // 从 IndexedDB 取状态
  const loadState = async () => {
    if (!import.meta.client) return;
    try {
      const db = await initDB();
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      
      const reqExp = store.get('expState');
      reqExp.onsuccess = () => {
        if (reqExp.result) expState.value = reqExp.result;
      };

      const reqMoo = store.get('mooState');
      reqMoo.onsuccess = () => {
        if (reqMoo.result) mooState.value = reqMoo.result;
      };

      isReady.value = true;
    } catch (e) {
      console.error('Failed to load state from IndexedDB', e);
    }
  };

  // 保存状态到 IndexedDB
  const saveState = async (key: 'expState' | 'mooState', value: any) => {
    if (!import.meta.client) return;
    try {
      const db = await initDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      // Vue 响应式 Proxy 无法被 structured clone，用 toRaw 取出普通对象再存
      store.put(toRaw(value), key);
    } catch (e) {
      console.error(`Failed to save ${key} to IndexedDB`, e);
    }
  };

  // 动作：直接增加经验（底层）
  const gainExp = (amount: number) => {
    // 调用领域逻辑（纯函数）
    expState.value = addExp(expState.value, amount);
    // 持久化保存
    saveState('expState', expState.value);
  };

  // 动作：通过「交换机」把打对的单词数兑换成经验（单词 → 经验）
  const gainByWords = (wordCount: number) => {
    expState.value = exchangeWordToExp(expState.value, wordCount);
    saveState('expState', expState.value);
  };

  // 页面挂载时初始化数据
  onMounted(() => {
    loadState();
  });

  return {
    expState,
    mooState,
    isReady,
    gainExp,
    gainByWords,
  };
};