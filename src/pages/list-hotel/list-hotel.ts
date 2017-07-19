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
        // this.listHotel = [
        //     {
        //         name: "Sheraton Hotel",
        //         address: "20 Nathan Rd, Hong Kong",
		// 		luggageQuantity: 10
        //     },
        //     {
        //         name: "The Plaza Hotel",
        //         address: "193 Prince Edward Road West, Kowloon",
		// 		luggageQuantity: 8
        //     },
        //     {
        //         name: "The Rex Hotel",
        //         address: "141 Nguyen Hue",
		// 		luggageQuantity: 15
        //     },
        //     {
        //         name: "The Sayvoy",
        //         address: "Strand LD",
		// 		luggageQuantity: 10
        //     },
        //     {
        //         name: "The Gritti Palace",
        //         address: "768 Eve",
		// 		luggageQuantity: 20
        //     }
        // ];
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
            listOrder: [
                {
                    name: 'Dolly Doe',
                    receiver: 'Dolly Doe',
					room: 245,
                    listLuggage: [
                        {
                            luggageCode: 'ZTL12789',
                            storageBinCode: 'A12'
                        }
                    ]
                },
                {
                    name: 'Jolly Doe',
					receiver: 'Dolly Doe',
					room: 245,
                    listLuggage: [
                        {
                            luggageCode: 'ZTL12790',
                            storageBinCode: 'A13'
                        }
                    ]
                },
                {
                    name: 'Nanny San',
					receiver: 'Dolly Doe',
					room: 245,
                    listLuggage: [
                        {
                            luggageCode: 'ZTL12791',
                            storageBinCode: 'A14'
                        }
                    ]
                },
                {
                    name: 'Fancy Lu',
					receiver: 'Dolly Doe',
					room: 245,
                    listLuggage: [
                        {
                            luggageCode: 'ZTL12792',
                            storageBinCode: 'A15'
                        }
                    ]
                }
            ],
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
		return result;
	}

	loadListHotel() {
		this.deliveryModeService.getListHotel().subscribe(
			res => {
				this.listHotel = res.map(item => {
					return this.hotelTransform(item);
				});
			},
			err => {
				this.showError(err.message);
			}
		);
	}

}
