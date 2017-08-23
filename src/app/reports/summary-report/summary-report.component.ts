import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../reports.service';
import {SummaryReport} from '../../models/summary-report';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary-report',
  templateUrl: './summary-report.component.html',
  styleUrls: ['./summary-report.component.css'],
})
export class SummaryReportComponent implements OnInit {

  public daterange: any = {};

  public options: any = {
    locale: { format: 'YYYY-MM-DD' },
    alwaysShowCalendars: false,
};

 
  myRowData : SummaryReport[];
  

  columns = [ 
    {value: 'usageDate', header: 'Date'},
    {value: 'SKU', header: 'SKU'}, 
    {value: 'used_installed', header: 'Used/Installed'},
    {value: 'used_variableUnits', header: 'Variable Units Used'},
    {value: 'price_per_unit', header: 'Price per Unit'},
    {value: 'totalCharge', header: 'Charge'}
  ];

  pageNumber = 1;
  startDate: String;
  endDate: String;

  constructor(private reportService: ReportsService, private router: Router) {
   }

  ngOnInit() {
    var that = this;
    this.reportService.getSummaryReports(localStorage.getItem('accountNumber'), this.pageNumber, false, '', '')
    .then(function(data){
      console.log(data);
      if(data.error) {
        alert(data.error);
      }
      else if(!data.success) {
        console.log('go back to authorization');
        // localStorage.setItem('last_page_visited', '/summaryreport');
        that.router.navigate(['/authenticate']);
      } else {
        for(var i = 0; i < data.data.length; i++) {
          data.data[i]['used_installed'] = data.data[i].usedQuantity + '/' + data.data[i].installedQuantity;
          data.data[i]['used_variableUnits'] = data.data[i].variableUnit - (data.data[i].installedQuantity - data.data[i].usedQuantity);
          data.data[i]['price_per_unit'] = data.data[i].currency + " " + data.data[i].unitPrice;
          data.data[i]['totalCharge'] = data.data[i].currency + " " + data.data[i].charge;
        }
        //console.log(data.data[1]);
        that.myRowData = data.data;
      }
      
    });
  }

  clicked() {
    this.pageNumber = this.pageNumber + 1;
    var that = this;
    var option;
    if(typeof this.startDate == 'undefined'){
      option = false
    } else {
      option = true;
    }
    this.reportService.getSummaryReports(localStorage.getItem('accountNumber'), this.pageNumber, option, this.startDate, this.endDate)
    .then(function(data){
      if(data.error) {
        alert("All reports are loaded");
      }
      else if(!data.success) {
        console.log('go back to authorization');
        localStorage.setItem('last_page_visited', '/summaryreport');
        that.router.navigate(['/authenticate']);
      } else {
        for(var i = 0; i < data.data.length; i++) {
          data.data[i]['used_installed'] = data.data[i].usedQuantity + '/' + data.data[i].installedQuantity;
          data.data[i]['used_variableUnits'] = data.data[i].variableUnit - (data.data[i].installedQuantity - data.data[i].usedQuantity);
          data.data[i]['price_per_unit'] = data.data[i].currency + " " + data.data[i].unitPrice;
          data.data[i]['totalCharge'] = data.data[i].currency + " " + data.data[i].charge;
        }
        that.myRowData = that.myRowData.concat(data.data);
     }
    });
  }

  public selectedDate(value: any) {
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;
    this.startDate = this.daterange.start._d.toISOString();
    this.endDate = this.daterange.end._d.toISOString();
    var that = this;
    console.log(this.startDate);
    console.log(this.endDate);
    this.reportService.getSummaryReports(localStorage.getItem('accountNumber'), this.pageNumber, true, this.startDate, this.endDate)
    .then(function(data){
      if(data.error) {
        alert("All reports are loaded");
      }
      else if(!data.success) {
        console.log('go back to authorization');
        //localStorage.setItem('last_page_visited', '/summaryreport');
        that.router.navigate(['/authenticate']);
      } else {
        for(var i = 0; i < data.data.length; i++) {
          data.data[i]['used_installed'] = data.data[i].usedQuantity + '/' + data.data[i].installedQuantity;
          data.data[i]['used_variableUnits'] = data.data[i].variableUnit - (data.data[i].installedQuantity - data.data[i].usedQuantity);
          data.data[i]['price_per_unit'] = data.data[i].currency + " " + data.data[i].unitPrice;
          data.data[i]['totalCharge'] = data.data[i].currency + " " + data.data[i].charge;
        }
        that.myRowData = data.data;
     }
    });
    // console.log(this.daterange.start._d);
}

}
