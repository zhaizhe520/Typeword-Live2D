// ============================================================
// 经验领域 · 契约 + 纯函数
// 纯函数：同样的输入永远得到同样的输出，不改动入参，无副作用。
// ============================================================

// 经验契约
export interface ExpState {
  // 当前等级下的经验值（0 ~ EXP_PER_LEVEL - 1）
  exp: number;
  // 经验等级（从 1 开始）
  expLevel: number;
}

// 情感契约
export interface MooState {
  moo: number;
  // 情感等级
  mooLevel: number;
}

// 每升一级所需的经验数 = 打完 10 个单词
export const EXP_PER_LEVEL = 10;

/**
 * 纯函数：增加经验，满 10 经验自动升一级
 * @param state 旧的经验状态
 * @param amount 要增加多少经验
 * @returns 返回全新的 ExpState 对象（不改动原对象）
 */
export function addExp(state: ExpState, amount: number): ExpState {
  const totalExp = state.exp + amount;
  const levelGained = Math.floor(totalExp / EXP_PER_LEVEL);
  const remainingExp = totalExp % EXP_PER_LEVEL;

  return {
    exp: remainingExp,
    expLevel: state.expLevel + levelGained,
  };
}

/**
 * 纯函数：减少经验
 * 先把等级折算回「总经验」再减，最低停在 Lv.1 / 0 经验（不会掉到负数）
 * @param state 旧的经验状态
 * @param amount 要减少多少经验
 * @returns 返回全新的 ExpState 对象
 */
export function subExp(state: ExpState, amount: number): ExpState {
  // 总经验 = 已升级的经验 + 当前等级内经验
  const totalExp = Math.max(
    0,
    (state.expLevel - 1) * EXP_PER_LEVEL + state.exp - amount,
  );

  return {
    expLevel: Math.floor(totalExp / EXP_PER_LEVEL) + 1,
    exp: totalExp % EXP_PER_LEVEL,
  };
}
