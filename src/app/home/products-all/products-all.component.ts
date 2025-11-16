import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProductComponent } from '../../widget/product/product.component';
import { ReviewComponent } from '../../widget/review/review.component';
import { PopupService, Product, Review } from '../../services/popup.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-products-all',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductComponent, ReviewComponent],
  templateUrl: './products-all.component.html',
  styleUrls: ['./products-all.component.css']
})
export class ProductsAllComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchText: string = '';

  selectedProduct: Product | null = null;
  showProductPopup = false;

  showReviewsDrawer = false;
  selectedProductForReviews: Product | null = null;
  productReviews: Review[] = [];
  displayedReviews: Review[] = [];
  reviewsOffset = 0;
  reviewsLimit = 5;
  hasMoreReviews = false;
  isLoadingReviews = false;

  selectedReview: Review | null = null;
  showReviewPopup = false;

  reviewCounts: { [productid: string]: number } = {};

  APIURL = environment.APIURL;

  constructor(
    private popupService: PopupService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // ✅ Load all products
 async loadProducts(): Promise<void> {
    const body = { page: 1, limit: 100 };
    
    this.http.post<{ message: string; products: any[] }>(
      `${this.APIURL}get_all_product_details_all`,
      body
    ).subscribe({
      next: (response) => {
        if (response.products && response.products.length > 0) {
          this.products = response.products.map(p => ({
            productid: p.productid,
            userid: p.userid,
            productname: p.productname,
            productimage: p.productimage || '',
            productcategory: p.productcategory || '',
            productlicense: p.productlicense || '',
            producttechnology: p.producttechnology || '',
            productwebsite: p.productwebsite || '',
            productfundingstage: p.productfundingstage || '',
            productusecaseid: p.productusecaseid || '',
            productfacebook: p.productfacebook || '',
            productdocumentation: p.productdocumentation || '',
            productlinkedin: p.productlinkedin || '',
            productfounderid: p.productfounderid || '',
            productdescription: p.productdescription || '',
            productbaseaimodelid: p.productbaseaimodelid || '',
            productdeploymentid: p.productdeploymentid || '',
            productrepositoryid: p.productrepositoryid || '',
            productmediaid: p.productmediaid || '',
            rating: p.rating || 0,
            counts: p.counts || '0',
            createddate: p.createddate,
            usecasenames: p.usecasenames || [],
            technologynames: p.technologynames || [],
            foundernames: p.foundernames || [],
            baseaimodelnames: p.baseaimodelnames || [],
            deploymentnames: p.deploymentnames || [],
            repositorylinks: p.repositorylinks || [],
            medialinks: p.medialinks || []
          } as Product));
          
          this.filteredProducts = [...this.products];
          
          // ✅ Load review counts for all products
          this.loadReviewCounts();
        } else {
          console.warn('No products returned from API.');
          this.filteredProducts = [];
        }
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        alert('Failed to load products. Please try again.');
      }
    });
  }

  // ✅ Load review counts for all products
async  loadReviewCounts(): Promise<void> {
    const productIds = this.products.map(p => p.productid);
    
    if (productIds.length === 0) return;

    const payload = { product_ids: productIds };

    this.http.post<any>(this.APIURL + 'product_comparison_review_count', payload).subscribe({
      next: (response) => {
        if (response.message === "success" && response.review_counts) {
          // Create a map of review counts
          response.review_counts.forEach((item: any) => {
            this.reviewCounts[item.productid] = item.count;
          });
        }
      },
      error: (error) => {
        console.error('❌ Error fetching review counts:', error);
      }
    });
  }

  // ✅ Search functionality
  onSearch() {
    const search = this.searchText.toLowerCase().trim();
    if (!search) {
      this.filteredProducts = [...this.products];
      return;
    }
    this.filteredProducts = this.products.filter(p =>
      p.productname.toLowerCase().includes(search) ||
      p.productcategory.toLowerCase().includes(search) ||
      p.productlicense.toLowerCase().includes(search) ||
      (p.producttechnology && p.producttechnology.toLowerCase().includes(search)) ||
      p.productfundingstage.toLowerCase().includes(search) ||
      (p.technologynames && p.technologynames.some(t => t.toLowerCase().includes(search)))
    );
  }

  clearSearch() {
    this.searchText = '';
    this.onSearch();
  }

  addProduct() {
    this.router.navigate(['/home/add-new-product']);
  }

  // ✅ Open product details popup
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

  // ✅ See all reviews for a product
  seeAllReviews(product: Product) {
    this.selectedProductForReviews = product;
    this.reviewsOffset = 0;
    this.productReviews = [];
    this.displayedReviews = [];
    this.loadProductReviews(product.productid, true);
    this.showReviewsDrawer = true;
  }

  // ✅ Load reviews for a specific product
async  loadProductReviews(productid: string, reset: boolean = false): Promise<void> {
    if (reset) {
      this.isLoadingReviews = true;
      this.reviewsOffset = 0;
    }

    const payload = {
      productid: productid,
      offset: this.reviewsOffset,
      limit: this.reviewsLimit
    };

    this.http.post<any>(this.APIURL + 'get_product_reviews_page', payload).subscribe({
      next: (response) => {
        if (response.message === "found") {
          if (reset) {
            this.productReviews = response.reviews || [];
            this.displayedReviews = response.reviews || [];
            this.reviewsOffset = response.limit || this.reviewsLimit;
          } else {
            this.productReviews = [...this.productReviews, ...(response.reviews || [])];
            this.displayedReviews = this.productReviews;
            this.reviewsOffset += (response.reviews || []).length;
          }
          this.hasMoreReviews = response.has_more || false;
        } else {
          if (reset) {
            this.productReviews = [];
            this.displayedReviews = [];
            this.hasMoreReviews = false;
            this.reviewsOffset = 0;
          }
        }
        this.isLoadingReviews = false;
      },
      error: (error) => {
        console.error('Error loading product reviews:', error);
        if (reset) {
          this.productReviews = [];
          this.displayedReviews = [];
          this.hasMoreReviews = false;
          this.reviewsOffset = 0;
        }
        this.isLoadingReviews = false;
      }
    });
  }

  loadMoreReviews() {
    if (this.selectedProductForReviews && !this.isLoadingReviews) {
      this.loadProductReviews(this.selectedProductForReviews.productid, false);
    }
  }

  closeReviewsDrawer() {
    this.showReviewsDrawer = false;
    this.selectedProductForReviews = null;
    this.productReviews = [];
    this.displayedReviews = [];
    this.reviewsOffset = 0;
  }

  // ✅ Open review popup
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

  // ✅ Get review count for a product
  getReviewCount(productid: string): number {
    return this.reviewCounts[productid] || 0;
  }

  // ✅ Get user name from review (using username field)
  getUserName(review: Review): string {
    return review.username || 'Unknown User';
  }

  // ✅ Generate stars array
  getStars(rating: number | string): string[] {
    const numRating = typeof rating === 'string' ? parseInt(rating) : rating;
    return Array.from({ length: 5 }, (_, i) => i < numRating ? 'star' : 'star_border');
  }

  // ✅ Handle image error
  onImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
  }

  // ✅ Get product image with base64
  getProductImage(product: Product): string {
    if (product.productimage) {
      return `data:image/jpeg;base64,${product.productimage}`;
    }
    return 'https://via.placeholder.com/300x200?text=No+Image';
  }

  // ✅ Update product
  updateProduct(product: Product) {
    // Navigate to edit page or open edit modal
    alert(`Update functionality for ${product.productname}`);
    // Example: this.router.navigate(['/home/edit-product', product.productid]);
  }

  // ✅ Delete product
