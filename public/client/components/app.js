angular.module('main-app')

.controller('MainCtrl', function(searchTheMovieDB, searchOMDB, $http, youTube) {

  this.user = {};
  this.recommendations = [];
  this.TMDBservice = searchTheMovieDB;
  this.OMDBService = searchOMDB;
  this.intendedUser;
  this.showDetails = false;
  this.movie = {};

  $http.get('/sess').then((session) => {

    this.intendedUser = session;
    this.user.username = this.intendedUser.data.username;
    this.user.watched = this.intendedUser.data.watched;

    // Creates the reccomendations
    //please dont hate me for this block
    this.user.watched.forEach(item => {
      if (item.isFavorite) {
        this.TMDBservice.searchById(item.imdb_id, data => {
          this.TMDBservice.getRecommendations(data.id, data => {
            var temp = data.results.sort((a, b) => b.popularity - a.popularity).slice(0, 5).map(item => item.id);
            temp.forEach(id => {
              this.TMDBservice.searchById(id, data => {
                this.recommendations.push(data.imdb_id);
                this.recommendations.sort();
              });
            });
          });
        });
      };
    });
  });
  this.recommendations = this.recommendations.filter((item, i, arr) => item !== arr[i + 1])

  // set trailer for video player on details view

  this.searchResults = (data) => {
    this.video = data[0];
  }

  // need to write a handleTitleClick function that will swap out the query string based on click

  this.handleTitleClick = (title, imdb, details, plot) => {
    console.log('title', title);
    console.log('imdb', imdb)
    youTube.search(`${title} official trailer`, this.searchResults);
    this.movie.title = title;
    this.movie.details = details;
    this.movie.details.Plot = this.movie.details.Plot || plot;
    this.movie.imdb = imdb;
    console.log('deets',details)
  }

  this.clearData = () => {
    this.movie = {}
  }

})
.directive('app', function() { // directive name is the HTML tag name REMEMBER THIS
  return {
    scope: {},
    restrict: 'E',
    controller: 'MainCtrl',
    controllerAs: 'ctrl',
    bindToController: true,
    templateUrl: 'public/client/templates/app.html'
  };
});
