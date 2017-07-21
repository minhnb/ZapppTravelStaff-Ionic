import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';

@IonicPage()
@Component({
	selector: 'page-list-assignment',
	templateUrl: 'list-assignment.html',
})
export class ListAssignmentPage extends BaseComponent {

    listAssignment: Array<any>;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams) {
		super(injector);
        this.listAssignment = [
            {
                modeText: this.translate.instant('COLLECTION'),
                mode: 1,
                in: 'Kowloon, Hong Kong Island',
                createAt: '2017/07/12 11:15 AM',
                modeClass: 'collection'
            },
            {
                modeText: this.translate.instant('DELIVERY'),
                mode: 2,
                createAt: '2017/07/12 09:00 AM',
                modeClass: 'delivery'
            },
            {
                modeText: this.translate.instant('COLLECTION'),
                in: 'Kowloon',
                createAt: '2017/07/11 11:15 AM',
                modeClass: 'collection'
            },
            {
                modeText: this.translate.instant('UNASSIGNED'),
                mode: 0,
                createAt: '2017/07/11 10:00 AM'
            }
        ];
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ListAssignmentPage');
	}

}
