// core/typing/TypingEngine.ts
export class TypingEngine {
  private targetWord: string = ''
  private currentIndex: number = 0
  private correctCount: number = 0
  private errorCount: number = 0

  constructor(initialWord: string = '') {
    this.setWord(initialWord)
  }

  public setWord(word: string): void {
    this.targetWord = word
    this.currentIndex = 0
  }

  /**
   * 核心打字判定方法
   */
  public inputChar(char: string): { isCorrect: boolean; isFinished: boolean } {
    if (this.currentIndex >= this.targetWord.length) {
      return { isCorrect: false, isFinished: true }
    }

    const expectedChar = this.targetWord[this.currentIndex]
    
    const isCorrect = char === expectedChar

    if (isCorrect) {
      this.currentIndex++
      this.correctCount++
    } else {
      this.errorCount++
    }

    const isFinished = this.currentIndex === this.targetWord.length
    return { isCorrect, isFinished }
  }

  public get progress(): number {
    if (!this.targetWord.length) return 0
    return Math.floor((this.currentIndex / this.targetWord.length) * 100)
  }

  /** 当前要打的完整单词（供 UI 逐字渲染） */
  public get word(): string {
    return this.targetWord
  }

  /** 当前应打到的字符下标（已打对 [0, currentIndex) 区间） */
  public get index(): number {
    return this.currentIndex
  }
}