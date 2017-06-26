import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ListTruckPage } from './list-truck';

@NgModule({
	declarations: [
		ListTruckPage,
	],
	imports: [
		IonicPageModule.forChild(ListTruckPage),
		TranslateModule
	],
	exports: [
		ListTruckPage
	]
})
export class ListTruckPageModule { }
