// ============================================================
// 经验领域 · 契约 + 纯函数
// 纯函数：同样的输入永远得到同样的输出，不改动入参，无副作用。
// ============================================================

// 经验契约
export interface ExpState {
  // 当前等级内已攒的经验
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

// 把单词接口对象放到领域层
// n2.json 里每个词条的结构
export interface WordEntry {
  // 汉字词（展示在顶部）
  expression: string;
  // 读音（要打对的目标）
  reading: string;
  // 英文释义
  meaning: string;
  // 中文释义（部分词条为空，渲染时兜底不显示）
  meaning_zh: string;
  // 标签（空格分隔，如 "JLPT JLPT_2"）
  tags: string;
}


/**
 * 升到下一级需要的经验（逐级递增）：
 * 第 N 级升到 N+1 级需要 10 × N 经验。
 * 1→2 要 10，2→3 要 20，3→4 要 30 … 越往后越难。
 */
export function expToNextLevel(level: number): number {
  return 10 * level;
}

/**
 * 纯函数：增加经验，攒满当前级所需经验后自动升级（可连升多级）。
 * @param state 旧的经验状态
 * @param amount 要增加多少经验
 * @returns 返回全新的 ExpState 对象（不改动原对象）
 */
export function addExp(state: ExpState, amount: number): ExpState {
  let exp = state.exp + amount;
  let level = state.expLevel;

  // 只要经验还够升一级，就扣掉本级所需并升一级
  while (exp >= expToNextLevel(level)) {
    exp -= expToNextLevel(level);
    level += 1;
  }

  return {
    exp,
    expLevel: level,
  };
}

