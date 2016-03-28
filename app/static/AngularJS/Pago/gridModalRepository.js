var pagoUrl = global_settings.urlCORS + '/api/pagoapi/';

registrationModule.factory('gridModalRepository', function ($http) {
    return {
        getDatos: function (id) {
        return $http({
    			  method: 'GET',
    			  url: pagoUrl,
    			  params: { id: '1|' + id }
			   });           
        },

        getEmpresas: function (id) {
        return $http({
                  method: 'GET',
                  url: pagoUrl,
                  params: { id: '9|' + id }
               });           
        },        
        getTotalxEmpresa: function (id) {
        return $http({
                  method: 'GET',
                  url: pagoUrl,
                  params: { id: '10|' + id }
               });           
        },
        getEncabezado: function (id) {
            return $http({
              method: 'GET',
              url: pagoUrl,
              params: { id: '2|' + id }
            });            
        }
    };
});