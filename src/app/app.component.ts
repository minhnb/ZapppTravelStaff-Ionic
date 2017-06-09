import { Component, ViewChild, Injector } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { BaseComponent } from './base.component';

import { UserService } from './services/user';

import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { SchedulePage } from '../pages/schedule';
import { UserStartPage } from '../pages/user-start';

@Component({
	templateUrl: 'app.html',
	providers: [UserService]
})
export class MyApp extends BaseComponent {
	@ViewChild(Nav) nav: Nav;

	rootPage: any = LoginPage;

	pages: Array<{ title: string, component: any }>;

	constructor(private injector: Injector, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private userService: UserService) {
		super(injector);
		this.initializeApp();

		// used for an example of ngFor and navigation
		this.pages = [
			{ title: 'Home', component: UserStartPage },
			{ title: 'List', component: ListPage },
			{ title: 'Schedule', component: SchedulePage }
		];

	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			this.statusBar.styleDefault();
			this.splashScreen.hide();
		});
	}

	openPage(page) {
		// Reset the content nav to have just this page
		// we wouldn't want the back button to show in this scenario
		this.nav.setRoot(page.component);
	}

	logOut() {
		this.userService.logOut().subscribe(
			res => {
				this.nav.setRoot(LoginPage);
			},
			err => {
				this.showError(err.message);
			}
		)
	}
}
