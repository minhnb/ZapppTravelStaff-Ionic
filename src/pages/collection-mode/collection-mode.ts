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
			} else {
				this.getOrderDetail(text);
			}
        });
	}

	acceptLugguageFromZappper() {
		this.scanQRCode(text => {
			let customerInfo = {
				name: 'Dolly Doe',
				hotel: 'Sheraton',
				address: '20 Nathan Rd, Hong Kong',
				receiver: 'Dolly Doe',
				room: '223',
				isAttendantSaveMode: true,
				listLuggage: [
					{
						luggageCode: 'ZTL12789',
						storageBinCode: ''
					},
					{
						luggageCode: 'ZTL127890',
						storageBinCode: ''
					}
				]
			}
			this.navCtrl.push(CustomerInfoPage, customerInfo);
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
			pageName: 'Accept luggage from other trucks',
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
			pageName: 'Transfer to other trucks',
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
