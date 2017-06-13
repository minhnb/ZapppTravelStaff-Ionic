import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';

@IonicPage()
@Component({
	selector: 'page-customer-info',
	templateUrl: 'customer-info.html',
})
export class CustomerInfoPage extends BaseComponent {

	customer: any;
	listRow: Array<any>;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams) {
		super(injector);
		this.customer = this.navParams.data;
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

	ionViewDidLoad() {
		console.log('ionViewDidLoad CustomerInfoPage');
	}

	ionViewCanLeave() {
		return this.confirmBeforeLeaveView();
	}

	scanLuggageQRCode() {
		this.scanQRCode(text => {
            this.showInfo(text, 'Scan result');
        });
	}

}
