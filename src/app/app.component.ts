import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Dashboard', url: '/home/dashboard', icon: 'grid' },
    { title: 'Inventaire', url: '/home/inventory', icon: 'cube' },
    { title: 'Catégories', url: '/home/categories', icon: 'list' },
    { title: 'Nouvelle Vente', url: '/home/new-sale', icon: 'cart' },
    { title: 'Factures', url: '/home/invoices', icon: 'receipt' },
  ];

  isDarkMode = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDarkMode = prefersDark.matches;
    this.initializeDarkMode();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.initializeDarkMode();
  }

  initializeDarkMode() {
    document.body.classList.toggle('dark', this.isDarkMode);
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
