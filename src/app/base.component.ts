import { Component, Injector, ElementRef } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { AppConstant } from './app.constant';

import * as moment from 'moment';

@Component({

})
export class BaseComponent {
	public alertController: AlertController;
	constructor(injector: Injector) {
		this.alertController = injector.get(AlertController);
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
}
