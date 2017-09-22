import { Component, Injector, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { AppConstant } from '../../app/app.constant';
import { ChatService } from '../../app/services/chat';

@IonicPage()
@Component({
	selector: 'page-chat-view',
	templateUrl: 'chat-view.html',
    providers: [ChatService]
})
export class ChatViewPage extends BaseComponent {

    room: string;
    chatInput: string;
    partnerName: string;
    @ViewChild('chatView') private chatView: ElementRef;
    @ViewChild('chatTextArea') private chatTextArea: ElementRef;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams, public platform: Platform, private chatService: ChatService) {
		super(injector);
        this.room = this.navParams.data.room;
        this.partnerName = this.navParams.data.partnerName;
        this.subcribeChatEvent();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ChatViewPage');
        this.autoScrollChatView();
	}

    textAreaOnKeyDown(event) {
		switch (event.keyCode) {
			case AppConstant.KEYCODE.ENTER:
                this.sendMessage();
                event.preventDefault();
				break;
			default:
		}
	}

    sendMessage() {
        if (!this.chatInput) {
            return;
        }
        this.chatService.sendMessage(this.room, this.chatInput);
        this.chatInput = '';
        this.autoScrollChatView();
    }

    handleButtonSendMessage(event) {
        this.buttonStopPropagation(event);
        this.sendMessage();
    }

    buttonStopPropagation(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    autoScrollChatView() {
        setTimeout(() => {
            this.scrollChatViewToBottom();
        }, 100);
    }

    scrollChatViewToBottom(): void {
        this.chatView.nativeElement.scrollTop = this.chatView.nativeElement.scrollHeight;
    }

    subcribeChatEvent() {
		this.events.subscribe(AppConstant.EVENT_TOPIC.CHAT_INCOMING_MESSAGE, (data) => {
			if (this.isDestroyed) {
				return;
			}
			this.autoScrollChatView();
		});
	}

    handleMobileKeyboard() {
        this.keyboard.onKeyboardShow().subscribe(() => {
            if (this.isDestroyed) {
				return;
			}
            let height = this.chatView.nativeElement.height;
            this.chatView.nativeElement.height = height - 100;
        });
    }
}
