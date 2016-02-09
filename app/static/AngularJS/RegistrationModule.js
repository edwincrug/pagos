var registrationModule = angular.module("registrationModule", ["ngRoute", "ngGrid", "cgBusy", "ui.bootstrap", "LocalStorageModule"])
.config(function ($routeProvider, $locationProvider) {

    $routeProvider.when('/', {
        templateUrl: '/AngularJS/Templates/Parametro.html',
        controller: 'parametroController'
    });

    $locationProvider.html5Mode(true);
});

registrationModule.run(function ($rootScope) {
    $rootScope.empleado = "";
    $rootScope.cliente = "";
})
