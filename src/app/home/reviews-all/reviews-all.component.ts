import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule, ReviewComponent, ProductComponent],
  templateUrl: './reviews-all.component.html',
  styleUrl: './reviews-all.component.css'
})
export class ReviewsAllComponent implements OnInit {
  allReviews: Review[] = [];
  filteredReviews: Review[] = [];
  displayedReviews: Review[] = [];
  
  selectedReview: Review | null = null;
  selectedProduct: any = null;
  selectedUser: User | null = null;

  showReviewPopup = false;
  showProductPopup = false;
  showUserPopup = false;

  searchText: string = '';
  itemsPerPage: number = 10;
  currentPage: number = 1;

  constructor(private popupService: PopupService) {}

  ngOnInit(): void {
    this.loadReviews();
    this.updateDisplayedReviews();
  }

  loadReviews() {
    // Load all reviews - in production, this would come from your API
    this.allReviews = [
      {
        id: 'REV-001',
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
        otherComments: 'Excellent product! Has significantly improved our customer support efficiency.',
        createdDate: new Date('2024-10-15')
      },
      {
        id: 'REV-002',
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
      },
      {
        id: 'REV-003',
        userId: 'user3',
        productId: 'prod3',
        productName: 'DataAnalyzer',
        usageType: 'Personal',
        usageDuration: '1 to 2 years',
        overallExperience: 5,
        efficiencyRating: 5,
        documentationRating: 5,
        usingPaidVersion: true,
        paidVersionRating: 5,
        otherComments: 'Perfect for teaching data science concepts to students.',
        createdDate: new Date('2024-09-20')
      },
      {
        id: 'REV-004',
        userId: 'user4',
        productId: 'prod4',
        productName: 'CodeOptimizer',
        usageType: 'Commercial',
        usageDuration: '3 to 6 months',
        overallExperience: 3,
        efficiencyRating: 3,
        documentationRating: 2,
        usingPaidVersion: false,
        paidVersionRating: 0,
        otherComments: 'Good concept but documentation needs improvement.',
        createdDate: new Date('2024-11-05')
      },
      {
        id: 'REV-005',
        userId: 'user5',
        productId: 'prod5',
        productName: 'SecureVault',
        usageType: 'Personal',
        usageDuration: '1 to 3 months',
        overallExperience: 4,
        efficiencyRating: 4,
        documentationRating: 4,
        usingPaidVersion: true,
        paidVersionRating: 4,
        otherComments: 'Reliable and secure password management solution.',
        createdDate: new Date('2024-10-28')
      },
      // Add more sample reviews for demonstration
      {
        id: 'REV-006',
        userId: 'user6',
        productId: 'prod6',
        productName: 'ProjectManager Pro',
        usageType: 'Commercial',
        usageDuration: '2 to 5 years',
        overallExperience: 5,
        efficiencyRating: 5,
        documentationRating: 4,
        usingPaidVersion: true,
        paidVersionRating: 5,
        otherComments: 'Best project management tool we\'ve used.',
        createdDate: new Date('2024-08-15')
      },
      {
        id: 'REV-007',
        userId: 'user7',
        productId: 'prod7',
        productName: 'DesignStudio',
        usageType: 'Personal',
        usageDuration: '6 months to 1 year',
        overallExperience: 4,
        efficiencyRating: 4,
        documentationRating: 3,
        usingPaidVersion: false,
        paidVersionRating: 0,
        otherComments: 'Great for learning graphic design basics.',
        createdDate: new Date('2024-09-10')
      },
      {
        id: 'REV-008',
        userId: 'user8',
        productId: 'prod8',
        productName: 'NetworkMonitor',
        usageType: 'Commercial',
        usageDuration: '1 to 2 years',
        overallExperience: 3,
        efficiencyRating: 3,
        documentationRating: 3,
        usingPaidVersion: true,
        paidVersionRating: 3,
        otherComments: 'Decent tool but has occasional connectivity issues.',
        createdDate: new Date('2024-10-02')
      },
      {
        id: 'REV-009',
        userId: 'user9',
        productId: 'prod9',
        productName: 'EmailCampaigner',
        usageType: 'Commercial',
        usageDuration: '3 to 6 months',
        overallExperience: 5,
        efficiencyRating: 5,
        documentationRating: 5,
        usingPaidVersion: true,
        paidVersionRating: 5,
        otherComments: 'Outstanding email marketing platform with great analytics.',
        createdDate: new Date('2024-11-08')
      },
      {
        id: 'REV-010',
        userId: 'user10',
        productId: 'prod10',
        productName: 'VideoEditor Plus',
        usageType: 'Personal',
        usageDuration: '1 to 3 months',
        overallExperience: 4,
        efficiencyRating: 4,
        documentationRating: 4,
        usingPaidVersion: false,
        paidVersionRating: 0,
        otherComments: 'Easy to use for basic video editing needs.',
        createdDate: new Date('2024-11-12')
      },
      {
        id: 'REV-011',
        userId: 'user11',
        productId: 'prod11',
        productName: 'ChatBot Builder',
        usageType: 'Commercial',
        usageDuration: '2 to 5 years',
        overallExperience: 5,
        efficiencyRating: 5,
        documentationRating: 4,
        usingPaidVersion: true,
        paidVersionRating: 5,
        otherComments: 'Excellent for building customer service bots.',
        createdDate: new Date('2024-07-20')
      },
      {
        id: 'REV-012',
        userId: 'user12',
        productId: 'prod12',
        productName: 'Inventory Tracker',
        usageType: 'Commercial',
        usageDuration: '1 to 2 years',
        overallExperience: 4,
        efficiencyRating: 4,
        documentationRating: 3,
        usingPaidVersion: true,
        paidVersionRating: 4,
        otherComments: 'Good inventory management with room for UI improvements.',
        createdDate: new Date('2024-08-30')
      }
    ];

    this.filteredReviews = [...this.allReviews];
  }

