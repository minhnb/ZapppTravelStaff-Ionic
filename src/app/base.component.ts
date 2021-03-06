import { Component, Injector, ElementRef } from '@angular/core';
import { Platform, AlertController, ToastController, NavController, Events } from 'ionic-angular';
import { AppConstant } from './app.constant';
import { AppConfig } from './app.config';
import { DataShare } from './helper/data.share';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Diagnostic } from '@ionic-native/diagnostic';
import { TranslateService } from '@ngx-translate/core';
import { GeolocationOptions } from '@ionic-native/geolocation';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { Keyboard } from '@ionic-native/keyboard';
import { BackgroundMode } from '@ionic-native/background-mode';
import { CallNumber } from '@ionic-native/call-number';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

import * as moment from 'moment';

@Component({

})
export class BaseComponent {

	public alertController: AlertController;
	public toastController: ToastController;
	public barcodeScanner: BarcodeScanner;
	public diagnostic: Diagnostic;
	public translate: TranslateService;
	public spinnerDialog: SpinnerDialog;
	public events: Events;
	public keyboard: Keyboard;
	public backgroundMode: BackgroundMode;
	public dataShare: DataShare;
	public callNumber: CallNumber;
	public googleAnalytics: GoogleAnalytics;

	defaultAvatar: string = AppConstant.DEFAULT_AVATAR;
	hasGoogleMapNative: boolean = false;
	lastWatchPosition: number = 0;
	isDestroyed: boolean = false;
	needSubcribeKeyboardEvent: boolean = false;
	keyboardOnShowEvent: any;
	keyboardOnHideEvent: any;

	constructor(injector: Injector) {
		this.alertController = injector.get(AlertController);
		this.toastController = injector.get(ToastController);
		this.barcodeScanner = injector.get(BarcodeScanner);
		this.diagnostic = injector.get(Diagnostic);
		this.translate = injector.get(TranslateService);
		this.spinnerDialog = injector.get(SpinnerDialog);
		this.events = injector.get(Events);
		this.keyboard = injector.get(Keyboard);
		this.backgroundMode = injector.get(BackgroundMode);
		this.dataShare = injector.get(DataShare);
		this.callNumber = injector.get(CallNumber);
		this.googleAnalytics = injector.get(GoogleAnalytics);

		this.subcribeEventAppIsResuming();
		this.dataShare.removeBackButtonAction();
		this.dataShare.hasGoogleMapNative = this.hasGoogleMapNative;
		this.googleAnalyticsTrackCurrentView();
	}

	ionViewWillUnload() {
		this.isDestroyed = true;
	}

	isLoggedIn(): boolean {
		if (localStorage.getItem(AppConstant.ACCESS_TOKEN)) {
			return true;
		}
		return false;
	}

	isDriver(): boolean {
		return localStorage.getItem(AppConstant.ROLE) == AppConstant.USER_ROLE.DRIVER;
	}

	isAttedant(): boolean {
		return localStorage.getItem(AppConstant.ROLE) == AppConstant.USER_ROLE.ATTENDANT;
	}

	isZappper(): boolean {
		return localStorage.getItem(AppConstant.ROLE) == AppConstant.USER_ROLE.ZAPPPER;
	}

	getUserRole(): string {
		return localStorage.getItem(AppConstant.ROLE);
	}

	isActiveCurrentPage(navCtrl: NavController) {
		return navCtrl.getActive().instance == this;
	}

	isMobileDevice(platform: Platform): boolean {
		return platform.is('cordova') && (platform.is('ios') || platform.is('android'));
	}

	isPlatformiOS(platform: Platform): boolean {
		return platform.is('cordova') && platform.is('ios');
	}

	isPlatformAndroid(platform: Platform): boolean {
		return platform.is('cordova') && platform.is('android');
	}

