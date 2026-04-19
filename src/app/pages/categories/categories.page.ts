import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Category } from '../../models/product.model';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: false
})
export class CategoriesPage implements OnInit {
  categories: Category[] = [];
  loading = true;

  constructor(
    private productService: ProductService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  async openAddAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Nouvelle Catégorie',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nom de la catégorie'
        }
      ],
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Ajouter',
          handler: (data) => {
            if (data.name) {
              this.addCategory(data.name);
            }
          }
        }
      ]
    });
    alert.present();
  }

  async addCategory(name: string) {
    const loader = await this.loadingCtrl.create({ message: 'Ajout en cours...' });
    await loader.present();

    this.productService.addCategory({ name }).subscribe({
      next: () => {
        loader.dismiss();
        this.showToast('Catégorie ajoutée !', 'success');
        this.loadCategories();
      },
      error: (err) => {
        loader.dismiss();
        this.showToast('Erreur lors de l\'ajout', 'danger');
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
