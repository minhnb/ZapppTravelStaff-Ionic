import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { AppConstant } from '../../app/app.constant';
import { CollectionModePage } from '../collection-mode';
import { ListHotelPage } from '../list-hotel';
import { ListStationPage } from '../list-station';

@IonicPage()
@Component({
	selector: 'page-user-start',
	templateUrl: 'user-start.html',
})
export class UserStartPage extends BaseComponent {

	isActive: boolean;
    truck: any;
    listTruck: Array<any> = [
        {
            value: "mz999",
            text: "mz999"
        },
        {
            value: "mz001",
            text: "mz001"
        }
    ];

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams, public platform: Platform) {
		super(injector);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad UserStartPage');
		if (!this.isMobileDevice(this.platform)) {
			return;
		}
		this.checkDevicePermission();
	}

    onStatusChange(event) {
        // console.log(event);
        // console.log(this.isActive);
    }

    onTruckChange(event) {
        // console.log(event);
        // console.log(this.truck);
    }

    goToCollectionMode() {
		switch (this.getUserRole()) {
			case AppConstant.USER_ROLE.DRIVER:
				this.navCtrl.push(ListStationPage);
				break;
			case AppConstant.USER_ROLE.ATTENDANT:
				this.navCtrl.push(CollectionModePage);
				break;
			default:
		}
    }

    goToDeliveryMode() {
		this.navCtrl.push(ListHotelPage);
    }
}
