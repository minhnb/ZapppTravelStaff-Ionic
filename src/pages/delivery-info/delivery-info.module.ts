import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { DeliveryInfoPage } from './delivery-info';

@NgModule({
	declarations: [
		DeliveryInfoPage,
	],
	imports: [
		IonicPageModule.forChild(DeliveryInfoPage),
		TranslateModule
	],
	exports: [
		DeliveryInfoPage
	]
})
export class DeliveryInfoPageModule { }
