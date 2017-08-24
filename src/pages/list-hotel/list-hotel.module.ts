import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ListHotelPage } from './list-hotel';

@NgModule({
	declarations: [
		ListHotelPage,
	],
	imports: [
		IonicPageModule.forChild(ListHotelPage),
		TranslateModule
	],
	exports: [
		ListHotelPage
	]
})
export class ListHotelPageModule { }
