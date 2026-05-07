import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly TOKEN_KEY = 'auth-token';
  private readonly USER_KEY = 'auth-user';

  constructor() { }

  saveToken(token: string): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  saveUser(user: any): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): any {
    const user = localStorage.getItem(this.USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  clear(): void {
    localStorage.clear();
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }

    try {
      const decoded: any = jwtDecode(token);
      if (!decoded.exp) {
        return false;
      }

      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(decoded.exp);

      return expirationDate < new Date();
    } catch (error) {
      return true;
    }
  }
}
