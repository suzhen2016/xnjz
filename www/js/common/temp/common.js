/**
 * Created by ID on 15/12/15.
 * Author:zhoudd
 * email:zhoudd@stark.tm
 *
 */
angular.module('rsc.service.common.bak', [])

    .constant("commonString", {
        phoneReg: '(^13[0-9]{9}$)|(^15[0-9]{9}$)|(^17[0-9]{9}$)|(^18[012356789][0-9]{8}$)'
    })
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

        return new Storage(ENV.storage);
    })
    /**
     * Ionic 弹窗
     */
    .factory('iAlert', function ($ionicPopup, $ionicPopover, $cordovaDialogs, $log, $ionicModal) {
        /**
         * 弹出提示框
         * @param text
         * @param cb
         */

        var showAlert = function (text, cb, title) {
            //ios 反馈页面导航消失问题。使用原生的弹窗会导致消失

            // if (ionic.Platform.isIOS() && text.indexOf('<') == -1) {
            if (ionic.Platform.isWebView()) {
                $cordovaDialogs.alert(text, title ? title : '提示', '确定')
                    .then(function () {
                        // callback success

                        if (cb) {
                            cb();
                        }
                    });

            } else {
                var alertPopup = $ionicPopup.show({
                    title: title ? title : '提示',
                    template: text,
                    buttons: [
                        { text: '确定' }
                    ]
                });

                alertPopup.then(function (res) {
                    if (cb) {
                        cb();
                    }
                });
            }

        };
        var confirm = function (title, msg, cb, err, obj) {
            var alertPopup = $ionicPopup.confirm({
                title: title,
                template: msg,
                cancelText: obj && obj.exit ? obj.exit : '取消',
                cancelType: '', //
                okText: obj && obj.save ? obj.save : '确定', //
                okType: 'button-default', //
            })
            alertPopup.then(function (res) {
                if (res) {
                    cb(res);
                } else {
                    err()
                }
            })
        }
        var myPopup = function (title, template, btntexts, cb, cbcancel) {

            $ionicPopup.show({
                template: template,
                title: title,
                buttons: [
                    {
                        text: btntexts[1] ? btntexts[1] : '取消',
                        // type: 'button-positive',
                        onTap: function (e) {
                            // if (!$scope.data.wifi) {
                            //     //don't allow the user to close unless he enters wifi password
                            //     e.preventDefault();
                            // } else {
                            //     return $scope.data.wifi;
                            // }
                            // e.preventDefault();
                            // cbcancel();
                            return false;
                        }
                    },
                    {
                        text: btntexts[0] ? btntexts[0] : '确定',
                        type: 'button-default',
                        onTap: function (e) {
                            // return true;
                            console.log(e)
                            cb(e);
                        }
                    }
                ]
            })
        };

        var _popup = function (title, text, cb) {
            var myPopup = $ionicPopup.show({
                template: text
                , title: title
                , buttons: [
                    { text: '取消' }
                    , {
                        text: '确定'
                        // text: '<b>确定</b>'
                        , type: 'button-default'
                        , onTap: function (e) {
                            cb(e);
                        }
                    }
                ]
            })

        }
        var selectFile = function (title) {
            $ionicPopup.show({
                templateUrl: 'template/common/picture.html'
                , title: title
                , buttons: [
                    { text: '取消' }
                    , {
                        text: '<b>确定</b>'
                        , type: 'button-default'
                        , onTap: function (e) {
                            cb(e);
                        }
                    }
                ]
            })
        }
        var popover = function ($scope, templateUrl) {

        }
        var _ionicModal = function ($scope, template) {
            return $ionicModal.fromTemplateUrl(template, {
                scope: $scope,
                animation: 'slide-in-up',
                backdropClickToClose: true,
                hardwareBackButtonClose: true
            })
        };
        var _PopupShu = function ($scope, object, objmsg, cb, err) {
            $scope.data = objmsg;
            $ionicPopup.show({
                template: object.templateUrl
                , scope: $scope
                , title: object.title
                , cssClass: object.css
                , buttons: [
                    {
                        text: '取消', onTap: function (e) {
                            if (err) { err($scope.data); }
                        }
                    }
                    , {
                        text: object.btn
                        , type: 'button-positive'
                        , onTap: function (e) {
                            cb($scope.data)
                        }
                    }
                ]
            });


        };



        return {
            alert: showAlert,
            confirm: confirm,
            popup: _popup,
            selectFile: selectFile,
            popover: popover,
            customConfirm: myPopup,
            log: $log.info,
            iModal: _ionicModal,
            tPopup: _PopupShu
        }
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

    /**
     * 数据加载等待提示
     */
    .constant('$ionicLoadingConfig', {
        template: '数据加载中...'
    })

    /**
     * 显示选择的图像
     * trade 维护区 start
     * */
    .factory('fileReader', ['$q', '$log', function ($q, $log) {
        var onLoad = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result)
                })
            }
        };
        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result)
                })
            }
        };
        var getReader = function (deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            return reader

        };
        var readAsDataURL = function (file, scope) {
            var deferred = $q.defer()
            var reader = getReader(deferred, scope);
            reader.readAsDataURL(file)
            return deferred.promise
        };
        return {
            readAsDataUrl: readAsDataURL
        }

    }])
  