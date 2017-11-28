angular.module('rsc.account.router', ['ionic'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                cash:true,
                templateUrl: 'js/account/template/login.html',
                controller: 'login_ctrl as vm',
                resolve: {
                    auth: ["$q", "$log", 'AuthenticationService',function ($q, $log,AuthenticationService) {
                        var userInfo = AuthenticationService.getUserInfo();
                        $log.debug('登录',userInfo);
                        // 如果本地有token且token有效则不通过
                        if (userInfo) {
                            // if (userInfo) {
                            return $q.reject({
                                msg: 'logined',
                                data: userInfo
                            });

                        } else {
                            return $q.when({});
                        }
                    }]
                }
            })
            /**
             *  注册页面 第一步
             */
            .state('reg_user', {
                url: '/reg_user',
                templateUrl: 'js/account/template/reg_user.html',
                controller: 'reg_user_ctrl as vm'
            }) //注册
            //设置密码
            .state('reg_buy', {
                url: '/reg_buy?type',
                templateUrl: 'js/account/template/reg_buy.html',
                controller: 'reg_buy_ctrl as vm'

            }) 
            /**
             * 找回密码
             */
            .state('find_pwd', {
                url: '/find_pwd',
                templateUrl: 'js/account/template/find_pwd.html',
                controller: 'find_pwd_ctrl as vm'
            })
            /**
             * 重置密码
             */
            .state('reset_pwd', {
                url: '/reset_pwd/:phone/:code',
                templateUrl: 'js/account/template/reset_pwd.html',
                controller: 'find_pwd_ctrl as vm'
            })
            /**
             * 用户协议
             */
            .state('reg_agreement', {
                url: '/reg_agreement',
                templateUrl: 'js/account/template/reg_agreement.html',
            })
    })

