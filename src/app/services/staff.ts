import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ZapppHttp } from './zapppHttp';

import { AppConfig } from '../app.config';
import { AppConstant } from '../app.constant';

@Injectable()
export class StaffService {

	private truckUrl = AppConfig.API_URL + 'truck';
	private userUrl = AppConfig.API_URL + 'user';
	private districtUrl = AppConfig.API_URL + 'district';
	private zappperUrl = AppConfig.API_URL + 'zappper';

	constructor(private zapppHttp: ZapppHttp) { }

	getListTruck() {
		return this.zapppHttp.get(this.truckUrl + '/available_truck');
	}

	updateStatus(status: boolean) {
		let params = {
			status: status
		};
		return this.zapppHttp.post(this.userUrl + '/update_status', params);
	}

	chooseTruck(truckId: string) {
		let params = {
			truck_id: truckId
		};
		return this.zapppHttp.post(this.truckUrl + '/assign_driver', params);
	}

	listDistrict(): Observable<any> {
		return this.zapppHttp.get(this.districtUrl + '/list_districts');
	}

	loadNewRequestsAndUncompletedOrders(): Observable<any> {
		return this.zapppHttp.get(this.zappperUrl + '/count_number_new_request_and_uncompleted_orders');
	}

	zappperUpdateCurrentLocation(lat: number, long: number) {
		let params = {
			lat: lat,
			lng: long
		};
		return this.zapppHttp.post(this.zappperUrl + '/update_lat_lng', params);
	}

	driverUpdateCurrentLocation(lat: number, long: number) {
		let params = {
			lat: lat,
			lng: long
		};
		return this.zapppHttp.post(this.truckUrl + '/update_lat_lng', params);
	}
}
