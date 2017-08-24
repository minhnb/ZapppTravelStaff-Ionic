import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { CustomerInfoPage } from './customer-info';

@NgModule({
	declarations: [
		CustomerInfoPage,
	],
	imports: [
		IonicPageModule.forChild(CustomerInfoPage),
		TranslateModule
	],
	exports: [
		CustomerInfoPage
	]
})
export class CustomerInfoPageModule { }
