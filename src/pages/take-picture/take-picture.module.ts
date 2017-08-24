import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { TakePicturePage } from './take-picture';

@NgModule({
	declarations: [
		TakePicturePage,
	],
	imports: [
		IonicPageModule.forChild(TakePicturePage),
		TranslateModule
	],
	exports: [
		TakePicturePage
	]
})
export class TakePicturePageModule { }
