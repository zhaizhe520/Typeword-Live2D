import wordList from '~/assets/words.json'
import { TypeGameCore } from '~/core/type/TypeGameCore.js'

export function useTypeGame() {
  // 从localStorage读取存档
  const loadSave = () => {
    const str = localStorage.getItem('typeSave')
    return str ? JSON.parse(str) : undefined
  }
  // 实例化OOP游戏核心
  const game = new TypeGameCore(wordList, loadSave())

  // Vue响应式状态（FP，响应式变量，供模板渲染）
  const currentWord = ref('')
  const userInput = ref('')
  // 每个字符状态 pending待输入 correct正确 wrong错误
  const charStates = ref<Array<'pending'|'correct'|'wrong'>>([])
  // 等级/经验：从 OOP 核心同步到响应式（game.exp 是普通属性，需手动同步触发渲染）
  const level = ref(game.level)
  const exp = ref(game.exp)

  // 把 OOP 核心的最新存档同步到响应式变量
  function syncState() {
    const save = game.getSaveData()
    level.value = save.level
    exp.value = save.exp
  }

  // 初始化下一个单词
  function nextWord() {
    userInput.value = ''
    currentWord.value = game.pickNewWord()
    charStates.value = currentWord.value.split('').map(() => 'pending')
  }

  // 处理键盘输入
  function handleKeyInput(key:string) {
    // 回退键
    if(key === 'Backspace') {
      userInput.value = userInput.value.slice(0, -1)
    } else {
      userInput.value += key
    }

    // 逐个对比字符，更新状态（用来做回弹动画）
    const arr: Array<'pending'|'correct'|'wrong'> = []
    for(let i=0; i < currentWord.value.length; i++) {
      const targetChar = currentWord.value[i]
      const inputChar = userInput.value[i]
      if(inputChar === undefined) {
        arr.push('pending')
      } else if(inputChar === targetChar) {
        arr.push('correct')
      } else {
        arr.push('wrong')
      }
    }
    charStates.value = arr

    // 判断单词全部输入完成
    if(userInput.value.length === currentWord.value.length) {
      game.finishWord(currentWord.value)
      // 同步等级/经验到响应式，并保存存档到localStorage
      syncState()
      localStorage.setItem('typeSave', JSON.stringify(game.getSaveData()))
      nextWord()
    }
  }

  // 初始化第一个单词
  nextWord()

  return {
    currentWord,
    userInput,
    charStates,
    level,
    exp,
    handleKeyInput
  }
}
