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
	}

	ionViewDidLoad() {

	}

	login() {
		this.hideKeyboard();
		this.userService.userLogIn(this.username, this.password).subscribe(
			res => {
				if (this.isDriver() || this.isAttedant() || this.isZappper()) {
					this.saveLocalStaffState(res.user);
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
}
