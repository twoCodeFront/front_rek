<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  amount: number | string;
}>();

const formattedPrice = computed(() => {
  const number = Number(props.amount);
  if (isNaN(number)) return '—';

  return number
      .toFixed(2)
      .replace('.', ',') + ' PLN';
});
</script>

<template>
  <span>{{ formattedPrice }}</span>
</template>

<style scoped>
span {
  font-variant-numeric: tabular-nums;
}
</style>
