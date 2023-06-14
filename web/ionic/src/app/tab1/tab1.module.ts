import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { TextLocationSearchComponentModule } from '../text-location-search/text-location-search.module';
// import { GoogleMaps } from '@ionic-native/google-maps';
import { Tab1PageRoutingModule } from './tab1-routing.module';
import { MapComponent } from '../map/map.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    TextLocationSearchComponentModule,
    Tab1PageRoutingModule,
  ],
  // providers:[GoogleMaps],
  declarations: [Tab1Page],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Tab1PageModule {}
