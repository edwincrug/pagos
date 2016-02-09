var parametroUrl = global_settings.urlCORS + '/api/escalamientoapi/';

registrationModule.factory('parametroRepository', function ($http) {
    return {
        getEscalamiento: function (producto, usuario, empresa, sucursal, departamento, tipo) {
            return $http.get(parametroUrl + '1|' + producto + '|' + usuario + '|' + empresa + '|' + sucursal + '|' + departamento + '|' + tipo);
        },
        getAprobadores: function (empresa, sucursal, departamento, tipo) {
            return $http.get(parametroUrl + '3|' + empresa + '|' + sucursal + '|' + departamento + '|' + tipo);
        },
        update: function (id) {
            return $http.post(parametroUrl + '2|' + id);
        }
    };
});