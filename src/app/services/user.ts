import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ZapppHttp } from './zapppHttp';

import { AppConfig } from '../app.config';
import { AppConstant } from '../app.constant';

@Injectable()
export class UserService {
	private userUrl = AppConfig.API_URL + 'auth';
	errorWrongUserNameOrPassword: any;

	constructor(private zapppHttp: ZapppHttp) { }

	saveUserToLocalStorage(user: any) {

	}

	saveUserAccessTokenToLocalStorage(data: any, role: string) {
		// let expiredAt = data.expired_at;
		localStorage.setItem(AppConstant.ACCESS_TOKEN, data.access_token);
		localStorage.setItem(AppConstant.REFRESH_TOKEN, data.refresh_token);
		localStorage.setItem(AppConstant.EXPIRED_AT, data.expired_at);
		localStorage.setItem(AppConstant.ROLE, role);
	}

	clearLocalStorage() {
		localStorage.clear();
	}

	handleLoginSuccess(data: any): any {
		let role = AppConstant.USER_ROLE.SENDER.toLowerCase();
		this.saveUserAccessTokenToLocalStorage(data, data.user.roles);
		return data;
	}

	handleLogout(data: any): any {
		this.clearLocalStorage();
		return data;
	}

	pureLogIn(loginName: string, password: string, countryCode?: string): Observable<any> {
		let user = {
			email: loginName,
			password: password,
			country: countryCode
		};
		return this.zapppHttp.post(AppConfig.API_URL + 'login', user);
	}

	userLogIn(loginName: string, password: string, countryCode?: string): Observable<any> {
		return this.pureLogIn(loginName, password, countryCode)
			.map(this.handleLoginSuccess.bind(this));
	}

    logOut(): Observable<any> {
        return this.zapppHttp.post(this.userUrl + '/logout', {})
			.map(this.handleLogout.bind(this))
			.catch(this.handleLogout.bind(this));;
    }

	getUserInfo(): Observable<any> {
		return this.zapppHttp.get(AppConfig.API_URL + 'me');
	}
}
