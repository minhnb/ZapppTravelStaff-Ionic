import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ZapppHttp } from './zapppHttp';

import { AppConfig } from '../app.config';
import { AppConstant } from '../app.constant';

@Injectable()
export class DeliveryModeService {

	private hotelUrl = AppConfig.API_URL + 'hotel';

	constructor(private zapppHttp: ZapppHttp) { }

	getListHotel() {
		return this.zapppHttp.get(this.hotelUrl + '/available_hotel_delivery');
	}
}
