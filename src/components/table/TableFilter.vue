<script setup lang="ts">
import {defineAsyncComponent} from "vue";

const InvoiceModal = defineAsyncComponent(() => import('@/components/modals/InvoiceModal.vue'))

</script>

<template>
  <div class="flex flex-row items-center justify-between mb-4">
    <InvoiceModal>
      <button class="bg-blue-500 text-white h-[30px] pl-2 pr-2 rounded">Dodaj</button>
    </InvoiceModal>
  </div>
</template>