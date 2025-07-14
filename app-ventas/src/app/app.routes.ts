import { UserAdminGuard } from './guards/user.admin-guard';
import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { RegisterComponent } from './componentes/register/register.component';
import { ProductsComponent } from './componentes/products/products.component';
import { ProductFormComponent } from './componentes/product-form/product-form.component';
import { AdminComponent } from './componentes/admin/admin.component';
import { AuthGuard } from './guards/auth-guard.guard';
import { AdminGuard } from './guards/admin-guard.guard';
import { CarritoComponent } from './componentes/carrito/carrito.component';
import { PedidosComponent } from './componentes/pedidos/pedidos.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { UserManagementComponent } from './componentes/user-management/user-management.component';
import { OrderManagementComponent } from './componentes/order-management/order-management.component';
import { CategoryManagementComponent } from './componentes/category-management/category-management.component';
import { BrandManagementComponent } from './componentes/brand-management/brand-management.component';
import { ReviewManagementComponent } from './componentes/review-management/review-management.component';


export const routes: Routes = [
  // { path: 'login', component: LoginComponent },
  // { path: 'register', component: RegisterComponent },
  // // { path: 'register-comprador', component: RegisterCompradorComponent },

  // // Rutas para compradores
  // { path: 'products', component: ProductsComponent},
  // { path: 'carrito', component: CarritoComponent, canActivate: [AuthGuard] },
  // { path: 'pedidos', component: PedidosComponent, canActivate: [AuthGuard] },
  // { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },

  // // Rutas para usuarios (mantenimiento)
  // // { path: 'admin/productos', component: AdminProductosComponent, canActivate: [AuthGuard] },
  // { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  // { path: 'admin/productos', component: ProductFormComponent, canActivate: [UserAdminGuard] },
  // { path: 'admin/productos/nuevo', component: ProductFormComponent, canActivate: [AdminGuard] },
  // { path: 'admin/productos/editar/:id', component: ProductFormComponent, canActivate: [UserAdminGuard] },

  // // Rutas exclusivas para administradores
  // { path: 'admin/usuarios', component: UserManagementComponent, canActivate: [AdminGuard] },
  // { path: 'admin/pedidos', component: OrderManagementComponent, canActivate: [AdminGuard] },
  // { path: 'admin/categorias', component: CategoryManagementComponent, canActivate: [AdminGuard] },
  //  { path: 'admin/marcas', component: BrandManagementComponent, canActivate: [AdminGuard] },
  // { path: 'admin/resenas', component: ReviewManagementComponent, canActivate: [AdminGuard] },

  // // { path: 'admin/usuarios', component: AdminUsuariosComponent, canActivate: [AdminGuard] },
  // // { path: 'admin/registro-usuario', component: RegistroUsuarioAdminComponent, canActivate: [AdminGuard] },

  // { path: '', redirectTo: '/products', pathMatch: 'full' },
  // { path: '**', redirectTo: '/products' }
  { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      // Rutas públicas (accesibles por todos, incluyendo visitantes sin token)
      { path: 'products', component: ProductsComponent}, // Ya permitida en backend SecurityConfig
      // Rutas para COMPRADORES (requieren AuthGuard)
      { path: 'carrito', component: CarritoComponent, canActivate: [AuthGuard] },
      { path: 'pedidos', component: PedidosComponent, canActivate: [AuthGuard] },
      { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
      // Rutas para USER y ADMIN (requieren UserAdminGuard)
      // AdminComponent es un panel general, si solo ADMIN debe verlo, usa AdminGuard
      { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] }, // Solo ADMIN
      { path: 'admin/productos', component: AdminComponent, canActivate: [UserAdminGuard] }, // AdminComponent lista productos, USER y ADMIN pueden verla
      { path: 'admin/productos/create', component: ProductFormComponent, canActivate: [AdminGuard] }, // Solo ADMIN puede crear
      { path: 'admin/productos/edit/:id', component: ProductFormComponent, canActivate: [UserAdminGuard] }, // USER y ADMIN pueden editar (si el backend lo permite)
      // Rutas exclusivas para ADMINISTRADORES (requieren AdminGuard)
      { path: 'admin/usuarios', component: UserManagementComponent, canActivate: [AdminGuard] },
      { path: 'admin/pedidos', component: OrderManagementComponent, canActivate: [AdminGuard] },
      { path: 'admin/categorias', component: CategoryManagementComponent, canActivate: [AdminGuard] },
      { path: 'admin/marcas', component: BrandManagementComponent, canActivate: [AdminGuard] },
      { path: 'admin/resenas', component: ReviewManagementComponent, canActivate: [UserAdminGuard] },
      { path: '', redirectTo: '/products', pathMatch: 'full' },
      { path: '**', redirectTo: '/products' }
];
