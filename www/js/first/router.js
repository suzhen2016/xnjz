angular.module('xn.first', ['ui.router', 'xn.first.ctrl','xn.first.service'])
    .config(['$stateProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tab.first', {
                url: '/first',
                views: {
                    'tab-first': {
                        templateUrl: 'js/first/template/first.html'
                    }
                }
            })
            .state('tab.homeWork',{
                url: '/homeWork',
                views: {
                    'tab-first': {
                        templateUrl: 'js/first/template/homeWork.html',
                        controller:'home_work_ctrl'
                    }
                }
            })
            .state('tab.homeMore',{
                url: '/homeMore/:id/:title',
                views: {
                    'tab-first': {
                        templateUrl: 'js/first/template/more.html',
                        controller:'home_more_ctrl'
                    }
                }
            })
            .state('tab.homePerson',{
                url: '/homePerson/:id',
                views: {
                    'tab-first': {
                        templateUrl: 'js/first/template/homePerson.html',
                        controller:'home_person_ctrl'
                    }
                }
            })
            .state('tab.industryUser',{
                url: '/industryUser',
                views: {
                    'tab-first': {
                        templateUrl: 'js/first/template/industryUser.html',
                        controller:'industry_user_ctrl'
                    }
                }
            })
            .state('tab.intrai',{
                url: '/intrai',
                views: {
                    'tab-first': {
                        templateUrl: 'js/first/template/train.html',
                        controller:'train_ctrl'
                    }
                }
            })
            //员工培训路由2
            .state('tab.workxun',{
                url: '/workxun',
                views: {
                    'tab-first': {
                        templateUrl: 'js/first/template/workxun.html',
                        controller:'train_ctrl'
                    }
                }
            })
            .state('tab.trainDetails',{
                url:"/trainDetails/:id",
                views:{
                    'tab-first':{
                        templateUrl:'js/first/template/trainDetails.html',
                        controller:'train_details_ctr'
                    }
                }
            })
            .state('tab.recruitment',{
                url: '/recruitment',
                views: {
                    'tab-first': {
                        templateUrl: 'js/first/template/recruitment.html',
                        controller:'recruitment_ctrl'
                    }
                }
            })
            .state('tab.recruitmentDetails',{
                url: '/recruitmentDetails/:id',
                views: {
                    'tab-first': {
                        templateUrl: 'js/first/template/recruitmentDetails.html',
                        controller:'recruitment_details_ctrl'
                    }
                }
            })
            .state('tab.shoppingMall',{
                url: '/shoppingMall',
                views: {
                    'tab-first': {
                        templateUrl: 'js/first/template/shoppingMall.html',
                        controller:'shopping_mall_ctrl'
                    }
                }
            })
            .state('tab.shoppingMore',{
                url: '/shoppingMore/:id',
                views: {
                    'tab-first': {
                        templateUrl: 'js/first/template/shoppingMore.html',
                        controller:'shopping_more_ctrl'
                    }
                }
            })
            .state('tab.shoppDetail',{
                url: '/shoppDetail/:id',
                views: {
                    'tab-first': {
                        templateUrl: 'js/first/template/shoppDetail.html',
                        controller:'shopp_detail_ctrl'
                    }
                }
            })
             .state('tab.condition',{
                url: '/condition',
                views: {
                    'tab-first': {
                        templateUrl: 'js/first/template/condition.html',
                        controller:'condition_ctrl'
                    }
                }
            })
             .state('tab.conditionMenu',{
                url: '/conditionMenu/:id/:name',
                views: {
                    'tab-first': {
                        templateUrl: 'js/first/template/conditionMenu.html',
                        controller:'conditionMenu_ctrl'
                    }
                }
            })
            .state('tab.conditionDetails',{
                url: '/conditionDetails?id',
                views: {
                    'tab-first': {
                        templateUrl: 'js/first/template/conditionDetails.html',
                        controller:'conditionDetails_ctrl'
                    }
                }
            })
    }])