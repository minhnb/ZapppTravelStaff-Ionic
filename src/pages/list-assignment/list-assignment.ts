import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { AppConstant } from '../../app/app.constant';

@IonicPage()
@Component({
	selector: 'page-list-assignment',
	templateUrl: 'list-assignment.html',
})
export class ListAssignmentPage extends BaseComponent {

    listAssignment: Array<any>;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams) {
		super(injector);
		this.listAssignment = this.listAssignmentTransform(navParams.data.listAssignment);
	}

	ionViewDidLoad() {
		this.log('ionViewDidLoad ListAssignmentPage');
	}

	getModeTextKey(mode: number) {
		switch (mode) {
			case AppConstant.ASSIGNMENT_MODE.COLLECTION:
				return 'COLLECTION';
			case AppConstant.ASSIGNMENT_MODE.DELIVERY:
				return 'DELIVERY';
			default:
				return 'UNASSIGNED';
		}
	}

	listAssignmentTransform(listAssignment: Array<any>) {
		return listAssignment.map(item => {
			let assignment: any = {};
			assignment.mode = Number(item.type);
			let modeTextKey = this.getModeTextKey(assignment.mode);
			assignment.modeText = this.translate.instant(modeTextKey);
			assignment.modeClass = modeTextKey.toLowerCase();
			if (assignment.mode == AppConstant.ASSIGNMENT_MODE.COLLECTION) {
				assignment.in = item.content;
			}
			assignment.createAt = this.timeStampToDateTime(item.created_at);
			return assignment;
		});
	}

}
