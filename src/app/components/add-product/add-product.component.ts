import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { ProductService } from '../../services/product.service';
import { Product, Category } from '../../models/product.model';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class AddProductComponent implements OnInit {
  @Input() existingProduct?: Product;

  product: Product = {
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    categoryId: 0
  };
  
  isEdit = false;
  categories: Category[] = [];

  constructor(
    private modalCtrl: ModalController,
    private productService: ProductService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.loadCategories();
    if (this.existingProduct) {
      this.isEdit = true;
      this.product = { ...this.existingProduct };
    }
  }

  loadCategories() {
    this.productService.getCategories().subscribe(cats => {
      this.categories = cats;
      if (this.categories.length > 0) {
        this.product.categoryId = this.categories[0].id!;
      }
    });
  }

  async dismiss() {
    await this.modalCtrl.dismiss();
  }

  async onSave() {
    if (!this.product.name || this.product.price <= 0 || this.product.quantity < 0) {
      this.showToast('Veuillez remplir correctement les champs obligatoires.', 'warning');
      return;
    }

    const loader = await this.loadingCtrl.create({
      message: this.isEdit ? 'Mise à jour du produit...' : 'Enregistrement du produit...'
    });
    await loader.present();

    const operation = this.isEdit 
      ? this.productService.updateProduct(this.product.id!, this.product)
      : this.productService.addProduct(this.product);

    operation.subscribe({
      next: (res) => {
        loader.dismiss();
        this.showToast(this.isEdit ? 'Produit mis à jour !' : 'Produit ajouté !', 'success');
        this.modalCtrl.dismiss(res);
      },
      error: (err) => {
        loader.dismiss();
        this.showToast('Erreur lors de l\'opération.', 'danger');
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
