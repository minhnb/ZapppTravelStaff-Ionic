import { Component, Injector, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { TakePicturePage } from '../take-picture';

@IonicPage()
@Component({
	selector: 'page-customer-luggage',
	templateUrl: 'customer-luggage.html',
})
export class CustomerLuggagePage extends BaseComponent {

    listLuggage: Array<any> = [];
    customer: any;
    attendantSaveMode: boolean = false;
    selectedIndex: number = -1;
	isTransferMode: boolean = false;
	isFromCustomerInfoPage: boolean = false;
	isDeliveryMode: boolean = false;

    @ViewChild(Navbar) navBar: Navbar;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams) {
        super(injector);
        this.initCustomerLuggage();
		// for quick layout
        // this.attendantSaveMode = true;
        // this.customer = {
        //     name: 'Dolly Doe',
        //     hotel: 'Sheraton',
        //     address: '20 Nathan Rd, Hong Kong',
        //     receiver: 'Dolly Doe',
        //     room: '223'
        // }
        // this.listLuggage = [
        //     {
        //         luggageCode: 'ZTL12789',
        //         storageBinCode: ''
        //     },
        //     {
        //         luggageCode: 'ZTL127890',
        //         storageBinCode: ''
        //     },
        //     {
        //         luggageCode: 'ZTL127891',
        //         storageBinCode: ''
        //     }
        // ]
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CustomerLuggagePage');
        this.customBackButtonClick();
	}

    customBackButtonClick() {
		this.navBar.backButtonClick = (e: UIEvent) => {
			this.goBackToCustomerInfoPage();
		};
	}

    initCustomerLuggage() {
        this.customer = this.navParams.data.customer;
        let luggageCode = this.navParams.data.luggageCode;
        if (luggageCode) {
            this.addLuggageCode(luggageCode);
        } else {
            if (this.customer.listLuggage) {
                this.listLuggage = this.customer.listLuggage;
            }
        }
		if (this.customer.isAttendantSaveMode) {
			this.attendantSaveMode = true;
		}
		if (this.navParams.data.isTransferMode) {
			this.isTransferMode = true;
		}
		if (this.navParams.data.isFromCustomerInfoPage) {
			this.isFromCustomerInfoPage = true;
		}
		if (this.navParams.data.isDeliveryMode) {
			this.isDeliveryMode = true;
		}
		if (this.isAcceptLuggageFromOtherTrucksMode()) {
			this.removeAllOldStorageBinCode();
		}
    }

	removeAllOldStorageBinCode() {
		this.listLuggage.forEach(item => {
			item.storageBinCode = '';
		});
	}

	isAcceptLuggageFromOtherTrucksMode(): boolean {
		return this.attendantSaveMode && !this.isFromCustomerInfoPage && !this.isTransferMode && !this.isDeliveryMode;
	}

	isAllowedToRemoveLuggageCode() {
		return !(this.isTransferMode || this.attendantSaveMode || !this.isFromCustomerInfoPage || this.isDeliveryMode);
	}

    isLuggageCode(code: string): boolean {
        if (code.startsWith('ZTL')) {
            return true;
        }
        return false;
    }

    isStorageBinCode(code: string): boolean {
        return true;
    }

    indexOfLuggageCode(luggageCode: string): number {
        for (let i = 0; i < this.listLuggage.length; i++) {
            if (this.listLuggage[i].luggageCode == luggageCode) {
                return i;
            }
        }
        return -1;
    }

    isDuplicatedLuggageCode(luggageCode: string): boolean {
        return this.indexOfLuggageCode(luggageCode) > -1;
    }

    addLuggageCode(luggageCode: string) {
        if (!this.isLuggageCode(luggageCode)) {
            this.showError(this.translate.instant('ERROR_INVALID_LUGGAGE_CODE'));
            return;
        }
        if (this.isDuplicatedLuggageCode(luggageCode)) {
            this.showError(this.translate.instant('ERROR_LUGGAGE_CODE_ALREADY_ADDED'));
            return;
        }
        let newItem = {
            luggageCode: luggageCode,
            storageBinCode: ''
        }
        this.listLuggage.push(newItem);
    }

    removeItem(index: number) {
        this.showConfirm(this.translate.instant('CONFIRM_REMOVE_LUGGAGE'), this.translate.instant('CONFIRMAION_DELETE'),
            () => {
                this.listLuggage.splice(index, 1);
            });
    }

    isNeedToAddStorageBinCode() {
        if (this.listLuggage.length) {
            let lastItemIndex = this.listLuggage.length - 1;
            let lastItem = this.listLuggage[lastItemIndex];
            if (!lastItem.storageBinCode) {
                return true;
            }
        }
        return false;
    }

    updateStorageBinCodeToItemByIndex(storageBinCode: string, index: number) {
        if (this.listLuggage.length && index >= 0) {
            let item = this.listLuggage[index];
            item.storageBinCode = storageBinCode;
        }
    }

    updateStorageBinCodeToLastItem(storageBinCode: string) {
        this.updateStorageBinCodeToItemByIndex(storageBinCode, this.listLuggage.length - 1);
    }

    updateListLuggageInfo(code: string) {
        if (this.isLuggageCode(code)) {
            this.addLuggageCode(code);
            return;
        }
        if (this.isNeedToAddStorageBinCode() && this.isStorageBinCode(code)) {
            this.updateStorageBinCodeToLastItem(code);
            return;
        }
        this.showError(this.translate.instant('ERROR_INVALID_LUGGAGE_CODE'));
    }

    findLuggageCodeInList(luggageCode: string) {
        let luggageCodeIndex = this.indexOfLuggageCode(luggageCode);
        if (luggageCodeIndex > -1) {
            this.selectedIndex = luggageCodeIndex;
        } else {
            this.showError(this.translate.instant('ERROR_LUGGAGE_CODE_IS_NOT_IN_LIST'));
        }
    }

    helpAttendantSortLuggage(code: string) {
        if (this.isLuggageCode(code) || this.selectedIndex == -1 || this.isDeliveryMode) {
            this.findLuggageCodeInList(code);
        } else {
            this.updateStorageBinCodeToItemByIndex(code, this.selectedIndex);
        }
    }

    smartScanQRCode() {
		this.scanQRCode(text => {
            if (this.attendantSaveMode || this.isDeliveryMode) {
                this.helpAttendantSortLuggage(text);
                return;
            }
            this.updateListLuggageInfo(text);
        });
	}

    scanBinStorageCode(index) {
        this.scanQRCode(text => {
            if (this.isStorageBinCode(text)) {
                this.updateStorageBinCodeToItemByIndex(text, index);
            }
        });
    }

    finishScanning() {
		if (this.isDeliveryMode) {
			this.goToTakeProofPicturePage();
			return;
		}
		if (this.isFromCustomerInfoPage) {
			this.goBackToCollectionModePage();
		} else {
			this.goBackToCustomerInfoPage();
		}

    }

    goBackToCollectionModePage() {
        let currentPageIndex = this.navCtrl.getViews().length - 1;
        let collectionModePageIndex = currentPageIndex - 2;
        this.navCtrl.popTo(this.navCtrl.getByIndex(collectionModePageIndex));
    }

    goBackToCustomerInfoPage() {
        this.customer.listLuggage = this.listLuggage;
        this.navCtrl.pop(this.customer);
    }

	goToTakeProofPicturePage() {
		this.customer.listLuggage = this.listLuggage;
		let params: any = {
			customer: this.customer
		};
		this.navCtrl.push(TakePicturePage, params);
	}
}