	checkDevicePermission() {
		this.diagnostic.isLocationEnabled().then(isEnabled => {
			if (isEnabled) return;
			this.showConfirm(this.translate.instant('CONFIRM_ENABLE_LOCATION_SERVICE'), this.translate.instant('CONFIRMAION_LOCATION'),
				() => {
					this.diagnostic.switchToLocationSettings();
				});
		});
	}

	setFocusInput(elementRef: ElementRef) {
		setTimeout(function() {
			elementRef.nativeElement.focus();
		}, 0);
	}

	timeStampToDateTime(timeStamp: number): string {
		return moment.unix(timeStamp).format(AppConstant.FORMAT_DATETIME);
	}

	timeStampToDateTimeWithSecond(timeStamp: number): string {
		return moment.unix(timeStamp).format(AppConstant.FORMAT_DATETIME_WITH_SECOND);
	}

	disableMapClickable() {
		if (this.dataShare.googleMapNative) {
			this.dataShare.googleMapNative.setClickable(false);
		}
	}

	enableMapClickable() {
		if (this.dataShare.googleMapNative) {
			this.dataShare.googleMapNative.setClickable(true);
		}
	}

	handleMapClickableByCountingShowingAlert() {
		if (this.dataShare.countShowingAlert > 0) {
			this.dataShare.countShowingAlert--;
		}
		if (this.dataShare.countShowingAlert == 0) {
			this.enableMapClickable();
		}
	}

	handleMapClickable(buttons: Array<any>) {
		this.disableMapClickable();
		this.dataShare.countShowingAlert++;
		buttons = buttons.map(button => {
			if (button.handler) {
				let handlerFunction = button.handler;
				button.handler = () => {
					handlerFunction();
					this.handleMapClickableByCountingShowingAlert();
				};

			} else {
				button.handler = () => {
					this.handleMapClickableByCountingShowingAlert();
				};
			}
			return button;
		});
	}

    private presentAlert(title: string, subTitle: string, buttons: Array<any>) {
		if (this.isDestroyed) {
			return;
		}
		if (this.dataShare.hasGoogleMapNative) {
			this.handleMapClickable(buttons);
		}
        let alert = this.alertController.create({
			title: title,
			subTitle: subTitle,
			buttons: buttons,
			enableBackdropDismiss: false
		});
		alert.present();
    }

    showError(message: string, title?: string, buttonTitle?: string) {
        this.presentAlert(title || this.translate.instant('ERROR'), message, [{ text: buttonTitle || this.translate.instant('BUTTON_CLOSE') }]);
	}

	showInfo(message: string, title?: string, buttonTitle?: string) {
        this.presentAlert(title || this.translate.instant('INFO'), message, [{ text: buttonTitle || this.translate.instant('BUTTON_CLOSE') }]);
	}

	showInfoWithOkAction(message: string, title?: string, okCallback?: () => void, okButtonTitle?: string) {
		let buttons = [
            {
                text: okButtonTitle || this.translate.instant('BUTTON_OK'),
                handler: () => {
                    if (okCallback) {
                        okCallback();
                    }
                }
            }
        ];
        this.presentAlert(title || this.translate.instant('INFO'), message, buttons);
	}

    showConfirm(message: string, title?: string, okCallback?: () => void, cancelCallback?: () => void, okButtonTitle?: string, cancelButtonTitle?: string) {
        let buttons = [
            {
                text: cancelButtonTitle || this.translate.instant('BUTTON_CANCEL'),
                role: 'cancel',
                handler: () => {
                    if (cancelCallback) {
                        cancelCallback();
                    }
                }
            },
            {
                text: okButtonTitle || this.translate.instant('BUTTON_OK'),
                handler: () => {
                    if (okCallback) {
                        okCallback();
                    }
                }
            }
        ];

        this.presentAlert(title || this.translate.instant('CONFIRM'), message, buttons);
    }

