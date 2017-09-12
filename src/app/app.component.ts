import { Component, ViewChild, Injector, NgZone } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';

import { BaseComponent } from './base.component';
import { AppConstant } from './app.constant';
import { AppConfig } from './app.config';

import { UserService } from './services/user';
import { StaffService } from './services/staff';

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
		private fcm: FCM, public zone: NgZone, private userService: UserService, private staffService: StaffService, private geolocation: Geolocation) {
		super(injector);

		this.pages = [
			// { title: 'Home', component: UserStartPage },
			// { title: 'Schedule', component: SchedulePage }
		];
		this.initWatchPosition();
		this.subcribeUserActiveEvent();
		this.subcribeRefreshTokenInvalidEvent();
		this.subcribeUserInvalidEvent();
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
			this.registerBackButtonAction();
			this.startGoogleAnalytic();
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
					this.log("Received in background");
					this.log(data);
					this.handleZapppBackgroundNotification(data);
				} else {
					this.log("Received in foreground");
					this.log(data);
					this.handleZapppNotification(data);
				};
			});

			fcm.onTokenRefresh().subscribe(token => {
				this.updateDeviceToken(token);
			});

			// fcm.unsubscribeFromTopic('marketing');
		}
	}

	registerBackButtonAction() {
		this.platform.registerBackButtonAction(() => {
			if (this.dataShare.backButtonAction) {
				this.dataShare.backButtonAction();
				return;
			}
			if (this.nav.canGoBack()) {
				this.nav.pop();
			}
		});
	}

	enableBackgroundMode() {
		let backgroundModeConfiguration: BackgroundModeConfiguration = {
			silent: true
		}
		this.backgroundMode.setDefaults(backgroundModeConfiguration);
		this.backgroundMode.enable();
	}

	startGoogleAnalytic() {
		this.googleAnalytics.startTrackerWithId(AppConfig.GOOGLE_ANALYTICS_TRACKING_ID)
			.then(() => {
				this.log('Google analytics is ready now');
				this.dataShare.isStartedGoogleAnalytics = true;
				if (this.dataShare.firstViewTrackByGoogleAnalytics && this.dataShare.firstViewTrackByGoogleAnalytics != this.constructor.name) {
					this.googleAnalytics.trackView(this.dataShare.firstViewTrackByGoogleAnalytics);
				}
			})
			.catch(e => {
				this.log('Error starting GoogleAnalytics');
				this.log(e);
			});
	}

	announceAppIsResuming() {
		this.log('announceAppIsResuming');
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
		this.userService.logOut().subscribe(
			res => {
				this.goBackToLoginPage();
			},
			err => {
				this.userService.handleLogout(err);
				this.goBackToLoginPage();
				this.showError(err.message);
			}
		);
	}

	updateDeviceToken(deviceToken: string) {
		this.log('registerToken ' + deviceToken);
		if (!deviceToken) {
			return;
		}
		this.dataShare.setFCMToken(deviceToken);
		if (!this.isLoggedIn()) {
			return;
		}
		this.userService.updateDeviceToken(deviceToken).subscribe(
			res => {

			},
			err => {
				// this.showError(err.message);
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
				this.handleFirstUpdateCurrentLocation();
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
		this.dataShare.setIsUpdatedCurrentLocation(false);
		if (this.watchPositionSubscription) {
			this.watchPositionSubscription.unsubscribe();
			this.watchPositionSubscription = null;
		}
	}

	handleFirstUpdateCurrentLocation() {
		if (!this.dataShare.isUpdatedCurrentLocation) {
			this.dataShare.setIsUpdatedCurrentLocation(true);
			this.announceFirstUpdateCurrentLocationEvent();
		}
	}

	announceFirstUpdateCurrentLocationEvent() {
		this.events.publish(AppConstant.EVENT_TOPIC.CURRENT_LOCATION_FIRST_UPDATE);
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

	subcribeRefreshTokenInvalidEvent() {
		this.events.subscribe(AppConstant.EVENT_TOPIC.REFRESH_TOKEN_INVALID, (data: any) => {
			this.goBackToLoginPage();
		});
	}

	subcribeUserInvalidEvent() {
		this.events.subscribe(AppConstant.EVENT_TOPIC.USER_INVALID, (data: any) => {
			this.goBackToLoginPage();
		});
	}

	goBackToLoginPage() {
		this.unsubcribeWatchPosition();
		this.nav.setRoot(LoginPage);
	}

	notificationTypeIsInList(topic: string) {
		let listServerNotificationEvent = this.listServerNotificationEvent();
		return listServerNotificationEvent.indexOf(topic) > -1;
	}

	handleZapppNotification(data: any) {
		if (data.type == AppConstant.NOTIFICATION_TYPE.LOGGED_IN_FROM_ANOTHER_DEVICE) {
			this.handleNotificationUserLoginFromAnotherDevice(data);
			return;
		}
		let topic = AppConstant.NOTIFICATION_TYPE.PREFIX + data.type;
		this.events.publish(topic, data);
		if (!this.notificationTypeIsInList(topic)) {
			this.showInfo(data.body, data.title);
		}
	}

	handleNotificationUserLoginFromAnotherDevice(data: any) {
		this.showInfo(this.translate.instant('ERROR_LOGGED_IN_FROM_ANOTHER_DEVICE'));
		this.userService.handleLogout(data);
		this.zone.run(() => {
			this.goBackToLoginPage();
		});
	}

	handleZapppBackgroundNotification(data: any) {
		let topic = AppConstant.BACKGROUND_NOTIFICATION_TYPE.PREFIX + data.type;
		setTimeout(() => {
			this.events.publish(topic, data);
		}, 1000);
	}
}
