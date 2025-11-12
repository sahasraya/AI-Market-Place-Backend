import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

interface Category {
  id: number;
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
  currentCategoryId: number | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();
  }

  initializeForm(): void {
    this.categoryForm = this.fb.group({
      categoryName: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  loadCategories(): void {
    // Load from localStorage or API
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      this.categories = JSON.parse(savedCategories).map((c: any) => ({
        ...c,
        createdDate: new Date(c.createdDate)
      }));
    } else {
      // Sample data
      this.categories = [
        {
          id: 1,
          categoryName: 'Electronics',
          createdDate: new Date('2024-01-15'),
        },
        {
          id: 2,
          categoryName: 'Clothing',
          createdDate: new Date('2024-02-20'),
        },
        {
          id: 3,
          categoryName: 'Food & Beverages',
          createdDate: new Date('2024-03-10'),
        },
        {
          id: 4,
          categoryName: 'Home & Garden',
          createdDate: new Date('2024-04-05'),
        },
        {
          id: 5,
          categoryName: 'Sports & Outdoors',
          createdDate: new Date('2024-05-12'),
        }
      ];
      this.saveCategories();
    }
  }

  saveCategories(): void {
    localStorage.setItem('categories', JSON.stringify(this.categories));
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

  editCategory(category: Category): void {
    this.isEditMode = true;
    this.currentCategoryId = category.id;
    this.categoryForm.patchValue({
      categoryName: category.categoryName
    });
    this.showCreatePopup = true;
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.isSubmitting = true;

      // Simulate API call
      setTimeout(() => {
        if (this.isEditMode && this.currentCategoryId !== null) {
          // Update existing category
          const index = this.categories.findIndex(c => c.id === this.currentCategoryId);
          if (index !== -1) {
            this.categories[index] = {
              ...this.categories[index],
              categoryName: this.categoryForm.value.categoryName
            };
            this.saveCategories();
            alert('Category updated successfully!');
          }
        } else {
          // Create new category
          const newCategory: Category = {
            id: this.categories.length > 0 ? Math.max(...this.categories.map(c => c.id)) + 1 : 1,
            categoryName: this.categoryForm.value.categoryName,
            createdDate: new Date(),
          };
          this.categories.push(newCategory);
          this.saveCategories();
          alert('Category created successfully!');
        }

        this.isSubmitting = false;
        this.closeCreatePopup();
      }, 1000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.categoryForm.controls).forEach(key => {
        this.categoryForm.get(key)?.markAsTouched();
      });
    }
  }

  deleteCategory(id: number): void {
    const category = this.categories.find(c => c.id === id);
    if (category) {
      const confirmed = confirm(`Are you sure you want to delete "${category.categoryName}"?`);
      if (confirmed) {
        this.categories = this.categories.filter(c => c.id !== id);
        this.saveCategories();
        alert('Category deleted successfully!');
      }
    }
  }

  get isFormValid(): boolean {
    return this.categoryForm.valid;
  }
}