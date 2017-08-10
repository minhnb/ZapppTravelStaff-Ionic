import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppConstant } from '../../app/app.constant';

import { GoogleMaps, LatLng, Marker } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { CallNumber } from '@ionic-native/call-number';

import { DirectionTruckPage } from '../direction-truck';

import { StaffService } from '../../app/services/staff';

@IonicPage()
@Component({
	selector: 'page-list-truck-with-direction',
	templateUrl: 'list-truck-with-direction.html',
	providers: [StaffService]
})
export class ListTruckWithDirectionPage extends DirectionTruckPage {

	listTruck: Array<any> = [];
	slideIndex: number = 0;

	constructor(public injector: Injector, public navCtrl: NavController, public navParams: NavParams, public googleMaps: GoogleMaps,
		public geolocation: Geolocation, public callNumber: CallNumber, private staffService: StaffService) {
        super(injector, navCtrl, navParams, googleMaps, geolocation, callNumber);
		this.getListOnlineTruck();
	}

	afterLoadMapAndCurrentLocation(currentLocation: LatLng) {
		if (!this.currentLocation) {
			this.currentLocation = currentLocation;
		}
		if (this.destinationLocation) {
			this.drawDirectionFromCurrentLocationToDestination(currentLocation, this.destinationName);
			this.moveCamera(this.destinationLocation);
		} else {
			this.getCurrentTruckDetail();
		}
	}

    dismissView(event) {
        this.navCtrl.pop();
    }

	slideChanged(event) {
		let slide = event;
		this.slideIndex = slide.getActiveIndex();
		if (this.slideIndex > this.listTruck.length - 1) {
			return;
		}
		this.truck = this.listTruck[this.slideIndex];
		this.drawDirectionToCurrentLocation();
	}

	getCurrentTruckDetail(callback?: () => void) {
		let truck = this.listTruck[this.slideIndex];
		this.staffService.getTruckDetail(truck.id).subscribe(
			res => {
				this.truck = res;
				this.drawDirectionToCurrentLocation();
			},
			err => {
				this.showError(err.message);
			}
		);
	}

	truckTransform(truck: any): any {
		let result = truck;
		result.truckNumber = truck.truck_number;
		if (truck.driver_info) {
			let driverInfo = truck.driver_info;
			result.driver_phone = driverInfo.phone;
			result.driverName = this.getFullName(driverInfo.first, driverInfo.last);
		}
		return result;
	}

	getListOnlineTruck() {
		this.staffService.getListOnlineTruck().subscribe(
			res => {
				this.listTruck = res.map(item => {
					return this.truckTransform(item);
				});;
			},
			err => {
				this.showError(err.message);
			}
		);
	}
}
