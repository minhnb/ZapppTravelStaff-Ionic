import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ListOrderPage } from './list-order';

@NgModule({
	declarations: [
		ListOrderPage,
	],
	imports: [
		IonicPageModule.forChild(ListOrderPage),
		TranslateModule
	],
	exports: [
		ListOrderPage
	]
})
export class ListOrderPageModule { }
