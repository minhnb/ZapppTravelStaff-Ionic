import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { BaseComponent } from './base.component';
import { DirectionPage } from '../pages/direction-stop';

import { MyApp } from './app.component';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';

import { SchedulePageModule } from '../pages/schedule';
import { DirectionStopPageModule } from '../pages/direction-stop';
import { UserStartPageModule } from '../pages/user-start';
import { CollectionModePageModule } from '../pages/collection-mode';
import { CustomerInfoPageModule } from '../pages/customer-info';
import { CustomerLuggagePageModule } from '../pages/customer-luggage';
import { ListTruckPageModule } from '../pages/list-truck';
import { ListOrderPageModule } from '../pages/list-order';
import { ListHotelPageModule } from '../pages/list-hotel';
import { DeliveryInfoPageModule } from '../pages/delivery-info';
import { TakePicturePageModule } from '../pages/take-picture';
import { ListStationPageModule } from '../pages/list-station';
import { StayTimeCountDownPageModule } from '../pages/stay-time-count-down';
import { ListRequestPageModule } from '../pages/list-request';
import { ListRequestWithDirectionPageModule } from '../pages/list-request-with-direction';
import { DirectionUserPageModule } from '../pages/direction-user';
import { UncompletedOrderPageModule } from '../pages/uncompleted-order';
import { FindTruckPageModule } from '../pages/find-truck';
import { DirectionTruckPageModule } from '../pages/direction-truck';
import { ListAssignmentPageModule } from '../pages/list-assignment';
import { ListTruckWithDirectionPageModule } from '../pages/list-truck-with-direction';
import { ManualInputPageModule } from '../pages/manual-input';
import { OrderSliderPageModule } from '../pages/order-slider';
import { ChatViewPageModule } from '../pages/chat-view';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { FCM } from '@ionic-native/fcm';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Camera } from '@ionic-native/camera';
import { CallNumber } from '@ionic-native/call-number';
import { Keyboard } from '@ionic-native/keyboard';
import { BackgroundMode } from '@ionic-native/background-mode';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TextMaskModule } from 'angular2-text-mask';
import { QRCodeModule } from 'angular2-qrcode';

import { Http, HttpModule } from '@angular/http';

import { ZapppHttp } from './services/zapppHttp';
import { DataShare } from './helper/data.share';
import { Draggable } from './helper/draggable.directive';

export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
	declarations: [
		BaseComponent,
		DirectionPage,
		MyApp,
		ListPage,
		LoginPage,
		Draggable
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(MyApp, { mode: 'ios', scrollAssist: false }),
		HttpModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: (createTranslateLoader),
				deps: [Http]
			}
		}),
		TextMaskModule,
		QRCodeModule,
		SchedulePageModule,
		DirectionStopPageModule,
		UserStartPageModule,
		CollectionModePageModule,
		CustomerInfoPageModule,
		CustomerLuggagePageModule,
		ListTruckPageModule,
		ListOrderPageModule,
		ListHotelPageModule,
		DeliveryInfoPageModule,
		TakePicturePageModule,
		ListStationPageModule,
		StayTimeCountDownPageModule,
		ListRequestPageModule,
		ListRequestWithDirectionPageModule,
		DirectionUserPageModule,
		UncompletedOrderPageModule,
		FindTruckPageModule,
		DirectionTruckPageModule,
		ListAssignmentPageModule,
		ListTruckWithDirectionPageModule,
		ManualInputPageModule,
		OrderSliderPageModule,
		ChatViewPageModule
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		ListPage,
		LoginPage
	],
	providers: [
		StatusBar,
		SplashScreen,
		SpinnerDialog,
		GoogleMaps,
		Geolocation,
		FCM,
		BarcodeScanner,
		Diagnostic,
		Camera,
		CallNumber,
		Keyboard,
		BackgroundMode,
		GoogleAnalytics,
		ZapppHttp,
		DataShare,
		{ provide: ErrorHandler, useClass: IonicErrorHandler }
	]
})
export class AppModule { }
