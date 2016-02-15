var registrationModule = angular.module("registrationModule", ["ngRoute", "cgBusy", "ui.bootstrap", "LocalStorageModule"])
.config(function ($routeProvider, $locationProvider) {

    $routeProvider.when('/', {
        templateUrl: '/AngularJS/Templates/Pago.html',
        controller: 'pagoController'
    });


    $locationProvider.html5Mode(true);
});

registrationModule.run(function ($rootScope) {
    $rootScope.var = "full";

})
