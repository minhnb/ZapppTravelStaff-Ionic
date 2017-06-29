import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ZapppHttp } from './zapppHttp';

import { AppConfig } from '../app.config';
import { AppConstant } from '../app.constant';

@Injectable()
export class StaffService {

	private truckUrl = AppConfig.API_URL + 'truck';
	private userUrl = AppConfig.API_URL + 'user';

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
}
