import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { AppConstant } from '../../app/app.constant';

import { GoogleMaps, LatLng, Marker } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

import { DirectionPage } from '../direction-stop';
import { DirectionUserPage } from '../direction-user';

import { StaffService } from '../../app/services/staff';

@IonicPage()
@Component({
	selector: 'page-list-request-with-direction',
	templateUrl: 'list-request-with-direction.html',
	providers: [StaffService]
})
export class ListRequestWithDirectionPage extends DirectionPage {

	listRequest: Array<any> = [];
	defaultAvatar: string = 'www/assets/images/no-photo.png';
	slideIndex: number = 0;

	constructor(public injector: Injector, public navCtrl: NavController, public navParams: NavParams, public googleMaps: GoogleMaps,
		public geolocation: Geolocation, private staffService: StaffService, private events: Events) {
        super(injector, navCtrl, navParams, googleMaps, geolocation);
		this.listRequest = navParams.data.listRequest;
		this.autoMoveCamera = false;
		this.subscribeZappperNewRequestEvent();
	}

	afterLoadMapAndCurrentLocation(currentLocation: LatLng) {
		if (!this.currentLocation) {
			this.currentLocation = currentLocation;
		}
		let customer = this.listRequest[this.slideIndex];
		this.destinationLocation = new LatLng(Number(customer.lat), Number(customer.long));
		this.moveCamera(this.destinationLocation);
		let customerName = customer && customer.name ? customer.name : '';
		this.drawDirectionFromCurrentLocationToDestination(currentLocation, customerName);
	}

    dismissView(event) {
        this.navCtrl.pop();
    }

	takeRequest(customer: any) {
		this.staffService.zappperAcceptLuggage(customer.orderId).subscribe(
			res => {
				this.saveLocalCurrentJob(customer);
				this.goToDirectionPage(customer);
			},
			err => {
				this.showError(err.message);
			}
		);
	}

	goToDirectionPage(customer: any) {
		let params = {
			long: customer.long,
			lat: customer.lat,
			customer: customer
		}
		this.navCtrl.push(DirectionUserPage, params);
	}

	saveLocalCurrentJob(customer) {
		localStorage.setItem(AppConstant.CURRENT_JOB, JSON.stringify(customer));
	}

	subscribeZappperNewRequestEvent() {
		this.events.subscribe(AppConstant.NOTIFICATION_TYPE.PREFIX + AppConstant.NOTIFICATION_TYPE.REQUEST_ORDER, (data: any) => {
			if (!this.isZappper()) {
				return;
			}
			if (!this.isActiveCurrentPage(this.navCtrl)) {
				return;
			}
			this.showConfirm(this.translate.instant('ZAPPPER_ALERT_NEW_REQUEST'), this.translate.instant('ZAPPPER_ALERT_NEW_REQUEST_TITLE'),
				() => {
					this.navCtrl.popToRoot();
				});

		});
	}

	addEndPointMarker(point: LatLng, title?: string, callback?: (marker: Marker) => void) {
		let customer = this.listRequest[this.slideIndex];
		if (!customer.avatar) {
			customer.avatar = this.defaultAvatar;
		}
		var markerParams = this.createMarkerOptions(point, title, customer.avatar, { width: 50, height: 50 });
		this.addMarker(markerParams, callback);
	}

	slideChanged(event) {
		let slide = event;
		this.slideIndex = slide.getActiveIndex();
		this.removeAllMarkersAndPolyline();
		if (this.currentLocation) {
			this.afterLoadMapAndCurrentLocation(this.currentLocation);
		} else {
			this.loadMap();
		}
	}
}
