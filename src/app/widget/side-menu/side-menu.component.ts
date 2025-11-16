import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-side-menu',
  imports: [RouterModule, CommonModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {
  isMenuOpen = false;
  
 menuItems: MenuItem[] = [
    {
      label: 'Usecase',
      icon: 'assignment', // Use case documentation icon
      route: '/home/use-case'
    },

    {
      label: 'Technology',
      icon: 'settings_suggest', // Technology/settings icon
      route: '/home/technology'
    },

    {
      label: 'Category',
      icon: 'category', // Perfect for categories
      route: '/home/category'
    },

    {
      label: 'Users',
      icon: 'people', // User group icon
      route: '/home/users'
    },

    {
      label: 'Products',
      icon: 'inventory_2', // Products/inventory icon
      route: '/home/products-all'
    },

    {
      label: 'Reviews',
      icon: 'rate_review', // Reviews/ratings icon
      route: '/home/reviews-all'
    },

    
  ];

  constructor(private router: Router) {
    // Subscribe to router events to close menu on navigation (mobile)
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (window.innerWidth < 769) {
          this.isMenuOpen = false;
        }
      });
    
    // Auto-expand parent menu if child is active
    this.autoExpandActiveParent();
  }

  /**
   * Toggle the side menu open/closed state
   */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    
    // Prevent body scroll when menu is open on mobile
    if (this.isMenuOpen && window.innerWidth < 769) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  /**
   * Toggle submenu expansion
   * @param item - The menu item to toggle
   */
  toggleSubmenu(item: MenuItem): void {
    if (item.children) {
      // Close other expanded menus (optional - for accordion behavior)
      // this.menuItems.forEach(menuItem => {
      //   if (menuItem !== item && menuItem.children) {
      //     menuItem.expanded = false;
      //   }
      // });
      
      item.expanded = !item.expanded;
    }
  }

  /**
   * Navigate to a specific route
   * @param route - The route path to navigate to
   */
  navigateTo(route?: string): void {
    if (route) {
      this.router.navigate([route]);
      
      // Close menu on mobile after navigation
      if (window.innerWidth < 769) {
        setTimeout(() => {
          this.isMenuOpen = false;
          document.body.style.overflow = '';
        }, 200);
      }
    }
  }

  /**
   * Logout user and clear session
   */
  logout(): void {
    // Show confirmation dialog
    const confirmed = confirm('Are you sure you want to logout?');
    
    if (confirmed) {
      // Clear all session storage
      sessionStorage.clear();
      
      // Clear local storage if needed
      // localStorage.clear();
      
      // Reset menu state
      this.isMenuOpen = false;
      document.body.style.overflow = '';
      
      // Navigate to login page
      this.router.navigate(['/auth/log-in']);
    }
  }

  /**
   * Check if a route is currently active
   * @param route - The route to check
   * @returns true if the route is active
   */
  isActive(route?: string): boolean {
    if (!route) return false;
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  /**
   * Auto-expand parent menu if any child is active
   */
  private autoExpandActiveParent(): void {
    this.menuItems.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => this.isActive(child.route));
        if (hasActiveChild) {
          item.expanded = true;
        }
      }
    });
  }

  /**
   * Handle window resize to close menu on desktop
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (event.target.innerWidth >= 769) {
      this.isMenuOpen = false;
      document.body.style.overflow = '';
    }
  }

  
}