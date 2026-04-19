import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone:false
})
export class LoginPage implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  async onLogin() {
    if (this.loginForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Connexion en cours...',
        spinner: 'circles'
      });
      await loading.present();

      this.authService.login(this.loginForm.value).subscribe({
        next: (data) => {
          loading.dismiss();
          this.tokenService.saveToken(data.token);
          this.tokenService.saveUser(data); // If backend returns user info
          this.router.navigate(['/home']);
          this.showToast('Bienvenue sur 360Diagnostics-SM !', 'success');
        },
        error: (err) => {
          loading.dismiss();
          this.showToast('Identifiants incorrects ou erreur serveur.', 'danger');
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
