import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
	selector: 'page-take-picture',
	templateUrl: 'take-picture.html',
})
export class TakePicturePage extends BaseComponent {

	imageUrl: string = '';
	customer: any;
	isDeliveryMode: boolean = false;
	isFromCustomerInfoPage: boolean = false;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams, private camera: Camera, public events: Events) {
		super(injector);
		this.customer = this.navParams.data.customer;
		this.isDeliveryMode = this.navParams.data.isDeliveryMode;
		this.isFromCustomerInfoPage = this.navParams.data.isFromCustomerInfoPage;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad TakePicturePage');
	}

	dismissView(event) {
		this.navCtrl.pop();
	}

	takePicture() {
		let options: CameraOptions = {
			quality: 70,
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
		if (this.isFromCustomerInfoPage) {
			this.goBackToCollectionModePage();
		} else {
			this.goBackToUserStartPage();
		}

	}
	savePictureForDeliveryMode() {
		this.goBackToListOrderPage();
	}

	goBackToListOrderPage() {
		let currentPageIndex = this.navCtrl.getViews().length - 1;
        let listOrderPageIndex = currentPageIndex - 3;
		let params: any = {
			deliveryItem: this.customer
		};
		this.events.publish('delivery:completed', params);
        this.navCtrl.popTo(this.navCtrl.getByIndex(listOrderPageIndex));
	}

	goBackToCollectionModePage() {
		let currentPageIndex = this.navCtrl.getViews().length - 1;
        let collectionModePageIndex = currentPageIndex - 3;
        this.navCtrl.popTo(this.navCtrl.getByIndex(collectionModePageIndex));
	}

	goBackToUserStartPage() {
        this.navCtrl.popToRoot();
    }
}
