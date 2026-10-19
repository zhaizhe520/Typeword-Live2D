<template>
  <div class="page">
    <div class="title">N2 词库</div>

    <!-- 经验 / 等级面板 -->
    <div class="exp-panel">
      <span class="level">Lv.{{ expState.expLevel }}</span>
      <div class="bar">
        <div class="bar-fill" :style="{ width: expPercent + '%' }"></div>
      </div>
      <span class="exp-text">{{ expState.exp }} / {{ EXP_PER_LEVEL }}</span>
    </div>

    <!-- 渲染 n2.json 里的词条 -->
    <div class="inner">
      <div v-for="(word, idx) in words" :key="idx" class="card">
        <!-- 顶部：汉字词 -->
        <div class="expression">{{ word.expression }}</div>

        <!-- 其余字段渲染在单词下面 -->
        <div class="meta">
          <span class="meaning">{{ word.meaning }}</span>
          <span class="tags">{{ word.tags }}</span>
        </div>

        <!-- 输入读音 -->
        <div class="controls">
          <input
            v-model="answers[idx]"
            :disabled="results[idx] === true"
            placeholder="输入读音（平假名）"
            @keydown.enter="submitWord(idx)"
          />
          <button :disabled="results[idx] === true" @click="submitWord(idx)">提交</button>
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

      <button class="random" @click="pickRandom(5)">随机5个</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EXP_PER_LEVEL } from '~/core/doMain/ExpStateCore';

// 单词层（词库 + 答案 + 对错） + 经验领域层
const { words, answers, results, pickRandom, submitWord } = useWord();
const { expState } = useGameStore();

// 经验条进度（0 ~ 100）
const expPercent = computed(() =>
  Math.min(100, (expState.value.exp / EXP_PER_LEVEL) * 100),
);
</script>

<style scoped>
.page {
  padding: 24px;
  font-family: system-ui, sans-serif;
}
.title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}
.exp-panel {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}
.level {
  font-weight: 700;
  color: #7c3aed;
}
.bar {
  flex: 1;
  height: 12px;
  background: #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  background: #7c3aed;
  border-radius: 6px;
  transition: width 0.3s ease;
}
.exp-text {
  font-size: 13px;
  color: #6b7280;
}
.inner {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.card {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}
.expression {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 6px;
}
.meta {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
  font-size: 13px;
}
.meaning {
  color: #374151;
}
.tags {
  color: #9ca3af;
  font-size: 12px;
}
.controls {
  display: flex;
  align-items: center;
  gap: 10px;
}
.controls input {
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
}
.controls input:focus {
  border-color: #7c3aed;
}
.controls button {
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  background: #7c3aed;
  color: #fff;
  cursor: pointer;
}
.controls button:disabled {
  background: #c4b5fd;
  cursor: not-allowed;
}
.result {
  width: 20px;
  font-size: 16px;
}
.result.ok {
  color: #16a34a;
}
.result.no {
  color: #dc2626;
}
.hint {
  margin-top: 8px;
  font-size: 13px;
  color: #dc2626;
}
.random {
  align-self: flex-start;
  padding: 8px 16px;
  border: 1px solid #7c3aed;
  border-radius: 6px;
  background: transparent;
  color: #7c3aed;
  cursor: pointer;
}
</style>
