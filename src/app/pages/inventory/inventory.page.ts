import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product, Category } from '../../models/product.model';
import { ModalController, ToastController, AlertController } from '@ionic/angular';

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
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
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
      this.loadData();
    }
  }

  async editProduct(product: Product) {
    const modal = await this.modalCtrl.create({
      component: AddProductComponent,
      componentProps: {
        existingProduct: product
      },
      cssClass: 'premium-modal'
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.loadData();
    }
  }

  async deleteProduct(product: Product) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmer la suppression',
      message: `Voulez-vous vraiment supprimer le produit "${product.name}" ?`,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: () => {
            this.performDelete(product.id!);
          }
        }
      ]
    });

    await alert.present();
  }

  private performDelete(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.showToast('Produit supprimé avec succès', 'success');
        this.loadData();
      },
      error: (err) => {
        console.error('Error deleting product', err);
        this.showToast('Erreur lors de la suppression', 'danger');
      }
    });
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    toast.present();
  }
}
