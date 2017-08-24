import { Component, Injector, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { AppConstant } from '../../app/app.constant';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';

import { StaffService } from '../../app/services/staff';
import { CollectionModeService } from '../../app/services/collection-mode';
import { DeliveryModeService } from '../../app/services/delivery-mode';

@IonicPage()
@Component({
	selector: 'page-take-picture',
	templateUrl: 'take-picture.html',
	providers: [StaffService, CollectionModeService, DeliveryModeService]
})
export class TakePicturePage extends BaseComponent {

	imageUrl: any;
	customer: any;
	isDeliveryMode: boolean = false;
	isFromCustomerInfoPage: boolean = false;
	userAlreadyPaid: boolean = false;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams, private camera: Camera,
		private geolocation: Geolocation, public zone: NgZone, public platform: Platform,
		private staffService: StaffService, private collectionModeService: CollectionModeService, private deliveryModeService: DeliveryModeService) {
		super(injector);
		this.customer = this.navParams.data.customer;
		this.isDeliveryMode = this.navParams.data.isDeliveryMode;
		this.isFromCustomerInfoPage = this.navParams.data.isFromCustomerInfoPage;
		this.subscribeEventUserCompletedPickupCharge();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad TakePicturePage');
		this.saveAttendantLocalCurrentJob();
	}

	ionViewWillEnter() {
		console.log('ionViewWillEnter TakePicturePage');
		this.dataShare.disableBackButtonAction();
	}

	dismissView(event) {
		this.navCtrl.pop();
	}

	takePicture() {
		let options: CameraOptions = {
			quality: 50,
			destinationType: this.camera.DestinationType.FILE_URI,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			targetWidth: 800,
			targetHeight: 800
		}

		this.camera.getPicture(options).then((imageData) => {
			if (this.isPlatformiOS(this.platform)) {
				this.zone.run(() => {
					this.imageUrl = imageData;
				});
			} else {
				this.imageUrl = imageData;
			}
		}, (err) => {
			// this.showError(JSON.stringify(err));
		});
	}

	savePictureForCollectionMode() {
		this.uploadPhoto((proofImageUrl: string) => {
			this.completedPickup(proofImageUrl);
		});
	}

	savePictureForDeliveryMode() {
		this.uploadPhoto((proofImageUrl: string) => {
			this.deliveryLuggage(proofImageUrl);
		});
	}

	goBackToListOrderPage() {
		try {
			let currentPageIndex = this.navCtrl.getViews().length - 1;
			let listOrderPageIndex = currentPageIndex - 3;
			let params: any = {
				deliveryItem: this.customer
			};
			this.events.publish(AppConstant.EVENT_TOPIC.DELIVERY_COMPLETED, params);
			this.navCtrl.popTo(this.navCtrl.getByIndex(listOrderPageIndex));
		} catch (e) {
			this.showError(e.message);
		}
	}

	goBackToCollectionModePage() {
		let currentPageIndex = this.navCtrl.getViews().length - 1;
        let collectionModePageIndex = currentPageIndex - 3;
        this.navCtrl.popTo(this.navCtrl.getByIndex(collectionModePageIndex));
	}

	goBackToUserStartPage() {
        this.navCtrl.popToRoot();
    }

	goBackAfterPickup() {
		this.clearLocalCurrentJob();
		if (this.isFromCustomerInfoPage && !this.isZappper()) {
			this.goBackToCollectionModePage();
		} else {
			this.goBackToUserStartPage();
		}
	}

	imageToBase64(url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.onload = function() {
			var reader = new FileReader();
			reader.onloadend = function() {
				callback(reader.result);
			}
			reader.readAsDataURL(xhr.response);
		};
		xhr.open('GET', url);
		xhr.responseType = 'blob';
		xhr.send();
	}

	subscribeEventUserCompletedPickupCharge() {
		if (this.isDeliveryMode) {
			return;
		}
		this.events.subscribe(AppConstant.NOTIFICATION_TYPE.PREFIX + AppConstant.NOTIFICATION_TYPE.USER_COMPLETED_PICKUP_CHARGE, (data: any) => {
			if (this.isDestroyed) {
				return;
			}
			if (!this.isActiveCurrentPage(this.navCtrl)) {
				return;
			}
			this.handleEventUserCompletedPickupCharge(data);
		});
	}

	handleEventUserCompletedPickupCharge(data?: any) {
		this.userAlreadyPaid = true;
		this.showInfoWithOkAction(this.translate.instant('USER_HAS_PAID'), null,
			() => {
				this.takePicture();
			});
	}

	uploadPhoto(callback?: (url: string) => void) {
		this.imageToBase64(this.imageUrl, base64Data => {
			this.staffService.uploadPhoto(base64Data).subscribe(
				res => {
					if (callback) {
						callback(res);
					}
				},
				err => {
					this.showError(err.message);
				}
			);
		});
	}

	getCurrentLocation(callback?: (latitude: number, longitude: number) => void) {
		let geolocationOptions: GeolocationOptions = this.initGeolocationOption();
		this.spinnerDialog.show();
		this.geolocation.getCurrentPosition(geolocationOptions).then((resp) => {
			this.spinnerDialog.hide();
			if (callback) {
				callback(resp.coords.latitude, resp.coords.longitude);
			}
		}).catch((error) => {
			this.spinnerDialog.hide();
			console.log('Error getting location', error);
			this.showLocationServiceProblemConfirmation();
		});
	}

	completedPickup(proofImageUrl: string) {
		this.getCurrentLocation((latitude: number, longitude: number) => {
			let orderId = this.customer.orderId;
			this.collectionModeService.completedPickup(orderId, proofImageUrl, latitude, longitude).subscribe(
				res => {
					this.goBackAfterPickup();
				},
				err => {
					this.showError(err.message);
				}
			);
		});
	}

	deliveryLuggage(proofImageUrl: string) {
		this.getCurrentLocation((latitude: number, longitude: number) => {
			let orderId = this.customer.orderId;
			let listLuggage = this.listLuggageReverseTransform(this.customer.listLuggage);
			this.deliveryModeService.deliveryLuggage(orderId, listLuggage, latitude, longitude, proofImageUrl).subscribe(
				res => {
					this.goBackToListOrderPage();
				},
				err => {
					this.showError(err.message);
				}
			);
		});
	}

	saveAttendantLocalCurrentJob() {
		if (this.isAttedant()) {
			this.saveLocalCurrentJob(this.customer);
		}
	}

	recheckOrderPaymentStatus() {
		let orderId = this.customer.orderId;
		this.checkOrderStatus(orderId, () => {
			this.checkOrderPaymentStatus(orderId, () => {
				this.handleEventUserCompletedPickupCharge();
			});
		});
	}

	checkOrderStatus(orderId: string, callback?: () => void) {
		this.collectionModeService.getOrderDetail(orderId).subscribe(
			res => {
				if (res.status == AppConstant.ORDER_STATUS.CANCELED) {
					this.showInfoWithOkAction(this.translate.instant('ERROR_ORDER_ORDER_CANCELLED'), this.translate.instant('INFO'), () => {
						this.goBackAfterPickup();
					});
					return;
				}
				if (callback) {
					callback();
				}
			},
			err => {
				this.showError(err.message);
			}
		);
	}

	checkOrderPaymentStatus(orderId: string, callback?: () => void) {
		this.collectionModeService.getOrderPaymentStatus(orderId).subscribe(
			res => {
				if (!res || res.payment_status != AppConstant.PAYMENT_STATUS.SUCCESS) {
					this.showInfo(this.translate.instant('ERROR_ORDER_ORDER_PAYMENT_STATUS_NOT_PAID'));
					return;
				}
				if (callback) {
					callback();
				}
			},
			err => {
				this.showError(err.message);
			}
		);
	}
}
