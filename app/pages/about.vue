<!-- pages/index.vue -->
<script setup>
// 1. 全局状态：玩家等级和经验
const exp = useState('exp', () => 0)
const level = useState('level', () => 1)

// 假设的打字目标文本
const targetText = 'Hello Nuxt 3'
const userInput = ref('')

// 监听输入，打字正确就加经验
const handleInput = () => {
  if (userInput.value === targetText) {
    exp.value += 50
    userInput.value = ''
    
    // 升级逻辑
    if (exp.value >= 100) {
      level.value++
      exp.value = 0
      alert(`恭喜升级到 Lv.${level.value}！可以解锁新动作/模型了！`)
    }
  }
}
</script>

<template>
  <div class="game-container">
    <!-- Live2D 渲染区域（后续放入你的 WebGL 渲染组件） -->
    <div class="live2d-wrapper">
      <p>【Live2D 角色区域】当前等级: Lv.{{ level }} | 经验值: {{ exp }}/100</p>
    </div>

    <!-- 打字练习区域 -->
    <div class="typing-area">
      <h3>请打出：<span style="color: blue;">{{ targetText }}</span></h3>
      <input 
        v-model="userInput" 
        @input="handleInput" 
        placeholder="在此打字..." 
        style="padding: 10px; width: 300px;"
      />
    </div>
  </div>
</template>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
.live2d-wrapper {
  width: 400px;
  height: 300px;
  border: 2px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
</style>