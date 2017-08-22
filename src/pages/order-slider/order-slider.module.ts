import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { OrderSliderPage } from './order-slider';

@NgModule({
	declarations: [
		OrderSliderPage,
	],
	imports: [
		IonicPageModule.forChild(OrderSliderPage),
		TranslateModule
	],
	exports: [
		OrderSliderPage
	]
})
export class OrderSliderPageModule { }
