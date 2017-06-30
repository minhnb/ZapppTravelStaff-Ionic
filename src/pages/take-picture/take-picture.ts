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

	base64Image: string = '';
	customer: any;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams, private camera: Camera, public events: Events) {
		super(injector);
		this.customer = this.navParams.data.customer;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad TakePicturePage');
	}

	dismissView(event) {
		this.navCtrl.pop();
	}

	takePicture() {
		let options: CameraOptions = {
			quality: 100,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE
		}

		this.camera.getPicture(options).then((imageData) => {
			// imageData is either a base64 encoded string or a file URI
			// If it's base64:
			this.base64Image = 'data:image/jpeg;base64,' + imageData;
		}, (err) => {
			this.showError(JSON.stringify(err));
		});
	}

	savePicture() {
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
}
