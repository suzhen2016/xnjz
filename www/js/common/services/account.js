angular.module('rsc.common.service.account', ['rsc.common.service.rest'])


  .factory('AccountInformation', ['AccountRestAngular', 'AccountRestAngularNoToken', 'authenticationService', '$log', '$q', 'AdminServiceAngular',
    function (AccountRestAngular, AccountRestAngularNoToken, authenticationService, $log, $q, AdminServiceAngular) {
      
    }
  ])
  .factory('authenticationService', ['Storage', '$log', '$location', function (Storage, $log, $location) {
        var userInfo;
        var companyInfo;

        function getUserInfo() {
            if (Storage.get('userInfo')) {
                userInfo = Storage.get('userInfo');
                return userInfo;
            } else {
                //$log.warn("no login");
                // $location.path('/tab/login')
                // window.location.href = 'http://'+$location.$$host+':'+ $location.$$port + '#/tab/login'
                return null;
            }
        }

        function getCompanyInfo() {
            if (Storage.get('userInfo')) {
                companyInfo = Storage.get('userInfo').company;
                return companyInfo;
            } else {
                return null;
            }
        }

        return {
            getUserInfo: getUserInfo,
            getCompanyInfo: getCompanyInfo
        };

    }])