import { Component, Injector } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { AppConstant } from '../../app/app.constant';

import { UserService } from '../../app/services/user';

import { UserStartPage } from '../user-start';

@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
	providers: [UserService]
})
export class LoginPage extends BaseComponent {

	username: string;
	password: string;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams, private userService: UserService) {
		super(injector);
		this.username = 'test@driver.zappp.com';
		this.password = '1234567';
	}

	ionViewDidLoad() {

	}

	login() {
		this.userService.userLogIn(this.username, this.password).subscribe(
			res => {
				if (this.isDriver() || this.isAttedant() || this.isZappper()) {
					this.saveLocalState(res);
					this.navCtrl.setRoot(UserStartPage);
				} else {
					this.showError(this.translate.instant('USER_NOT_STAFF'));
					localStorage.clear();
				}
			},
			err => {
				this.showError(err.message);
			}
		)
	}

	saveLocalState(res: any) {
		if (!res.user) {
			return;
		}
		let user = res.user;
		if (user.is_availability == '1') {
			let status = true;
			localStorage.setItem(AppConstant.STATUS, status.toString());
			if ((this.isDriver() || this.isAttedant()) && user.truck_info) {
				localStorage.setItem(AppConstant.TRUCK, user.truck_info.id);
			}
		}
	}
}
