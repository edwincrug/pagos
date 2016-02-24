var pagoUrl = global_settings.urlCORS + '/api/pagoapi/';

registrationModule.factory('agrupadorRepository', function ($http) {
    return {
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