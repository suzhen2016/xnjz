/**
 * Created by ID on 17/6/15.
 * Author:
 * email:
 *
 */
angular.module('rsc.service.common', ['rsc.service.phone', 'rsc.service.rest'])
    /**
     * Ionic 弹窗
     */
    .factory('XnAlert', function ($ionicPopup, $ionicPopover, $cordovaDialogs, $log, $ionicModal, $cordovaToast) {
        /**
         * 弹出提示框
         * @param text
         * @param cb
         */

        var showAlert = function (text, cb, title, btnText) {
            //ios 反馈页面导航消失问题。使用原生的弹窗会导致消失

            // if (ionic.Platform.isIOS() && text.indexOf('<') == -1) {
            if (ionic.Platform.isWebView()) {
                $cordovaDialogs.alert(text, title ? title : '提示', btnText ? btnText : '确认')
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
                    buttons: [{
                        text: btnText ? btnText : '确认'
                    }]
                });

                alertPopup.then(function (res) {
                    if (cb) {
                        cb();
                    }
                });
            }

            // var alertPopup = $ionicPopup.show({
            //     title: title ? title : '提示',
            //     template: text,
            //     buttons: [
            //         { text: '确定' }
            //     ]
            // });

            // alertPopup.then(function (res) {
            //     if (cb) {
            //         cb();
            //     }
            // });

        };
        var _tipeAlert = function (message, duration, position, title, cb) {
            if (ionic.Platform.isWebView()) {
                $cordovaToast
                    .show(message, duration, position)
                    .then(function (success) {
                        $log.debug('弹窗出错', text)
                    }, function (error) {
                        $log.error('弹窗出错', text)
                    });
            } else {
                var alertPopup = $ionicPopup.show({
                    title: title ? title : '提示',
                    template: message,
                    buttons: [{
                        text: '确定'
                    }]
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
                    err && err();
                }
            })
        }
        var myPopup = function (title, template, btntexts, cb, cbcancel) {

            $ionicPopup.show({
                template: template,
                title: title,
                buttons: [{
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
                        cb(e);
                    }
                }
                ]
            })
        };

        var _popup = function (title, text, cb) {
            var myPopup = $ionicPopup.show({
                template: text,
                title: title,
                buttons: [{
                    text: '取消'
                }, {
                    text: '确定'
                    // text: '<b>确定</b>'
                    ,
                    type: 'button-default',
                    onTap: function (e) {
                        cb(e);
                    }
                }]
            })

        }
        var selectFile = function (title) {
            $ionicPopup.show({
                templateUrl: 'template/common/picture.html',
                title: title,
                buttons: [{
                    text: '取消'
                }, {
                    text: '<b>确定</b>',
                    type: 'button-default',
                    onTap: function (e) {
                        cb(e);
                    }
                }]
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
        var _tradePopup = function ($scope, object, objmsg, cb, err) {
            $scope.data = objmsg;
            $ionicPopup.show({
                templateUrl: object.templateUrl,
                scope: $scope,
                title: object.title,
                cssClass: object.css,
                buttons: [{
                    text: '取消',
                    onTap: function (e) {
                        if (err) {
                            err($scope.data);
                        }
                    }
                }, {
                    text: '<b>确定</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        cb($scope.data)
                    }
                }]
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
            tPopup: _tradePopup,
            tipeAlert: _tipeAlert
        }
    })
    .factory('EventRegister', function ($rootScope, $cordovaDevice, ContactsHelp, ContactService, $log, $ionicPlatform) {

        return {
            init: function () {
                $rootScope.$on('readContacts', function () {
                    $ionicPlatform.ready(function () {
                        //读取通讯录
                        ContactsHelp.getAll().then(function (result) {
                            var leng = result.length / 100;
                            for (var i = 0; i < leng; i++) {
                                var res = result.slice(i * 100, 100 * (i + 1));
                                // $log.debug('添加通讯录 res', i, res.length, new Date());
                                (function (contact) {
                                    ContactService.addContact(contact, $rootScope.device_uuid).then(function (result) {
                                        if (result.status == 'success') {
                                            $log.debug('添加通讯录', JSON.stringify(result))

                                        } else {
                                            $log.error('添加通讯录', JSON.stringify(result))
                                        }
                                    })
                                })(res)
                            }
                        })
                        // }
                    })


                })
            }
        }

    })

    .service('ContactService', function (ContactAngular) {
        return {

            /**
             * 添加通讯录到服务端
             *
             * @param {any} data
             * @param {any} uuid
             * @returns
             */
            addContact: function (data, uuid) {
                var all = ContactAngular.allUrl('phone/add');
                return all.post({
                    user: data,
                    uuid: uuid
                });
            }
        }
    })

    .service('DynamicService', function (DynamicAngular) {
        return {

            

        }
    })
