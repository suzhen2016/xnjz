   angular.module('xn.govern.ctrl', [])
       /**
        *分类页面的控制
        */
       .controller('govern_ctrl', ['$stateParams', '$log', '$scope', '$ionicLoading', 'Storage', 'ionicToast', '$filter',
           function ($stateParams, $log, $scope, $ionicLoading, Storage, ionicToast, $filter) {
               var vm = $scope.vm = this;
               $log.debug("政府页面");
              
       }])