	private presentCustomToast(message: string, duration: number, position: string, showCloseButton: boolean, closeButtonText: string, dismissOnPageChange: boolean, buttonCallback?: () => void) {
		let toast = this.toastController.create({
			message: message,
			position: position,
			showCloseButton: showCloseButton,
			closeButtonText: closeButtonText,
			dismissOnPageChange: dismissOnPageChange
		});

		let closedByTimeout = false;
		let timeoutHandle = setTimeout(() => {
			closedByTimeout = true;
			toast.dismiss();
		}, 5000);
		toast.onDidDismiss(() => {
			if (closedByTimeout) return;
			clearTimeout(timeoutHandle);
			if (buttonCallback) buttonCallback();
		});

		toast.present();
    }

	showBottomCustomToast(message: string, buttonCallback?: () => void, buttonTitle?: string) {
		this.presentCustomToast(message, 0, 'bottom', true, buttonTitle || this.translate.instant('BUTTON_OK'), false, buttonCallback);
	}

	confirmBeforeLeaveView(message?: string, title?: string): Promise<{}> {
		return new Promise((resolve, reject) => {
			this.showConfirm(message || this.translate.instant('CONFIRM_LEAVE_VIEW'), title || this.translate.instant('CONFIRMAION_DISCARD'),
				() => {
					resolve();
				},
				() => {
					reject();
				});
		});
	}

	scanQRCode(callback: (result: string) => void, label?: string) {
        let barcodeScannerOptions: BarcodeScannerOptions = {
            showFlipCameraButton: false,
            resultDisplayDuration: 0,
            prompt: label ? label : this.translate.instant('PROMPT_BARCODE_SCANNER')
        };
		this.barcodeScanner.scan(barcodeScannerOptions).then((barcodeData) => {
            if (!barcodeData.cancelled) {
				if (barcodeData.text) {
					callback(barcodeData.text);
				} else {
					this.showError(this.translate.instant('ERROR_EMPTY_QR_CODE'));
				}
            }
		}, (err) => {
			this.showError(JSON.stringify(err));
		});
	}

	isLuggageCode(code: string): boolean {
        if (code.startsWith(AppConstant.CODE_PREFIX.LUGGAGE)) {
            return true;
        }
        return false;
    }

    isStorageBinCode(code: string): boolean {
		if (code.startsWith(AppConstant.CODE_PREFIX.BIN)) {
            return true;
        }
        return false;
    }

	getIdFromCodeWithPrefix(code: string, prefix: string): string {
		if (code.startsWith(prefix)) {
			let codeSplitedArray = code.split(prefix);
			if (codeSplitedArray.length > 1 && codeSplitedArray[1].length) {
				return codeSplitedArray[1];
			}
        }
        return '';
    }

    getOrderIdFromOrderCode(code: string): string {
		return this.getIdFromCodeWithPrefix(code, AppConstant.CODE_PREFIX.ORDER);
    }

    getBinIdFromBinCode(code: string): string {
		return this.getIdFromCodeWithPrefix(code, AppConstant.CODE_PREFIX.BIN);
    }

	getDisplayLuggageCode(code: string) {
		let result = this.getIdFromCodeWithPrefix(code, AppConstant.CODE_PREFIX.LUGGAGE);
		if (result.length > AppConstant.DISPLAY_LUGGAGE_CODE_LENGTH) {
			return result.substring(0, AppConstant.DISPLAY_LUGGAGE_CODE_LENGTH);
		}
		return result;
	}

	getFullName(firstName: string, lastName: string): string {
		let names = [firstName, lastName];
		return names.filter(Boolean).join(' ');
	}

	listLuggageTransform(listServerLuggage: Array<any>): Array<any> {
		if (listServerLuggage) {
			return listServerLuggage.map(item => {
				return {
					id: item.id,
					luggageCode: item.luggage_id,
					storageBinCode: item.bin_id,
					storageBinName: item.bin
				}
			});
		}
		return null;
	}

