import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';

import { ListOrderPage } from '../list-order';
import { DirectionTruckPage } from '../direction-truck';
import { ListHotelPage } from '../list-hotel';

import { StaffService } from '../../app/services/staff';

@IonicPage()
@Component({
	selector: 'page-list-truck',
	templateUrl: 'list-truck.html',
	providers: [StaffService]
})
export class ListTruckPage extends BaseComponent {

    pageName: string = 'Trucks';
    listTruck: Array<any> = [];
	isTransferMode: boolean = false;
	isAcceptLuggageMode: boolean = false;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams, private staffService: StaffService) {
		super(injector);
        this.pageName = navParams.data.pageName;
        this.listTruck = navParams.data.listTruck;
		this.isTransferMode = navParams.data.isTransferMode;
		this.isAcceptLuggageMode = navParams.data.isAcceptLuggageMode;
	}

	ionViewDidLoad() {
		this.log('ionViewDidLoad ListTruckPage');
	}

	goToListHotelPage(truck?: any) {
		let params: any = {
			isTransferMode: this.isTransferMode,
			isAcceptLuggageMode: this.isAcceptLuggageMode,
			truck: truck
		}
		this.navCtrl.push(ListHotelPage, params);
	}

	goToTruckDirection(truck: any) {
		this.staffService.getTruckDetail(truck.id).subscribe(
			res => {
				let params = {
					truck: res
				}
				this.navCtrl.push(DirectionTruckPage, params);
			},
			err => {
				this.showError(err.message);
			}
		);
	}
}
