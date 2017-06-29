import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ZapppHttp } from './zapppHttp';

import { AppConfig } from '../app.config';
import { AppConstant } from '../app.constant';

@Injectable()
export class CollectionModeService {
	private stopUrl = AppConfig.API_URL + 'stop';

	constructor(private zapppHttp: ZapppHttp) { }

	getListStation() {
		return this.zapppHttp.get(this.stopUrl + '/list_stops_collection');
	}
}
