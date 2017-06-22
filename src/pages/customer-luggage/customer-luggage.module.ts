import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerLuggagePage } from './customer-luggage';

@NgModule({
  declarations: [
    CustomerLuggagePage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerLuggagePage),
  ],
  exports: [
    CustomerLuggagePage
  ]
})
export class CustomerLuggagePageModule {}
