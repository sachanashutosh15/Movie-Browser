# MovieBrowser

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Using The App

### Home

The app is setup to redirect to `/home` as it loads, in that page are present popular 20 movies provided by TMDB API.
As one scrolls down and tries to go beyond 80% scroll space, more movies are loaded, making it an `infinite scroll`.
<br/>

### Search

Now let's say one decides to search something specific, and clicks on search and types let's say The Matrix the api call
is made only after 700ms after typing is stopped, and the queried movies list gets rendered.
<br/>

If one decides to scroll down in these searched results, `the infinite scroll feature will fetch the next page of queried movies`
and the `page will grow, till the responses come`.
<br/>

If you clear the search input field, the page will start showing the popular movies.
<br/>

### Genre Filter

Genre filter button opens genre filter display, in this display genre select buttons are present, one can select any number
of genres and when the hit genre filter button again, the genre filter display will be closed and the results will be displayed on the page.
<br/>

Again if one decides to scroll down this filtered results, the app will fetch the results(if available) of same genres and the page will grow.
<br/>

### Favourites

Now if you decide to click on that nice looking heart, it will show you the list of your favourite movies.
This feature is implemented using localstorage so if you refresh the page, the list of favourites persists.
<br/>

### Add To Favourites Button

This is pretty intuitive, if you click on `add to favourites`, that movie gets added to your list of favourites.
<br/>

### Remove From Favourites Button

This is also obvious, if you click `remove` that move will be removed from you list of favourites.
<br/>

## Improvements Needed

1. Look and design and user experience can be improved significantly by investing more planning and time.

2. This project is build without using Redux, by using that api calls can be minimized resulting in improved performance and speed.

3. The content of card overflows when there are a lot of genres, or if the movie has a very long name.

4. If the api sends the image which as height more that other ones it overflows, needs to be addressed.
   <br/>

## Structure and design of App

As it is a small project and almost everything is present inside `home` except `header`, so it is made of 3 modules, `AppModule`, `HomeModule`, `HeaderModule`.
<br/>

### AppModule

`AppModule` bootstraps `AppComponent` which renders `HeaderComponent` and has `Outlet` for other components coming from different routes. `AppRoutingModule` redirects all paths to `/home`.
`AppModule` also registers an `interceptor` which adds accesstoken to every http request.
<br/>

### HeaderModule

`HeaderModule` is kept different because it is expected to be shared by all the pages.
<br/>

### HomeModule

`HomeModule` has two components first `HomeComponent` itself and other `MovieCardComponent`.
`HomeRoutingModule` renders `HomeComponent`.
<br/>

#### HomeComponent

`HomeComponent` renders `filter_trigger search_bar favourites_trigger container` and `movies section`.

`HomeComponent` uses 3 services:
<br/>

##### HomeService

`homeService`: has methods to fetch movieslist for search queries, filter requests, popular movies list.
homeService uses an `AppConfigService` which `provides the baseUrls`, accessToken for `TMDB APIs`.
<br/>

##### FavouritesService

`favouritesService`: has methods to `add movie`, `remove movie`, from `favouritesList` and also `getFavouriteMovies` etc.
favouritesService internally uses `localStorageService` which communicates to localStorage of browser.
<br/>

##### ScrollService

`ScrollService`: has method which take the reference of an element and detects and returns scroll position.

### Mechanics

On initialization `HomeComponent` sets up the `InfiniteScroll`, `search activity listener`, `initializes movies list` etc.

<br/>
HomeComponent has 4 activity states `default`, `search`, `filter`, `favourites`.

<br/>
When one scrolls down, when scroll passes 80% mark 
1. if activity state is `default` it fetches more popular movies.
2. if activity state is `search` it fetches more movies `based on same search` which was made earlier.
3. if activity state is `filter` it fetches more movies `based on same filter`.
4. if activity state is `favourites` it doesn't make any request.
<br/>

MovieCard takes `movie details` as input and `emits events` as output on click of `add to favourites` and `remove`. On add to favourites event `favouritesService` adds that movie to favourites for `remove` deletes the same movie.
<br/>

when search is started the activity becomes `search`.
when search is cleared the activity resets to `default`.
<br/>

when genres filter is used activity becomes `filter`.
when there is no genre selected and `genre filter display` is closed `activity` resets to `default`.
<br>

when favourites(heart button) is clicked activity becomes `favourites`.
when it is clicked again the activity resets to `default`.
