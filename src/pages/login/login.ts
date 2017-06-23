import { Component, Injector } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { UserService } from '../../app/services/user';
import { SchedulePage } from '../schedule';
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
		this.username = 'test002@gmail.com';
		this.password = '1234567';
	}

	ionViewDidLoad() {

	}

	login() {
		this.userService.userLogIn(this.username, this.password).subscribe(
			res => {
				this.navCtrl.setRoot(UserStartPage);
			},
			err => {
				this.showError(err.message);
			}
		)
	}
}
