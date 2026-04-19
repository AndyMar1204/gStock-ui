import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone:false
})
export class RegisterPage implements OnInit {

  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['USER', Validators.required]
    });
  }

  async onRegister() {
    if (this.registerForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Création du compte...',
        spinner: 'circles'
      });
      await loading.present();

      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          loading.dismiss();
          this.showToast('Compte créé avec succès ! Connectez-vous.', 'success');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          loading.dismiss();
          this.showToast('Erreur lors de l’inscription. L’email est peut-être déjà utilisé.', 'danger');
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
