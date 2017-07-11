import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GoogleMaps, LatLng } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { DirectionPage } from './direction';

import { StayTimeCountDownPage } from '../stay-time-count-down';

@IonicPage()
@Component({
	selector: 'page-direction-stop',
	templateUrl: 'direction-stop.html',
})
export class DirectionStopPage extends DirectionPage {

	isDeliveryMode: boolean = false;
	station: any;

	constructor(public injector: Injector, public navCtrl: NavController, public navParams: NavParams, public googleMaps: GoogleMaps, public geolocation: Geolocation) {
		super(injector, navCtrl, navParams, googleMaps, geolocation);
		if (this.navParams.data.isDeliveryMode) {
			this.isDeliveryMode = true;
		}
		this.station = this.navParams.data.station;
	}

	afterLoadMapAndCurrentLocation(currentLocation: LatLng) {
		let stationName = this.station && this.station.name ? this.station.name : '';
		this.drawDirectionFromCurrentLocationToDestination(currentLocation, stationName);
	}

	goToStayTimeCountDownPage() {
		let params = {
			station: this.station
		};
		this.navCtrl.push(StayTimeCountDownPage, params);
	}

}
