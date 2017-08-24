import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { CollectionModePage } from './collection-mode';

@NgModule({
	declarations: [
		CollectionModePage,
	],
	imports: [
		IonicPageModule.forChild(CollectionModePage),
		TranslateModule
	],
	exports: [
		CollectionModePage
	]
})
export class CollectionModePageModule { }
