var registrationModule = angular.module("registrationModule", ['ngAnimate','ngTouch', 'ui.grid', 'ui.grid.grouping', 'ui.grid.edit', 'ui.grid.selection','ui.grid.cellNav',"ngRoute", "cgBusy", "ui.bootstrap", "LocalStorageModule"])
.config(function ($routeProvider, $locationProvider) {

    $routeProvider.when('/', {
        templateUrl: '/AngularJS/Templates/Pago.html',
        controller: 'pagoController'
    });

	$routeProvider.when('/agrupador', {
        templateUrl: '/AngularJS/Templates/Agrupador.html',
        controller: 'agrupadorController'
    });


    $locationProvider.html5Mode(true);
});

registrationModule.run(function ($rootScope) {
    $rootScope.var = "full";

})
