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
        setDatos: function(id, idEmpleado,idPadre,ingresos, transfer,caja,cobrar,total,operacion){
            //var data = JSON.stringify(id); 
            return $http({
                url: pagoUrl                
                ,method: 'POST'                
                //,params: { id: '1|' + idEmpleado + '|' + idPadre + '|' + JSON.stringify(ingresos) + '|' + JSON.stringify(transfer) + '|' + caja + '|' + cobrar + '|' + JSON.stringify(total)}
                //,params: { id: '9|' + idEmpleado + '|' + idPadre + '|' + ingresos + '|' + transfer + '|' + caja + '|' + cobrar + '|' + total}
                ,params: { id: '1|' + idEmpleado + '|' + idPadre + '|' + caja + '|' + cobrar + '|' + operacion}
                ,data:JSON.stringify(id) + '|'+ ingresos + '|' +transfer+ '|' +total
                //,data:[JSON.stringify(id),ingresos,transfer,total]
                //dataType: "json",                
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
        getPagosPadre: function (idEmpresa, idEmpleado, nombreLote, idLote) {
            return $http({
              method: 'GET',
              url: pagoUrl,
              params: { id: '6|' + idEmpresa + '|' + idEmpleado + '|' + nombreLote + '|' + idLote}
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
        getLotes: function (idEmpresa,idEmpleado, borraLote, idLote) {
            return $http({
              method: 'GET',
              url: pagoUrl,
              params: { id: '13|' + idEmpresa + '|' + idEmpleado + '|' + borraLote + '|' + idLote}
            });            
        },
        getTransferencias: function (idLote) {
            return $http({
              method: 'GET',
              url: pagoUrl,
              params: { id: '14|' + idLote  }
            });            
        },
        getOtrosIngresos: function (idLote) {
            return $http({
              method: 'GET',
              url: pagoUrl,
              params: { id: '15|' + idLote }
            });
        },

        //FAL 15032016 manda el json para generar el archivo
         setArchivo: function(id,dataArchivo,lotePadre)
        {
            
            return $http({
                url: pagoUrl,
                method: "POST",
                params: { id: '4|' + id + '|' + lotePadre},
                //dataType: "json",
                data:JSON.stringify(dataArchivo)
               
            });            
        },//FAL
        //LQMA
        setSolAprobacion: function(idProc,nodo,idEmpresa,idLote)
        {            
            return $http({
                url: pagoUrl,
                method: "POST",
                params: { id: '5|' + idProc + '|' + nodo  + '|' + idEmpresa + '|' + idLote}
                //dataType: "json",
                //data:JSON.stringify(dataArchivo)
               
            });            
        }
        ,
        //LQMA
        setAprobacion: function(idProc,nodo,idEmpresa,idLote,idUsuario)
        {            
            return $http({
                url: pagoUrl,
                method: "POST",
                params: { id: '6|' + idProc + '|' + nodo  + '|' + idEmpresa + '|' + idLote + '|' + idUsuario}
            });            
        }//FAL

    };
});