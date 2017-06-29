import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { StayTimeCountDownPage } from './stay-time-count-down';

@NgModule({
	declarations: [
		StayTimeCountDownPage,
	],
	imports: [
		IonicPageModule.forChild(StayTimeCountDownPage),
		TranslateModule
	],
	exports: [
		StayTimeCountDownPage
	]
})
export class StayTimeCountDownPageModule { }
