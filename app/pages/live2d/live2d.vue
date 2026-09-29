<script setup>
const exp = ref(0)
const moo = ref(0)
</script>

<template>
  <section>
    <div>{{ exp }}</div>
    <div>{{ moo }}</div>
  </section>
  <div>
    <input v-model="todo">
    <div @click="">获取单词</div>
  </div>
</template>


<style scoped>



</style>