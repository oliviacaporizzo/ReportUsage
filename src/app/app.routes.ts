import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticateComponent } from './authenticate/authenticate.component';
import { SummaryReportComponent } from './reports/summary-report/summary-report.component';
import { DashboardComponent } from './reports/dashboard/dashboard.component';
import { DetailedReportComponent } from './reports/detailed-report/detailed-report.component';
import { LogoutComponent } from './logout/logout.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'authenticate',
        pathMatch: 'full'
    },
    { 
        path: 'authenticate', 
        component: AuthenticateComponent 
    }, 

    {
        path: 'summaryreport',
        component: SummaryReportComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'detailedreport',
        component: DetailedReportComponent
    },
    {
        path: 'logout',
        component: LogoutComponent
    }
  ];

  export const routing: ModuleWithProviders = RouterModule.forRoot(routes);