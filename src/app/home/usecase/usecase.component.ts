import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

interface Usecase {
  id: number;
  usecaseName: string;
  createdDate: Date;
}

@Component({
  selector: 'app-usecase',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usecase.component.html',
  styleUrl: './usecase.component.css'
})
export class UsecaseComponent implements OnInit {
  usecaseForm!: FormGroup;
  usecases: Usecase[] = [];
  showCreatePopup = false;
  isSubmitting = false;
  isEditMode = false;
  currentUsecaseId: number | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadUsecases();
  }

  initializeForm(): void {
    this.usecaseForm = this.fb.group({
      usecaseName: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  loadUsecases(): void {
    // Load from localStorage or API
    const savedUsecases = localStorage.getItem('usecases');
    if (savedUsecases) {
      this.usecases = JSON.parse(savedUsecases).map((u: any) => ({
        ...u,
        createdDate: new Date(u.createdDate)
      }));
    } else {
      // Sample data
      this.usecases = [
        {
          id: 1,
          usecaseName: 'User Authentication',
          createdDate: new Date('2024-01-15'),
        },
        {
          id: 2,
          usecaseName: 'Payment Processing',
          createdDate: new Date('2024-02-20'),
        },
        {
          id: 3,
          usecaseName: 'Inventory Management',
          createdDate: new Date('2024-03-10'),
        }
      ];
      this.saveUsecases();
    }
  }

  saveUsecases(): void {
    localStorage.setItem('usecases', JSON.stringify(this.usecases));
  }

  openCreatePopup(): void {
    this.isEditMode = false;
    this.currentUsecaseId = null;
    this.usecaseForm.reset();
    this.showCreatePopup = true;
  }

  closeCreatePopup(): void {
    this.showCreatePopup = false;
    this.isEditMode = false;
    this.currentUsecaseId = null;
    this.usecaseForm.reset();
  }

  editUsecase(usecase: Usecase): void {
    this.isEditMode = true;
    this.currentUsecaseId = usecase.id;
    this.usecaseForm.patchValue({
      usecaseName: usecase.usecaseName
    });
    this.showCreatePopup = true;
  }

  onSubmit(): void {
    if (this.usecaseForm.valid) {
      this.isSubmitting = true;

      // Simulate API call
      setTimeout(() => {
        if (this.isEditMode && this.currentUsecaseId !== null) {
          // Update existing usecase
          const index = this.usecases.findIndex(u => u.id === this.currentUsecaseId);
          if (index !== -1) {
            this.usecases[index] = {
              ...this.usecases[index],
              usecaseName: this.usecaseForm.value.usecaseName
            };
            this.saveUsecases();
            alert('Use case updated successfully!');
          }
        } else {
          // Create new usecase
          const newUsecase: Usecase = {
            id: this.usecases.length > 0 ? Math.max(...this.usecases.map(u => u.id)) + 1 : 1,
            usecaseName: this.usecaseForm.value.usecaseName,
            createdDate: new Date(),
          };
          this.usecases.push(newUsecase);
          this.saveUsecases();
          alert('Use case created successfully!');
        }

        this.isSubmitting = false;
        this.closeCreatePopup();
      }, 1000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.usecaseForm.controls).forEach(key => {
        this.usecaseForm.get(key)?.markAsTouched();
      });
    }
  }

  deleteUsecase(id: number): void {
    const usecase = this.usecases.find(u => u.id === id);
    if (usecase) {
      const confirmed = confirm(`Are you sure you want to delete "${usecase.usecaseName}"?`);
      if (confirmed) {
        this.usecases = this.usecases.filter(u => u.id !== id);
        this.saveUsecases();
        alert('Use case deleted successfully!');
      }
    }
  }

  get isFormValid(): boolean {
    return this.usecaseForm.valid;
  }
}