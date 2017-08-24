import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { UncompletedOrderPage } from './uncompleted-order';

@NgModule({
	declarations: [
		UncompletedOrderPage,
	],
	imports: [
		IonicPageModule.forChild(UncompletedOrderPage),
		TranslateModule
	],
	exports: [
		UncompletedOrderPage
	]
})
export class UncompletedOrderPageModule { }
