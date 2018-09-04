import { Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { MenuController, Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RestProvider } from "../providers/rest/rest";

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { UtilityService } from "./utility.service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage:any;

  private pages = new Map<String, {title: string, component: any, icon: any}>();
  ui:any;

  constructor(
      public platform: Platform,
      public statusBar: StatusBar,
      public splashScreen: SplashScreen,
      public menu: MenuController,
      public alertCtrl: AlertController,
      public restProvider: RestProvider,
      public storage: Storage,
      public util: UtilityService) {

      platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        if (platform.is('android')) {
          statusBar.backgroundColorByHexString("#33000000");
        }
        splashScreen.hide();
      });


      this.pages.set("home",{ title: 'Home', component: HomePage, icon: "home"});
      this.ui = util.ui;

      this.storage.get("token").then((value) => {
        if(value){
          this.restProvider.checkToken()
            .then(data => {
              if(data["status"]=='OK'){
                this.util.ui.fullname=data["response"].fullName;
                this.rootPage = HomePage;
              } else {
                this.rootPage = LoginPage;
              }
            });
        } else {
          this.rootPage = LoginPage;
        }
      });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);

    if(page.component == LoginPage) {
      this.menu.enable(false);
    } else {
      this.menu.enable(true);
    }
  }

  getKeys(map){
    return Array.from(map.keys());
  }

  logout() {
    let confirm = this.alertCtrl.create({
      title: 'Log out of INSCAN?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Log Out',
          handler: () => {
            this.restProvider.logout()
              .then(data => {
                if(data["status"]=='OK'){
                  this.rootPage = LoginPage;
                  this.storage.clear();
                  this.nav.setRoot(LoginPage);
                } else {
                  this.getWarningPopup(data["message"]);
                }
              });
          }
        }
      ]
    });
    confirm.present();
  }

  getWarningPopup(msg) {
    let alert = this.alertCtrl.create({
      title: 'Warning!',
      subTitle: msg,
      buttons: ['Ok']
    });
    alert.present();
  }
}

