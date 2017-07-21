import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ListAssignmentPage } from './list-assignment';

@NgModule({
	declarations: [
		ListAssignmentPage,
	],
	imports: [
		IonicPageModule.forChild(ListAssignmentPage),
		TranslateModule
	],
	exports: [
		ListAssignmentPage
	]
})
export class ListAssignmentPageModule { }
