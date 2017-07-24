import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { GoogleMaps, LatLng } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { DirectionPage } from './direction';

import { StayTimeCountDownPage } from '../stay-time-count-down';
import { DeliveryModeService } from '../../app/services/delivery-mode';

@IonicPage()
@Component({
	selector: 'page-direction-stop',
	templateUrl: 'direction-stop.html',
	providers: [DeliveryModeService]
})
export class DirectionStopPage extends DirectionPage {

	isDeliveryMode: boolean = false;
	station: any;
	isStartedDelivering: boolean = false;

	constructor(public injector: Injector, public navCtrl: NavController, public navParams: NavParams, public googleMaps: GoogleMaps,
		public geolocation: Geolocation, private deliveryModeService: DeliveryModeService, public events: Events) {
		super(injector, navCtrl, navParams, googleMaps, geolocation);
		if (this.navParams.data.isDeliveryMode) {
			this.isDeliveryMode = true;
		}
		this.station = this.navParams.data.station;

		this.handleEventReloadDirectionStation();
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

	startDelivering() {
		this.updateDeliveryStatus(true, () => {
			this.isStartedDelivering = true;
		});
	}

	finishDelivering() {
		this.updateDeliveryStatus(false, () => {
			this.navCtrl.pop();
		});
	}

	updateDeliveryStatus(isDelivering: boolean, callback?: () => void) {
		this.deliveryModeService.updateDeliveryStatus(this.station.id, isDelivering).subscribe(
			res => {
				if (callback) {
					callback();
				}
			},
			err => {
				this.showError(err.message);
			}
		);
	}

	handleEventReloadDirectionStation() {
		this.events.subscribe('direction:station', (data) => {
			this.station = data.station;
			this.destinationLocation = new LatLng(Number(this.station.lat), Number(this.station.lng));
			this.removeAllMarkersAndPolyline();
			this.loadMap();
		});
	}
}
