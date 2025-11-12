import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Product {
  id: string;
  userId: string;
  productImage: string;
  productName: string;
  productCategory: string;
  license: string;
  technology: string[];
  website: string;
  fundingStage: string;
  useCases: string[];
  documentationLink: string;
  productFacebookLink: string;
  productLinkedInLink: string;
  founders: string[];
  baseAIModel: string[];
  deployment: string[];
  mediaPreviews: string[];
  repositories: string[];
  description: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  usageType: 'Commercial' | 'Personal';
  usageDuration: string;
  overallExperience: number;
  efficiencyRating: number;
  documentationRating: number;
  usingPaidVersion: boolean;
  paidVersionRating: number;
  otherComments: string;
  createdDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  // Product popup state
  private productSubject = new BehaviorSubject<Product | null>(null);
  private productVisibleSubject = new BehaviorSubject<boolean>(false);
  
  // Review popup state
  private reviewSubject = new BehaviorSubject<Review | null>(null);
  private reviewVisibleSubject = new BehaviorSubject<boolean>(false);

  // Product observables
  product$ = this.productSubject.asObservable();
  productVisible$ = this.productVisibleSubject.asObservable();
  
  // Review observables
  review$ = this.reviewSubject.asObservable();
  reviewVisible$ = this.reviewVisibleSubject.asObservable();

  // Open product popup
  openProductPopup(product: Product) {
    console.log('📦 Service: Opening product popup with:', product);
    this.productSubject.next(product);
    this.productVisibleSubject.next(true);
  }

  // Close product popup
  closeProductPopup() {
    console.log('📦 Service: Closing product popup');
    this.productVisibleSubject.next(false);
    setTimeout(() => {
      this.productSubject.next(null);
    }, 300);
  }

  // Open review popup
  openReviewPopup(review: Review) {
    console.log('📝 Service: Opening review popup with:', review);
    this.reviewSubject.next(review);
    this.reviewVisibleSubject.next(true);
  }

  // Close review popup
  closeReviewPopup() {
    console.log('📝 Service: Closing review popup');
    this.reviewVisibleSubject.next(false);
    setTimeout(() => {
      this.reviewSubject.next(null);
    }, 300);
  }
}