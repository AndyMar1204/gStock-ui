import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../pages/dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'inventory',
        loadChildren: () => import('../pages/inventory/inventory.module').then(m => m.InventoryPageModule)
      },
      {
        path: 'new-sale',
        loadChildren: () => import('../pages/new-sale/new-sale.module').then(m => m.NewSalePageModule)
      },
      {
        path: 'invoices',
        loadChildren: () => import('../pages/invoices/invoices.module').then(m => m.InvoicesPageModule)
      },
      {
        path: 'clients',
        loadChildren: () => import('../pages/clients/clients.module').then(m => m.ClientsPageModule)
      },
      {
        path: 'categories',
        loadChildren: () => import('../pages/categories/categories.module').then(m => m.CategoriesPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
