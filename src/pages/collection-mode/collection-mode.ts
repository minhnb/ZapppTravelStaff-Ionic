import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';

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
            this.showInfo(text, 'Scan result');
        });
	}
}
