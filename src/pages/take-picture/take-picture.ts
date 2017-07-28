import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { AppConstant } from '../../app/app.constant';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { StaffService } from '../../app/services/staff';
import { CollectionModeService } from '../../app/services/collection-mode';

@IonicPage()
@Component({
	selector: 'page-take-picture',
	templateUrl: 'take-picture.html',
	providers: [StaffService, CollectionModeService]
})
export class TakePicturePage extends BaseComponent {

	imageUrl: string = '';
	customer: any;
	isDeliveryMode: boolean = false;
	isFromCustomerInfoPage: boolean = false;
	userAlreadyPaid: boolean = false;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams, private camera: Camera,
		public events: Events, private staffService: StaffService, private collectionModeService: CollectionModeService) {
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
			quality: 20,
			destinationType: this.camera.DestinationType.FILE_URI,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE
		}

		this.camera.getPicture(options).then((imageData) => {
			this.imageUrl = imageData;
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
		this.goBackToListOrderPage();
	}

	goBackToListOrderPage() {
		try {
			let currentPageIndex = this.navCtrl.getViews().length - 1;
			let listOrderPageIndex = currentPageIndex - 3;
			let params: any = {
				deliveryItem: this.customer
			};
			this.events.publish('delivery:completed', params);
			let view = this.navCtrl.getByIndex(listOrderPageIndex);
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
			if (!this.isActiveCurrentPage(this.navCtrl)) {
				return;
			}
			this.userAlreadyPaid = true;
			this.showInfoWithOkAction(this.translate.instant('USER_HAS_PAID'), null,
				() => {
					this.takePicture();
				});

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
					this.showError(err);
				}
			);
		});
	}

	completedPickup(proofImageUrl: string) {
		let orderId = this.customer.orderId;
		this.collectionModeService.completedPickup(orderId, proofImageUrl).subscribe(
			res => {
				if (this.isFromCustomerInfoPage) {
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
}
