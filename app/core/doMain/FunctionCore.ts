// ============================================================
// 交换机（兑换层）：单词 → 经验
// 这里定义「事件完成 → 经验」的兑换规则，是纯函数，不碰任何副作用。
// ============================================================
import { addExp } from './ExpStateCore';
import type { ExpState } from './ExpStateCore';

// 汇率：1 个单词 = 1 点经验
export const EXP_PER_WORD = 1;

/**
 * 交换机：把「打对的单词数」兑换成「经验」。
 * 纯函数：给定同样的状态和单词数，永远得到同样的结果。
 * @param state 兑换前的经验状态
 * @param wordCount 打对的单词数量
 * @returns 兑换后的全新 ExpState 对象
 */
export function exchangeWordToExp(state: ExpState, wordCount: number): ExpState {
  return addExp(state, wordCount * EXP_PER_WORD);
}
