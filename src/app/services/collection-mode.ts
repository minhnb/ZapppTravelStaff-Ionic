import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ZapppHttp } from './zapppHttp';

import { AppConfig } from '../app.config';
import { AppConstant } from '../app.constant';

@Injectable()
export class CollectionModeService {

	private stopUrl = AppConfig.API_URL + 'stop';
	private truckUrl = AppConfig.API_URL + 'truck';
	private orderUrl = AppConfig.API_URL + 'orders';

	constructor(private zapppHttp: ZapppHttp) { }

	getListStation() {
		return this.zapppHttp.get(this.stopUrl + '/list_stops_collection');
	}

	updateStation(currentStationId: string, nextStationId: string, stayTime: number) {
		let params: any = {
			next_stop_id: nextStationId,
			stay_time: stayTime
		};
		if (currentStationId) {
			params.current_stop_id = currentStationId;
		}
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

	getOrderDetail(orderId: string) {
		return this.zapppHttp.get(this.orderUrl + '/detail/order_id/' + orderId);
	}

	getLuggageCodeDetail(luggageCode: string) {
		return this.zapppHttp.get(this.orderUrl + '/detail/luggage_id/' + luggageCode);
	}

	updateLuggage(orderId: string, listLuggage: Array<any>, isUpdated: boolean = false) {
		let params = {
			order_id: orderId,
			luggage_info: listLuggage,
			is_update: isUpdated
		};
		return this.zapppHttp.post(this.orderUrl + '/add_luggage_to_order', params);
	}

	checkValidLuggage(luggageCode: string) {
		return this.zapppHttp.get(this.orderUrl + '/is_luggage_valid/luggage_id/' + luggageCode);
	}

	completedPickup(orderId: string, listProofImageUrl: Array<string>, latitude: number, longitude: number) {
		let params = {
			order_id: orderId,
			pic_url: listProofImageUrl,
			lat: latitude,
			lng: longitude
		};
		return this.zapppHttp.post(this.orderUrl + '/pickup_completed', params);
	}

	listOtherTruckNeedToGetOrder(truckId: string) {
		let params = {
			truck_id: truckId
		};
		return this.zapppHttp.post(this.truckUrl + '/list_accept_orders', params);
	}

	listOtherTruckNeedToTransfer(truckId: string) {
		let params = {
			truck_id: truckId
		};
		return this.zapppHttp.post(this.truckUrl + '/list_transfer_orders', params);
	}

	listHotelByTruckToTransfer(truckId: string) {
		let params = {
			truck_id: truckId
		};
		return this.zapppHttp.post(this.truckUrl + '/list_transfer_orders_by_hotel', params);
	}

	listOrderByTruckAndHotelToTransfer(truckId: string, hotelId: string) {
		let params = {
			truck_id: truckId,
			hotel_id: hotelId
		};
		return this.zapppHttp.post(this.truckUrl + '/list_relevant_orders', params);
	}

	listHotelByTruckToAccept(truckId: string) {
		let params = {
			truck_id: truckId
		};
		return this.zapppHttp.post(this.truckUrl + '/list_accept_orders_by_hotel', params);
	}

	listOrderByTruckAndHotelToAccept(truckId: string, hotelId: string) {
		let params = {
			truck_id: truckId,
			hotel_id: hotelId
		};
		return this.zapppHttp.post(this.truckUrl + '/list_accept_relevant_orders', params);
	}

	listOrderOnCurrentTruck() {
		let truckId = localStorage.getItem(AppConstant.TRUCK);
		let params = {
			truckid: truckId
		}
		return this.zapppHttp.get(this.orderUrl + '/orders_on_truck', params);
	}

	getOrderPaymentStatus(orderId: string) {
		return this.zapppHttp.get(this.orderUrl + '/status/order_id/' + orderId);
	}

	getOrderPaymentWeChatCode(orderId: string) {
		return this.zapppHttp.get(this.orderUrl + '/wechat_code/?order_id=' + orderId);
	}

	cancelOrder(orderId: string, reason: string) {
		let params = {
			id: orderId,
			reason: reason
		};
		return this.zapppHttp.post(this.orderUrl + '/zappper_cancel_order', params);
	}
}
