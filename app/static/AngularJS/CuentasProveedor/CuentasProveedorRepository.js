var pagoUrl = global_settings.urlCORS + '/api/pagoapi/';

registrationModule.factory('CuentasProveedorRepository', function ($http) {
    return {
         getCuentas: function (id, lote) {
        return $http({
            method: 'GET',
            url: pagoUrl,
            params: { id: '11|' + id + '|' + lote}
         });           
        },

         getProvedoresCuenta: function (id) {
        return $http({
            method: 'GET',
            url: pagoUrl,
            params: { id: '12|' + id }
         });           
        },

        update: function (id) {
            return $http.post(pagoUrl + '2|' + id);

        }
    };
});