import { Component, ViewChild, Injector } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';

import { BaseComponent } from './base.component';
import { AppConstant } from './app.constant';

import { UserService } from './services/user';
import { StaffService } from './services/staff';
import { DataShare } from './helper/data.share';

import { LoginPage } from '../pages/login/login';
import { UserStartPage } from '../pages/user-start';

import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';

@Component({
	templateUrl: 'app.html',
	providers: [UserService, StaffService]
})
export class MyApp extends BaseComponent {
	@ViewChild(Nav) nav: Nav;

	deviceHeight: number = 0;
	rootPage: any = LoginPage;
	pages: Array<{ title: string, component: any }>;
	watchPositionSubscription: any;
	watchPositionObserverble: any;

	constructor(private injector: Injector, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
		private fcm: FCM, private userService: UserService, private staffService: StaffService, private geolocation: Geolocation,
		private events: Events, private dataShare: DataShare) {
		super(injector);

		this.pages = [
			// { title: 'Home', component: UserStartPage },
			// { title: 'Schedule', component: SchedulePage }
		];
		this.initWatchPosition();
		this.subcribeUserActiveEvent();

		this.initializeApp();
	}

	initializeApp() {
		if (this.isLoggedIn()) {
			this.rootPage = UserStartPage;
			if (this.isZappper() || this.isDriver()) {
				this.subcribeWatchPosition();
			}
		}
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			this.splashScreen.hide();
			this.registerFCM();
			this.defineLangs();
			this.deviceHeight = this.platform.height();
		});
	}

	registerFCM() {
		if (this.isMobileDevice(this.platform)) {
			let fcm = this.fcm;
			// fcm.subscribeToTopic('marketing');

			fcm.getToken().then(token => {
				// alert('registerToken' + token);
				console.log('registerToken' + token);
				this.dataShare.setFCMToken(token);
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
		if (this.isZappper()) {
			this.unsubcribeWatchPosition();
		}
	}

	updateCurrentLocation(lat: number, long: number) {
		if (this.isZappper()) {
			this.zappperUpdateCurrentLocation(lat, long);
			return;
		}
		if (this.isDriver()) {
			this.driverUpdateCurrentLocation(lat, long);
		}
	}

	zappperUpdateCurrentLocation(lat: number, long: number) {
		this.staffService.zappperUpdateCurrentLocation(lat, long, false).subscribe(
			res => {

			},
			err => {

			}
		)
	}

	driverUpdateCurrentLocation(lat: number, long: number) {
		this.staffService.driverUpdateCurrentLocation(lat, long, false).subscribe(
			res => {

			},
			err => {

			}
		)
	}

	initWatchPosition() {
		let watchOption: GeolocationOptions = {
			timeout: AppConstant.WATCH_POSITION_INTERVAL
		};
		this.watchPositionObserverble = this.geolocation.watchPosition(watchOption);
	}

	subcribeWatchPosition() {
		if (!this.watchPositionObserverble) {
			return;
		}
		this.watchPositionSubscription = this.watchPositionObserverble.subscribe((resp) => {
			if (!resp.coords) {
				return;
			}
			this.updateCurrentLocation(resp.coords.latitude, resp.coords.longitude);
		});
	}

	unsubcribeWatchPosition() {
		if (this.watchPositionSubscription) {
			this.watchPositionSubscription.unsubscribe();
			this.watchPositionSubscription = null;
		}
	}

	subcribeUserActiveEvent() {
		this.events.subscribe('user:active', (data: any) => {
			console.log(data);
			if (!this.isZappper() && this.isDriver()) {
				return;
			}
			if (data.isActive) {
				this.subcribeWatchPosition();
			} else {
				this.unsubcribeWatchPosition();
			}
		});
	}
}
