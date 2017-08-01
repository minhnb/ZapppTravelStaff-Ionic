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
				label: this.translate.instant('ORDER_NUMBER'),
				content: this.customer.orderNo
			},
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
        }
	}

    goToCustomerLugguagePage(luggageCode: string) {
		let params: any = {
			customer: this.customer,
			luggageCode: luggageCode,
            isDeliveryMode: true
		};
		this.navCtrl.push(CustomerLuggagePage, params);
	}

	scanLuggageQRCode() {
		this.scanQRCode((text) => {
			this.goToCustomerLugguagePage(text);
		}, this.translate.instant('PROMPT_BARCODE_SCANNER_LUGGAGE'));
	}

}
