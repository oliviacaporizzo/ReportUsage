import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../../authenticate/authenticate.service';
import { ReportsService } from '../../reports/reports.service';
import { Router } from '@angular/router';
import Chart from 'chart.js';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  startDate;
  endDate;

  Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  Years = [2015, 2016, 2017];

  selectedMonth;
  selectedYear;

  months_30 = [4,6,9,11];
  months_31 = [1,3,5,7,8,10,12];

  dataIsLoaded = false;

  lineChartData: Array<any> = [
    {data:[], label: ''}
  ];
  lineChartLabels: Array<any> = [];

  lineChartOptions:any = {
    responsive: true
  };
  
  lineChartType:String = 'line';

  lineChartColors = [
    {
      backgroundColor: 'rgba(4, 159, 217, .50)',
      borderColor: 'rgba(4, 159, 217, 1)',
      pointBackgroundColor: 'rgba(4, 159, 217, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ]


  constructor(private authSerivce : AuthenticateService, private reportService : ReportsService, private router: Router) { }


  ngOnInit() {
    this.updateYears();
    this.authSerivce.checkIfLoggedIn();
    var that = this;
    var today = new Date();
    this.startDate = new Date(today.getFullYear(), 4, 1).toISOString();
    this.endDate = new Date(today.getFullYear(),4, today.getDate()).toISOString();
    //implement the graph for the past month
    this.reportService.getChargesForMonth(localStorage.getItem('accountNumber'), 1, true, this.startDate, this.endDate)
    .then(function(charges){
      console.log(charges)
      if(charges.error) {
        alert(charges.error);
      }
      else if(charges.success) {
        console.log('go back to authorization');
        that.router.navigate(['/authenticate']);
      } else {
        that.setChart(4, charges);
      }
    });
    
  }

 private setChart(month, charges){
  this.lineChartData[0].data = charges;
  this.lineChartData[0].label = this.Months[month];
  if(this.months_30.indexOf(month) != -1){
    this.lineChartLabels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
  } else if(this.months_31.indexOf(month) != -1) {
    this.lineChartLabels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
  } else if(month == 'year') {
    this.lineChartLabels = this.Months;
  } else {
    this.lineChartLabels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];
  }
  this.dataIsLoaded = true;
 }

 onMonthClick(){
  var that= this;
  var today = new Date();
  let m = this.Months.indexOf(this.selectedMonth);
  var d;
  var year; 
  if(this.selectedYear == null){
    year = today.getFullYear();
  } else {
    year = this.selectedYear;
  }
  if(this.months_30.indexOf(m) != -1) {
    d = 30;
  } else if(this.months_31.indexOf(m) != -1) {
    d =31;
  } else {
    d=28;
  }
  this.startDate = new Date(year, m, 1).toISOString();
  this.endDate = new Date(year,m, d).toISOString();
  this.reportService.getChargesForMonth(localStorage.getItem('accountNumber'), 1, true, this.startDate, this.endDate)
  .then(function(charges){
    //console.log(charges)
    if(charges.error) {
      alert(charges.error);
    }
    else if(charges.success) {
      console.log('go back to authorization');
      that.router.navigate(['/authenticate']);
    } else {
      that.setChart(m, charges);
      //console.log('changed month');
    }
  });
 }

 onYearClick(){
   var that = this;
   this.startDate = new Date(this.selectedYear, 0, 1).toISOString();
   this.endDate = new Date(this.selectedYear, 11, 31).toISOString();
   this.reportService.getChargesForYear(localStorage.getItem('accountNumber'), -1, true, this.startDate, this.endDate)
   .then(function(charges){
    //console.log(charges)
    if(charges.error) {
      alert(charges.error);
    }
    else if(charges.success) {
      console.log('go back to authorization');
      that.router.navigate(['/authenticate']);
    } else {
      that.lineChartData[0].label = that.selectedYear;
      that.lineChartLabels = that.Months;
      that.lineChartData[0].data = charges;
     //console.log(charges);
    }
   });
 }


 private updateYears() {
   var today = new Date();
   if(today.getFullYear() > this.Years[this.Years.length]) {
     var diff = today.getFullYear() - this.Years[this.Years.length];
     for(var i=0; i < diff; i++) {
       this.Years.push(today.getFullYear()+1);
     }
   }
 }

}
