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
            
        },
        update: function (id) {
            return $http.post(pagoUrl + '2|' + id);

        },
        setDatos: function(id, idEmpleado,idPadre,ingresos, transfer,caja,cobrar,total){
            //var data = JSON.stringify(id); 
            return $http({
                url: pagoUrl,
                method: "POST",
                params: { id: '1|' + idEmpleado + '|' + idPadre + '|' + JSON.stringify(ingresos) + '|' + JSON.stringify(transfer) + '|' + caja + '|' + cobrar + '|' + JSON.stringify(total)},
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
            
        },
        getIngresos: function (idEmpresa,idLote) {
            return $http({
              method: 'GET',
              url: pagoUrl,
              params: { id: '11|' + idEmpresa + '|' + idLote }
            });
            
        },
        getEgresos: function (idEmpresa,idLote) {
            return $http({
              method: 'GET',
              url: pagoUrl,
              params: { id: '12|' + idEmpresa + '|' + idLote }
            });            
        },
        getLotes: function (idEmpresa,idEmpleado) {
            return $http({
              method: 'GET',
              url: pagoUrl,
              params: { id: '13|' + idEmpresa + '|' + idEmpleado }
            });            
        }
    };
});