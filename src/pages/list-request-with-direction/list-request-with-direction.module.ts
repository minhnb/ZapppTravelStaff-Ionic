import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ListRequestWithDirectionPage } from './list-request-with-direction';

@NgModule({
	declarations: [
		ListRequestWithDirectionPage,
	],
	imports: [
		IonicPageModule.forChild(ListRequestWithDirectionPage),
		TranslateModule
	],
	exports: [
		ListRequestWithDirectionPage
	]
})
export class ListRequestWithDirectionPageModule { }
