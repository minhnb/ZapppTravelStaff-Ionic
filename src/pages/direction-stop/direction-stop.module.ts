import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DirectionStopPage } from './direction-stop';

@NgModule({
  declarations: [
    DirectionStopPage,
  ],
  imports: [
    IonicPageModule.forChild(DirectionStopPage),
  ],
  exports: [
    DirectionStopPage
  ]
})
export class DirectionStopPageModule {}
