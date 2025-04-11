<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";
import type {InvoiceInterface} from "@/interfaces/invoice.interface.ts";

type Props = {
  invoice: InvoiceInterface
}
const props = defineProps<Props>();

const emit = defineEmits<{
  (event: "delete", value: number): void;
}>();

const isOpen = ref<boolean>(false);

const openDialog = (): void => {
  isOpen.value = true;
};

const onEscape = (e: KeyboardEvent): void => {
  if (e.key === 'Escape') {
    isOpen.value = false;
  }
}

const onDelete = (): void => {
  emit('delete', props.invoice.id);
  isOpen.value = false;
}

onMounted(() => window.addEventListener('keydown', onEscape));

onBeforeUnmount(() => window.removeEventListener('keydown', onEscape));

</script>

<template>
  <div class="relative">
    <span @click="openDialog">
      <slot></slot>
    </span>
    <div v-if="isOpen"
         class="fixed inset-0 flex items-center justify-center z-50">
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>

      <div class="relative z-10 bg-white w-[600px] rounded shadow-lg p-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Usuń fakturę nr : {{ props.invoice.invoice_number }}</h2>
          <button @click="isOpen = false" class="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <div>
          <span>Czy jesteś pewien że chcesz usunąć fakturę {{ props.invoice.invoice_number }}</span>
        </div>
        <div class="flex justify-end mt-4">
          <button type="button"
                  @click="isOpen=false" class="text-gray-600 hover:text-black">Anuluj
          </button>
          <button type="submit"
                  @click.prevent="onDelete"
                  class="bg-red-600 text-white ml-2  px-4 py-2 rounded">Usuń
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>