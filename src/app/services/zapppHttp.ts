import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import { AppConstant } from '../app.constant';
import { AppConfig } from '../app.config';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { TranslateService } from '@ngx-translate/core';

import { LoginPage } from '../../pages/login/login';

var ENV: string = 'dev';

@Injectable()
export class ZapppHttp {

    refreshTokenUrl: string = AppConfig.API_URL + '/user/refresh_token';

    constructor(private http: Http, private _spinner: SpinnerDialog, private translate: TranslateService, private events: Events) { }

    private getRequestOptionsByToken(method: string | RequestMethod, accessToken: string): RequestOptions {
        let headerParams = {};
        if (accessToken) {
            let jwt = 'JWT ' + accessToken;
            headerParams = {
                "Authorization": jwt
            };
        }
        if (method != RequestMethod.Get) {
            headerParams['Content-Type'] = 'application/json';
        }
        let headers = new Headers(headerParams);
        let options = new RequestOptions({ headers: headers });
        options.method = method;
        return options;
    }

    get(url: string, params?: Object, showSpinner: Boolean = true, needAccessToken: Boolean = true): Observable<any> {
        return this.request(RequestMethod.Get, url, null, params, showSpinner, needAccessToken);
    }

    post(url: string, data: Object, params?: Object, showSpinner: Boolean = true, needAccessToken: Boolean = true): Observable<any> {
        return this.request(RequestMethod.Post, url, data, params, showSpinner, needAccessToken);
    }

    put(url: string, data: Object, params?: Object, showSpinner: Boolean = true, needAccessToken: Boolean = true): Observable<any> {
        return this.request(RequestMethod.Put, url, data, params, showSpinner, needAccessToken);
    }

    delete(url: string, data: Object, params?: Object, showSpinner: Boolean = true, needAccessToken: Boolean = true): Observable<any> {
        return this.request(RequestMethod.Delete, url, data, params, showSpinner, needAccessToken);
    }

    request(method: RequestMethod, url: string, data?: Object, params?: Object, showSpinner: Boolean = true, needAccessToken: Boolean = true): Observable<any> {
        let accessToken = localStorage.getItem(AppConstant.ACCESS_TOKEN);
        if (needAccessToken && !accessToken) {
            return;
        }
        let options = this.getRequestOptionsByToken(method, accessToken);
        if (method != RequestMethod.Get) {
            options.body = JSON.stringify(data);
        }
        if (params) {
            let search: URLSearchParams = new URLSearchParams();
            for (let key in params) {
                search.set(key.toString(), params[key]);
            }
            options.search = search;
        }
        if (showSpinner) {
            this._spinner.show();
        }
        if (ENV != AppConstant.PRODUCTION_ENVIRONMENT) {
            console.log(method);
            console.log(url);
            console.log(JSON.stringify(params));
            console.log(JSON.stringify(data));
        }
        let self = this;
        let observer: Observable<any> = Observable.create(observer => {
            let requestSub = this.http.request(url, options)
				.map(this.extractData.bind(this))
				.catch((err: any) => {
                    return self.handleError(err, url, options, needAccessToken);
                });
            requestSub.subscribe(
                (res: any) => {
                    if (res.status && res.status.code > 0) {
                        observer.next(res.data);
                        observer.complete();
                    } else {
                        let err = res.status;
                        err.message = err.msg || this.translate.instant('ERROR_ZAPPP_HTTP_SERVER_ERROR');
                        observer.error(err);
                    }
                },
                err => {
                    observer.error(err);
                }
            );
        });
        return observer;
    }

    extractData(res: Response): any {
        this._spinner.hide();
        let response = res.json() || {};
        if (ENV != AppConstant.PRODUCTION_ENVIRONMENT) {
            console.log(JSON.stringify(response));
        }
		return response;
    }

    handleError(error: Response | any, url: string, options: RequestOptions, needAccessToken: Boolean): any {
        this._spinner.hide();
        if (ENV != AppConstant.PRODUCTION_ENVIRONMENT) {
            console.log(JSON.stringify(error));
        }
        if (error.status == 404) {
            error.message = this.translate.instant('ERROR_ZAPPP_HTTP_NOT_FOUND');
            return Observable.throw(error);
        }
        if (error.status == 401 && needAccessToken) {
            return this.refreshToken(url, options);
        }
        let errMsg;
        try {
            errMsg = this.jsonError(error);
        } catch (ex) {
            errMsg = {
                code: error.code,
                message: this.translate.instant('ERROR_ZAPPP_HTTP_SERVER_ERROR')
            }
            return Observable.throw(errMsg);
        }
        return Observable.throw(errMsg);
    }

    jsonError(error: Response | any): any {
        let errMsg: any;
		if (error instanceof Response) {
            if (error.status == 0) {
                let message = this.translate.instant('ERROR_ZAPPP_HTTP_CONNECTION_ERROR');
                errMsg = {
                    status: error.status,
                    message: message
                }
            } else {
                let errorJson = error.json();
                errMsg = errorJson.status;
                errMsg.message = errMsg.msg;
            }
		} else {
			errMsg = {
                message: error.message ? error.message : error.toString()
            }
		}
        return errMsg;
    }

    refreshToken(url: string, options: RequestOptions) {
        let refreshToken = localStorage.getItem(AppConstant.REFRESH_TOKEN);
        let method = RequestMethod.Post;
        let refreshTokenOptions = this.getRequestOptionsByToken(method, refreshToken);
        refreshTokenOptions.method = method;
        let refreshTokenUrl = this.refreshTokenUrl;
        refreshTokenOptions.body = JSON.stringify({});
        this._spinner.show();
        return this.http.request(refreshTokenUrl, refreshTokenOptions)
            .toPromise()
            .then((res: Response) => {
                let response = res.json() || {};
				this.updateLocalStorage(response.data);
                return this.resendRequest(url, options);
            })
            .catch(this.handleErrorRefreshToken.bind(this));
    }

    resendRequest(url: string, options: RequestOptions) {
        let accessToken = localStorage.getItem(AppConstant.ACCESS_TOKEN);
        let newOptions = this.getRequestOptionsByToken(options.method, accessToken);
        newOptions.search = options.search;
        if (options.method != RequestMethod.Get) {
			newOptions.body = options.body;
        }

        return this.http.request(url, newOptions)
            .toPromise()
			.then(this.extractData.bind(this))
			.catch(this.handleErrorAfterResendRequest.bind(this));
    }

    updateLocalStorage(data: any) {
        localStorage.setItem(AppConstant.ACCESS_TOKEN, data.access_token);
		localStorage.setItem(AppConstant.EXPIRED_AT, data.expired_at);
    }

    handleErrorAfterResendRequest(error: Response | any) {
        this._spinner.hide();
        let errMsg = this.jsonError(error);
        return Observable.throw(errMsg);
    }

    handleErrorRefreshToken(error: Response | any) {
        this._spinner.hide();
        let errMsg = this.jsonError(error);
        this.clearLocalStorage();
        this.announceRefreshTokenInvalid();
        return Promise.reject(errMsg);
    }

    announceRefreshTokenInvalid() {
        this.events.publish(AppConstant.EVENT_TOPIC.REFRESH_TOKEN_INVALID);
    }

    clearLocalStorage() {
		localStorage.clear();
	}
}
