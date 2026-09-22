import { ref, computed, onMounted } from 'vue';
import { 
  type TypeGameState, 
  finishWord as coreFinishWord 
} from '~/core/type/TypeGameCore'; // 假设你的 Core 代码在 utils/gameCore.ts

// 1. 在胶水层导入 JSON 词库数据
import rawWordList from '~/assets/words.json';

const STORAGE_KEY = 'TYPE_GAME_STATE';

export function useTypeGame() {
  // 状态初始化（默认从 JSON 加载初始词库）
  const state = ref<TypeGameState>({
    wordList: rawWordList || [],
    exp: 0,
    level: 1,
    finishedWords: [],
  });

  // 当前待打的单词（即不在已完成列表中的第一个单词）
  const currentWord = computed(() => {
    return state.value.wordList.find(
      (word) => !state.value.finishedWords.includes(word)
    ) || '';
  });

  // 游戏是否通关
  const isGameCompleted = computed(() => {
    return state.value.wordList.length > 0 && 
      state.value.finishedWords.length === state.value.wordList.length;
  });

  // 从 LocalStorage 加载数据
  const loadStorage = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          state.value = {
            ...parsed,
            // 确保如果 json 更新了新词，也能兼容合并
            wordList: parsed.wordList || rawWordList,
          };
        } catch (e) {
          console.error('Failed to parse state from localStorage', e);
        }
      }
    }
  };

  // 保存数据到 LocalStorage
  const saveStorage = () => {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value));
    }
  };

  // 挂载时恢复进度
  onMounted(() => {
    loadStorage();
  });

  // 业务动作：完成一个单词
  const submitWord = (inputWord: string) => {
    // 调用 Core 的纯逻辑函数生成新 State
    const nextState = coreFinishWord(state.value, inputWord);
    
    // 如果状态发生了改变（说明输入成功）
    if (nextState !== state.value) {
      state.value = nextState; // 更新响应式状态
      saveStorage();           // 持久化到 LocalStorage
      return true;
    }
    return false;
  };

  // 重置游戏进度
  const resetGame = () => {
    state.value = {
      wordList: rawWordList || [],
      exp: 0,
      level: 1,
      finishedWords: [],
    };
    saveStorage();
  };

  return {
    state,
    currentWord,
    isGameCompleted,
    submitWord,
    resetGame,
  };
}