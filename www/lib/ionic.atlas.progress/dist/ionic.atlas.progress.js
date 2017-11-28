
(function(angular) {
    'use strict';

    angular.module('atlasProgress', [])
        .controller('AtlasProgressCtrl', ['$scope', function($scope) {

            function move() {
                var width = 0;
                var direction = 1; // 1 = plus, 2 = minus
                var elemLeft = document.getElementById("atlas-left");
                var elemRight = document.getElementById("atlas-right");
                elemLeft.style.width = width + '%';
                elemRight.style.width = width + '%';
                elemLeft.style.cssFloat = 'right';

                setColor(elemLeft, elemRight);
                var speed = getSpeed();

                var id = setInterval(frame, speed);

                function frame() {
                    if (width === 100 && direction === 1) {
                        setTimeout(function() {
                            direction = 2;
                            elemLeft.style.cssFloat = 'left';
                            elemRight.style.cssFloat = 'right';
                        }, 400);
                        return;
                    }
                    if (width === 0 && direction === 2) {
                        setTimeout(function() {
                            direction = 1;
                            elemLeft.style.cssFloat = 'right';
                            elemRight.style.cssFloat = 'left';
                        }, 650);
                        return;
                    }
                    if (width < 100 && direction === 1) {
                        width = width + 2;
                        elemLeft.style.width = width + '%';
                        elemRight.style.width = width + '%';
                        return;
                    }
                    if (width > 0 && direction === 2) {
                        width = width - 2;
                        elemRight.style.width = width + '%';
                        elemLeft.style.width = width + '%';
                        return;
                    }
                }
            }

            function setColor(elemLeft, elemRight) {
                var color = $scope.progressColor;
                if (color == undefined)
                    return;

                elemLeft.style.backgroundColor = color;
                elemRight.style.backgroundColor = color;
            }

            function getSpeed() {
                switch ($scope.progressSpeed) {
                    case 3:
                        return 10;
                    case 1:
                        return 23;
                    case 2:
                    default:
                        return 15;
                }
            }

            move();
        }])
        .directive('atlasProgress', function() {
            return {
                restrict: 'E',
                scope: {
                    progressColor: '=color',
                    progressSpeed: '=speed'
                },
                template: '<div id="atlas-progress-wrapper" ng-controller="AtlasProgressCtrl">' +
                '<div id="atlas-progress-1">' +
                '<div class="atlas-element" id="atlas-left"></div>' +
                '</div>' +
                '<div id="atlas-progress-2">' +
                '<div class="atlas-element" id="atlas-right"></div>' +
                '</div>' +
                '</div>'
            };
        });
})(angular);