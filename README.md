This is a starter template for [Ionic](http://ionicframework.com/docs/) projects.

## How to use this template

*This template does not work on its own*. The shared files for each starter are found in the [ionic2-app-base repo](https://github.com/driftyco/ionic2-app-base).

To use this template, either create a new ionic project using the ionic node.js utility, or copy the files from this repository into the [Starter App Base](https://github.com/driftyco/ionic2-app-base).

### With the Ionic CLI:

Take the name after `ionic2-starter-`, and that is the name of the template to be used when using the `ionic start` command below:

```bash
$ sudo npm install -g ionic cordova
$ ionic start mySideMenu sidemenu
```

Then, to run it, cd into `mySideMenu` and run:

```bash
$ ionic cordova platform add ios
$ ionic cordova run ios
```

Substitute ios for android if not on a Mac.

*********************************************************************************************
HOW TO RESOLVE GOOGLE SERVICE CONFLICT WHEN USING GOOGLE MAPS AND GOOGLE FIREBASE CLOUD MESSAGE

Step 1: Remember: Do it before add platform android. If you already added platform android, you should remove it.
$ ionic cordova platform remove android

Comment out these lines in the FCMPlugin.gradle file.
classpath 'com.google.gms:google-services:3.0.0'
apply plugin: com.google.gms.googleservices.GoogleServicesPlugin

Then change the plugin.xml of the FCM plugin to use a different version, in my situation 9.8.0.
<framework src="com.google.firebase:firebase-core:9.8.0" />
<framework src="com.google.firebase:firebase-messaging:9.8.0" />

Step 2: Add platform android
$ ionic cordova platform add android

Step 3: Change the build.gradle file of the android platform folder
Add this line to the classpath section
classpath 'com.google.gms:google-services:3.1.0'

And add this line below the dependencies, nearly at the bottom of the file
apply plugin: 'com.google.gms.google-services'

And these changes should fix the problems with the version conflicts.
