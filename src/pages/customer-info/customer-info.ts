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

	@ViewChild(Navbar) navBar: Navbar;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams) {
		super(injector);
		this.customer = this.navParams.data;
		this.initCustomerInfo();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CustomerInfoPage');
		this.customBackButtonClick();
	}

	ionViewWillEnter() {
		console.log('ionViewWillEnter');
		console.log(JSON.stringify(this.customer));
		if (this.customer && this.customer.listLuggage && this.customer.listLuggage.length) {
			this.hasLuggage = true;
		} else {
			this.hasLuggage = false;
		}
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
				label: 'Hotel',
				content: this.customer.hotel
			},
			{
				label: 'Address',
				content: this.customer.address
			},
			{
				label: 'Receiver',
				content: this.customer.receiver
			},
			{
				label: 'Room',
				content: this.customer.room
			}
		]
	}

	scanLuggageQRCode() {
		this.scanQRCode(text => {
            this.goToCustomerLugguagePage(text);
        });
	}

	goToCustomerLugguagePage(firstLuggageCode?: string) {
		let params: any = {
			customer: this.customer
		};
		if (firstLuggageCode) {
			params.luggageCode = firstLuggageCode;
		}
		this.navCtrl.push(CustomerLuggagePage, params);
	}

}
