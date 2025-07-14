import { Routes } from '@angular/router';
import { Login } from './componentes/login/login';
import { Register } from './componentes/register/register';
import { Products } from './componentes/products/products';
import { ProductForm } from './componentes/product-form/product-form';
import { Admin } from './componentes/admin/admin';
import { authGuard } from './guards/authGuard';
import { adminGuard } from './guards/adminGuard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'products', component: Products, canActivate: [authGuard] },
  { path: 'admin', component: Admin, canActivate: [adminGuard] },
  { path: 'admin/create', component: ProductForm, canActivate: [adminGuard] },
  { path: '**', redirectTo: 'login' }
];
