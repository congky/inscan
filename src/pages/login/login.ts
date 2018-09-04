import { Component } from '@angular/core';
import { MenuController, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from "../home/home";
import { UtilityService } from "../../app/utility.service";
import { RestProvider } from '../../providers/rest/rest';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  homePage = HomePage;
  ui:any;
  constructor(public util: UtilityService,
              public navCtrl: NavController,
              public param: NavParams,
              public menu: MenuController,
              public restProvider: RestProvider,
              private storage: Storage) {
    this.ui = {};
    this.ui.date=util.ui.date;
    this.ui.fullname=util.ui.fullname;
  }

  login() {

    if(this.ui.kode) {
      // For call service
      this.restProvider.login({
        codeOrPhone: this.ui.kode
      })
        .then(data => {
          if(data["status"]=='OK'){

            this.util.ui.fullname=data["response"].fullName;
            this.storage.set("token", data["response"].token);

            if(data["response"].sifatList && data["response"].sifatList.length > 0) {
              this.storage.set("sifatlist", data["response"].sifatList);
            }

            this.menu.enable(true);
            this.navCtrl.setRoot(this.homePage);
          } else {
            this.ui.errMsg = data["message"];
          }
        });
    }
  }

}
