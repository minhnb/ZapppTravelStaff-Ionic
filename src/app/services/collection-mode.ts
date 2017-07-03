import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ZapppHttp } from './zapppHttp';

import { AppConfig } from '../app.config';
import { AppConstant } from '../app.constant';

@Injectable()
export class CollectionModeService {
	private stopUrl = AppConfig.API_URL + 'stop';
	private truckUrl = AppConfig.API_URL + 'truck';

	constructor(private zapppHttp: ZapppHttp) { }

	getListStation() {
		return this.zapppHttp.get(this.stopUrl + '/list_stops_collection');
	}

	updateStation(currentStationId: string, nextStationId: string, stayTime: number) {
		let params = {
			current_stop_id: currentStationId,
			next_stop_id: nextStationId,
			stay_time: stayTime
		};
		return this.zapppHttp.post(this.truckUrl + '/update_station', params);
	}

	leaveCurrentStation() {
		return this.zapppHttp.post(this.truckUrl + '/truck_leave_stop', {});
	}

	updateParkingTime(stayTime: number) {
		let params = {
			stay_time: stayTime
		};
		return this.zapppHttp.post(this.truckUrl + '/update_stay_time', params);
	}
}
