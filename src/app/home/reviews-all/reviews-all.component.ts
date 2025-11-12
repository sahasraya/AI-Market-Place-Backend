import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from '../../widget/review/review.component';
import { ProductComponent } from '../../widget/product/product.component';
import { Review, PopupService } from '../../services/popup.service';

interface User {
  userId: string;
  userName: string;
  email: string;
  country: string;
}

@Component({
  selector: 'app-reviews-all',
  standalone: true,
  imports: [CommonModule, ReviewComponent, ProductComponent],
  templateUrl: './reviews-all.component.html',
  styleUrl: './reviews-all.component.css'
})
export class ReviewsAllComponent implements OnInit {
  reviews: Review[] = [];
  selectedReview: Review | null = null;
  selectedProduct: any = null;
  selectedUser: User | null = null;

  showReviewPopup = false;
  showProductPopup = false;
  showUserPopup = false;

  constructor(private popupService: PopupService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews() {
    this.reviews = [
      {
        id: 'rev1',
        userId: 'user1',
        productId: 'prod1',
        productName: 'AI Assistant Pro',
        usageType: 'Commercial',
        usageDuration: '2 to 5 years',
        overallExperience: 5,
        efficiencyRating: 4,
        documentationRating: 3,
        usingPaidVersion: true,
        paidVersionRating: 5,
        otherComments:
          'Excellent product! Has significantly improved our customer support efficiency.',
        createdDate: new Date('2024-10-15')
      },
      {
        id: 'rev2',
        userId: 'user2',
        productId: 'prod2',
        productName: 'CloudMonitor',
        usageType: 'Personal',
        usageDuration: '6 months to 1 year',
        overallExperience: 4,
        efficiencyRating: 4,
        documentationRating: 4,
        usingPaidVersion: false,
        paidVersionRating: 0,
        otherComments: 'Great for monitoring system health and uptime!',
        createdDate: new Date('2024-11-01')
      }
    ];
  }

  openReview(review: Review) {
    // Ensure re-trigger even for same review
    this.showReviewPopup = false;
    this.selectedReview = null;
    setTimeout(() => {
      this.selectedReview = review;
      this.showReviewPopup = true;
      this.popupService.openReviewPopup(review);
    }, 50);
  }

  openProduct(productName: string) {
    const review = this.reviews.find(r => r.productName === productName);
    if (review) {
      this.showProductPopup = false;
      this.selectedProduct = null;
      setTimeout(() => {
        this.selectedProduct = {
          id: review.productId,
          productName: review.productName,
          productCategory: 'Software',
          license: 'MIT',
          technology: ['Angular', 'FastAPI'],
          fundingStage: 'Series A',
          description: 'A great example AI software.'
        };
        this.showProductPopup = true;
        this.popupService.openProductPopup(this.selectedProduct);
      }, 50);
    }
  }

  openUser(userId: string) {
    const userDetails: User[] = [
      { userId: 'user1', userName: 'John Doe', email: 'john@example.com', country: 'Australia' },
      { userId: 'user2', userName: 'Jane Smith', email: 'jane@example.com', country: 'USA' }
    ];
    this.selectedUser = userDetails.find(u => u.userId === userId) || null;
    this.showUserPopup = true;
  }

  closeReviewPopup() {
    this.showReviewPopup = false;
    this.selectedReview = null;
  }

  closeProductPopup() {
    this.showProductPopup = false;
    this.selectedProduct = null;
  }

  closeUserPopup() {
    this.showUserPopup = false;
    this.selectedUser = null;
  }

  deleteReview(review: Review) {
    const confirmed = confirm(`Are you sure you want to delete review "${review.id}"?`);
    if (confirmed) {
      this.reviews = this.reviews.filter(r => r.id !== review.id);
      alert(`Review ${review.id} deleted.`);
    }
  }
}
