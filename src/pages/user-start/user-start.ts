import { Component, Injector, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { AppConstant } from '../../app/app.constant';

import { CollectionModePage } from '../collection-mode';
import { ListHotelPage } from '../list-hotel';
import { ListStationPage } from '../list-station';
import { ListRequestPage } from '../list-request';
import { ListRequestWithDirectionPage } from '../list-request-with-direction';
import { UncompletedOrderPage } from '../uncompleted-order';
import { DirectionUserPage } from '../direction-user';
import { FindTruckPage } from '../find-truck';
import { ListTruckWithDirectionPage } from '../list-truck-with-direction';
import { ListTruckPage } from '../list-truck';
import { ListAssignmentPage } from '../list-assignment';
import { LoginPage } from '../login/login';
import { TakePicturePage } from '../take-picture';

import { StaffService } from '../../app/services/staff';
import { CollectionModeService } from '../../app/services/collection-mode';
import { UserService } from '../../app/services/user';

@IonicPage()
@Component({
	selector: 'page-user-start',
	templateUrl: 'user-start.html',
	providers: [StaffService, CollectionModeService, UserService]
})
export class UserStartPage extends BaseComponent {

	isActive: boolean;
    truck: any;
    listTruck: Array<any> = [];
	isLoadedState: boolean = false;
	userId: string;

	listRequest: Array<any> = [];
	listUncompleteOrder: Array<any> = [];
	newAssignmentCount: number = 0;
	listAssignment: Array<any> = [];
	lastLoadListZappperRequest: number = 0;

	countDeliveryItem: number = 0;
	countTransferItem: number = 0;
	countAcceptItem: number = 0;

	isAssignedCollection: boolean = false;
	isAssignedDelivery: boolean = false;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public zone: NgZone,
		private staffService: StaffService, private collectionModeService: CollectionModeService, private userService: UserService) {
		super(injector);
		this.subscribeZappperNewRequestEvent();
		this.subscribeAssignTruckEvent();
		this.subscribeEventFirstUpdateCurrentLocation();
		this.loadPreviousState();
	}

	ionViewDidLoad() {
		this.log('ionViewDidLoad UserStartPage');
	}

	ionViewWillEnter() {
		if (this.isLoadedState) {
			this.loadStaffStatistic();
			return;
		}
		if (!this.isMobileDevice(this.platform)) {
			return;
		}
		this.checkDevicePermission();
	}

	handleEventAppIsResuming() {
		if (this.isActiveCurrentPage(this.navCtrl)) {
			this.loadStaffStatistic();
		}
	}

	loadPreviousState() {
		this.getUserInfo(() => {
			this.loadLocalPreviousState();
			this.loadListTruckForActiveDirverAndAttendant();
			this.loadCurrentJobForActiveStaff();
			this.loadStaffStatistic();
		});
	}

	loadLocalPreviousState() {
		let status = localStorage.getItem(AppConstant.STATUS);
		if (status == 'true') {
			this.isActive = true;
			if ((this.isDriver() || this.isAttedant())) {
				this.truck = localStorage.getItem(AppConstant.TRUCK);
			}
		}
		this.announceActiveEvent();
	}

	saveStatusToLocalStorage(status: boolean) {
		if (status) {
			localStorage.setItem(AppConstant.STATUS, status.toString());
		} else {
			this.clearStatusInfo();
		}
	}

	saveTruckInfoToLocalStorage(truckId: string, listBin: Array<any>) {
		localStorage.setItem(AppConstant.TRUCK, truckId);
		let listTransformedBin = this.listBinTransform(listBin);
		localStorage.setItem(AppConstant.LIST_BIN, JSON.stringify(listTransformedBin));
	}

	clearStatusInfo() {
		localStorage.removeItem(AppConstant.STATUS);
		localStorage.removeItem(AppConstant.TRUCK);
	}

	loadStaffStatistic() {
		this.loadJobForActiveZappper();
		this.loadListAssignment();
	}

	loadListTruckForActiveDirverAndAttendant() {
		if (this.isActive && (this.isDriver() || this.isAttedant())) {
			this.getListTruck();
		}
	}

	loadJobForActiveZappper() {
		if (this.isActive && this.isZappper() && this.dataShare.isUpdatedCurrentLocation) {
			this.loadNewRequestsAndUncompletedOrders();
		}
	}

	announceActiveEvent() {
		let params = {
			isActive: this.isActive
		}
		this.events.publish(AppConstant.EVENT_TOPIC.USER_ACTIVE, params);
	}

	resetInfoForDriverAndAttendant() {
		this.truck = null;
		this.listAssignment = [];
		this.countNewAssignment();
	}

    onStatusChange(event) {
		this.staffService.updateStatus(this.isActive).subscribe(
			res => {
				this.saveStatusToLocalStorage(this.isActive);
				if (!this.isActive) {
					this.resetInfoForDriverAndAttendant();
					this.resetCountOrder();
				}
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
				this.saveTruckInfoToLocalStorage(truckId, res.bins);
				this.loadListAssignment();
			},
			err => {
				this.showError(err.message);
			}
		);
	}

	isNeedToLoadZappperRequest(): boolean {
		let nowTimeStamp = (new Date()).getTime();
		return (nowTimeStamp - this.lastLoadListZappperRequest) / 1000 > 2;
	}

	loadNewRequestsAndUncompletedOrders(callback?: () => void) {
		if (!this.isNeedToLoadZappperRequest()) {
			if (callback) {
				callback();
			}
			return;
		}
		this.staffService.loadNewRequestsAndUncompletedOrders().subscribe(
			res => {
				this.zone.run(() => {
					this.lastLoadListZappperRequest = (new Date()).getTime();
					this.listRequest = res.new_request_info.map(item => {
						return this.requestTransform(item);
					});
					this.listUncompleteOrder = res.uncomplete_job_info.map(item => {
						return this.uncompletedOrderTransform(item);
					});
					if (callback) {
						callback();
					}
				});
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
				let params = {
					currentTruckId: this.truck,
					countTransferItem: this.countTransferItem,
					countAcceptItem: this.countAcceptItem,
				}
				this.navCtrl.push(CollectionModePage, params);
				break;
			default:
		}
    }

    attendantGoToDeliveryMode() {
		this.navCtrl.push(ListHotelPage);
    }

    driverGoToDeliveryMode() {
		this.listOtherTruckNeedToGetOrder((listTruck) => {
			if (listTruck.length == 0) {
				this.navCtrl.push(ListHotelPage);
				return;
			}
			this.goToLisTruckPage(listTruck, true);
		});
    }

    driverGoToTransferMode() {
		this.listOtherTruckNeedToTransfer((listTruck) => {
			this.goToLisTruckPage(listTruck);
		});
    }

	goToLisTruckPage(listTruck: Array<any>, isAcceptLuggageMode: boolean = false) {
		let listTruckTransform = listTruck.map(item => {
			return this.truckTransform(item);
		});
		let pageName = this.translate.instant('TRANSFER_TO_OTHER_TRUCKS');
		if (isAcceptLuggageMode) {
			pageName = this.translate.instant('ACCEPT_LUGGAGE_FROM_OTHER_TRUCKS');
		}
		let params = {
			pageName: pageName,
			listTruck: listTruckTransform,
			isTransferMode: true,
			isAcceptLuggageMode: isAcceptLuggageMode
		}
		this.navCtrl.push(ListTruckPage, params);
	}

	goToListRequest() {
		this.loadNewRequestsAndUncompletedOrders(() => {
			if (this.listRequest.length == 0) {
				return;
			}
			let params = {
				listRequest: this.listRequest
			}
			this.navCtrl.push(ListRequestWithDirectionPage, params);
		});
	}

	goToListUncompletedOrder() {
		this.loadNewRequestsAndUncompletedOrders(() => {
			if (this.listUncompleteOrder.length == 0) {
				return;
			}
			let params = {
				listUncompleteOrder: this.listUncompleteOrder
			}
			this.navCtrl.push(UncompletedOrderPage, params);
		});
	}

	goToFindTruckPage() {
		this.navCtrl.push(FindTruckPage);
	}

	goToListTruckWithDirectionPage() {
		this.navCtrl.push(ListTruckWithDirectionPage);
	}

	requestTransform(request: any) {
		let fullName = '';
		if (request.user_info) {
			fullName = this.getFullName(request.user_info.first, request.user_info.last)
		}
		let result = {
			name: fullName,
			avatar: request.user_info ? request.user_info.pic_url : '',
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
			orderId: order.id,
			receiver: order.guest_name,
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

	goToTakePicturePage(customer: any) {
		let params = {
			customer: customer
		}
		this.navCtrl.push(TakePicturePage, params);
	}

	goToListAssignmentPage() {
		this.saveLastViewListAssignment();
		let params = {
			listAssignment: this.listAssignment
		}
		this.navCtrl.push(ListAssignmentPage, params);
	}

	isValidOrderForZappperToContinueCurrentJob(order: any) {
		if (order.status != AppConstant.ORDER_STATUS.ACCEPTED || order.zappper_id != this.userId) {
			return false;
		}
		return true;
	}

	isValidOrderForAttendantToContinueCurrentJob(order: any) {
		if (order.status != AppConstant.ORDER_STATUS.ACCEPTED && order.status != AppConstant.ORDER_STATUS.NEW) {
			return false;
		}
		return true;
	}

	loadCurrentJobForActiveStaff() {
		if (!this.isActive) {
			return;
		}
		let currentJob = localStorage.getItem(AppConstant.CURRENT_JOB);
		if (!currentJob) {
			return;
		}
		let customer = JSON.parse(currentJob);
		this.collectionModeService.getOrderDetail(customer.orderId).subscribe(
			res => {
				if (this.isAttedant() && !this.isValidOrderForAttendantToContinueCurrentJob(res)) {
					return;
				}
				if (this.isZappper() && !this.isValidOrderForZappperToContinueCurrentJob(res)) {
					return;
				}
				let userRequest = this.customerInfoTransform(res);
				if (userRequest.listLuggage && userRequest.listLuggage.length > 0) {
					this.goToTakePicturePage(userRequest);
					return;
				}
				if (this.isZappper()) {
					this.goToUserDirectionPage(customer);
				}
			},
			err => {

			}
		);
	}

	subscribeZappperNewRequestEvent() {
		this.events.subscribe(AppConstant.NOTIFICATION_TYPE.PREFIX + AppConstant.NOTIFICATION_TYPE.REQUEST_ORDER, (data: any) => {
			if (this.isDestroyed) {
				return;
			}
			this.handleZappperNewRequest(data);
		});
		this.events.subscribe(AppConstant.BACKGROUND_NOTIFICATION_TYPE.PREFIX + AppConstant.BACKGROUND_NOTIFICATION_TYPE.REQUEST_ORDER, (data: any) => {
			if (this.isDestroyed) {
				return;
			}
			this.handleZappperNewBackgroundRequest(data);
		});
	}

	subscribeEventFirstUpdateCurrentLocation() {
		this.events.subscribe(AppConstant.EVENT_TOPIC.CURRENT_LOCATION_FIRST_UPDATE, (data: any) => {
			this.loadJobForActiveZappper();
		});
	}

	getDisplayOrderId(data: any) {
		let displayOrderId = data.order_id;
		let displayOrderLength = 6;
		if (displayOrderId && displayOrderId.length > displayOrderLength) {
			return data.order_id.substring(0, displayOrderLength);
		}
		return displayOrderId;
	}

	handleZappperNewRequest(data: any) {
		if (!this.isZappper()) {
			return;
		}
		let displayOrderId = this.getDisplayOrderId(data);
		this.loadNewRequestsAndUncompletedOrders(() => {
			this.showBottomCustomToast(this.translate.instant('ZAPPPER_ALERT_NEW_REQUEST', { orderId: displayOrderId }), () => {
				if (!this.isActiveCurrentPage(this.navCtrl)) {
					this.navCtrl.popToRoot();
				} else {
					this.goToListRequest();
				}
			});
		});
	}

	handleZappperNewBackgroundRequest(data: any) {
		if (!this.isZappper()) {
			return;
		}
		if (!this.isActiveCurrentPage(this.navCtrl)) {
			return;
		}
		this.goToListRequest();
	}


	subscribeAssignTruckEvent() {
		let listTruckAssignEvent = [
			AppConstant.NOTIFICATION_TYPE.ASSIGN_TRUCK_DELIVERY,
			AppConstant.NOTIFICATION_TYPE.ASSIGN_TRUCK_COLLECTION,
			AppConstant.NOTIFICATION_TYPE.ASSIGN_TRUCK_UNASSIGNED,
			AppConstant.NOTIFICATION_TYPE.ASSIGN_TRUCK_TRANSFER
		];
		for (let i = 0; i < listTruckAssignEvent.length; i++) {
			let key = listTruckAssignEvent[i];
			this.events.subscribe(AppConstant.NOTIFICATION_TYPE.PREFIX + key, (data: any) => {
				if (this.isDestroyed) {
					return;
				}
				this.handleAssignTruckEvent(key, data);
			});
		}
	}

	handleAssignTruckEvent(key: string, data: any) {
		if (this.isZappper()) {
			return;
		}
		this.loadListAssignment(() => {
			let title = this.translate.instant('NOTIFICATION_ASSIGN_TITLE');
			let message = this.getNotificationAssignMessage(key, data);
			this.showInfo(message, title);
		});
	}

	getNotificationAssignMessage(key: string, data: any): string {
		switch (key) {
			case AppConstant.NOTIFICATION_TYPE.ASSIGN_TRUCK_DELIVERY:
				return this.translate.instant('NOTIFICATION_ASSIGN_DELIVERY');
			case AppConstant.NOTIFICATION_TYPE.ASSIGN_TRUCK_COLLECTION:
				return this.translate.instant('NOTIFICATION_ASSIGN_COLLECTION', { district: data.content });
			case AppConstant.NOTIFICATION_TYPE.ASSIGN_TRUCK_TRANSFER:
				return this.translate.instant('NOTIFICATION_ASSIGN_TRANSFER', { number: data.no_of_orders });
			default:
				return this.translate.instant('NOTIFICATION_ASSIGN_UNASSIGNED');
		}
	}

	sortListAssignmentDescByCreatedAt() {
		this.listAssignment.sort((a: any, b: any) => {
			return b.created_at - a.created_at;
		});
	}

	loadListAssignment(callback?: () => void) {
		if (this.isZappper() || !this.isActive) {
			return;
		}
		this.staffService.loadListAssignment(false).subscribe(
			res => {
				this.listAssignment = res;
				this.sortListAssignmentDescByCreatedAt();
				this.detectCurrentAssigmentMode();
				this.countNewAssignment();
				this.countOrderByMode();
				if (callback) {
					callback();
				}
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
			let startOfToday = new Date();
			startOfToday.setHours(0, 0, 0, 0);
			return startOfToday.getTime() / 1000;
		}
	}

	detectCurrentAssigmentMode() {
		this.isAssignedCollection = false;
		this.isAssignedDelivery = false;
		if (this.listAssignment.length == 0) {
			return;
		}
		let lastAssignmentItem = this.listAssignment[0];
		if (lastAssignmentItem) {
			let type = Number(lastAssignmentItem.type);
			this.isAssignedCollection = type == AppConstant.ASSIGNMENT_MODE.COLLECTION;
			this.isAssignedDelivery = type == AppConstant.ASSIGNMENT_MODE.DELIVERY;
		}
	}

	resetCountOrder() {
		this.countDeliveryItem = 0;
		this.countTransferItem = 0;
	}

	countOrderByMode() {
		if (this.isZappper() || !this.truck || !this.isActive) {
			this.resetCountOrder();
			return;
		}
		this.staffService.countOrderByMode(this.truck, false).subscribe(
			res => {
				this.countDeliveryItem = res.no_of_delivery ? Number(res.no_of_delivery) : 0;
				this.countTransferItem = res.no_of_transfer ? Number(res.no_of_transfer) : 0;
				this.countAcceptItem = res.no_of_acceptance ? Number(res.no_of_acceptance) : 0;
			},
			err => {
				this.showError(err.message);
			}
		);
	}

	listOtherTruckNeedToTransfer(callback?: (listTruck: Array<any>) => void) {
		if (!this.truck) {
			return;
		}
		this.collectionModeService.listOtherTruckNeedToTransfer(this.truck).subscribe(
			res => {
				if (callback) {
					callback(res);
				}
			},
			err => {
				this.showError(err.message);
			}
		);
	}

	listOtherTruckNeedToGetOrder(callback?: (listTruck: Array<any>) => void) {
		if (!this.truck) {
			return;
		}
		this.collectionModeService.listOtherTruckNeedToGetOrder(this.truck).subscribe(
			res => {
				if (callback) {
					callback(res);
				}
			},
			err => {
				if (callback) {
					callback([]);
				}
			}
		);
	}

	getUserInfo(callback?: () => void) {
		this.userService.getUserInfo().subscribe(
			res => {
				this.userService.saveUserRole(res.roles);
				if (this.isDriver() || this.isAttedant() || this.isZappper()) {
					this.dataShare.setUserInfo(this.userInfoTransform(res));
					this.saveLocalStaffState(res);
					this.isLoadedState = true;
					this.userId = res.id;
					if (callback) {
						callback();
					}
				} else {
					this.showError(this.translate.instant('USER_NOT_STAFF'));
					this.handleInvalidStaff(res);
				}
			},
			err => {
				this.isLoadedState = true;
				if (err.code != -1) {
					this.showError(err.message);
					return;
				}
				this.handleInvalidStaff(err);
			}
		)
	}

	userInfoTransform(userInfo: any) {
		return {
			name: this.getFullName(userInfo.first, userInfo.last),
			email: userInfo.email,
			avatar: userInfo.pic_url,
			role: userInfo.roles
		}
	}

	handleInvalidStaff(info: any) {
		this.userService.handleLogout(info);
		this.events.publish(AppConstant.EVENT_TOPIC.USER_INVALID);
	}
}
