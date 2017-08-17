import { Component, Injector, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { AppConstant } from '../../app/app.constant';

import { TakePicturePage } from '../take-picture';
import { ManualInputPage } from '../manual-input';

import { CollectionModeService } from '../../app/services/collection-mode';
import { DeliveryModeService } from '../../app/services/delivery-mode';

import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';

@IonicPage()
@Component({
	selector: 'page-customer-luggage',
	templateUrl: 'customer-luggage.html',
	providers: [
		CollectionModeService,
		DeliveryModeService
	]
})
export class CustomerLuggagePage extends BaseComponent {

    listLuggage: Array<any> = [];
    customer: any;
    isAttendantSaveMode: boolean = false;
    selectedIndex: number = -1;
	isTransferMode: boolean = false;
	isAcceptLuggageMode: boolean = false;
	isFromCustomerInfoPage: boolean = false;
	isFromViewOrderPage: boolean = false;
	isDeliveryMode: boolean = false;
	isUpdated: boolean = false;
	listBinOnTruck: Array<any>;

    @ViewChild(Navbar) navBar: Navbar;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation,
		private collectionModeService: CollectionModeService, private deliveryModeService: DeliveryModeService) {
        super(injector);
        this.initCustomerLuggage();
		this.initListBinOnTruck();
		this.subcribeManualInputEvent();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CustomerLuggagePage');
        this.customBackButtonClick();
	}

    customBackButtonClick() {
		this.navBar.backButtonClick = (e: UIEvent) => {
			this.goBackToPreviousPage();
		};
	}

    initCustomerLuggage() {
        this.customer = this.navParams.data.customer;
		if (this.customer.isAttendantSaveMode) {
			this.isAttendantSaveMode = true;
		}
		if (this.navParams.data.isTransferMode) {
			this.isTransferMode = true;
		}
		if (this.navParams.data.isFromCustomerInfoPage) {
			this.isFromCustomerInfoPage = true;
		}
		if (this.navParams.data.isFromViewOrderPage) {
			this.isFromViewOrderPage = true;
		}
		if (this.navParams.data.isDeliveryMode) {
			this.isDeliveryMode = true;
		}
		if (this.navParams.data.isAcceptLuggageMode) {
			this.isAcceptLuggageMode = true;
			this.isAttendantSaveMode = true;
		}
		if (this.customer.listLuggage) {
			this.listLuggage = this.customer.listLuggage;
			if (this.listLuggage.length > 0) {
				this.isUpdated = true;
			}
		}
        let luggageCode = this.navParams.data.luggageCode;
        if (luggageCode) {
			if (!this.isDeliveryMode && !this.isAttendantSaveMode) {
				this.addLuggageCode(luggageCode);
			} else {
				this.findLuggageCodeInList(luggageCode);
			}
        }
		if (this.isAcceptLuggageMode) {
			this.removeAllOldStorageBinCode();
		}
    }

	initListBinOnTruck() {
		let localStorageBin = localStorage.getItem(AppConstant.LIST_BIN);
		this.listBinOnTruck = JSON.parse(localStorageBin);
	}

	indexOfBinCode(code: string) {
		let binId = this.getBinIdFromBinCode(code);
		for (let i = 0; i < this.listBinOnTruck.length; i++) {
			let item = this.listBinOnTruck[i];
			if (item.id == binId) {
				return i;
			}
		}
		return -1;
	}

	removeAllOldStorageBinCode() {
		this.listLuggage.forEach(item => {
			item.storageBinCode = '';
			item.storageBinName = '';
		});
	}


	isAllowedToRemoveLuggageCode() {
		return !(this.isTransferMode || this.isAttendantSaveMode || this.isDeliveryMode);
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

		this.checkValidLuggage(luggageCode, () => {
			let newItem = {
				luggageCode: luggageCode,
				storageBinCode: ''
			}
			this.listLuggage.push(newItem);
		});
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
		let indexOfBinCode = this.indexOfBinCode(storageBinCode);
		if (indexOfBinCode == -1) {
			this.showError(this.translate.instant('ERROR_BIN_CODE_NOT_IN_LIST'));
			return;
		}
		let binItem = this.listBinOnTruck[indexOfBinCode];
        if (this.listLuggage.length && index >= 0) {
            let item = this.listLuggage[index];
            item.storageBinCode = binItem.id;
            item.storageBinName = binItem.name;
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
			this.markScannedItem(luggageCodeIndex);
        } else {
            this.showError(this.translate.instant('ERROR_LUGGAGE_CODE_IS_NOT_IN_LIST'));
        }
    }

	markScannedItem(luggageIndex: number) {
		if (!this.isDeliveryMode && !this.isAcceptLuggageMode) {
			return;
		}
		let item = this.listLuggage[luggageIndex];
		item.isScanned = true;
	}

	wereAllItemsScanned() {
		if (!this.isDeliveryMode && !this.isAcceptLuggageMode) {
			return false;
		}
		for (let i = 0; i < this.listLuggage.length; i++) {
			let item = this.listLuggage[i];
			if (!item.isScanned) {
				return false;
			}
		}
		return true;
	}

    helpAttendantSortLuggage(code: string) {
        if (this.isLuggageCode(code) || this.selectedIndex == -1 || this.isDeliveryMode) {
            this.findLuggageCodeInList(code);
        } else {
			if (!this.isStorageBinCode(code)) {
				this.showError(this.translate.instant('ERROR_INVALID_CODE'));
				return;
            }
            this.updateStorageBinCodeToItemByIndex(code, this.selectedIndex);
        }
    }

    smartScanQRCode() {
		this.scanQRCode(text => {
            if (this.isAttendantSaveMode || this.isDeliveryMode) {
                this.helpAttendantSortLuggage(text);
                return;
            }
            this.updateListLuggageInfo(text);
        });
	}

    scanBinStorageCode(index) {
        this.scanQRCode(text => {
            if (!this.isStorageBinCode(text)) {
				this.showError(this.translate.instant('ERROR_INVALID_BIN_CODE'));
				return;
            }
			this.updateStorageBinCodeToItemByIndex(text, index);
        });
    }

	finishScanningForDeliveryMode() {
		this.goToTakeProofPicturePage();
	}

	finishScanningForCollectionMode() {
		this.updateLuggage();
	}

    goBackToCollectionModePage() {
        let currentPageIndex = this.navCtrl.getViews().length - 1;
        let collectionModePageIndex = currentPageIndex - 2;
        this.navCtrl.popTo(this.navCtrl.getByIndex(collectionModePageIndex));
    }

    goBackToUserStartPage() {
        this.navCtrl.popToRoot();
    }

    goBackToPreviousPage() {
        this.customer.listLuggage = this.listLuggage;
        this.navCtrl.pop(this.customer);
    }

	goToTakeProofPicturePage() {
		this.customer.listLuggage = this.listLuggage;
		let params: any = {
			customer: this.customer,
			isDeliveryMode: this.isDeliveryMode,
			isFromCustomerInfoPage: this.isFromCustomerInfoPage
		};
		this.navCtrl.push(TakePicturePage, params);
	}

	updateLuggage() {
		let orderId = this.customer.orderId;
		let listLuggage = this.listLuggageReverseTransform(this.listLuggage);
		this.collectionModeService.updateLuggage(orderId, listLuggage, this.isUpdated).subscribe(
			res => {
				if ((this.isAcceptLuggageMode && !this.isFromCustomerInfoPage) || this.isFromViewOrderPage) {
					this.goBackToPreviousPage();
					return;
				}
				if (this.isUpdated) {
					this.goBackToCollectionModePage();
				} else {
					this.goToTakeProofPicturePage();
				}
			},
			err => {
				this.showError(err.message);
			}
		);
	}

	checkValidLuggage(luggageCode: string, callback?: () => void) {
		this.collectionModeService.checkValidLuggage(luggageCode).subscribe(
			res => {
				if (callback) {
					callback();
				}
			},
			err => {
				this.showError(err.message);
			}
		);
	}

	goToManualInputPage() {
		let params: any = {
			listLuggage: this.listLuggage
		};
		this.navCtrl.push(ManualInputPage, params);
	}

	subcribeManualInputEvent() {
		this.events.subscribe(AppConstant.EVENT_TOPIC.INPUT_MANUAL, (data) => {
			if (this.isDestroyed) {
				return;
			}
			this.handleManualInputEvent(data);
		});
	}

	handleManualInputEvent(data: any) {
		this.navCtrl.pop();
		this.findLuggageCodeInList(data.input);
	}
}
