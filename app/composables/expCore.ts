// ============================================================
// 经验领域 · 适配胶水层
// ============================================================
import { addExp, subExp } from '~/core/doMain/ExpStateCore';
import { exchangeWordToExp } from '~/core/doMain/FunctionCore';
import type { ExpState } from '~/core/doMain/ExpStateCore';

const DB_NAME = 'GameDB';
const STORE_NAME = 'gameState';
const DB_VERSION = 1;

// 💡 提取全局标记，防止多个组件重复触发 loadState 导致数据被覆盖清空
let isLoaded = false;

export const useGameStore = () => {
  const expState = useState<ExpState>('expState', () => ({ exp: 0, expLevel: 1 }));
  const mooState = useState('mooState', () => ({ moo: 0, mooLevel: 1 }));
  const isReady = useState('dbReady', () => false);

  const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      if (!import.meta.client) {
        reject(new Error('IndexedDB only available on client'));
        return;
      }
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

  const readEntry = <T,>(db: IDBDatabase, key: string): Promise<T | undefined> => {
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => resolve(req.result as T | undefined);
      req.onerror = () => resolve(undefined);
    });
  };

  const loadState = async () => {
    if (!import.meta.client || isLoaded) return; // 💡 如果已经加载过了，直接跳过
    try {
      const db = await initDB();
      const [exp, moo] = await Promise.all([
        readEntry<ExpState>(db, 'expState'),
        readEntry<typeof mooState.value>(db, 'mooState'),
      ]);
      
      // 💡 只有当 IndexedDB 里确实有数据时，才覆盖默认值
      if (exp) expState.value = exp;
      if (moo) mooState.value = moo;
      
      isReady.value = true;
      isLoaded = true; // 标记为已加载
    } catch (e) {
      console.error('Failed to load state from IndexedDB', e);
    }
  };

  const saveState = async (key: 'expState' | 'mooState', value: unknown) => {
    if (!import.meta.client) return;
    try {
      const db = await initDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(value, key);
      
      // 等待事务完成确保写入成功
      return new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      console.error(`Failed to save ${key} to IndexedDB`, e);
    }
  };

  const gainExp = async (amount: number) => {
    expState.value = addExp(expState.value, amount);
    await saveState('expState', expState.value); // 💡 加上 await 确保写入完成
  };

  const loseExp = async (amount: number) => {
    expState.value = subExp(expState.value, amount);
    await saveState('expState', expState.value);
  };

  const gainByWords = async (wordCount: number) => {
    expState.value = exchangeWordToExp(expState.value, wordCount);
    await saveState('expState', expState.value);
  };

  // 页面挂载时初始化（由于加了 isLoaded 锁，多个组件调用也不会重复读库清空了）
  onMounted(() => {
    loadState();
  });

  return {
    expState,
    mooState,
    isReady,
    gainExp,
    loseExp,
    gainByWords,
  };
};