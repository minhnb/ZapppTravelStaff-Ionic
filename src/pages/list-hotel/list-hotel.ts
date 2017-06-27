import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { ListOrderPage } from '../list-order';

@IonicPage()
@Component({
	selector: 'page-list-hotel',
	templateUrl: 'list-hotel.html',
})
export class ListHotelPage extends BaseComponent {

    listHotel: Array<any> = [];

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams) {
		super(injector);
        this.listHotel = [
            {
                name: "Sheraton Hotel",
                address: "20 Nathan Rd, Hong Kong"
            },
            {
                name: "The Plaza Hotel",
                address: "193 Prince Edward Road West, Kowloon"
            },
            {
                name: "The Rex Hotel",
                address: "141 Nguyen Hue"
            },
            {
                name: "The Sayvoy",
                address: "Strand LD"
            },
            {
                name: "The Gritti Palace",
                address: "768 Eve"
            }
        ];
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ListHotelPage');
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

}
