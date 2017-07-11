import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { DirectionUserPage } from '../direction-user';

@IonicPage()
@Component({
	selector: 'page-list-request',
	templateUrl: 'list-request.html',
})
export class ListRequestPage extends BaseComponent {

	listRequest: Array<any> = [];
	defaultAvatar: string = 'assets/images/no-photo.png';

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams) {
        super(injector);
		this.listRequest = [
			{
				name: 'Dolly Doe',
				avatar: '',
				suitcase: 1,
				bag: 2,
				babyCarriage: 0,
				other: 0,
				distance: '330m',
				estimatedTime: '8 mins',
				phoneNumber: '0123456789'
			},
			{
				name: 'Jolly Doe',
				avatar: '',
				suitcase: 1,
				bag: 2,
				babyCarriage: 0,
				other: 0,
				distance: '340m',
				estimatedTime: '8 mins',
				phoneNumber: '0123456789'
			},
			{
				name: 'Dolly Joe',
				avatar: '',
				suitcase: 1,
				bag: 2,
				babyCarriage: 0,
				other: 0,
				distance: '900m',
				estimatedTime: '9 mins',
				phoneNumber: '0123456789'
			}
		]
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ListRequestPage');
	}

    dismissView(event) {
        this.navCtrl.pop();
    }

	takeRequest(customer: any) {
		this.gotoDirectionPage(customer);
	}

	gotoDirectionPage(customer: any) {
		let params = {
			long: 106.702013,
			lat: 10.740790,
			customer: customer
		}
		this.navCtrl.push(DirectionUserPage, params);
	}
}
