import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GoogleMaps, LatLng } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

import { DirectionPage } from '../direction-stop';

@IonicPage()
@Component({
	selector: 'page-direction-truck',
	templateUrl: 'direction-truck.html',
})
export class DirectionTruckPage extends DirectionPage {

    truck: any;

	constructor(public injector: Injector, public navCtrl: NavController, public navParams: NavParams, public googleMaps: GoogleMaps,
		public geolocation: Geolocation) {
		super(injector, navCtrl, navParams, googleMaps, geolocation);
		this.truck = this.navParams.data.truck;
	}

	afterLoadMapAndCurrentLocation(currentLocation: LatLng) {
		let truckNumber = this.truck && this.truck.truckNumber ? this.truck.truckNumber : '';
		this.drawDirectionFromCurrentLocationToDestination(currentLocation, truckNumber);
	}

}
