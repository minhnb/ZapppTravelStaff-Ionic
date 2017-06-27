import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { CustomerLuggagePage } from '../customer-luggage';

@IonicPage()
@Component({
	selector: 'page-delivery-info',
	templateUrl: 'delivery-info.html',
})
export class DeliveryInfoPage extends BaseComponent {

    customer: any;
	listRow: Array<any>;
    listLuggage: Array<any> = [];

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams) {
		super(injector);
        this.customer = this.navParams.data.customer;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad DeliveryInfoPage');
        this.initCustomerInfo();
	}

    initCustomerInfo() {
		this.listRow = [
			{
				label: this.translate.instant('RECEIVER'),
				content: this.customer.receiver
			},
			{
				label: this.translate.instant('ROOM'),
				content: this.customer.room
			}
		];
        if (this.customer.listLuggage) {
            this.listLuggage = this.customer.listLuggage;
            for (let i = 0; i < 20; i++) {
                this.listLuggage.push({
                    luggageCode: 'ZTL12792',
                    storageBinCode: 'A15'
                })
            }
        }
	}

    goToCustomerLugguagePage() {
		let params: any = {
			customer: this.customer
		};
		this.navCtrl.push(CustomerLuggagePage, params);
	}

}
