import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ProductComponent } from '../../widget/product/product.component';
import { ReviewComponent } from '../../widget/review/review.component';
import { PopupService, Product, Review } from '../../services/popup.service';

interface User {
  id: string;
  name: string;
  linkedin: string;
  facebook: string;
  designation: string;
  aboutMe: string;
  email: string;
  status: 'active' | 'disabled';
  createdDate?: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductComponent, ReviewComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchText: string = '';
  APIURL = environment.APIURL;
  
  // Drawer states
  showProductsDrawer: boolean = false;
  showReviewsDrawer: boolean = false;
  selectedUser: User | null = null;
  
  // Products
  userProducts: Product[] = [];
  displayedProducts: Product[] = [];
  productsPage: number = 1;
  productsPerPage: number = 10;
  isLoadingProducts: boolean = false;
  
  // Reviews
  userReviews: Review[] = [];
  displayedReviews: Review[] = [];
  reviewsOffset: number = 0;
  reviewsLimit: number = 5;
  hasMoreReviews: boolean = false;
  isLoadingReviews: boolean = false;
  
  // Popup states
  showProductPopup: boolean = false;
  showReviewPopup: boolean = false;
  
  // Selected objects to pass to components
  selectedProduct: Product | null = null;
  selectedReview: Review | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private popupService: PopupService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadAllUsers();
  }

  // ✅ Load all users from API
 async loadAllUsers(): Promise<void> {
    this.http.get(this.APIURL + 'get_all_users').subscribe({
      next: (response: any) => {
        if (response.message === "Users retrieved successfully") {
          this.users = response.users;
          this.filteredUsers = [...this.users];
        }
      },
      error: (error) => {
        console.error('Error loading users:', error);
        alert('Failed to load users. Please try again.');
      }
    });
  }

  // ✅ Search functionality
  onSearch() {
    if (!this.searchText.trim()) {
      this.filteredUsers = [...this.users];
      return;
    }

    const searchLower = this.searchText.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.designation.toLowerCase().includes(searchLower)
    );
  }

  // ✅ See all products for a user
  seeAllProducts(user: User) {
    this.selectedUser = user;
    this.productsPage = 1;
    this.userProducts = [];
    this.displayedProducts = [];
    this.loadUserProducts(user.id);
    this.showProductsDrawer = true;
    this.showReviewsDrawer = false;
  }

  // ✅ Load user products from API
async  loadUserProducts(userid: string): Promise<void> {
    this.isLoadingProducts = true;
    
    const payload = {
      userid: userid,
      page: this.productsPage,
      limit: this.productsPerPage
    };

    this.http.post(this.APIURL + 'get_all_product_details', payload).subscribe({
      next: (response: any) => {
        this.isLoadingProducts = false;
        if (response.message === "yes") {
          this.userProducts = response.products || [];
          this.displayedProducts = this.userProducts;
        } else {
          this.userProducts = [];
          this.displayedProducts = [];
        }
      },
      error: (error) => {
        this.isLoadingProducts = false;
        console.error('Error loading user products:', error);
        alert('Failed to load products. Please try again.');
      }
    });
  }

  // ✅ See all reviews for a user
  seeAllReviews(user: User) {
    this.selectedUser = user;
    this.reviewsOffset = 0;
    this.userReviews = [];
    this.displayedReviews = [];
    this.loadUserReviews(user.id, true);
    this.showReviewsDrawer = true;
    this.showProductsDrawer = false;
  }

  // ✅ Load user reviews from API
 async loadUserReviews(userid: string, reset: boolean = false): Promise<void> {
    if (reset) {
      this.isLoadingReviews = true;
      this.reviewsOffset = 0;
    }

    const payload = {
      userid: userid,
      offset: this.reviewsOffset,
      limit: this.reviewsLimit
    };

    this.http.post(this.APIURL + 'get_user_reviews_page', payload).subscribe({
      next: (response: any) => {
        if (response.message === "found") {
          if (reset) {
            this.userReviews = response.reviews || [];
            this.displayedReviews = response.reviews || [];
            this.reviewsOffset = response.limit || this.reviewsLimit;
          } else {
            this.userReviews = [...this.userReviews, ...(response.reviews || [])];
            this.displayedReviews = this.userReviews;
            this.reviewsOffset += (response.reviews || []).length;
          }
          this.hasMoreReviews = response.has_more || false;
        } else {
          if (reset) {
            this.userReviews = [];
            this.displayedReviews = [];
            this.hasMoreReviews = false;
            this.reviewsOffset = 0;
          }
        }
        this.isLoadingReviews = false;
      },
      error: (error) => {
        console.error('Error loading user reviews:', error);
        if (reset) {
          this.userReviews = [];
          this.displayedReviews = [];
          this.hasMoreReviews = false;
          this.reviewsOffset = 0;
        }
        this.isLoadingReviews = false;
      }
    });
  }

  // ✅ Load more reviews
  loadMoreReviews() {
    if (this.selectedUser && !this.isLoadingReviews) {
      this.loadUserReviews(this.selectedUser.id, false);
    }
  }

  // ✅ Toggle user status (Enable/Disable)
