import { Component, ViewChild, Injector } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';

import { BaseComponent } from './base.component';

import { UserService } from './services/user';

import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { SchedulePage } from '../pages/schedule';
import { UserStartPage } from '../pages/user-start';
import { CustomerLuggagePage } from '../pages/customer-luggage';
import { CollectionModePage } from '../pages/collection-mode';

@Component({
	templateUrl: 'app.html',
	providers: [UserService]
})
export class MyApp extends BaseComponent {
	@ViewChild(Nav) nav: Nav;

	rootPage: any = LoginPage;

	pages: Array<{ title: string, component: any }>;

	constructor(private injector: Injector, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
		private fcm: FCM, private userService: UserService) {
		super(injector);
		this.initializeApp();

		this.pages = [
			// { title: 'Home', component: UserStartPage },
			// { title: 'Schedule', component: SchedulePage }
		];
	}

	initializeApp() {
		if (this.isLoggedIn()) {
			this.rootPage = UserStartPage;
		}
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			this.splashScreen.hide();
			this.registerFCM();
			this.defineLangs();
		});
	}

	registerFCM() {
		if (this.isMobileDevice(this.platform)) {
			let fcm = this.fcm;
			// fcm.subscribeToTopic('marketing');

			fcm.getToken().then(token => {
				// alert('registerToken' + token);
				console.log('registerToken' + token);
			});

			fcm.onNotification().subscribe((data: any) => {
				if (data.wasTapped) {
					console.log("Received in background");
				} else {
					console.log("Received in foreground");
					console.log(JSON.stringify(data));
					this.showInfo(data.body, data.title);
				};
			});

			fcm.onTokenRefresh().subscribe(token => {
				// alert('registerToken' + token);
				console.log('registerToken' + token);
			});

			// fcm.unsubscribeFromTopic('marketing');
		}
	}

	defineLangs() {
		this.translate.addLangs(['en']);
		this.translate.setDefaultLang('en');
		this.translate.use('en');
	}

	openPage(page) {
		this.nav.setRoot(page.component);
	}

	logOut() {
		localStorage.clear();
		this.nav.setRoot(LoginPage);
		// this.userService.logOut().subscribe(
		// 	res => {
		// 		this.nav.setRoot(LoginPage);
		// 	},
		// 	err => {
		// 		this.showError(err.message);
		// 	}
		// )
	}
}
