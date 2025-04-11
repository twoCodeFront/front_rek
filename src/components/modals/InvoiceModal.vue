<script setup lang="ts">
import {computed, type ComputedRef, onBeforeUnmount, onMounted, ref} from "vue";
import type {InvoiceInterface} from "@/interfaces/invoice.interface.ts";
import {useForm, useField, type GenericObject} from 'vee-validate';
import * as yup from 'yup';
import dayjs from 'dayjs';
import {useInvoiceStore} from "@/store/invoiceStore.ts";
import {CircleX} from 'lucide-vue-next';

const invoiceStore = useInvoiceStore();

type Props = {
  invoice?: InvoiceInterface
}

const isOpen = ref<boolean>(false);


const openDialog = () => {
  if (props.invoice) {
    invoice_number.value = String(props.invoice.invoice_number);
    buyer_nip.value = String(props.invoice.buyer_nip);
    seller_nip.value = String(props.invoice.seller_nip);
    product_name.value = props.invoice.product_name;
    product_price.value = Number(props.invoice.product_price);
    issue_date.value = dayjs(props.invoice.issue_date).format('YYYY-MM-DD');
    edit_date.value = dayjs(props.invoice.edit_date).format('YYYY-MM-DD');
  } else {
    invoice_number.value = `F/${invoiceStore.invoicePagination.total}`;
    buyer_nip.value = String('');
    seller_nip.value = String('');
    product_name.value = '';
    product_price.value = Number(0);
    issue_date.value = null;
    edit_date.value = null;
  }
  isOpen.value = true;

};

const props = defineProps<Props>()

const onEscape = (e: KeyboardEvent): void => {
  if (e.key === 'Escape') {
    isOpen.value = false;
  }
}

const isEdit = computed(() => {
  console.log(props.invoice);
  return props.invoice && Object.keys(props.invoice).length > 0
})

onMounted(() => window.addEventListener('keydown', onEscape));

onBeforeUnmount(() => window.removeEventListener('keydown', onEscape));


const schema = yup.object({
  invoice_number: yup.string().required('Nr faktury jest wymagany'),
  buyer_nip: yup.string().length(10, 'NIP powinien mieć 10 cyfr').required('NIP kupującego jest wymagany'),
  seller_nip: yup.string().length(10, 'NIP powinien mieć 10 cyfr').required('NIP sprzedającego jest wymagany'),
  product_name: yup.string().required('Nazwa produktu jest wymagana'),
  product_price: yup.number().min(0, 'Kwota nie może być ujemna').required('Kwota netto jest wymagana'),
  issue_date: yup.date().required('Data wystawienia jest wymagana'),
  edit_date: yup.date().required('Data edycji jest wymagana'),
});

const {handleSubmit, errors} = useForm({
  validationSchema: schema,
});

const {value: invoice_number} = useField('invoice_number');
const {value: buyer_nip} = useField('buyer_nip');
const {value: seller_nip} = useField('seller_nip');
const {value: product_name} = useField('product_name');
const {value: product_price} = useField('product_price');
const {value: issue_date} = useField('issue_date');
const {value: edit_date} = useField('edit_date');

const onSubmit = handleSubmit(async (values: GenericObject): void => {
  let state;
  try {
    if (isEdit.value) {
      state = await invoiceStore.fetchUpdateInvoice(
          {
            ...values,
            id: props.invoice?.id
          }
      );
    } else {
      state = await invoiceStore.fetchCreateInvoice(values);
    }
    if (state?.id) {
      isOpen.value = false;
    } else {
      alert('Nie udało się wystawić faktury. Sprawdź poprawność danych.')
    }
  } catch (e) {
    console.error('Błąd przy zapisie faktury:', e);
    alert('Występił nieoczekiwany błąd ')
  }
});

const ensurePrice = (): void => {
  if (product_price.value === '' || product_price.value === null || isNaN(Number(product_price.value))) {
    product_price.value = 0;
  }
};

const modalLabel: ComputedRef<string> = computed(() => {
  if (isEdit.value) return `Edytuj fakturę: ${invoice_number.value}`;
  return 'Nowa faktura'
})

</script>

<template>
  <div class="relative">
    <span @click="openDialog">
      <slot></slot>
    </span>
    <div v-if="isOpen"
         class="fixed inset-0 flex items-center justify-center z-50">
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>

      <div class="relative z-10 bg-white w-[800px] h-[75vh] rounded shadow-lg p-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">{{ modalLabel }}</h2>
          <button @click="isOpen = false" class="text-gray-500 hover:text-gray-700">
            <CircleX />
          </button>
        </div>
        <div class="invoice-content flex flex-col mt-4">
          <form @submit.prevent="onSubmit" class="space-y-4">

            <div class="flex flex-col gap-2 w-full">
              <label>Numer faktury</label>
              <input v-model="invoice_number"
                     placeholder="Odręczny numer faktury"
                     type="text" class="input"/>
              <span class="error">{{ errors.invoice_number }}</span>
            </div>


            <div class="flex flex-col gap-2">
              <label>NIP Kupującego</label>
              <input v-model="buyer_nip"
                     placeholder="Uzupełnij NIP kupującego"
                     type="text" class="input"/>
              <span class="error">{{ errors.buyer_nip }}</span>
            </div>

            <div class="flex flex-col gap-2">
              <label>NIP Sprzedającego</label>
              <input v-model="seller_nip"
                     placeholder="Uzupełnij NIP sprzedającego"
                     type="text" class="input"/>
              <span class="error">{{ errors.seller_nip }}</span>
            </div>

            <div class="flex flex-col gap-2">
              <label>Nazwa Produktu</label>
              <input v-model="product_name"
                     placeholder="Uzupełnij nazwę produktu"
                     type="text" class="input"/>
              <span class="error">{{ errors.product_name }}</span>
            </div>
            <div class="flex flex-col gap-2">
              <label>Kwota Netto</label>
              <input v-model="product_price"
                     @blur="ensurePrice"
                     placeholder="Uzupełnij kwotę netto"
                     type="number" step="0.01" class="input"/>
              <span class="error">{{ errors.product_price }}</span>
            </div>

            <div class="flex flex-col gap-2">
              <label>Data Wystawienia</label>
              <input v-model="issue_date"
                     placeholder="Uzupełnij datę wystawienia"
                     type="date" class="input"/>
              <span class="error">{{ errors.issue_date }}</span>
            </div>

            <div class="flex flex-col gap-2">
              <label>Data Edycji</label>
              <input v-model="edit_date"
                     placeholder="Uzupełnij datę edycji"
                     type="date" class="input"/>
              <span class="error">{{ errors.edit_date }}</span>
            </div>
            <div class="flex justify-end mt-4">
              <button type="button"
                      @click="isOpen=false" class="text-gray-600 hover:text-black">Anuluj
              </button>
              <button type="submit"
                      class="bg-blue-600 text-white ml-2  px-4 py-2 rounded">Zapisz
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input {
  border: 1px solid #e0e0e0;
  height: 40px;
  padding: 6px;
  border-radius: 4px;
}

.error {
  color: red;
  font-size: 12px;
}
</style>