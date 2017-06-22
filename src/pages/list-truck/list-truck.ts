import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';

@IonicPage()
@Component({
	selector: 'page-list-truck',
	templateUrl: 'list-truck.html',
})
export class ListTruckPage extends BaseComponent {

    pageName: string = 'Trucks';
    listTruck: Array<any> = [];

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams) {
		super(injector);
        this.pageName = navParams.data.pageName;
        this.listTruck = navParams.data.listTruck;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ListTruckPage');
	}

}
