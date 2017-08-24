import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ZapppHttp } from './zapppHttp';

import { AppConfig } from '../app.config';
import { AppConstant } from '../app.constant';
import { DataShare } from '../helper/data.share';

@Injectable()
export class UserService {

	private userUrl = AppConfig.API_URL + 'user';
	errorWrongUserNameOrPassword: any;

	constructor(private zapppHttp: ZapppHttp, private dataShare: DataShare) { }

	saveUserToLocalStorage(user: any) {

	}

	saveUserAccessTokenToLocalStorage(data: any, role: string) {
		localStorage.setItem(AppConstant.ACCESS_TOKEN, data.access_token);
		localStorage.setItem(AppConstant.REFRESH_TOKEN, data.refresh_token);
		localStorage.setItem(AppConstant.EXPIRED_AT, data.expired_at);
		this.saveUserRole(role);
	}

	saveUserRole(role) {
		localStorage.setItem(AppConstant.ROLE, role);
	}

	clearLocalStorage() {
		localStorage.clear();
	}

	handleLoginSuccess(data: any): any {
		this.saveUserAccessTokenToLocalStorage(data, data.user.roles);
		return data;
	}

	public handleLogout(data: any): any {
		this.clearLocalStorage();
		return data;
	}

	pureLogIn(loginName: string, password: string, deviceToken: string, countryCode?: string): Observable<any> {
		let user = {
			email: loginName,
			password: password,
			device_token: deviceToken,
			country: countryCode
		};
		return this.zapppHttp.post(this.userUrl + '/login', user);
	}

	userLogIn(loginName: string, password: string, countryCode?: string): Observable<any> {
		return this.pureLogIn(loginName, password, this.dataShare.fcmToken, countryCode)
			.map(this.handleLoginSuccess.bind(this));
	}

    logOut(): Observable<any> {
        return this.zapppHttp.post(this.userUrl + '/logout', {})
			.map(this.handleLogout.bind(this));
    }

	getUserInfo(): Observable<any> {
		return this.zapppHttp.get(this.userUrl + '/detail');
	}

	updateDeviceToken(deviceToken: string) {
		let params = {
			device_token: deviceToken
		};
		return this.zapppHttp.post(this.userUrl + '/refresh_device_token', params);
	}
}
