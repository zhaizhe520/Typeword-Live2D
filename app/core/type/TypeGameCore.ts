// OOP 类，游戏核心逻辑
export class TypeGameCore {
  wordList: string[]
  exp: number
  level: number
  finishedWords: string[]

  constructor(wordList: string[], saveData?: {exp:number,level:number,finishedWords:string[]}) {
    this.wordList = wordList
    this.exp = saveData?.exp ?? 0
    this.level = saveData?.level ?? 1
    this.finishedWords = saveData?.finishedWords ?? []
  }

  // 抽取一个新单词（排除已经打完的）
  pickNewWord(): string {
    const remainWords = this.wordList.filter(w => !this.finishedWords.includes(w))
    // 单词库全部打完时重置已完成列表，循环开始新一轮
    if (remainWords.length === 0) {
      this.finishedWords = []
      return this.pickNewWord()
    }
    return remainWords[Math.floor(Math.random() * remainWords.length)]!
  }

  // 单词打完，增加经验：一个单词 +1%
  addExp() {
    this.exp += 1
    // 经验满100，升级，经验归零
    if(this.exp >= 100) {
      this.exp = 0
      this.level += 1
    }
  }

  // 完成单词，加入已完成列表
  finishWord(word:string) {
    this.finishedWords.push(word)
    this.addExp()
  }

  // 导出存档，存localStorage
  getSaveData() {
    return {
      exp: this.exp,
      level: this.level,
      finishedWords: this.finishedWords
    }
  }
}
