import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Events } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { AppConstant } from '../../app/app.constant';
import { CollectionModePage } from '../collection-mode';
import { ListHotelPage } from '../list-hotel';
import { ListStationPage } from '../list-station';
import { ListRequestPage } from '../list-request';
import { UncompletedOrderPage } from '../uncompleted-order';
import { FindTruckPage } from '../find-truck';
import { StaffService } from '../../app/services/staff';

@IonicPage()
@Component({
	selector: 'page-user-start',
	templateUrl: 'user-start.html',
	providers: [StaffService]
})
export class UserStartPage extends BaseComponent {

	isActive: boolean;
    truck: any;
    listTruck: Array<any> = [];

	numberOfRequest: number = 0;
	numberOfCompletedOrder: number = 0;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams, public platform: Platform,
		private staffService: StaffService, private events: Events) {
		super(injector);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad UserStartPage');
		this.loadPreviousState();
		this.loadListTruckForActiveDirverAndAttendant();
		this.loadJobForActiveZappper();
		if (!this.isMobileDevice(this.platform)) {
			return;
		}
		this.checkDevicePermission();
	}

	loadPreviousState() {
		this.loadLocalPreviousState();
	}

	loadLocalPreviousState() {
		let status = localStorage.getItem(AppConstant.STATUS);
		if (status == 'true') {
			this.isActive = true;
			if ((this.isDriver() || this.isAttedant())) {
				this.truck = localStorage.getItem(AppConstant.TRUCK);
			}
		}
	}

	saveStatusToLocalStorage(status: boolean) {
		if (status) {
			localStorage.setItem(AppConstant.STATUS, status.toString());
		} else {
			this.clearStatusInfo();
		}
	}

	saveTruckInfoToLocalStorage(truckId: string) {
		localStorage.setItem(AppConstant.TRUCK, truckId);
	}

	clearStatusInfo() {
		localStorage.removeItem(AppConstant.STATUS);
		localStorage.removeItem(AppConstant.TRUCK);
	}

	loadListTruckForActiveDirverAndAttendant() {
		if (this.isActive && (this.isDriver() || this.isAttedant())) {
			this.getListTruck();
		}
	}

	loadJobForActiveZappper() {
		if (this.isActive && this.isZappper()) {
			this.loadNewRequestsAndUncompletedOrders();
		}
	}

	announceActiveEvent() {
		let params = {
			isActive: this.isActive
		}
		this.events.publish('user:active', params);
	}

    onStatusChange(event) {
		this.staffService.updateStatus(this.isActive).subscribe(
			res => {
				this.saveStatusToLocalStorage(this.isActive);
				this.announceActiveEvent();
				this.loadListTruckForActiveDirverAndAttendant();
				this.loadJobForActiveZappper();
			},
			err => {
				this.isActive = !this.isActive;
				this.showError(err.message);
			}
		);
    }

    onTruckChange(event) {
		this.chooseTruck(this.truck);
    }

	getListTruck() {
		this.staffService.getListTruck().subscribe(
			res => {
				this.listTruck = res;
			},
			err => {
				this.showError(err.message);
			}
		);
	}

	chooseTruck(truckId: string) {
		this.staffService.chooseTruck(truckId).subscribe(
			res => {
				this.saveTruckInfoToLocalStorage(truckId);
			},
			err => {
				this.showError(err.message);
			}
		);
	}

	loadNewRequestsAndUncompletedOrders() {
		this.staffService.loadNewRequestsAndUncompletedOrders().subscribe(
			res => {
				this.numberOfRequest = res.new_request_info.length;
				this.numberOfCompletedOrder = res.uncomplete_job_info.length;
			},
			err => {
				this.showError(err.message);
			}
		);
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

	goToListRequest() {
		this.navCtrl.push(ListRequestPage);
	}

	goToListUncompletedOrder() {
		this.navCtrl.push(UncompletedOrderPage);
	}

	goToFindTruckPage() {
		this.navCtrl.push(FindTruckPage);
	}
}
