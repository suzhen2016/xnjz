angular.module('rsc.app.common.account', [
    'angular-jwt',
    'rsc.account.router',
    'rsc.common.account.service',
    'rsc.controllers.account',
    'rsc.common.account.filters'
])