/**
 * 所有公共指令
 */

angular.module('rsc.common.directives', ['ion-BottomSheet'])

    .directive('citysItem', function ($log) {
        return {
            restrict: 'EAC',
            templateUrl: "js/common/directives/templates/city_item.html",
            replace: true,
            scope: {
                data: "="
            },
            controller: function ($scope, areas, ENV, Storage, $http, $ionicScrollDelegate) {

                // $scope.provinces = areas.provinces;
                $scope.provinces = $scope.data.AreaService.provinces;

                $scope.current = 'pro';

                // $scope.apply
                // $scope.currentPro = null;
                $scope.currentCity = null;
                $scope.currentArea = null;

                $log.debug('current', $scope.data)

                $scope.selectPro = function (item) {
                    $scope.current = 'city';
                    //如果选择的不是同一个城市，则重新加载城市的数据。
                    if ($scope.currentPro && $scope.currentPro.ProID != item.ProID) {
                        $scope.currentCity = null;
                        $scope.currentArea = null;
                        $scope.citys = areas.citys[item.ProID]
                        $scope.areas = []
                        $scope.currentCity = { name: "请选择" }
                    } else {
                        console.log('$scope.currentCity', $scope.currentCity);
                        if (!$scope.currentCity) {
                            $scope.currentCity = { name: "请选择" }
                        }
                        $scope.citys = areas.citys[item.ProID]
                    }
                    $scope.currentPro = item;
                    $scope.data.province = item;

                    $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
                }

                $scope.selectCity = function (item) {

                    if (!$scope.data.options.limit || $scope.data.options.limit.indexOf('ares') == -1) {
                        $scope.current = 'ares';
                    }
                    if ($scope.currentCity && $scope.currentCity.CityID != item.CityID) {
                        if (!$scope.data.options.limit || $scope.data.options.limit.indexOf('ares') == -1) {
                            $scope.currentArea = null;
                            $scope.areas = areas.areas[item.CityID]
                            // if($scope.areas.length)
                            $scope.currentArea = { name: "请选择" }
                        }
                    }
                    $scope.currentCity = item;
                    $scope.data.city = item;

                    $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();

                }

                $scope.selectAres = function (item) {
                    $scope.currentArea = item;
                    $scope.data.area = item;
                    $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
                }
                $scope.currentProClick = function (item) {
                    $scope.current = 'pro';
                }
                $scope.currentCityClick = function (item) {
                    $scope.current = 'city';
                }
                $scope.currentAreaClick = function (item) {
                    $scope.current = 'area';

                }

            }
        }
    })
    /**
     * 省市区三级联动
     * */
    .directive('cityPicker', ['$ionicModal', '$timeout', 'areas', '$log', 'RscAlert', function ($ionicModal, $timeout, areas, $log, RscAlert) {
        function isBoolean(value) {
            return typeof value === 'boolean'
        }

        function isArray(value) {
            return toString.apply(value) === '[object Array]'
        }

        return {
            restrict: 'AE',
            // ./templates/common/cityItem.html
            templateUrl: "js/common/directives/templates/city_picker.html",
            // E:\rsc-mobile\www\js\directives\template\common\cityPicker.html
            scope: {
                options: '=options'
            }, link: function (scope, element, attrs) {
                var vm = scope.vm = {}, so = scope.options, citypickerModel = null;
                vm.options = so;

                vm.title = so.title || ''
                vm.buttonText = so.buttonText || '完成'
                // vm.cssClass = 'ionic-citypicker item' + (angular.isDefined(so.iconClass) ? ' item-icon-left ' : ' ') + (angular.isDefined(so.cssClass) ? so.cssClass : '')
                vm.cssClass = (angular.isDefined(so.cssClass) ? so.cssClass : '')

                vm.iconClass = 'icon ' + (angular.isDefined(so.iconClass) ? so.iconClass : '')
                vm.barCssClass = angular.isDefined(so.barCssClass) ? so.barCssClass : 'bar-stable'
                vm.backdrop = isBoolean(so.backdrop) ? so.backdrop : true
                vm.backdropClickToClose = isBoolean(so.backdropClickToClose) ? so.backdropClickToClose : false
                vm.hardwareBackButtonClose = isBoolean(so.hardwareBackButtonClose) ? so.hardwareBackButtonClose : true
                vm.watchChange = isBoolean(so.watchChange) ? so.watchChange : false
                vm.AreaService = areas
                vm.tag = so.tag //|| "-"
                vm.step = so.step || 36 // 滚动步长 （li的高度）
                if (angular.isDefined(so.defaultAreaData) && so.defaultAreaData.length > 1) {
                    vm.defaultAreaData = so.defaultAreaData
                    vm.areaData = vm.defaultAreaData.join(vm.tag)
                } else {
                    vm.defaultAreaData = ['北京', '东城区']
                    vm.areaData = angular.isDefined(so.areaData) ? so.areaData.join(vm.tag) : '请选择城市'
                }

                vm.returnOk = function () {
                    vm.areaData = "";
                    angular.forEach(['provice', "city", 'area'], function (item) {
                        if (vm[item]) {

                            so[('current' + item[0].toUpperCase() + item.substring(1, item.length))] = vm[item];
                        }
                    })


                    if (vm.area) {
                        if (vm.city) {
                            if (vm.city.CityID != vm.area.CityID) {
                                vm.area = null;
                                so.currentArea = null;
                            }
                        }
                    }

                    if (vm.city) {
                        if (vm.province) {
                            if (vm.city.ProID != vm.province.ProID) {
                                vm.city = null;
                                so.currentCity = null;
                            }
                        }
                    }

                    $log.debug('vm', vm)
                    // $log.debug('所选区域信息',vm.AreaService.areas[vm.city.CityID])

                    if (vm.options.no_check) {
                        // 不检查city 则检查省份

                        if (_.contains(vm.options.no_check, 'city')) {
                            if (!vm.province) {
                                $log.debug('省未选择')
                                vm.areaData = '请选择';

                                RscAlert.alert('请选择省份')
                                return;
                            } else {
                                so.currentProvince = vm.province;
                                // vm.areaData += vm.tag + vm.province.name;

                            }
                        }
                        // 不检查area则检查 省份和城市
                        if (_.contains(vm.options.no_check, 'area')) {
                            if (!vm.province) {
                                $log.debug('省未选择')
                                vm.areaData = '请选择';

                                RscAlert.alert('请选择省份')
                                $log.debug('vm.areaData', vm.areaData);

                                return;
                            } else {
                                so.currentProvince = vm.province;
                            }

                            if (!vm.city) {
                                $log.debug('市未选择')
                                vm.areaData = '请选择';

                                RscAlert.alert('请选择市')
                                $log.debug('vm.areaData', vm.areaData);

                                return;
                            } else {
                                so.currentCity = vm.city;
                            }
                        }
                        if (vm.province) {
                            vm.areaData += vm.tag + vm.province.name;
                        }
                        if (vm.city) {
                            vm.areaData += vm.tag + vm.city.name;
                        }
                        if (vm.area) {
                            vm.areaData += vm.tag + vm.area.name;
                        }
                        $log.debug('vm.areaData', vm.areaData);

                    } else {
                        //TODO 如果没有市下面确实没有 区域列表，则不验证。
                        if (vm.province) {
                            so.currentProvince = vm.province;
                            if (vm.city) {
                                so.currentCity = vm.city;
                                //如果有区域则检查是否选择区域信息，没有则不检查
                                if (vm.AreaService.areas[vm.city.CityID]) {
                                    if (!vm.area) {
                                        // so.currentArea = vm.area = { DisID: null, name: null };
                                        vm.areaData = '请选择';
                                        RscAlert.alert('请选择区域信息')
                                        return;
                                    } else {
                                        so.currentArea = vm.area;
                                    }
                                } else {
                                    so.currentArea = vm.area = { DisID: '', name: '' };
                                }
                                (vm.city) ? (vm.areaData = vm.province.name + vm.tag + vm.city.name + (vm.area ? vm.tag + vm.area.name : '')) : (vm.areaData = vm.province.name + vm.tag + vm.city.name)
                                $log.debug('所选区域信息', vm.AreaService.areas[vm.city.CityID])
                            } else {
                                vm.areaData = '请选择';
                                RscAlert.alert('请选择市')
                                return;
                            }
                        } else {
                            vm.areaData = '请选择';
                            RscAlert.alert('请选择省')
                            return;
                        }
                    }
                    $log.debug('end')
                    so.text = vm.areaData;

                    citypickerModel && citypickerModel.hide()
                    so.buttonClicked && so.buttonClicked()
                }
                vm.returnCancel = function () {
                    $log.debug('cancel', vm)
                    citypickerModel && citypickerModel.hide()
                    $timeout(function () {
                        so.cancel && so.cancel()
                        // vm.initAreaData(vm.areaData.split(vm.tag))
                    }, 150)
                }
                vm.clickToClose = function () {
                    vm.backdropClickToClose && vm.returnCancel()
                }

                vm.initAreaData = function (AreaData) {
                    console.log('初始化省市');
                    if (AreaData[0]) { // 初始化省
                        console.log(AreaData[0], vm.AreaService.provinces);
                        for (i in vm.AreaService.provinces) {
                            if (vm.AreaService.provinces[i].name == AreaData[0]) {
                                vm.province = vm.AreaService.provinces[i]
                                console.log('currentProvinces', vm.province);

                                // vm.currentPro = vm.province;
                                break;
                            }
                        }
                    }
                    if (AreaData[1] && vm.province) { // 初始化市
                        console.log('vm.AreaService.citys', vm.AreaService.citys[vm.province.ProID]);

                        vm.city = _.find(vm.AreaService.citys[vm.province.ProID], function (item) {
                            return item.name == AreaData[1];
                        })

                        // vm.currentCity = vm.city;
                        $log.debug('currentCity', vm.city)

                    }
                    if (AreaData[2] && vm.city && vm.city.sub) { // 初始化区

                    }
                }
                if (vm.watchChange) {
                    scope.$watch('options.areaData', function (newVal, oldVal) {
                        if (newVal !== oldVal && isArray(newVal) && newVal.length > 1 && newVal.join(vm.tag) !== vm.areaData) {
                            if (vm.isCreated) {
                                $log.debug('newVal', newVal)
                                // vm.initAreaData(newVal)
                            } else {
                                vm.defaultAreaData = newVal
                            }
                            vm.areaData = newVal.join(vm.tag)
                        }
                    })
                }
                element.on("click", function () {
                    // delete scope.options.titleCss;//单击后删除标题颜色(待启用)
                    if (citypickerModel) {
                        citypickerModel.show()
                        return false
                    }
                    vm.isCreated = true
                    // $ionicModal.fromTemplateUrl('lib/ionic-citypicker/src/templates/ionic-citypicker.html', {
                    $ionicModal.fromTemplateUrl('js/common/directives/templates/city_select.html', {
                        scope: scope,
                        animation: 'slide-in-up',

                        backdropClickToClose: false,
                        hardwareBackButtonClose: false,
                    }).then(function (modal) {
                        citypickerModel = modal;
                        $timeout(function () {
                            citypickerModel.show();
                            $log.debug('vm.defaultAreaData', vm.defaultAreaData)

                        }, 50)
                    })
                })
                scope.$on('$destroy', function () {
                    citypickerModel && citypickerModel.remove();
                });
            }
        }
    }])
    /**
     * 打电话指令
     * */
    .directive('xnCall', function (iAlert, AccountService, $rootScope, ionicToast, Storage) {
        return {
            restrict: 'EAC',
            replace: true,
            scope: {

            },
            link: function ($scope, element, attributes) {
                var vm = $scope.vm = this;
                vm.query = {};
                vm.query.isFalg = true;
                vm.telPhone = function () {
                    console.log(22)
                    //vm.getPhone();
                    var query = {
                        type: 'radio'
                    };
                    var obj = {
                        templateUrl: '<ul class="list genderRadio">' +
                            '<li class="item item-checkbox item-checkbox1 item-icon-right" ng-repeat="item in vm.query.iphoneList track by $index">' +
                            '<label class="checkbox" style="width:250px;">' +
                            '<input type="radio" ng-value="item.cos_phone" ng-model="vm.query.phone">' +
                            '</label>' +
                            '{{item.cos_phone}}&nbsp' +
                            "</li>" +
                            '</ul>',
                        btn: '拨号'
                    };

                    if (vm.query.iphoneList) {
                        //iAlert.confirm('', '13796003244', vm.success, vm.err, obj)
                        iAlert.tPopup($scope, obj, query, vm.success, vm.err);

                    } else {
                        ionicToast.alert('获取电话失败，稍后再试')
                    }
                }

                vm.getPhone = function () {
                    if (!vm.query.isFalg) {
                        return false;
                    }
                    vm.query.isFalg = false;
                    AccountService.xnGetPhonekf().then(function (res) {
                        if (res.status == 200) {
                            vm.query.iphoneList = res.data;

                            if (_.size(vm.query.iphoneList) > 0) {
                                vm.query.isFalg = true;
                                vm.telPhone();
                            } else {
                                ionicToast.alert('客服电话更新中，请稍后再访问')
                            }

                        } else {
                            ionicToast.alert('获取电话失败，请稍后再访问')
                        }
                    }, function () {
                        ionicToast.alert('网络延迟，请稍后再访问')
                    }).finally(function () {
                        vm.query.isFalg = true;
                    })
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
                }
                element.on('click', vm.getPhone);

            }
        }
    })

    /**
     *
     * 上传图片组件
     */
    .directive('tradeImgTool', function (iAlert, XnAlert, FileUpload, fileReader, $rootScope, AccountService, $ionicHistory, $log, $http, ionicToast, ENV, $ionicLoading,Storage) {

        return {
            restrict: 'ECA',
            replace: true,
            scope: {
                fun:'='
            },
            // templateUrl: 'js/common/directives/templates/company_page.html',
            link: function ($scope, element, attr) {
                element.on('click', function () {
                    alert('请选择图片上传方式')
                    $scope.upLoadOrderImg();
                });
                //获取input中files 信息
                $scope.getUploadPic = function (e) {
                    $scope.file = e;
                    //console.log($scope.file);
                    $scope.getFile()
                };

                $scope.getFile = function () {

                    fileReader.readAsDataUrl($scope.file[0], $scope).then(function (result) {
                        if (result) {
                            $scope.previewImageSrc = result;
                            // $scope.imgUrl.push(result)
                        }
                    })
                };

                var _upimg = function (file, _url, $http) {
                    var c = new FormData();
                    c.append('File', file);
                    c.append('type', 'file')
                    console.log(c,file)
                    // 上传图片
                    return $http({
                        method: 'POST',
                        url: _url,
                        data: c,
                        headers: {
                            "Content-Type": undefined
                        },
                        transformRequest: angular.identity
                    })
                };
                //上传图片方法
                $scope.upLoadOrderImg = function () {
                    $scope.previewImageSrc = '';
                    if (ionic.Platform.isWebView()) { //APP端
                        var opt = {
                            // params: {
                            //     'type': 'tou_xiang'
                            // },
                            //url: ENV.api.trade + 'file/img_upload',
                            url: 'http://www.zgxnjz.cn/index.php/Home/UserPho/ImgUpLoadFile',
                            headers: {
                                'x-access-token': $rootScope.user.token,
                                "Content-Type":undefined
                            }
                        }

                        FileUpload.upload('resizeImg', opt, function (res) {
                        $ionicLoading.show({
                                             template: "上传中..."
                                         })
                            res.then(function (json) {
                                $log.debug('上传图片的回调', json)
                                var result = JSON.parse(json.response);
                               
                                if (result.status == "200") {
                                    $ionicLoading.hide();
                                    ionicToast.alert('上传成功!');

                                    $scope.fun.user_pho = result.data.img_url;
                                    Storage.set('userInfo',$scope.fun)
                                    console.log($scope.fun)

                                } else {
                                    ionicToast.alert('上传失败!');
                                    $ionicLoading.hide();
                                }
                            }, function (err) {
                                console.log(err)
                                $ionicLoading.hide();
                                ionicToast.alert('上传失败!');
                            }, function (progress) {

                            }).finally(function () {
                                $ionicLoading.hide();

                            });
                        })
                    } else {   //pc端

                        var data = {
                            type: 'file'
                        }
                        var obj = {
                            templateUrl: 'js/common/template/popupRadio.html',
                            title: '上传头像'
                        }
                        XnAlert.tPopup($scope, obj, data, function (res) {

                            if (res) {
                                if (!$scope.file) {
                                    ionicToast.alert('选择图片失败,再次上传');
                                    return false;
                                }
                                // var _url = ENV.api.trade + 'file/img_upload';
                                var _url = 'http://www.zgxnjz.cn/index.php/Home/UserPho/ImgUpLoadFile';
                                _upimg($scope.file[0], _url, $http).success(function (data) {

                                    if (data.status == "200") {
                                        ionicToast.alert('更换头像成功')
                                      
                                        $scope.fun.user_pho = data.data.img_url;
                                        Storage.set('userInfo',$scope.fun)
                                        console.log($scope.fun)
                                        
                                    } else {
                                        ionicToast.alert('图片上传失败,请稍后重试')
                                    }
                                })
                            }

                        })
                    }
                }

            }

        }
    })
   
