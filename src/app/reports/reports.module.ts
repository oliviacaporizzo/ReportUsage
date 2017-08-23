import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from  '@angular/http';
import { ChartModule } from 'angular2-chartjs';
import { FormsModule } from '@angular/forms';
import { Daterangepicker } from 'ng2-daterangepicker';
import { ChartsModule } from 'ng2-charts';

//import { CuiTableComponent } from 'cui/components';

import { SummaryReportComponent } from './summary-report/summary-report.component';
import { ReportsService } from './reports.service';
import { DetailedReportComponent } from './detailed-report/detailed-report.component';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    HttpModule,
    ChartsModule,
    FormsModule,
    Daterangepicker,
    ChartModule
  ],
  declarations: [
    SummaryReportComponent,
    DetailedReportComponent,
    DashboardComponent
  ],
  providers: [ReportsService]
})

export class ReportsModule { }
