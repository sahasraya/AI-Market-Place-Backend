import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-add-new-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-new-product.component.html',
  styleUrl: './add-new-product.component.css'
})
export class AddNewProductComponent implements OnInit {
  productAddingForm!: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  
  // Image handling
  selectedImage: string | ArrayBuffer | null = null;
  selectedProductFile: File | null = null;
  selectedFileName: string = '';

  // Use cases
  useCaseInput: string = '';
  selectedUseCases: string[] = [];
  filteredUseCases: string[] = [];
  usecases: any[] = [];

  // ✅ Technologies Multi-Select
  selectedTechnologies: string[] = [];
  technologyInput: string = '';
  filteredTechnologies: string[] = [];
  showTechnologyDropdown: boolean = false;

  // Dropdowns
  categories: any[] = [];
  technologies: any[] = [];

  // API
  APIURL = environment.APIURL;
  userid: string = '';
  updatingProductId: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();
    this.loadTechnologies();
    this.loadUsecases();
    this.checkEditMode();
  }

  initializeForm(): void {
    this.productAddingForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      license: ['', Validators.required],
      website: ['', Validators.required],
      fundingStage: ['', Validators.required],
      productdescription: ['', Validators.required],
      founders: this.fb.array([this.fb.control('', Validators.required)]),
      baseModels: this.fb.array([this.fb.control('', Validators.required)]),
      useCases: this.fb.array([]),
      deployments: this.fb.array([this.fb.control('', Validators.required)]),
      mediaPreviews: this.fb.array([this.fb.control(null)]),
      repositories: this.fb.array([this.fb.control(null)]),
      productfb: [''],
      documentationlink: [''],
      productlinkedin: [''],
      xlink: [''],
      isFeatured: [false]
    });
  }

  async loadCategories(): Promise<void> {
    this.http.get(this.APIURL + 'get_categories').subscribe({
      next: (response: any) => {
        if (response.message === "Categories retrieved successfully") {
          this.categories = response.categories.map((c: any) => ({
            id: c.id,
            categoryid: c.categoryid,
            categoryName: c.categoryName
          }));
        }
      },
      error: (err) => {
        console.error("Error loading categories:", err);
      }
    });
  }

  async loadTechnologies(): Promise<void> {
    this.http.get(this.APIURL + 'get_technologies').subscribe({
      next: (response: any) => {
        if (response.message === "Technologies retrieved successfully") {
          this.technologies = response.technologies.map((t: any) => ({
            id: t.id,
            techknologyid: t.techknologyid,
            technologyName: t.technologyName,
            createdDate: new Date(t.createdDate)
          }));
        }
      },
      error: (error) => {
        console.error('Error loading technologies:', error);
      }
    });
  }

  async loadUsecases(): Promise<void> {
    this.http.get(this.APIURL + 'get_usecases').subscribe({
      next: (response: any) => {
        if (response.message === "Use cases retrieved successfully") {
          this.usecases = response.usecases.map((u: any) => ({
            id: u.id,
            usecaseid: u.usecaseadminid,
            usecaseName: u.usecaseName
          }));
        }
      },
      error: (err) => {
        console.error("Error loading use cases:", err);
      }
    });
  }

  // ✅ Technology Input Handler
  onTechnologyInput(event: any): void {
    event.stopPropagation();
    const value = event.target.value.toLowerCase();
    this.technologyInput = event.target.value;

    if (value) {
      this.filteredTechnologies = this.technologies
        .filter(t =>
          t.technologyName.toLowerCase().includes(value) &&
          !this.selectedTechnologies.includes(t.technologyName)
        )
        .map(t => t.technologyName);
    } else {
      this.filteredTechnologies = this.technologies
        .filter(t => !this.selectedTechnologies.includes(t.technologyName))
        .map(t => t.technologyName);
    }
    
    this.showTechnologyDropdown = this.filteredTechnologies.length > 0;
  }

  // ✅ Technology Input Focus
  onTechnologyInputFocus(): void {
    this.filteredTechnologies = this.technologies
      .filter(t => !this.selectedTechnologies.includes(t.technologyName))
      .map(t => t.technologyName);
    
    this.showTechnologyDropdown = this.filteredTechnologies.length > 0;
  }

  // ✅ Select Technology
  selectTechnology(technology: string): void {
    if (!this.selectedTechnologies.includes(technology)) {
      this.selectedTechnologies.push(technology);
      this.technologyInput = '';
      
      this.filteredTechnologies = this.technologies
        .filter(t => !this.selectedTechnologies.includes(t.technologyName))
        .map(t => t.technologyName);
      
      this.showTechnologyDropdown = this.filteredTechnologies.length > 0;
      
      setTimeout(() => {
        const input = document.querySelector('.technology-input') as HTMLInputElement;
        if (input) {
          input.focus();
        }
      }, 0);
    }
  }

  // ✅ Remove Technology
  removeTechnology(technology: string): void {
    this.selectedTechnologies = this.selectedTechnologies.filter(t => t !== technology);
    
    this.filteredTechnologies = this.technologies
      .filter(t => !this.selectedTechnologies.includes(t.technologyName))
      .map(t => t.technologyName);
  }

  // ✅ Click Outside Handler
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    
    const isTechnologyElement = 
      target.closest('.technology-selector') !== null ||
      target.closest('.technology-dropdown') !== null ||
      target.classList.contains('technology-input') ||
      target.classList.contains('technology-dropdown-item') ||
      target.classList.contains('tech-chip') ||
      target.classList.contains('chip-remove');
    
    if (!isTechnologyElement) {
      this.showTechnologyDropdown = false;
    }
  }

  checkEditMode(): void {
    this.route.params.subscribe(params => {
      const productId = params['productid'];
      this.userid = params['userid'];
      if (productId) {
        this.isEditMode = true;
        this.updatingProductId = productId;
        this.loadProductForEdit(productId);
      }
    });
  }

  loadProductForEdit(productId: string): void {
    const payload = { productid: productId };
    
    this.http.post(this.APIURL + 'get_product_details', payload).subscribe({
      next: (response: any) => {
        if (response.message === 'yes' && response.product) {
          this.populateProductForm(response);
        }
      },
      error: err => console.error('Error loading product:', err)
    });
  }

  populateProductForm(response: any): void {
    const prod = response.product;

    // ✅ Parse technologies from comma-separated string
    const technologiesString = prod.producttechnology || '';
    this.selectedTechnologies = technologiesString
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);

    console.log('✅ Admin-side loaded technologies for edit:', this.selectedTechnologies);

    this.productAddingForm.patchValue({
      name: prod.productname || '',
      type: prod.productcategory || '',
      license: prod.productlicense || '',
      website: prod.productwebsite || '',
      fundingStage: prod.productfundingstage || '',
      productdescription: prod.productdescription || '',
      documentationlink: prod.productdocumentation || '',
      productfb: prod.productfacebook || '',
      productlinkedin: prod.productlinkedin || '',
      xlink: prod.xlink || '',
      isFeatured: prod.isFeatured || false
    });

    if (prod.productimage) {
      this.selectedImage = `data:image/png;base64,${prod.productimage}`;
      this.selectedFileName = 'Current product image';
    }

    this.populateFormArray('founders', response.founders || []);
    this.populateFormArray('baseModels', response.baseModels || []);
    this.populateFormArray('deployments', response.deployments || []);
    this.populateFormArray('mediaPreviews', response.mediaPreviews || []);
    this.populateFormArray('repositories', response.repositories || []);

    if (response.useCases && response.useCases.length > 0) {
      this.selectedUseCases = [...response.useCases];
    }
  }

  populateFormArray(arrayName: string, dataArray: string[]): void {
    const formArray = this.productAddingForm.get(arrayName) as FormArray;
    formArray.clear();

    if (dataArray && dataArray.length > 0) {
      dataArray.forEach(item => {
        if (arrayName === 'deployments') {
          const validOptions = ['SaaS', 'On-Prem', 'Cloud', 'Hybrid'];
          if (validOptions.includes(item)) {
            formArray.push(this.fb.control(item, Validators.required));
          } else {
            formArray.push(this.fb.control('', Validators.required));
          }
        } else {
          const isOptional = arrayName === 'mediaPreviews' || arrayName === 'repositories';
          formArray.push(this.fb.control(item, isOptional ? null : Validators.required));
        }
      });
    } else {
      const isOptional = arrayName === 'mediaPreviews' || arrayName === 'repositories';
      formArray.push(this.fb.control('', isOptional ? null : Validators.required));
    }
  }

  // Form Array Getters
  get founders(): FormArray {
    return this.productAddingForm.get('founders') as FormArray;
  }

  get baseModels(): FormArray {
    return this.productAddingForm.get('baseModels') as FormArray;
  }

  get deployments(): FormArray {
    return this.productAddingForm.get('deployments') as FormArray;
  }

  get mediaPreviews(): FormArray {
    return this.productAddingForm.get('mediaPreviews') as FormArray;
  }

  get repositories(): FormArray {
    return this.productAddingForm.get('repositories') as FormArray;
  }

  // Image Selection
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedProductFile = file;
      this.selectedFileName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Use Cases
  onUseCaseInput(event: any): void {
    const value = event.target.value.toLowerCase();
    this.useCaseInput = event.target.value;

    if (value) {
      this.filteredUseCases = this.usecases
        .filter(u =>
          u.usecaseName.toLowerCase().includes(value) &&
          !this.selectedUseCases.includes(u.usecaseName)
        )
        .map(u => u.usecaseName);
    } else {
      this.filteredUseCases = [];
    }
  }

  selectUseCase(usecase: string): void {
    if (!this.selectedUseCases.includes(usecase)) {
      this.selectedUseCases.push(usecase);
      this.useCaseInput = '';
      this.filteredUseCases = [];
    }
  }

  removeUseCase(usecase: string): void {
    this.selectedUseCases = this.selectedUseCases.filter(u => u !== usecase);
  }

  // Dynamic Fields
  addField(formArray: FormArray): void {
    const isOptional = formArray === this.mediaPreviews || formArray === this.repositories;
    formArray.push(this.fb.control('', isOptional ? null : Validators.required));
  }

  removeField(formArray: FormArray, index: number): void {
    if (formArray.length > 1) {
      formArray.removeAt(index);
    }
  }

  // Form Submission
  onSubmitProduct(): void {
    // ✅ Validate that at least one technology is selected
    if (this.selectedTechnologies.length === 0) {
      alert('⚠️ Please select at least one technology');
      return;
    }

    if (this.productAddingForm.valid) {
      this.isSubmitting = true;
      
      if (this.isEditMode) {
        this.updateProduct();
      } else {
        this.createProduct();
      }
    } else {
      this.productAddingForm.markAllAsTouched();
      alert('Please fill in all required fields');
    }
  }

  async createProduct(): Promise<void> {
    const useCasesFormArray = this.productAddingForm.get('useCases') as FormArray;
    useCasesFormArray.clear();
    this.selectedUseCases.forEach(uc => useCasesFormArray.push(this.fb.control(uc)));

    const formData = new FormData();

    // Basic fields
    formData.append('name', this.productAddingForm.get('name')?.value || '');
    formData.append('type', this.productAddingForm.get('type')?.value || '');
    formData.append('license', this.productAddingForm.get('license')?.value || '');
    
    // ✅ Join technologies with comma
    formData.append('technology', this.selectedTechnologies.join(','));
    console.log('✅ Admin-side creating product with technologies:', this.selectedTechnologies.join(','));
    
    formData.append('website', this.productAddingForm.get('website')?.value || '');
    formData.append('fundingStage', this.productAddingForm.get('fundingStage')?.value || '');
    formData.append('productdescription', this.productAddingForm.get('productdescription')?.value || '');
    formData.append('productdocumentation', this.productAddingForm.get('documentationlink')?.value || '');
    formData.append('xlink', this.productAddingForm.get('xlink')?.value || '');
    formData.append('userid', this.userid || '');
    formData.append('productfb', this.productAddingForm.get('productfb')?.value || '');
    formData.append('productlinkedin', this.productAddingForm.get('productlinkedin')?.value || '');
    formData.append('isFeatured', this.productAddingForm.get('isFeatured')?.value ? '1' : '0');

    // Arrays
    const founders = this.productAddingForm.get('founders')?.value || [];
    const validFounders = founders.filter((f: string) => f && f.trim() !== '');
    validFounders.forEach((f: string, i: number) => formData.append(`founders[${i}]`, f));

    const useCases = this.selectedUseCases || [];
    useCases.forEach((uc: string, i: number) => formData.append(`useCases[${i}]`, uc));

    const baseModels = this.productAddingForm.get('baseModels')?.value || [];
    const validBaseModels = baseModels.filter((b: string) => b && b.trim() !== '');
    validBaseModels.forEach((b: string, i: number) => formData.append(`baseModels[${i}]`, b));

    const deployments = this.productAddingForm.get('deployments')?.value || [];
    const validDeploymentOptions = ['SaaS', 'On-Prem', 'Cloud', 'Hybrid'];
    const validDeployments = deployments.filter((d: string) => 
      d && d.trim() !== '' && validDeploymentOptions.includes(d)
    );
    validDeployments.forEach((d: string, i: number) => formData.append(`deployments[${i}]`, d));

    const mediaPreviews = this.productAddingForm.get('mediaPreviews')?.value || [];
    const validMediaPreviews = mediaPreviews.filter((m: string) => m && m.trim() !== '');
    validMediaPreviews.forEach((m: string, i: number) => formData.append(`mediaPreviews[${i}]`, m));

    const repositories = this.productAddingForm.get('repositories')?.value || [];
    const validRepositories = repositories.filter((r: string) => r && r.trim() !== '');
    validRepositories.forEach((r: string, i: number) => formData.append(`repositories[${i}]`, r));

    console.log('✅ Admin-side creating with repositories:', validRepositories);

    // Product image
    if (this.selectedProductFile) {
      formData.append('productImage', this.selectedProductFile);
    }

    // Send to backend
    this.http.post(this.APIURL + 'insert_product', formData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        if (response.message === 'yes') {
          alert('✅ Product created successfully!');
          this.router.navigate(['/home/products-all']);
        } else {
          console.error('❌ Creation failed:', response);
          alert('❌ Failed to create product: ' + (response.message || 'Unknown error'));
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('❌ Error creating product:', err);
        
        let errorMessage = 'Error creating product';
        if (err.error && err.error.detail) {
          errorMessage += ': ' + err.error.detail;
        } else if (err.message) {
          errorMessage += ': ' + err.message;
        }
        
        alert(errorMessage);
      }
    });
  }

  async updateProduct(): Promise<void> {
    const deploymentsArray = this.productAddingForm.get('deployments')?.value || [];
    const validDeploymentOptions = ['SaaS', 'On-Prem', 'Cloud', 'Hybrid'];
    const validDeployments = deploymentsArray.filter((d: string) => 
      d && d.trim() !== '' && validDeploymentOptions.includes(d)
    );

    // ✅ Filter valid repositories
    const repositoriesArray = this.productAddingForm.get('repositories')?.value || [];
    const validRepositories = repositoriesArray.filter((r: string) => r && r.trim() !== '');

    // ✅ Filter valid media previews
    const mediaPreviewsArray = this.productAddingForm.get('mediaPreviews')?.value || [];
    const validMediaPreviews = mediaPreviewsArray.filter((m: string) => m && m.trim() !== '');

    const payload: any = {
      productid: this.updatingProductId,
      userid: this.userid,
      productname: this.productAddingForm.get('name')?.value || '',
      productcategory: this.productAddingForm.get('type')?.value || '',
      productlicense: this.productAddingForm.get('license')?.value || '',
      
      // ✅ Join technologies with comma
      producttechnology: this.selectedTechnologies.join(','),
      
      productwebsite: this.productAddingForm.get('website')?.value || '',
      productfundingstage: this.productAddingForm.get('fundingStage')?.value || '',
      productdescription: this.productAddingForm.get('productdescription')?.value || '',
      productdocumentation: this.productAddingForm.get('documentationlink')?.value || '',
      productfacebook: this.productAddingForm.get('productfb')?.value || '',
      productlinkedin: this.productAddingForm.get('productlinkedin')?.value || '',
      xlink: this.productAddingForm.get('xlink')?.value || '',
      isFeatured: this.productAddingForm.get('isFeatured')?.value ? 1 : 0,
      founders: this.productAddingForm.get('founders')?.value.filter((f: string) => f && f.trim() !== ''),
      baseModels: this.productAddingForm.get('baseModels')?.value.filter((b: string) => b && b.trim() !== ''),
      deployments: validDeployments,
      mediaPreviews: validMediaPreviews,
      repositories: validRepositories,
      useCases: this.selectedUseCases
    };

   

    // Handle image if selected
    if (this.selectedProductFile) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const base64String = (reader.result as string).split(',')[1];
          payload.productimage = base64String;
          this.sendUpdateRequest(payload);
        }
      };
      reader.readAsDataURL(this.selectedProductFile);
    } else {
      this.sendUpdateRequest(payload);
    }
  }

  async sendUpdateRequest(payload: any): Promise<void> {
    console.log('📤 Admin-side sending update request with payload:', payload);
    
    this.http.post(this.APIURL + 'update_product_details', payload).subscribe({
      next: (response: any) => {
        console.log('✅ Admin-side update response:', response);
        this.isSubmitting = false;
        
        if (response.message === 'success') {
          alert('✅ Product updated successfully!');
          this.router.navigate(['/home/products-all']);
        } else {
          console.error('❌ Admin-side update failed:', response);
          alert('❌ Failed to update product: ' + (response.message || 'Unknown error'));
        }
      },
      error: err => {
        console.error('❌ Admin-side error updating product:', err);
        this.isSubmitting = false;
        
        let errorMessage = 'Error updating product';
        if (err.error && err.error.detail) {
          errorMessage += ': ' + err.error.detail;
        } else if (err.message) {
          errorMessage += ': ' + err.message;
        }
        
        alert(errorMessage);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/home/products-all']);
  }
}