import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { ListOrderPage } from '../list-order';

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

    goToTruckOrderPage(truck: any) {
        let params = {
            pageName: truck.name,
            listOrder: [
                {
                    name: 'Dolly Doe',
                    listLuggage: [
                        {
                            luggageCode: 'ZTL12789',
                            storageBinCode: 'A12'
                        }
                    ]
                },
                {
                    name: 'Jolly Doe',
                    listLuggage: [
                        {
                            luggageCode: 'ZTL12790',
                            storageBinCode: 'A13'
                        }
                    ]
                },
                {
                    name: 'Nanny San',
                    listLuggage: [
                        {
                            luggageCode: 'ZTL12791',
                            storageBinCode: 'A14'
                        }
                    ]
                },
                {
                    name: 'Fancy Lu',
                    listLuggage: [
                        {
                            luggageCode: 'ZTL12792',
                            storageBinCode: 'A15'
                        }
                    ]
                }
            ],
            isTransferMode: this.navParams.data.isTransferMode
        }
        this.navCtrl.push(ListOrderPage, params);
    }
}