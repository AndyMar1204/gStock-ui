import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { InvoiceService } from '../../services/invoice.service';
import { Product } from '../../models/product.model';
import { Invoice, InvoiceItem } from '../../models/invoice.model';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-new-sale',
  templateUrl: './new-sale.page.html',
  styleUrls: ['./new-sale.page.scss'],
  standalone: false
})
export class NewSalePage implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  
  cart: InvoiceItem[] = [];
  client: Client = { name: '', email: '', phone: '', address: '' };
  invoiceType: 'SALE' | 'PROFORMA' = 'SALE';
  
  searchTerm = '';
  clientSearchTerm = '';
  filteredClients: Client[] = [];
  loadingData = true;
  isNewClient = true;

  constructor(
    private productService: ProductService,
    private invoiceService: InvoiceService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private clientService: ClientService
  ) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loadingData = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = [];
        this.loadingData = false;
      },
      error: () => this.loadingData = false
    });
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    if (this.searchTerm.length < 2) {
      this.filteredProducts = [];
      return;
    }
    this.filteredProducts = this.products.filter(p => 
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    ).slice(0, 5);
  }

  onClientSearch(event: any) {
    const query = event.detail.value;
    if (query.length < 2) {
      this.filteredClients = [];
      return;
    }
    this.clientService.searchClients(query).subscribe(clients => {
      this.filteredClients = clients;
    });
  }

  selectClient(selectedClient: Client) {
    this.client = { ...selectedClient };
    this.clientSearchTerm = selectedClient.name;
    this.filteredClients = [];
    this.isNewClient = false;
    this.showToast(`Client ${selectedClient.name} sélectionné`);
  }

  clearClientSelection() {
    this.client = { name: '', email: '', phone: '', address: '' };
    this.clientSearchTerm = '';
    this.isNewClient = true;
  }

  addToCart(product: Product) {
    const existing = this.cart.find(item => item.productId === product.id);
    if (existing) {
      if (existing.quantity >= product.quantity) {
        this.showToast('Stock insuffisant pour ce produit', 'warning');
        return;
      }
      existing.quantity++;
    } else {
      this.cart.push({
        productId: product.id!,
        productName: product.name,
        quantity: 1,
        unitPrice: product.price
      });
    }
    this.filteredProducts = [];
    this.searchTerm = '';
    this.showToast(`${product.name} ajouté au panier`);
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
  }

  updateQuantity(index: number, delta: number) {
    const item = this.cart[index];
    const product = this.products.find(p => p.id === item.productId);
    
    if (delta > 0 && product && item.quantity >= product.quantity) {
      this.showToast('Stock maximum atteint', 'warning');
      return;
    }
    
    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeFromCart(index);
    }
  }

  getTotal(): number {
    return this.cart.reduce((sum, item) => sum + (item.unitPrice! * item.quantity), 0);
  }

  async validateAndSubmit() {
    if (this.cart.length === 0) {
      this.showToast('Le panier est vide', 'warning');
      return;
    }
    if (!this.client.name || !this.client.phone) {
      this.showToast('Informations client incomplètes', 'warning');
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Confirmer la validation',
      message: `Voulez-vous générer cette ${this.invoiceType === 'SALE' ? 'facture' : 'proforma'} ?`,
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        { text: 'Valider', handler: () => this.submitInvoice() }
      ]
    });
    alert.present();
  }

  async submitInvoice() {
    const loading = await this.loadingCtrl.create({ message: 'Génération en cours...' });
    await loading.present();

    const invoice: Invoice = {
      type: this.invoiceType,
      client: this.client,
      items: this.cart
    };

    this.invoiceService.createInvoice(invoice).subscribe({
      next: (res) => {
        loading.dismiss();
        this.showToast('Facture générée avec succès !', 'success');
        this.router.navigate(['/home/invoices']);
      },
      error: (err) => {
        loading.dismiss();
        const msg = err.error?.message || 'Erreur lors de la génération';
        this.showToast(msg, 'danger');
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
