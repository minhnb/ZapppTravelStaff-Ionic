import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';

import { CustomerLuggagePage } from '../customer-luggage';
import { DeliveryInfoPage } from '../delivery-info';

import { CollectionModeService } from '../../app/services/collection-mode';

@IonicPage()
@Component({
	selector: 'page-list-order',
	templateUrl: 'list-order.html',
	providers: [CollectionModeService]
})
export class ListOrderPage extends BaseComponent {

    pageName: string = 'Orders';
    listOrder: Array<any> = [];
	isDeliveryMode: boolean = false;
	deliveryItem: any;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams, public events: Events,
		private collectionModeService: CollectionModeService) {
		super(injector);
		this.pageName = navParams.data.pageName;
		this.listOrder = navParams.data.listOrder;
		this.isDeliveryMode = navParams.data.isDeliveryMode;
		this.deliveryItem = navParams.data.deliveryItem;
		this.subcribeDeliveryCompletedEvent();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ListOrderPage');
	}

	subcribeDeliveryCompletedEvent() {
		this.events.subscribe('delivery:completed', (data) => {
			this.deliveryItem = data.deliveryItem;
			if (this.deliveryItem) {
				this.markDeliveryItemCompleted();
				this.deliveryItem = null;
			}
		})
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
		this.collectionModeService.getOrderDetail(customer.orderId).subscribe(
			res => {
				let customerInfo = this.customerInfoTransform(res);
				let params = {
					customer: customerInfo
				}
				this.navCtrl.push(DeliveryInfoPage, params);
			},
			err => {
				this.showError(err.message);
			}
		);
	}

	removeDeliveryItem() {
		let index = this.indexOfDeliveryItem(this.deliveryItem.name);
		this.listOrder.splice(index, 1);
	}

	markDeliveryItemCompleted() {
		let index = this.indexOfDeliveryItem(this.deliveryItem.orderId);
		if (index > -1) {
			let item = this.listOrder[index];
			item.completed = true;
		}
	}

	indexOfDeliveryItem(orderId: string) {
		for (let i = 0; i < this.listOrder.length; i++) {
            if (this.listOrder[i].orderId.toString() == orderId.toString()) {
                return i;
            }
        }
        return -1;
	}
}
