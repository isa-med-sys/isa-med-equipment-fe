import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './infrastructure/routing/app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './authentication/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from './layout/layout.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
//import { MarketplaceModule } from './feature-modules/marketplace/marketplace.module';
import { JwtInterceptor } from './authentication/jwt/jwt.interceptor';
import { AdministrationModule } from './feature-modules/administration/administration.module';
import { UserModule } from './feature-modules/user/user.module';
import { CompanyModule } from './feature-modules/company/company.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    BrowserAnimationsModule,
    LayoutModule,
    UserModule,
    CompanyModule,
    HttpClientModule,
    AdministrationModule,
    //MarketplaceModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  
 }