  onSearch() {
    const search = this.searchText.toLowerCase().trim();
    
    if (search === '') {
      this.filteredReviews = [...this.allReviews];
    } else {
      this.filteredReviews = this.allReviews.filter(review => 
        review.id.toLowerCase().includes(search) ||
        review.userId.toLowerCase().includes(search) ||
        review.productName.toLowerCase().includes(search) ||
        review.usageType.toLowerCase().includes(search) ||
        review.usageDuration.toLowerCase().includes(search) ||
        review.otherComments.toLowerCase().includes(search)
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

  getAverageRating(): string {
    if (this.allReviews.length === 0) return '0.0';
    
    const sum = this.allReviews.reduce((acc, review) => acc + review.overallExperience, 0);
    const average = sum / this.allReviews.length;
    return average.toFixed(1);
  }

  getStars(rating: number): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
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

  openReview(review: Review) {
    this.showReviewPopup = false;
    this.selectedReview = null;
    setTimeout(() => {
      this.selectedReview = review;
      this.showReviewPopup = true;
      this.popupService.openReviewPopup(review);
    }, 50);
  }

  openProduct(productName: string) {
    const review = this.allReviews.find(r => r.productName === productName);
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
          description: 'A great example AI software.',
          productImage: 'https://via.placeholder.com/200x150'
        };
        this.showProductPopup = true;
        this.popupService.openProductPopup(this.selectedProduct);
      }, 50);
    }
  }

  openUser(userId: string) {
    const userDetails: User[] = [
      { userId: 'user1', userName: 'John Doe', email: 'john@example.com', country: 'Australia' },
      { userId: 'user2', userName: 'Jane Smith', email: 'jane@example.com', country: 'USA' },
      { userId: 'user3', userName: 'Mike Johnson', email: 'mike@example.com', country: 'Canada' },
      { userId: 'user4', userName: 'Sarah Williams', email: 'sarah@example.com', country: 'UK' },
      { userId: 'user5', userName: 'David Brown', email: 'david@example.com', country: 'Germany' },
      { userId: 'user6', userName: 'Emma Davis', email: 'emma@example.com', country: 'France' },
      { userId: 'user7', userName: 'Chris Wilson', email: 'chris@example.com', country: 'Spain' },
      { userId: 'user8', userName: 'Lisa Anderson', email: 'lisa@example.com', country: 'Italy' },
      { userId: 'user9', userName: 'Tom Martinez', email: 'tom@example.com', country: 'Brazil' },
      { userId: 'user10', userName: 'Amy Taylor', email: 'amy@example.com', country: 'Japan' },
      { userId: 'user11', userName: 'Mark Robinson', email: 'mark@example.com', country: 'India' },
      { userId: 'user12', userName: 'Jessica Lee', email: 'jessica@example.com', country: 'South Korea' }
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
      this.allReviews = this.allReviews.filter(r => r.id !== review.id);
      this.filteredReviews = this.filteredReviews.filter(r => r.id !== review.id);
      this.updateDisplayedReviews();
      alert(`Review ${review.id} deleted successfully.`);
    }
  }
}