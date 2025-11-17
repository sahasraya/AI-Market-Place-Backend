import { Component, OnInit } from '@angular/core';
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
  useCasesArray: string[] = [
    'Customer Support',
    'Content Generation',
    'Data Analysis',
    'Image Recognition',
    'Natural Language Processing',
    'Chatbot',
    'Voice Assistant',
    'Translation',
    'Sentiment Analysis',
    'Code Generation',
    'Video Editing',
    'Photo Editing',
    'File Management',
    'Project Management',
    'CRM',
    'E-commerce',
    'Marketing Automation'
  ];

  // API
  APIURL =  environment.APIURL;
  userid: string = '';
  updatingProductId: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  initializeForm(): void {
    this.productAddingForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      license: ['', Validators.required],
      technology: ['', Validators.required],  // fixed to string (dropdown)
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
      isFeatured: [false], 
    });
  }

  checkEditMode(): void {
    this.route.queryParams.subscribe(params => {
      const productId = params['productid'];
      if (productId) {
        this.isEditMode = true;
        this.updatingProductId = productId;
        this.loadProductForEdit(productId);
      }
    });
  }

  loadProductForEdit(productId: string): void {
    // TODO: Replace with actual API call
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

    this.productAddingForm.patchValue({
      name: prod.productname || '',
      type: prod.productcategory || '',
      license: prod.productlicense || '',
      technology: prod.producttechnology || '',
      website: prod.productwebsite || '',
      fundingStage: prod.productfundingstage || '',
      productdescription: prod.productdescription || '',
      documentationlink: prod.productdocumentation || '',
      productfb: prod.productfacebook || '',
      productlinkedin: prod.productlinkedin || '',
      isFeatured: prod.isFeatured || false
    });

    if (prod.productimage) {
      this.selectedImage = `data:image/png;base64,${prod.productimage}`;
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
        formArray.push(this.fb.control(item, arrayName !== 'mediaPreviews' && arrayName !== 'repositories' ? Validators.required : null));
      });
    } else {
      formArray.push(this.fb.control('', arrayName !== 'mediaPreviews' && arrayName !== 'repositories' ? Validators.required : null));
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
      this.filteredUseCases = this.useCasesArray.filter(usecase =>
        usecase.toLowerCase().includes(value) &&
        !this.selectedUseCases.includes(usecase)
      );
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
    if (this.productAddingForm.valid) {
      this.isSubmitting = true;
      
      if (this.isEditMode) {
      } else {
        this.createProduct();
      }
    } else {
      this.productAddingForm.markAllAsTouched();
      alert('Please fill in all required fields');
    }
  }

async createProduct(): Promise<void> {
  if (!this.productAddingForm.valid) {
    this.productAddingForm.markAllAsTouched();
    alert('Please fill in all required fields');
    return;
  }

  const formData = new FormData();

  // 🔹 Basic fields
  formData.append('name', this.productAddingForm.get('name')?.value);
  formData.append('type', this.productAddingForm.get('type')?.value); // category name
  formData.append('license', this.productAddingForm.get('license')?.value);
  formData.append('technology', this.productAddingForm.get('technology')?.value); // technology name
  formData.append('website', this.productAddingForm.get('website')?.value);
  formData.append('fundingStage', this.productAddingForm.get('fundingStage')?.value);
  formData.append('productdescription', this.productAddingForm.get('productdescription')?.value);
  formData.append('documentationlink', this.productAddingForm.get('documentationlink')?.value || '');
  formData.append('productfb', this.productAddingForm.get('productfb')?.value || '');
  formData.append('productlinkedin', this.productAddingForm.get('productlinkedin')?.value || '');
  formData.append('isFeatured', this.productAddingForm.get('isFeatured')?.value ? '1' : '0');
  formData.append('userid', this.userid);
  // 🔹 Arrays
  const appendArray = (key: string, arr: string[]) => {
    arr.forEach((item, i) => formData.append(`${key}[${i}]`, item));
  };

  appendArray('founders', this.productAddingForm.get('founders')?.value || []);
  appendArray('useCases', this.selectedUseCases || []);
  appendArray('baseModels', this.productAddingForm.get('baseModels')?.value || []);
  appendArray('deployments', this.productAddingForm.get('deployments')?.value || []);
  appendArray('mediaPreviews', this.productAddingForm.get('mediaPreviews')?.value.filter((m: string) => m) || []);
  appendArray('repositories', this.productAddingForm.get('repositories')?.value.filter((r: string) => r) || []);

  // 🔹 Product image
  if (this.selectedProductFile) {
    formData.append('productImage', this.selectedProductFile);
  }

  // 🔹 Send to backend
  this.isSubmitting = true;
  this.http.post(this.APIURL + 'insert_product', formData).subscribe({
    next: (response: any) => {
      this.isSubmitting = false;
      if (response.message === 'yes') {
        this.productAddingForm.reset();
        this.selectedUseCases = [];
        this.selectedProductFile = null;
        this.selectedImage = null;
        this.router.navigate(['/home/products-all']);
      } else {
        alert('❌ Failed to create product');
      }
    },
    error: (err) => {
      this.isSubmitting = false;
      console.error('❌ Error creating product:', err);
      alert('Error creating product');
    }
  });
}


 

  sendUpdateRequest(payload: any): void {
    this.http.post(this.APIURL + 'update_product_details', payload).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        if (response.message === 'success') {
          alert('Product updated successfully!');
          this.router.navigate(['/home/products-all']);
        }
      },
      error: err => {
        this.isSubmitting = false;
        console.error('Error updating product:', err);
        alert('Error updating product');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/home/products-all']);
  }
}