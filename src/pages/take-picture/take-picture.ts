import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { AppConstant } from '../../app/app.constant';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { StaffService } from '../../app/services/staff';
import { CollectionModeService } from '../../app/services/collection-mode';
import { DeliveryModeService } from '../../app/services/delivery-mode';

import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';

@IonicPage()
@Component({
	selector: 'page-take-picture',
	templateUrl: 'take-picture.html',
	providers: [StaffService, CollectionModeService, DeliveryModeService]
})
export class TakePicturePage extends BaseComponent {

	imageUrl: string = '';
	customer: any;
	isDeliveryMode: boolean = false;
	isFromCustomerInfoPage: boolean = false;
	userAlreadyPaid: boolean = false;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams, private camera: Camera,
		private geolocation: Geolocation, private staffService: StaffService,
		private collectionModeService: CollectionModeService, private deliveryModeService: DeliveryModeService) {
		super(injector);
		this.customer = this.navParams.data.customer;
		this.isDeliveryMode = this.navParams.data.isDeliveryMode;
		this.isFromCustomerInfoPage = this.navParams.data.isFromCustomerInfoPage;
		this.subscribeEventUserCompletedPickupCharge();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad TakePicturePage');
	}

	dismissView(event) {
		this.navCtrl.pop();
	}

	takePicture() {
		let options: CameraOptions = {
			quality: 50,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			targetWidth: 800,
			targetHeight: 800
		}

		this.camera.getPicture(options).then((imageData) => {
			this.imageUrl = 'data:image/jpeg;base64,' + imageData;
			console.log(this.imageUrl.length);
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
		this.clearZappperCurrentJob();
        this.navCtrl.popToRoot();
    }

	clearZappperCurrentJob() {
		if (this.isZappper()) {
			localStorage.removeItem(AppConstant.CURRENT_JOB);
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
			this.handleEventUserCompletedPickupCharge(data);
		});
	}

	handleEventUserCompletedPickupCharge(data: any) {
		if (!this.isActiveCurrentPage(this.navCtrl)) {
			return;
		}
		this.userAlreadyPaid = true;
		this.showInfoWithOkAction(this.translate.instant('USER_HAS_PAID'), null,
			() => {
				this.takePicture();
			});
	}

	uploadPhoto(callback?: (url: string) => void) {
		this.staffService.uploadPhoto(this.imageUrl).subscribe(
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

	completedPickup(proofImageUrl: string) {
		let orderId = this.customer.orderId;
		this.collectionModeService.completedPickup(orderId, proofImageUrl).subscribe(
			res => {
				if (this.isFromCustomerInfoPage && !this.isZappper()) {
					this.goBackToCollectionModePage();
				} else {
					this.goBackToUserStartPage();
				}
			},
			err => {
				this.showError(err.message);
			}
		);
	}

	deliveryLuggage(proofImageUrl: string) {
		let geolocationOptions: GeolocationOptions = this.initGeolocationOption();
		this.spinnerDialog.show();
		this.geolocation.getCurrentPosition(geolocationOptions).then((resp) => {
			this.spinnerDialog.hide();
			let orderId = this.customer.orderId;
			let listLuggage = this.listLuggageReverseTransform(this.customer.listLuggage);
			this.deliveryModeService.deliveryLuggage(orderId, listLuggage, resp.coords.latitude, resp.coords.longitude, proofImageUrl).subscribe(
				res => {
					this.goBackToListOrderPage();
				},
				err => {
					this.showError(err.message);
				}
			);
		}).catch((error) => {
			this.spinnerDialog.hide();
			console.log('Error getting location', error);
			this.showLocationServiceProblemConfirmation();
		});
	}
}
