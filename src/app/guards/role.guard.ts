import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { TokenService } from '../services/token.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private router: Router,
    private tokenService: TokenService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    const token = this.tokenService.getToken();

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      // Assuming the role is in a claim like 'role' or 'roles'
      // Adjust according to your backend's JWT structure
      const userRole = decoded.role || decoded.roles || '';

      if (userRole === expectedRole) {
        return true;
      }
    } catch (error) {
      console.error('Error decoding token', error);
    }

    this.router.navigate(['/home']); // Or an 'access denied' page
    return false;
  }
}
