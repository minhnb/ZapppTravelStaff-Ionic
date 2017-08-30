import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { AppConstant } from '../../app/app.constant';

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
	isTransferMode: boolean = false;
	isAcceptLuggageMode: boolean = false;
	deliveryItem: any;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams, private collectionModeService: CollectionModeService) {
		super(injector);
		this.pageName = navParams.data.pageName;
		this.listOrder = navParams.data.listOrder;
		this.isDeliveryMode = navParams.data.isDeliveryMode;
		this.deliveryItem = navParams.data.deliveryItem;
		this.isTransferMode = navParams.data.isTransferMode;
		this.isAcceptLuggageMode = navParams.data.isAcceptLuggageMode;
		this.subcribeDeliveryCompletedEvent();
	}

	ionViewDidLoad() {
		this.log('ionViewDidLoad ListOrderPage');
	}

	subcribeDeliveryCompletedEvent() {
		this.events.subscribe(AppConstant.EVENT_TOPIC.DELIVERY_COMPLETED, (data) => {
			if (this.isDestroyed) {
				return;
			}
			this.handleDeliveryCompletedEvent(data);
		})
	}

	handleDeliveryCompletedEvent(data: any) {
		this.deliveryItem = data.deliveryItem;
		if (this.deliveryItem) {
			this.markDeliveryItemCompleted();
			this.deliveryItem = null;
		}
	}

    goToCustomerLugguagePage(customer: any) {
		this.getOrderDetail(customer.orderId, (customerInfo) => {
			let params = {
				customer: customerInfo,
				isTransferMode: this.isTransferMode,
				isAcceptLuggageMode: this.isAcceptLuggageMode
			}
			this.navCtrl.push(CustomerLuggagePage, params);
		});
	}

	goToDeliveryInfo(customer: any) {
		this.getOrderDetail(customer.orderId, (customerInfo) => {
			let params = {
				customer: customerInfo
			}
			this.navCtrl.push(DeliveryInfoPage, params);
		});
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

	getOrderDetail(orderId: string, callback?: (customerInfo: any) => void) {
		this.collectionModeService.getOrderDetail(orderId).subscribe(
			res => {
				let customerInfo = this.customerInfoTransform(res);
				if (callback) {
					callback(customerInfo);
				}
			},
			err => {
				this.showError(err.message);
			}
		);
	}
}
