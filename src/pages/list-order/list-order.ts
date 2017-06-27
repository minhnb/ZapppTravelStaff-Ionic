import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { CustomerLuggagePage } from '../customer-luggage';
import { DeliveryInfoPage } from '../delivery-info';

@IonicPage()
@Component({
	selector: 'page-list-order',
	templateUrl: 'list-order.html',
})
export class ListOrderPage extends BaseComponent {

    pageName: string = 'Orders';
    listOrder: Array<any> = [];
	isDeliveryMode: boolean = false;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams) {
		super(injector);
		this.pageName = navParams.data.pageName;
		this.listOrder = navParams.data.listOrder;
		this.isDeliveryMode = navParams.data.isDeliveryMode;
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

	goToDeliveryInfo(customer: any) {
		let params = {
            customer: customer
        }
		this.navCtrl.push(DeliveryInfoPage, params);
	}
}
