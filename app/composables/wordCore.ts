// ============================================================
// 单词领域 · 胶水层
// 把 n2.json 的静态词库变成 Vue 响应式，并连接经验领域（交换机）。
// ============================================================
import type { WordEntry } from '~/core/doMain/ExpStateCore';
import wordList from '~/assets/n2.json';

export function useWord() {
  // 全量词库（只读，来源：n2.json）
  const allWords: WordEntry[] = wordList;

  // 当前展示的词条（响应式，UI 直接绑定）
  const words = ref<WordEntry[]>([]);
  // 每个词条对应的输入答案（打的是 reading 读音）
  const answers = ref<string[]>([]);
  // 每个词条的对错状态：undefined 未提交 / true 打对 / false 打错
  const results = ref<(boolean | undefined)[]>([]);
  // 每个词条是否点过「忘记了看一眼」（点过后显示正确读音）
  const hintsShown = ref<boolean[]>([]);

  // 经验领域（通过交换机把单词兑换成经验）
  const { gainByWords } = useGameStore();

  // 洗牌算法取出 count 个词条
  function pickRandom(count: number) {
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    words.value = shuffled.slice(0, count);
    // 给每个词条各生成一个空答案 / 未提交状态 / 未提示
    answers.value = words.value.map(() => '');
    results.value = words.value.map(() => undefined);
    hintsShown.value = words.value.map(() => false);
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

  // 「忘记了看一眼」：点击直接显示正确读音
  function showHint(idx: number) {
    hintsShown.value[idx] = true;
  }

  // 播放读音：用浏览器内置的 TTS 语音合成引擎朗读 reading。
  // 注意读的是 reading（平假名），不是 expression（汉字），否则可能读错音。
  function playReading(idx: number) {
    const target = words.value[idx];
    if (!target || !import.meta.client) return;

    // 先取消上一次没读完的语音，避免连点多个按钮时语音堆叠
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(target.reading);
    // 关键：明确指定日语，否则浏览器可能用默认语言读错
    utterance.lang = 'ja-JP';
      utterance.rate = 0.4;
    window.speechSynthesis.speak(utterance);
  
  }

  return {
    words,
    answers,
    results,
    hintsShown,
    pickRandom,
    submitWord,
    showHint,
    playReading,
  };
}
