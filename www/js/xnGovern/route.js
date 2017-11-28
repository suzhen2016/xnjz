angular.module('xn.govern', ['ui.router', 'xn.govern.ctrl'])
    .config(['$stateProvider', function ($stateProvider,$urlRouterProvider) {
        $stateProvider
      .state('tab.govern', {
                url: '/govern',
                views: {
                    'tab-govern': {
                        templateUrl: 'js/xnGovern/template/govern.html',
                        controller:'govern_ctrl'
                    }
                }
            })
    }])