<script setup lang="ts">
import {Trash, Pencil} from 'lucide-vue-next';
import type {InvoiceInterface} from "@/interfaces/invoice.interface.ts";
import {defineAsyncComponent, type PropType} from "vue";
import PriceFormat from "@/components/other/PriceFormat.vue";
import {useInvoiceStore} from "@/store/invoiceStore.ts";

const invoiceStore = useInvoiceStore();
const InvoiceModal = defineAsyncComponent(() => import('@/components/modals/InvoiceModal.vue'))
const QuestionDialog = defineAsyncComponent(() => import('@/components/modals/QuestionDialog.vue'))

const props = defineProps({
  invoice: {
    type: Object as PropType<InvoiceInterface>,
    required: true,
  },
});

const onDelete = async (invoiceId: number): Promise<void> => {
  await invoiceStore.fetchDeleteInvoice(invoiceId)
}


</script>

<template>
  <td class="text-center">{{ props.invoice.invoice_number }}</td>
  <td class="text-center">{{ props.invoice.buyer_nip }}</td>
  <td class="text-center">{{ props.invoice.seller_nip }}</td>
  <td class="text-center">{{ props.invoice.product_name }}</td>
  <td class="text-end">
    <PriceFormat :amount=" props.invoice.product_price"/>
  </td>
  <td class="text-center">{{ props.invoice.issue_date }}</td>
  <td class="text-center">{{ props.invoice.edit_date }}</td>
  <td>
    <div class="flex flex-row items-baseline justify-end pr-2">
      <InvoiceModal :invoice="props.invoice">
        <button class="mr-2">
          <Pencil :size="13"/>
        </button>
      </InvoiceModal>
      <QuestionDialog :invoice="props.invoice"
                      @delete="onDelete">
        <button>
          <Trash :size="15"/>
        </button>
      </QuestionDialog>
    </div>
  </td>
</template>