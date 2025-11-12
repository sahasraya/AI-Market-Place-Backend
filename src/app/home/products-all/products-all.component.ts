import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductComponent } from '../../widget/product/product.component';
import { ReviewComponent } from '../../widget/review/review.component';
import { PopupService } from '../../services/popup.service';

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

interface User {
  id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-products-all',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductComponent, ReviewComponent],
  templateUrl: './products-all.component.html',
  styleUrl: './products-all.component.css'
})
export class ProductsAllComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchText: string = '';

  // Product popup
  selectedProduct: Product | null = null;
  showProductPopup = false;

  // Reviews drawer
  showReviewsDrawer = false;
  selectedProductForReviews: Product | null = null;
  productReviews: Review[] = [];
  displayedReviews: Review[] = [];
  reviewsPage = 1;
  reviewsPerPage = 5;

  // Review popup
  selectedReview: Review | null = null;
  showReviewPopup = false;

  // All reviews data
  allReviews: Review[] = [];
  
  // Users data
  users: User[] = [];

  constructor(
    private popupService: PopupService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadReviews();
    this.loadUsers();
  }

  loadProducts() {
    this.products = [
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
      },
      {
        id: 'prod2',
        userId: 'user4',
        productImage: 'https://via.placeholder.com/300x200?text=Cloud+Storage',
        productName: 'SecureCloud Storage',
        productCategory: 'Cloud Services',
        license: 'Apache 2.0',
        technology: ['Node.js', 'React', 'MongoDB', 'AWS'],
        website: 'https://securecloud.com',
        fundingStage: 'Seed',
        useCases: ['File Storage', 'Team Collaboration', 'Backup Solutions'],
        documentationLink: 'https://docs.securecloud.com',
        productFacebookLink: 'https://facebook.com/securecloud',
        productLinkedInLink: 'https://linkedin.com/company/securecloud',
        founders: ['Alice Johnson', 'Bob Williams'],
        baseAIModel: ['N/A'],
        deployment: ['Cloud', 'Hybrid'],
        mediaPreviews: ['https://youtube.com/watch?v=demo2', 'https://vimeo.com/demo2'],
        repositories: ['https://github.com/securecloud/frontend', 'https://github.com/securecloud/backend'],
        description: 'Enterprise-grade cloud storage solution with end-to-end encryption and seamless collaboration features.'
      },
      {
        id: 'prod3',
        userId: 'user1',
        productImage: 'https://via.placeholder.com/300x200?text=DataSync',
        productName: 'DataSync Platform',
        productCategory: 'Data Integration',
        license: 'Commercial',
        technology: ['Java', 'Spring Boot', 'Kafka', 'PostgreSQL'],
        website: 'https://datasync.io',
        fundingStage: 'Series B',
        useCases: ['ETL Processing', 'Real-time Sync', 'Data Warehousing'],
        documentationLink: 'https://docs.datasync.io',
        productFacebookLink: 'https://facebook.com/datasync',
        productLinkedInLink: 'https://linkedin.com/company/datasync',
        founders: ['Michael Chen', 'Sarah Davis'],
        baseAIModel: ['Custom ML Models'],
        deployment: ['Cloud', 'On-Premise', 'Hybrid'],
        mediaPreviews: ['https://youtube.com/watch?v=datasync-demo'],
        repositories: ['https://github.com/datasync/platform'],
        description: 'Powerful data integration platform for seamless ETL operations and real-time data synchronization.'
      },
      {
        id: 'prod4',
        userId: 'user5',
        productImage: 'https://via.placeholder.com/300x200?text=Analytics+Dashboard',
        productName: 'Analytics Dashboard Pro',
        productCategory: 'Business Intelligence',
        license: 'GPL v3',
        technology: ['Vue.js', 'D3.js', 'Python', 'Redis'],
        website: 'https://analyticsdashboard.com',
        fundingStage: 'Bootstrap',
        useCases: ['Business Analytics', 'Data Visualization', 'Reporting'],
        documentationLink: 'https://docs.analyticsdashboard.com',
        productFacebookLink: 'https://facebook.com/analyticsdashboard',
        productLinkedInLink: 'https://linkedin.com/company/analyticsdashboard',
        founders: ['Emma Wilson', 'David Martinez'],
        baseAIModel: ['N/A'],
        deployment: ['Cloud'],
        mediaPreviews: ['https://youtube.com/watch?v=analytics-demo'],
        repositories: ['https://github.com/analytics-dashboard/main'],
        description: 'Beautiful and intuitive analytics dashboard for data-driven decision making with real-time insights.'
      },
      {
        id: 'prod5',
        userId: 'user4',
        productImage: 'https://via.placeholder.com/300x200?text=CRM+Suite',
        productName: 'CRM Suite Enterprise',
        productCategory: 'Customer Relationship Management',
        license: 'Proprietary',
        technology: ['Angular', 'ASP.NET Core', 'SQL Server', 'Azure'],
        website: 'https://crmsuite.com',
        fundingStage: 'Series C',
        useCases: ['Sales Management', 'Customer Support', 'Marketing Automation'],
        documentationLink: 'https://docs.crmsuite.com',
        productFacebookLink: 'https://facebook.com/crmsuite',
        productLinkedInLink: 'https://linkedin.com/company/crmsuite',
        founders: ['Robert Taylor', 'Jennifer Lee'],
        baseAIModel: ['GPT-3.5', 'Custom NLP'],
        deployment: ['Cloud', 'On-Premise'],
        mediaPreviews: ['https://youtube.com/watch?v=crm-demo', 'https://vimeo.com/crm-walkthrough'],
        repositories: [],
        description: 'Comprehensive CRM solution for enterprise businesses with AI-powered insights and automation.'
      }
    ];

    this.filteredProducts = [...this.products];
  }

  loadReviews() {
    this.allReviews = [
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
      },
      {
        id: 'rev2',
        userId: 'user4',
        productId: 'prod2',
        productName: 'SecureCloud Storage',
        usageType: 'Commercial',
        usageDuration: '1 to 2 years',
        overallExperience: 4,
        efficiencyRating: 5,
        documentationRating: 4,
        usingPaidVersion: true,
        paidVersionRating: 4,
        otherComments: 'Great cloud storage solution. The security features are top-notch and file sharing is seamless.',
        createdDate: new Date('2024-09-20')
      },
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
        id: 'rev4',
        userId: 'user5',
        productId: 'prod4',
        productName: 'Analytics Dashboard Pro',
        usageType: 'Personal',
        usageDuration: '3 to 6 months',
        overallExperience: 5,
        efficiencyRating: 5,
        documentationRating: 4,
        usingPaidVersion: false,
        paidVersionRating: 0,
        otherComments: 'Amazing visualization capabilities! Very intuitive and easy to set up for personal projects.',
        createdDate: new Date('2024-11-01')
      },
      {
        id: 'rev5',
        userId: 'user4',
        productId: 'prod5',
        productName: 'CRM Suite Enterprise',
        usageType: 'Commercial',
        usageDuration: 'Over 5 years',
        overallExperience: 5,
        efficiencyRating: 5,
        documentationRating: 5,
        usingPaidVersion: true,
        paidVersionRating: 5,
        otherComments: 'Best CRM we\'ve ever used. The AI features are game-changing for our sales team.',
        createdDate: new Date('2024-07-15')
      },
      {
        id: 'rev6',
        userId: 'user5',
        productId: 'prod1',
        productName: 'AI Assistant Pro',
        usageType: 'Commercial',
        usageDuration: '1 to 2 years',
        overallExperience: 4,
        efficiencyRating: 4,
        documentationRating: 3,
        usingPaidVersion: true,
        paidVersionRating: 4,
        otherComments: 'Good product overall. Would like to see better integration options with third-party tools.',
        createdDate: new Date('2024-10-05')
      },
      {
        id: 'rev7',
        userId: 'user1',
        productId: 'prod2',
        productName: 'SecureCloud Storage',
        usageType: 'Personal',
        usageDuration: '3 to 6 months',
        overallExperience: 3,
        efficiencyRating: 3,
        documentationRating: 4,
        usingPaidVersion: false,
        paidVersionRating: 0,
        otherComments: 'Decent for personal use but could be more affordable. Interface is clean and modern.',
        createdDate: new Date('2024-09-01')
      },
      {
        id: 'rev8',
        userId: 'user4',
        productId: 'prod3',
        productName: 'DataSync Platform',
        usageType: 'Commercial',
        usageDuration: '2 to 5 years',
        overallExperience: 5,
        efficiencyRating: 5,
        documentationRating: 4,
        usingPaidVersion: true,
        paidVersionRating: 5,
        otherComments: 'Reliable and powerful. Handles large-scale data operations without any issues.',
        createdDate: new Date('2024-08-25')
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
        otherComments: 'Very useful for automating customer responses. Support team is responsive and helpful.',
        createdDate: new Date('2024-06-20')
      },
      {
        id: 'rev10',
        userId: 'user5',
        productId: 'prod5',
        productName: 'CRM Suite Enterprise',
        usageType: 'Commercial',
        usageDuration: '6 months to 1 year',
        overallExperience: 4,
        efficiencyRating: 4,
        documentationRating: 5,
        usingPaidVersion: true,
        paidVersionRating: 4,
        otherComments: 'Comprehensive feature set. Takes time to learn but worth the investment.',
        createdDate: new Date('2024-10-30')
      }
    ];
  }

  loadUsers() {
    this.users = [
      { id: 'user1', name: 'Kamal Fernando', email: 'kamal@example.com' },
      { id: 'user4', name: 'Nimali Jayasinghe', email: 'nimali@example.com' },
      { id: 'user5', name: 'Ravindu Bandara', email: 'ravindu@example.com' }
    ];
  }

  // Search
  onSearch() {
    const search = this.searchText.toLowerCase().trim();
    if (!search) {
      this.filteredProducts = [...this.products];
      return;
    }

    this.filteredProducts = this.products.filter(p =>
      p.productName.toLowerCase().includes(search) ||
      p.productCategory.toLowerCase().includes(search) ||
      p.license.toLowerCase().includes(search) ||
      p.technology.join(',').toLowerCase().includes(search) ||
      p.fundingStage.toLowerCase().includes(search)
    );
  }

  clearSearch() {
    this.searchText = '';
    this.onSearch();
  }

  // Add product - navigate to add-new-product
  addProduct() {
    this.router.navigate(['/home/add-new-product']);
  }

  // Product popup
  openProduct(product: Product) {
    this.selectedProduct = product;
    this.showProductPopup = true;
    this.popupService.openProductPopup(product);
  }

  closeProductPopup() {
    this.showProductPopup = false;
    this.selectedProduct = null;
    this.popupService.closeProductPopup();
  }

  // Reviews drawer
  seeAllReviews(product: Product) {
    this.selectedProductForReviews = product;
    this.productReviews = this.allReviews.filter(r => r.productId === product.id);
    this.reviewsPage = 1;
    this.loadReviewsForDrawer();
    this.showReviewsDrawer = true;
  }

  loadReviewsForDrawer() {
    const endIndex = this.reviewsPage * this.reviewsPerPage;
    this.displayedReviews = this.productReviews.slice(0, endIndex);
  }

  loadMoreReviews() {
    this.reviewsPage++;
    this.loadReviewsForDrawer();
  }

  get hasMoreReviews(): boolean {
    return this.displayedReviews.length < this.productReviews.length;
  }

  closeReviewsDrawer() {
    this.showReviewsDrawer = false;
    this.selectedProductForReviews = null;
    this.productReviews = [];
    this.displayedReviews = [];
    this.reviewsPage = 1;
  }

  // Review popup
  openReviewPopup(review: Review) {
    this.selectedReview = review;
    this.showReviewPopup = true;
    this.popupService.openReviewPopup(review);
  }

  closeReviewPopup() {
    this.showReviewPopup = false;
    this.selectedReview = null;
    this.popupService.closeReviewPopup();
  }

  // Helper methods
  getReviewCount(productId: string): number {
    return this.allReviews.filter(r => r.productId === productId).length;
  }

  getUserName(userId: string): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  }

  getStars(rating: number): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? 'star' : 'star_border');
    }
    return stars;
  }

  onImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
  }

  // Actions
  updateProduct(product: Product) {
    alert(`Update clicked for ${product.productName}`);
  }

  deleteProduct(product: Product) {
    if (confirm(`Are you sure you want to delete ${product.productName}?`)) {
      this.products = this.products.filter(p => p.id !== product.id);
      this.filteredProducts = this.filteredProducts.filter(p => p.id !== product.id);
      alert(`${product.productName} deleted successfully.`);
    }
  }

  deactivateProduct(product: Product) {
    if (confirm(`Are you sure you want to deactivate ${product.productName}?`)) {
      alert(`${product.productName} has been deactivated.`);
    }
  }
}