import { Component, Injector, ElementRef } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { AppConstant } from './app.constant';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Diagnostic } from '@ionic-native/diagnostic';

import * as moment from 'moment';

@Component({

})
export class BaseComponent {
	public alertController: AlertController;
	public barcodeScanner: BarcodeScanner;
	public diagnostic: Diagnostic;
	hasGoogleMapNative: boolean = false;
	constructor(injector: Injector) {
		this.alertController = injector.get(AlertController);
		this.barcodeScanner = injector.get(BarcodeScanner);
		this.diagnostic = injector.get(Diagnostic);
	}

	isMobileDevice(platform: Platform): boolean {
		return platform.is('cordova') && (platform.is('ios') || platform.is('android'));
	}

	checkDevicePermission() {
		this.diagnostic.isLocationEnabled().then(isEnabled => {
			if (isEnabled) return;
			this.showConfirm('Please enable location service on your device', 'Error',
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
        this.presentAlert(title || 'Error', message, [{ text: buttonTitle || 'Close' }]);
	}

	showInfo(message: string, title?: string, buttonTitle?: string) {
        this.presentAlert(title || 'Info', message, [{ text: buttonTitle || 'Close' }]);
	}

    showConfirm(message: string, title?: string, okCallback?: () => void, cancelCallback?: () => void, okButtonTitle?: string, cancelButtonTitle?: string) {
        let buttons = [
            {
                text: cancelButtonTitle || 'Cancel',
                role: 'cancel',
                handler: () => {
                    if (cancelCallback) {
                        cancelCallback();
                    }
                }
            },
            {
                text: okButtonTitle || 'OK',
                handler: () => {
                    if (okCallback) {
                        okCallback();
                    }
                }
            }
        ];

        this.presentAlert(title || 'Confirm', message, buttons);
    }

	confirmBeforeLeaveView(message?: string, title?: string): Promise<{}> {
		return new Promise((resolve, reject) => {
			this.showConfirm(message || 'Are you sure you want to discard?', title || 'Discard',
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
            prompt: 'Place a barcode inside the scan area'
        };
		this.barcodeScanner.scan(barcodeScannerOptions).then((barcodeData) => {
            if (!barcodeData.cancelled) {
				callback(barcodeData.text);
            }
		}, (err) => {
			this.showError(JSON.stringify(err));
		});
	}
}