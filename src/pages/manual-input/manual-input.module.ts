import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManualInputPage } from './manual-input';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	declarations: [
		ManualInputPage,
	],
	imports: [
		IonicPageModule.forChild(ManualInputPage),
		TranslateModule
	],
	exports: [
		ManualInputPage
	]
})
export class ManualInputPageModule { }
