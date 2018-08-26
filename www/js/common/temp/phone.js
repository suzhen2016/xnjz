angular.module('rsc.service.phone', [])
    .value('EnumType', {
        file_type: {
            //车辆
            xing_shi_zheng: 'xing_shi_zheng',  //行驶证照片
            yun_ying_zheng: 'yun_ying_zheng',  //运营证照片
            che_tou_zhao: 'che_tou_zhao',    //车头照
            //个人
            id_card_number: 'id_card_number',
            jia_shi_zheng: 'jia_shi_zheng',
            tou_xiang: 'tou_xiang',
            //公司
            logo: 'logo',
            ying_ye_zhi_zhao: 'ying_ye_zhi_zhao',
            qi_ye_shui_wu_deng_ji_zheng: 'qi_ye_shui_wu_deng_ji_zheng',
            qi_ye_zu_zhi_ji_gou_dai_ma_zheng: 'qi_ye_zu_zhi_ji_gou_dai_ma_zheng',
            qi_ye_yin_hang_kai_hu_xu_ke_zheng: 'qi_ye_yin_hang_kai_hu_xu_ke_zheng',
            quan_guo_gong_ye_chan_pin_sheng_chan_xu_ke_zheng: 'quan_guo_gong_ye_chan_pin_sheng_chan_xu_ke_zheng',
            she_bei_xing_hao_zhu_ce_ren_zheng: 'she_bei_xing_hao_zhu_ce_ren_zheng',
            ben_chang_chan_pin_zhi_jian_bao_gao: 'ben_chang_chan_pin_zhi_jian_bao_gao',
            jiao_yi_fang_chan_pin_zhi_jian_bao_gao: 'jiao_yi_fang_chan_pin_zhi_jian_bao_gao',
            di_san_fang_chan_pin_zhi_jian_bao_gao: 'di_san_fang_chan_pin_zhi_jian_bao_gao',
            qi_ye_jing_ying_cai_wu_bao_biao: 'qi_ye_jing_ying_cai_wu_bao_biao'
        },
        columnName: {
            //车辆
            xing_shi_zheng: 'xing_shi_zheng_url',  //行驶证照片
            yun_ying_zheng: 'yun_ying_zheng_url',  //运营证照片
            che_tou_zhao: 'che_tou_zhao_url',    //车头照
            //个人
            id_card_number: 'id_card_number',
            jia_shi_zheng: 'jia_shi_zheng',
            tou_xiang: 'tou_xiang',
            //公司
            logo: 'logo',
            ying_ye_zhi_zhao: 'ying_ye_zhi_zhao',
            qi_ye_shui_wu_deng_ji_zheng: 'qi_ye_shui_wu_deng_ji_zheng',
            qi_ye_zu_zhi_ji_gou_dai_ma_zheng: 'qi_ye_zu_zhi_ji_gou_dai_ma_zheng',
            qi_ye_yin_hang_kai_hu_xu_ke_zheng: 'qi_ye_yin_hang_kai_hu_xu_ke_zheng',
            quan_guo_gong_ye_chan_pin_sheng_chan_xu_ke_zheng: 'quan_guo_gong_ye_chan_pin_sheng_chan_xu_ke_zheng',
            she_bei_xing_hao_zhu_ce_ren_zheng: 'she_bei_xing_hao_zhu_ce_ren_zheng',
            ben_chang_chan_pin_zhi_jian_bao_gao: 'ben_chang_chan_pin_zhi_jian_bao_gao',
            jiao_yi_fang_chan_pin_zhi_jian_bao_gao: 'jiao_yi_fang_chan_pin_zhi_jian_bao_gao',
            di_san_fang_chan_pin_zhi_jian_bao_gao: 'di_san_fang_chan_pin_zhi_jian_bao_gao',
            qi_ye_jing_ying_cai_wu_bao_biao: 'qi_ye_jing_ying_cai_wu_bao_biao'
        },
        shareWeXinType: {
            SESSION: 0,
            TIMELINE: 1
        },
        shareContentType: {
            CheckInstalled: 'check-installed',
            Text: 'send-text',
            LocalImage: 'send-photo-local',
            RemoteImage: 'send-photo-remote',
            LinkLocalImage: 'send-link-thumb-local',
            LinkRemoteImage: 'send-link-thumb-remote',
            Music: "send-music"

        },
        shareInfo: {
            name_card: {
                title: '个人名片',
                description: '这是我的名片，快快查看吧',
                url: ''
            }
        }

    })
    /**
     * 微信分享
     */
    .service('ShareWeChat', function (iAlert, EnumType) {

        var check = function () {
            if (typeof Wechat === 'undefined') {
                iAlert.alert('插件未安装!');
                return false;
            }
        }
        var checkWexin = function () {
            Wechat.isInstalled(function (installed) {
                if (!installed) {
                    iAlert.alert('请先安装微信!');
                    return false;
                }
            })
        }


        return {
            share: function (type, contentType, args) {

                check();
                checkWexin();

                var params = {};
                params.scene = type;
                if (contentType == 'send-text') {
                    params.text = args.text;
                } else {
                    //alert(JSON.stringify(args));

                    params.message = {
                        title: args.title,
                        description: args.description,
                        mediaTagName: args.tagName,
                        messageExt: "这是第三方带的测试字段",
                        messageAction: "<action>dotalist</action>",
                        media: {},
                        thumb: args.img ? args.img : 'www/img/rsc-icon.png'
                    };
                    switch (contentType) {
                        case 'check-installed':
                            Wechat.isInstalled(function (installed) {
                                alert("Wechat installed: " + (installed ? "Yes" : "No"));
                            });
                            return true;
                        case 'send-photo-local':
                            params.message.media.type = Wechat.Type.IMAGE;
                            params.message.thumb = "www/img/rsc-icon.png";


                            break;
                        case 'send-photo-remote':
                            params.message.media.type = Wechat.Type.IMAGE;
                            //params.message.media.image = "https://cordova.apache.org/images/cordova_256.png";
                            break;

                        case 'send-link-thumb-local':
                            // params.message.thumb = "www/img/icon-76@2x.png";
                            params.message.media.type = Wechat.Type.LINK;
                            params.message.media.webpageUrl = args.url;
                            if (type == EnumType.shareWeXinType.TIMELINE) {
                                //如果是朋友圈
                                params.message.title = (args.type ? args.type : '') + args.title + params.message.description;

                            } else {
                                //发给朋友。分 标题和描述
                                params.message.description = (args.type ? args.type : '') + args.description;
                            }
                            //朋友圈显示 title
                            // params.message.title = params.message.description;

                            break;
                        case 'send-link-thumb-remote':
                            // params.message.thumb = "https://cordova.apache.org/images/cordova_256.png";
                            params.message.media.type = Wechat.Type.LINK;
                            params.message.media.webpageUrl = args.url;
                            break;

                        case 'send-music':
                            params.message.title = "一无所有";
                            params.message.description = "崔健";
                            params.message.thumb = "www/img/res3.jpg";
                            params.message.media.type = Wechat.Type.MUSIC;
                            params.message.media.musicUrl = "http://y.qq.com/i/song.html#p=7B22736F6E675F4E616D65223A22E4B880E697A0E68980E69C89222C22736F6E675F5761704C69766555524C223A22687474703A2F2F74736D7573696334382E74632E71712E636F6D2F586B30305156342F4141414130414141414E5430577532394D7A59344D7A63774D4C6735586A4C517747335A50676F47443864704151526643473444442F4E653765776B617A733D2F31303130333334372E6D34613F7569643D3233343734363930373526616D703B63743D3026616D703B636869643D30222C22736F6E675F5769666955524C223A22687474703A2F2F73747265616D31342E71716D757369632E71712E636F6D2F33303130333334372E6D7033222C226E657454797065223A2277696669222C22736F6E675F416C62756D223A22E4B880E697A0E68980E69C89222C22736F6E675F4944223A3130333334372C22736F6E675F54797065223A312C22736F6E675F53696E676572223A22E5B494E581A5222C22736F6E675F576170446F776E4C6F616455524C223A22687474703A2F2F74736D757369633132382E74632E71712E636F6D2F586C464E4D313574414141416A41414141477A4C36445039536A457A525467304E7A38774E446E752B6473483833344843756B5041576B6D48316C4A434E626F4D34394E4E7A754450444A647A7A45304F513D3D2F33303130333334372E6D70333F7569643D3233343734363930373526616D703B63743D3026616D703B636869643D3026616D703B73747265616D5F706F733D35227D";
                            params.message.media.musicDataUrl = "http://stream20.qqmusic.qq.com/32464723.mp3";
                            break;

                        case 'send-video':
                            params.message.title = "乔布斯访谈";
                            params.message.description = "饿着肚皮，傻逼着。";
                            params.message.thumb = "www/img/res7.png";
                            params.message.media.type = Wechat.Type.VIDEO;
                            params.message.media.videoUrl = "http://v.youku.com/v_show/id_XNTUxNDY1NDY4.html";
                            break;

                        case 'send-app':
                            params.message.title = "App消息";
                            params.message.description = "这种消息只有App自己才能理解，由App指定打开方式！";
                            params.message.thumb = "www/img/res2.jpg";
                            params.message.media.type = Wechat.Type.APP;
                            params.message.media.extInfo = "<xml>extend info</xml>";
                            params.message.media.url = "http://weixin.qq.com";
                            break;

                        case 'send-nongif':
                            params.message.thumb = "www/img/res5thumb.png";
                            params.message.media.type = Wechat.Type.EMOTION;
                            params.message.media.emotion = "www/img/res5.jpg";
                            break;

                        case 'send-gif':
                            params.message.thumb = "www/img/res6thumb.png";
                            params.message.media.type = Wechat.Type.EMOTION;
                            params.message.media.emotion = "www/img/res6.gif";
                            break;

                        case 'send-file':
                            params.message.title = "iphone4.pdf";
                            params.message.description = "Pro CoreData";
                            params.message.thumb = "www/img/res2.jpg";
                            params.message.media.type = Wechat.Type.FILE;
                            params.message.media.file = "www/resources/iphone4.pdf";
                            break;

                        case 'auth':
                            Wechat.auth("snsapi_userinfo", function (response) {
                                // you may use response.code to get the access token.
                                //alert(JSON.stringify(response));
                            }, function (reason) {
                                alert("Failed: " + reason);
                            });
                            return true;

                        default:
                            alert(id + " can not be recognized!");
                            return false;
                    }
                    console.log('分享微信插件', angular.toJson(params));


                }
                // alert(JSON.stringify(params));

                Wechat.share(params, function () {
                    iAlert.alert('分享成功!');
                }, function (reason) {
                    // $log.debug('分享参数',params);
                    iAlert.alert('分享失败!' + reason)
                });


            }
        }
    })
    /**
     * 手机端选择图片用。
     */
    .service('PictureSelect', function ($q, $timeout, $cordovaCamera, $ionicActionSheet, $log, $ionicLoading, $cordovaImagePicker) {
        //选择相册文件
        var hideSheet = null;
        var pickImage = function (cb, resize) {
            if (resize) {
                var options = {
                    quality: 50,
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 700,
                    targetHeight: 700,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: true,
                    correctOrientation: true
                };

            } else {
                var options = {
                    maximumImagesCount: 1,
                    width: 800,
                    height: 800,
                    quality: 80
                };
            }



            $cordovaImagePicker.getPictures(options)
                .then(function (results) {
                    
                    if (!!resize) {
                        if (ionic.Platform.isAndroid()) {
                            plugins.crop.promise(results[0], options)
                                .then(function success(newPath) {
                                    results[0] = newPath
                                })
                                .catch(function fail(error) {
                                    $log.error('选取照片出错', error)
                                })
                        } else {
                      plugins.crop.promise(results[0], options)
                      .then(function success(newPath) {
                            results[0] = newPath
                            })
                      .catch(function fail(error) {
                             $log.error('选取照片出错', error)
                             })
                        }
                    }
                    //vm.imgUrl = results[0];
                    if (results && results.length > 0) {
                        cb(results[0]);
                        //uploadImg(results[0]);
                    } else {
                        cb('error');
                    }
                    hide();
                }, function (error) {
                    $log.error('选取照片出错', error)
                });
        };

        //隐藏选择框
        var hide = function () {
            if (hideSheet) {
                hideSheet();
            }
        }

        //调用相机拍照
        var takePhoto = function (cb) {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                //destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA
                //sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM
            };

            //udpate camera image directive
            $cordovaCamera.getPicture(options).then(function (imageURL) {
                //vm.acc_photo_url = "data:image/jpeg;base64," + imageData;
                if (imageURL) {
                    //$cordovaCamera.cleanup()
                    window.alert(imageURL);
                    cb(imageURL);
                } else {
                    //$cordovaCamera.cleanup()
                    window.alert("拍照失败");
                    $log.error('拍照失败');
                    cb('error');
                }

            }, function (err) {
                window.alert("拍照失败");
                $ionicLoading.show({
                    template: '拍照失败...'
                });
                cb('error');
            });

        };
        return {
            selectOrTakePhoto: function (cb, resize) {
                var buttons = [{ text: '<i class="text-center">拍照</i>' },
                { text: '<i class="text-center">从手机相册选择</i>' }];
                if (ionic.Platform.isAndroid()) {
                    buttons.push({ text: '<i class="text-center">取消</i>' })
                }
                hideSheet = $ionicActionSheet.show({
                    buttons: buttons,
                    // destructiveText: 'Delete',
                    // titleText: '上传图片',
                    cancelText: '取消',
                    cancel: function () {
                        // add cancel code..
                        hideSheet();
                    },
                    buttonClicked: function (index) {

                        switch (index) {
                            case 0:
                                if (resize) {
                                    var options = {
                                        quality: 50,
                                        destinationType: Camera.DestinationType.DATA_URI,
                                        sourceType: Camera.PictureSourceType.CAMERA,
                                        allowEdit: true,
                                        encodingType: Camera.EncodingType.JPEG,
                                        targetWidth: 700,
                                        targetHeight: 700,
                                        popoverOptions: CameraPopoverOptions,
                                        saveToPhotoAlbum: true,
                                        correctOrientation: true
                                    };
                                } else {
                                    var options = {
                                        quality: 80,
                                        destinationType: Camera.DestinationType.DATA_URI,
                                        sourceType: Camera.PictureSourceType.CAMERA,
                                        // saveToPhotoAlbum: true,//bug 789 华为拍照后无响应。zhoudd
                                        targetWidth: 1024,
                                        targetHeight: 768
                                    }

                                }

                                $cordovaCamera.getPicture(options).then(function (imageURI) {

                                    cb(imageURI);
                                    hide();
                                    $cordovaCamera.cleanup();

                                    //$scope.imgUri = imageURI;
                                    // var image = document.getElementById('myImage');
                                    // image.src = imageURI;
                                }, function (err) {
                                    // error
                                    cb('error');
                                });
                                break;
                            case 1:
                                pickImage(cb, resize);
                                break;
                            case 2:
                                hide();
                                break;
                            default:
                                break;
                        }
                    }
                });

                // For example's sake, hide the sheet after two seconds
                // $timeout(function () {
                //     hideSheet();
                // }, 2000);

            },

            hideSheet: function () {
                $cordovaCamera.cleanup();
                hide();
            },
            // 修改头像用含裁剪
            selectOrTakeAvatar: function (cb, resize) {
                return this.selectOrTakePhoto(cb, resize)
            }
        }


    })

    /** 
    * 小视频 
    */
    .service('VideoSelect', function () {
        function videoCaptureSuccess(success, err) {
            // Wrap this below in a ~100 ms timeout on Android if 
            // you just recorded the video using the capture plugin. 
            // For some reason it is not available immediately in the file system. 
            return function (mediaFiles) {
                var file = mediaFiles[0];
                var videoFileName = 'video-name-here'; // I suggest a uuid 

                VideoEditor.transcodeVideo(
                    videoTranscodeSuccess(success),
                    videoTranscodeError(err),
                    {
                        fileUri: file.fullPath,
                        outputFileName: videoFileName,
                        outputFileType: VideoEditorOptions.OutputFileType.MPEG4,
                        optimizeForNetworkUse: VideoEditorOptions.OptimizeForNetworkUse.YES,
                        saveToLibrary: true,
                        maintainAspectRatio: true,
                        width: 640,
                        height: 640,
                        videoBitrate: 1000000, // 1 megabit 
                        audioChannels: 2,
                        audioSampleRate: 44100,
                        audioBitrate: 128000, // 128 kilobits 
                        // progress: function(info) { 
                        //     console.log('transcodeVideo progress callback, info: ' + info); 
                        // } 
                    }
                );
            }
        }

        function videoTranscodeSuccess(success) {
            return function (result) {
                console.log('videoTranscodeSuccess, result: ' + result);
                success(result)
            }
        }

        function videoTranscodeError(err) {
            return function (result) {
                console.log('videoTranscodeError, err: ' + result);
                err(result)
            }
        }

        function videoCaptureError(err) {
            return function (result) {
                console.log('videoCaptureError:' + result)
                err(result)
            }
        }

        return {
            getVideo: function (time, success, err) {
                return function () {
                    navigator.device.capture.captureVideo(
                        videoCaptureSuccess(success, err),
                        videoCaptureError(err),
                        {
                            limit: 1,
                            duration: time
                        }
                    )
                }
            }
        }
    })

    /**
     * 文件上传
     */
    .service('FileUpload', function ($q, $ionicLoading, PictureSelect, $cordovaFileTransfer, Storage, VideoSelect, $log) {

        var uploadImg = function (fileUrl, options) {

            var opt = new FileUploadOptions();
            opt.fileKey = "file";
            opt.fileName = fileUrl.substr(fileUrl.lastIndexOf('/') + 1);
            opt.mimeType = "text/plain";
            opt.headers = options.headers ? options.headers : { 'x-access-token': Storage.get('userInfo').token, "Content-Type": undefined };
            opt.timeout = 10000;
            opt.params = options.params ? options.params : null;
            return $cordovaFileTransfer.upload(options.url, fileUrl, opt);
        };

        var resizeImg = function (fileUrl, options, cb) {
            var opt = {
                uri: fileUrl,
                folderName: "Protonet Messenger",
                quality: 90,
                width: 700,
                height: 700
            };
            return window.ImageResizer.resize(opt, function (url) {
                cb(uploadImg(url, options));
            }, function (err) {
                console.log(err)
            })
        }
        return {
            upload: function (type, options, cb) {
                switch (type) {
                    case 'image':
                        PictureSelect.selectOrTakePhoto(function (imgUrl) {

                            if (imgUrl != 'error') {
                                console.log(imgUrl)

                                cb(uploadImg(imgUrl, options));
                            } else {
                                $log.error('未选择图片!', imgUrl);
                            }
                        })
                        break;
                    case 'resizeImg':
                        PictureSelect.selectOrTakeAvatar(function (imgUrl) {
                            if (imgUrl != 'error') {
                                console.log(imgUrl)
                                if (ionic.Platform.isAndroid()) {
                                    cb(uploadImg(imgUrl, options));
                                } else {

                                    cb(uploadImg(imgUrl, options));
                                }

                            } else {
                                $log.error('未选择图片!', imgUrl);
                            }
                        }, true)
                        break;
                    case 'file':

                        break;
                    default:
                        break;
                }
            },

            video: function (time, options, cb) {
                console.log(arguments)
                VideoSelect.getVideo(time,
                    function (success) {
                        $ionicLoading.show({
                            template: '小视频上传中...'
                        });
                        cb(uploadImg(success, options));
                    },
                    function (error) {
                        $log.error(error);
                    })()
            }
        }
    })
    /**
     * 联系人读取
     */
    .service('ContactsHelp', function ($cordovaContacts, $filter, $log, $ionicPlatform) {
        return {
            selectContacts: function (cb) {
                $cordovaContacts.pickContact().then(function (value) {
                    $log.debug('通讯录选择', angular.toJson(value))

                    cb(value);
                });
            },
            selectNameAndPhone: function (cb) {
                $cordovaContacts.pickContact().then(function (value) {
                    var obj = {
                        name: '',
                        phone: ''
                    }
                    if (!value.displayName) {
                        if (value.name && value.name.formatted) {
                            obj.name = value.name.formatted
                        }
                    } else {
                        obj.name = value.displayName;
                    }

                    var phone = _.findWhere(value.phoneNumbers, {
                        type: 'mobile'
                    })
                    $log.debug('电话号码', phone)
                    if (phone) {
                        // obj.phone = phone.value.replace('+86', '').replace(' ', '').replace('-', '');
                        obj.phone = $filter('formatPhone')(phone.value);
                    }
                    //window.alert(angular.toJson(value))
                    $log.debug('通讯录选择', angular.toJson(obj));
                    cb(obj);
                    // var company = _.findWhere(value.organizations, {
                    //     type: "custom"
                    // });
                    // if (company) {
                    //     $scope.contact.comp_target = company.name;
                    // }
                    // selectNameAndPhone(function(u){
                    //     arry.push(u)
                    // })
                })

            },
            getAll: function () {
                var opts = {
                    // filter: '',                                        //search options
                    fields: null,                   // These are the fields to search for 'bob'.
                    // desiredFields: ["id","displayName","phoneNumbers"]   //return fields.
                };

                if (ionic.Platform.isAndroid()) {
                    // opts.hasPhoneNumber = true;         //hasPhoneNumber only works for android.
                };

                return $cordovaContacts.find(opts);
            }

        }

    })
    /**
     * 分享功能弹窗
     */
    .service('ShareHelp', function (iAlert, $ionicModal, EnumType, ShareWeChat, $state, $cordovaClipboard, SmsHelp) {


        return {
            initShare: function ($scope, shareInfo) {
                var alertQR = function () {
                    iAlert.alert('<img class="center-block" src="./img/QR.png"></img><h5 class="text-center">扫描二维码下载app</h5>')
                }
                $scope.shareOpts = shareInfo.opts;
                $scope.copyFailed = function (copy) {
                    if (!ionic.Platform.isWebView()) {
                        window.prompt('请请选中文字，手动进行复制!', copy);
                    }
                };

                //手机端copy
                $scope.copyForPhone = function () {
                    $cordovaClipboard
                        .copy($scope.shareInfo.msg.title + $scope.shareInfo.msg.description + $scope.shareInfo.msg.url)
                        .then(function () {
                            // success
                            iAlert.alert(($scope.shareInfo.opts.copy_msg || (($scope.shareInfo.msg.type ? $scope.shareInfo.msg.type : '') + $scope.shareInfo.msg.title + $scope.shareInfo.msg.description)) + '复制成功!');


                            // window.alert(($scope.shareInfo.opts.copy_msg || $scope.shareInfo.msg.description) + '复制成功!');
                        }, function () {
                            // error
                            iAlert.alert('复制失败!');
                        });
                }
                //复制成功
                $scope.copySuccess = function () {
                    iAlert.alert(($scope.shareInfo.opts.copy_msg || (($scope.shareInfo.msg.type ? $scope.shareInfo.msg.type : '') + $scope.shareInfo.msg.title + $scope.shareInfo.msg.description)), function () {
                        $scope.modal.hide();
                    }, '复制成功')
                }



                //modal
                $ionicModal.fromTemplateUrl('./templates/common/share.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    backdropClickToClose: true,
                    hardwareBackButtonClose: true
                }).then(function (modal) {
                    $scope.modal = modal;
                });

                $scope.share = function () {
                    $scope.modal && $scope.modal.show();
                };

                $scope.closeModalForShare = function () {
                    $scope.modal && $scope.modal.hide();
                };
                //Cleanup the modal when we're done with it!
                $scope.$on('$destroy', function () {
                    $scope.modal && $scope.modal.remove();
                });
                // Execute action on hide modal
                $scope.$on('modal.hidden', function () {
                    // Execute action
                });
                // Execute action on remove modal
                $scope.$on('modal.removed', function () {
                    // Execute action
                });


                $scope.shared = function (type) {
                    switch (type) {
                        case 'sms':
                            if (ionic.Platform.isWebView()) {
                                if ($scope.shareInfo.opts.params.origin == 'newMessage') {
                                    SmsHelp.send($scope.inivitePhoneArr, $scope.shareInfo.msg.description + " " + $scope.shareInfo.msg.url)
                                } else {
                                    $state.go('tab.shareSMS', shareInfo.params.route);
                                }

                            } else {
                                alertQR();
                            }

                            // if (ionic.Platform.isWebView()) {
                            //     $scope.modal.hide();
                            // } else {
                            //     iAlert.alert('jjj')
                            // }
                            break;
                        case 'wechat':
                            if (ionic.Platform.isWebView()) {
                                ShareWeChat.share(EnumType.shareWeXinType.TIMELINE, EnumType.shareContentType.LinkLocalImage, shareInfo.msg)
                            } else {
                                alertQR();
                            }
                            break;
                        case 'wechat1':
                            if (ionic.Platform.isWebView()) {
                                ShareWeChat.share(EnumType.shareWeXinType.SESSION, EnumType.shareContentType.LinkLocalImage, shareInfo.msg)

                            } else {
                                alertQR();
                            }
                            break;
                        default:
                            ;
                    }

                };


                // $scope.share();
            }
        }
    })

    /**
     * 发送短信
     *
     */
    .service('SmsHelp', function ($cordovaSms) {
        /**
         * 要发送的电话号码，和短信内容
         */
        var send = function (phoneNumber, textMessage) {
            var options = {
                replaceLineBreaks: false, // true to replace \n by a new line, false by default
                android: {
                    intent: 'INTENT'  // send SMS with the native android SMS messaging
                    // intent: '' // send SMS without open any other app
                }
            };

            return $cordovaSms.send(phoneNumber, textMessage, options);
            // .then(function () {
            //     // Success! SMS was sent
            //     window.alert('发送成功·')
            // }, function (error) {
            //     // An error occurred
            //     window.alert(error)
            // });
        }

        return {
            send: send
        }
    })

    .factory('fileReader', ['$q', '$log', function ($q, $log) {
        var onLoad = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result)
                })
            }
        };
        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result)
                })
            }
        };
        var getReader = function (deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            return reader

        };
        var readAsDataURL = function (file, scope) {
            var deferred = $q.defer()
            var reader = getReader(deferred, scope);
            reader.readAsDataURL(file)
            return deferred.promise
        };
        return {
            readAsDataUrl: readAsDataURL
        }

    }])
