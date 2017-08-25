import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GoogleMaps, LatLng } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

import { DirectionPage } from '../direction-stop';
import { CustomerLuggagePage } from '../customer-luggage';
import { CustomerInfoPage } from '../customer-info';

import { CollectionModeService } from '../../app/services/collection-mode';

@IonicPage()
@Component({
	selector: 'page-direction-user',
	templateUrl: 'direction-user.html',
	providers: [CollectionModeService]
})
export class DirectionUserPage extends DirectionPage {

	customer: any;

	constructor(public injector: Injector, public navCtrl: NavController, public navParams: NavParams, public googleMaps: GoogleMaps,
		public geolocation: Geolocation, private collectionModeService: CollectionModeService) {
		super(injector, navCtrl, navParams, googleMaps, geolocation);
		this.customer = this.navParams.data.customer;
	}

	ionViewWillEnter() {
		super.ionViewWillEnter();
		this.dataShare.disableBackButtonAction();
	}

	afterLoadMapAndCurrentLocation(currentLocation: LatLng) {
		let customerName = this.customer && this.customer.name ? this.customer.name : '';
		this.drawDirectionFromCurrentLocationToDestination(currentLocation, customerName);
	}

	callCustomer() {
		this.callPhoneNumber(this.customer.phoneNumber);
	}

	scanLuggageQRCode() {
		this.scanQRCode(text => {
            this.goToCustomerLugguagePage(text);
        }, this.translate.instant('PROMPT_BARCODE_SCANNER_LUGGAGE'));
	}

	goToCustomerLugguagePage(luggageCode: string) {
		let params: any = {
			customer: this.customer,
			luggageCode: luggageCode
		};
		this.navCtrl.push(CustomerLuggagePage, params);
	}

	scanOrderQRCode() {
        this.scanQRCode(text => {
			let orderId = this.getOrderIdFromOrderCode(text);
			if (orderId) {
				this.getOrderDetail(orderId);
				return;
			}
			this.showError(this.translate.instant('ERROR_INVALID_ORDER_CODE'));
        }, this.translate.instant('PROMPT_BARCODE_SCANNER_ORDER'));
	}

	getOrderDetail(orderId: string) {
		this.collectionModeService.getOrderDetail(orderId).subscribe(
			res => {
				let customerInfo = this.customerInfoTransform(res);
				if (this.customer.orderId != customerInfo.orderId) {
					this.showError(this.translate.instant('ERROR_ORDER_ID_NOT_MATCH'));
					return;
				}
				this.navCtrl.push(CustomerInfoPage, customerInfo);
			},
			err => {
				this.showError(err.message);
			}
		);
	}
}
