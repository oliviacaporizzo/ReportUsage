import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Http, Headers, Response } from '@angular/http';
import {AuthenticateService} from '../authenticate/authenticate.service';


import 'rxjs/add/operator/toPromise';

@Injectable()
export class ReportsService {

  constructor(private http: Http, private authService: AuthenticateService) { }

  private makeHeader(token: string){
    var headers = new Headers();
    headers.append('authorization', token);
    return headers;
  }

  getSummaryReports(accountNumber: String, pageNumber: Number, options: boolean, startDate: String, endDate: String): Promise<any>  {
    let logged = this.authService.checkIfLoggedIn();
    let headers = this.makeHeader(logged);
   // var that = this;
    return this.http.post('http://localhost:8080/api/reports/summary', {accountNumber: accountNumber, pageNumber: pageNumber, options: options, startDate: startDate, endDate: endDate},
  {headers: headers})
      .toPromise()
      .then(this.extractData);
    
  }

  getDetailedReports(accountNumber: String, pageNumber: Number, options: boolean, startDate: String, endDate: String): Promise<any>  {
    let logged = this.authService.checkIfLoggedIn();
    let headers = this.makeHeader(logged);
    return this.http.post('http://localhost:8080/api/reports/detailed', {accountNumber: accountNumber, pageNumber: pageNumber, options: options, startDate: startDate, endDate: endDate}, 
        {headers: headers}
      )
      .toPromise()
      .then(this.extractData);
    
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || [];
}

  private getMonthCharges(res: Response){
    let body = res.json();
    var charges =[];
    if(!body.success || body.error){
      console.log('didnt get data');
      return body;
    }else {
      for(var i = 0; i < body.data.length; i++){
        charges.push(body.data[i].charge);
      }
    }
    return charges
  }

getChargesForMonth(accountNumber: String, pageNumber: Number, options: boolean, startDate: String, endDate: String):  Promise<any> {
  let logged = this.authService.checkIfLoggedIn();
  let headers = this.makeHeader(logged);
  return this.http.post('http://localhost:8080/api/reports/summary', {accountNumber: accountNumber, pageNumber: pageNumber, options: options, startDate: startDate, endDate: endDate},
  {headers: headers})
      .toPromise()
      .then(this.getMonthCharges);
}

private getYearCharges(res: Response) {
  let body = res.json();
  var charges =[];
  if(!body.success || body.error){
    console.log('didnt get data');
    return body;
   } else {
     for(var i = 0; i<12; i++) {
      var charge = 0;
      for(var j=0; j<body.data.length; j++){
        var d  = new Date(body.data[j].date);
        if(d.getMonth() == i){
          charge = charge + body.data[j].charge;
        }
      }
      charges[i] = charge;
    }
    return charges;
  }
  
}

getChargesForYear(accountNumber: String, pageNumber: Number, options: boolean, startDate: String, endDate: String):  Promise<any>{
  let logged = this.authService.checkIfLoggedIn();
  let headers = this.makeHeader(logged);
  return this.http.post('http://localhost:8080/api/reports/summary', {accountNumber: accountNumber, pageNumber: pageNumber, options: options, startDate: startDate, endDate: endDate},
  {headers: headers})
      .toPromise()
      .then(this.getYearCharges);
}

}
