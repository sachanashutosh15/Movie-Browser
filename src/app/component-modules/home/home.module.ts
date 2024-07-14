import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeService } from './services/home.service';
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { ScrollService } from './services/scroll.service';
import { FavouritesService } from './services/favourites.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    MovieCardComponent,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  declarations: [HomeComponent],
  providers: [HomeService, ScrollService, FavouritesService],
})
export class HomeModule {}
