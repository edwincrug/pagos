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

        },
        setDatos: function(id, idEmpleado,idPadre){
            //var data = JSON.stringify(id); 
            return $http({
                url: pagoUrl,
                method: "POST",
                params: { id: '1|' + idEmpleado + '|' + idPadre },
                //dataType: "json",
                data:JSON.stringify(id)
                //traditional: true,
                //contentType: 'application/json'
                //params: { id: '1|9'}
                //params: {id}
            });            
        },//LQMA
        getDatosAprob: function (id) {
            return $http({
              method: 'GET',
              url: pagoUrl,
              params: { id: '5|' + id }
            });
           
        },
        getPagosPadre: function (idEmpleado) {
            return $http({
              method: 'GET',
              url: pagoUrl,
              params: { id: '6|' + idEmpleado }
            });
            
        }
    };
});