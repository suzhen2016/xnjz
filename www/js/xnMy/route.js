angular.module('xn.my', ['ui.router', 'xn.my.ctrl'])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('tab.xnMy', {
                url: '/my',
                views: {
                    'tab-my': {
                        templateUrl: 'js/xnMy/template/my.html',
                        controller: 'my_ctrl'
                    }
                }
            })
            .state('tab.user', {
                url: '/user',
                views: {
                    'tab-my': {
                        templateUrl: 'js/xnMy/template/user.html',
                        controller: 'user_ctrl'
                    }
                }
            })
            .state('tab.order', {
                url: '/order?status',
                views: {
                    'tab-my': {
                        templateUrl: 'js/xnMy/template/order.html',
                        controller: 'order_ctrl'
                    }
                }
            })
            .state('tab.orderDetails', {
                url: '/orderDetails?id',
                views: {
                    'tab-my': {
                        templateUrl: 'js/xnMy/template/orderDetails.html',
                        controller: 'order_details_ctrl'
                    }
                }
            })
            .state('tab.setUp', {
                url: '/setUp',
                views: {
                    'tab-my': {
                        templateUrl: 'js/xnMy/template/setUp.html',
                        controller: 'setUp_ctrl'
                    }
                }
            })
            .state('tab.addressList', {
                url: '/addressList',
                views: {
                    'tab-my': {
                        templateUrl: 'js/xnMy/template/addressList.html',
                        controller: 'address_list_ctrl'
                    }
                }
            })
            .state('tab.addAdrss', {
                url: '/addAdrss?params',
                views: {
                    'tab-my': {
                        templateUrl: 'js/xnMy/template/addAdress.html',
                        controller: 'add_address_list_ctrl'
                    }
                }
            })
            .state('tab.editAdrss', {
                url: '/editAdrss?params',
                views: {
                    'tab-my': {
                        templateUrl: 'js/xnMy/template/addAdress.html',
                        controller: 'add_address_list_ctrl'
                    }
                }
            })
            .state('tab.appraise', {
                url: '/appraise?params',
                views: {
                    'tab-my': {
                        templateUrl: 'js/xnMy/template/appraise.html',
                        controller: 'appraise_list_ctrl'
                    }
                }
            })
    }])