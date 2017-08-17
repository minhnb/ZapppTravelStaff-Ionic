import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { AppConstant } from '../../app/app.constant';

import { CustomerLuggagePage } from '../customer-luggage';

import { StaffService } from '../../app/services/staff';

@IonicPage()
@Component({
	selector: 'page-order-slider',
	templateUrl: 'order-slider.html',
	providers: [StaffService]
})
export class OrderSliderPage extends BaseComponent {

	listOrder: Array<any> = [];

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams,
		private staffService: StaffService) {
        super(injector);
		this.listOrder = navParams.data.listOrder;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ListRequestPage');
	}

	goToCustomerLugguagePage(customer) {
		let params: any = {
			customer: customer,
			isAttendantSaveMode: true,
			isFromViewOrderPage: true
		};
		this.navCtrl.push(CustomerLuggagePage, params);
	}

	showSearchView() {

	}
}
