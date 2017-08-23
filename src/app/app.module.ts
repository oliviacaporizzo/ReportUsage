import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }    from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { StaticPagerService } from 'cui/services';
//mport { ApAlertComponent } from 'cui/components';

import { AppComponent } from './app.component';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { AuthenticateService } from './authenticate/authenticate.service';
import { routing } from './app.routes';
import { ReportsModule } from './reports/reports.module';
import { LogoutComponent } from './logout/logout.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthenticateComponent,
    LogoutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    ReportsModule
  ],
  providers: [AuthenticateService, StaticPagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
