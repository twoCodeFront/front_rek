import {type Reactive, reactive, ref} from "vue";
import {defineStore} from 'pinia'
import type {InvoiceInterface} from "../interfaces/invoice.interface.ts";
import axios from 'axios';
import type {Ref} from "vue";
import type {TablePaginationInterface} from "../interfaces/tablePagination.interface.ts";

const url = import.meta.env.VITE_URL;

export const useInvoiceStore = defineStore('invoice', () => {
    const isLoading: Ref<boolean> = ref<boolean>(true);
    const isError: Ref<boolean> = ref<boolean>(false);
    const invoicePagination: Reactive<TablePaginationInterface<InvoiceInterface[]>> = reactive({
        data: [],
        current_page: 1,
        per_page: 10,
        last_page: 1,
        total: 0,
    });

    const fetchCreateInvoice = async (payload: InvoiceInterface): Promise<InvoiceInterface | undefined> => {
        try {
            const response = await axios.post(url + 'invoices', payload);
            if (response.status === 201) {
                await fetchFindAllInvoices(invoicePagination.current_page);
            }
            return response.data;
        } catch (error) {
            console.error('Błąd przy zapisie faktury:', error);
            return undefined;
        }
    }

    const fetchUpdateInvoice = async (payload: InvoiceInterface): Promise<InvoiceInterface | undefined> => {
        try {
            const response = await axios.put(url + 'invoices/' + payload.id, payload);
            if (response.status === 200) {
                await fetchFindAllInvoices(invoicePagination.current_page);
            }
            return response.data;
        } catch (error) {
            console.error('Błąd przy edycji faktury', error)
            return undefined;
        }
    }

    const fetchDeleteInvoice = async (id: number): Promise<void> => {
        try {
            await axios.delete(url + 'invoices/' + id);
            await fetchFindAllInvoices(invoicePagination.current_page);
        } catch (error) {
            console.error('Nie udało się usunąć fkaktury', error);
        }
    }

    const fetchFindAllInvoices = async (page = 1): Promise<void> => {
        isLoading.value = true;
        isError.value = false;

        try {
            const response = await axios.get(url + 'invoices', {
                params: {
                    page,
                    per_page: invoicePagination.per_page,
                },
            });

            const {data, current_page, last_page, total} = response.data;

            invoicePagination.data = data;
            invoicePagination.current_page = current_page;
            invoicePagination.last_page = last_page;
            invoicePagination.total = total;
            console.log(invoicePagination);

        } catch (error) {
            console.error('Błąd podczas pobierania faktur:', error);
            isError.value = true;
        } finally {
            isLoading.value = false;
        }
    }


    return {
        isLoading,
        isError,
        invoicePagination,
        fetchFindAllInvoices,
        fetchCreateInvoice,
        fetchUpdateInvoice,
        fetchDeleteInvoice
    }
});