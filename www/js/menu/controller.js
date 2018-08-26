angular.module('xn.menu.ctrl', [])
/**
 *分类页面的控制
 */
.controller('menu_ctrl', ['$ionicHistory','$stateParams','$state','FirstService', '$log', '$scope', '$ionicLoading', 'Storage', 'ionicToast', '$filter',
    function ($ionicHistory,$stateParams,$state, FirstService,$log, $scope, $ionicLoading, Storage, ionicToast, $filter) {
        var vm = $scope.vm = this;
        $log.debug("分类页面");
        vm.order_menu = [{name:"家政服务",id:'home'},
        {name:"商城",id:'shop'}]
     
        vm.query=  {};
        vm.order = {};
        vm.query.menu_id = $stateParams.id;

        vm.isLoadding = false;

        vm.init = function(type){
            vm.isError = false;
             if(vm.query.menu_id=='home'){
                 var serve = FirstService.getHomeMenuById
             }else if(vm.query.menu_id=='shop'){
                  var serve = FirstService.getShopOrder;
             }
             serve().then(function(res){
                  $log.debug('分类',res);
                 if(res.status==200){
                     $log.debug('分类',res.data);
                     vm.order = res.data;
                     if(_.size(_.keys(vm.order))==0){
                         vm.isNull = true;//空值
                     }else{
                         vm.isNull = false;
                     }
                 }else{
                     vm.isError = true;
                 }
             },function(){
                 vm.isError = true;
             }).finally(function(){
                 vm.isLoadding = true;
             })
        }
        vm.init(vm.query.menu_id);
        vm.goMore = function(key){
             $log.debug($filter('menuTieleId')(key))
             var obj = $filter('menuTieleId')(key);
             $state.go(obj.route,{id:obj.id,title:key})
        }
        $scope.$on('$ionicView.beforeEnter',function(){
           
            // $ionicHistory.nextViewOptions({
            //     historyRoot: true,
            //     disableAnimate: false
            //   })
        })
}])