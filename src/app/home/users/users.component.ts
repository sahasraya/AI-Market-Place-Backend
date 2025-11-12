import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductComponent } from '../../widget/product/product.component';
import { ReviewComponent } from '../../widget/review/review.component';
import { PopupService } from '../../services/popup.service';

interface User {
  id: string;
  name: string;
  linkedin: string;
  facebook: string;
  designation: string;
  aboutMe: string;
  email: string;
  status: 'active' | 'disabled'; 
}

interface Product {
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

interface Review {
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
  
  // Drawer states
  showProductsDrawer: boolean = false;
  showReviewsDrawer: boolean = false;
  selectedUser: User | null = null;
  
  // Products
  userProducts: Product[] = [];
  displayedProducts: Product[] = [];
  productsPage: number = 1;
  productsPerPage: number = 3;
  
  // Reviews
  userReviews: Review[] = [];
  displayedReviews: Review[] = [];
  reviewsPage: number = 1;
  reviewsPerPage: number = 3;
  
  // Popup states
  showProductPopup: boolean = false;
  showReviewPopup: boolean = false;
  
  // Selected objects to pass to components
  selectedProduct: Product | null = null;
  selectedReview: Review | null = null;


   constructor(private cdr: ChangeDetectorRef,private popupService: PopupService) {}


  ngOnInit() {
    this.generateSampleData();
    this.filteredUsers = [...this.users];
  }

  generateSampleData() {
    // Generate sample users
    this.users = [
       
      {
        id: 'user4',
        name: 'Nimali Jayasinghe',
        linkedin: 'https://linkedin.com/in/nimali-jayasinghe',
        facebook: 'https://facebook.com/nimali.jayasinghe',
        designation: 'Product Manager',
        aboutMe: 'Driving product strategy and innovation. Bridging the gap between technical teams and business objectives.',
        email: 'nimali@example.com',
        status: 'disabled' 
      },
      {
        id: 'user5',
        name: 'Ravindu Bandara',
        linkedin: 'https://linkedin.com/in/ravindu-bandara',
        facebook: 'https://facebook.com/ravindu.bandara',
        designation: 'UI/UX Designer',
        aboutMe: 'Creating beautiful and intuitive user experiences. Specializing in design systems and user research.',
        email: 'ravindu@example.com',
        status: 'active'
      }
    ];
  }

  // Search functionality
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

  // User actions
  seeAllProducts(user: User) {
    this.selectedUser = user;
    this.userProducts = this.getAllProducts().filter(p => p.userId === user.id);
    this.productsPage = 1;
    this.loadProducts();
    this.showProductsDrawer = true;
    this.showReviewsDrawer = false;
  }

  seeAllReviews(user: User) {
    this.selectedUser = user;
    this.userReviews = this.getAllReviews().filter(r => r.userId === user.id);
    this.reviewsPage = 1;
    this.loadReviews();
    this.showReviewsDrawer = true;
    this.showProductsDrawer = false;
  }

  toggleUserStatus(user: User) {
    user.status = user.status === 'active' ? 'disabled' : 'active';
    console.log(`User ${user.name} status changed to ${user.status}`);
  }

  removeUser(userId: string) {
    if (confirm('Are you sure you want to remove this user? This action cannot be undone.')) {
      this.users = this.users.filter(u => u.id !== userId);
      this.filteredUsers = this.filteredUsers.filter(u => u.id !== userId);
      console.log(`User ${userId} removed`);
    }
  }

  // Products drawer
  loadProducts() {
    const startIndex = (this.productsPage - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    this.displayedProducts = this.userProducts.slice(0, endIndex);
  }

  loadMoreProducts() {
    this.productsPage++;
    this.loadProducts();
  }

  get hasMoreProducts(): boolean {
    return this.displayedProducts.length < this.userProducts.length;
  }

 openProductPopup(product: Product) {
    console.log('🟡 Users Component: Opening product popup');
    console.log('🟡 Product:', product);
    this.popupService.openProductPopup(product);
  }
 openReviewPopup(review: Review) {
    console.log('🟡 Users Component: Opening review popup');
    console.log('🟡 Review:', review);
    this.showReviewPopup=true
    this.popupService.openReviewPopup(review);
  }
  // Close product popup
  closeProductPopup() {
    this.showProductPopup = false;
    this.selectedProduct = null;
  }

  // Reviews drawer
  loadReviews() {
    const startIndex = (this.reviewsPage - 1) * this.reviewsPerPage;
    const endIndex = startIndex + this.reviewsPerPage;
    this.displayedReviews = this.userReviews.slice(0, endIndex);
  }

  loadMoreReviews() {
    this.reviewsPage++;
    this.loadReviews();
  }

  get hasMoreReviews(): boolean {
    return this.displayedReviews.length < this.userReviews.length;
  }

  // Open review popup - Pass entire review object


  // Close review popup
  closeReviewPopup() {
    this.showReviewPopup = false;
    this.selectedReview = null;
  }

  // Close drawers
  closeDrawer() {
    this.showProductsDrawer = false;
    this.showReviewsDrawer = false;
    this.selectedUser = null;
  }

  // Get all products
  getAllProducts(): Product[] {
    return [
      {
        id: 'prod1',
        userId: 'user5',
        productImage: 'https://via.placeholder.com/300x200?text=AI+Assistant',
        productName: 'AI Assistant Pro',
        productCategory: 'Artificial Intelligence',
        license: 'MIT',
        technology: ['Python', 'TensorFlow', 'FastAPI'],
        website: 'https://aiassistant.com',
        fundingStage: 'Series A',
        useCases: ['Customer Support', 'Content Generation', 'Data Analysis'],
        documentationLink: 'https://docs.aiassistant.com',
        productFacebookLink: 'https://facebook.com/aiassistant',
        productLinkedInLink: 'https://linkedin.com/company/aiassistant',
        founders: ['John Doe', 'Jane Smith'],
        baseAIModel: ['GPT-4', 'Claude'],
        deployment: ['Cloud', 'On-Premise'],
        mediaPreviews: ['https://youtube.com/watch?v=demo1'],
        repositories: ['https://github.com/aiassistant/core'],
        description: 'Advanced AI assistant powered by multiple language models for enterprise use.'
      } 
    ];
  }

  // Get all reviews
  getAllReviews(): Review[] {
    return [
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
        otherComments: 'Excellent product! Has significantly improved our customer support efficiency. The AI responses are accurate and contextual.',
        createdDate: new Date('2024-10-15')
      } ,
      {
        id: 'rev3',
        userId: 'user1',
        productId: 'prod3',
        productName: 'DataSync Platform',
        usageType: 'Commercial',
        usageDuration: '6 months to 1 year',
        overallExperience: 4,
        efficiencyRating: 4,
        documentationRating: 5,
        usingPaidVersion: true,
        paidVersionRating: 4,
        otherComments: 'Reliable data integration solution. Documentation is comprehensive and helpful.',
        createdDate: new Date('2024-08-10')
      }, 
      {
        id: 'rev9',
        userId: 'user1',
        productId: 'prod1',
        productName: 'AI Assistant Pro',
        usageType: 'Commercial',
        usageDuration: '1 to 2 years',
        overallExperience: 4,
        efficiencyRating: 4,
        documentationRating: 4,
        usingPaidVersion: true,
        paidVersionRating: 4,
        otherComments: 'Very useful for automating customer responses.',
        createdDate: new Date('2024-06-20')
      } 
    ];
  }

  // Helper method for star ratings
  getStars(rating: number): string[] {
    return Array(5).fill('').map((_, i) => i < rating ? 'star' : 'star_border');
  }
}