import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { GoogleMaps } from '@ionic-native/google-maps';
// import { TextLocationSearchComponent } from './text-location-search/text-location-search.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AngularFireModule.initializeApp(environment.firebaseConfig), IonicModule.forRoot(), AppRoutingModule, ReactiveFormsModule, IonicModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, GoogleMaps],
  bootstrap: [AppComponent],
  exports:[],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
