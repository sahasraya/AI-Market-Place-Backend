import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminIdAuthService } from '../../services/getuserid.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

interface Technology {
  id: number;
  techknologyid: string;
  technologyName: string;
  createdDate: Date;
}

@Component({
  selector: 'app-technology',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './technology.component.html',
  styleUrl: './technology.component.css'
})
export class TechnologyComponent implements OnInit {
  technologyForm!: FormGroup;
  technologies: Technology[] = [];
  showCreatePopup = false;
  isSubmitting = false;
  isEditMode = false;
  currentTechnologyId: string | null = null;
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
    this.loadTechnologies();
  }

  initializeForm(): void {
    this.technologyForm = this.fb.group({
      technologyName: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  // ✅ Load technologies from API
  async loadTechnologies(): Promise<void> {
    

    this.http.get(this.APIURL + `get_technologies`).subscribe({
      next: (response: any) => {
        if (response.message === "Technologies retrieved successfully") {
          // Map the response to technologies array
          this.technologies = response.technologies.map((t: any) => ({
            id: t.id,
            techknologyid: t.techknologyid,
            technologyName: t.technologyName,
            createdDate: new Date(t.createdDate)
          }));
        } else {
          console.log('No technologies found');
          this.technologies = [];
        }
      },
      error: (error) => {
        console.error('Error loading technologies:', error);
        alert("Failed to load technologies. Please try again.");
        this.technologies = [];
      }
    });
  }

  openCreatePopup(): void {
    this.isEditMode = false;
    this.currentTechnologyId = null;
    this.technologyForm.reset();
    this.showCreatePopup = true;
  }

  closeCreatePopup(): void {
    this.showCreatePopup = false;
    this.isEditMode = false;
    this.currentTechnologyId = null;
    this.technologyForm.reset();
  }

  // ✅ Edit technology
  editTechnology(technology: Technology): void {
    this.isEditMode = true;
    this.currentTechnologyId = technology.techknologyid;
    this.technologyForm.patchValue({
      technologyName: technology.technologyName
    });
    this.showCreatePopup = true;
  }

  // ✅ Submit form (Create or Update)
  async onSubmit(): Promise<void> {
    if (!this.technologyForm.valid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.technologyForm.controls).forEach(key => {
        this.technologyForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const technologyName = this.technologyForm.value.technologyName;

    if (this.isEditMode && this.currentTechnologyId !== null) {
      // ✅ UPDATE existing technology
      const formData = new FormData();
      formData.append("adminid", this.adminid);
      formData.append("techknologyid", this.currentTechnologyId);
      formData.append("technologyName", technologyName);

      this.http.post(this.APIURL + 'update_technology', formData).subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          if (response.message === "Technology updated successfully") {
            this.closeCreatePopup();
            this.loadTechnologies();
          } else {
            alert(response.message || 'Failed to update technology.');
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error updating technology:', error);
          alert("Failed to update technology. Please try again.");
        }
      });
    } else {
      // ✅ CREATE new technology
      const formData = new FormData();
      formData.append("adminid", this.adminid);
      formData.append("technologyName", technologyName);

      this.http.post(this.APIURL + 'create_technology', formData).subscribe({
        next: (response: any) => {
          this.isSubmitting = false;

          if (response.message === "Technology name already exists") {
            alert("Technology name already exists. Try another name.");
            return;
          }

          if (response.message === "Technology created successfully") {
            this.closeCreatePopup();
            this.loadTechnologies();
          } else {
            alert(response.message || 'Failed to create technology.');
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error creating technology:', error);
          alert("Failed to create technology. Please try again.");
        }
      });
    }
  }

  // ✅ Delete technology
  deleteTechnology(techknologyid: string): void {
    const technology = this.technologies.find(t => t.techknologyid === techknologyid);
    if (technology) {
      const confirmed = confirm(`Are you sure you want to delete "${technology.technologyName}"?`);
      if (confirmed) {
        const formData = new FormData();
        formData.append("adminid", this.adminid);
        formData.append("techknologyid", techknologyid);

        this.http.post(this.APIURL + 'delete_technology', formData).subscribe({
          next: (response: any) => {
            if (response.message === "Technology deleted successfully") {
              this.loadTechnologies();
            } else {
              alert(response.message || 'Failed to delete technology.');
            }
          },
          error: (error) => {
            console.error('Error deleting technology:', error);
            alert("Failed to delete technology. Please try again.");
          }
        });
      }
    }
  }

  get isFormValid(): boolean {
    return this.technologyForm.valid;
  }
}