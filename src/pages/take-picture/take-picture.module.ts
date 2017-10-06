import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { QRCodeModule } from 'angular2-qrcode';
import { TakePicturePage } from './take-picture';

@NgModule({
	declarations: [
		TakePicturePage,
	],
	imports: [
		IonicPageModule.forChild(TakePicturePage),
		TranslateModule,
		QRCodeModule
	],
	exports: [
		TakePicturePage
	]
})
export class TakePicturePageModule { }
