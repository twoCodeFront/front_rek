export interface InvoiceInterface {
    id?: number;
    invoice_number: string;
    buyer_nip: number;
    seller_nip: number;
    product_name: string;
    product_price: number;
    issue_date: string | null;
    edit_date: string | null;
}