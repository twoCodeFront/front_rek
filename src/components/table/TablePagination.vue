<script setup lang="ts">
 import type {TablePaginationInterface} from "@/interfaces/tablePagination.interface.ts";

 type PropsType = {
  pagination: Omit<TablePaginationInterface<undefined>, 'data'>,
  fetchData: (page: number) => void
 }

 const {pagination, fetchData} = defineProps<PropsType>();
</script>

<template>
  <div class="mt-4 flex justify-end gap-2" v-if="pagination.total">
      <span class="mr-1 mt-1 text-gray-500">
          łącznie: {{ pagination.total }}
            <span>faktur</span>
      </span>
    <select v-model="pagination.per_page"
            @change="fetchData(1)"
            class="border rounded px-2 py-1">>
      <option>5</option>
      <option>10</option>
      <option>20</option>
    </select>
    <button
        v-for="page in pagination.last_page"
        :key="page"
        @click="fetchData(page)"
        :class="[
          'px-3 py-1 rounded border',
          page === pagination.current_page ? 'bg-blue-500 text-white' : 'bg-white text-black'
        ]"
    >
      {{ page }}
    </button>
  </div>
</template>
