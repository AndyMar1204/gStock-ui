import { Product } from './product.model';

export interface ChartData {
  label: string;
  value: number;
  date: string;
  quantity: number;
  name: string;
  amount: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalInvoicesCount: number;
  totalClientsCount: number;
  salesHistory: ChartData[];
  topProducts: ChartData[];
  lowStockProducts: Product[];
}
