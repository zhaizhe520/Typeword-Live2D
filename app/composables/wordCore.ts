// ============================================================
// 单词领域 · 胶水层
// 把 n2.json 的静态词库变成 Vue 响应式，并连接经验领域（交换机）。
// ============================================================
import wordList from '~/assets/n2.json';

// n2.json 里每个词条的结构
export interface WordEntry {
  // 汉字词（展示在顶部）
  expression: string;
  // 读音（要打对的目标）
  reading: string;
  // 释义
  meaning: string;
  // 标签
  tags: string;
}

export function useWord() {
  // 全量词库（只读，来源：n2.json）
  const allWords: WordEntry[] = wordList;

  // 当前展示的词条（响应式，UI 直接绑定）
  const words = ref<WordEntry[]>([]);
  // 每个词条对应的输入答案（打的是 reading）
  const answers = ref<string[]>([]);
  // 每个词条的对错状态：undefined 未提交 / true 打对 / false 打错
  const results = ref<(boolean | undefined)[]>([]);

  // 经验领域（通过交换机兑换经验）
  const { gainByWords } = useGameStore();
 
  // 洗牌算法取出 count 个词条
  function pickRandom(count: number) {
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    words.value = shuffled.slice(0, count);
    // map() 会遍历数组、对每个元素执行回调、返回一个新数组。
    // 这里给每个词条各生成一个空答案 / 未提交状态，保证长度一致。
    answers.value = words.value.map(() => '');
    results.value = words.value.map(() => undefined);
  }

  // 提交一个词条：核对 reading（读音）→ 打对则通过「交换机」兑换经验
  function submitWord(idx: number) {
    const target = words.value[idx];
    if (!target) return;
    // 打对后锁定，不重复提交
    if (results.value[idx] === true) return;

    const input = (answers.value[idx] ?? '').trim();
    // 平假名读音需精确匹配
    const correct = input === target.reading;
    results.value[idx] = correct;

    if (correct) {
      gainByWords(1);
    }
  }

  return {
    words,
    answers,
    results,
    pickRandom,
    submitWord,
  };
}
