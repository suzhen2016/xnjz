angular.module('rsc.example', ['ionic'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })

           
        // if none of the above states are matched, use this as the fallback
       
        
    });
