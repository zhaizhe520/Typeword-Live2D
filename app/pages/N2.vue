<template>
  <div class="page">
    <!-- 顶部标题 + 经验面板 -->
    <header class="header">
      <h1 class="title">N2 词库</h1>
      <div class="exp-panel">
        <span class="level">Lv.{{ expState.expLevel }}</span>
        <div class="bar">
          <div class="bar-fill" :style="{ width: expPercent + '%' }"></div>
        </div>
        <span class="exp-text">{{ expState.exp }} / {{ expToNext }}</span>
      </div>
    </header>

    <!-- 词条卡片列表 -->
    <div class="inner">
      <div v-for="(word, idx) in words" :key="idx" class="card" :class="{ done: results[idx] === true }">
        <!-- 汉字词 -->
        <div class="expression">{{ word.expression }}</div>

        <!-- 释义 + 标签 -->
        <div class="meta">
          <span class="meaning">{{ word.meaning }}</span>
          <span v-for="tag in word.tags.split(' ')" :key="tag" class="tag">{{ tag }}</span>
        </div>

        <!-- 输入读音 -->
        <div class="controls">
          <input
            v-model="answers[idx]"
            :disabled="results[idx] === true"
            placeholder="输入读音（平假名）"
            @keydown.enter="submitWord(idx)"
          />
          <button :disabled="results[idx] === true" @click="submitWord(idx)">
            {{ results[idx] === true ? '已过关' : '提交' }}
          </button>
          <span
            class="result"
            :class="results[idx] === true ? 'ok' : results[idx] === false ? 'no' : ''"
          >
            {{ results[idx] === true ? '✔' : results[idx] === false ? '✘' : '' }}
          </span>
        </div>

        <!-- 打错时提示正确读音 -->
        <div v-if="results[idx] === false" class="hint">正确读音：{{ word.reading }}</div>
      </div>

      <button class="random" @click="pickRandom(5)">随机 5 个</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { expToNextLevel } from '~/core/doMain/ExpStateCore';

// 单词层（词库 + 答案 + 对错） + 经验领域层
const { words, answers, results, pickRandom, submitWord } = useWord();
const { expState } = useGameStore();

// 当前等级升到下一级还需要多少经验
const expToNext = computed(() => expToNextLevel(expState.value.expLevel));

// 经验条进度（0 ~ 100）
const expPercent = computed(() =>
  Math.min(100, (expState.value.exp / expToNext.value) * 100),
);
</script>

<style scoped>
.page {
  max-width: 640px;
  margin: 0 auto;
  padding: 32px 20px 60px;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  color: #1f2937;
}
.header {
  margin-bottom: 28px;
}
.title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 16px;
}
.exp-panel {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: #f5f3ff;
  border-radius: 12px;
}
.level {
  font-weight: 800;
  font-size: 15px;
  color: #6d28d9;
  white-space: nowrap;
}
.bar {
  flex: 1;
  height: 10px;
  background: #e5e7eb;
  border-radius: 5px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6, #6d28d9);
  border-radius: 5px;
  transition: width 0.3s ease;
}
.exp-text {
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
}
.inner {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.card {
  padding: 20px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.15s ease, border-color 0.15s ease;
}
.card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}
.card.done {
  border-color: #bbf7d0;
  background: #f0fdf4;
}
.expression {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}
.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 16px;
  font-size: 13px;
}
.meaning {
  color: #4b5563;
}
.tag {
  padding: 2px 8px;
  background: #ede9fe;
  color: #6d28d9;
  border-radius: 999px;
  font-size: 12px;
}
.controls {
  display: flex;
  align-items: center;
  gap: 10px;
}
.controls input {
  flex: 1;
  padding: 9px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
  font-size: 15px;
  transition: border-color 0.15s ease;
}
.controls input:focus {
  border-color: #6d28d9;
  box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.1);
}
.controls button {
  padding: 9px 18px;
  border: none;
  border-radius: 8px;
  background: #6d28d9;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s ease;
}
.controls button:hover:not(:disabled) {
  background: #5b21b6;
}
.controls button:disabled {
  background: #c4b5fd;
  cursor: not-allowed;
}
.result {
  width: 22px;
  text-align: center;
  font-size: 17px;
}
.result.ok {
  color: #16a34a;
}
.result.no {
  color: #dc2626;
}
.hint {
  margin-top: 10px;
  font-size: 13px;
  color: #dc2626;
}
.random {
  align-self: flex-start;
  padding: 10px 20px;
  border: 1px solid #6d28d9;
  border-radius: 8px;
  background: transparent;
  color: #6d28d9;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s ease;
}
.random:hover {
  background: #f5f3ff;
}
</style>
