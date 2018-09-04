import { Injectable } from '@angular/core';

@Injectable()
export class UtilityService{

    public ui : any;

    constructor() {
        this.ui = {
            date: new Date(),
            fullname: ""
        };

        var ui = this.ui;

        setInterval(function () {
            ui.date = new Date();
        }, 1000);
    }
}
