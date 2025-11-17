import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AdminIdAuthService } from '../../services/getuserid.service';

interface Usecase {
  id: number;
  usecaseid: string;
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
  currentUsecaseId: string | null = null;
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
    this.loadUsecases();
  }

  initializeForm(): void {
    this.usecaseForm = this.fb.group({
      usecaseName: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  // ✅ Load use cases from API
  async loadUsecases(): Promise<void> {

    this.http.get(this.APIURL + `get_usecases`).subscribe({
      next: (response: any) => {
        if (response.message === "Use cases retrieved successfully") {
          // Map the response to usecases array
          this.usecases = response.usecases.map((u: any) => ({
            id: u.id,
            usecaseid: u.usecaseadminid,
            usecaseName: u.usecaseName,
            createdDate: new Date(u.createdDate)
          }));
        } else {
          console.log('No use cases found');
          this.usecases = [];
        }
      },
      error: (error) => {
        console.error('Error loading use cases:', error);
        alert("Failed to load use cases. Please try again.");
        this.usecases = [];
      }
    });
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

  // ✅ Edit use case
  editUsecase(usecase: Usecase): void {
    this.isEditMode = true;
    this.currentUsecaseId = usecase.usecaseid;
    this.usecaseForm.patchValue({
      usecaseName: usecase.usecaseName
    });
    this.showCreatePopup = true;
  }

  // ✅ Submit form (Create or Update)
  async onSubmit(): Promise<void> {
    if (!this.usecaseForm.valid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.usecaseForm.controls).forEach(key => {
        this.usecaseForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const usecaseName = this.usecaseForm.value.usecaseName;

    if (this.isEditMode && this.currentUsecaseId !== null) {
      // ✅ UPDATE existing use case
      const formData = new FormData();
      formData.append("adminid", this.adminid);
      formData.append("usecaseid", this.currentUsecaseId);
      formData.append("usecaseName", usecaseName);

      this.http.post(this.APIURL + 'update_usecase', formData).subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          if (response.message === "Use case updated successfully") {
            this.closeCreatePopup();
            this.loadUsecases();
          } else {
            alert(response.message || 'Failed to update use case.');
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error updating use case:', error);
          alert("Failed to update use case. Please try again.");
        }
      });
    } else {
      // ✅ CREATE new use case
      const formData = new FormData();
      formData.append("adminid", this.adminid);
      formData.append("usecaseName", usecaseName);

      this.http.post(this.APIURL + 'create_usecase', formData).subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          if (response.message === "Use case created successfully") {
            this.closeCreatePopup();
            this.loadUsecases();
          } else {
            alert(response.message || 'Failed to update_usecase use case.');
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error creating use case:', error);
          alert("Failed to create use case. Please try again.");
        }
      });
    }
  }

  // ✅ Delete use case
  async deleteUsecase(usecaseid: string): Promise<void> {
    const usecase = this.usecases.find(u => u.usecaseid === usecaseid);
    if (usecase) {
      const confirmed = confirm(`Are you sure you want to delete "${usecase.usecaseName}"?`);
      if (confirmed) {
        const formData = new FormData();
        formData.append("adminid", this.adminid);
        formData.append("usecaseid", usecaseid);

        this.http.post(this.APIURL + 'delete_usecase', formData).subscribe({
          next: (response: any) => {
            if (response.message === "Use case deleted successfully") {
              this.loadUsecases();
            } else {
              alert(response.message || 'Failed to delete use case.');
            }
          },
          error: (error) => {
            console.error('Error deleting use case:', error);
            alert("Failed to delete use case. Please try again.");
          }
        });
      }
    }
  }

  get isFormValid(): boolean {
    return this.usecaseForm.valid;
  }
}