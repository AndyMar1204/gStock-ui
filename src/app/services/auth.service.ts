import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl + '/auth';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) { }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/authenticate`, credentials);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  logout(): void {
    this.tokenService.clear();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = this.tokenService.getToken();
    if (!token || this.tokenService.isTokenExpired()) {
      if (token) {
        this.logout();
      }
      return false;
    }
    return true;
  }

  validateToken(): boolean {
    if (this.tokenService.isTokenExpired()) {
      this.logout();
      return false;
    }
    return true;
  }
}
