/**
 * Created by ID on 15/12/7.
 * Author:zhoudd
 * email:zhoudd@stark.tm
 */
angular.module('rsc.service.rest', ['restangular'])
    .factory('AccountRestAngularNoToken', function (Restangular, ENV) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            if (ENV.encode) {
                RestangularConfigurer.setDefaultHeaders({
                    'x-access-token': {},
                    server_type: 'user'
                });
            } else {
                RestangularConfigurer.setDefaultHeaders({
                    'x-access-token': {}
                });
                RestangularConfigurer.setBaseUrl(ENV.api.account);
            }

        })
    })
    // .factory('AccountRestAngular', function (Restangular, ENV, GetToken) {
    //     return Restangular.withConfig(function (RestangularConfigurer) {
    //         if (ENV.encode) {
    //             RestangularConfigurer.setDefaultHeaders({
    //                 'x-access-token': GetToken.getToken(),
    //                 server_type: 'user'
    //             });
    //         } else {
    //             RestangularConfigurer.setDefaultHeaders({
    //                 'x-access-token': GetToken.getToken()
    //             });
    //             RestangularConfigurer.setBaseUrl(ENV.api.account);
    //         }
    //     })
    // })
    .factory('PassRestAngular', function (Restangular, ENV, GetToken) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            if (ENV.encode) {
                RestangularConfigurer.setDefaultHeaders({
                    'x-access-token': GetToken.getToken(),
                    server_type: 'traffic'
                });
            } else {
                RestangularConfigurer.setDefaultHeaders({
                    'x-access-token': GetToken.getToken()
                });
                RestangularConfigurer.setBaseUrl(ENV.api.pass);
            }
        })
    })
    .factory('PassPayAngular', function (Restangular, ENV, GetToken) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            if (ENV.encode) {
                RestangularConfigurer.setDefaultHeaders({
                    "Content-Type": undefined
                });
                RestangularConfigurer.setDefaultHeaders({
                    'x-access-token': GetToken.getToken(),
                    server_type: 'traffic'
                });
            } else {
                RestangularConfigurer.setDefaultHeaders({
                    "Content-Type": undefined
                });
                RestangularConfigurer.setDefaultHeaders({
                    'x-access-token': GetToken.getToken()
                });
                RestangularConfigurer.setBaseUrl(ENV.api.pass);
            }

        })
    })
    .factory('StoreRestAngular', function (Restangular, ENV, GetToken) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            if (ENV.encode) {
                RestangularConfigurer.setDefaultHeaders({
                    'x-access-token': GetToken.getToken(),
                    server_type: 'user'
                });
            } else {
                RestangularConfigurer.setDefaultHeaders({
                    'x-access-token': GetToken.getToken()
                });
                RestangularConfigurer.setBaseUrl(ENV.api.account);
            }
        });
    })
    .factory('CreditRestAngular', function (Restangular, ENV, GetToken) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            if (ENV.encode) {
                RestangularConfigurer.setDefaultHeaders({
                    'x-access-token': GetToken.getToken(),
                    server_type: 'finance'
                });
            } else {
                RestangularConfigurer.setDefaultHeaders({
                    'x-access-token': GetToken.getToken()
                });
                RestangularConfigurer.setBaseUrl(ENV.api.credit);
            }

        });
    })
    .factory('TradeRestAngular', function (Restangular, ENV, GetToken) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            if (ENV.encode) {
                RestangularConfigurer.setDefaultHeaders({
                    'x-access-token': GetToken.getToken(),
                    server_type: 'trade'
                });
            } else {
                RestangularConfigurer.setDefaultHeaders({
                    'x-access-token': GetToken.getToken()
                });
                RestangularConfigurer.setBaseUrl(ENV.api.trade);
            }
        });
    })
    .factory('LogServiceAngular', function (Restangular, ENV, GetToken) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            if (ENV.encode) {
                RestangularConfigurer.setDefaultHeaders({
                    'x-access-token': GetToken.getToken(),
                    server_type: 'log'
                });
            } else {
                RestangularConfigurer.setDefaultHeaders({
                    'x-access-token': GetToken.getToken()
                });
                RestangularConfigurer.setBaseUrl(ENV.api.log);
            }
        });
    })

    .factory('AdminServiceAngular', function (Restangular, ENV, GetToken) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            if (ENV.encode) {
                RestangularConfigurer.setDefaultHeaders({
                    'x-access-token': GetToken.getToken(),
                    server_type: 'admin'
                });
            } else {
                RestangularConfigurer.setDefaultHeaders({
                    'x-access-token': GetToken.getToken()
                });
                RestangularConfigurer.setBaseUrl(ENV.api.admin);
            }
        });
    })
    .factory('StatistServiceAngular', function (Restangular, ENV, GetToken) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            if (ENV.encode) {
                RestangularConfigurer.setDefaultHeaders({
                    'x-access-token': GetToken.getToken(),
                    server_type: 'statist'
                });
            } else {
                RestangularConfigurer.setDefaultHeaders({
                    'x-access-token': GetToken.getToken()
                });
                RestangularConfigurer.setBaseUrl(ENV.api.statist);
            }
        });
    })
    .factory('ContactAngular', function (Restangular, ENV, GetToken) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            if (ENV.encode) {
                RestangularConfigurer.setDefaultHeaders({
                    'x-access-token': GetToken,
                    server_type: 'contact'
                });
            } else {
                RestangularConfigurer.setDefaultHeaders({
                    'x-access-token': GetToken
                });
                RestangularConfigurer.setBaseUrl(ENV.api.contact);
            }
        });
    })
    .factory('DynamicAngular', function (Restangular, ENV, GetToken) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            if (ENV.encode) {
                RestangularConfigurer.setDefaultHeaders({
                    'x-access-token': GetToken,
                    server_type: 'dynamic'
                });
            } else {
                RestangularConfigurer.setDefaultHeaders({
                    'x-access-token': GetToken
                });
                RestangularConfigurer.setBaseUrl(ENV.api.dynamic);
            }
        });
    })

    .factory('GetToken', function (AuthenticationService) {

        return {
            getToken: function () {
                var token;
                var user = AuthenticationService.getUserInfo();
                //var user = window.sessionStorage.setItem('userInfo', window.JSON.stringify(data));
                if (user) {
                    token = user.token;
                } else {
                    token = '';
                }
                return token;
            }
        }
    })
    .factory('AuthenticationService', ['Storage', '$log', '$location', '$q', function (Storage, $log, $location, $q) {
        var userInfo;
        var companyInfo;

        function getUserInfo() {
            if (Storage.get('userInfo')) {
                userInfo = Storage.get('userInfo');
                return userInfo;
            } else {
                //$log.warn("no login");
                // $location.path('/tab/login')
                // window.location.href = 'http://'+$location.$$host+':'+ $location.$$port + '#/tab/login'
                return null;
            }
        }

        function getCompanyInfo() {
            if (Storage.get('userInfo').company) {
                companyInfo = Storage.get('userInfo').company;
                return companyInfo;
            } else {
                return null;
            }
        }

        return {
            getUserInfo: getUserInfo,
            getCompanyInfo: getCompanyInfo,
            checkToken: function () {
                userInfo = getUserInfo();
                if (userInfo) {
                    return $q.when(userInfo);
                } else {
                    return $q.reject({
                        authenticated: false
                    })
                }
            }
        };

    }])
    .factory('NewTradeRestAngular', function (Restangular, ENV, GetToken) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            if (ENV.encode) {
                RestangularConfigurer.setDefaultHeaders({
                    'x-access-token': GetToken.getToken(),
                    server_type: 'user'
                });
            } else {
                RestangularConfigurer.setDefaultHeaders({
                    'x-access-token': GetToken.getToken()
                });
                RestangularConfigurer.setBaseUrl(ENV.api.newtrade);
            }
        })
    })
