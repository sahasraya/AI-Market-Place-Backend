import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      const userId = sessionStorage.getItem('adminid');  // Check if userId exists in localStorage

      if (userId) {
        // User is logged in, allow access
        return true;
      } else {
        this.router.navigate(['/auth/log-in']);
        return false;
      }
    } else {
      // SSR case: Handle it gracefully or allow access
      // You may choose to deny access, redirect, or allow the user through
      return true;
    }
  }
}
