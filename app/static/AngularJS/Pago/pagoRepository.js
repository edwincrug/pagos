var pagoUrl = global_settings.urlCORS + '/api/pagoapi/';

registrationModule.factory('pagoRepository', function ($http) {
    return {
        getDatos: function (id) {
            return $http({
			  method: 'GET',
			  url: pagoUrl,
			  params: { id: '1|' + id }
			});
           
        },
        getEncabezado: function (id) {
            return $http({
              method: 'GET',
              url: pagoUrl,
              params: { id: '2|' + id }
            });
            
        },
        update: function (id) {
            return $http.post(pagoUrl + '2|' + id);

        }
    };
});