import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { GoogleMap } from '@capacitor/google-maps';
// import { Marker, GoogleMaps } from '@ionic-native/google-maps';
import { environment } from 'src/environments/environment';
import { TextLocationSearchComponent } from '../text-location-search/text-location-search.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  @ViewChild('component1') component1!: TextLocationSearchComponent;
  @ViewChild('component2') component2!: TextLocationSearchComponent;

  ionViewDidEnter() {
    //Set latitude and longitude of some place
  }
  onSearchChange(event: any) {
    console.log('event', event);
  }
  handleChildClickEvent(comp: string, event: any) {
    console.log('event2', event);
  }
  async ngOnInit(): Promise<void> {}

  async getGeolocation(): Promise<{ lat: number; lng: number }> {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const latitude = coordinates.coords.latitude;
      const longitude = coordinates.coords.longitude;
      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);

      return { lat: latitude, lng: longitude };
    } catch (error) {
      console.error('Error getting geolocation', error);
      return { lat: 37.7749, lng: -122.4194 };
    }
  }
}
function ionViewDidEnter() {
  throw new Error('Function not implemented.');
}
