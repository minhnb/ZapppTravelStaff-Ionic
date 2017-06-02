import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DirectionStopPage } from '../direction-stop';

/**
 * Generated class for the SchedulePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
	selector: 'page-schedule',
	templateUrl: 'schedule.html',
})
export class SchedulePage {

	constructor(public navCtrl: NavController, public navParams: NavParams) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SchedulePage');
	}

	viewDirectionStopPage(event) {
		this.navCtrl.push(DirectionStopPage, {
			id: "123",
			name: "Test"
		});
	}
}
