angular.module('xn.first.ctrl', [])
    /**
     *
     */
    .controller('first_ctrl', ['$stateParams', '$log', '$scope', '$ionicLoading', 'Storage', 'ionicToast', '$filter', 'FirstService',
        function ($stateParams, $log, $scope, $ionicLoading, Storage, ionicToast, $filter, FirstService) {
            var vm = $scope.vm = this;
            $log.debug("首页面");


        }
    ])

    .controller('home_work_ctrl', ['$stateParams','$ionicHistory', 'FirstService', '$log', '$scope', '$ionicLoading', 'Storage', 'ionicToast', '$filter',
        function ($stateParams, $ionicHistory,FirstService, $log, $scope, $ionicLoading, Storage, ionicToast, $filter) {
            var vm = $scope.vm = this;
            $log.debug("家政服务页");
            vm.dele = {};
            vm.dele.isLoading = true;
            vm.dele.count = 2;
            vm.init = function (id) {
                FirstService.getHomeMenuById(id).then(function (res) {
                    if (res.status == 200) {
                        $log.debug('家政服务', res.data);
                        vm.dele.data = res.data;
                        angular.forEach(vm.dele.data, function (i, s) {
                            i.forEach(function (val, key) {
                                if (val.yg_star == null) {
                                    val.yg_star = 0;
                                }
                                val.start_class = vm.getStart(val.yg_star);

                            })
                        })
                        vm.dele.isLoading = false;
                    }else{
                        ionicToast.alert('数据加载失败，请稍后再试')
                        $ionicHistory.goBack()
                    }
                },function(){
                    ionicToast.alert('数据加载失败，请稍后再试')
                    $ionicHistory.goBack()
                })
            }
            vm.getStart = function (num) {
                var arr = [];
                if (!num) {
                    num = 0;
                }
                var numArr = num.toString().split('.');

                for (var i = 0; i < numArr[0]; i++) {

                    arr.push({ class: 'ion-ios-star' })

                }
                if (numArr[1]) {
                    arr.push({ class: 'ion-ios-star-half' });
                    for (var i = 0; i < 5 - numArr[0] - 1; i++) {
                        arr.push({ class: 'ion-ios-star-outline' })
                    }
                } else {
                    for (var i = 0; i < 5 - numArr[0]; i++) {
                        arr.push({ class: 'ion-ios-star-outline' })
                    }
                }
                return arr;
            }
        }
    ])

    .controller('shopping_mall_ctrl', ['$stateParams', 'FirstService', '$log', '$scope', '$ionicLoading', 'Storage', 'ionicToast', '$filter',
        function ($stateParams, FirstService, $log, $scope, $ionicLoading, Storage, ionicToast, $filter) {
            var vm = $scope.vm = this;
            $log.debug("购物商城页");
            vm.order = {}
            vm.init = function () {
                $ionicLoading.show({
                    template: '数据加载中...'
                    });
                FirstService.getShopOrder().then(function (res) {
                    if (res.status == 200) {
                        $log.debug('购物商城商品', res.data);
                        vm.order.first = res.data;
                    } else {
                        $ionicLoading.hide();
                    }
                }, function () {
                    ionicToast.alert('网络延迟');
                    $ionicLoading.hide();
                }).finally(function () {
                    FirstService.getShopIcon().then(function (res) {
                        if (res.status == 200) {
                            $log.debug('购物商城商品图标', res.data);
                            if (vm.order.first) {
                                vm.order.data = [];
                                var obj = angular.copy(res.data.gzImg);
                                obj.list = vm.order.first.gzGoods;
                                if(vm.order.first.gzGoods.length>0)obj.more_id = vm.order.first.gzGoods[0].cat_id;
                                
                                vm.order.data.push(obj);
                                var obj_qj = angular.copy(res.data.qjImg)
                                obj_qj.list = vm.order.first.qjGoods;
                                if(vm.order.first.qjGoods.length>0) obj_qj.more_id = vm.order.first.qjGoods[0].cat_id;
                                
                                vm.order.data.push(obj_qj);

                                $log.debug('购物商城组合', vm.order);
                                $ionicLoading.hide();
                            }

                        } else {
                            $ionicLoading.hide();
                        }
                    },function(){
                        $ionicLoading.hide();
                    })
                })
            }

        }
    ])

    .controller('home_more_ctrl', ['$stateParams','$ionicHistory', '$timeout','FirstService', '$log', '$scope', '$ionicLoading', 'Storage', 'ionicToast', '$filter',
        function ($stateParams,$ionicHistory,$timeout, FirstService, $log, $scope, $ionicLoading, Storage, ionicToast, $filter) {
            var vm = $scope.vm = this;
            $log.debug("更多");
            vm.query = {};
            vm.order = {};
            vm.dele ={};
            vm.dele.isLoading = true;
            vm.order.userList = []
            vm.query.hasMore = false;
            vm.query.id = $stateParams.id;
            vm.query.text = $stateParams.title;
            vm.getAppraise = function () {
                FirstService.getHomeWorkMore($stateParams.id).then(function (res) {
                    if (res.status == 200) {
                        $log.debug('指定职位的人员', res.data);
                        vm.dele.isLoading = false;
                        vm.order.userList = res.data;
                    } else {
                         $timeout(function(){
                            ionicToast.alert('数据加载失败，请稍后再试');
                            $ionicHistory.goBack()
                        },1000)
                    }
                },function(){
                      $timeout(function(){
                            ionicToast.alert('数据加载失败，请稍后再试');
                            $ionicHistory.goBack()
                        },1000)
                })
            }
            vm.doRefresh = function () {
                vm.order.userList = [];
                vm.getAppraise();
                $scope.$broadcast('scroll.refreshComplete');

            }
            vm.loadMore = function () {
                vm.getAppraise()
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
            $scope.$on('$ionicView.beforeEnter',function(){
                vm.doRefresh();
            })
        }
    ])

    .controller('home_person_ctrl', ['$stateParams', '$ionicHistory','$timeout','$log', '$scope', '$ionicLoading', 'Storage', 'ionicToast', '$filter', 'FirstService',
        function ($stateParams,$ionicHistory,$timeout, $log, $scope, $ionicLoading, Storage, ionicToast, $filter, FirstService) {
            var vm = $scope.vm = this;
            $log.debug("家政个人详情页");
            vm.query = {};
            vm.order = {}
         
            vm.order.num = 1;
            vm.order.appraiseList = []
            vm.query.hasMore = true;
            vm.query.yuangong_id = $stateParams.id;
            vm.dele = {}
            vm.dele.isLoading = true;
            vm.query.page_index = 1;
            vm.query.num = 0;   
            vm.init = function () {
                FirstService.getPersonDetails($stateParams.id).then(function (res) {
                    if (res.status == 200) {
                        vm.order.employeeinfo = res.data.employeeinfo;
                        vm.dele.isLoading = false;
                    } else {
                       $timeout(function(){
                            ionicToast.alert('数据加载失败，请稍后再试');
                            $ionicHistory.goBack()
                        },500)
                    }
                },function(){
                    $timeout(function(){
                        ionicToast.alert('数据加载失败，请稍后再试');
                        $ionicHistory.goBack()
                    },500)
                    
                })
            }
            
            vm.getPersonCmtList = function () {
                FirstService.getPersonNews(vm.query).then(function (res) {
                    if (res.status == 200) {
                         vm.dele.all_count = res.data.all_count;
                        if (res.data.comment.length > 0) {
                            res.data.comment.length == 5 ? vm.query.hasMore = true : vm.query.hasMore = false;
                           
                            res.data.comment.forEach(function (i) {
                                angular.forEach(i, function (val, key) {
                                    if (key == 'cmt_star') {
                                        val == null ? val == 0 : val == val;
                                        // val.cmt_star = 0;
                                        i.start_class = vm.getStart(val);
                                    }


                                })
                            })

                            vm.order.appraiseList = vm.order.appraiseList.concat(res.data.comment);

                        } else {
                            vm.query.hasMore = false;
                        }

                    } else {
                        vm.query.hasMore = false;
                    }
                })
            }
            
            vm.getStart = function (num) {
                var arr = [];
                if (!num) {
                    num = 0;
                }
                var numArr = num.toString().split('.');

                for (var i = 0; i < numArr[0]; i++) {

                    arr.push({ class: 'ion-ios-star' })

                }
                if (numArr[1]) {
                    arr.push({ class: 'ion-ios-star-half' });
                    for (var i = 0; i < 5 - numArr[0] - 1; i++) {
                        arr.push({ class: 'ion-ios-star-outline' })
                    }
                } else {
                    for (var i = 0; i < 5 - numArr[0]; i++) {
                        arr.push({ class: 'ion-ios-star-outline' })
                    }
                }
                return arr;
            }

            vm.doRefresh = function () {
                vm.order.appraiseList = [];
                vm.query.hasMore = true;
                vm.query.page_index = 1;
                vm.getPersonCmtList();
                $scope.$broadcast('scroll.refreshComplete');

            }

            vm.loadMore = function () {
                vm.query.page_index += 1;
                vm.getPersonCmtList();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }

             //加入购物车
            vm.addCar = function(){
              
                if(!vm.order.employeeinfo){
                    return false;
                }
                var str ='yuangong_id='+vm.query.yuangong_id+'&now_num='+vm.order.num;
                FirstService.shoppCar(str).then(function (res) {
                    if (res.status == 200) {
                       
                        //vm.getCar();
                        $log.debug('加入购物车',res);
                        if(res.data){
                             ionicToast.alert('恭喜您,加入购物车成功')
                            vm.query.num += Number(res.data.goods_buy_number);
                        }else{
                            ionicToast.alert('购物车已存在该家政人员,不能重复添加')
                        }
                        
                    }else{

                    }
                },function(){

                })
            }

            vm.getCar = function(){
                vm.query.num = 0;
                FirstService.getCarDetails().then(function (res) {
                    
                    if (res.status == 200) {
                        $log.debug('加入购物车数',res.data.length);
                        var sum = 0;
                        res.data.forEach(function(item){
                            sum += Number(item.goods_buy_number);
                        })
                        vm.query.num = sum;
                         
                    }else{

                    }
                },function(){

                })
            }
            
            $scope.$on("$ionicView.beforeEnter", function () {
                vm.init();
                vm.getPersonCmtList();
                vm.getCar();
            })
        }
    ])

    .controller('industry_user_ctrl', ['$stateParams', 'FirstService', '$log', '$scope', '$ionicLoading', 'Storage', 'ionicToast', '$filter',
        function ($stateParams, FirstService, $log, $scope, $ionicLoading, Storage, ionicToast, $filter) {
            var vm = $scope.vm = this;
            $log.debug("行业客户");
            vm.dele = {};
            vm.init = function () {
                FirstService.getHomeBigcustomer().then(function (res) {
                    if (res.status == 200) {
                        vm.dele.list = res.data;
                        $log.debug(vm.dele.list);
                    } else {

                    }
                }, function () {

                })
            }
        }
    ])
                
    .controller('train_ctrl', ['$stateParams', '$log', '$scope', '$ionicLoading', 'Storage', 'ionicToast', '$filter', 'FirstService',
        function ($stateParams, $log, $scope, $ionicLoading, Storage, ionicToast, $filter, FirstService) {
            var vm = $scope.vm = this;
            $log.debug("培训服务");
            vm.dele = {};
            vm.dele.isLoading = true;
            vm.init = function () {
                FirstService.getTrainLine().then(function (res) {
                    if (res.status == 200) {
                        vm.dele.list = res.data;
                        vm.dele.isLoading = false;
                        $log.debug(vm.dele.list);
                    }else{
                        ionicToast.alert('请求数据失败，稍后再访问')
                        $ionicHistory.goBack();
                    }
                },function(){
                    ionicToast.alert('请求数据失败，稍后再访问')
                    $ionicHistory.goBack();
                })
            }
        }
    ])

    .controller('train_details_ctr', ['$stateParams', '$log', '$scope', '$ionicLoading', 'iAlert', 'ionicToast', '$filter', 'FirstService',
        function ($stateParams, $log, $scope, $ionicLoading, iAlert, ionicToast, $filter, FirstService) {
            var vm = $scope.vm = this;
            $log.debug("培训详情");
            vm.dele = {}
            vm.init = function () {
                FirstService.getTrainDetails($stateParams.id).then(function (res) {
                    if (res.status == 200) {
                        vm.dele = res.data;
                        vm.dele.phone = res.data.train.train_tel;
                        $log.debug(vm.dele);
                        vm.dele.isLoading = false;
                    }else{
                        ionicToast.alert('请求数据失败，稍后再访问')
                        $ionicHistory.goBack();
                    }
                },function(){
                    ionicToast.alert('请求数据失败，稍后再访问')
                    $ionicHistory.goBack();
                })
            }

            vm.telPhone = function () {
                
                if (vm.dele.phone) {
                    iAlert.confirm('', vm.dele.phone, vm.success, vm.err)
                } else {
                    ionicToast.alert('获取电话失败，稍后再试')
                }
            }
            //成功打电话
            vm.success = function () {
                window.plugins.CallNumber.callNumber(function onSuccess(res) {
                    $log.debug('Succcess:call number' + res)
                },
                    function onError(res) {
                        $log.debug('Error:call number' + res)
                    },
                    vm.dele.phone, true);
            }
            vm.err = function () {
                $log.debug('取消拨号')
            }


        }
    ])

    .controller('recruitment_ctrl', ['$stateParams', '$ionicHistory','$log', '$scope', '$ionicLoading', 'Storage', 'ionicToast', '$filter', 'FirstService',
        function ($stateParams, $ionicHistory,$log, $scope, $ionicLoading, Storage, ionicToast, $filter, FirstService) {
            var vm = $scope.vm = this;
            $log.debug("招贤纳士");
            vm.dele = {};
            vm.dele.isLoading = true;
            vm.init = function () {
                FirstService.getHomeRecruitment().then(function (res) {
                    if (res.status == 200) {
                        vm.dele.list = res.data;
                        vm.dele.isLoading = false;
                        $log.debug(vm.dele.list);
                    }else{
                        ionicToast.alert('请求数据失败，稍后再访问')
                        $ionicHistory.goBack();
                    }
                },function(){
                    ionicToast.alert('请求数据失败，稍后再访问')
                    $ionicHistory.goBack();
                })
            }
        }
    ])

    .controller('recruitment_details_ctrl', ['$stateParams', '$log', '$scope', '$ionicLoading', 'iAlert', 'ionicToast', '$filter', 'FirstService',
        function ($stateParams, $log, $scope, $ionicLoading, iAlert, ionicToast, $filter, FirstService) {
            var vm = $scope.vm = this;
            $log.debug("招聘详情");

            vm.dele = {}
            vm.dele.isLoading = true;
            vm.dele.isError = true;
            vm.init = function () {
                FirstService.getHomeRecruitmentDetails($stateParams.id).then(function (res) {
                    if (res.status == 200) {
                        vm.dele = res.data;
                        vm.dele.phone=res.data.hire.hire_tel;
                         vm.dele.isLoading = false;
                        $log.debug(vm.dele);
                    }else{
                        ionicToast.alert('请求数据失败，稍后再访问')
                        vm.dele.isError = false;
                         $ionicHistory.goBack();
                    }
                },function(){
                    ionicToast.alert('请求数据失败，稍后再访问')
                    vm.dele.isError = false;
                    $ionicHistory.goBack();
                })
            }
            
            vm.telPhone = function () {
                
                if (vm.dele.phone) {
                    iAlert.confirm('', vm.dele.phone, vm.success, vm.err)
                } else {
                    ionicToast.alert('获取电话失败，稍后再试')
                }
            }
            //成功打电话
            vm.success = function () {
                window.plugins.CallNumber.callNumber(function onSuccess(res) {
                    $log.debug('Succcess:call number' + res)
                },
                    function onError(res) {
                        $log.debug('Error:call number' + res)
                    },
                    vm.dele.phone, true);
            }
            vm.err = function () {
                $log.debug('取消拨号')
            }
        }
    ])

    .controller('shopping_more_ctrl', ['$stateParams','$ionicHistory','$timeout', 'FirstService', '$log', '$scope', '$ionicLoading', 'Storage', 'ionicToast', '$filter',
        function ($stateParams,$ionicHistory,$timeout, FirstService, $log, $scope, $ionicLoading, Storage, ionicToast, $filter) {
            var vm = $scope.vm = this;
            $log.debug("商品更多");
            vm.query = {};
            vm.order = {}
            vm.order.userList = []
            vm.query.hasMore = true;
            vm.query.page = 1;
            vm.query.cat_id = $stateParams.id;
            vm.order.kong = false;

            vm.getAppraise = function () {
                 $ionicLoading.show({
                    template: '数据加载中...'
                    });
                $log.debug(vm.query)
                FirstService.getShopMoreList(vm.query).then(function (res) {
                    if (res.status == 200) {
                        res.data.goodSixList.length == 5 ? vm.query.hasMore = true : vm.query.hasMore = false;
                        vm.order.userList = vm.order.userList.concat(res.data.goodSixList)
                        $log.debug('更多商品', vm.order.userList, res.data);
                         vm.order.kong = true;
                         $ionicLoading.hide();
                    } else {
                        vm.order.kong = true;
                        vm.query.hasMore = false;
                       
                        $timeout(function(){
                            $ionicLoading.hide();
                            ionicToast.alert('数据加载失败，请稍后再试');
                            $ionicHistory.goBack()
                        },500)
                    }
                }, function () {
                    vm.query.hasMore = false;
                     $timeout(function(){
                        $ionicLoading.hide();
                        ionicToast.alert('数据加载失败，请稍后再试');
                        $ionicHistory.goBack()
                    },500)
                })


            }
          
            vm.doRefresh = function () {
                vm.order.userList = [];
                vm.query.hasMore = true;
                vm.getAppraise();
                $scope.$broadcast('scroll.refreshComplete');

            }
            vm.loadMore = function () {
                vm.query.page += 1;
                vm.getAppraise()
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
        }
    ])

    .controller('shopp_detail_ctrl', ['$stateParams', 'FirstService','$log', '$scope', '$ionicLoading', 'Storage',
        'ionicToast', '$filter', 'iAlert', '$ionicModal',
        function ($stateParams,FirstService, $log, $scope, $ionicLoading, Storage, ionicToast, $filter, iAlert, $ionicModal) {
            var vm = $scope.vm = this;
            $log.debug("商品详情");
            vm.order = {};
            vm.query = {};
            vm.dele = {};
            vm.query.order = {};
            vm.query.order.num = 1;
            vm.cmt = {};
            $scope.hasMore = true;
            vm.cmt.page_index  =1;
            vm.cmt.goodtype_id = $stateParams.id;
            vm.dele.appraiseList = [];

            vm.getConFirm = function () {
                iAlert.confirm('', '13796003244', vm.success, vm.err)
            }

            vm.success = function (res) {
                console.log('下单成功:' + res);
            }

            vm.err = function () {
                $log.debug("下单失败");
            }

            //选择商品
            $ionicModal.fromTemplateUrl('./js/first/template/orderModal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });
            vm.selectOrder = function () {
                $scope.modal.show();
            };
            vm.closeModal = function () {
                $scope.modal.hide();
            };
            //初始化
            vm.init = function () {
                FirstService.getShopDetailsHeader($stateParams.id).then(function (res) {
                    if (res.status == 200) {
                        vm.order.header = res.data;
                         vm.order_model_name  = vm.order.header.goods_name;
                        $log.debug('商品详情头部',vm.order.header);
                    }else{

                    }
                },function(){
                    console.log('网络连接失败')
                })
                FirstService.getShopDetailsAtt($stateParams.id).then(function (res) {
                    if (res.status == 200) {
                        vm.order.att = res.data;
                        $log.debug('商品详情属性',vm.order.att);
                        vm.cmt.page_index  =1;
                        vm.getCmtList('refresh');
                    }else{

                    }
                },function(){

                })
            }
            
            //选择商品的具体样式
            vm.changeOrder = function(i){
                vm.query.select = i;
                vm.order_model_name = i.goods_name;
                FirstService.getShopDetailsByAtt($stateParams.id,vm.query.select.goods_name)
                .then(function (res) {
                    if (res.status == 200) {
                        vm.order.header = res.data
                        // vm.order.att.num = 1;
                        $log.debug('商品详情属性改变',res.data);
                    }else{

                    }
                },function(){

                })
            }

            //计算
            vm.count = function(type){
                vm.query.order.num = Number(vm.query.order.num);
                if(type == 'add'){
                    vm.query.order.num +=1;
                    if(vm.query.order.num>=20){
                        vm.query.order.num =20;
                        ionicToast.alert('最多可添加20件商品')
                       
                    }
                    
                }else if(type == 'sub'){
                     vm.query.order.num -=1;
                }else{
                    if(!vm.query.order.num>0){
                        vm.query.order.num=1;
                    }
                }
                
                
            }
            //加入购物车
            vm.addCar = function(){
                if(!vm.order.header){
                    return false;
                }
                var str = 'goodtype_id='+vm.order.header.goodtype_id+'&now_num='+vm.query.order.num;
                FirstService.shoppCar(str).then(function (res) {
                    if (res.status == 200) {
                        if(res.data.goods_num){
                            ionicToast.alert('恭喜您,加入购物车成功')
                            vm.query.num += Number(res.data.goods_num);
                            vm.closeModal();
                        }else{
                             ionicToast.alert('同等商品只能加入购物车20件')
                        }
                        
                        $log.debug('加入购物车',res);
                    }else{
                        ionicToast.alert('加入购物车失败')
                    }
                },function(){

                }).finally(function(){
                     
                })
            }

            vm.getCar = function(){
                vm.query.num = 0;
                FirstService.getCarDetails().then(function (res) {
                    if (res.status == 200) {
                        
                        var sum = 0;
                        res.data.forEach(function(item){
                            sum += Number(item.goods_buy_number);
                        })
                        vm.query.num = sum;
                        $log.debug('加入购物车数',vm.query.num);
                    }else{
                        ionicToast.alert('服务忙，请稍后再访问')
                    }
                },function(){
                    ionicToast.alert('网络有延时，请稍后再访问')
                })
            }

            vm.getCmtList = function(type){
                if(type=='refresh'){
                    vm.cmt.page_index =1;
                     vm.dele.appraiseList = [];
                }
                FirstService.getPersonNews(vm.cmt).then(function (res) {
                    if (res.status == 200) {
                        vm.dele.all_count = res.data.all_count;
                        if (res.data.comment.length > 0) {
                            
                            res.data.comment.length == 5 ? vm.query.hasMore = true : vm.query.hasMore = false;
                           
                            res.data.comment.forEach(function (i) {
                                angular.forEach(i, function (val, key) {
                                    if (key == 'cmt_star') {
                                        val == null ? val == 0 : val == val;
                                        // val.cmt_star = 0;
                                        i.start_class = vm.getStart(val);
                                    }
                                })
                            })

                            vm.dele.appraiseList = vm.dele.appraiseList.concat(res.data.comment);

                        } else {
                            vm.query.hasMore = false;
                        }
                    }else{
                        ionicToast.alert('服务忙，请稍后再访问')
                    }
                },function(){
                    vm.query.hasMore = false;
                    ionicToast.alert('网络有延时，请稍后再访问')
                }).finally(function() {
                    // 停止广播ion-refresher
                    if(type=='refresh'){
                        $scope.$broadcast('scroll.refreshComplete');
                    }else{
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                    
                });
            }
            vm.getStart = function (num) {
                var arr = [];
                if (!num) {
                    num = 0;
                }
                var numArr = num.toString().split('.');

                for (var i = 0; i < numArr[0]; i++) {

                    arr.push({ class: 'ion-ios-star' })

                }
                if (numArr[1]) {
                    arr.push({ class: 'ion-ios-star-half' });
                    for (var i = 0; i < 5 - numArr[0] - 1; i++) {
                        arr.push({ class: 'ion-ios-star-outline' })
                    }
                } else {
                    for (var i = 0; i < 5 - numArr[0]; i++) {
                        arr.push({ class: 'ion-ios-star-outline' })
                    }
                }
                return arr;
            }

            vm.loadMore = function(){
                vm.cmt.page_index ++;
                vm.getCmtList('load')
            }
            
            $scope.$on("$ionicView.beforeEnter", function () {
                vm.init();
                vm.getCar();
            })
        }
    ])

    .controller('condition_ctrl', ['$stateParams', '$log', '$scope', '$ionicLoading', 'Storage', 'ionicToast', '$filter', 'FirstService',
        function ($stateParams, $log, $scope, $ionicLoading, Storage, ionicToast, $filter, FirstService) {
            var vm = $scope.vm = this;
            $log.debug("企业动态1");
            vm.dele = {};
            vm.dele.isLoading = false;
            vm.init = function () {
                FirstService.getCondition().then(function (res) {
                    if (res.status == 200) {
                        vm.dele.list = res.data.dymamicCat;
                        vm.dele.list.unshift({cat_id:'ss',cat_name:'全部'});
                        $log.debug(vm.dele.list);
                    }else{

                    }
                },function(){

                }).finally(function(){
                    
                })
            }

            vm.getNewList = function(type_id){
                vm.dele.newsList = [];
                vm.dele.classActive = type_id;
                vm.dele.isError =false;
                var id = '',
                serve='';
                if(type_id=='ss'){
                    id='';
                    serve = FirstService.getConditionAll;
                }else{
                    id =  type_id;
                    serve = FirstService.getConditionMenu;
                } 
                 serve(id).then(function (res) {
                      $log.debug('动态分类',res);
                    if (res.status == 200) {
                       
                        vm.dele.newsList = res.data;
                        $log.debug('动态分类',vm.dele.newsList);
                    }else{
                         vm.dele.isError = true;
                    }
                },function(){
                    vm.dele.isError = true;
                }).finally(function(){
                     vm.dele.isLoading = true;
                }) 
            }
            vm.getNewList('ss');

        }
    ])
    .controller('conditionMenu_ctrl', ['$stateParams', '$log', '$scope', '$ionicLoading', 'Storage', 'ionicToast', '$filter', 'FirstService',
        function ($stateParams, $log, $scope, $ionicLoading, Storage, ionicToast, $filter, FirstService) {
            var vm = $scope.vm = this;
            $log.debug("企业动态");
            vm.dele = {};
            vm.dele.title = $stateParams.name;
            vm.init = function () {
                FirstService.getConditionMenu($stateParams.id).then(function (res) {
                    if (res.status == 200) {
                        vm.dele.list = res.data;
                        $log.debug('动态分类',vm.dele.list);
                    }else{

                    }
                },function(){

                }).finally(function(){

                })
            }
        }
    ])
    .controller('conditionDetails_ctrl', ['$stateParams', '$log', '$scope', '$ionicLoading', 'Storage', 'ionicToast', '$filter', 'FirstService',
        function ($stateParams, $log, $scope, $ionicLoading, Storage, ionicToast, $filter, FirstService) {
            var vm = $scope.vm = this;
            $log.debug("企业动态详情");
            vm.dele = {};
           
            vm.init = function () {
                FirstService.getConditionDetails($stateParams.id).then(function (res) {
                    if (res.status == 200) {
                        vm.dele.order = res.data;
                        $log.debug('企业动态详情',vm.dele.order);
                    }else{

                    }
                },function(){

                }).finally(function(){

                })
            }
        }
    ])