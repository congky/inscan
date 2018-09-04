import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";

/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {

  apiUrl = 'http://192.168.10.10:8000/api/inscan/v1';
  headerWithToken:any;
  headerWithoutToken:any;

  constructor(public http: HttpClient,
              public storage: Storage) {
    this.initRest();
  }

  public initRest(){
    this.headerWithToken = new HttpHeaders().set('Content-Type', 'application/json');
    this.headerWithoutToken = new HttpHeaders().set('Content-Type', 'application/json');

    this.storage.get("token").then((value) => {
        if (value) {
          this.headerWithToken = this.headerWithToken.set('token', value);
        }
      }
    );
  }

  checkToken() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/check-token', {
        headers: this.headerWithToken,
      }).subscribe(data => {
        resolve(data);
      }, err => {
        resolve({status:"FAIL", message:"Cannot connect to server"});
      });
    });
  }
  login(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl+'/login', data, {
        headers: this.headerWithoutToken
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          // reject(err);
          resolve({status:"FAIL", message:"Cannot connect to server"});
        });
    });
  }

  logout() {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl+'/logout', {}, {
        headers: this.headerWithToken,
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          // reject(err);
          resolve({status:"FAIL", message:"Cannot connect to server"});
        });
    });
  }

  generateSifat() {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl+'/generate-sifat', {}, {
        headers: this.headerWithToken
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          // reject(err);
          resolve({status:"FAIL", message:"Cannot connect to server"});
        });
    });
  }

  resetSifat() {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl+'/reset-sifat', {}, {
        headers: this.headerWithToken
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          // reject(err);
          resolve({status:"FAIL", message:"Cannot connect to server"});
        });
    });
  }


}
