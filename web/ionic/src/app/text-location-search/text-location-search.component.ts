import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-text-location-search',
  templateUrl: './text-location-search.component.html',
  styleUrls: ['./text-location-search.component.scss'],
})
export class TextLocationSearchComponent implements OnInit {
  @ViewChild('searchbar') searchbar: any;
  @Output() clickEvent: EventEmitter<any> = new EventEmitter<any>();
  searchQuery: any = '';
  items!: any[];
  predictions: any[] = [];
  autocomplete: google.maps.places.AutocompleteService;
  constructor(private elemenRef: ElementRef) {
    this.autocomplete = new google.maps.places.AutocompleteService();
  }
  ngOnInit(): void {}

  selectSearchResult( item: any) {
      this.searchQuery= item.description;
    this.clickEvent.emit(item);

    this.predictions = [];
  }

  onSearchChange(event: any) {
    const query = event.target.value;

    const options = {
      types: ['address'],
    };

    // const inputElement = this.searchbar.el.querySelector('input');
    if (!query.length) {
      this.predictions = [];
    }

    this.autocomplete.getPlacePredictions(
      { input: query, ...options },
      (predictions: any, status: google.maps.places.PlacesServiceStatus) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // Process the predictions or display them in another format
          this.predictions = predictions;
          console.log('Predictions:', predictions);
        } else {
          console.error('Autocomplete request failed:', status);
        }
      }
    );
  }
}
