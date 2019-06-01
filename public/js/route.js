'use strict'
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var billapp = angular.module('billapp', ['ionic', 'ui.bootstrap', 'moment-picker', '720kb.datepicker', 'angularUtils.directives.dirPagination', 'ds.clock', 'chart.js'])
.filter('unique', function() {
   // we will return a function which will take in a collection
   // and a keyname
   return function(collection, keyname) {
      // we define our output and keys array;
      var output = [], 
      keys = [];
      
      // we utilize angular's foreach function
      // this takes in our original collection and an iterator function
      angular.forEach(collection, function(item) {
          // we check to see whether our object exists
          var key = item[keyname];
          // if it's not already part of our keys array
          if(keys.indexOf(key) === -1) {
              // add it to our keys array
              keys.push(key); 
              // push this item to our final output array
              output.push(item);
            }
          });
      // return our array which should be devoid of
      // any duplicates
      return output;
    };
  })
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})


.config(function($stateProvider, $urlRouterProvider, $httpProvider, $logProvider, $provide) {
	$httpProvider.defaults.withCredentials = true;

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('login', {
	url: '/login',
    templateUrl: './pages/login/templates/login.htm',
    controller: 'loginPageController'
  })
  .state('maintab', {
    url: '/maintab',
    templateUrl: './pages/tabs/templates/maintab.htm',
    controller: 'maintabController'
  })
  .state('maintab.dashboard', {
    url: '/dashboard',
    templateUrl: './pages/dashboard/templates/dashboardtab.htm',
    controller: 'dashboardtabController'
  })
  .state('maintab.billentry', {
    url: '/billentry',
    templateUrl: './pages/billentry/templates/billentrytab.htm',
    controller: 'billentrytabController'
  })
  .state('maintab.billupdate', {
    url: '/billupdate',
    templateUrl: './pages/billupdate/templates/billupdatetab.htm',
    controller: 'billupdatetabController'
  })
  .state('tab', {
    url: '/tab',
    templateUrl: './pages/tabs/templates/inboxMaintab.htm',
    controller: 'maintabController'
  })
  .state('tab.inbox', {
    url: '/inbox',
    templateUrl: './pages/inbox/templates/inboxtab.htm',
    controller: 'inboxtabController'
  })

  $httpProvider.interceptors.push('HttpInterceptor');
  $urlRouterProvider.otherwise('/login');

})
.factory('HttpInterceptor', ['$q', '$window', '$rootScope', '$injector', HttpInterceptor]);

function HttpInterceptor($q, $window, $rootScope, $injector) {
  return {
      // optional method
      'request': function (config) {
          // do something on success, do not add api_key on login endpoint
          if (config.url.indexOf("login") == -1) {
            // var authService = $injector.get("authService");
            // // add to header api_key for JWT
            // if (authService.apiKey) {
            //   config.headers['apiKey'] = authService.apiKey;
            // }

          }
          $rootScope.loading = true;
          return config;
      },

      // optional method
      'requestError': function (rejection) {
          $rootScope.loading = false;
          return $q.reject(rejection);
      },


      // optional method
      'response': function (response) {
          // do something on success
          $rootScope.loading = false;
          return response;
      },

      // optional method
      'responseError': function (rejection) {
          // var authService = $injector.get("authService");
          if (rejection.status == 0 || rejection.status == -1) {
              //toastr.error( "Server is not responding. Check your connection and server status", "Communication failed" );
              //authService.apiKey = undefined;
              // not responding no network connection
          } else if (rejection.status == 403) {
              //   authService.apiKey = undefined;
              $window.location.href = "#/login"
          } else if (rejection.status == 401) {
              // this will display logn overlay
              //    authService.apiKey = undefined;
              $window.location.href = "#/login";
          } else if (rejection.status == 500) {
              //    authService.apiKey = undefined;
              $window.location.href = "#/login"
          } else if (rejection.status.toString().indexOf("40") == 0 || rejection.status.toString().indexOf("50") == 0) {
              // TODO some kind of error 400 or 500 type
          }
          $rootScope.loading = false;
          return $q.reject(rejection);
      }
  };
};