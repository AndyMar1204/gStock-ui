import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl + '/auth';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
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
  }

  isLoggedIn(): boolean {
    return !!this.tokenService.getToken();
  }
}
