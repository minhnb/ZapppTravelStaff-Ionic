import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DirectionPage } from '../direction-stop';
import { CustomerLuggagePage } from '../customer-luggage';
import { GoogleMaps, LatLng } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { CallNumber } from '@ionic-native/call-number';

@IonicPage()
@Component({
	selector: 'page-direction-user',
	templateUrl: 'direction-user.html',
})
export class DirectionUserPage extends DirectionPage {

	customer: any;

	constructor(public injector: Injector, public navCtrl: NavController, public navParams: NavParams, public googleMaps: GoogleMaps,
		public geolocation: Geolocation, private callNumber: CallNumber) {
		super(injector, navCtrl, navParams, googleMaps, geolocation);
		this.customer = this.navParams.data.customer;
	}

	afterLoadMapAndCurrentLocation(currentLocation: LatLng) {
		let customerName = this.customer && this.customer.name ? this.customer.name : '';
		this.drawDirectionFromCurrentLocationToDestination(currentLocation, customerName);
	}

	callCustomer() {
		this.callNumber.callNumber(this.customer.phoneNumber, true)
			.then(() => console.log('Launched dialer!'))
			.catch(() => console.log('Error launching dialer'));
	}

	scanLuggage() {
		this.scanQRCode(text => {
            this.goToCustomerLugguagePage(text);
        });
	}

	goToCustomerLugguagePage(luggageCode: string) {
		let params: any = {
			customer: this.customer,
			luggageCode: luggageCode
		};
		this.navCtrl.push(CustomerLuggagePage, params);
	}
}
