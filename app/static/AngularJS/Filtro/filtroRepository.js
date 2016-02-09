var filtroUrl = global_settings.urlCORS + '/api/filtroapi/';

registrationModule.factory('filtroRepository', function ($http) {
    return {
        getEmpresas: function(idEmpleado){
            return $http.get(filtroUrl + '1|' + idEmpleado);
         },
        getSucursales: function(idEmpleado, idEmpresa){
            return $http.get(filtroUrl + '2|' + idEmpleado + '|' + idEmpresa);
        },
        getDepartamentos: function(idEmpleado, idEmpresa, idSucursal){
            return $http.get(filtroUrl + '3|' + idEmpleado + '|' + idEmpresa + '|' + idSucursal);
        },
        getTipoOrden: function(){
            return $http.get(filtroUrl + '4|');
        },
        getUsuarios: function(){
            return $http.get(filtroUrl + '5|');
        }
    };
});

//Esta es una prueba