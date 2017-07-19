import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { AppConstant } from '../../app/app.constant';
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

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams,
		private staffService: StaffService, private events: Events) {
        super(injector);
		this.listRequest = navParams.data.listRequest;
		this.subscribeZappperNewRequestEvent();
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
				this.saveLocalCurrentJob(customer);
				this.goToDirectionPage(customer);
			},
			err => {
				this.showError(err.message);
			}
		);
	}

	goToDirectionPage(customer: any) {
		let params = {
			long: customer.long,
			lat: customer.lat,
			customer: customer
		}
		this.navCtrl.push(DirectionUserPage, params);
	}

	saveLocalCurrentJob(customer) {
		localStorage.setItem(AppConstant.CURRENT_JOB, JSON.stringify(customer));
	}

	subscribeZappperNewRequestEvent() {
		this.events.subscribe(AppConstant.NOTIFICATION_TYPE.PREFIX + AppConstant.NOTIFICATION_TYPE.REQUEST_ORDER, (data: any) => {
			if (!this.isZappper()) {
				return;
			}
			if (!this.isActiveCurrentPage(this.navCtrl)) {
				return;
			}
			this.showConfirm(this.translate.instant('ZAPPPER_ALERT_NEW_REQUEST'), this.translate.instant('ZAPPPER_ALERT_NEW_REQUEST_TITLE'),
				() => {
					this.navCtrl.popToRoot();
				});

		});
	}
}
