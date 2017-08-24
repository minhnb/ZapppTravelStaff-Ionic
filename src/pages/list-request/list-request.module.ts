import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ListRequestPage } from './list-request';

@NgModule({
	declarations: [
		ListRequestPage,
	],
	imports: [
		IonicPageModule.forChild(ListRequestPage),
		TranslateModule
	],
	exports: [
		ListRequestPage
	]
})
export class ListRequestPageModule { }
