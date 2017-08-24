import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { DirectionTruckPage } from './direction-truck';

@NgModule({
	declarations: [
		DirectionTruckPage,
	],
	imports: [
		IonicPageModule.forChild(DirectionTruckPage),
		TranslateModule
	],
	exports: [
		DirectionTruckPage
	]
})
export class DirectionTruckPageModule { }
