

angular.module('rsc.common.services.public', ['ionic-toast', 'ion-gallery'])
    .config(function ($provide, ionGalleryConfigProvider) {
        $provide.decorator('ionicToast', function ($delegate) {
            $delegate.alert = function (text) {
                this.show(text, 'middle', false, 1000);
            };
            return $delegate;
        });

        ionGalleryConfigProvider.setGalleryConfig({
            action_label: 'Close',
            template_gallery: 'gallery.html',
            template_slider: 'slider.html',
            toggle: false,
            row_size: 3,
            fixed_row_size: true
        });

        $provide.decorator('ionicDatePicker', function ($delegate, $cordovaDatePicker) {
            $delegate.openDatePickerExtend = function (options) {
                if (ionic.Platform.isWebView()) {
                    var optionsExt = {
                        date: options.inputDate ? options.inputDate : new Date(),
                        mode: 'date', // or 'time'
                        // minDate: new Date(),
                        allowOldDates: true,
                        allowFutureDates: true,
                        doneButtonLabel: '确定',
                        doneButtonColor: '#387ef5',
                        cancelButtonLabel: '取消',
                        cancelButtonColor: '#387ef5',
                        locale: 'zh_cn'
                    };
                    $cordovaDatePicker.show(optionsExt).then(function (date) {
                        options.callback(date);
                    });

                } else {
                    // var config = {
                    //     callback: function (val) {
                    //     },
                    //     inputDate: new Date(),
                    //     mondayFirst: true,
                    //     closeOnSelect: false,
                    //     templateType: 'popup'
                    // }
                    // if (options) {
                    //     angular.merge(config, options)
                    // }
                    this.openDatePicker(options);
                }
            };
            return $delegate;
        });
    })
    /**
     * http 请求钩子.
     */
    .factory('AuthInterceptor', ['$q', '$location', 'Storage', 'AppVersion',
        function ($q, $location, Storage, AppVersion) {
            var interceptor = {};

            interceptor.request = function (config) {
                var token = Storage.get('userInfo');
                if (token) {
                    //console.log('set Header', token.token);
                    config.headers["x-access-token"] = token.token;
                    config.headers["version"] = AppVersion;


                    // config.headers["x-access-token"] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU2ZDUyOWU4YzBmMWYzMzE1NGQ3OGJmZCIsImNvbXBhbnlfaWQiOlsiNTZkNTI5ZThjMGYxZjMzMTU0ZDc4YmZiIl0sInJvbGUiOiJUUkFGRklDX0FETUlOIiwidXNlcl9uYW1lIjoi5rWL6K-VIiwiY29tcGFueV9uYW1lIjoi5rWL6K-V5rWB56iL5LyB5LiaIiwiaWF0IjoxNDU3MzEzMzIyLCJleHAiOjE0NTc5MTgxMjJ9.M5pNNiJVnvzQSCClOTR9HxuO2ymnXdssf-MuL1TzTT8';
                }
                return config;
            };

            interceptor.responseError = function (response) {
                if (response.status == 403) {
                    //console.log(403)
                    Storage.remove('userInfo');
                    $location.path("/login");
                }
                return $q.reject(response);
            };

            interceptor.response = function (response) {
                // console.log('response',response)
                if (response.data.status == 'err' && response.data.msg == 'auth_failed') {
                    // iAlert.alert('请重新登录',function () {
                    //     window.alert('请重新登录')
                    Storage.remove('userInfo');
                    $location.path("/login");
                    // })
                }
                return response;
            }

            return interceptor;
        }])



    /**
     * 浏览器本地存储操作
     */
    .factory('Storage', function (ENV) {
        function Storage(storge) {
            this.set = function (key, data) {
                return storge.setItem(key, window.JSON.stringify(data)); //local

                //return window.sessionStorage.setItem(key, window.JSON.stringify(data)) ; //session
            };
            this.get = function (key) {
                return window.JSON.parse(storge.getItem(key));
                //return window.JSON.parse(window.sessionStorage.getItem(key)) ; //session
            };
            this.remove = function (key) {
                storge.removeItem(key);
                //return window.sessionStorage.removeItem(key) ; //session
            };
            //清楚所有的
            this.clear = function () {
                storge.clear();
            }
        }

        return new Storage(ENV.local);
    })
    .service('CachServices', function (CacheFactory) {
        var profileCache;

        // Check to make sure the cache doesn't already exist
        if (!CacheFactory.get('pageParams')) {
            profileCache = CacheFactory('pageParams', {
                storageMode: 'localStorage',
                // maxAge: 15 * 60 * 1000
            });
        }

        return {
            put: function (key, value) {
                profileCache.put(key, value);
            },
            get: function (key) {
                return profileCache.get(key);
            }, remove: function (key) {
                profileCache.remove(key);
            }
        }
    });

