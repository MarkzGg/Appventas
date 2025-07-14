import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard.guard';
import { AdminGuard } from './guards/admin-guard.guard';
import { CarritoComponent } from './componentes/carrito/carrito.component';
import { ProductsComponent } from './componentes/products/products.component';
import { PedidosComponent } from './componentes/pedidos/pedidos.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { AdminComponent } from './componentes/admin/admin.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegisterComponent } from './componentes/register/register.component';

const routes: Routes = [
  { path: 'productos', component: ProductsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
  { path: 'carrito', component: CarritoComponent, canActivate: [AuthGuard] },
  { path: 'pedidos', component: PedidosComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
