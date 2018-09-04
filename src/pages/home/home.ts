import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { RestProvider } from '../../providers/rest/rest';
import { Storage } from "@ionic/storage";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  ui:any;
  users: any;

  constructor(
    public navCtrl: NavController,
    private androidFingerprintAuth: AndroidFingerprintAuth,
    public alertCtrl: AlertController,
    public restProvider: RestProvider,
    public storage: Storage
  ) {

    this.ui = {};
    this.ui.test = false;
    this.ui.openChart = false;
    this.ui.animatefinger = false;
    this.ui.checked = false;
    this.ui.stopanimate = false;
    this.ui.animatelabel = "Siap untuk memulai";
    this.restProvider.initRest();

    this.storage.get("sifatlist").then((value) => {
      if(value){
        this.ui.animatelabel = "Analisa Karakteristik Anda sebagai berikut : ";
        this.ui.checked = true;
        this.ui.sifatlist = value;
      }
    });

  }

  async test(){
    this.process();
  }

  async openScan(){

    this.androidFingerprintAuth.isAvailable()
      .then((result)=> {
        if(result.isAvailable){
          this.androidFingerprintAuth.encrypt({ clientId: 'inscan', username: 'myUsername', password: 'myPassword', dialogTitle: 'INSCAN', disableBackup: true, dialogMessage: 'Letakan jari anda pada fingerprint', dialogHint: 'Sentuh sensor' })
            .then(result => {
              if (result.withFingerprint) {
                console.log('Successfully encrypted credentials.');
                console.log('Encrypted credentials: ' + result.token);
                this.process();
              } else if (result.withBackup) {
                console.log('Successfully authenticated with backup password!');
              } else console.log('Didn\'t authenticate!');
            })
            .catch(error => {
              if (error === this.androidFingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
                console.log('Fingerprint authentication cancelled');
              } else console.error(error)
            });

        } else {
          this.getWarningPopup("Sidik jari tidak tersedia, pastikan anda sudah mendaftarkan pada \"Setelan > Kunci Layar > Tambah Sidik Jari\"")
        }
      })
      .catch(error => console.error(error));
  }

  async resetScan(){
    let confirm = this.alertCtrl.create({
      title: 'Warning!',
      subTitle: 'Mereset hasil mungkin akan mempengaruhi hasil anda selanjutnya. Apakah anda yakin?',
      buttons: [
        {
          text: 'Batal',
          handler: () => {
          }
        },
        {
          text: 'Yakin',
          handler: () => {

            this.restProvider.resetSifat()
              .then(data => {
                if(data["status"]=='OK'){

                  this.storage.remove("sifatlist");
                  this.ui.test = false;
                  this.ui.openChart = false;
                  this.ui.animatefinger = false;
                  this.ui.checked = false;
                  this.ui.stopanimate = false;
                  this.ui.animatelabel = "Siap untuk memulai";
                }
              });
          }
        }
      ]
    });
    confirm.present();
  }

  private process(){
    this.ui.test = true;

    var ui = this.ui;
    var stopanimate = this.ui.stopanimate;
    var service = this.restProvider;
    var storage = this.storage;
    ui.animatefinger = true;
    ui.animatelabel = "Sedang memeriksa jari anda";

    setTimeout(function () {
      ui.openChart = true;
      if(ui.animatefinger && !stopanimate) {
        ui.animatefinger = false;
      } else {
        ui.animatefinger = true;
      }

      setTimeout(function () {
        if(!stopanimate) {
          ui.animatelabel = "Sedang menyiapkan hasil";
          service.generateSifat()
            .then(data => {
              console.log(data);
              if(data["status"]=='OK'){
                setTimeout(function () {
                  ui.animatelabel = "Berhasil";

                  setTimeout(function () {
                    ui.animatelabel = "Analisa Karakteristik Anda sebagai berikut : ";
                    ui.checked = true;
                    ui.sifatlist = data["response"].sifatList;
                    storage.set("sifatlist", ui.sifatlist);
                  }, 300);

                }, 200);
              } else {
                setTimeout(function () {
                  ui.animatelabel = "Gagal, silahkan coba lagi";

                }, 200);
              }
            });
        }
        stopanimate = true;

      }, 1000);

    }, 2000);

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
