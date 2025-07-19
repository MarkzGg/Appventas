import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { ProductFormComponent } from './componentes/product-form/product-form.component';
import { RegisterComponent } from './componentes/register/register.component';
import { PedidosComponent } from './componentes/pedidos/pedidos.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { AdminComponent } from './componentes/admin/admin.component';


import { UserManagementComponent } from './componentes/user-management/user-management.component';
import { OrderManagementComponent } from './componentes/order-management/order-management.component';
import { CategoryManagementComponent } from './componentes/category-management/category-management.component';


// Agrega aquí todos tus componentes...

@NgModule({
  declarations: [



   


  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpClientModule, // Necesario para las llamadas HTTP
    AppRoutingModule
    // otros módulos como HttpClientModule, RouterModule, etc.
  ],
  providers: [],

})
export class AppModule { }
