import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';

import { FindTruckPage } from '../find-truck';
import { ListTruckWithDirectionPage } from '../list-truck-with-direction';

@IonicPage()
@Component({
	selector: 'page-uncompleted-order',
	templateUrl: 'uncompleted-order.html',
})
export class UncompletedOrderPage extends BaseComponent {

    listOrder: Array<any>;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams) {
		super(injector);
		this.listOrder = navParams.data.listUncompleteOrder;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad UncompletedOrderPage');
	}

	goToFindTruckPage() {
		this.navCtrl.push(FindTruckPage);
	}

	goToListTruckWithDirectionPage() {
		this.navCtrl.push(ListTruckWithDirectionPage);
	}
}
