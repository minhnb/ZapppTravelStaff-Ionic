import { Component, Injector, ElementRef } from '@angular/core';
import { Platform, AlertController, NavController } from 'ionic-angular';
import { AppConstant } from './app.constant';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Diagnostic } from '@ionic-native/diagnostic';
import { TranslateService } from '@ngx-translate/core';
import { GeolocationOptions } from '@ionic-native/geolocation';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';

import * as moment from 'moment';

@Component({

})
export class BaseComponent {

	public alertController: AlertController;
	public barcodeScanner: BarcodeScanner;
	public diagnostic: Diagnostic;
	public translate: TranslateService;
	public spinnerDialog: SpinnerDialog;

	hasGoogleMapNative: boolean = false;

	constructor(injector: Injector) {
		this.alertController = injector.get(AlertController);
		this.barcodeScanner = injector.get(BarcodeScanner);
		this.diagnostic = injector.get(Diagnostic);
		this.translate = injector.get(TranslateService);
		this.spinnerDialog = injector.get(SpinnerDialog);
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

	}

	enableMapClickable() {

	}

	handleMapClickable(buttons: Array<any>) {
		this.disableMapClickable();
		buttons = buttons.map(button => {
			if (button.handler) {
				let handlerFunction = button.handler;
				button.handler = () => {
					handlerFunction();
					this.enableMapClickable();
				};

			} else {
				button.handler = () => {
					this.enableMapClickable();
				};
			}
			return button;
		});
	}

    private presentAlert(title: string, subTitle: string, buttons: Array<any>) {
		if (this.hasGoogleMapNative) this.handleMapClickable(buttons);
        let alert = this.alertController.create({
			title: title,
			subTitle: subTitle,
			buttons: buttons
		});
		alert.present();
    }

    showError(message: string, title?: string, buttonTitle?: string) {
        this.presentAlert(title || this.translate.instant('ERROR'), message, [{ text: buttonTitle || this.translate.instant('BUTTON_CLOSE') }]);
	}

	showInfo(message: string, title?: string, buttonTitle?: string) {
        this.presentAlert(title || this.translate.instant('INFO'), message, [{ text: buttonTitle || this.translate.instant('BUTTON_CLOSE') }]);
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

	scanQRCode(callback: (result: string) => void) {
        let barcodeScannerOptions: BarcodeScannerOptions = {
            showFlipCameraButton: false,
            resultDisplayDuration: 0,
            prompt: this.translate.instant('PROMPT_BARCODE_SCANNER')
        };
		this.barcodeScanner.scan(barcodeScannerOptions).then((barcodeData) => {
            if (!barcodeData.cancelled) {
				callback(barcodeData.text);
            }
		}, (err) => {
			this.showError(JSON.stringify(err));
		});
	}

	isLuggageCode(code: string): boolean {
        if (code.startsWith('ZTL')) {
            return true;
        }
        return false;
    }

    isStorageBinCode(code: string): boolean {
        return true;
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
					storageBinCode: item.bin
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
		let customerInfo = {
			name: this.getFullName(requestInfo.user_request_info_first, requestInfo.user_request_info_last),
			hotel: requestInfo.hotel_info ? requestInfo.hotel_info.name : '',
			address: requestInfo.hotel_info ? requestInfo.hotel_info.address : '',
			receiver: requestInfo.guest_name,
			room: requestInfo.room_no,
			listLuggage: this.listLuggageTransform(requestInfo.order_luggage_bin),
			isAttendantSaveMode: false,
			orderId: requestInfo.id
		};
		return customerInfo;
	}

	initGeolocationOption(): GeolocationOptions {
		let geolocationOptions: GeolocationOptions = {
			enableHighAccuracy: true,
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
}
