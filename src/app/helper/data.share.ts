import { Injectable } from '@angular/core';

@Injectable()
export class DataShare {

    fcmToken: string;
    userInfo: any;

    public setFCMToken(fcmToken: string) {
		this.fcmToken = fcmToken;
	}

    public setUserInfo(userInfo: any) {
		this.userInfo = userInfo;
	}
}
