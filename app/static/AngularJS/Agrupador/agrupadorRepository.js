var pagoUrl = global_settings.urlCORS + '/api/pagoapi/';

registrationModule.factory('agrupadorRepository', function ($http) {
    return {
         getAgrupadores: function (id) {
        return $http({
            method: 'GET',
            url: pagoUrl,
            params: { id: '7|' + id }
         });           
        },

         getProvedores: function (id) {
        return $http({
            method: 'GET',
            url: pagoUrl,
            params: { id: '8|' + id }
         });           
        },

        update: function (id) {
            return $http.post(pagoUrl + '2|' + id);

        },

        setDatos: function(id,Agrupadores)
        {
            
            return $http({
                url: pagoUrl,
                method: "POST",
                params: { id: '2|' + id},
                //dataType: "json",
                data:JSON.stringify(Agrupadores)
               
            });            
        },//FAL
    };
});