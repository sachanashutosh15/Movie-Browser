import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG_SERVICE } from '../../../appConfig/appConfig.service';
import { AppConfig } from '../../../appConfig/appConfig.service';
import { catchError, exhaustMap, map, Observable, of } from 'rxjs';
import { GenreList, MoviesList } from '../interfaces/movie-info.interfaces';
import { I_SearchByName } from '../interfaces/query-interfaces';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(
    private readonly httpClient: HttpClient,
    @Inject(APP_CONFIG_SERVICE) private config: AppConfig
  ) {}

  fetchMovies(page: number): Observable<MoviesList> {
    const moviesListUrl = `${this.config.endPoint}movie/popular?language=en-US&page=${page}`;
    return this.httpClient.get<MoviesList>(moviesListUrl).pipe(
      map((res) => res),
      catchError((error) => of(error))
    );
  }

  fetchGenreList(): Observable<GenreList> {
    const genereListUrl = `${this.config.endPoint}genre/movie/list?language=en`;
    return this.httpClient.get<GenreList>(genereListUrl);
  }

  searchMovies(searchParams: I_SearchByName): Observable<MoviesList> {
    const moviesListUrl = `${this.config.endPoint}search/movie?query=${searchParams.query}&include_adult=false&language=en-US&page=${searchParams.page}`;
    return this.httpClient.get<MoviesList>(moviesListUrl).pipe(
      map((res) => res),
      catchError((error) => of(error))
    );
  }

  fetchFilteredMovies(genreQuery: string, page: number) {
    const url = `${this.config.endPoint}discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${genreQuery}`;
    return this.httpClient.get<MoviesList>(url).pipe(
      map((res) => res),
      catchError((error) => of(error))
    );
  }
  //?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc
}
