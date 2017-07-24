import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Events } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { AppConstant } from '../../app/app.constant';

import { CollectionModePage } from '../collection-mode';
import { ListHotelPage } from '../list-hotel';
import { ListStationPage } from '../list-station';
import { ListRequestPage } from '../list-request';
import { UncompletedOrderPage } from '../uncompleted-order';
import { DirectionUserPage } from '../direction-user';
import { FindTruckPage } from '../find-truck';
import { ListAssignmentPage } from '../list-assignment';

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

	listRequest: Array<any> = [];
	listUncompleteOrder: Array<any> = [];
	newAssignmentCount: number = 0;
	listAssignment: Array<any> = [];

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams, public platform: Platform,
		private staffService: StaffService, private events: Events) {
		super(injector);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad UserStartPage');
		this.loadPreviousState();
		this.subscribeZappperNewRequestEvent();
		this.subscribeAssignTruckEvent();
		this.loadListTruckForActiveDirverAndAttendant();
		this.loadCurrentJobForActiveZappper();
		this.loadListAssignment();
		if (!this.isMobileDevice(this.platform)) {
			return;
		}
		this.checkDevicePermission();
	}

	ionViewWillEnter() {
		this.loadJobForActiveZappper();
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

	loadNewRequestsAndUncompletedOrders(callback?: () => void) {
		this.staffService.loadNewRequestsAndUncompletedOrders().subscribe(
			res => {
				this.listRequest = res.new_request_info.map(item => {
					return this.requestTransform(item);
				});
				this.listUncompleteOrder = res.uncomplete_job_info.map(item => {
					return this.uncompletedOrderTransform(item);
				});
				if (callback) {
					callback();
				}
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
		if (this.listRequest.length == 0) {
			return;
		}
		let params = {
			listRequest: this.listRequest
		}
		this.navCtrl.push(ListRequestPage, params);
	}

	goToListUncompletedOrder() {
		if (this.listUncompleteOrder.length == 0) {
			return;
		}
		let params = {
			listUncompleteOrder: this.listUncompleteOrder
		}
		this.navCtrl.push(UncompletedOrderPage, params);
	}

	goToFindTruckPage() {
		this.navCtrl.push(FindTruckPage);
	}

	requestTransform(request: any) {
		let fullName = '';
		if (request.user_info) {
			fullName = this.getFullName(request.user_info.first, request.user_info.last)
		}
		let result = {
			name: fullName,
			avatar: request.user_info ? request.user_info.avatar : '',
			suitcase: request.order_info ? request.order_info.suit_case : 0,
			bag: request.order_info ? request.order_info.bag : 0,
			babyCarriage: request.order_info ? request.order_info.baby_carriage : 0,
			other: request.order_info ? request.order_info.others : 0,
			distance: request.distance_info ? request.distance_info.distance : '',
			estimatedTime: request.distance_info ? request.distance_info.time : '',
			phoneNumber: request.user_info ? request.user_info.phone : '',
			lat: request.user_info ? request.user_info.lat : null,
			long: request.user_info ? request.user_info.lng : null,
			orderId: request.order_info ? request.order_info.id : ''
		};
		return result;
	}

	uncompletedOrderTransform(order: any) {
		let result = {
			name: order.guest_name,
			hotel: order.hotel_info,
			accepted: this.timeStampToDateTime(order.accepted_at)
		};
		return result;
	}

	goToUserDirectionPage(customer: any) {
		let params = {
			long: customer.long,
			lat: customer.lat,
			customer: customer
		}
		this.navCtrl.push(DirectionUserPage, params);
	}

	goToListAssignmentPage() {
		this.saveLastViewListAssignment();
		let params = {
			listAssignment: this.listAssignment
		}
		this.navCtrl.push(ListAssignmentPage, params);
		this.newAssignmentCount = 0;
	}

	loadCurrentJobForActiveZappper() {
		if (!this.isZappper()) {
			return;
		}
		if (!this.isActive) {
			return;
		}
		let currentJob = localStorage.getItem(AppConstant.CURRENT_JOB);
		if (!currentJob) {
			return;
		}
		let customer = JSON.parse(currentJob);
		this.goToUserDirectionPage(customer);
	}

	subscribeZappperNewRequestEvent() {
		this.events.subscribe(AppConstant.NOTIFICATION_TYPE.PREFIX + AppConstant.NOTIFICATION_TYPE.REQUEST_ORDER, (data: any) => {
			if (!this.isZappper()) {
				return;
			}
			if (!this.isActiveCurrentPage(this.navCtrl)) {
				return;
			}
			this.loadNewRequestsAndUncompletedOrders(() => {
				this.showConfirm(this.translate.instant('ZAPPPER_ALERT_NEW_REQUEST'), this.translate.instant('ZAPPPER_ALERT_NEW_REQUEST_TITLE'),
					() => {
						this.goToListRequest();
					});
			});

		});
	}

	subscribeAssignTruckEvent() {
		let listTruckAssignEvent = [
			AppConstant.NOTIFICATION_TYPE.ASSIGN_TRUCK_DELIVERY,
			AppConstant.NOTIFICATION_TYPE.ASSIGN_TRUCK_COLLECTION,
			AppConstant.NOTIFICATION_TYPE.ASSIGN_TRUCK_UNASSIGNED
		];
		for (let i = 0; i < listTruckAssignEvent.length; i++) {
			let key = listTruckAssignEvent[i];
			this.events.subscribe(AppConstant.NOTIFICATION_TYPE.PREFIX + key, (data: any) => {
				this.handleAssignTruckEvent();
			});
		}
	}

	handleAssignTruckEvent() {
		if (this.isZappper()) {
			return;
		}
		this.loadListAssignment();
	}

	sortListAssignmentDescByCreatedAt() {
		this.listAssignment.sort((a: any, b: any) => {
			return b.created_at - a.created_at;
		});
	}

	loadListAssignment() {
		this.staffService.loadListAssignment().subscribe(
			res => {
				this.listAssignment = res;
				this.sortListAssignmentDescByCreatedAt();
				this.countNewAssignment();
			},
			err => {
				// this.showError(err.message);
			}
		);
	}

	countNewAssignment() {
		let lastViewAssignmentTimeStamp = this.getLastViewAssignment();
		let newAssignment = this.listAssignment.filter((item) => {
			return Number(item.created_at) >= lastViewAssignmentTimeStamp;
		});
		this.newAssignmentCount = newAssignment.length;
	}

	saveLastViewListAssignment() {
		let currentTimeStamp: number = (new Date()).getTime() / 1000;
		localStorage.setItem(AppConstant.LAST_VIEW_ASSIGNMENT, currentTimeStamp.toString());
	}

	getLastViewAssignment(): number {
		let lastView = localStorage.getItem(AppConstant.LAST_VIEW_ASSIGNMENT);
		if (lastView) {
			return Number(lastView);
		} else {
			return 0;
		}
	}
}
