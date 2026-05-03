import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice.model';
import { LoadingController, ToastController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

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
      next: async (blob) => {
        const fileName = `Facture_${invoice.invoiceNumber || invoice.id}.pdf`;

        if (Capacitor.isNativePlatform()) {
          try {
            const base64Data = await this.convertBlobToBase64(blob) as string;
            const savedFile = await Filesystem.writeFile({
              path: fileName,
              data: base64Data.split(',')[1],
              directory: Directory.Documents,
            });
            this.showToast(`Facture enregistrée dans vos documents`, 'success');
          } catch (e) {
            console.error('Error saving file', e);
            this.showToast('Erreur lors de l\'enregistrement du fichier', 'danger');
          }
        } else {
          // Web implementation
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          link.click();
          window.URL.revokeObjectURL(url);
        }
        loader.dismiss();
      },
      error: (err) => {
        loader.dismiss();
        this.showToast('Erreur lors du téléchargement du PDF', 'danger');
      }
    });
  }

  private convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
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
