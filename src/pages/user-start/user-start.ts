import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { CollectionModePage } from '../collection-mode';

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

    goToCollectionModePage() {
        this.navCtrl.push(CollectionModePage);
    }

    goToDeliveryModePage() {

    }
}
