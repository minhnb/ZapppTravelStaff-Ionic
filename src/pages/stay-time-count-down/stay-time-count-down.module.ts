import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { TextMaskModule } from 'angular2-text-mask';
import { StayTimeCountDownPage } from './stay-time-count-down';

@NgModule({
	declarations: [
		StayTimeCountDownPage,
	],
	imports: [
		IonicPageModule.forChild(StayTimeCountDownPage),
		TranslateModule,
		TextMaskModule
	],
	exports: [
		StayTimeCountDownPage
	]
})
export class StayTimeCountDownPageModule { }
