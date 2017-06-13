import { Component, Injector, ElementRef } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { AppConstant } from './app.constant';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

import * as moment from 'moment';

@Component({

})
export class BaseComponent {
	public alertController: AlertController;
	public barcodeScanner: BarcodeScanner;
	constructor(injector: Injector) {
		this.alertController = injector.get(AlertController);
		this.barcodeScanner = injector.get(BarcodeScanner);
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

    private presentAlert(title: string, subTitle: string, buttons: Array<any>) {
        let alert = this.alertController.create({
			title: title,
			subTitle: subTitle,
			buttons: buttons
		});
		alert.present();
    }

    showError(message: string, title?: string, buttonTitle?: string) {
        this.presentAlert(title || 'Error', message, [buttonTitle || 'Close']);
	}

	showInfo(message: string, title?: string, buttonTitle?: string) {
        this.presentAlert(title || 'Info', message, [buttonTitle || 'Close']);
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
