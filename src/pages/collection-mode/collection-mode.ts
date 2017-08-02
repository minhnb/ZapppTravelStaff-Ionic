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

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams,
		private collectionModeService: CollectionModeService) {
		super(injector);
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

	getLuggageCodeDetail(luggageCode: string) {
		this.collectionModeService.getLuggageCodeDetail(luggageCode).subscribe(
			res => {
				let customerInfo = this.customerInfoTransform(res);
				customerInfo.isAttendantSaveMode = true;
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
			this.getLuggageCodeDetail(text);
        });
	}
	acceptLugguageFromOtherTruck() {
		let listTruck = [
			{
				name: 'LY123'
			},
			{
				name: 'LY834'
			}
		];
		let params = {
			pageName: this.translate.instant('ACCEPT_LUGGAGE_FROM_OTHER_TRUCKS'),
			listTruck: listTruck
		}
		this.navCtrl.push(ListTruckPage, params);
	}

	transferToOtherTruck() {
		let listTruck = [
			{
				name: 'LY123'
			},
			{
				name: 'LY834'
			}
		];
		let params = {
			pageName: this.translate.instant('TRANSFER_TO_OTHER_TRUCKS'),
			listTruck: listTruck,
			isTransferMode: true
		}
		this.navCtrl.push(ListTruckPage, params);
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
}
