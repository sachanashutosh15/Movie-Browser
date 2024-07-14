import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../../local-storage.service';
import { MovieDetails } from '../interfaces/movie-info.interfaces';

@Injectable({
  providedIn: 'root',
})
export class FavouritesService {
  constructor(private readonly localStorageService: LocalStorageService) {}

  favMoviesCount!: number;

  addToFavourites(movieDetails: MovieDetails) {
    const currFavMovies = this.localStorageService.getItem('favMovies');
    if (!currFavMovies) {
      const favMovies = {
        [movieDetails.title]: movieDetails,
      };
      this.favMoviesCount = Object.values(favMovies).length;
      this.localStorageService.setItem('favMovies', JSON.stringify(favMovies));
    } else {
      const updatedFavMovies: { [key: string]: MovieDetails } =
        JSON.parse(currFavMovies);
      updatedFavMovies[movieDetails.title] = movieDetails;
      this.favMoviesCount = Object.values(updatedFavMovies).length;
      this.localStorageService.setItem(
        'favMovies',
        JSON.stringify(updatedFavMovies)
      );
    }
  }

  removeFromFavourites(movieDetails: MovieDetails) {
    const currFavMovies = this.localStorageService.getItem('favMovies');
    if (currFavMovies) {
      const updatedFavMovies: { [key: string]: MovieDetails } =
        JSON.parse(currFavMovies);
      delete updatedFavMovies[movieDetails.title];
      this.favMoviesCount = Object.values(updatedFavMovies).length;
      this.localStorageService.setItem(
        'favMovies',
        JSON.stringify(updatedFavMovies)
      );
    }
  }

  getFavMoviesCount() {
    if (typeof this.favMoviesCount === 'number') {
      return this.favMoviesCount;
    } else {
      const currFavMovies = this.localStorageService.getItem('favMovies');
      if (currFavMovies) {
        const updatedFavMovies: { [key: string]: MovieDetails } =
          JSON.parse(currFavMovies);
        return Object.values(updatedFavMovies).length;
      } else {
        return 0;
      }
    }
  }

  getFavMoviesList(): MovieDetails[] {
    const currFavMovies = this.localStorageService.getItem('favMovies');
    if (currFavMovies) {
      const favMovies: MovieDetails[] = Object.values(
        JSON.parse(currFavMovies)
      );
      return favMovies;
    } else {
      return [];
    }
  }
}
