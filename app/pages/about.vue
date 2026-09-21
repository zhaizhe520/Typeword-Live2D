<template>
  <div class="game">
    <div>等级：{{ level }} | 经验 {{ exp }} /100</div>
    <div class="char-wrap">
      <span 
        v-for="(state,idx) in charStates" 
        :key="idx"
        :class="state"
      >
        {{ currentWord[idx] }}
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
const {currentWord, charStates, level, exp, handleKeyInput} = useTypeGame()

// 全局键盘监听
onMounted(() => {
  const keydown = (e:KeyboardEvent)=>{
    // 只允许字母+退格
    if(e.key.length === 1 || e.key === 'Backspace') {
      handleKeyInput(e.key)
    }
  }
  window.addEventListener('keydown', keydown)
  onUnmounted(()=> window.removeEventListener('keydown', keydown))
})
</script>
<style scoped>
.correct { color: green; }
.wrong { color: red; animation: bounce 0.2s; }
.pending { color: #999; }
@keyframes bounce {
  0% {transform: translateX(0)}
  50% {transform: translateX(-4px)}
  100% {transform: translateX(0)}
}
</style>
