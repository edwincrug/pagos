var pagoUrl = global_settings.urlCORS + '/api/pagoapi/';

registrationModule.factory('pagoRepository', function ($http) {
    return {
        getEncabezado: function (id) {
            return $http({
			  method: 'GET',
			  url: pagoUrl,
			  params: { id: '1|' + id }
			});
            // $http.get(empleadoUrl + );
        },
        update: function (id) {
            return $http.post(pagoUrl + '2|' + id);

        }
    };
});