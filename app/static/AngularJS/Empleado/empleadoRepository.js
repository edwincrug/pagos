var empleadoUrl = global_settings.urlCORS + '/api/empleadoapi/';

registrationModule.factory('empleadoRepository', function ($http) {
    return {
        getFichaEmpleado: function (id) {
            return $http({
			  method: 'GET',
			  url: empleadoUrl,
			  params: { id: '1|' + id }
			});
            // $http.get(empleadoUrl + );
        },
        update: function (id) {
            return $http.post(empleadoUrl + '2|' + id);

        }
    };
});