import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TextLocationSearchComponent } from './text-location-search.component';


@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [TextLocationSearchComponent],
  exports: [TextLocationSearchComponent]
})
export class TextLocationSearchComponentModule {}
