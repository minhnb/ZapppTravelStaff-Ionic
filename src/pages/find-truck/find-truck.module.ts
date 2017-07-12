import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { FindTruckPage } from './find-truck';

@NgModule({
	declarations: [
		FindTruckPage,
	],
	imports: [
		IonicPageModule.forChild(FindTruckPage),
        TranslateModule
	],
	exports: [
		FindTruckPage
	]
})
export class FindTruckPageModule { }
