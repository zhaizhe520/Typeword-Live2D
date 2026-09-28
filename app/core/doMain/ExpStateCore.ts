// ============================================================
// 领域层（Domain Layer）—— 纯数据契约 / 纯存储层
// ------------------------------------------------------------
// 这里只定义「经验和单词」的数据结构与类型，不含任何业务逻辑、
// 无副作用。上层的手段层（TypeCore）通过这些契约来读写状态。
// ============================================================

// 经验/等级状态：纯粹描述「经验」这一个领域概念
export interface ExpState {
  /** 当前经验值 */
  exp: number;
  /** 当前等级 */
  level: number;
}

// 完整游戏状态：单词 + 经验 + 已完成列表
// 这是贯穿整个打字流程的唯一数据源（Single Source of Truth）
export interface TypeGameState extends ExpState {
  wordList: string[];
  finishedWords: string[];
}
