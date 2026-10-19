// ============================================================
// 经验领域 · 适配胶水层
// 引入 core 纯函数，包装成 Vue 响应式 + IndexedDB 持久化。
// ============================================================
import { addExp, subExp } from '~/core/doMain/ExpStateCore';
import { exchangeWordToExp } from '~/core/doMain/FunctionCore';
import type { ExpState } from '~/core/doMain/ExpStateCore';

const DB_NAME = 'GameDB';
const STORE_NAME = 'gameState';
const DB_VERSION = 1;

export const useGameStore = () => {
  // 响应式状态
  const expState = useState<ExpState>('expState', () => ({ exp: 0, expLevel: 1 }));
  const mooState = useState('mooState', () => ({ moo: 0, mooLevel: 1 }));
  const isReady = useState('dbReady', () => false);

  // 初始化 IndexedDB
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

  // 从 IndexedDB 读单条状态
  const readEntry = <T,>(db: IDBDatabase, key: string): Promise<T | undefined> => {
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => resolve(req.result as T | undefined);
      req.onerror = () => resolve(undefined);
    });
  };

  // 从 IndexedDB 取状态
  const loadState = async () => {
    if (!import.meta.client) return;
    try {
      const db = await initDB();
      const [exp, moo] = await Promise.all([
        readEntry<ExpState>(db, 'expState'),
        readEntry<typeof mooState.value>(db, 'mooState'),
      ]);
      if (exp) expState.value = exp;
      if (moo) mooState.value = moo;
      isReady.value = true;
    } catch (e) {
      console.error('Failed to load state from IndexedDB', e);
    }
  };

  // 保存状态到 IndexedDB
  const saveState = async (key: 'expState' | 'mooState', value: unknown) => {
    if (!import.meta.client) return;
    try {
      const db = await initDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(value, key);
    } catch (e) {
      console.error(`Failed to save ${key} to IndexedDB`, e);
    }
  };

  // 动作：增加经验（调用领域纯函数 + 持久化）
  const gainExp = (amount: number) => {
    expState.value = addExp(expState.value, amount);
    saveState('expState', expState.value);
  };

  // 动作：减少经验
  const loseExp = (amount: number) => {
    expState.value = subExp(expState.value, amount);
    saveState('expState', expState.value);
  };

  // 动作：通过「交换机」把打对的单词数兑换成经验（1 词 = 1 经验）
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
    loseExp,
    gainByWords,
  };
};
