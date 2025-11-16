import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// ✅ Updated Product interface to match database structure
export interface Product {
  // Database fields
  productid: string;
  userid: string;
  productname: string;
  productimage: string;
  productcategory: string;
  productlicense: string;
  producttechnology: string;
  productwebsite: string;
  productfundingstage: string;
  productusecaseid: string;
  productfacebook: string;
  productdocumentation: string;
  productlinkedin: string;
  productfounderid: string;
  productdescription: string;
  productbaseaimodelid: string;
  productdeploymentid: string;
  productrepositoryid: string;
  productmediaid: string;
  rating: number;
  counts: string;
  createddate: string;
  
  // ✅ Arrays populated by API
  usecasenames?: string[];
  technologynames?: string[];
  foundernames?: string[];
  baseaimodelnames?: string[];
  deploymentnames?: string[];
  repositorylinks?: string[];
  medialinks?: string[];
}


// ✅ Updated Review interface to match database structure
export interface Review {
  id: string;
  reviewid: string;
  userid: string;
  productid: string;
  username: string;
  commercialorpersonal: string;
  howlong: string;
  experiencerate: number;
  efficiencyrate: number;
  documentationrate: number;
  paidornot: string;
  paidrate: number;
  colorcode: string;
  comment: string;
  createddate: string;
  email: string;
  code: string;
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