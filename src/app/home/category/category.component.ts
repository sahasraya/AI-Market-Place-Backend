import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminIdAuthService } from '../../services/getuserid.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

interface Category {
  id: number;
  categoryid: string;
  categoryName: string;
  createdDate: Date;
}

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  categoryForm!: FormGroup;
  categories: Category[] = [];
  showCreatePopup = false;
  isSubmitting = false;
  isEditMode = false;
  currentCategoryId: string | null = null;
  adminid: string = "";
  APIURL = environment.APIURL;

  constructor(
    private fb: FormBuilder,
    private adminIdAuthService: AdminIdAuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.adminid = this.adminIdAuthService.getAdminId()!;
    this.loadCategories();
  }

  initializeForm(): void {
    this.categoryForm = this.fb.group({
      categoryName: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  // ✅ Load categories from API
  async loadCategories(): Promise<void> {
    

    this.http.get(this.APIURL + `get_categories`).subscribe({
      next: (response: any) => {
        if (response.message === "Categories retrieved successfully") {
          // Map the response to categories array
          this.categories = response.categories.map((c: any) => ({
            id: c.id,
            categoryid: c.categoryid,
            categoryName: c.categoryName,
            createdDate: new Date(c.createdDate)
          }));
        } else {
          console.log('No categories found');
          this.categories = [];
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        alert("Failed to load categories. Please try again.");
        this.categories = [];
      }
    });
  }

  openCreatePopup(): void {
    this.isEditMode = false;
    this.currentCategoryId = null;
    this.categoryForm.reset();
    this.showCreatePopup = true;
  }

  closeCreatePopup(): void {
    this.showCreatePopup = false;
    this.isEditMode = false;
    this.currentCategoryId = null;
    this.categoryForm.reset();
  }

  // ✅ Edit category
  editCategory(category: Category): void {
    this.isEditMode = true;
    this.currentCategoryId = category.categoryid;
    this.categoryForm.patchValue({
      categoryName: category.categoryName
    });
    this.showCreatePopup = true;
  }

  // ✅ Submit form (Create or Update)
  async onSubmit(): Promise<void> {
    if (!this.categoryForm.valid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.categoryForm.controls).forEach(key => {
        this.categoryForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const categoryName = this.categoryForm.value.categoryName;

    if (this.isEditMode && this.currentCategoryId !== null) {
      // ✅ UPDATE existing category
      const formData = new FormData();
      formData.append("adminid", this.adminid);
      formData.append("categoryid", this.currentCategoryId);
      formData.append("categoryName", categoryName);

      this.http.post(this.APIURL + 'update_category', formData).subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          if (response.message === "Category updated successfully") {
            this.closeCreatePopup();
            this.loadCategories();
          } else {
            alert(response.message || 'Failed to update category.');
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error updating category:', error);
          alert("Failed to update category. Please try again.");
        }
      });
    } else {
      // ✅ CREATE new category
      const formData = new FormData();
      formData.append("adminid", this.adminid);
      formData.append("categoryName", categoryName);

      this.http.post(this.APIURL + 'create_category', formData).subscribe({
        next: (response: any) => {
          this.isSubmitting = false;

              if (response.message === "Category name already exists") {
      alert("Category name already exists. Try another name.");
      return;
    }
    
          if (response.message === "Category created successfully") {
            this.closeCreatePopup();
            this.loadCategories();
          } else {
            alert(response.message || 'Failed to create category.');
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error creating category:', error);
          alert("Failed to create category. Please try again.");
        }
      });
    }
  }

  // ✅ Delete category
  deleteCategory(categoryid: string): void {
    const category = this.categories.find(c => c.categoryid === categoryid);
    if (category) {
      const confirmed = confirm(`Are you sure you want to delete "${category.categoryName}"?`);
      if (confirmed) {
        const formData = new FormData();
        formData.append("adminid", this.adminid);
        formData.append("categoryid", categoryid);

        this.http.post(this.APIURL + 'delete_category', formData).subscribe({
          next: (response: any) => {
            if (response.message === "Category deleted successfully") {
              this.loadCategories();
            } else {
              alert(response.message || 'Failed to delete category.');
            }
          },
          error: (error) => {
            console.error('Error deleting category:', error);
            alert("Failed to delete category. Please try again.");
          }
        });
      }
    }
  }

  get isFormValid(): boolean {
    return this.categoryForm.valid;
  }
}