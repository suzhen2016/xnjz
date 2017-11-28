angular.module('xn.commompage', ['ui.router', 'xn.commonpage.ctrl'])
  .config(['$stateProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('car', {
        url: '/car',
        templateUrl: 'js/commonPage/template/car.html',
        controller:'car_ctrl'
      })
      .state('orderDetail', {
        url: '/orderDetail',
        templateUrl: 'js/commonPage/template/orderDetail.html',
        controller:'order_detail_ctrl'
      })
      .state('pinkUp', {
        url: '/pinkUp',
        templateUrl: 'js/commonPage/template/pinkUp.html',
        controller:'pink_up_ctrl'
      })
      .state('selectAddress',{
        url:'selectAddress',
        templateUrl:'js/commonPage/template/selectAddress.html',
        controller:'select_address_ctrl'
      })

  }])