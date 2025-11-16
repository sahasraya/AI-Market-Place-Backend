import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ReviewComponent } from '../../widget/review/review.component';
import { ProductComponent } from '../../widget/product/product.component';
import { PopupService, Product, Review } from '../../services/popup.service';

interface User {
  userid: string;
  username: string;
  email: string;
  designation: string;
  about: string;
  linkedin: string;
  facebook: string;
  createddate: string;
}

@Component({
  selector: 'app-reviews-all',
  standalone: true,
  imports: [CommonModule, FormsModule, ReviewComponent, ProductComponent],
  templateUrl: './reviews-all.component.html',
  styleUrl: './reviews-all.component.css'
})
export class ReviewsAllComponent implements OnInit {
  allReviews: Review[] = [];
  filteredReviews: Review[] = [];
  displayedReviews: Review[] = [];
  
  selectedReview: Review | null = null;
  selectedProduct: Product | null = null;
  selectedUser: User | null = null;

  showReviewPopup = false;
  showProductPopup = false;
  showUserPopup = false;

  searchText: string = '';
  itemsPerPage: number = 10;
  currentPage: number = 1;
  isLoading: boolean = false;
  APIURL = environment.APIURL;

  constructor(
    private popupService: PopupService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  // ✅ Load all reviews from API
 async loadReviews(): Promise<void> {
    this.isLoading = true;
    
    this.http.get(this.APIURL + 'get_all_reviews').subscribe({
      next: (response: any) => {
        if (response.message === "Reviews retrieved successfully") {
          this.allReviews = response.reviews || [];
          this.filteredReviews = [...this.allReviews];
          this.updateDisplayedReviews();
        } else {
          this.allReviews = [];
          this.filteredReviews = [];
          this.displayedReviews = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.isLoading = false;
        this.allReviews = [];
        this.filteredReviews = [];
        this.displayedReviews = [];
      }
    });
  }

  // ✅ Search functionality
  onSearch() {
    const search = this.searchText.toLowerCase().trim();
    
    if (search === '') {
      this.filteredReviews = [...this.allReviews];
    } else {
      this.filteredReviews = this.allReviews.filter(review => 
        review.reviewid?.toLowerCase().includes(search) ||
        review.userid?.toLowerCase().includes(search) ||
        review.productid?.toLowerCase().includes(search) ||
        review.username?.toLowerCase().includes(search) ||
        review.commercialorpersonal?.toLowerCase().includes(search) ||
        review.howlong?.toLowerCase().includes(search) ||
        review.comment?.toLowerCase().includes(search) ||
        review.email?.toLowerCase().includes(search)
      );
    }
    
    this.currentPage = 1;
    this.updateDisplayedReviews();
  }

  clearSearch() {
    this.searchText = '';
    this.onSearch();
  }

  updateDisplayedReviews() {
    const startIndex = 0;
    const endIndex = this.currentPage * this.itemsPerPage;
    this.displayedReviews = this.filteredReviews.slice(startIndex, endIndex);
  }

  loadMore() {
    this.currentPage++;
    this.updateDisplayedReviews();
  }

  hasMoreReviews(): boolean {
    return this.displayedReviews.length < this.filteredReviews.length;
  }

  // ✅ Calculate average rating
  getAverageRating(): string {
    if (this.allReviews.length === 0) return '0.0';
    
    const sum = this.allReviews.reduce((acc, review) => {
      const rating = typeof review.experiencerate === 'string' 
        ? parseInt(review.experiencerate) 
        : review.experiencerate;
      return acc + (rating || 0);
    }, 0);
    const average = sum / this.allReviews.length;
    return average.toFixed(1);
  }

  // ✅ Generate star array for display
  getStars(rating: number | string): string[] {
    const numRating = typeof rating === 'string' ? parseInt(rating) : rating;
    const stars: string[] = [];
    const fullStars = Math.floor(numRating);
    const hasHalfStar = (numRating % 1) >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('star');
    }
    
    if (hasHalfStar) {
      stars.push('star_half');
    }
    
    while (stars.length < 5) {
      stars.push('star_outline');
    }
    
    return stars;
  }

  // ✅ Open review popup
  openReview(review: Review) {
    this.showReviewPopup = false;
    this.selectedReview = null;
    setTimeout(() => {
      this.selectedReview = review;
      this.showReviewPopup = true;
      this.popupService.openReviewPopup(review);
    }, 50);
  }

 // ✅ Open product popup - Fetch product details from API
async openProduct(productid: string): Promise<void> {
  const payload = { productid };

  this.http.post(this.APIURL + 'get_product_details', payload).subscribe({
    next: (response: any) => {
          console.log('API response:', response);

      if (response.message === "yes") {
        this.showProductPopup = false;
        this.selectedProduct = null;

        setTimeout(() => {

          // Map all product details + arrays to selectedProduct
          this.selectedProduct = {
            ...response.product,
            usecasenames: response.useCases || [],
            baseaimodelnames: response.baseModels || [],
            deploymentnames: response.deployments || [],
            foundernames: response.founders || [],
            repositorylinks: response.repositories || [],
            medialinks: response.mediaPreviews || []
          };

          console.log('Mapped product details:', this.selectedProduct);

          // Show the popup
          this.showProductPopup = true;
          this.popupService.openProductPopup(this.selectedProduct!);
        }, 50);

      } else {
        alert('Product not found');
      }
    },
    error: (error) => {
      console.error('Error loading product:', error);
      alert('Failed to load product details');
    }
  });
}

  // ✅ Open user popup - Fetch user details from API
  async openUser(userid: string): Promise<void> {
    const payload = {
      userid: userid
    };

    this.http.post(this.APIURL + 'get_user_details', payload).subscribe({
      next: (response: any) => {
        console.log('User API response:', response);
        
        if (response.message === "yes") {
          this.selectedUser = response.user;
          this.showUserPopup = true;
        } else {
          alert('User not found');
        }
      },
      error: (error) => {
        console.error('Error loading user:', error);
        alert('Failed to load user details');
      }
    });
  }

  // ✅ Close popups
  closeReviewPopup() {
    this.showReviewPopup = false;
    this.selectedReview = null;
    this.popupService.closeReviewPopup();
  }

  closeProductPopup() {
    this.showProductPopup = false;
    this.selectedProduct = null;
    this.popupService.closeProductPopup();
  }

  closeUserPopup() {
    this.showUserPopup = false;
    this.selectedUser = null;
  }

  // ✅ Delete review
async  deleteReview(review: Review): Promise<void> {
    const confirmed = confirm("Are you sure you want to delete review ?");
    if (confirmed) {
      const payload = {
        userid: review.userid,
        reviewid: review.reviewid
      };

      this.http.post(this.APIURL + 'delete_review', payload).subscribe({
        next: (response: any) => {
          if (response.message === "deleted") {
            this.allReviews = this.allReviews.filter(r => r.reviewid !== review.reviewid);
            this.filteredReviews = this.filteredReviews.filter(r => r.reviewid !== review.reviewid);
            this.loadReviews();
          }
        },
        error: (error) => {
          console.error('Error deleting review:', error);
          alert('Failed to delete review');
        }
      });
    }
  }
}