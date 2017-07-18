import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { DirectionUserPage } from '../direction-user';
import { StaffService } from '../../app/services/staff';

@IonicPage()
@Component({
	selector: 'page-list-request',
	templateUrl: 'list-request.html',
	providers: [StaffService]
})
export class ListRequestPage extends BaseComponent {

	listRequest: Array<any> = [];
	defaultAvatar: string = 'assets/images/no-photo.png';

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams, private staffService: StaffService) {
        super(injector);
		this.listRequest = navParams.data.listRequest;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ListRequestPage');
	}

    dismissView(event) {
        this.navCtrl.pop();
    }

	takeRequest(customer: any) {
		this.staffService.zappperAcceptLuggage(customer.orderId).subscribe(
			res => {
				this.gotoDirectionPage(customer);
			},
			err => {
				this.showError(err.message);
			}
		);
	}

	gotoDirectionPage(customer: any) {
		let params = {
			long: customer.long,
			lat: customer.lat,
			customer: customer
		}
		this.navCtrl.push(DirectionUserPage, params);
	}
}
