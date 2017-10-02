import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ChatViewPage } from './chat-view';

@NgModule({
	declarations: [
		ChatViewPage,
	],
	imports: [
		IonicPageModule.forChild(ChatViewPage),
		TranslateModule
	],
	exports: [
		ChatViewPage
	]
})
export class ChatViewPageModule { }
