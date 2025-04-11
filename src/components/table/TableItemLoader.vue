<script setup lang="ts">

</script>

<template>
  <div class="skeleton"></div>
</template>

<style scoped>
.skeleton {
  height: 20px;
  background-color: #e0e0e0;
  animation: skeleton-loading 1.5s infinite linear;
  border-radius: 4px;
}

@keyframes skeleton-loading {
  0% {
    background-color: #e0e0e0;
  }
  50% {
    background-color: #f0f0f0;
  }
  100% {
    background-color: #e0e0e0;
  }
}
</style>