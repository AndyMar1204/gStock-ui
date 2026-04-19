import { Product } from './product.model';

export interface SalesHistory {
  date: string;
  amount: number;
}

export interface TopProduct {
  name: string;
  quantity: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalInvoicesCount: number;
  totalClientsCount: number;
  salesHistory: SalesHistory[];
  topProducts: TopProduct[];
  lowStockProducts: Product[];
}
