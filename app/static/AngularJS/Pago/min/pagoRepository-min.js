var pagoUrl=global_settings.urlCORS+"/api/pagoapi/";registrationModule.factory("pagoRepository",function(o){return{get:function(t){return o.get(nodoUrl+"0|"+t)},update:function(t){return o.post(nodoUrl+"2|"+t)}}});