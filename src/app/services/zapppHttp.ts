import { Injectable } from '@angular/core';
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

var ENV: string = 'dev';

@Injectable()
export class ZapppHttp {
    constructor(private http: Http, private _spinner: SpinnerDialog) { }

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

    private getRequestOptions(method: string | RequestMethod): RequestOptions {
        let accessToken = localStorage.getItem(AppConstant.ACCESS_TOKEN);
        return this.getRequestOptionsByToken(method, accessToken);
    }

    get(url: string, params?: Object, showSpinner: Boolean = true): Observable<any> {
        return this.request(RequestMethod.Get, url, null, params, showSpinner);
    }

    post(url: string, data: Object, params?: Object, showSpinner: Boolean = true): Observable<any> {
        return this.request(RequestMethod.Post, url, data, params, showSpinner);
    }

    put(url: string, data: Object, params?: Object, showSpinner: Boolean = true): Observable<any> {
        return this.request(RequestMethod.Put, url, data, params, showSpinner);
    }

    delete(url: string, data: Object, params?: Object, showSpinner: Boolean = true): Observable<any> {
        return this.request(RequestMethod.Delete, url, data, params, showSpinner);
    }

    request(method: RequestMethod, url: string, data?: Object, params?: Object, showSpinner: Boolean = true): Observable<any> {
        let options = this.getRequestOptions(method);
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
        let self = this;
        let observer: Observable<any> = Observable.create(observer => {
            let requestSub = this.http.request(url, options)
				.map(this.extractData.bind(this))
				.catch((err: any) => {
                    return self.handleError(err, url, options);
                });
            requestSub.subscribe(
                (res: any) => {
                    if (res.status.code > 0) {
                        observer.next(res.data);
                        observer.complete();
                    } else {
                        let err = res.status;
                        err.message = err.msg;
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
        if (ENV != 'production') {
            console.log(response);
        }
		return response;
    }

    handleError(error: Response | any, url: string, options: RequestOptions): any {
		let errMsg = this.jsonError(error);
        if (errMsg.status == 401) {
            return this.refreshToken(url, options);
        }
        this._spinner.hide();
		return Observable.throw(errMsg);
    }

    jsonError(error: Response | any): any {
        let errMsg: any;
        if (ENV != 'production') {
            console.log(error);
        }
		if (error instanceof Response) {
            if (error.status == 0) {
                let message = 'Connection Error';
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
        let refreshTokenUrl = AppConfig.API_URL + 'auth/refresh';
        refreshTokenOptions.body = JSON.stringify({});
        this._spinner.show();
        return this.http.request(refreshTokenUrl, refreshTokenOptions)
            .toPromise()
            .then((res: Response) => {
                let response = res.json() || {};
				this.updateLocalStorage(response);
                return this.resendRequest(url, options);
            })
            .catch(this.handleErrorRefreshToken.bind(this));
    }

    resendRequest(url: string, options: RequestOptions) {
        let newOptions = this.getRequestOptions(options.method);
        newOptions.search = options.search;

        return this.http.request(url, newOptions)
            .toPromise()
			.then(this.extractData.bind(this))
			.catch(this.handleErrorAfterResendRequest.bind(this));
    }

    updateLocalStorage(response: any) {
        localStorage.setItem(AppConstant.ACCESS_TOKEN, response.access_token);
		localStorage.setItem(AppConstant.EXPIRED_AT, response.expired_at);
    }

    handleErrorAfterResendRequest(error: Response | any) {
        this._spinner.hide();
        let errMsg = this.jsonError(error);
        return Observable.throw(errMsg);
    }

    handleErrorRefreshToken(error: Response | any) {
        this._spinner.hide();
        let errMsg = this.jsonError(error);
        localStorage.clear();
        // this.router.navigate(['/login']);
        return Promise.reject(errMsg);
    }
}
