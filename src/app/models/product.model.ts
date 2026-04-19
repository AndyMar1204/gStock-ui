export interface Category {
  id?: number;
  name: string;
}

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: number;
  category?: Category;
}
