// 纯数据契约（State / Model）
//实现拿出单词打---->打完获得经验++ ----> 经验到一定量等级++-----> 打完的单词存入localstroing
//纯逻辑规则
export interface TypeGameState {
  wordList: string[];
  exp: number;
  level: number;
  finishedWords: string[];
}


export const EXP_PER_LEVEL = 10;
export const EXP_PER_WORD = 1;

// 根据总经验计算等级 无副作用
export function calcLevel(exp: number): number {
  return Math.floor(exp / EXP_PER_LEVEL) + 1;
}

export function finishWord(
  state: TypeGameState,
  word: string
): TypeGameState {
  // 不在词库中，不处理
  if (!state.wordList.includes(word)) {
    return state;
  }

  // 已经打过，不重复加经验
  if (state.finishedWords.includes(word)) {
    return state;
  }

  const nextExp = state.exp + EXP_PER_WORD;

  return {
    ...state,
    exp: nextExp,
    level: calcLevel(nextExp),
    finishedWords: [...state.finishedWords, word],

    // 如果打完要从待打列表移除，可以加：
    // wordList: state.wordList.filter(w => w !== word),
  };
}