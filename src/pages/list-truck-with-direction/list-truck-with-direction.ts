import { Component, Injector, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { AppConstant } from '../../app/app.constant';

import { GoogleMaps, LatLng, Marker } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { CallNumber } from '@ionic-native/call-number';

import { DirectionTruckPage } from '../direction-truck';

import { StaffService } from '../../app/services/staff';

import * as moment from 'moment';

@IonicPage()
@Component({
	selector: 'page-list-truck-with-direction',
	templateUrl: 'list-truck-with-direction.html',
	providers: [StaffService]
})
export class ListTruckWithDirectionPage extends DirectionTruckPage {

	listTruck: Array<any> = [];
	slideIndex: number = 0;
	updateListTruckTimer: any;
	isLoadedListTruck: boolean = false;
	updateListTruckInterval = 30000;

	lastDirectionFunction: () => void;
	stayTimeString = '';
	arrivalTimeString = '';

	@ViewChild(Slides) slides: Slides;

	constructor(public injector: Injector, public navCtrl: NavController, public navParams: NavParams, public googleMaps: GoogleMaps,
		public geolocation: Geolocation, public callNumber: CallNumber, private staffService: StaffService) {
        super(injector, navCtrl, navParams, googleMaps, geolocation, callNumber);
		this.autoMoveCamera = false;
	}

	afterLoadMapAndCurrentLocation(currentLocation: LatLng) {
		if (!this.currentLocation) {
			this.currentLocation = currentLocation;
		}
		if (this.destinationLocation) {
			this.drawDirectionFromCurrentLocationToDestination(currentLocation, this.destinationName);
			this.moveCamera(this.destinationLocation);
		} else {
			this.autoUpdateListTruck();
		}
	}

	ionViewWillUnload() {
		super.ionViewWillUnload();
		this.stopAutoUpdateListTruck();
	}

    dismissView(event) {
        this.navCtrl.pop();
    }

	slideChanged(event) {
		let slide = event;
		let slideIndex = slide.getActiveIndex();
		if (slideIndex > this.listTruck.length - 1) {
			return;
		}
		this.slideIndex = slideIndex;
		this.truck = this.listTruck[this.slideIndex];
		if (this.lastDirectionFunction) {
			this.lastDirectionFunction();
		} else {
			this.drawDirectionToCurrentLocation();
		}
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
				if (res == 0) {
					this.handleCaseNoTruck();
					return;
				}
				this.isLoadedListTruck = true;
				this.updateListTruckAndSelectedSlide(res);
			},
			err => {
				this.handleCaseNoTruck();
				// this.showError(err.message);
			}
		);
	}

	handleCaseNoTruck() {
		this.isLoadedListTruck = true;
		this.listTruck = [];
		this.slideIndex = 0;
		this.removeDirection();
	}

	updateListTruckAndSelectedSlide(res: any) {
		let listUpdatedTruck = res.map(item => {
			return this.truckTransform(item);
		});
		let newSelectedIndex = this.findSelectedTruckInListUpdatedTruck(listUpdatedTruck);
		if (newSelectedIndex != this.slideIndex) {
			this.lastDirectionFunction = null;
		}
		this.listTruck = listUpdatedTruck;
		setTimeout(() => {
			this.slides.slideTo(newSelectedIndex, null, false);
			this.slideChanged(this.slides);
		}, 0);
	}

	removeDirection() {
		this.removeAllMarkersAndPolyline();
		this.updateCurrentLocationMarker(this.currentLocation);
	}

	autoUpdateListTruck() {
		if (this.updateListTruckTimer) {
			return;
		}
		this.getListOnlineTruck();
		this.updateListTruckTimer = setInterval(() => {
            this.getListOnlineTruck();
        }, this.updateListTruckInterval);
	}

	stopAutoUpdateListTruck() {
		if (this.updateListTruckTimer) {
			clearInterval(this.updateListTruckTimer);
			this.updateListTruckTimer = null;
		}
	}

	findSelectedTruckInListUpdatedTruck(listUpdatedTruck: Array<any>): number {
		if (this.listTruck.length == 0 || listUpdatedTruck.length == 0) {
			return 0;
		}
		let currentItem = this.listTruck[this.slideIndex];
		for (let i = 0; i < listUpdatedTruck.length; i++) {
			let item = listUpdatedTruck[i];
			if (item.id == currentItem.id) {
				return i;
			}
		}
		return 0;
	}

	drawDirectionToCurrentLocation() {
		super.drawDirectionToCurrentLocation();
		this.lastDirectionFunction = this.drawDirectionToCurrentLocation;
		this.stayTimeString = '';
		this.arrivalTimeString = '';
	}

	drawDirectionToCurrentStation() {
		super.drawDirectionToCurrentStation();
		this.lastDirectionFunction = this.drawDirectionToCurrentStation;
		this.arrivalTimeString = '';
		let stayTime = Number(this.truck.current_station_info.stop_time) / 60;
		let suffix: string = stayTime > 1 ? 'mins' : 'min';
		this.stayTimeString = stayTime.toFixed(0) + ' ' + suffix;
	}

	drawDirectionToNextStation() {
		super.drawDirectionToNextStation();
		this.lastDirectionFunction = this.drawDirectionToNextStation;
		this.stayTimeString = '';
		this.arrivalTimeString = '';
	}
}
