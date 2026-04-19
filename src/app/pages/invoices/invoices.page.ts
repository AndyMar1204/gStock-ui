import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice.model';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.page.html',
  styleUrls: ['./invoices.page.scss'],
  standalone: false
})
export class InvoicesPage implements OnInit {
  invoices: Invoice[] = [];
  loading = true;

  constructor(
    private invoiceService: InvoiceService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices() {
    this.loading = true;
    this.invoiceService.getInvoices().subscribe({
      next: (data) => {
        this.invoices = data.sort((a, b) => (b.id || 0) - (a.id || 0)); // Newest first
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading invoices', err);
        this.loading = false;
      }
    });
  }

  async downloadPdf(invoice: Invoice) {
    if (!invoice.id) return;

    const loader = await this.loadingCtrl.create({
      message: 'Préparation du PDF...'
    });
    await loader.present();

    this.invoiceService.getInvoicePdf(invoice.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Facture_${invoice.invoiceNumber || invoice.id}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        loader.dismiss();
      },
      error: (err) => {
        loader.dismiss();
        this.showToast('Erreur lors du téléchargement du PDF', 'danger');
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
