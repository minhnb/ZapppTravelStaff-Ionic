import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';

import { StaffService } from '../../app/services/staff';
import { DirectionTruckPage } from '../direction-truck';

@IonicPage()
@Component({
	selector: 'page-find-truck',
	templateUrl: 'find-truck.html',
	providers: [StaffService]
})
export class FindTruckPage extends BaseComponent {

    listTruck: Array<any> = [];
	listDistrict: Array<any> = [];
	district: any;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams, private staffService: StaffService) {
        super(injector);

        this.listTruck = [
            {
                truck: {
					truckNumber: 'MZ9999',
				},
                currentStation: {
                    long: 106.702013,
					lat: 10.740790,
                    address: '469 Nguyen Huu Tho, Quan 7, HCMC',
					estimatedTime: '3 mins remaining'
                },
                nextStation: {
                    long: 106.702013,
					lat: 10.740790,
                    address: '555 Nguyen Huu Tho, Quan 7, HCMC',
					estimatedTime: '10 mins remaining'
                },
                contactNumber: '0123456789'
            },
            {
				truck: {
					truckNumber: 'MZ8888',
				},
                currentStation: {
                    long: 106.702013,
					lat: 10.740790,
                    address: '555 Nguyen Huu Tho, Quan 7, HCMC',
					estimatedTime: '3 mins remaining'
                },
                nextStation: {
                    long: 106.702013,
					lat: 10.740790,
                    address: '777 Nguyen Huu Tho, Quan 7, HCMC',
					estimatedTime: '10 mins remaining'
                },
                contactNumber: '0123456789'
            }
        ]
	}

	ionViewDidLoad() {
		this.log('ionViewDidLoad FindTruckPage');
		this.loadDistrict();
	}

	loadDistrict() {
		this.staffService.listDistrict().subscribe(
			res => {
				this.listDistrict = [
					{
						name: 'All',
						id: ''
					}
				];
				res.forEach(item => {
					this.listDistrict.push(item);
				});
				this.district = '';
			},
			err => {
				this.showError(err.message);
			}
		)
	}

	onDistrictChange(event) {
		// this.log(event);
	}

	callDriver(phoneNumber: string) {
		this.callPhoneNumber(phoneNumber);
	}

	goToDirectionTruckPage(station: any, truck: any) {
		let params = station;
		params.truck = truck;
		this.navCtrl.push(DirectionTruckPage, params);
	}
}
