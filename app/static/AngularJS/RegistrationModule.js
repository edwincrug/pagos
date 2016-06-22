var registrationModule = angular.module("registrationModule", ['ui.sortable', 'ui.sortable.multiselection', 'ngAnimate', 'ngTouch', 'ui.grid', 'ui.grid.grouping', 'ui.grid.edit', 'ui.grid.selection', 'ui.grid.cellNav', "ngRoute", "cgBusy", "ui.bootstrap", "LocalStorageModule"])

.config(function ($routeProvider, $locationProvider) {

    $routeProvider.when('/', {
        templateUrl: '/AngularJS/Templates/Pago.html',
        controller: 'pagoController'
    });

    $routeProvider.when('/agrupador', {
        templateUrl: '/AngularJS/Templates/Agrupador.html',
        controller: 'agrupadorController'
    });

    $routeProvider.when('/cuentas', {
        templateUrl: '/AngularJS/Templates/CuentasProveedor.html',
        controller: 'CuentasProveedorController'
    });

    $routeProvider.when('/loteAdmin', {
        templateUrl: '/AngularJS/Templates/LotesAdmin.html',
        controller: 'lotesadminController'
    });
    $locationProvider.html5Mode(true);
});

registrationModule.run(function ($rootScope) {
    $rootScope.var = "full";

});

registrationModule.directive('resize', function ($window) {
    return function (scope, element) {
        var w = angular.element($window);
        var changeHeight = function () {
            element.css('height', (w.height() - 20) + 'px');
        };
        w.bind('resize', function () {
            changeHeight(); // when window size gets changed          	 
        });
        changeHeight(); // when page loads          
    }
});
