import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ListStationPage } from './list-station';

@NgModule({
	declarations: [
		ListStationPage,
	],
	imports: [
		IonicPageModule.forChild(ListStationPage),
		TranslateModule
	],
	exports: [
		ListStationPage
	]
})
export class ListStationPageModule { }
