import { Client } from './client.model';

export interface InvoiceItem {
  productId: number;
  productName?: string;
  quantity: number;
  unitPrice?: number;
}

export interface Invoice {
  id?: number;
  invoiceNumber?: string;
  date?: string;
  type: 'SALE' | 'PROFORMA';
  client: Client;
  items: InvoiceItem[];
  totalAmount?: number;
}


