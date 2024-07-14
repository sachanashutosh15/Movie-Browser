import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MovieDetails } from '../../interfaces/movie-info.interfaces';
import { CommonModule } from '@angular/common';
import {
  APP_CONFIG_SERVICE,
  AppConfig,
} from '../../../../appConfig/appConfig.service';

@Component({
  selector: 'apf-movie-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent {
  @Input() movieDetails!: MovieDetails;
  @Input() genres!: string[];
  @Output() markFavourite = new EventEmitter<MovieDetails>();
  @Output() removeFavourite = new EventEmitter<MovieDetails>();

  get imageUrl(): string {
    return `${this.appConfig.imageBaseUrl}w200${this.movieDetails.poster_path}`;
  }

  constructor(
    @Inject(APP_CONFIG_SERVICE) private readonly appConfig: AppConfig
  ) {}

  markAsFavourite(movieDetails: MovieDetails) {
    this.markFavourite.emit(movieDetails);
  }

  removeFromFavourites(movieDetails: MovieDetails) {
    this.removeFavourite.emit(movieDetails);
  }
}
