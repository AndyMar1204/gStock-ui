import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ClientsPageRoutingModule } from './clients-routing.module';
import { ClientsPage } from './clients.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ClientsPageRoutingModule
  ],
  declarations: [ClientsPage]
})
export class ClientsPageModule {}
