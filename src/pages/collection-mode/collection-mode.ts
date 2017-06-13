import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { CustomerInfoPage } from '../customer-info';

@IonicPage()
@Component({
	selector: 'page-collection-mode',
	templateUrl: 'collection-mode.html',
})
export class CollectionModePage extends BaseComponent {

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams) {
		super(injector);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CollectionModePage');
	}

	scanUserQRCode() {
        this.scanQRCode(text => {
            // this.showInfo(text, 'Scan result');
			let customerInfo = {
				name: 'Dolly Doe',
				hotel: 'Sheraton',
				address: '20 Nathan Rd, Hong Kong',
				receiver: 'Dolly Doe',
				room: '223'
			}
			this.navCtrl.push(CustomerInfoPage, customerInfo);
        });
	}
}
