import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ListTruckWithDirectionPage } from './list-truck-with-direction';

@NgModule({
	declarations: [
		ListTruckWithDirectionPage,
	],
	imports: [
		IonicPageModule.forChild(ListTruckWithDirectionPage),
		TranslateModule
	],
	exports: [
		ListTruckWithDirectionPage
	]
})
export class ListTruckWithDirectionPageModule { }
