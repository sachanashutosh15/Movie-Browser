import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HomeService } from '../services/home.service';
import {
  catchError,
  debounceTime,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import {
  Genre,
  MovieDetails,
  MoviesList,
} from '../interfaces/movie-info.interfaces';
import { ScrollService } from '../services/scroll.service';
import { I_SearchByName } from '../interfaces/query-interfaces';
import { FavouritesService } from '../services/favourites.service';
import { FormControl } from '@angular/forms';
import { TitleStrategy } from '@angular/router';

type Activity = 'default' | 'search' | 'filter' | 'favourites';

@Component({
  selector: 'apf-app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  moviesList: MovieDetails[] = [];

  genreIdNameMap: { [id: string]: string } = {};
  genreList!: Genre[];
  genreQuery!: string;
  isFilterOn = false;

  pageNumber = 1;
  isLoading = false;

  remainingScroll$ = this.scrollService.getRemainingScroll();
  listTobeUpdatedAt = 20;

  currActivity: Activity = 'default';

  searchQuery = '';
  searchSubject = new Subject<void>();

  totalPages!: number;

  favCount!: number;
  get favCount$() {
    return this.favCount;
  }

  get typeOfFavCount$() {
    return typeof this.favCount;
  }

  refreshFavCount$ = new Subject<void>();

  unsubscribe$ = new Subject<void>();

  get moviesList$(): Observable<MovieDetails[]> {
    return of(this.moviesList);
  }

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  ngAfterViewInit(): void {
    this.scrollService.setScrollElement(this.scrollContainer);
  }

  constructor(
    private readonly homeService: HomeService,
    private readonly scrollService: ScrollService,
    private readonly favouritesService: FavouritesService
  ) {}

  ngOnInit(): void {
    this.updateMoviesList();
    this.setupGenreMap();
    this.setupInfiniteScroll();
    this.initializeSearchActivity();
    this.setupFavCountSubscription();
  }

  private setupFavCountSubscription() {
    this.refreshFavCount$.subscribe(() => {
      this.favCount = this.favouritesService.getFavMoviesCount();
    });
  }

  private initializeSearchActivity() {
    this.searchSubject
      .pipe(
        debounceTime(700),
        switchMap(() => {
          if (this.searchQuery == '') {
            this.resetActivityToDefault();
            return of({});
          }
          this.isLoading = true;
          return this.homeService.searchMovies({
            query: this.searchQuery,
            page: this.pageNumber,
          });
        }),
        catchError((error) => of(error))
      )
      .subscribe({
        next: (res: MoviesList) => {
          if (res.results) {
            this.currActivity = 'search';
            this.totalPages = res.total_pages;
            this.updateMoviesList(
              res.results.map((movieDetails) => {
                return {
                  ...movieDetails,
                  isFavourite: false,
                };
              })
            );
          }
        },
      });
  }

  private setupInfiniteScroll() {
    this.remainingScroll$.subscribe((res) => {
      if (this.shouldMovieListUpdate(res) && !this.isLoading) {
        this.updateMoviesList();
      }
    });
  }

  private setupGenreMap() {
    this.isLoading = true;
    this.homeService
      .fetchGenreList()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.genreList = res.genres.map((genre) => ({
          ...genre,
          isSelected: false,
        }));
        res.genres.forEach((genre) => {
          this.genreIdNameMap[genre.id] = genre.name;
        });
        this.isLoading = false;
      });
  }

  private resetActivityToDefault() {
    this.currActivity = 'default';
    this.pageNumber = 1;
    this.isLoading = true;
    this.moviesList = [];
    this.updateMoviesList();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getGenreList(genreIds: number[]) {
    let genres: string[] = [];
    genreIds.forEach((id) => {
      if (this.genreIdNameMap?.[id]) {
        genres.push(this.genreIdNameMap[id]);
      }
    });
    return genres;
  }

  updateMoviesList(moviesList?: MovieDetails[]): void {
    if (this.currActivity == 'default') {
      this.updatePopularMoviesList();
    } else {
      if (moviesList) {
        this.moviesList = moviesList?.length ? [...moviesList] : [];
        this.pageNumber++;
        this.isLoading = false;
      } else {
        if (
          this.currActivity == 'search' &&
          this.pageNumber <= this.totalPages
        ) {
          this.updateMoviesListForSearch();
        } else if (
          this.currActivity == 'filter' &&
          this.pageNumber <= this.totalPages
        ) {
          this.updateMoviesListForFilter();
        }
      }
    }
  }

  private updatePopularMoviesList() {
    this.isLoading = true;
    this.homeService.fetchMovies(this.pageNumber).subscribe({
      next: (res) => {
        this.updateMoviesListNPage(res);
      },
      error: (error) => {
        this.handleSubscriptionError(error);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private updateMoviesListForSearch() {
    const searchParams: I_SearchByName = {
      query: this.searchQuery,
      page: this.pageNumber,
    };
    this.isLoading = true;
    this.homeService.searchMovies(searchParams).subscribe({
      next: (res) => {
        this.updateMoviesListNPage(res);
      },
      error: (error) => {
        this.handleSubscriptionError(error);
      },
    });
  }

  private updateMoviesListForFilter() {
    this.isLoading = true;
    this.homeService
      .fetchFilteredMovies(this.genreQuery, this.pageNumber)
      .subscribe({
        next: (res) => {
          this.updateMoviesListNPage(res);
        },
        error: (error) => {
          this.handleSubscriptionError(error);
        },
      });
  }

  private handleSubscriptionError(error: any) {
    console.log('error:', error);
    this.isLoading = false;
  }

  private updateMoviesListNPage(res: MoviesList) {
    this.totalPages = res.total_pages;
    this.moviesList = [
      ...this.moviesList,
      ...res.results.map((movieDetails) => ({
        ...movieDetails,
        isFavourite: false,
      })),
    ];
    this.pageNumber++;
    this.isLoading = false;
  }

  shouldMovieListUpdate(scrollPos: number): boolean {
    const remainingScroll = Math.ceil(scrollPos);
    if (
      remainingScroll < this.listTobeUpdatedAt &&
      remainingScroll > this.listTobeUpdatedAt - 10
    )
      return true;
    else return false;
  }

  performSearch(): void {
    this.pageNumber = 1;
    this.searchSubject.next();
  }

  markAsFavourite(movieDetails: MovieDetails) {
    for (let i = 0; i < this.moviesList.length; i++) {
      if (this.moviesList[i].id == movieDetails.id) {
        this.moviesList[i].isFavourite = true;
        break;
      }
    }
    this.favouritesService.addToFavourites(movieDetails);
    this.refreshFavCount$.next();
  }

  removeFromFavourites(movieDetails: MovieDetails) {
    for (let i = 0; i < this.moviesList.length; i++) {
      if (this.moviesList[i].id == movieDetails.id) {
        this.moviesList[i].isFavourite = false;
        break;
      }
    }
    this.favouritesService.removeFromFavourites(movieDetails);
    this.refreshFavCount$.next();
  }

  toggleFavMovies() {
    if (this.currActivity == 'favourites') {
      this.showPopularMovies();
    } else {
      this.favCount = this.favouritesService.getFavMoviesCount();
      this.currActivity = 'favourites';
      this.moviesList = this.favouritesService.getFavMoviesList();
    }
  }

  toggleGenreSelection(genre: Genre) {
    for (let i = 0; i < this.genreList.length; i++) {
      if (this.genreList[i].id == genre.id) {
        this.genreList[i].isSelected = !this.genreList[i].isSelected;
      }
    }
  }

  handleFiltering() {
    if (this.isFilterOn) {
      const selectedGenres = this.genreList.filter((genre) => genre.isSelected);
      if (selectedGenres.length > 0) {
        this.pageNumber = 1;
        const selectedGenreIds = selectedGenres.map((genre) => genre.id);
        this.genreQuery = selectedGenreIds.join('%2C');
        this.isLoading = true;
        this.homeService
          .fetchFilteredMovies(this.genreQuery, this.pageNumber)
          .subscribe({
            next: (res: MoviesList) => {
              if (res.results) {
                this.currActivity = 'filter';
                this.updateMoviesList(
                  res.results.map((movieDetails: MovieDetails) => ({
                    ...movieDetails,
                    isFavourite: false,
                  }))
                );
              }
            },
          });
      } else {
        this.currActivity = 'default';
        this.moviesList = [];
        this.pageNumber = 1;
        this.updatePopularMoviesList();
      }
      this.isFilterOn = false;
    } else {
      this.isFilterOn = true;
    }
  }

  showPopularMovies() {
    this.currActivity = 'default';
    this.moviesList = [];
    this.pageNumber = 1;
    this.updatePopularMoviesList();
  }

  getActivityName() {
    if (this.currActivity == 'search') {
      return 'Search Results';
    } else if (this.currActivity == 'filter') {
      return 'Filtered Results';
    } else if (this.currActivity == 'favourites') {
      return 'Favourite Movies';
    } else {
      return 'Popular Movies';
    }
  }
}
