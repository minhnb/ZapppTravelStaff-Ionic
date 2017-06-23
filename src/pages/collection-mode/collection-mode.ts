import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { CustomerInfoPage } from '../customer-info';
import { ListTruckPage } from '../list-truck';

@IonicPage()
@Component({
	selector: 'page-collection-mode',
	templateUrl: 'collection-mode.html',
})
export class CollectionModePage extends BaseComponent {

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams) {
		super(injector);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CollectionModePage');
	}

	scanUserQRCode() {
        this.scanQRCode(text => {
			let customerInfo = {
				name: 'Dolly Doe',
				hotel: 'Sheraton',
				address: '20 Nathan Rd, Hong Kong',
				receiver: 'Dolly Doe',
				room: '223',
				isAttendantSaveMode: false
			}
			this.navCtrl.push(CustomerInfoPage, customerInfo);
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
}
