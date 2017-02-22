// MODULE
var omdrApp = angular.module('omdrApp', ['ngRoute']);

// ROUTES
omdrApp.config(function ($routeProvider,  $locationProvider, $sceDelegateProvider) {
    
    $routeProvider
    
    .when('/filmlist/:pageNum', {
        templateUrl: 'pages/list.html',
        controller: 'filmListController'
    })
    
    .when('/filmdetails/:filmSelected', {
        templateUrl: 'pages/details.html',
        controller: 'filmDetailsController'
    })
    
    .otherwise({
        templateUrl: 'pages/search.html',
        controller: 'filmSearchController'
    })
    
    $locationProvider.hashPrefix('');
    
    $sceDelegateProvider.resourceUrlWhitelist([
       // Allow same origin resource loads
        'self',
        // Allow loading from desired sites
        'http://www.omdbapi.com/**'
    ]);
    
});

// SERVICES

omdrApp.service('searchService', function(){
    
    this.searchFilm = '';
    this.currentPageNum = '';
});

// CONTROLLERS
omdrApp.controller('filmSearchController', ['$scope', '$location', 'searchService', function($scope, $location, searchService) {   
    
    $scope.searchFilm = '';
    
    $scope.$watch('searchFilm', function() {
       searchService.searchFilm = $scope.searchFilm; 
    });   
    
    $scope.submit = function() {
        
        if (searchService.searchFilm !== '') {
            // console.log('Search String is ' + searchService.searchFilm);
            $location.path("/filmlist/1");    
        }
        else {
            console.log('Search String is empty');
            
        }
        
    };
    
}]);


omdrApp.controller('filmListController', ['$scope', '$http', '$routeParams', 'searchService', function($scope, $http, $routeParams, searchService) {
    
    $scope.searchFilm = searchService.searchFilm;
    
    $scope.pageNum = $routeParams.pageNum || '1';
    searchService.currentPageNum = $scope.pageNum;
    
    $scope.pageNumPrev = parseInt($scope.pageNum) - 1;
    $scope.pageNumNext = parseInt($scope.pageNum) + 1;
    
    // console.log($scope.pageNumPrev);
    // console.log($scope.pageNumNext);
    
    $http.get('http://www.omdbapi.com/?s=' + $scope.searchFilm + '&page=' + $scope.pageNum )
    .then(function(response){
        $scope.filmResult = response.data;
        $scope.maxPages = Math.floor(Number($scope.filmResult.totalResults)/10);
        // console.log($scope.maxPages);
    });
    
    
    
    
}]);

omdrApp.controller('filmDetailsController', ['$scope', '$http', '$routeParams', 'searchService', function($scope, $http, $routeParams, searchService){
    
    $scope.filmSelected = $routeParams.filmSelected;
    
    $scope.currentPageNum = searchService.currentPageNum; 
    
    $http.get('http://www.omdbapi.com/?i=' + $scope.filmSelected )
    .then(function(response){
        $scope.filmDetailsAPIResult = response.data;
    });    
    
}]);