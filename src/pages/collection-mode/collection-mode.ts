import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { AppConstant } from '../../app/app.constant';

import { CustomerInfoPage } from '../customer-info';
import { ListTruckPage } from '../list-truck';
import { OrderSliderPage } from '../order-slider';

import { CollectionModeService } from '../../app/services/collection-mode';

@IonicPage()
@Component({
	selector: 'page-collection-mode',
	templateUrl: 'collection-mode.html',
	providers: [CollectionModeService]
})
export class CollectionModePage extends BaseComponent {

	currentTruckId: string;
	countTransferItem: number = 0;
	countAcceptItem: number = 0;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams,
		private collectionModeService: CollectionModeService) {
		super(injector);
		this.currentTruckId = this.navParams.data.currentTruckId;
		this.countTransferItem = this.navParams.data.countTransferItem;
		this.countAcceptItem = this.navParams.data.countAcceptItem;
	}

	ionViewDidLoad() {
		this.log('ionViewDidLoad CollectionModePage');
	}

	goToCustomerInfoPage(customerInfo: any) {
		this.navCtrl.push(CustomerInfoPage, customerInfo);
	}

	isZappperRequest(order: any) {
		if (order.status != AppConstant.ORDER_STATUS.NEW && order.status != AppConstant.ORDER_STATUS.ACCEPTED) {
			return false;
		}
		if (order.zappper_info) {
			return true;
		}
		let totalLuggage = Number(order.suit_case) + Number(order.bag) + Number(order.baby_carriage) + Number(order.others);
		if (totalLuggage > 0) {
			return true;
		}
		return false;
	}

	getOrderDetail(orderId: string) {
		this.collectionModeService.getOrderDetail(orderId).subscribe(
			res => {
				if (this.isZappperRequest(res)) {
					this.showError(this.translate.instant('ERROR_ATTENDANT_PICKUP_ZAPPPER_REQUEST'));
					return;
				}
				let customerInfo = this.customerInfoTransform(res);
				if (customerInfo.listLuggage && customerInfo.listLuggage.length > 0) {
					customerInfo.isAttendantSaveMode = true;
				}
				this.goToCustomerInfoPage(customerInfo);
			},
			err => {
				this.showError(err.message);
			}
		);
	}

	getLuggageCodeDetail(luggageCode: string, isAcceptLuggageMode: boolean = false) {
		this.collectionModeService.getLuggageCodeDetail(luggageCode).subscribe(
			res => {
				let customerInfo = this.customerInfoTransform(res);
				customerInfo.isAttendantSaveMode = true;
				customerInfo.isAcceptLuggageMode = isAcceptLuggageMode;
				customerInfo.luggageCode = luggageCode;
				this.goToCustomerInfoPage(customerInfo);
			},
			err => {
				this.showError(err.message);
			}
		);
	}

	scanOrderQRCode() {
        this.scanQRCode(text => {
			if (this.isLuggageCode(text)) {
				this.getLuggageCodeDetail(text);
				return;
			}
			let orderId = this.getOrderIdFromOrderCode(text);
			if (orderId) {
				this.getOrderDetail(orderId);
				return;
			}
			this.showError(this.translate.instant('ERROR_INVALID_CODE_FOR_ORDER_OR_LUGGAGE'));
        });
	}

	acceptLugguageFromZappper() {
		this.scanQRCode(text => {
			this.getLuggageCodeDetail(text, true);
        }, this.translate.instant('PROMPT_BARCODE_SCANNER_LUGGAGE'));
	}
	acceptLugguageFromOtherTruck() {
		this.listOtherTruckNeedToGetOrder((listTruck) => {
			this.goToLisTruckPage(listTruck, true);
		});
	}

	transferToOtherTruck() {
		this.listOtherTruckNeedToTransfer((listTruck) => {
			this.goToLisTruckPage(listTruck);
		});
	}

	viewOrder() {
		this.getListOrderOnCurrentTruck((listOrder) => {
			let params = {
				listOrder: listOrder
			}
			this.navCtrl.push(OrderSliderPage, params);
		});
	}

	listOtherTruckNeedToTransfer(callback?: (listTruck: Array<any>) => void) {
		this.collectionModeService.listOtherTruckNeedToTransfer(this.currentTruckId).subscribe(
			res => {
				if (callback) {
					callback(res);
				}
			},
			err => {
				this.showError(err.message);
			}
		);
	}

	listOtherTruckNeedToGetOrder(callback?: (listTruck: Array<any>) => void) {
		this.collectionModeService.listOtherTruckNeedToGetOrder(this.currentTruckId).subscribe(
			res => {
				if (callback) {
					callback(res);
				}
			},
			err => {
				this.showError(err.message);
			}
		);
	}

	goToLisTruckPage(listTruck: Array<any>, isAcceptLuggageMode: boolean = false) {
		let listTruckTransform = listTruck.map(item => {
			return this.truckTransform(item);
		});
		let pageName = this.translate.instant('TRANSFER_TO_OTHER_TRUCKS');
		if (isAcceptLuggageMode) {
			pageName = this.translate.instant('ACCEPT_LUGGAGE_FROM_OTHER_TRUCKS');
		}
		let params = {
			pageName: pageName,
			listTruck: listTruckTransform,
			isTransferMode: true,
			isAcceptLuggageMode: isAcceptLuggageMode
		}
		this.navCtrl.push(ListTruckPage, params);
	}

	getListOrderOnCurrentTruck(callback?: (listOrder: Array<any>) => void) {
		this.collectionModeService.listOrderOnCurrentTruck().subscribe(
			res => {
				let listOrder = res.map(item => {
					let customer = this.customerInfoTransform(item);
					customer.isAttendantSaveMode = true;
					return customer;
				});
				if (callback) {
					callback(listOrder);
				}
			},
			err => {
				this.showError(err.message);
			}
		);
	}
}
