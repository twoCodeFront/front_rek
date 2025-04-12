<script setup lang="ts">
import {useInvoiceStore} from "@/store/invoiceStore.ts";
import {computed, type ComputedRef, defineAsyncComponent, onMounted} from "vue";
import {storeToRefs} from "pinia";
import TableHeader from "@/components/table/TableHeader.vue";
import TableItemLoader from "@/components/table/TableItemLoader.vue";
import TableFilter from "@/components/table/TableFilter.vue";
import TablePagination from "@/components/table/TablePagination.vue";

const TableItem = defineAsyncComponent(() => import('@/components/table/TableItem.vue'));
const invoiceStore = useInvoiceStore();
const {invoicePagination, isLoading, isError} = storeToRefs(invoiceStore);

const isTableVisible: ComputedRef<boolean> = computed(() => !isLoading.value && !isError.value);
const isLoaderVisible: ComputedRef<boolean> = computed(() => isLoading.value && !isError.value);
const isErrorVisible: ComputedRef<boolean> = computed(() => !isLoading.value && isError.value);

onMounted(() => {
  invoiceStore.fetchFindAllInvoices();
});

</script>

<template>
  <div v-if="isTableVisible" class="w-full flex flex-col">
    <TableFilter/>
    <table class="p-2 w-full bg-gray-100">
      <thead class="pb-2">
      <TableHeader/>
      </thead>
      <tbody>
      <tr v-if="!invoicePagination.total">
        <td colspan="8">
          <div class="flex flex-row items-center justify-center h-[150px] w-full">
            <span>Brak faktur</span>
          </div>
        </td>
      </tr>
      <tr class="h-[40px] hover:bg-gray-200" v-for="invoice in invoicePagination.data" :key="invoice.id">
        <Suspense>
          <template #default>
            <TableItem :invoice="invoice"/>
          </template>
          <template #fallback>
            <td colspan="8">
              <TableItemLoader/>
            </td>
          </template>
        </Suspense>
      </tr>
      </tbody>
    </table>
    <TablePagination :fetchData="invoiceStore.fetchFindAllInvoices"
                     :pagination="invoicePagination"/>
  </div>
  <div v-else-if="isLoaderVisible" class="flex flex-col items-center justify-center w-full h-full">
    <div>
      <span>Loading...</span>
    </div>
  </div>
  <div v-else-if="isErrorVisible">
    <span>Wystąpił nieznany błąd spróbuj ponownie.</span>
    <button @click="invoiceStore.fetchFindAllInvoices">Retry</button>
  </div>
</template>