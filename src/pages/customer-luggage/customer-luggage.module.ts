import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { CustomerLuggagePage } from './customer-luggage';

@NgModule({
	declarations: [
		CustomerLuggagePage,
	],
	imports: [
		IonicPageModule.forChild(CustomerLuggagePage),
		TranslateModule
	],
	exports: [
		CustomerLuggagePage
	]
})
export class CustomerLuggagePageModule { }