async  deleteProduct(product: Product):Promise<void> {
    if (confirm(`Are you sure you want to delete ${product.productname}?`)) {
      const payload = { productid: product.productid };
      
      this.http.post(this.APIURL + 'delete_product', payload).subscribe({
        next: (response: any) => {
          if (response.message === "Product deleted successfully") {
            this.products = this.products.filter(p => p.productid !== product.productid);
            this.filteredProducts = this.filteredProducts.filter(p => p.productid !== product.productid);
            delete this.reviewCounts[product.productid];
            alert(`${product.productname} deleted successfully.`);
          }
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product. Please try again.');
        }
      });
    }
  }

  // ✅ Deactivate product
 async deactivateProduct(product: Product):Promise<void> {
    if (confirm(`Are you sure you want to deactivate ${product.productname}?`)) {
      const payload = { 
        productid: product.productid,
        status: 'inactive'
      };
      
      this.http.post(this.APIURL + 'toggle_product_status', payload).subscribe({
        next: (response: any) => {
          if (response.message === "Product status updated successfully") {
            alert(`${product.productname} has been deactivated.`);
            // Optionally reload products or update status locally
            this.loadProducts();
          }
        },
        error: (error) => {
          console.error('Error deactivating product:', error);
          alert('Failed to deactivate product. Please try again.');
        }
      });
    }
  }
}