import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product, Category } from '../../models/product.model';
import { ModalController, ToastController } from '@ionic/angular';

import { AddProductComponent } from '../../components/add-product/add-product.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
  standalone: false
})
export class InventoryPage implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  
  searchTerm = '';
  selectedCategoryId?: number;
  loading = true;

  constructor(
    private productService: ProductService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.productService.getCategories().subscribe(cats => this.categories = cats);
    this.productService.getProducts().subscribe({
      next: (prods) => {
        this.products = prods;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                            p.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = !this.selectedCategoryId || p.categoryId === this.selectedCategoryId;
      return matchesSearch && matchesCategory;
    });
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    this.applyFilters();
  }

  onCategoryChange(event: any) {
    this.selectedCategoryId = event.detail.value;
    this.applyFilters();
  }

  async openAddModal() {
    const modal = await this.modalCtrl.create({
      component: AddProductComponent,
      cssClass: 'premium-modal'
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.loadData(); // Refresh list if product was added
    }
  }
}
