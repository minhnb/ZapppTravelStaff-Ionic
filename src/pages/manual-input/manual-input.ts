import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { AppConstant } from '../../app/app.constant';

@IonicPage()
@Component({
	selector: 'page-manual-input',
	templateUrl: 'manual-input.html',
})
export class ManualInputPage extends BaseComponent {

    input: string = '';
	showSearchResult = false;
	listLuggage: Array<any> = [];
	listLuggageCode: Array<string> = [];

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams) {
		super(injector);
		this.listLuggage = this.navParams.data.listLuggage;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ManualInputPage');
	}

    dismissView(event) {
		this.navCtrl.pop();
	}

	inputSearchOnKeyDown(event) {
		switch (event.keyCode) {
			case AppConstant.KEYCODE.ENTER:
				this.hideKeyboard();
				break;
			default:
		}
	}

	inputSearchOnKeyUp(event) {
		if (event.keyCode == AppConstant.KEYCODE.ENTER) {
			return;
		}
		this.searchLuggageCode();
	}

	searchLuggageCode() {
		let keyword = this.trimText(this.input);
		if (keyword.length < 8) {
			this.clearSearchResult();
			return;
		}
		keyword = AppConstant.CODE_PREFIX.LUGGAGE + keyword.toUpperCase();
		this.listLuggageCode = this.getListMatchedLuggageCode(keyword);
		this.showSearchResult = true;
	}

	getListMatchedLuggageCode(code) {
		let result = [];
		this.listLuggage.forEach(item => {
			let luggageCode = item.luggageCode;
			if (luggageCode.toUpperCase().startsWith(code)) {
				result.push(luggageCode);
			}
		});
		return result;
	}

	selectLuggageCode(luggageCode) {
		this.events.publish(AppConstant.EVENT_TOPIC.INPUT_MANUAL, { input: luggageCode });
	}

	clearSearchResult() {
		this.showSearchResult = false;
		this.listLuggageCode = [];
	}
}
