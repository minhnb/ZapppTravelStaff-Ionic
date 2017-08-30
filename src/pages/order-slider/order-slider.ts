import { Component, Injector, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, Platform } from 'ionic-angular';
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
	isShowingSearchView = false;

	@ViewChild(Slides) slides: Slides;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams, public platform: Platform,
		private staffService: StaffService) {
        super(injector);
		this.listOrder = navParams.data.listOrder;
	}

	ionViewDidLoad() {
		this.log('ionViewDidLoad ListRequestPage');
	}

	goToCustomerLugguagePage(customer) {
		let params: any = {
			customer: customer,
			isAttendantSaveMode: true,
			isFromViewOrderPage: true
		};
		this.navCtrl.push(CustomerLuggagePage, params);
	}

	hideSearchView() {
		this.isShowingSearchView = false;
	}

	showSearchView() {
		this.isShowingSearchView = true;
	}

	clickInput(event) {
		event.stopPropagation();
	}

	getItems(event: any) {
		let value = event.target.value;
		let keyword = this.trimText(value);
		this.listOrder.forEach(item => {
			if (this.isMatchedItem(item, keyword)) {
				item.isNotMatched = false;
			} else {
				item.isNotMatched = true;
			}
		});
	}

	isMatchedItem(item: any, keyword: string): boolean {
		if (!keyword) {
			return true;
		}
		if (this.isMatchedField(item.name, keyword) || this.isMatchedField(item.hotel, keyword) || this.isMatchedField(item.orderId, keyword)) {
			return true;
		}
		return false;
	}

	isMatchedField(field: string, keyword: string): boolean {
		if (!field) {
			return false;
		}
		return field.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
	}

	displayOrderId(orderId: string) {
		if (orderId.length > AppConstant.DISPLAY_ORDER_ID_LENGTH) {
			return orderId.substring(0, AppConstant.DISPLAY_ORDER_ID_LENGTH);
		}
		return orderId;
	}

	selectItem(index: number) {
		this.hideSearchView();
		this.slides.slideTo(index);
	}
}
