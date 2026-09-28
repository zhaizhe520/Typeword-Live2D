<script setup lang="ts">
import { ref } from 'vue';

// 引入胶水层提供的 API
const { state, currentWord, isGameCompleted, submitWord, resetGame } = useTypeGame();

// 页面绑定输入的文本
const userInput = ref('');

// 校验与提交逻辑
const handleInput = () => {
  if (userInput.value.trim() === currentWord.value) {
    const success = submitWord(currentWord.value);
    if (success) {
      userInput.value = ''; // 打对后清空输入框
    }
  }
};

// 重置：清空输入框 + 重置游戏状态（等级/经验/已完成列表归零并持久化）
const handleReset = () => {
  userInput.value = '';
  resetGame();
};
</script>

<template>
  <div class="game-container">
    <!-- 玩家信息面板 -->
    <header class="stats-card">
      <div class="stat-item">
        <span class="label">等级 (Level):</span>
        <span class="value">{{ state.level }}</span>
      </div>
      <div class="stat-item">
        <span class="label">经验 (EXP):</span>
        <span class="value">{{ state.exp }}</span>
      </div>
      <div class="stat-item">
        <span class="label">已完成:</span>
        <span class="value">{{ state.finishedWords.length }} / {{ state.wordList.length }}</span>
      </div>
    </header>

    <!-- 游戏主区域 -->
    <main class="play-area">
      <button class="reset-btn" @click="handleReset">重置游戏</button>

      <div v-if="!isGameCompleted" class="word-card">
        <p class="hint">请打出以下单词：</p>
        <h1 class="target-word">{{ currentWord }}</h1>

        <!-- 输入框 -->
        <input
          v-model="userInput"
          type="text"
          class="word-input"
          placeholder="在此输入并回车或完全匹配..."
          @input="handleInput"
          autofocus
        />
      </div>

      <!-- 通关展示 -->
      <div v-else class="completed-card">
        <h2>🎉 恭喜！你已打完词库中的所有单词！</h2>
      </div>
    </main>
  </div>
</template>

<style scoped>
.game-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 24px;
  font-family: system-ui, -apple-system, sans-serif;
}

.stats-card {
  display: flex;
  justify-content: space-around;
  background: #f4f4f5;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 32px;
}

.stat-item .label {
  color: #666;
  margin-right: 6px;
}

.stat-item .value {
  font-weight: bold;
  font-size: 1.2rem;
}

.play-area {
  text-align: center;
}

.target-word {
  font-size: 3rem;
  letter-spacing: 2px;
  color: #2563eb;
  margin: 16px 0 24px;
}

.word-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  outline: none;
  text-align: center;
}

.word-input:focus {
  border-color: #2563eb;
}

.reset-btn {
  margin: 16px 0;
  padding: 10px 20px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>