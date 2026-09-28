import { ref, computed, onMounted } from 'vue';
import { 
  type TypeGameState, 
  finishWord as coreFinishWord,
  createInitialState // 引入初始化构造函数
} from '~/core/doMain/TypeCore';

import rawWordList from '~/assets/words.json';

const STORAGE_KEY = 'TYPE_GAME_STATE';

export function useTypeGame() {
  // 1. 初始化状态：直接调用 Core 层的 createInitialState
  const state = ref<TypeGameState>(createInitialState(rawWordList));

  const currentWord = computed(() => {
    return state.value.wordList.find(
      (word) => !state.value.finishedWords.includes(word)
    ) || '';
  });

  const isGameCompleted = computed(() => {
    return state.value.wordList.length > 0 && 
      state.value.finishedWords.length === state.value.wordList.length;
  });

  const loadStorage = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          state.value = {
            ...parsed,
            wordList: parsed.wordList || rawWordList,
          };
        } catch (e) {
          console.error('Failed to parse state from localStorage', e);
        }
      }
    }
  };

  const saveStorage = () => {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value));
    }
  };

  onMounted(() => {
    loadStorage();
  });

  const submitWord = (inputWord: string) => {
    const nextState = coreFinishWord(state.value, inputWord);
    if (nextState !== state.value) {
      state.value = nextState;
      saveStorage();
      return true;
    }
    return false;
  };

  // 2. 重置游戏：直接重新生成初始 State，完美重置 level 和 exp，绝不漏项
  const resetGame = () => {
    state.value = createInitialState(rawWordList);
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