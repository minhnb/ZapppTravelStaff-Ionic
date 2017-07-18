import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { FindTruckPage } from '../find-truck';

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
        // this.listOrder = [
        //     {
		// 		name: 'Dolly Doe',
		// 		hotel: {
        //             name: 'The Sheration',
        //             address: '20 Nathan Rd, Tsim Sha Tsui, Hong Kong'
        //         },
        //         accepted: '2017/06/16 3:35PM'
		// 	},
        //     {
		// 		name: 'Dolly Joe',
		// 		hotel: {
        //             name: 'The Sheration',
        //             address: '20 Nathan Rd, Tsim Sha Tsui, Hong Kong'
        //         },
        //         accepted: '2017/06/16 3:45PM'
		// 	},
        //     {
		// 		name: 'Jolly Doe',
		// 		hotel: {
        //             name: 'The Sheration',
        //             address: '20 Nathan Rd, Tsim Sha Tsui, Hong Kong'
        //         },
        //         accepted: '2017/06/16 3:55PM'
		// 	}
        // ]
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad UncompletedOrderPage');
	}

	goToFindTruckPage() {
		this.navCtrl.push(FindTruckPage);
	}
}
