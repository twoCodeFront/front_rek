<script setup lang="ts">

import {defineAsyncComponent} from "vue";

const Table = defineAsyncComponent(() => import('@/components/table/TableWrapper.vue'));
</script>

<template>
<div class="p-8">
    <Suspense>
      <template #default>
        <Table />
      </template>
      <template #fallback>
        <span>Loading...</span>
      </template>
    </Suspense>
</div>
</template>

<style scoped>

</style>
