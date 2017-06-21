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

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { FCM } from '@ionic-native/fcm';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Diagnostic } from '@ionic-native/diagnostic';

import { HttpModule } from '@angular/http';

import { ZapppHttp } from './services/zapppHttp';

@NgModule({
	declarations: [
		MyApp,
		ListPage,
		LoginPage
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(MyApp),
		HttpModule,
		SchedulePageModule,
		DirectionStopPageModule,
		UserStartPageModule,
		CollectionModePageModule,
		CustomerInfoPageModule,
		CustomerLuggagePageModule
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
		ZapppHttp,
		{ provide: ErrorHandler, useClass: IonicErrorHandler }
	]
})
export class AppModule { }
