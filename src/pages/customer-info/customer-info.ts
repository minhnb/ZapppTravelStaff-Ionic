import { Component, Injector, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { CustomerLuggagePage } from '../customer-luggage';

@IonicPage()
@Component({
	selector: 'page-customer-info',
	templateUrl: 'customer-info.html',
})
export class CustomerInfoPage extends BaseComponent {

	customer: any;
	listRow: Array<any>;
	hasLuggage: boolean = false;
	isAttendantSaveMode: boolean = false;
	luggageCode: string;

	@ViewChild(Navbar) navBar: Navbar;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams) {
		super(injector);
		this.customer = this.navParams.data;
		this.luggageCode = this.customer.luggageCode;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CustomerInfoPage');
		this.customBackButtonClick();
	}

	ionViewWillEnter() {
		console.log('ionViewWillEnter');
		this.initCustomerInfo();
	}

	customBackButtonClick() {
		this.navBar.backButtonClick = (e: UIEvent) => {
			this.confirmBeforeLeaveView().then(() => {
				this.navCtrl.pop();
			}).catch(() => {

			});
		};
	}

	initCustomerInfo() {
		this.listRow = [
			{
				label: this.translate.instant('ORDER_NUMBER'),
				content: this.customer.orderNo
			},
			{
				label: this.translate.instant('HOTEL'),
				content: this.customer.hotel
			},
			{
				label: this.translate.instant('ADDRESS'),
				content: this.customer.address
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

		if (this.customer.listLuggage && this.customer.listLuggage.length) {
			this.hasLuggage = true;
		} else {
			this.hasLuggage = false;
		}

		if (this.customer.isAttendantSaveMode) {
			this.isAttendantSaveMode = true;
		}

	}

	scanLuggageQRCode() {
		this.scanQRCode(text => {
            this.goToCustomerLugguagePage(text);
        });
	}

	goToCustomerLugguagePage(firstLuggageCode?: string) {
		let params: any = {
			customer: this.customer,
			isFromCustomerInfoPage: true
		};
		if (firstLuggageCode) {
			params.luggageCode = firstLuggageCode;
		}
		this.navCtrl.push(CustomerLuggagePage, params);
	}

}
