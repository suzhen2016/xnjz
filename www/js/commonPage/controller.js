angular.module('xn.commonpage.ctrl', [])
    /**
     *购物车
     */
    .controller('car_ctrl', ['$stateParams', '$log', '$scope', '$ionicLoading', '$state',
        'Storage', 'ionicToast', '$filter', '$ionicHistory', '$ionicViewSwitcher',
        'FirstService', '$ionicNavBarDelegate', 'xnData',
        function ($stateParams, $log, $scope, $ionicLoading, $state, Storage, ionicToast,
            $filter, $ionicHistory, $ionicViewSwitcher, FirstService, $ionicNavBarDelegate, xnData) {
            var vm = $scope.vm = this;
            vm.isEdit = true;
            $log.debug("购物车页面");
            vm.carList = [];
            vm.isLoading = true;
            vm.query = {};
            vm.query.sum = 0;
            vm.editOrder = function (falg) {
                if (!falg == true) {
                    vm.dele();
                } else {
                    vm.isEdit = !falg;
                }
            }
            vm.run = false;

            vm.dele = function () {
                var arr = [];
                angular.forEach(vm.carList, function (item) {
                    if (item.isDele == true) {
                        //     var str = ''
                        //    if(item.is_goods==1){
                        //         str='yuangong_id='+item.yuangong_id;
                        //    }else{
                        //         str = 'goodtype_id='+item.goodtype_id;
                        //    }

                        arr.push(item.shop_id);
                    }
                })

                if (arr.length == 0) {
                    vm.isEdit = !vm.isEdit;
                    return false;
                }
                // angular.forEach(arr,function(i,index){
                FirstService.delCarOrder(arr).then(function (res) {
                    if (res.status == 200) {
                        $log.debug('购物删除成功');
                    } else {

                    }
                }, function () {
                    ionicToast.alert('网络延迟，请稍后再试')
                }).finally(function () {

                    vm.getCar();
                    vm.isEdit = !vm.isEdit;

                })

                // })
            }

            //查询
            vm.getCar = function () {

                FirstService.getCarDetails().then(function (res) {
                    if (res.status == 200) {
                        vm.query.sum = 0;
                        vm.carList = res.data;
                        vm.carList.forEach(function (value, key) {
                            value.isOrder = true;
                            value.isDele = false;
                            vm.query.sum += (value.goods_total_price - 0)

                        })
                        vm.isSeletAll();
                        vm.isLoading = false;
                        $log.debug('加入购物车数', vm.carList, res);
                    } else {

                    }
                }, function () {

                }).finally(function () {
                    vm.isLoading = false;
                })
            }

            vm.changeNum = function (type, item) {
                var obj = angular.copy(item);
                var now_num = Number(obj.goods_buy_number);
                if (vm.run) return false;
                vm.run = true;
                if (type == 'add') {
                    now_num += 1;
                } else if (type == 'cut') {
                    if (now_num == 1) {
                        return false;
                    } else {
                        now_num -= 1
                    }
                }
                if (now_num > 20) {
                    item.goods_buy_number = 20;
                    now_num = 20;
                    ionicToast.alert('最多能买20件')
                    return false;
                }
                var str = 'goodtype_id=' + obj.goodtype_id + '&now_num=' + now_num;
                //console.log(str)

                FirstService.changeCarNum(str).then(function (res) {
                    $log.debug('购物车数改变1', res);
                    if (res.status == 200) {

                        vm.getCar();
                        $log.debug('购物车数改变', res.data);
                    } else {
                        ionicToast.alert('服务器忙，请稍后重试')
                    }
                }, function () {
                    ionicToast.alert('服务器忙，请稍后重试')

                }).finally(function () {
                    vm.run = false;
                    //alert(vm.run)
                })
            }

            vm.submitOrder = function () {
                var arr = [];
                arr = _.filter(vm.carList, function (i) {
                    if (i.isOrder == true) {
                        i.sum_all = vm.query.sum;
                        return i;
                    }
                })
                if (arr.length <= 0) {
                    ionicToast.alert('您当前没有选中任何商品')
                    return false;
                }
                $log.debug(arr)
                xnData.set(arr)
                $state.go('orderDetail')
            }

            //全选
            vm.selectAll = function () {

                if (vm.isEdit == true) {
                    vm.carList.forEach(function (val, key) {
                        val.isOrder = vm.isAllSelect;
                    })
                } else {
                    vm.carList.forEach(function (val, key) {
                        val.isDele = vm.isAlldele;
                    })
                }

            }

            //检测是否选中
            vm.isSeletAll = function () {
                if (vm.isEdit == true) {
                    var sum = 0
                    vm.isAllSelect = _.size(_.filter(vm.carList, function (i) {
                        if (i.isOrder == true) {
                            sum += (i.goods_total_price - 0)
                            return i;
                        }
                    }));
                    vm.query.sum = sum;
                    $log.debug('选中', vm.isAllSelect);
                } else {
                    vm.isAlldele = _.size(_.filter(vm.carList, function (i) {
                        if (i.isDele == false) {
                            return i;
                        }
                    })) == 0;
                    $log.debug('选删', vm.isAlldele);
                }

            }

            vm.goBack = function () {
                $ionicNavBarDelegate.back();
                $ionicViewSwitcher.nextDirection("back")
            }

            $scope.$on("$ionicView.beforeEnter", function () {
                vm.getCar();
            })
        }
    ])

    .controller('order_detail_ctrl', ['$state', '$stateParams', '$log', '$scope', '$ionicLoading', 'xnData',
        'ionicToast', '$filter', '$ionicHistory', '$ionicViewSwitcher',
        '$ionicNavBarDelegate', 'FirstService',
        function ($state, $stateParams, $log, $scope, $ionicLoading, xnData, ionicToast,
            $filter, $ionicHistory, $ionicViewSwitcher, $ionicNavBarDelegate, FirstService) {
            var vm = $scope.vm = this;
            vm.order = {};
            vm.dele = {};
            vm.dele.obj = {};
            vm.dele.null = false;
            vm.dele.ids = [];

            vm.getAddres = function () {
                $ionicLoading.show({
                    template: '数据加载中...'
                });
                FirstService.getAddressList().then(function (res) {
                    if (res.status == 200) {
                        $log.debug('地址列表', res.data);
                        if (res.data.length > 0) {
                            // vm.dele.null = true;
                            vm.dele.address = _.filter(res.data, function (i) {
                                if (i.cgn_bool == 1) {
                                    return i;
                                }
                            })[0];
                        } else {
                            vm.dele.null = true;
                        }
                    } else {

                    }
                }, function () {
                    ionicToast.alert('网络延迟，请稍后在试');
                    $ionicHistory.goBack();
                }).finally(function () {
                    if (!vm.dele.null) {
                        vm.dele.obj.shop_ids = vm.dele.ids;
                        vm.dele.obj.cgn_id = vm.dele.address.cgn_id;
                    }
                    $ionicLoading.hide();
                })
            }

            vm.init = function () {
                vm.order = xnData.get();
                vm.order.forEach(function (i) {
                    vm.dele.ids.push(i.shop_id);
                })

                vm.dele.address = xnData.get('address');
                $log.debug(vm.order, vm.dele.address)
                if (!vm.dele.address) {
                    vm.getAddres();
                }
            }


            vm.goBack = function () {
                $ionicNavBarDelegate.back();
                $ionicViewSwitcher.nextDirection("back")
            }
            vm.pinkUp = function () {
                $log.debug(vm.dele.obj)
                if (!vm.dele.obj.cgn_id) {
                    ionicToast.alert('请选择你的地址')
                    return false;
                }
                $ionicLoading.show({
                    template: '订单在提交中...'
                });
                FirstService.pickOrder(vm.dele.obj).then(function (res) {
                    if (res.status == 200) {
                        $log.debug('提交订单', res);
                        xnData.set(res.data, 'pinkUp');
                        if (res.data.order_total_price == vm.order[0].sum_all) {

                        }
                        $state.go('pinkUp')

                    } else {
                        ionicToast.alert('提交失败，请稍后在试');
                    }
                }, function () {
                    $ionicLoading.hide()
                    ionicToast.alert('网络延迟，请稍后在试');
                    $ionicHistory.goBack();
                }).finally(function () {
                    $ionicLoading.hide()
                })

            }

            $scope.$on("$ionicView.beforeEnter", function () {
                vm.dele.null = false;
                vm.init();
            })
        }
    ])

    .controller('pink_up_ctrl', ['$stateParams','$state', '$log', '$scope', '$ionicLoading'
        , 'ionicToast', '$ionicHistory', '$ionicViewSwitcher', '$ionicNavBarDelegate', 'xnData',
        function ($stateParams,$state, $log, $scope, $ionicLoading, ionicToast
            , $ionicHistory, $ionicViewSwitcher, $ionicNavBarDelegate, xnData) {
            var vm = $scope.vm = this;

            vm.order = {};

            vm.order.data = xnData.get('pinkUp');

            $log.debug("订单详情", vm.order.data);

            //var s = new Date(vm.order.data.order_time_end).getTime();

            vm.times = new Date(vm.order.data.order_time_end);

            vm.goBack = function () {
                $ionicNavBarDelegate.back();
                $ionicViewSwitcher.nextDirection("back")
            }
            //支付宝支付;
            vm.alipayXn = function () {

                var myDate = new Date();
                var tradeNo = myDate.getTime();
                //alert(JSON.stringify(vm.order.data));
                cordova.plugins.alipay.payment({
                    "app_id": '2017091608772582' ,//vm.order.data.appid,                //APP-ID
                    "rsa_private": vm.order.data.rsa_private,      //私钥
                    "subject":vm.order.data.subject,              //商品名称
                    "body": "西南家政出品",                    //商品详情
                    "total_amount":vm.order.data.order_total_price,     //金额
                    "out_trade_no": 'SE'+ tradeNo,                  //唯一的订单号
                    "timestamp": '2016-07-29 16:55:53'  //vm.order.data.order_creat_time   //订单时间  
                }, function success(e) {
                    if (e) {
                        alert(JSON.stringify(e))
                        if(e.resultStatus==9000){
                             ionicToast.alert('订单支付成功')
                             $state.go('tab.order',{'status':3})  
                        }else if(e.resultStatus==8000){
                            //支付中;
                             ionicToast.alert('订单支付中，请求订单列表查询订单状态')
                             $state.go('tab.order',{'status':1})   
                        }
                    }
                }, function error(e) {
                    if (e) {
                        alert(JSON.stringify(e));
                        if(e.resultStatus==4000){
                            ionicToast.alert('订单支付失败')
                            $state.go('tab.order',{'status':1})
                        }else if(e.resultStatus==6001){
                            ionicToast.alert('您取消支付了');
                            $state.go('tab.order',{'status':1})
                        }else if(e.resultStatus == 6002){
                            ionicToast.alert('网络原因支付失败');
                            $state.go('tab.order',{'status':1})
                        }
                    }
                });
            };
        }
    ])

    .controller('select_address_ctrl', ['$stateParams', '$log', '$scope', '$ionicLoading',
        'ionicToast', '$ionicHistory', '$ionicViewSwitcher', '$ionicNavBarDelegate', 'FirstService', 'xnData',
        function ($stateParams, $log, $scope, $ionicLoading, ionicToast, $ionicHistory, $ionicViewSwitcher, $ionicNavBarDelegate, FirstService, xnData) {
            var vm = $scope.vm = this;
            $log.debug("地址选择");
            vm.dele = {};
            vm.dele.isError = false;
            vm.address_data = [];
            vm.dele.isLoading = true;
            vm.init = function () {
                vm.address_data = [];
                FirstService.getAddressList().then(function (res) {
                    if (res.status == 200) {
                      
                        vm.dele.isError = false;
                        vm.address_data = res.data;
                        $log.debug('地址列表', res.data);
                    } else {
                        vm.address_data = [];
                      
                        vm.dele.isError = true;
                    }
                }, function () {
                    vm.address_data = [];
                   
                     vm.dele.isError = true;
                }).finally(function(){
                     vm.dele.isLoading = false;
                })
            }
            vm.init();
            vm.selectAddress = function (item) {
                xnData.set(item, "address");
                $ionicHistory.goBack();
            }

            vm.goBack = function () {
                $ionicNavBarDelegate.back();
                $ionicViewSwitcher.nextDirection("back")
            }
        }
    ])
