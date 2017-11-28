angular.module('xn.my.ctrl', [])
    /**
     *分类页面的控制
     */
    .controller('my_ctrl', ['$stateParams', '$log', '$scope', '$ionicLoading',
        'Storage', 'ionicToast', '$filter', 'iAlert',
        function ($stateParams, $log, $scope, $ionicLoading, Storage, ionicToast, $filter, iAlert) {
            var vm = $scope.vm = this;
            $log.debug("我的页面");
            vm.query = {};
            vm.dele = {};
            
           
            vm.telPhone = function () {
                var query = {
                        type: 'radio'
                    };
                var obj = {
                        templateUrl: `<ul class="list genderRadio">
                            <li class="item item-checkbox item-checkbox1 item-icon-right" ng-repeat="item in vm.query.iphoneList track by $index">
                                <label class="checkbox" style="width:250px;">
                                    <input type="radio" ng-value='item.tel' ng-model="vm.query.phone">
                                </label>
                                {{item.tel}}&nbsp;
                             </li>
                        </ul>`,
                        btn:'拨号'
                    };    
                if (vm.query.iphoneList) {
                    //iAlert.confirm('', '13796003244', vm.success, vm.err, obj)
                    iAlert.tPopup($scope,obj,query,vm.success,vm.err)

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
                    vm.query.phone, true);
            }

            vm.err = function () {
                $log.debug('取消拨号')
            }
            $scope.$on('$ionicView.beforeEnter',function(){
                
                vm.dele.user = Storage.get('userInfo');
            })

        }
    ])

    .controller('user_ctrl', ['$stateParams','AccountService','$ionicHistory','FirstService','PictureSelect','$ionicActionSheet', '$ionicPopup', '$rootScope', 'iAlert', '$log', '$scope', 'ionicDatePicker', 'Storage', 'ionicToast', '$filter', '$timeout',
        function ($stateParams,AccountService,$ionicHistory,FirstService,PictureSelect, $ionicActionSheet,$ionicPopup, $rootScope, iAlert, $log, $scope, ionicDatePicker, Storage, ionicToast, $filter, $timeout) {
            var vm = $scope.vm = this;
            $log.debug("我的页面");
            vm.data = {};
            vm.dele = {};
            vm.userChange = Storage.get('userInfo');
            
            //vm.userChange.name = $rootScope.user.UserInfo.username;
            //vm.userChange.age = 12;
            $scope.textTs = '获取验证码';
           

            vm.openDatePicker = function () {
                ionicDatePicker.openDatePickerExtend(ipObj1);

            };
            //修改其他的额信息
            $scope.confin = function (res) {
                if(res){
                    var obj = {};
                    $log.debug('修改内容',res)
                    if(!res[res.type]) {
                        ionicToast.alert('所修改内容不能为空')
                        return false
                    };
                    vm.userChange[res.type] = res[res.type];
                    
                    if(res.type=="phone"){
                       var str = 'phone='+res.phone+'&verifyNum='+res.verifyNum;
                       vm.submitChange(str);
                    }else{
                        obj[res.type] = res[res.type];  
                        vm.submitChange(obj);
                    }
                }

            }
           
            //修改用户信息
            vm.changeUser = function (str, cb) {
                if (str == 'username') {
                    var obj = {
                        title:'修改昵称',
                        templateUrl:'<input type="text" ng-model="data.username" placeholder="请输入昵称...">',
                        btn:'确定'
                    }
                    var query = {
                        type:str
                    }
                
                    
                }else if(str=='phone'){
                    //ng-pattern="/(^13[0-9]{9}$)|(^15[0-9]{9}$)|(^17[0-9]{9}$)|(^18[012356789][0-9]{8}$)/"
                    var obj = {
                        templateUrl:`<div class="list">
                            <div class="item item-input-inset">
                                <label class="item-input-wrapper">
                                   <input type="tel" ng-model="data.phone"  maxlength="11"  placeholder="请输入手机号">
                                </label>
                            </div>
                            <div class="item item-input-inset">
                                <label class="item-input-wrapper">
                                   <input type="tel" maxlength="6" ng-model="data.verifyNum" placeholder="请输入验证码">
                                </label>
                                <button class="button button-small button-assertive" ng-click='getCoke(data.phone)'>
                                    {{textTs}}
                                </button>
                            </div>
                        </div>`,
                        btn:'确定'
                    }
                    var query = {
                        type: str
                    };
                   
                }
                 iAlert.tPopup($scope,obj,query,$scope.confin)
                
            }
            //定时器清除
            vm.clearIntervalOut = function (falg) {

                var stop = function () {

                    if (angular.isDefined(vm.timer)) {
                    
                        $interval.cancel(vm.timer);
                        vm.timer = undefined;
                        vm.textTs = '获取验证码';
                        vm.isDisabled = false;
                    }
                }

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
                

            }
            //获取验证码
            $scope.getCoke = function (phone) {
            
                if (/(^13[0-9]{9}$)|(^15[0-9]{9}$)|(^17[0-9]{9}$)|(^18[012356789][0-9]{8}$)/.test(phone)) {
                    
                }else{
                    ionicToast.alert('手机号格式不正确');
                    return false;
                }
                AccountService.xnGetChangeCode(phone)
                    .then(function (res) {
                        if (res.status == 200) {
                            vm.clearIntervalOut(true)
                            //  Storage.set('userInfo', res.data);
                            //  $state.go('tab.first')
                            $log.debug(res.data);
                        } else {
                            if (res.status == 404 && res.msg == 'Verify Code Is Wrong') {
                                ionicToast.show('验证码错误', 'middle', false, 2500);
                            } else if (res.status == 402 && res.msg == 'Phone Number Have Already Register') {
                                ionicToast.show('获取验证码错误，该手机号已注册', 'middle', false, 2500);
                            }else if(res.status == 300){
                                ionicToast.show('该手机号当日次数已达上限', 'middle', false, 2500);
                            }

                        }
                    }, function () {
                        ionicToast.alert('服务器忙，请稍后重试');
                    })
            };
            
            vm.selectSheet = function(){
                PictureSelect.selectOrTakePhoto()
            }

            vm.submitChange = function(obj){
                console.log('改变',obj)
                if(!angular.isString(obj)){
                    FirstService.changeUserInfo(obj).then(function(res){
                        if(res.status==200){
                            ionicToast.alert('修改成功')
                            Storage.set('userInfo', res.data);
                        }else{
                            ionicToast.alert('服务器正忙，修改失败')
                        }
                    },function(){
                        ionicToast.alert('网络延迟，修改失败')
                    })
                }else{
                    //修改手机号
                    AccountService.xnGetChangePhone(obj).then(function(res){
                        if(res.status==200){
                            ionicToast.alert('修改成功,请重新登录')
                            Storage.remove('userInfo');
                            $state.go('login');
                            $ionicHistory.clearHistory()
                            $ionicHistory.clearCache()
                        }else if(res.status==403){
                            ionicToast.alert('修改失败,验证码错误')
                        }else{
                             ionicToast.alert('修改失败,请稍后重试')
                        }
                    },function(){
                        ionicToast.alert('网络延迟，修改失败')
                    })
                }
                
            }

        }
    ])


    .controller('order_ctrl', ['$log','$stateParams', '$scope', '$ionicHistory', '$ionicViewSwitcher', '$timeout','FirstService','$ionicListDelegate',
        function ($log,$stateParams, $scope, $ionicHistory, $ionicViewSwitcher, $timeout,FirstService,$ionicListDelegate) {
            $log.debug('订单页11')
            var vm = $scope.vm = this;
            vm.query = {};
            vm.query.status = $stateParams.status;
            vm.query.page_index = 1;
            vm.list = [];
            vm.dele = {};
            vm.dele.isLoading = true;
            vm.hasMore = true;
            vm.goback = function () {
                $ionicHistory.goBack();//返回上一个页面
                $ionicViewSwitcher.nextDirection("back");
            }
            vm.init = function(){
                var serve = '';
                if($stateParams.status=='all'){
                    serve = FirstService.getOrderAll;
                }else{
                    serve = FirstService.getOrderByStatus;
                    vm.query.order_status =  $stateParams.status; 
                }
                serve(vm.query).then(function(res){
                    $log.debug('获取订单列表',res)
                    if(res.status==200){
                        vm.hasMore = res.data.oderinfo.length<5 ? false:true;
                        vm.list = vm.list.concat(res.data.oderinfo);
                        vm.dele.isLoading = false;
                        $log.debug('获取订单列表',res.data)
                    }else{

                    }
                }).finally(function(){
                    vm.dele.isLoading = false;
                })
            }

            vm.deleOrder = function(id,index){
                var arr= [];
                arr.push(id)
                FirstService.deleOreder(arr).then(function(res){
                     $log.debug('获取订单详情',res)
                    if(res.status==200){
                        vm.list.splice(index,1);
                        $ionicListDelegate.closeOptionButtons();
                        $log.debug('获取订单详情',res.data)
                    }
                })
            }


            $scope.doRefresh = function () {
                vm.list = [];
                vm.dele.isLoading = true;
                vm.query.page_index = 1;
                vm.query.status = $stateParams.status;
                vm.init();
                $timeout(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                }, 300)
            }
            vm.loadMore = function(){
                vm.query.page_index +=1;
                vm.init()
                $timeout(function () {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }, 300)
            }   

            $scope.$on("$ionicView.beforeEnter", function () {
              
                $scope.doRefresh();
            })

        }
    ])

    .controller('order_details_ctrl', ['$log','ionicToast','$stateParams', '$scope', '$ionicHistory', '$ionicViewSwitcher', '$timeout','FirstService','xnData',
        function ($log,ionicToast,$stateParams, $scope, $ionicHistory, $ionicViewSwitcher, 
        $timeout,FirstService,xnData) {
            $log.debug('订单详情')
            var vm = $scope.vm = this;
            vm.query = {};
            vm.query.id = $stateParams.id;
            vm.order = {};
            vm.dele = {};
            vm.dele.isLoading = false;

            vm.init = function(){               
                FirstService.getOrderDetails($stateParams.id).then(function(res){
                     $log.debug('获取订单详情',res)
                    if(res.status==200){
                        vm.order = res.data;
                        vm.dele.isLoading = true;
                        if(vm.order){
                            if(vm.order.order_status=='1'){
                                xnData.set({order_time_end:res.data.order_time_end},'pinkUp')
                            }else if(vm.order.order_status=='4'){
                                xnData.set({yuangong_id:res.data.yuangong_id,goodtype_id:vm.order.goodtype_id},'appraise')
                            }
                               
                        }
                       
                    }else{

                    }
                },function(){

                }).finally(function(){

                })
            }

            vm.deleOrder = function(id,type){
                var arr= [],
                    serve = '',
                    text = '删除'
                arr.push(id)
                if(type){
                   serve = FirstService.cancelOrder;
                   text = '取消'
                }else{
                    serve = FirstService.deleOreder;
                }
                serve(arr).then(function(res){
                     $log.debug('获取订单详情',res)
                    if(res.status==200){
                        ionicToast.alert(text +'成功')
                        $ionicHistory.goBack();
                     
                    }else{
                        ionicToast.alert('服务器正忙，'+ text +'失败')
                    }
                },function(){
                     ionicToast.alert('网络延时，'+ text +'失败')
                })
            }

            vm.confirmOrder = function(id){
                FirstService.confirmOrder(id).then(function(res){
                    if(res.status==200){
                        ionicToast.alert('恭喜你收到我们的服务');
                        $ionicHistory.goBack();
                    }else{
                        ionicToast.alert('服务器正忙，确定失败')
                    }
                },function(){
                    ionicToast.alert('网络延迟，确定失败')
                })
            }

            $scope.$on("$ionicView.beforeEnter", function () {
                vm.init();
            })

        }
    ])

    .controller('setUp_ctrl', ['$log', "$scope", '$state', 'Storage', "$ionicHistory",
        function ($log, $scope, $state, Storage, $ionicHistory) {
            var vm = $scope.vm = this;
            vm.logOut = function () {
                Storage.remove('userInfo');

                $state.go('login');
                $ionicHistory.clearHistory()
                $ionicHistory.clearCache()
            }
        }
    ])
    
    .controller('address_list_ctrl', ['$log', "$scope", '$state', 'Storage', 
    "$ionicHistory",'$ionicModal','FirstService','xnData',
        function ($log, $scope, $state, Storage, $ionicHistory,$ionicModal,
        FirstService,xnData) {
           var vm = $scope.vm = this;
           vm.address_data = [];
           vm.dele = {};
           vm.dele.isLoading = true;
           vm.dele.isError = false;
           vm.isRadio = 1;

            vm.selectAddress = function(){
                vm.openModal();
            }

            vm.init = function(){
                vm.address_data = [];
                 FirstService.getAddressList().then(function (res) {
                    if (res.status == 200) {
                        vm.dele.isLoading = false;
                        vm.address_data = res.data;
                        $log.debug('地址列表',res.data);
                    }else{
                          vm.dele.isError = true;
                    }
                },function(){
                   
                     vm.dele.isError = true;
                }).finally(function(){
                    vm.dele.isLoading = false;
                })
            }

            vm.setDefultAddress = function(id){
                FirstService.setDefultAddress(id).then(function (res) {
                    if (res.status == 200) {
                        // vm.dele.isLoading = true;
                        // vm.init();
                        $log.debug('设置默认地址',res.data);
                    }else{
                        ionicToast.alert('设置失败，请稍后重试');
                    }
                },function(){
                    ionicToast.alert('设置失败，请稍后重试');
                })
            }

            vm.deleAddress= function(id){
                FirstService.deleAddress(id).then(function (res) {
                    if (res.status == 200) {                       
                        vm.dele.isLoading = true;
                        vm.init();
                        $log.debug('删除地址');
                    }else{
                         ionicToast.alert('删除失败，请稍后重试');
                    }
                },function(){
                    ionicToast.alert('删除失败，请稍后重试');
                })
            }
            vm.edit = function(obj){
                xnData.set(obj);
                $state.go('tab.editAdrss',{params:'edit'});
            }

            $scope.$on("$ionicView.beforeEnter", function () {
                vm.dele.isLoading = true;
                vm.init();
                
            })
        }
    ])

    .controller('add_address_list_ctrl', ['$log', "$scope", '$state', 'Storage', 
    "$ionicHistory",'$ionicModal','$stateParams','FirstService','ionicToast','xnData',
        function ($log, $scope, $state, Storage, $ionicHistory,$ionicModal,$stateParams,
        FirstService,ionicToast,xnData) {
           var vm = $scope.vm = this;
           vm.query = {};
           vm.query.type = $stateParams.params;
           vm.order = {};
           var obj = {
               'add':{title:'添加地址',btn:'保存'},
                'edit':{title:'修改地址',btn:'确定修改'}
           }
           vm.query.config = obj[$stateParams.params];
            var serve = '';
           if($stateParams.params=='edit'){
               vm.order = xnData.get();
               serve = FirstService.editAddress;
           }else{
                serve = FirstService.addAddress;
           }

           vm.changeAddress = function(){
              
                if(!vm.order.cgn_name){
                    ionicToast.alert('请填写姓名');
                    return false;
                }
                if(!vm.order.cgn_tel){
                    ionicToast.alert('请填写手机号');
                    return false;
                }
                if(!vm.order.cgn_daddr){
                    ionicToast.alert('请填写详细地址');
                    return false;
                }
                serve(vm.order).then(function (res) {
                    if (res.status == 200) {
                        $ionicHistory.goBack();
                        $log.debug('添加地址',res);
                    }else{

                    }
                },function(){
                    ionicToast.alert('网络延迟，请稍后重试')
                })
           }
           
        }
    ])

    .controller('edit_address_list_ctrl', ['$log', "$scope", '$state', 'Storage', 
            "$ionicHistory",'$ionicModal',
        function ($log, $scope, $state, Storage, $ionicHistory,$ionicModal) {
           var vm = $scope.vm = this;
        
        }
    ])

     .controller('appraise_list_ctrl', ['$log','FirstService',"$scope", '$state', 'Storage', 
            "$ionicHistory",'$ionicModal','xnData','ionicToast',
        function ($log, FirstService,$scope, $state, Storage, $ionicHistory,$ionicModal,xnData,ionicToast) {
           var vm = $scope.vm = this;
           vm.info = xnData.get('appraise');
           vm.query = {};
           $log.debug(vm.info)
           
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

            vm.obj = vm.getStart(0);

            vm.appStart = function(num){
                var start_num = num+1;
                vm.query.cmt_star = start_num;
                vm.obj = vm.getStart(start_num);
            }

            vm.submitAppraise = function(){
                
                if(!vm.query.cmt_star && !vm.query.cmt_msg){
                    ionicToast.alert('请至少填写一项提交评论')
                    return false;
                }
                if(vm.info.goodtype_id!='0'){
                    vm.query.goodtype_id = vm.info.goodtype_id;
                    delete vm.query.yuangong_id
                }
                if(vm.info.yuangong_id !='0'){
                    vm.query.yuangong_id = vm.info.yuangong_id;
                    delete vm.query.goodtype_id;

                }
                FirstService.addAppraise(vm.query).then(function(res){
                    if(res.status==200){
                        ionicToast.alert('评论成功')
                    }else{
                         ionicToast.alert('服务器正忙，评论失败')
                    }
                },function(){
                    ionicToast.alert('网络延迟，评论失败')
                })

            }
           
        }
    ])