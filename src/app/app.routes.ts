import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { LogInComponent } from './auth/log-in/log-in.component';
import { MainDashboardComponent } from './home/main-dashboard.component';
 
import { AuthGuard } from './auth/auth.guard';
import { PageNotFoundComponent } from './auth/page-not-found/page-not-found.component';  
import { UsecaseComponent } from './home/usecase/usecase.component';
import { TechnologyComponent } from './home/technology/technology.component';
import { CategoryComponent } from './home/category/category.component';
import { UsersComponent } from './home/users/users.component';
import { ProductsAllComponent } from './home/products-all/products-all.component';
import { ReviewsAllComponent } from './home/reviews-all/reviews-all.component';
import { AddNewProductComponent } from './home/add-new-product/add-new-product.component';

export const routes: Routes = [
   {
    path: '',
    redirectTo: 'auth/log-in',
    pathMatch: 'full'
  },
  {
    path:'auth',
    component:AuthComponent,
    children:[
      {
        path:'log-in',
        component:LogInComponent
      },
       
        {
        path:'page-not-found',
        component:PageNotFoundComponent
      },

     

      
    ]
  },
  {
    path:'home',
    component:MainDashboardComponent,
    children:[
       
 


      {
        path:'use-case',
        component: UsecaseComponent,
      },

      {
        path:'technology',
        component: TechnologyComponent,
      },

      {
        path:'category',
        component: CategoryComponent,
      },

      
      {
        path:'users',
        component: UsersComponent,
      },

      {
        path:'products-all',
        component: ProductsAllComponent,
      },

       {
        path:'reviews-all',
        component: ReviewsAllComponent,
      },
   
       {
        path:'add-new-product',
        component: AddNewProductComponent,
      },


      {
        path: 'update-product/:productid/:userid',
        component: AddNewProductComponent,
      }

 
   
    ]
  },
  
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'auth/page-not-found',
  },

 
];