	listLuggageReverseTransform(listLuggage: Array<any>): Array<any> {
		if (listLuggage) {
			return listLuggage.map(item => {
				return {
					luggage_id: item.luggageCode,
					bin: item.storageBinCode
				}
			});
		}
		return null;
	}

	customerInfoTransform(requestInfo: any): any {
		if (!requestInfo.user_request_info_first && !requestInfo.user_request_info_last && requestInfo.userRequestInfo) {
			requestInfo.user_request_info_first = requestInfo.userRequestInfo.first;
			requestInfo.user_request_info_last = requestInfo.userRequestInfo.last;
		}
		if (!requestInfo.hotel_info && requestInfo.hotelInfo) {
			requestInfo.hotel_info = requestInfo.hotelInfo;
		}
		if (!requestInfo.order_luggage_bin && requestInfo.bagLocationStorageInfo) {
			requestInfo.order_luggage_bin = requestInfo.bagLocationStorageInfo.map(item => {
				return {
					luggage_id: item.luggage_id,
					bin: item.bin_name,
					bin_id: item.truck_bin_id
				}
			});
		}
		let customerInfo = {
			name: this.getFullName(requestInfo.user_request_info_first, requestInfo.user_request_info_last),
			hotel: requestInfo.hotel_info ? requestInfo.hotel_info.name : '',
			address: requestInfo.hotel_info ? requestInfo.hotel_info.address : '',
			receiver: requestInfo.guest_name,
			room: requestInfo.room_no,
			listLuggage: this.listLuggageTransform(requestInfo.order_luggage_bin),
			isAttendantSaveMode: false,
			orderId: requestInfo.id,
			orderNo: requestInfo.id,
			alreadyCheckIn: Number(requestInfo.is_checked_in),
			pickupTime: requestInfo.pickup_at
		};
		return customerInfo;
	}

	truckTransform(truck: any): any {
		let truckTransform = {
			name: truck.truck_name,
			number: truck.truck_number,
			id: truck.truck_id,
			orderQuantity: truck.total ? truck.total : 0
		}
		return truckTransform;
	}

	binTransform(bin: any): any {
		return {
			id: bin.id,
			name: bin.name
		};
	}

	listBinTransform(listBin: Array<any>): Array<any> {
		if (!listBin) {
			return [];
		}
		return listBin.map(item => {
			return this.binTransform(item);
		});
	}

	initGeolocationOption(): GeolocationOptions {
		let geolocationOptions: GeolocationOptions = {
			// enableHighAccuracy: true,
			maximumAge: AppConstant.GET_LOCATION_TIMEOUT,
			timeout: AppConstant.GET_LOCATION_TIMEOUT
		};
		return geolocationOptions;
	}

	showLocationServiceProblemConfirmation() {
		this.showConfirm(this.translate.instant('CONFIRM_LOCATION_SERVICE_PROBLEM'), this.translate.instant('CONFIRMAION_LOCATION'),
			() => {
				this.diagnostic.switchToLocationSettings();
			});
	}

	isNeedReceiveWatchPositionResult(): boolean {
		let currentTimeStamp = (new Date).getTime();
		if (currentTimeStamp - this.lastWatchPosition < AppConstant.WATCH_POSITION_INTERVAL) {
			return false;
		}
		this.lastWatchPosition = currentTimeStamp;
		return true;
	}

	hasValidLocation(lat: any, long: any) {
		if (lat == undefined || lat == null || long == undefined || long == null) {
			return false;
		}
		if (Number(lat) == 0 && Number(long) == 0) {
			return false;
		}
		return true;
	}

	hideKeyboard() {
		this.keyboard.close();
	}

	handleEventKeyboardShow(data: any) {

	}

	handleEventKeyboardHide(data: any) {

	}

