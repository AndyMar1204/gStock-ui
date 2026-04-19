import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone:false
})
export class ForgotPasswordPage implements OnInit {

  forgotForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onReset() {
    if (this.forgotForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Envoi du lien de récupération...',
        spinner: 'circles'
      });
      await loading.present();

      this.authService.forgotPassword(this.forgotForm.get('email')?.value).subscribe({
        next: () => {
          loading.dismiss();
          this.showToast('Un email de récupération a été envoyé.', 'success');
        },
        error: (err) => {
          loading.dismiss();
          this.showToast('Erreur lors de l’envoi. Vérifiez l’adresse email.', 'danger');
        }
      });
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    toast.present();
  }
}
