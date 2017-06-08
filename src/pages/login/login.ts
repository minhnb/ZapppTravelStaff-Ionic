import { Component, Injector } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { UserService } from '../../app/services/user';
import { SchedulePage } from '../schedule';

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
		this.userService.userLogIn(this.username, this.password).subscribe(
			res => {
				this.navCtrl.setRoot(SchedulePage);
			},
			err => {
				this.showError(err.message);
			}
		)
	}
}