	subcribeKeyboardEvent() {
		if (!this.needSubcribeKeyboardEvent) {
			return;
		}
		this.keyboardOnShowEvent = this.keyboard.onKeyboardShow().subscribe((data: any) => {
			this.handleEventKeyboardShow(data);
		});
		this.keyboardOnHideEvent = this.keyboard.onKeyboardHide().subscribe((data: any) => {
			this.handleEventKeyboardHide(data);
		});
	}

	unsubscribeKeyboardEvent() {
		if (!this.needSubcribeKeyboardEvent) {
			return;
		}
		this.keyboardOnShowEvent.unsubscribe();
		this.keyboardOnHideEvent.unsubscribe();
	}

	listLocalEvent() {
		return Object.keys(AppConstant.EVENT_TOPIC).map((item) => {
			let topic = AppConstant.EVENT_TOPIC[item];
			return topic;
		});
	}

	listServerNotificationEvent() {
		let serverNotificationValues: Array<string> = Object.keys(AppConstant.NOTIFICATION_TYPE).map((item) => {
			let topic = AppConstant.NOTIFICATION_TYPE.PREFIX + AppConstant.NOTIFICATION_TYPE[item];
			return topic;
		});
		return serverNotificationValues.filter((item) => {
			return item != (AppConstant.NOTIFICATION_TYPE.PREFIX + AppConstant.NOTIFICATION_TYPE.PREFIX);
		});
	}

	unsubcribeAllEvent() {
		let listLocalEvent = this.listLocalEvent();
		let listServerNotificationEvent = this.listServerNotificationEvent();
		let allEvents = listLocalEvent.concat(listServerNotificationEvent);
		allEvents.forEach(topic => {
			this.events.unsubscribe(topic);
		});
	}

	subcribeEventAppIsResuming() {
		this.events.subscribe(AppConstant.EVENT_TOPIC.APP_RESUMING, (data) => {
			this.handleEventAppIsResuming(data);
		});
	}

	handleEventAppIsResuming(data?: any) {

	}

	trimText(s: string): string {
        if (s) {
            return s.trim().replace(/\s+/g, ' ');
        }
        return s;
    }

	saveLocalStaffState(user: any) {
		if (!user) {
			return;
		}
		let status = false;
		if (Number(user.is_availability)) {
			status = true;
			if ((this.isDriver() || this.isAttedant()) && user.truck_info) {
				localStorage.setItem(AppConstant.TRUCK, user.truck_info.id);
				let listBin = this.listBinTransform(user.truck_info.bins);
				localStorage.setItem(AppConstant.LIST_BIN, JSON.stringify(listBin));
			}
		}
		localStorage.setItem(AppConstant.STATUS, status.toString());
		localStorage.setItem(AppConstant.USER_ID, user.id);
	}

	saveLocalCurrentJob(customer) {
		localStorage.setItem(AppConstant.CURRENT_JOB, JSON.stringify(customer));
	}

	clearLocalCurrentJob() {
		localStorage.removeItem(AppConstant.CURRENT_JOB);
	}

	convertToValidPhoneNumber(phoneNumber: string): string {
		let plus = '+';
		if (phoneNumber.startsWith(plus)) {
			return phoneNumber;
		}
		return plus + phoneNumber;
	}

	callPhoneNumber(phoneNumber: string) {
		let validPhoneNumber = this.convertToValidPhoneNumber(phoneNumber);
		this.callNumber.callNumber(validPhoneNumber, true)
			.then(() => {

			})
			.catch(() => this.log('Error launching dialer'));
	}

	googleAnalyticsTrackCurrentView() {
		let currentView = this.constructor.name;
		if (this.dataShare.isStartedGoogleAnalytics) {
			this.googleAnalytics.trackView(currentView);
		} else {
			this.dataShare.firstViewTrackByGoogleAnalytics = currentView;
		}
	}

	log(content: any) {
		if (AppConfig.ENV != AppConstant.PRODUCTION_ENVIRONMENT) {
            console.log(JSON.stringify(content));
        }
	}
}
