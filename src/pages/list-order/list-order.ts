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
	deliveryItem: any;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams) {
		super(injector);
		this.pageName = navParams.data.pageName;
		this.listOrder = navParams.data.listOrder;
		this.isDeliveryMode = navParams.data.isDeliveryMode;
		this.deliveryItem = navParams.data.deliveryItem;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ListOrderPage');
	}

	ionViewWillEnter() {
		console.log('ionViewWillEnter');
		console.log(JSON.stringify(this.navParams.data));
		if (this.deliveryItem) {
			this.removeDeliveryItem();
			this.deliveryItem = null;
		}
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

	removeDeliveryItem() {
		let index = this.indexOfDeliveryItem(this.deliveryItem.name);
		this.listOrder.splice(index, 1);
	}

	indexOfDeliveryItem(name: string) {
		for (let i = 0; i < this.listOrder.length; i++) {
            if (this.listOrder[i].name == name) {
                return i;
            }
        }
        return -1;
	}
}
