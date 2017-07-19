import { Injectable } from '@angular/core';

@Injectable()
export class DataShare {

    fcmToken: string;

    public setFCMToken(fcmToken: string) {
		this.fcmToken = fcmToken;
	}
}
