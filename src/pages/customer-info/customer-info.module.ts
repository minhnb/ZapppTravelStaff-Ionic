import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerInfoPage } from './customer-info';

@NgModule({
  declarations: [
    CustomerInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerInfoPage),
  ],
  exports: [
    CustomerInfoPage
  ]
})
export class CustomerInfoPageModule {}
