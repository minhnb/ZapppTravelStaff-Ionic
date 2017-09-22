import { Injectable } from '@angular/core';

@Injectable()
export class DataShare {

    fcmToken: string;
    userInfo: any;
    backButtonAction: () => void;
    isUpdatedCurrentLocation: Boolean = false;
    isStartedGoogleAnalytics: Boolean = false;
    firstViewTrackByGoogleAnalytics: string;
    countShowingAlert: number = 0;
    hasGoogleMapNative: Boolean = false;
    googleMapNative: any;
    socket: any;
    currentChatRoom: string;
    chatContent: Array<any> = [];
    lastEmit: any;

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

    public setIsUpdatedCurrentLocation(isUpdatedCurrentLocation: Boolean) {
        this.isUpdatedCurrentLocation = isUpdatedCurrentLocation;
    }
}
