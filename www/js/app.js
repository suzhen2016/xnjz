// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic',
    'starter.controllers',
    'restangular',
    'ngCordova',
    'timer',
    'ionic-toast',
    'ionic-timepicker',
    'ionic-datepicker',
    'ngMessages',
    'angular-image-404',
    'atlasProgress',
    'rsc.service.common.bak',
    'rsc.common.services.public',
    'rsc.commmon.services.dicitionary',
    // 'ionic-datePicker',
    'rsc.development.config', //内网
    'rsc.common.directives',
    // 要改部分！！！
    'rsc.service.common', //公共的模块，登录注册
    'rsc.service.phone',
    'rsc.service.rest',
    'rsc.app.common.account',
    'rsc.areas',
   
    //西南项目
    'xn.menu',
    'xn.my',
    'xn.first',
    'xn.govern',
    'xn.commompage'
])

    .value('AppVersion', '2.0.2')
    .run(function ($ionicPlatform, $rootScope, $log, Storage, ionicToast, 
    $ionicHistory,$ionicViewSwitcher, $filter, $state, $cordovaDevice, $q, $cordovaStatusbar, EventRegister, MsgServiceAngular, $location) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                ionic.Platform.showStatusBar(true);
                if (window.StatusBar) {
                    StatusBar.show();
                }
                
            }
       
        });
        
        $rootScope.$state = $state;
        $rootScope.Platform = ionic.Platform;
        $rootScope.$on('$stateChangeSuccess', function (event, toState, roParams, fromState, fromParams) {
            $log.debug('$stateChangeSuccess', arguments);
        });

        $rootScope.$on('$stateChangeError', function (event, toState, roParams, fromState, fromParams, error) {
            $log.error('$stateChangeError', error);
            switch (error.msg) {
                case 'no_login':
                    //未登录
                    $state.go('login');
                    // $location.path

                    // $location.path('/#/login');
                    break;
                case 'logined':
                    //已经登录，根据角色跳转对应的页面
                    $state.go('tab.first', {}, {});
                    break;
            }

        });

        $rootScope.$on('$stateChangeStart', function (event, toState, roParams, fromState, fromParams) {
            $log.debug('$stateChangeStart', arguments);
            
        });

       
        //  var user = Storage.get('userInfo');
        //     if (user) {
        //         $rootScope.user = user;
        //         console.log('内',$rootScope.user)
        //     }else{
        //         ionicToast.show('请登录账号密码', 'middle', false, 1500);
        //     }
       

        //返回上一级历史记录
        $rootScope.GoBack = function () {
            $log.debug('rootGoBack', $ionicHistory)
            $ionicHistory.goBack();
            $ionicViewSwitcher.nextDirection("back")
        }
        $rootScope.goRoute = function(route,id){
            $state.go(router,{id:id});
             $ionicViewSwitcher.nextDirection("back")
        }
        //图片的路径
        $rootScope.imgUrl = 'http://www.zgxnjz.cn'
        
       
    })
    .directive('hideTabs', function ($rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element, attributes) {
                scope.$on('$ionicView.beforeEnter', function () {
                    scope.$watch(attributes.hideTabs, function (value) {
                        $rootScope.hideTabs = value;
                    });
                });

                scope.$on('$ionicView.beforeLeave', function () {
                    $rootScope.hideTabs = false;
                });
            }
        };
    })
    .config(function ($provide, $stateProvider, $urlRouterProvider, RestangularProvider, ENV, $httpProvider, $ionicConfigProvider, ionicTimePickerProvider, ionicDatePickerProvider) {

        RestangularProvider.setBaseUrl(ENV.api.account);
        $httpProvider.interceptors.push('AuthInterceptor');
        // android 导航底部配置
        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('standard');

        $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.navBar.alignTitle('center');

        $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
        $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

        $ionicConfigProvider.platform.ios.views.transition('ios');
        $ionicConfigProvider.platform.android.views.transition('ios');


        var timePickerObj = {
            inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
            format: 12,
            step: 15,
            setLabel: 'Set',
            closeLabel: 'Close'
        };
        ionicTimePickerProvider.configTimePicker(timePickerObj);


        var datePickerObj = {
            inputDate: new Date(),
            setLabel: '确定',
            todayLabel: '今天',
            closeLabel: '关闭',
            mondayFirst: false,
            weeksList: ["日", "一", "二", "三", "四", "五", "六"],
            monthsList: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一", "十二"],
            templateType: 'popup',
            from: new Date(2012, 8, 1),
            to: new Date(2018, 8, 1),
            showTodayButton: true,
            dateFormat: 'yyyy年 MM月 dd日',
            closeOnSelect: false,
            disableWeekdays: [],
        };
        ionicDatePickerProvider.configDatePicker(datePickerObj);

        // $ionicConfigProvider.views.swipeBackEnabled(false);
        //$ionicConfigProvider.views.transition('none');
        //全局禁用页面缓存
        // $ionicConfigProvider.views.maxCache(0);
        // android 导航底部配置结束
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js


        // if none of the above states are matched, use this as the fallback
        //$urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html',
                resolve: {
                    auth: ["$q", "$log", 'AuthenticationService',function ($q, $log,AuthenticationService) {
                        var userInfo = AuthenticationService.getUserInfo();
                        // 如果本地有token且token有效则不通过
                        // if (userInfo) {
                        //     // if (userInfo) {
                        //     return $q.when({
                        //         data: userInfo
                        //     });
                        // } else {
                        //     return $q.reject({
                        //         msg:'no_login'
                        //     });
                        // }
                    }]
                }
            })

        // $urlRouterProvider.otherwise('/login');
        $urlRouterProvider.otherwise('tab/first');

    });
