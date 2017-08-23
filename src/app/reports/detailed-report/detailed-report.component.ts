import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../reports.service';
import { DetailedReport } from '../../models/detailed-report';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detailed-report',
  templateUrl: './detailed-report.component.html',
  styleUrls: ['./detailed-report.component.css']
})
export class DetailedReportComponent implements OnInit {

  public daterange: any = {};
  
    public options: any = {
      locale: { format: 'YYYY-MM-DD' },
      alwaysShowCalendars: false,
  };

  myRowData : DetailedReport[];
  

  columns = [ 
    {value: 'usageDate', header: 'Date'},
    {value: 'serialNumber', header: 'Serial Number'},
    {value: 'SKU', header: 'SKU'}, 
    {value: 'used', header: 'Used'}
  ];

  pageNumber = 0;
  startDate: String;
  endDate: String;

  constructor(private reportService: ReportsService, private router: Router) { }

  ngOnInit() {
    var that = this;
    this.reportService.getDetailedReports(localStorage.getItem('accountNumber'), this.pageNumber, false, '','')
    .then(function(data){
      //console.log(data);
      if(data.error){
        alert(data.error);
      }
     else if(!data.success) {
        console.log('go back to authorization');
        localStorage.setItem('last_page_visited', '/detailedreport');
        //redirect
        that.router.navigate(['/authenticate']);
      } else {
        //console.log(data.data);
       that.myRowData = data.data;
      }
    });
  }

  clicked() {
    this.pageNumber = this.pageNumber + 1;
    var that = this;
    var option;
    console.log('pageNumber '+ this.pageNumber);
    if(typeof this.startDate == 'undefined') {
      option = false;
    } else {
      option = true;
    }
    this.reportService.getDetailedReports(localStorage.getItem('accountNumber'), this.pageNumber, option, this.startDate, this.endDate)
    .then(function(data){
      console.log(data);
      if(data.error) {
        alert("All reports are loaded");
      }
      else if(!data.success) {
        console.log('go back to authorization');
        //localStorage.setItem('last_page_visited', '/summaryreport');
        that.router.navigate(['/authenticate']);
      } else {
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
    console.log('selectDate ' + this.startDate);
    console.log('selectDate ' + this.endDate);
    this.reportService.getDetailedReports(localStorage.getItem('accountNumber'), this.pageNumber, true, this.startDate, this.endDate)
    .then(function(data){
      if(data.error) {
        alert("All reports are loaded");
      }
      else if(!data.success) {
        console.log('go back to authorization');
        //localStorage.setItem('last_page_visited', '/summaryreport');
        that.router.navigate(['/authenticate']);
      } else {
        that.myRowData = data.data;
     }
    });
    // console.log(this.daterange.start._d);
}
}
