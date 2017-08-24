import { Injectable } from '@angular/core';

@Injectable()
export class DataShare {

    fcmToken: string;
    userInfo: any;
    backButtonAction: () => void;

    public setFCMToken(fcmToken: string) {
		this.fcmToken = fcmToken;
	}

    public setUserInfo(userInfo: any) {
		this.userInfo = userInfo;
	}

    public setBackButtonAction(action: () => void) {
        this.backButtonAction = action;
    }

    public removeBackButtonAction() {
        this.backButtonAction = null;
    }

    public disableBackButtonAction() {
        this.backButtonAction = () => {

        };
    }
}
