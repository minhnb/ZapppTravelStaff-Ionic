import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';

import { ListOrderPage } from '../list-order';
import { DirectionStopPage } from '../direction-stop';

import { DeliveryModeService } from '../../app/services/delivery-mode';

@IonicPage()
@Component({
	selector: 'page-list-hotel',
	templateUrl: 'list-hotel.html',
	providers: [DeliveryModeService]
})
export class ListHotelPage extends BaseComponent {

    listHotel: Array<any> = [];

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams, private deliveryModeService: DeliveryModeService) {
		super(injector);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ListHotelPage');
	}

	ionViewWillEnter() {
		this.loadListHotel();
	}

	goToHotelOrderPage(hotel: any) {
        let params = {
            pageName: hotel.name,
			listOrder: hotel.listOrder,
            isDeliveryMode: true
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
		result.luggageQuantity = data.total_of_luggage;
		result.listOrder = data.hotel_info.list_order_info.map(item => {
			return this.orderInfoTransform(item);
		});
		return result;
	}

	orderInfoTransform(data: any): any {
		let result = {
			name: data.user_info ? this.getFullName(data.user_info.first, data.user_info.last) : '',
			receiver: data.guest_name,
			room: data.room_no,
			orderId: data.order_id,
			numberOfLuggage: data.no_of_luggage
		};
		return result;
	}

	loadListHotel() {
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

}
