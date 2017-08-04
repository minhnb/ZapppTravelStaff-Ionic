import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { CustomerInfoPage } from '../customer-info';
import { ListTruckPage } from '../list-truck';
import { ListOrderPage } from '../list-order';
import { CollectionModeService } from '../../app/services/collection-mode';

@IonicPage()
@Component({
	selector: 'page-collection-mode',
	templateUrl: 'collection-mode.html',
	providers: [CollectionModeService]
})
export class CollectionModePage extends BaseComponent {

	currentTruckId: string;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams,
		private collectionModeService: CollectionModeService) {
		super(injector);
		this.currentTruckId = this.navParams.data.currentTruckId;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CollectionModePage');
	}

	goToCustomerInfoPage(customerInfo: any) {
		this.navCtrl.push(CustomerInfoPage, customerInfo);
	}

	getOrderDetail(orderId: string) {
		this.collectionModeService.getOrderDetail(orderId).subscribe(
			res => {
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
		let params = {
            pageName: 'Orders',
            listOrder: [
                {
                    name: 'Dolly Doe',
                    listLuggage: [
                        {
                            luggageCode: 'ZTL12789',
                            storageBinCode: 'A12'
                        }
                    ]
                },
                {
                    name: 'Jolly Doe',
                    listLuggage: [
                        {
                            luggageCode: 'ZTL12790',
                            storageBinCode: 'A13'
                        }
                    ]
                },
                {
                    name: 'Nanny San',
                    listLuggage: [
                        {
                            luggageCode: 'ZTL12791',
                            storageBinCode: 'A14'
                        }
                    ]
                },
                {
                    name: 'Fancy Lu',
                    listLuggage: [
                        {
                            luggageCode: 'ZTL12792',
                            storageBinCode: 'A15'
                        }
                    ]
                }
            ]
        }
        this.navCtrl.push(ListOrderPage, params);
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
}
