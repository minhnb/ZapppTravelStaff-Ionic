import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CollectionModePage } from './collection-mode';

@NgModule({
  declarations: [
    CollectionModePage,
  ],
  imports: [
    IonicPageModule.forChild(CollectionModePage),
  ],
  exports: [
    CollectionModePage
  ]
})
export class CollectionModePageModule {}
