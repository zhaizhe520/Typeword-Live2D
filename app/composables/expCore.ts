// ============================================================
// 经验领域 · 适配胶水层
// 引入 core 纯函数，包装成 Vue 响应式；持久化交给 localforage
// （底层仍是 IndexedDB，但 API 简化成 getItem / setItem，一眼就能看懂）。
// ============================================================
import localforage from 'localforage';
import { addExp } from '~/core/doMain/ExpStateCore';
import { exchangeWordToExp } from '~/core/doMain/FunctionCore';
import type { ExpState } from '~/core/doMain/ExpStateCore';

// 创建一个独立的存储实例（name=库名，storeName=表名）
const store = localforage.createInstance({
  name: 'GameDB',
  storeName: 'gameState',
});

// 防止多个组件重复触发 loadState 导致存档被覆盖
let isLoaded = false;

export const useGameStore = () => {
  // 响应式状态
  const expState = useState<ExpState>('expState', () => ({ exp: 0, expLevel: 1 }));
  // 情感系统还没设计，先占位
  const mooState = useState('mooState', () => ({ moo: 0, mooLevel: 1 }));
  // 「存档是否已从本地读取完毕」的标记，供 UI 判断数据就绪
  const isReady = useState('dbReady', () => false);

  // 从本地读取存档
  const loadState = async () => {
    if (!import.meta.client || isLoaded) return;
    try {
      const [exp, moo] = await Promise.all([
        store.getItem<ExpState>('expState'),
        store.getItem<typeof mooState.value>('mooState'),
      ]);
      // 只有当本地确实有数据时，才覆盖默认值
      if (exp) expState.value = exp;
      if (moo) mooState.value = moo;
      isReady.value = true;
      isLoaded = true;
    } catch (e) {
      console.error('加载存档失败', e);
    }
  };

  // 写入本地存档
  const saveState = async (key: string, value: unknown) => {
    if (!import.meta.client) return;
    try {
      // Vue 的响应式对象是 Proxy，IndexedDB 的 structured clone 克隆不了 Proxy，
      // 会抛 DataCloneError。所以先转成普通 JSON 对象再存。
      await store.setItem(key, JSON.parse(JSON.stringify(value)));
    } catch (e) {
      console.error(`保存 ${key} 失败`, e);
    }
  };

  // 动作：增加经验（调用领域纯函数 + 持久化）
  const gainExp = async (amount: number) => {
    expState.value = addExp(expState.value, amount);
    await saveState('expState', expState.value);
  };

  // 动作：通过「交换机」把打对的单词数兑换成经验（1 词 = 1 经验）
  const gainByWords = async (wordCount: number) => {
    expState.value = exchangeWordToExp(expState.value, wordCount);
    await saveState('expState', expState.value);
  };

  // 页面挂载时读取存档（isLoaded 锁保证多个组件只读一次）
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
