import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from '../../environments/environment';
import { Geolocation } from '@capacitor/geolocation';
import { Marker, GoogleMaps, LatLng } from '@ionic-native/google-maps';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  constructor(private elemenRef: ElementRef) {}

  ngOnInit() {
    this.loadMap();
  }

  getMapStyles(): google.maps.MapTypeStyle[] {
    return [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }], // Hide labels for points of interest (POI)
      },
      {
        featureType: 'transit.station',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }], // Hide labels for transit stations
      },
      // Add more style rules to hide other place types as needed
    ];
  }

  userTracking(map: google.maps.Map) {
    return {
      createCenterMarker: (): void => {
        new google.maps.Marker({
          position: map.getCenter(),
          map: map,
        });
      },
      createCircleAroundUserMarker: (): void => {
        new google.maps.Circle({
          strokeColor: '#00FF00',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#00FF00',
          fillOpacity: 0.35,
          map: map,
          center: map.getCenter(),
          radius: 2000,
        });
      },
      async getUserLocation(): Promise<GeolocationCoordinates> {
        return new Promise<GeolocationCoordinates>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve(position.coords),
            (error) => reject(error)
          );
        });
      },
      async trackUserLocation(): Promise<void> {
        try {
          const userLocation: GeolocationCoordinates = await this.getUserLocation();
          const location: google.maps.LatLngLiteral = this.convertToLatLngLiteral(userLocation);
          this.updateMap(location);

          // Draw a marker at the user's location
          const marker: google.maps.Marker = this.drawMarker(location);

          // Periodically update the user's location
          setInterval(async () => {
            const updatedLocation: GeolocationCoordinates = await this.getUserLocation();
            const updatedLatLng: google.maps.LatLngLiteral = this.convertToLatLngLiteral(updatedLocation);
            this.updateMap(updatedLatLng);

            // Update the marker position
            marker.setPosition(updatedLatLng);
          }, 5000); // Update every 5 seconds
        } catch (error: any) {
          console.error('Error getting user location:', error);
        }
      },
      convertToLatLngLiteral(coordinates: GeolocationCoordinates): google.maps.LatLngLiteral {
        return {
          lat: coordinates.latitude,
          lng: coordinates.longitude,
        };
      },
      updateMap(location: google.maps.LatLngLiteral): void {
        map.setCenter(location);
      },
      drawMarker(location: google.maps.LatLngLiteral): google.maps.Marker {
        const marker = new google.maps.Marker({
          position: location,
          map: map,
          title: 'User Location',
        });
        return marker;
      },
    };
  }

  async search(map: google.maps.Map) {
    const placesService = new google.maps.places.PlacesService(map);
    let places: google.maps.places.PlaceResult[] = [];






    const addMarkers = () => {
      if (places.length) {
        for (let i = 0; i < places.length; i++) {
          const place = places[i];
          if (place && place.geometry) {
            console.log(place.name, place.geometry.location);
            const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            const name: any = place.name;
            new google.maps.Marker({
              position: place.geometry.location,
              map: map,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: randomColor,
                fillOpacity: 0.8,
                strokeColor: randomColor,
                strokeWeight: 2,
                scale: 8,
              },
              label: {
                text: name,
                color: 'blue',
                fontSize: '12px',
                fontWeight: 'bold',
              },
            });
          new google.maps.Circle({
              strokeColor: randomColor,
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: randomColor,
              fillOpacity: 0.35,
              map: map,
              center: place.geometry.location,
              radius: 500,
            });
          }
        }
      }
    };

    const placeSearch = async (
      searchOptions: google.maps.places.PlaceSearchRequest
    ): Promise<{ results: google.maps.places.PlaceResult[]; addMarkers: () => void }> => {
      try {
        places = await new Promise<google.maps.places.PlaceResult[]>(
          (resolve, reject) => {
            placesService.nearbySearch(
              searchOptions,
              (
                results: google.maps.places.PlaceResult[] | null,
                status
              ) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                  const places: google.maps.places.PlaceResult[] = results
                    ? results
                    : [];
                  resolve(places);
                } else {
                  console.error('Nearby search failed:', status);
                  resolve([]);
                }
              }
            );
          }
        );

        return {
          results: places,
          addMarkers: addMarkers,
        };
      } catch (error) {
        console.error('Error performing search:', error);
        return {
          results: [],
          addMarkers: addMarkers,
        };
      }
    };

    return {
      placeSearch: placeSearch,
    };
  }



  async loadMap() {
    const geoLocation: google.maps.LatLngLiteral = await this.getGeolocation();

    const mapElement = this.elemenRef.nativeElement.querySelector('#mapCanvas');
    try {
      
      const mapStyles: google.maps.MapTypeStyle[] = this.getMapStyles();

      const map = new google.maps.Map(mapElement, {
        center: { lat: geoLocation.lat, lng: geoLocation.lng },
        zoom: 12,
        styles: mapStyles,
      });

      const userTracking = this.userTracking(map);
      userTracking.createCenterMarker();
      userTracking.createCircleAroundUserMarker();
      // userTracking.trackUserLocation();

      // Get the current visible bounds of the map
      const bounds = this.calculateBounds(
        { lat: geoLocation.lat, lng: geoLocation.lng },
        20000
      );

      // Calculate the center of the visible bounds
      const searchOptions = {
        bounds: bounds,
        type: 'restaurant', // Type of business to search for (e.g., restaurant, cafe, etc.)
      };
      const userSearch = await this.search(map);
      const { results, addMarkers }: {results: google.maps.places.PlaceResult[]; addMarkers: () => void } = await userSearch.placeSearch(searchOptions);
      addMarkers();

    } catch (error: any) {
      console.log('error', error);
    }
  }

  async getGeolocation(): Promise<google.maps.LatLngLiteral> {
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

  calculateBounds(center: google.maps.LatLngLiteral, radius: number) {
    const earthRadius = 6371000; // Earth's radius in meters
    const latDistance = radius / earthRadius;
    const lngDistance =
      radius / (earthRadius * Math.cos((Math.PI / 180) * center.lat));

    const neLat = center.lat + (latDistance * 180) / Math.PI;
    const neLng = center.lng + (lngDistance * 180) / Math.PI;
    const swLat = center.lat - (latDistance * 180) / Math.PI;
    const swLng = center.lng - (lngDistance * 180) / Math.PI;

    return new google.maps.LatLngBounds(
      new google.maps.LatLng(swLat, swLng),
      new google.maps.LatLng(neLat, neLng)
    );
  }
}
