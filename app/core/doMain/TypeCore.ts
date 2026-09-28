// ============================================================
// 手段层（Operation Layer）—— 操作领域数据的纯函数
// ------------------------------------------------------------
// 无副作用、纯逻辑：输入 state + 操作参数，返回新的 state。
// 不接触 Vue / DOM / localStorage，只负责「数据如何变化」。
//
// 数据流动：拿出单词打 → 打完经验 +1 → 经验达阈值等级 +1
//           → 打完的单词记入 finishedWords → 存档（由胶水层负责）
// ============================================================

// 引入领域层的数据契约
import type { TypeGameState } from './ExpStateCore';
// 重新导出，方便胶水层（useCore）通过本层统一引用类型
export type { TypeGameState } from './ExpStateCore';

// 升级阈值：每 EXP_PER_LEVEL 点经验升一级
export const EXP_PER_LEVEL = 5;
// 每打对一个单词获得的经验
export const EXP_PER_WORD = 1;

// 根据总经验计算等级（纯函数，无副作用）
// 等级 = floor(exp / EXP_PER_LEVEL) + 1，初始经验 0 → 等级 1
export function calcLevel(exp: number): number {
  return Math.floor(exp / EXP_PER_LEVEL) + 1;
}

// 首次初始化：生成一份全新的完整状态，经验从 0 开始
export function createInitialState(wordList: string[] = []): TypeGameState {
  const initialExp = 0;
  return {
    wordList,
    exp: initialExp,
    level: calcLevel(initialExp), // 初始经验 0 → 等级 1
    finishedWords: [],
  };
}

// 重置词库进度：只清空已完成列表，所有单词重新可打；
// 经验/等级保持不变（持久，不被重置）
export function resetWords(state: TypeGameState): TypeGameState {
  return {
    ...state,
    finishedWords: [],
  };
}
// 返回全新的 state（不可变更新），不会修改传入的 state
export function finishWord(
  state: TypeGameState,
  word: string
): TypeGameState {
  // 词不在词库中 → 不处理，原样返回
  if (!state.wordList.includes(word)) {
    return state;
  }

  // 打对一个单词，经验 +1（+EXP_PER_WORD）；打过的单词也能继续加经验，不做去重边界
  const nextExp = state.exp + EXP_PER_WORD;

  return {
    ...state,
    exp: nextExp,
    level: calcLevel(nextExp), // 经验累计到阈值，等级随之自动 +1
    finishedWords: [...state.finishedWords, word],
  };
}