async  toggleUserStatus(user: User):Promise<void> {
    const newStatus = user.status === 'active' ? 'disabled' : 'active';
    const action = newStatus === 'disabled' ? 'disable' : 'enable';
    
    if (confirm(`Are you sure you want to ${action} ${user.name}?`)) {
      const payload = {
        userid: user.id,
        status: newStatus
      };

      this.http.post(this.APIURL + 'toggle_user_status', payload).subscribe({
        next: (response: any) => {
          if (response.message === "User status updated successfully") {
            user.status = newStatus;
            alert(`User ${action}d successfully!`);
          }
        },
        error: (error) => {
          console.error('Error toggling user status:', error);
          alert('Failed to update user status. Please try again.');
        }
      });
    }
  }

  // ✅ Remove user
 async removeUser(userid: string) :Promise<void> {
    const user = this.users.find(u => u.id === userid);
    if (user && confirm(`Are you sure you want to remove ${user.name}? This action cannot be undone.`)) {
      const payload = {
        userid: userid
      };

      this.http.post(this.APIURL + 'remove_user', payload).subscribe({
        next: (response: any) => {
          if (response.message === "User removed successfully") {
            this.users = this.users.filter(u => u.id !== userid);
            this.filteredUsers = this.filteredUsers.filter(u => u.id !== userid);
            alert('User removed successfully!');
          }
        },
        error: (error) => {
          console.error('Error removing user:', error);
          alert('Failed to remove user. Please try again.');
        }
      });
    }
  }

  // ✅ Open product popup
  openProductPopup(product: Product) {
  
    this.selectedProduct = product;
    this.showProductPopup = true;
    this.popupService.openProductPopup(product);
  }

  // ✅ Open review popup
  openReviewPopup(review: Review) {
    console.log('🟡 Users Component: Opening review popup');
    console.log('🟡 Review:', review);
    this.selectedReview = review;
    this.showReviewPopup = true;
    this.popupService.openReviewPopup(review);
  }

  // ✅ Close product popup
  closeProductPopup() {
    this.showProductPopup = false;
    this.selectedProduct = null;
    this.popupService.closeProductPopup();
  }

  // ✅ Close review popup
  closeReviewPopup() {
    this.showReviewPopup = false;
    this.selectedReview = null;
    this.popupService.closeReviewPopup();
  }

  // ✅ Close drawers
  closeDrawer() {
    this.showProductsDrawer = false;
    this.showReviewsDrawer = false;
    this.selectedUser = null;
  }

  // ✅ Helper method for star ratings
  getStars(rating: number): string[] {
    const numRating = typeof rating === 'string' ? parseInt(rating) : rating;
    return Array(5).fill('').map((_, i) => i < numRating ? 'star' : 'star_border');
  }

  // ✅ Computed properties
  get hasMoreProducts(): boolean {
    return false; // Since we're loading all products at once
  }
}