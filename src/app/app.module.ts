import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

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

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TextMaskModule } from 'angular2-text-mask';

import { Http, HttpModule } from '@angular/http';

import { ZapppHttp } from './services/zapppHttp';
import { DataShare } from './helper/data.share';

@NgModule({
	declarations: [
		MyApp,
		ListPage,
		LoginPage
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(MyApp, { mode: 'ios', scrollAssist: false }),
		HttpModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: (http: Http) => new TranslateHttpLoader(http, 'assets/i18n/', '.json'),
				deps: [Http]
			}
		}),
		TextMaskModule,
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
		ListTruckWithDirectionPageModule
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
		ZapppHttp,
		DataShare,
		{ provide: ErrorHandler, useClass: IonicErrorHandler }
	]
})
export class AppModule { }
