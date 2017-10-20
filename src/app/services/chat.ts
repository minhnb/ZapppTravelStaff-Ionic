import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Events } from 'ionic-angular';
import { ZapppHttp } from './zapppHttp';

import { AppConfig } from '../app.config';
import { AppConstant } from '../app.constant';
import { DataShare } from '../helper/data.share';

import { TranslateService } from '@ngx-translate/core';
import { Base64 } from 'js-base64';

import * as io from 'socket.io-client';

@Injectable()
export class ChatService {

	constructor(private zapppHttp: ZapppHttp, private dataShare: DataShare, private events: Events, private translate: TranslateService) { }

	socketConnect() {
		if (!this.dataShare.socket) {
			this.log("connecting " + AppConfig.SOCKET_IO_URL);
			this.dataShare.socket = io(AppConfig.SOCKET_IO_URL);
			this.initSocketHandler();
			this.dataShare.needReconnectSocket = true;
			this.dataShare.socketOnConnection = true;
		}
	}

	socketDisconnect() {
		if (this.dataShare.socket) {
			this.log("disconnected " + AppConfig.SOCKET_IO_URL);
			this.dataShare.needReconnectSocket = false;
			this.dataShare.socket.disconnect();
			this.dataShare.socket = null;
		}
	}

	createParams(): any {
		let accessToken = localStorage.getItem(AppConstant.ACCESS_TOKEN);
		let params = {
			authorization: accessToken
		}
		return params;
	}

	socketEmit(key: string, params: any, isResend: boolean = false) {
		if (!isResend) {
			this.dataShare.lastEmit = {
				key: key,
				params: params
			}
		}
		this.log(key);
		this.log(params);
		this.dataShare.socket.emit(key, params);
	}

	handleTokenExpired(res: any) {
		if (res.status && res.status.code > 0) {
			return;
		}
		this.zapppHttp.refreshToken(() => {
			let accessToken = localStorage.getItem(AppConstant.ACCESS_TOKEN);
			this.dataShare.lastEmit.params.authorization = accessToken;
			this.socketEmit(this.dataShare.lastEmit.key, this.dataShare.lastEmit.params, true);
		});
	}

	prepareNewChatRoom(room: string) {
		this.dataShare.currentChatRoom = room;
		this.dataShare.chatContent = [];
	}

	joinRoom(room: string) {
		if (!this.dataShare.socket) {
			return;
		}
		if (this.dataShare.currentChatRoom != room) {
			this.prepareNewChatRoom(room);
		}
		let params: any = this.createParams();
		params.room = room;
		this.socketEmit(AppConstant.SOCKET_EVENT.SUBSCRIBE, params);
	}

	sendMessage(room: string, message: string) {
		if (!this.dataShare.socket) {
			return;
		}
		let params: any = this.createParams();
		params.room = room;
		params.msg = this.encodeMessage(message);
		this.socketEmit(AppConstant.SOCKET_EVENT.SEND_MESSAGE, params);
	}

	initSocketHandler() {
		if (!this.dataShare.socket) {
			return;
		}
		this.dataShare.socket.on(AppConstant.SOCKET_EVENT.CONNECT, res => {
			this.log(AppConstant.SOCKET_EVENT.CONNECT);
			this.log(res);
			this.socketHandleEventConnect();
		});
		this.dataShare.socket.on(AppConstant.SOCKET_EVENT.RECONNECT, res => {
			this.log(AppConstant.SOCKET_EVENT.RECONNECT);
			this.log(res);
			this.socketHandleEventConnect();
		});
		this.dataShare.socket.on(AppConstant.SOCKET_EVENT.DISCONNECT, res => {
			this.log(AppConstant.SOCKET_EVENT.DISCONNECT);
			this.log(res);
			this.socketHandleEventDisconnect();
		});
		this.dataShare.socket.on(AppConstant.SOCKET_EVENT.CONNECT_TIMEOUT, res => {
			this.log(AppConstant.SOCKET_EVENT.CONNECT_TIMEOUT);
			this.log(res);
			this.socketHandleEventDisconnect();
		});
		this.dataShare.socket.on(AppConstant.SOCKET_EVENT.SUBSCRIBE_CALLBACK, res => {
			this.log(AppConstant.SOCKET_EVENT.SUBSCRIBE_CALLBACK);
			this.log(res);
			this.handleTokenExpired(res);
		});
		this.dataShare.socket.on(AppConstant.SOCKET_EVENT.SEND_MESSAGE, res => {
			this.log(AppConstant.SOCKET_EVENT.SEND_MESSAGE);
			this.log(res);
			this.socketHandleReceiveMessage(res);
		});
	}

	socketHandleReceiveMessage(res: any) {
		if (!res.data) {
			return this.handleTokenExpired(res);
		}
		let data = res.data;
		let room = data.room;
		if (this.dataShare.currentChatRoom != room) {
			return;
		}
		let message = this.decodeMessage(data.msg);
		this.addChatMessage(message, this.dataShare.userInfo.id != data.id);
		this.announceIncomingMessage();
	}

	socketHandleEventConnect() {
		if (!this.dataShare.socketOnConnection) {
			this.addWarningMessage(this.translate.instant('WARNING_CHAT_CONNECTED'), true);
		}
		this.dataShare.socketOnConnection = true;
		this.announceChatConnect();
	}

	socketHandleEventDisconnect() {
		if (this.dataShare.needReconnectSocket && this.dataShare.socketOnConnection) {
			this.addWarningMessage(this.translate.instant('WARNING_CHAT_DISCONNECT'), false);
		}
		this.dataShare.socketOnConnection = false;
		if (!this.dataShare.needReconnectSocket) {
			return;
		}
		this.announceChatDisconect();
	}

	addChatMessage(content: string, isReceived: boolean) {
		let chatMessage = {
			content: content,
			isReceived: isReceived
		}
		this.dataShare.chatContent.push(chatMessage);
	}

	addWarningMessage(content: string, isOnline?: boolean) {
		let chatMessage = {
			content: content,
			isWarning: true,
			isOnline: isOnline
		}
		this.dataShare.chatContent.push(chatMessage);
	}

	announceIncomingMessage() {
		this.events.publish(AppConstant.EVENT_TOPIC.CHAT_INCOMING_MESSAGE);
	}

	announceChatConnect() {
		this.events.publish(AppConstant.EVENT_TOPIC.CHAT_CONNECT);
	}

	announceChatDisconect() {
		this.events.publish(AppConstant.EVENT_TOPIC.CHAT_DISCONNECT);
	}

	log(content: any) {
		if (AppConfig.ENV != AppConstant.PRODUCTION_ENVIRONMENT) {
            console.log(JSON.stringify(content));
        }
	}

	encodeMessage(message: string): string {
		return Base64.encode(message);
	}

	decodeMessage(message: string): string {
		return Base64.decode(message);
	}
}
