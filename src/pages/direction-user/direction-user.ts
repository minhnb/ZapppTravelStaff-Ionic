import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GoogleMaps, LatLng } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { AppConstant } from '../../app/app.constant';

import { DirectionPage } from '../direction-stop';
import { CustomerLuggagePage } from '../customer-luggage';
import { CustomerInfoPage } from '../customer-info';
import { ChatViewPage } from '../chat-view';

import { CollectionModeService } from '../../app/services/collection-mode';
import { ChatService } from '../../app/services/chat';

@IonicPage()
@Component({
	selector: 'page-direction-user',
	templateUrl: 'direction-user.html',
	providers: [CollectionModeService, ChatService]
})
export class DirectionUserPage extends DirectionPage {

	customer: any;
	isShowingCancelOrderView: boolean = false;
	cancellationReason: string;

	constructor(public injector: Injector, public navCtrl: NavController, public navParams: NavParams, public googleMaps: GoogleMaps,
		public geolocation: Geolocation, private collectionModeService: CollectionModeService, private chatService: ChatService) {
		super(injector, navCtrl, navParams, googleMaps, geolocation);
		this.customer = this.navParams.data.customer;
		this.subcribeChatEvent();
		this.subcribeEventAppIsPausing();
	}

	ionViewDidLoad() {
		super.ionViewDidLoad();
		this.initChat();
	}

	ionViewWillEnter() {
		super.ionViewWillEnter();
		this.dataShare.disableBackButtonAction();
	}

	ionViewWillUnload() {
		super.ionViewWillUnload();
		this.stopChatting();
	}


	afterLoadMapAndCurrentLocation(currentLocation: LatLng) {
		let customerName = this.customer && this.customer.name ? this.customer.name : '';
		this.drawDirectionFromCurrentLocationToDestination(currentLocation, customerName);
	}

	callCustomer() {
		this.callPhoneNumber(this.customer.phoneNumber);
	}

	scanLuggageQRCode() {
		this.scanQRCode(text => {
            this.goToCustomerLugguagePage(text);
        }, this.translate.instant('PROMPT_BARCODE_SCANNER_LUGGAGE'));
	}

	goToCustomerLugguagePage(luggageCode: string) {
		let params: any = {
			customer: this.customer,
			luggageCode: luggageCode
		};
		this.navCtrl.push(CustomerLuggagePage, params);
	}

	scanOrderQRCode() {
        this.scanQRCode(text => {
			let orderId = this.getOrderIdFromOrderCode(text);
			if (orderId) {
				this.getOrderDetail(orderId);
				return;
			}
			this.showError(this.translate.instant('ERROR_INVALID_ORDER_CODE'));
        }, this.translate.instant('PROMPT_BARCODE_SCANNER_ORDER'));
	}

	getOrderDetail(orderId: string) {
		this.collectionModeService.getOrderDetail(orderId).subscribe(
			res => {
				let customerInfo = this.customerInfoTransform(res);
				if (this.customer.orderId != customerInfo.orderId) {
					this.showError(this.translate.instant('ERROR_ORDER_ID_NOT_MATCH'));
					return;
				}
				this.navCtrl.push(CustomerInfoPage, customerInfo);
			},
			err => {
				this.showError(err.message);
			}
		);
	}

	showCancelOrderView() {
		this.isShowingCancelOrderView = true;
	}

	hideCancelOrderView() {
		this.isShowingCancelOrderView = false;
	}

	cancelOrder() {
		this.hideKeyboard();
		let reason = this.trimText(this.cancellationReason);
		this.collectionModeService.cancelOrder(this.customer.orderId, reason).subscribe(
			res => {
				this.clearLocalCurrentJob();
				this.navCtrl.popToRoot();
			},
			err => {
				this.showError(err.message);
			}
		);
	}

	goToChatViewPage() {
		let params = {
			room: this.customer.orderId,
			partnerName: this.customer.name
		}
		this.navCtrl.push(ChatViewPage, params);
	}

	initChat() {
		this.chatService.socketConnect();
	}

	subcribeChatEvent() {
		this.events.subscribe(AppConstant.EVENT_TOPIC.CHAT_INCOMING_MESSAGE, (data) => {
			if (this.isDestroyed) {
				return;
			}
			this.handleIncomingMessageEvent(data);
		});
		this.events.subscribe(AppConstant.EVENT_TOPIC.CHAT_CONNECT, (data) => {
			if (this.isDestroyed) {
				return;
			}
			this.handleChatConnectEvent(data);
		});
		this.events.subscribe(AppConstant.EVENT_TOPIC.CHAT_DISCONNECT, (data) => {
			if (this.isDestroyed) {
				return;
			}
			this.handleChatDisconnectEvent(data);
		});
	}

	subcribeEventAppIsPausing() {
		this.events.subscribe(AppConstant.EVENT_TOPIC.APP_PAUSING, (data) => {
			if (this.isDestroyed) {
				return;
			}
			this.handleEventAppIsPausing(data);
		});
	}

	handleIncomingMessageEvent(data: any) {
		if (this.isActiveCurrentPage(this.navCtrl)) {
			this.goToChatViewPage();
		}
	}

	handleChatConnectEvent(data: any) {
		this.chatService.joinRoom(this.customer.orderId);
	}

	handleChatDisconnectEvent(data: any) {
		this.chatService.joinRoom(this.customer.orderId);
	}

	handleEventAppIsResuming(data: any) {
		this.initChat();
	}

	handleEventAppIsPausing(data: any) {
		this.stopChatting();
	}

	stopChatting() {
		this.chatService.socketDisconnect();
	}
}
