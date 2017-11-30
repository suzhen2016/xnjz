angular.module('rsc.common.account.service', ['rsc.common.service.rest','rsc.common.service.account'])
    .factory('AccountService', ['$q', 'Restangular', '$window', 'Storage', 'AccountRestAngular', 'XnRestAngular','AccountRestAngularNoToken',
        function ($q, Restangular, $window, Storage, AccountRestAngular, XnRestAngular,AccountRestAngularNoToken) {
           
            return {
                //确定忘记密码重置密码
                checkVerifyCode: function (data) {
                    var all = XnRestAngular.allUrl('/User/modifyPwd');
                    return all.post(data);
                },
                /**
                 * 根据手机号获取注册验证码
                 */
                getCode: function (phone) {
                    var Phone = XnRestAngular.one('/User/wjPwdGetVerifyCode?phone='+phone);
                    var promis = $q.defer();
                    Phone.get().then(function (result) {
                        promis.resolve(result);
                    }, function (error) {
                        promis.reject(error);
                    })
                    return promis.promise;
                },
                /**
                 * 注册
                 */
                register: function (data) {
                    var all = XnRestAngular.allUrl('/User/registerPhone');
                    return all.post(data);
                },
                /**
                 * 登录
                 */
                xnLogin: function (str) {
                    var all = XnRestAngular.allUrl('/User/login?'+str);
                    return all.get('');
                },
                /**
                 * 注册验证码
                 */
                xnGetCode: function (phone) {
                    var all = XnRestAngular.allUrl('/User/checkAndGetVerifyCode?phone='+phone);
                    return all.get('');
                },
                /**
                 * 修改手机号验证码
                 */
                xnGetChangeCode: function (phone) {
                    var all = XnRestAngular.allUrl('/User/uptPhoneNumVerifyCode?phone='+phone);
                    return all.get('');
                },
                /**
                 * 修改手机号接口
                 */
                xnGetChangePhone: function (str) {
                    var all = XnRestAngular.allUrl('/User/updatePhoneNumber?'+str);
                    return all.get('');
                },
            }
        }
    ])