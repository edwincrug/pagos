var registrationModule = angular.module("registrationModule", ['ui.sortable','ui.sortable.multiselection','ngAnimate','ngTouch', 'ui.grid', 'ui.grid.grouping', 'ui.grid.edit', 'ui.grid.selection','ui.grid.cellNav',"ngRoute", "cgBusy", "ui.bootstrap", "LocalStorageModule"])

.config(function ($routeProvider, $locationProvider) {

     $routeProvider.when('/inicio', {
         templateUrl: '/AngularJS/Templates/Pago.html',
         controller: 'pagoController'
     });

	$routeProvider.when('/', {
        templateUrl: '/AngularJS/Templates/Agrupador.html',
        controller: 'agrupadorController'
    });

    $routeProvider.when('/agrupar', {
        templateUrl: '/AngularJS/Templates/CuentasProveedor.html',
        controller: 'CuentasProveedorController'
    });
    $locationProvider.html5Mode(true);
});

registrationModule.run(function ($rootScope) {
    $rootScope.var = "full";

})
