angular.module('xn.menu', ['ui.router', 'xn.menu.ctrl'])
    .config(['$stateProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tab.menu', {
                url: '/menu/:id',
                views: {
                    'tab-menu': {
                        templateUrl: 'js/menu/template/menu.html',
                        controller: 'menu_ctrl'
                    }
                }
            })
            .state('tab.menuHomeMore',{
                url: '/menuHomeMore/:id/:title',
                views: {
                    'tab-menu': {
                        templateUrl: 'js/menu/template/more.html',
                        controller:'home_more_ctrl'
                    }
                }
            })
            .state('tab.menuhomePerson',{
                url: '/menuhomePerson/:id',
                views: {
                    'tab-menu': {
                        templateUrl: 'js/first/template/homePerson.html',
                        controller:'home_person_ctrl'
                    }
                }
            })
            .state('tab.menuShoppingMore',{
                url: '/menuShoppingMore/:id',
                views: {
                    'tab-menu': {
                        templateUrl: 'js/menu/template/shoppingMore.html',
                        controller:'shopping_more_ctrl'
                    }
                }
            })
            .state('tab.menushoppDetail',{
                url: '/menusshoppDetail/:id',
                views: {
                    'tab-menu': {
                        templateUrl: 'js/first/template/shoppDetail.html',
                        controller:'shopp_detail_ctrl'
                    }
                }
            })
            
    }])