import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

interface Technology {
  id: number;
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
  currentTechnologyId: number | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadTechnologies();
  }

  initializeForm(): void {
    this.technologyForm = this.fb.group({
      technologyName: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  loadTechnologies(): void {
    // Load from localStorage or API
    const savedTechnologies = localStorage.getItem('technologies');
    if (savedTechnologies) {
      this.technologies = JSON.parse(savedTechnologies).map((t: any) => ({
        ...t,
        createdDate: new Date(t.createdDate)
      }));
    } else {
      // Sample data
      this.technologies = [
        {
          id: 1,
          technologyName: 'Angular',
          createdDate: new Date('2024-01-15'),
        },
        {
          id: 2,
          technologyName: 'React',
          createdDate: new Date('2024-02-20'),
        },
        {
          id: 3,
          technologyName: 'Node.js',
          createdDate: new Date('2024-03-10'),
        },
        {
          id: 4,
          technologyName: 'TypeScript',
          createdDate: new Date('2024-04-05'),
        }
      ];
      this.saveTechnologies();
    }
  }

  saveTechnologies(): void {
    localStorage.setItem('technologies', JSON.stringify(this.technologies));
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

  editTechnology(technology: Technology): void {
    this.isEditMode = true;
    this.currentTechnologyId = technology.id;
    this.technologyForm.patchValue({
      technologyName: technology.technologyName
    });
    this.showCreatePopup = true;
  }

  onSubmit(): void {
    if (this.technologyForm.valid) {
      this.isSubmitting = true;

      // Simulate API call
      setTimeout(() => {
        if (this.isEditMode && this.currentTechnologyId !== null) {
          // Update existing technology
          const index = this.technologies.findIndex(t => t.id === this.currentTechnologyId);
          if (index !== -1) {
            this.technologies[index] = {
              ...this.technologies[index],
              technologyName: this.technologyForm.value.technologyName
            };
            this.saveTechnologies();
            alert('Technology updated successfully!');
          }
        } else {
          // Create new technology
          const newTechnology: Technology = {
            id: this.technologies.length > 0 ? Math.max(...this.technologies.map(t => t.id)) + 1 : 1,
            technologyName: this.technologyForm.value.technologyName,
            createdDate: new Date(),
          };
          this.technologies.push(newTechnology);
          this.saveTechnologies();
          alert('Technology created successfully!');
        }

        this.isSubmitting = false;
        this.closeCreatePopup();
      }, 1000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.technologyForm.controls).forEach(key => {
        this.technologyForm.get(key)?.markAsTouched();
      });
    }
  }

  deleteTechnology(id: number): void {
    const technology = this.technologies.find(t => t.id === id);
    if (technology) {
      const confirmed = confirm(`Are you sure you want to delete "${technology.technologyName}"?`);
      if (confirmed) {
        this.technologies = this.technologies.filter(t => t.id !== id);
        this.saveTechnologies();
        alert('Technology deleted successfully!');
      }
    }
  }

  get isFormValid(): boolean {
    return this.technologyForm.valid;
  }
}