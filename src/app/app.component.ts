import { Component, ViewChild, Injector } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';

import { BaseComponent } from './base.component';
import { AppConstant } from './app.constant';
import { AppConfig } from './app.config';

import { UserService } from './services/user';
import { StaffService } from './services/staff';
import { DataShare } from './helper/data.share';

import { LoginPage } from '../pages/login/login';
import { UserStartPage } from '../pages/user-start';

import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { BackgroundModeConfiguration } from '@ionic-native/background-mode';

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
	serverName: string;

	constructor(private injector: Injector, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
		private fcm: FCM, private userService: UserService, private staffService: StaffService, private geolocation: Geolocation,
		private dataShare: DataShare) {
		super(injector);

		this.pages = [
			// { title: 'Home', component: UserStartPage },
			// { title: 'Schedule', component: SchedulePage }
		];
		this.initWatchPosition();
		this.subcribeUserActiveEvent();
		this.getServerName();

		this.initializeApp();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			this.splashScreen.hide();
			this.registerFCM();
			this.defineLangs();
			this.deviceHeight = this.platform.height();

			if (this.isLoggedIn()) {
				this.rootPage = UserStartPage;
			}

			this.enableBackgroundMode();
		});
		this.platform.resume.subscribe(() => {
			this.announceAppIsResuming();
		});
	}

	registerFCM() {
		if (this.isMobileDevice(this.platform)) {
			let fcm = this.fcm;
			// fcm.subscribeToTopic('marketing');

			fcm.getToken().then(token => {
				this.updateDeviceToken(token);
			});

			fcm.onNotification().subscribe((data: any) => {
				if (data.wasTapped) {
					console.log("Received in background");
					console.log(JSON.stringify(data));
					this.handleZapppBackgroundNotification(data);
				} else {
					console.log("Received in foreground");
					console.log(JSON.stringify(data));
					this.handleZapppNotification(data);
				};
			});

			fcm.onTokenRefresh().subscribe(token => {
				this.updateDeviceToken(token);
			});

			// fcm.unsubscribeFromTopic('marketing');
		}
	}

	enableBackgroundMode() {
		let backgroundModeConfiguration: BackgroundModeConfiguration = {
			silent: true
		}
		this.backgroundMode.setDefaults(backgroundModeConfiguration);
		this.backgroundMode.enable();
	}

	announceAppIsResuming() {
		console.log('announceAppIsResuming');
		this.events.publish(AppConstant.EVENT_TOPIC.APP_RESUMING);
	}

	getServerName() {
		let urlWithoutHttp = AppConfig.API_URL.split('://')[1];
		if (urlWithoutHttp) {
			this.serverName = urlWithoutHttp.split('.')[0];
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
		this.unsubcribeWatchPosition();
		this.userService.logOut().subscribe(
			res => {
				this.nav.setRoot(LoginPage);
			},
			err => {
				this.userService.handleLogout(err);
				this.nav.setRoot(LoginPage);
				this.showError(err.message);
			}
		);
	}

	updateDeviceToken(deviceToken: string) {
		console.log('registerToken' + deviceToken);
		this.dataShare.setFCMToken(deviceToken);
		if (!this.isLoggedIn()) {
			return;
		}
		this.userService.updateDeviceToken(deviceToken).subscribe(
			res => {

			},
			err => {
				this.showError(err.message);
			}
		);
	}

	updateCurrentLocation(lat: number, long: number) {
		if (this.isZappper()) {
			this.zappperUpdateCurrentLocation(lat, long);
			return;
		}
		this.staffUpdateCurrentLocation(lat, long);
		if (this.isDriver()) {
			this.truckUpdateCurrentLocation(lat, long);
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

	staffUpdateCurrentLocation(lat: number, long: number) {
		this.staffService.staffUpdateCurrentLocation(lat, long, false).subscribe(
			res => {

			},
			err => {

			}
		)
	}

	truckUpdateCurrentLocation(lat: number, long: number) {
		this.staffService.truckUpdateCurrentLocation(lat, long, false).subscribe(
			res => {

			},
			err => {

			}
		)
	}

	initWatchPosition() {
		let watchOption: GeolocationOptions = this.initGeolocationOption();
		this.watchPositionObserverble = this.geolocation.watchPosition(watchOption);
	}

	subcribeWatchPosition() {
		if (!this.watchPositionObserverble) {
			return;
		}
		this.watchPositionSubscription = this.watchPositionObserverble.subscribe((resp) => {
			if (!resp.coords || !this.isNeedReceiveWatchPositionResult()) {
				return;
			}
			this.updateCurrentLocation(resp.coords.latitude, resp.coords.longitude);
		});
	}

	unsubcribeWatchPosition() {
		this.lastWatchPosition = 0;
		if (this.watchPositionSubscription) {
			this.watchPositionSubscription.unsubscribe();
			this.watchPositionSubscription = null;
		}
	}

	subcribeUserActiveEvent() {
		this.events.subscribe(AppConstant.EVENT_TOPIC.USER_ACTIVE, (data: any) => {
			if (data.isActive) {
				this.subcribeWatchPosition();
			} else {
				this.unsubcribeWatchPosition();
			}
		});
	}

	notificationTypeIsInList(topic: string) {
		let listServerNotificationEvent = this.listServerNotificationEvent();
		return listServerNotificationEvent.indexOf(topic) > -1;
	}

	handleZapppNotification(data: any) {
		let topic = AppConstant.NOTIFICATION_TYPE.PREFIX + data.type;
		this.events.publish(topic, data);
		if (!this.notificationTypeIsInList(topic)) {
			this.showInfo(data.body, data.title);
		}
	}

	handleZapppBackgroundNotification(data: any) {
		let topic = AppConstant.BACKGROUND_NOTIFICATION_TYPE.PREFIX + data.type;
		setTimeout(() => {
			this.events.publish(topic, data);
		}, 1000);
	}
}
