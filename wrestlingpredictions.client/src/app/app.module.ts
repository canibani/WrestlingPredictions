import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { PredictionPageComponent } from './components/prediction-page/prediction-page.component';
import { AppRoutingModule } from './app-routing.module';
import { EventListComponent } from './components/prediction-page/event-list/event-list.component';
import { MatchCardComponent } from './components/prediction-page/match-card/match-card.component';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './components/register/register.component';
import { AuthinceptorInterceptor } from './authinceptor.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PredictionPageComponent,
    EventListComponent,
    MatchCardComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule, HttpClientModule, AppRoutingModule, ReactiveFormsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthinceptorInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
