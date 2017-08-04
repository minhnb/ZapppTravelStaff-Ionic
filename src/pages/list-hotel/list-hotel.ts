import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';

import { ListOrderPage } from '../list-order';
import { DirectionStopPage } from '../direction-stop';

import { DeliveryModeService } from '../../app/services/delivery-mode';
import { CollectionModeService } from '../../app/services/collection-mode';

@IonicPage()
@Component({
	selector: 'page-list-hotel',
	templateUrl: 'list-hotel.html',
	providers: [DeliveryModeService, CollectionModeService]
})
export class ListHotelPage extends BaseComponent {

    listHotel: Array<any> = [];
	truck: any;
	isTransferMode: boolean = false;
	isAcceptLuggageMode: boolean = false;
	isLoaded: boolean = false;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams,
		private deliveryModeService: DeliveryModeService, private collectionModeService: CollectionModeService) {
		super(injector);
		this.truck = navParams.data.truck;
		this.isTransferMode = navParams.data.isTransferMode;
		this.isAcceptLuggageMode = navParams.data.isAcceptLuggageMode;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ListHotelPage');
	}

	ionViewWillEnter() {
		if (this.isTransferMode && this.isLoaded) {
			return;
		}
		this.loadListHotel();
		this.isLoaded = true;
	}

	viewListOrder(hotel: any) {
		if (this.isAcceptLuggageMode) {
			this.listOrderByTruckAndHotelToAccept(hotel.id, (listOrder) => {
				this.goToHotelOrderPage(hotel.name, listOrder, false);
			});
			return;
		}
		if (this.isTransferMode) {
			this.listOrderByTruckAndHotelToTransfer(hotel.id, (listOrder) => {
				this.goToHotelOrderPage(hotel.name, listOrder, false);
			});
			return;
		}
		this.goToHotelOrderPage(hotel.name, hotel.listOrder);
	}

	goToHotelOrderPage(hotelName: string, listOrder: Array<any>, isDeliveryMode: boolean = true) {
        let params = {
            pageName: hotelName,
			listOrder: listOrder,
            isDeliveryMode: isDeliveryMode,
			isTransferMode: this.isTransferMode,
			isAcceptLuggageMode: this.isAcceptLuggageMode
        }
        this.navCtrl.push(ListOrderPage, params);
    }

	viewDirection(hotel: any) {
        this.navCtrl.push(DirectionStopPage, {
            station: {
				name: hotel.name,
				id: hotel.id
			},
            long: hotel.lng,
            lat: hotel.lat,
			isDeliveryMode: true
        });
    }

	hotelTransform(data: any): any {
		let result = data.hotel_info;
		result.quantity = data.total || data.total_of_luggage;
		result.listOrder = data.hotel_info.list_order_info.map(item => {
			return this.orderInfoTransform(item);
		});
		return result;
	}

	hotelTransformForTransferMode(data: any): any {
		let result = data;
		result.id = data.hotel_id;
		result.name = data.hotel_name;
		result.address = data.hotel_address;
		result.quantity = data.total;
		return result;
	}

	orderInfoTransform(data: any): any {
		let result = {
			name: data.user_info ? this.getFullName(data.user_info.first, data.user_info.last) : '',
			receiver: data.guest_name,
			room: data.room_no,
			orderId: data.order_id || data.id,
			numberOfLuggage: data.no_of_luggage
		};
		return result;
	}

	loadListHotel() {
		if (this.isAcceptLuggageMode) {
			this.loadListHotelForAcceptOrderMode();
			return;
		}
		if (this.isTransferMode) {
			this.loadListHotelForTransferMode();
			return;
		}
		this.loadListHotelForDeliveryMode();
	}

	loadListHotelForDeliveryMode() {
		this.deliveryModeService.getListHotel().subscribe(
			res => {
				this.listHotel = res.map(item => {
					return this.hotelTransform(item);
				});
			},
			(err: any) => {
				this.listHotel = [];
				if (err.code != -888) {
					this.showError(err.message);
				}
			}
		);
	}

	loadListHotelForTransferMode() {
		this.collectionModeService.listHotelByTruckToTransfer(this.truck.id).subscribe(
			res => {
				this.listHotel = res.map(item => {
					return this.hotelTransformForTransferMode(item);
				});
			},
			(err: any) => {
				this.showError(err.message);
			}
		);
	}

	listOrderByTruckAndHotelToTransfer(hotelId: string, callback?: (listOrder: Array<any>) => void) {
		this.collectionModeService.listOrderByTruckAndHotelToTransfer(this.truck.id, hotelId).subscribe(
			res => {
				let listOrder: Array<any> = res.map(item => {
					return this.orderInfoTransform(item);
				});
				if (callback) {
					callback(listOrder);
				}
			},
			(err: any) => {
				this.showError(err.message);
			}
		);
	}

	loadListHotelForAcceptOrderMode() {
		this.collectionModeService.listHotelByTruckToAccept(this.truck.id).subscribe(
			res => {
				this.listHotel = res.map(item => {
					return this.hotelTransformForTransferMode(item);
				});
			},
			(err: any) => {
				this.showError(err.message);
			}
		);
	}

	listOrderByTruckAndHotelToAccept(hotelId: string, callback?: (listOrder: Array<any>) => void) {
		this.collectionModeService.listOrderByTruckAndHotelToAccept(this.truck.id, hotelId).subscribe(
			res => {
				let listOrder: Array<any> = res.map(item => {
					return this.orderInfoTransform(item);
				});
				if (callback) {
					callback(listOrder);
				}
			},
			(err: any) => {
				this.showError(err.message);
			}
		);
	}

}
