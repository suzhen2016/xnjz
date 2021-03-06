angular
  .module('xn.commonpage.ctrl', [])
  /**
   *购物车
   */
  .controller('car_ctrl', [
    '$stateParams',
    '$log',
    '$scope',
    '$ionicLoading',
    '$state',
    'Storage',
    'ionicToast',
    '$filter',
    '$ionicHistory',
    '$ionicViewSwitcher',
    'FirstService',
    '$ionicNavBarDelegate',
    'xnData',
    function(
      $stateParams,
      $log,
      $scope,
      $ionicLoading,
      $state,
      Storage,
      ionicToast,
      $filter,
      $ionicHistory,
      $ionicViewSwitcher,
      FirstService,
      $ionicNavBarDelegate,
      xnData
    ) {
      var vm = ($scope.vm = this)
      vm.isEdit = true
      $log.debug('购物车页面')
      vm.carList = []
      vm.isLoading = true
      vm.query = {}
      vm.query.sum = 0
      vm.editOrder = function(falg) {
        if (!falg == true) {
          vm.dele()
        } else {
          vm.isEdit = !falg
        }
      }
      vm.run = false

      vm.dele = function() {
        var arr = []
        angular.forEach(vm.carList, function(item) {
          if (item.isDele == true) {
            //     var str = ''
            //    if(item.is_goods==1){
            //         str='yuangong_id='+item.yuangong_id;
            //    }else{
            //         str = 'goodtype_id='+item.goodtype_id;
            //    }

            arr.push(item.shop_id)
          }
        })

        if (arr.length == 0) {
          vm.isEdit = !vm.isEdit
          return false
        }
        // angular.forEach(arr,function(i,index){
        FirstService.delCarOrder(arr)
          .then(
            function(res) {
              if (res.status == 200) {
                $log.debug('购物删除成功')
              } else {
              }
            },
            function() {
              ionicToast.alert('网络延迟，请稍后再试')
            }
          )
          .finally(function() {
            vm.getCar()
            vm.isEdit = !vm.isEdit
          })

        // })
      }

      //查询
      vm.getCar = function() {
        FirstService.getCarDetails()
          .then(
            function(res) {
              if (res.status == 200) {
                vm.query.sum = 0
                vm.carList = res.data
                vm.carList.forEach(function(value, key) {
                  value.isOrder = true
                  value.isDele = false
                  vm.query.sum += value.goods_total_price - 0
                })
                vm.isSeletAll()
                vm.isLoading = false
                $log.debug('加入购物车数', vm.query.sum, vm.carList, res)
              } else {
              }
            },
            function() {}
          )
          .finally(function() {
            vm.isLoading = false
          })
      }

      vm.changeNum = function(type, item) {
        var obj = angular.copy(item)
        var now_num = Number(obj.goods_buy_number)
        if (vm.run) return false
        vm.run = true
        if (type == 'add') {
          now_num += 1
        } else if (type == 'cut') {
          if (now_num == 1) {
            return false
          } else {
            now_num -= 1
          }
        }
        if (now_num > 20) {
          item.goods_buy_number = 20
          now_num = 20
          ionicToast.alert('最多能买20件')
          return false
        }
        var str = 'goodtype_id=' + obj.goodtype_id + '&now_num=' + now_num
        //console.log(str)

        FirstService.changeCarNum(str)
          .then(
            function(res) {
              $log.debug('购物车数改变1', res)
              if (res.status == 200) {
                vm.getCar()
                $log.debug('购物车数改变', res.data)
              } else {
                ionicToast.alert('服务器忙，请稍后重试')
              }
            },
            function() {
              ionicToast.alert('服务器忙，请稍后重试')
            }
          )
          .finally(function() {
            vm.run = false
            //alert(vm.run)
          })
      }

      vm.submitOrder = function() {
        var arr = []
        arr = _.filter(vm.carList, function(i) {
          if (i.isOrder == true) {
            i.sum_all = vm.query.sum
            return i
          }
        })
        if (arr.length <= 0) {
          ionicToast.alert('您当前没有选中任何商品')
          return false
        }
        $log.debug(arr)
        xnData.set(arr)
        $state.go('orderDetail')
      }

      //全选
      vm.selectAll = function() {
        if (vm.isEdit == true) {
          vm.carList.forEach(function(val, key) {
            val.isOrder = vm.isAllSelect
          })
        } else {
          vm.carList.forEach(function(val, key) {
            val.isDele = vm.isAlldele
          })
        }
      }

      //检测是否选中
      vm.isSeletAll = function() {
        if (vm.isEdit == true) {
          var sum = 0
          vm.isAllSelect = _.size(
            _.filter(vm.carList, function(i) {
              if (i.isOrder == true) {
                sum += i.goods_total_price - 0
                return i
              }
            })
          )
          vm.query.sum = sum
          $log.debug('选中', vm.isAllSelect, sum, vm.query.sum)
        } else {
          vm.isAlldele =
            _.size(
              _.filter(vm.carList, function(i) {
                if (i.isDele == false) {
                  return i
                }
              })
            ) == 0
          $log.debug('选删', vm.isAlldele)
        }
      }

      vm.goBack = function() {
        $ionicNavBarDelegate.back()
        $ionicViewSwitcher.nextDirection('back')
      }

      $scope.$on('$ionicView.beforeEnter', function() {
        vm.isEdit = true
        vm.getCar()
      })
    }
  ])

  .controller('order_detail_ctrl', [
    '$state',
    '$stateParams',
    '$log',
    '$scope',
    '$ionicLoading',
    'xnData',
    'ionicToast',
    '$filter',
    '$ionicHistory',
    '$ionicViewSwitcher',
    '$ionicNavBarDelegate',
    'FirstService',
    function(
      $state,
      $stateParams,
      $log,
      $scope,
      $ionicLoading,
      xnData,
      ionicToast,
      $filter,
      $ionicHistory,
      $ionicViewSwitcher,
      $ionicNavBarDelegate,
      FirstService
    ) {
      var vm = ($scope.vm = this)
      vm.order = {}
      vm.dele = {}
      vm.dele.obj = {}
      vm.dele.null = false
      vm.dele.ids = []

      vm.getAddres = function() {
        $ionicLoading.show({
          template: '数据加载中...'
        })
        FirstService.getAddressList()
          .then(
            function(res) {
              if (res.status == 200) {
                $log.debug('地址列表', res.data)
                if (res.data.length > 0) {
                  // vm.dele.null = true;
                  vm.dele.address = _.filter(res.data, function(i) {
                    if (i.cgn_bool == 1) {
                      return i
                    }
                  })[0]
                } else {
                  vm.dele.null = true
                }
              } else {
              }
            },
            function() {
              ionicToast.alert('网络延迟，请稍后在试')
              $ionicHistory.goBack()
            }
          )
          .finally(function() {
            if (!vm.dele.null) {
              vm.dele.obj.shop_ids = vm.dele.ids
              vm.dele.obj.cgn_id = vm.dele.address.cgn_id
            }
            $ionicLoading.hide()
          })
      }

      vm.init = function() {
        vm.order = xnData.get()
        console.log(vm.order)
        vm.order.forEach(function(i) {
          vm.dele.ids.push(i.shop_id)
        })
        // vm.dele.order_post = 1;
        // vm.dele.goods_name = vm.order.goods_name;
        // vm.dele.trade_code = 'jdadasjdjas';
        // //vm.dele.total_price

        vm.dele.address = xnData.get('address')
        $log.debug(vm.order, vm.dele.address)
        if (!vm.dele.address) {
          vm.getAddres()
        }
      }

      vm.goBack = function() {
        $ionicNavBarDelegate.back()
        $ionicViewSwitcher.nextDirection('back')
      }
      vm.pinkUp = function() {
        $log.debug(vm.dele.obj)
        if (!vm.dele.obj.cgn_id) {
          ionicToast.alert('请选择你的地址')
          return false
        }
        $ionicLoading.show({
          template: '订单在提交中...'
        })
        FirstService.pickOrder(vm.dele.obj)
          .then(
            function(res) {
              if (res.status == 200) {
                $log.debug('提交订单', res)
                //xnData.remove('pinkUp')
                xnData.set(res.data, 'pinkUp')
                if (res.data.order_total_price == vm.order[0].sum_all) {
                }
                $state.go('pinkUp')
              } else {
                ionicToast.alert('提交失败，请稍后在试')
              }
            },
            function() {
              $ionicLoading.hide()
              ionicToast.alert('网络延迟，请稍后在试')
              $ionicHistory.goBack()
            }
          )
          .finally(function() {
            $ionicLoading.hide()
          })
      }

      $scope.$on('$ionicView.beforeEnter', function() {
        vm.dele.null = false
        vm.init()
      })
    }
  ])

  .controller('pink_up_ctrl', [
    '$stateParams',
    '$state',
    '$log',
    '$scope',
    '$ionicLoading',
    'ionicToast',
    '$ionicHistory',
    '$ionicViewSwitcher',
    '$ionicNavBarDelegate',
    'xnData',
    'FirstService',
    function(
      $stateParams,
      $state,
      $log,
      $scope,
      $ionicLoading,
      ionicToast,
      $ionicHistory,
      $ionicViewSwitcher,
      $ionicNavBarDelegate,
      xnData,
      FirstService
    ) {
      var vm = ($scope.vm = this)
      vm.paytype = 'apli' //默认支付宝支付
      vm.order = {}
      vm.query = {}

      vm.init = function() {
        vm.order = {}
        vm.order.data = xnData.get('pinkUp')

        vm.times = new Date().getTime()
        vm.query.goods_name = '西南家政商品'
        vm.query.total_price = vm.order.data.order_total_price
        if (vm.order.data.orderRetInfo.length > 1) {
          vm.query.trade_code = vm.order.data.orderRetInfo[0].order_number
        } else {
          vm.query.trade_code = 'ES' + vm.times
        }

        $log.debug('订单详情', vm.times, vm.order.data)
      }

      vm.goBack = function() {
        $ionicNavBarDelegate.back()
        $ionicViewSwitcher.nextDirection('back')
      }
      //成功的回调
      vm.alipaySuccessOrder = function(arr) {
        //订单的ids
        FirstService.clientNotifyUrl(arr)
          .then(
            function(res) {
              if (res.status == 200) {
                $state.go('payrelsult', { type: 3 })
              } else {
                $state.go('payrelsult', { type: 1 })
              }
            },
            function() {
              $state.go('payrelsult', { type: 1 })
            }
          )
          .finally(function() {})
      }
      //weixin
      vm.WeiPaySuccessOrder = function(arr) {
        //订单的ids
        FirstService.WeiPayNotifyUrl(arr)
          .then(
            function(res) {
              if (res.status == 200) {
                $state.go('payrelsult', { type: 3 })
              } else {
                $state.go('payrelsult', { type: 1 })
              }
            },
            function() {
              $state.go('payrelsult', { type: 1 })
            }
          )
          .finally(function() {})
      }
      //支付
      vm.alipayXn = function() {
        xnData.remove('pinkUp')
        if (vm.paytype == 'weixin') {
          var obj = {}
          obj.body = '家政服务超市商品'
          obj.out_trade_no = vm.query.trade_code
          obj.total_fee = vm.query.total_price

          FirstService.getweixinPayString(obj).then(function(res) {
            if (res.status == 200) {
              var params = {
                partnerid: res.data.PartnerId, // merchant id
                prepayid: res.data.PrePayId, // prepay id
                noncestr: res.data.NonceStr, // nonce
                timestamp: res.data.Timestamp, // timestamp
                sign: res.data.Sign, // signed string
                appid: res.data.AppId,
                package: res.data.Package
              }
              var arr = _.pluck(vm.order.data.orderRetInfo, 'order_number')
              Wechat.sendPaymentRequest(
                params,
                function() {
                  ionicToast.alert('订单支付成功')
                  //$state.go('payrelsult', { 'type': 3 })
                  vm.WeiPaySuccessOrder(arr)
                },
                function(reason) {
                  ionicToast.alert('订单支付失败')
                  alert(JSON.stringify(reason))
                  $state.go('payrelsult', { type: 1 })
                }
              )
            } else {
            }
          })
        } else {
          //支付宝
          var arr = _.pluck(vm.order.data.orderRetInfo, 'order_number')
          FirstService.getAlipayString(vm.query).then(function(res) {
            console.log(res)
            if (res.status == 200 && res.param) {
              cordova.plugins.alipay.payment(
                res.param,
                function success(e) {
                  if (e) {
                    if (e.resultStatus == 9000) {
                      //ionicToast.alert('订单支付成功')
                      vm.alipaySuccessOrder(arr)
                    } else if (e.resultStatus == 8000) {
                      //支付中;
                      ionicToast.alert(
                        '订单支付中，请求订单列表查询订单状态,如果已扣款请联系客服'
                      )
                      $state.go('tab.order', { status: 1 })
                    }
                  }
                },
                function error(e) {
                  if (e) {
                    //alert(JSON.stringify(e));
                    if (e.resultStatus == 4000) {
                      //ionicToast.alert('订单支付失败')
                      $state.go('payrelsult', { type: 1 })
                    } else if (e.resultStatus == 6001) {
                      ionicToast.alert('您取消支付了')
                      $state.go('tab.order', { status: 1 })
                    } else if (e.resultStatus == 6002) {
                      ionicToast.alert('网络原因支付失败')
                      $state.go('payrelsult', { type: 1 })
                    }
                  }
                }
              )
            } else {
            }
          })
        }
      }

      $scope.$on('$ionicView.beforeEnter', function() {
        vm.paytype = 'apli' //默认支付宝支付
        vm.order = {}
        vm.order.data = {}
        vm.query = {}
        vm.init()
      })
    }
  ])

  .controller('select_address_ctrl', [
    '$stateParams',
    '$log',
    '$scope',
    '$ionicLoading',
    'ionicToast',
    '$ionicHistory',
    '$ionicViewSwitcher',
    '$ionicNavBarDelegate',
    'FirstService',
    'xnData',
    function(
      $stateParams,
      $log,
      $scope,
      $ionicLoading,
      ionicToast,
      $ionicHistory,
      $ionicViewSwitcher,
      $ionicNavBarDelegate,
      FirstService,
      xnData
    ) {
      var vm = ($scope.vm = this)
      $log.debug('地址选择')
      vm.dele = {}
      vm.dele.isError = false
      vm.address_data = []
      vm.dele.isLoading = true
      vm.init = function() {
        vm.address_data = []
        FirstService.getAddressList()
          .then(
            function(res) {
              if (res.status == 200) {
                vm.dele.isError = false
                vm.address_data = res.data
                $log.debug('地址列表', res.data)
              } else {
                vm.address_data = []

                vm.dele.isError = true
              }
            },
            function() {
              vm.address_data = []

              vm.dele.isError = true
            }
          )
          .finally(function() {
            vm.dele.isLoading = false
          })
      }
      vm.init()
      vm.selectAddress = function(item) {
        xnData.set(item, 'address')
        $ionicHistory.goBack()
      }

      vm.goBack = function() {
        $ionicNavBarDelegate.back()
        $ionicViewSwitcher.nextDirection('back')
      }
    }
  ])

  //订单支付结果
  .controller('payrelsut_ctr', [
    '$stateParams',
    '$log',
    '$scope',
    '$ionicLoading',
    '$interval',
    '$state',
    'ionicToast',
    '$ionicHistory',
    '$ionicViewSwitcher',
    '$ionicNavBarDelegate',
    'FirstService',
    'xnData',
    function(
      $stateParams,
      $log,
      $scope,
      $ionicLoading,
      $interval,
      $state,
      ionicToast,
      $ionicHistory,
      $ionicViewSwitcher,
      $ionicNavBarDelegate,
      FirstService,
      xnData
    ) {
      var vm = ($scope.vm = this)
      vm.query = {}
      vm.query.type = $stateParams.type
      vm.timer = ''
      function timeStop() {
        vm.query.num = 4
        vm.timer = $interval(function() {
          if (vm.query.num == 0) {
            $interval.cancel(vm.timer)
            vm.timer = null
            console.log(vm.query.num)
            $state.go('tab.order', { status: vm.query.type })
          } else {
            vm.query.num--
            console.log(vm.query.num)
          }
        }, 1000)
      }

      vm.init = function() {
        if (vm.query.type == 3) {
          vm.query.img = 'img/xn/pay_success.png'
          vm.query.text = '支付成功'
          vm.query.ui = 'tab.order({status:2})'
        } else {
          vm.query.img = 'img/xn/pay_err.png'
          vm.query.text = '支付失败'
          vm.query.ui = 'tab.order({status:1})'
        }
        timeStop()
      }
      $scope.$on('$ionicView.beforeEnter', function() {
        vm.init()
      })
    }
  ])
