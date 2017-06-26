import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { DirectionStopPage } from './direction-stop';

@NgModule({
	declarations: [
		DirectionStopPage,
	],
	imports: [
		IonicPageModule.forChild(DirectionStopPage),
		TranslateModule
	],
	exports: [
		DirectionStopPage
	]
})
export class DirectionStopPageModule { }
