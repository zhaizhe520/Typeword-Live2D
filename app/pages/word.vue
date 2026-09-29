<template>
  <div>
    <div>这是词库</div>
    <!-- 渲染 words.json 里的单词 -->
    <div class="inner">
      <div v-for="(word, idx) in words" :key="idx">
        <div>{{ word }}</div>
        <input />
      </div>
      <button @click="pickRandom(5)">随机5个</button>
    </div>

  </div>
</template>

<script setup lang="ts">
//解构
const { words, pickRandom } = useWord();
</script>

<style scoped>
.inner{
  width: auto;
  height: 20px;
  margin-top: 20px;
}

</style>