angular.module('rsc.controllers.account', ['rsc.common.account.service'])
    /**
     * 注册控制器
     */
    .controller('reg_user_ctrl', function ($scope, $log, AccountService, $state,
        $stateParams, $ionicModal, ionicToast, Storage, $interval) {
        var vm = $scope.vm = this;
        vm.textTs = '获取验证码';
        vm.isDisabled = false;
        vm.user = {};
        //vm.user.app =[{na:123,nan:"euqieu"},{na:123,nan:"euqieu"},{na:123,nan:"euqieu"}]
        vm.registeCode = function () {
            if (vm.user.pwd_one == vm.user.pwd_two) {
                //vm.user.pwd_two = '';
            } else {
                ionicToast.alert('密码不一致');
                return false;
            }
            $log.debug(vm.user.chknumber+'ssss')
            AccountService.register(vm.user)
                .then(function (res) {
                    if (res.status == 200) {

                        //  Storage.set('userInfo', res.data);
                        //  $state.go('tab.first')
                         $log.debug(res.data);
                         vm.login();
                    } else {
                        if (res.status == 404 && res.msg == 'Verify Code Is Wrong') {
                            ionicToast.show('验证码错误', 'middle', false, 2500);
                        } else if (res.status == 404 && res.msg == 'Verify Code Is Wrong') {
                            ionicToast.show('验证码错误', 'middle', false, 2500);
                        }

                    }
                }, function () {
                    ionicToast.alert('服务器忙，请稍后重试');
                })
        };

        vm.getCode = function () {
          
            if (!vm.user.phone) {
                //vm.clearIntervalOut(true)
                ionicToast.alert('请输入正确的手机号');
                return false;
            } else {
                vm.clearIntervalOut(true)
            }

            AccountService.xnGetCode(vm.user.phone)
                .then(function (res) {
                    if (res.status == 200) {
                        ionicToast.show('获取验证码成功', 'middle', false, 2500);
                    }else if(res.status == 300 && res.status.msg[0]=='验证码超出同模板同号码天发送上限'){
                      
                        ionicToast.show('验证码超出同模板同号码天发送上限', 'middle', false, 2500);
                    }else if(res.status == 300 && res.status.msg[0]=='短信验证码发送过频繁'){
                      
                        //ionicToast.show('获取验证码失败', 'middle', false, 2500);
                    }else if(res.status == 402){
                        ionicToast.show('该手机号已注册', 'middle', false, 2500);
                    }else if(res.status == 403){
                        ionicToast.show('手机号格式不正确', 'middle', false, 2500);
                    }
                }, function () {
                    ionicToast.alert('服务器忙，请稍后重试');
                })
        }

        vm.clearIntervalOut = function (falg) {
            if (falg) {
                vm.time = 89;
                vm.textTs = vm.time + 's后请重新获取';
                vm.isDisabled = true;
                vm.timer = $interval(function () {
                    vm.time--;
                    vm.textTs = vm.time + 's后请重新获取';
                    if (vm.time == 0) {
                        stop();
                    }
                }, 1000)
            }else{
                stop();
            } 
            function stop() {

                if (angular.isDefined(vm.timer)) {
                   
                    $interval.cancel(vm.timer);
                    vm.timer = undefined;
                    vm.textTs = '获取验证码';
                    vm.isDisabled = false;
                }
            }

        }

        vm.login = function () {
            
            var str = 'phone=' + vm.user.phone + '&password=' + vm.user.pwd_one;
            AccountService.xnLogin(str).then(function (res) {
                $log.debug('返回值 ', res)
                if (res.status == 200) {
                    $log.debug(res.data)
                    Storage.set('userInfo', res.data);
                    $state.go('tab.first')
                } else {
                    ionicToast.show('登录账号或密码错误', 'middle', false, 1500);
                }
            }, function () {
                ionicToast.show('服务器忙，请稍后重试', 'middle', false, 1500);
                Storage.set('userInfo', { name: 'suzhen' });
                $state.go('tab.first')
            })

            return false;

        }
        $scope.$on('$ionicView.beforeEnter',function(){
           
            vm.clearIntervalOut(false);
        })
    })
    /**
     * 登录界面控制器
     */
    .controller('login_ctrl', ['$scope', '$rootScope', '$log', 'Storage', '$state', 'ionicToast', 'AccountService',
        function ($scope, $rootScope, $log, Storage, $state, ionicToast, AccountService) {
            var vm = $scope.vm = this;

            vm.user = {
                phone: "",
                password: ''
            };
            $scope.inputSel = true;

            $scope.isSelect = function () {
                $scope.inputSel = !$scope.inputSel;
            };
            /** 
             * 用户登录
             */
            vm.login = function () {

                $log.debug(vm.user);
                var str = 'phone=' + vm.user.phone + '&password=' + vm.user.password;
                AccountService.xnLogin(str).then(function (res) {
                    $log.debug('返回值 ', res)
                    if (res.status == 200) {
                        $log.debug(res.data)
                        Storage.set('userInfo', res.data);
                        $state.go('tab.first')
                    } else {
                        ionicToast.show('登录账号或密码错误', 'middle', false, 1500);
                    }
                }, function () {
                    ionicToast.show('服务器忙，请稍后重试', 'middle', false, 1500);
                    Storage.set('userInfo', { name: 'suzhen' });
                    $state.go('tab.first')
                })

                return false;

            }
        }
    ])

    .controller('code_login_ctrl', function ($scope, $log, AccountService, Storage, $state, RscAlert, $interval, ionicToast) {
        var vm = this;
        vm.btn_text = '获取验证码';
        vm.loginInfo = {
            phone: '',
            verify_code: ''
        }

        /**
         * 获取验证码
         */
        vm.getCode = function () {
            if (!vm.loginInfo.phone) {
                RscAlert.alert('请输入正确手机号码');
                return false
            } else {
                AccountService.getCode(vm.loginInfo.phone).then(function (result) {
                    vm.isDisabled = true;
                    vm.nums = 60;
                    var timer = $interval(function () {
                        vm.nums--;
                        vm.btn_text = '(' + vm.nums + 's)重发';
                        if (vm.nums == 0) {
                            vm.btn_text = '重新获取';
                            $interval.cancel(timer);
                            vm.isDisabled = false;
                        }
                    }, 1000);
                    if (result.status == 'success') {
                        if (result.data.code) {
                            vm.loginInfo.verify_code = result.data.code;
                        }
                        $log.debug('验证码登录获取验证码', result)
                    } else if (result.msg == 'invalid_format') {
                        RscAlert.alert('手机号输入不正确')
                        $log.error('手机号输入不正确', result)
                    } else if (result.msg == 'too_frequent') {
                        RscAlert.alert('请不要重复点击');
                        $log.error('请不要重复点击', result)
                    }
                }, function (error) {
                    $log.error('验证码登录获取验证码', error)
                })
            }

        };

        /**
         * 用户登录
         */
        vm.login = function () {
            if (!vm.loginInfo.verify_code) {
                RscAlert.alert('请输入正确的验证码');
                return false;
            }
            AccountService.login(this.loginInfo).then(function (result) {
                $log.debug('用户登录', result);
                if (result.status == 'success') {
                    Storage.set('userInfo', result.data);
                    switch (result.data.company.type) {
                        case "TRAFFIC":
                            $state.go('pass.center_goods')
                            break;
                        case "TRADE":
                            $state.go('trade.buy_offer')
                            break;
                    }
                } else {
                    ionicToast.show(result.msg, 'middle', false, 2500);
                }
            }, function (error) {
                $log.error('登陆失败', error)
            });
        }

    })

    /**
     * 找回密码
     */
    .controller('find_pwd_ctrl', function ($scope, $log, AccountService, Storage, $state, $interval, 
    $stateParams, ionicToast) {
        var vm = this;
        vm.btn_text = '获取验证码';
        vm.data = {
            phone: ''
        };

        vm.inputSel = true;
        vm.isSelect = function () {
            vm.inputSel = !vm.inputSel;
        };

        /**
         * 获取验证码
         */
        vm.getCode = function () {
            if (!vm.data.phone) {
                ionicToast.alert('请输入正确手机号码');
                return false
            } else {
                AccountService.getCode(vm.data.phone).then(function (result) {
                    vm.isDisabled = true;
                    vm.nums = 60;
                    var timer = $interval(function () {
                        vm.nums--;
                        vm.btn_text = '(' + vm.nums + 's)重发';
                        if (vm.nums == 0) {
                            vm.btn_text = '重新获取';
                            $interval.cancel(timer);
                            vm.isDisabled = false;
                        }
                    }, 1000);
                    if (result.status == '200') {
                        if (result.data.code) {
                            vm.data.verify_code = result.data.code;
                        }
                        $log.debug('验证码登录获取验证码', result)
                    }else if(result.status == '402'&& result.msg=='Phone Number Have Not Register'){
                        ionicToast.show('该手机号未注册', 'middle', false, 2500);
                       
                    }else if(result.status == '301'){
                        ionicToast.show('验证码超出同模板同号码天发送上限', 'middle', false, 2500);
                    }else{
                         ionicToast.show('获取验证码失败', 'middle', false, 2500);
                    }
                }, function (error) {
                    $log.error('获取验证码失败', error)
                })
            }
        };

        vm.next = function () {
            if (!vm.data.phone) {
                ionicToast.show('请输入正确手机号码', 'middle', false, 2500);
                return false
            } else if (!vm.data.verifyNum) {
                ionicToast.show('请输入正确验证码', 'middle', false, 2500);
                return false
            } else if(vm.data.newpwdone!=vm.data.newpwdtwo){
                ionicToast.show('两次密码不一致', 'middle', false, 2500);
                return false
            }else{
                $log.debug(vm.data)
                AccountService.checkVerifyCode(vm.data).then(function (result) {
                  
                    if (result.status == '200') {
                        if (result.data) {
                           Storage.remove('userInfo');
                            $state.go('login');
                            $ionicHistory.clearHistory()
                            $ionicHistory.clearCache()
                        }
                    }else if(result.status =='403'){
                        ionicToast.show('验证码错误', 'middle', false, 2500);
                    }else{
                        ionicToast.show('重置密码失败', 'middle', false, 2500);
                    }
                },function(){
                     ionicToast.show('网络延迟，重置密码失败', 'middle', false, 2500);
                });
            }
        };
    })
