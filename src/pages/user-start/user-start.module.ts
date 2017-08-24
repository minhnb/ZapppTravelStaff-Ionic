import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { UserStartPage } from './user-start';

@NgModule({
	declarations: [
		UserStartPage,
	],
	imports: [
		IonicPageModule.forChild(UserStartPage),
		TranslateModule
	],
	exports: [
		UserStartPage
	]
})
export class UserStartPageModule { }
