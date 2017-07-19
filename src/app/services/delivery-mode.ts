import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ZapppHttp } from './zapppHttp';

import { AppConfig } from '../app.config';
import { AppConstant } from '../app.constant';

@Injectable()
export class DeliveryModeService {

	private hotelUrl = AppConfig.API_URL + 'hotel';
	private truckUrl = AppConfig.API_URL + 'truck';

	constructor(private zapppHttp: ZapppHttp) { }

	getListHotel() {
		return this.zapppHttp.get(this.hotelUrl + '/available_hotel_delivery');
	}

	updateDeliveryStatus(hotelId: string, isDelivering: boolean) {
		let params: any = {
			hotel_id: hotelId
		};
		if (isDelivering) {
			params.is_start = true;
		} else {
			params.is_finish = true;
		}
		return this.zapppHttp.post(this.truckUrl + '/update_delivery_status', params);
	}
}
