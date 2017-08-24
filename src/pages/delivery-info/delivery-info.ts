import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { AppConstant } from '../../app/app.constant';

import { CustomerLuggagePage } from '../customer-luggage';
import { ManualInputPage } from '../manual-input';

@IonicPage()
@Component({
	selector: 'page-delivery-info',
	templateUrl: 'delivery-info.html',
})
export class DeliveryInfoPage extends BaseComponent {

    customer: any;
	listRow: Array<any>;
    listLuggage: Array<any> = [];
	currentPageIndex: number = 0;
	isGoingToManualInputPage: boolean = false;


	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams) {
		super(injector);
        this.customer = this.navParams.data.customer;
		this.subcribeManualInputEvent();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad DeliveryInfoPage');
        this.initCustomerInfo();
		this.getCurrentPageIndex();
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

	getCurrentPageIndex() {
		this.currentPageIndex = this.navCtrl.getActive().index;
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

	goToManualInputPage() {
		let params: any = {
			listLuggage: this.listLuggage
		};
		this.navCtrl.push(ManualInputPage, params);
		this.isGoingToManualInputPage = true;
	}

	subcribeManualInputEvent() {
		this.events.subscribe(AppConstant.EVENT_TOPIC.INPUT_MANUAL, (data) => {
			if (this.isDestroyed || !this.isGoingToManualInputPage) {
				return;
			}
			console.log(data);
			this.handleManualInputEvent(data);
		});
	}

	handleManualInputEvent(data: any) {
		this.isGoingToManualInputPage = false;
		this.goToCustomerLugguagePage(data.input);
		setTimeout(() => {
			this.removeManualInputPage();
		}, 100);
	}

	removeManualInputPage() {
		let manualPageIndex = this.currentPageIndex + 1;
		this.navCtrl.remove(manualPageIndex);
	}
}
