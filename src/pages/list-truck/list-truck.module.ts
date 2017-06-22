import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListTruckPage } from './list-truck';

@NgModule({
  declarations: [
    ListTruckPage,
  ],
  imports: [
    IonicPageModule.forChild(ListTruckPage),
  ],
  exports: [
    ListTruckPage
  ]
})
export class ListTruckPageModule {}
