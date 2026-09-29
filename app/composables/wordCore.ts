import wordList from '~/assets/words.json';
import { ref } from 'vue';
// ============================================================
// 胶水层：把 words.json 的静态词库变成 Vue 响应式，供 word.vue 渲染
// ============================================================
export function useWord() {
  // 全量词库（只读，来源：words.json）
  const allWords: string[] = wordList;

  // 当前展示的单词列表（响应式，UI 直接绑定）
  const words = ref<string[]>([]);

  // 洗牌函数
  function pickRandom(count: number) {
    //展开拿到新的数组--->排序---->洗牌 算法
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    words.value = shuffled.slice(0, count);
  }

  return {
    words,
    pickRandom,
  };
}
