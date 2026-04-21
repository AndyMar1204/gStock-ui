import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Client } from '../../models/client.model';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
  standalone: false,
})
export class ClientsPage implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm: string = '';
  showForm: boolean = false;
  clientForm!: FormGroup;
  isEditing: boolean = false;
  currentClientId?: number;

  constructor(
    private clientService: ClientService,
    private fb: FormBuilder,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadClients();
  }

  initForm() {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.email]],
      address: ['']
    });
  }

  async loadClients() {
    const loading = await this.loadingController.create({
      message: 'Chargement des clients...',
      duration: 3000
    });
    await loading.present();

    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.filteredClients = data;
        loading.dismiss();
      },
      error: async (err) => {
        console.error(err);
        loading.dismiss();
        this.showToast('Erreur lors du chargement des clients', 'danger');
      }
    });
  }

  filterClients() {
    if (!this.searchTerm.trim()) {
      this.filteredClients = this.clients;
      return;
    }
    const query = this.searchTerm.toLowerCase();
    this.filteredClients = this.clients.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.phone.includes(query) ||
      (c.email && c.email.toLowerCase().includes(query))
    );
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  editClient(client: Client) {
    this.isEditing = true;
    this.currentClientId = client.id;
    this.clientForm.patchValue({
      name: client.name,
      phone: client.phone,
      email: client.email,
      address: client.address
    });
    this.showForm = true;
  }

  resetForm() {
    this.isEditing = false;
    this.currentClientId = undefined;
    this.clientForm.reset();
    this.showForm = false;
  }

  async saveClient() {
    if (this.clientForm.invalid) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Enregistrement...',
    });
    await loading.present();

    const clientData = this.clientForm.value;

    if (this.isEditing && this.currentClientId) {
      this.clientService.updateClient(this.currentClientId, clientData).subscribe({
        next: () => {
          this.showToast('Client mis à jour avec succès', 'success');
          this.loadClients();
          this.resetForm();
          loading.dismiss();
        },
        error: (err) => {
          console.error(err);
          loading.dismiss();
          this.showToast('Erreur lors de la mise à jour', 'danger');
        }
      });
    } else {
      this.clientService.createClient(clientData).subscribe({
        next: () => {
          this.showToast('Client créé avec succès', 'success');
          this.loadClients();
          this.resetForm();
          loading.dismiss();
        },
        error: (err) => {
          console.error(err);
          loading.dismiss();
          this.showToast('Erreur lors de la création', 'danger');
        }
      });
    }
  }

  async confirmDelete(client: Client) {
    const alert = await this.alertController.create({
      header: 'Confirmer la suppression',
      message: `Voulez-vous vraiment supprimer le client ${client.name} ?`,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: () => {
            this.deleteClient(client.id!);
          }
        }
      ]
    });

    await alert.present();
  }

  deleteClient(id: number) {
    this.clientService.deleteClient(id).subscribe({
      next: () => {
        this.showToast('Client supprimé', 'success');
        this.loadClients();
      },
      error: (err) => {
        console.error(err);
        this.showToast('Impossible de supprimer ce client (il a probablement des factures liées)', 'danger');
      }
    });
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}
