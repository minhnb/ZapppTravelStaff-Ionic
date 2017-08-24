import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GoogleMaps, LatLng } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { CallNumber } from '@ionic-native/call-number';

import { DirectionPage } from '../direction-stop';

@IonicPage()
@Component({
	selector: 'page-direction-truck',
	templateUrl: 'direction-truck.html',
})
export class DirectionTruckPage extends DirectionPage {

    truck: any;
	destinationName: string;

	constructor(public injector: Injector, public navCtrl: NavController, public navParams: NavParams, public googleMaps: GoogleMaps,
		public geolocation: Geolocation, public callNumber: CallNumber) {
		super(injector, navCtrl, navParams, googleMaps, geolocation);
		if (this.navParams.data.truck) {
			this.truck = this.navParams.data.truck;
			this.destinationLocation = new LatLng(Number(this.truck.lat), Number(this.truck.lng));
			this.destinationName = this.truck.truck_number || '';
		}
	}

	afterLoadMapAndCurrentLocation(currentLocation: LatLng) {
		if (!this.currentLocation) {
			this.currentLocation = currentLocation;
		}
		this.drawDirectionFromCurrentLocationToDestination(currentLocation, this.destinationName);
		this.moveCamera(this.destinationLocation);
	}

	hasDriverPhoneNumber(): boolean {
		if (this.truck && this.truck.driver_phone) {
			return true;
		}
		return false;
	}

	hasCurrentLocation(): boolean {
		if (this.truck && this.hasValidLocation(this.truck.lat, this.truck.lng)) {
			return true;
		}
		return false;
	}

	hasCurrentStopLocation(): boolean {
		if (this.truck && this.truck.current_station_info && this.hasValidLocation(this.truck.current_station_info.lat, this.truck.current_station_info.lng)) {
			return true;
		}
		return false;
	}

	hasNextStopLocation(): boolean {
		if (this.truck && this.truck.next_station_info && this.hasValidLocation(this.truck.next_station_info.lat, this.truck.next_station_info.lng)) {
			return true;
		}
		return false;
	}

	callDriver() {
		this.callNumber.callNumber(this.truck.driver_phone, true)
			.then(() => {

			})
			.catch(() => console.log('Error launching dialer'));
	}

	drawDirectionToCurrentLocation() {
		this.destinationName = this.truck.truck_number || '';
		this.drawTruckDirection(Number(this.truck.lat), Number(this.truck.lng));
	}

	drawDirectionToCurrentStation() {
		let station = this.truck.current_station_info;
		this.destinationName = station.name || '';
		this.drawTruckDirection(Number(station.lat), Number(station.lng));
	}

	drawDirectionToNextStation() {
		let station = this.truck.next_station_info;
		this.destinationName = station.name || '';
		this.drawTruckDirection(Number(station.lat), Number(station.lng));
	}

	drawTruckDirection(lat: number, long: number) {
		this.destinationLocation = new LatLng(lat, long);
		if (this.currentLocation) {
			this.afterLoadMapAndCurrentLocation(this.currentLocation);
		} else {
			this.loadMap();
		}
	}
}
