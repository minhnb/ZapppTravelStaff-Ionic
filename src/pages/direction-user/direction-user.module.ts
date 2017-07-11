import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { DirectionUserPage } from './direction-user';

@NgModule({
	declarations: [
		DirectionUserPage,
	],
	imports: [
		IonicPageModule.forChild(DirectionUserPage),
		TranslateModule
	],
	exports: [
		DirectionUserPage
	]
})
export class DirectionUserPageModule { }
