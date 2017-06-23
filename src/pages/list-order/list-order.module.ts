import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListOrderPage } from './list-order';

@NgModule({
  declarations: [
    ListOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(ListOrderPage),
  ],
  exports: [
    ListOrderPage
  ]
})
export class ListOrderPageModule {}
