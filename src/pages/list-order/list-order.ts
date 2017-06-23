import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { CustomerLuggagePage } from '../customer-luggage';

@IonicPage()
@Component({
	selector: 'page-list-order',
	templateUrl: 'list-order.html',
})
export class ListOrderPage extends BaseComponent {

    pageName: string = 'Orders';
    listOrder: Array<any> = [];

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams) {
		super(injector);
		this.pageName = navParams.data.pageName;
		this.listOrder = navParams.data.listOrder;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ListOrderPage');
	}

    goToCustomerLugguagePage(customer: any) {
        customer.isAttendantSaveMode = true;
        let params = {
            customer: customer,
            isTransferMode: this.navParams.data.isTransferMode
        }
		this.navCtrl.push(CustomerLuggagePage, params);
	}
}
