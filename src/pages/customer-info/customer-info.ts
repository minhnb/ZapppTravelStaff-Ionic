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
	isAcceptLuggageMode: boolean = false;
	isUpdated: boolean = false;
	luggageCode: string;

	@ViewChild(Navbar) navBar: Navbar;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams) {
		super(injector);
		this.customer = this.navParams.data;
		this.luggageCode = this.customer.luggageCode;
		this.initCustomerInfo();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CustomerInfoPage');
		this.customBackButtonClick();
	}

	ionViewWillEnter() {
		console.log('ionViewWillEnter');
		this.detectCustomerHasLuggage();
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
			this.isUpdated = true;
		}

		if (this.customer.isAttendantSaveMode) {
			this.isAttendantSaveMode = true;
		}
		if (this.customer.isAcceptLuggageMode) {
			this.isAcceptLuggageMode = true;
		}

	}

	detectCustomerHasLuggage() {
		if (this.customer.listLuggage && this.customer.listLuggage.length) {
			this.hasLuggage = true;
		} else {
			this.hasLuggage = false;
		}

	}

	scanLuggageQRCode() {
		this.scanQRCode(text => {
            this.goToCustomerLugguagePage(text);
        }, this.translate.instant('PROMPT_BARCODE_SCANNER_LUGGAGE'));
	}

	goToCustomerLugguagePage(firstLuggageCode?: string) {
		let params: any = {
			customer: this.customer,
			isFromCustomerInfoPage: true,
			isUpdated: this.isUpdated
		};
		if (firstLuggageCode) {
			params.luggageCode = firstLuggageCode;
		}
		if (this.isAcceptLuggageMode) {
			params.isAcceptLuggageMode = true;
		}
		this.navCtrl.push(CustomerLuggagePage, params);
	}

}
