registrationModule.controller("agrupadorController", function ($scope, uiSortableMultiSelectionMethods, alertFactory, agrupadorRepository) {

$scope.init = function () {
      $scope.llenaAgrupadores();
      $.fn.bootstrapSwitch.defaults.offColor = 'info';
       $.fn.bootstrapSwitch.defaults.onText = 'Todos';
       $.fn.bootstrapSwitch.defaults.offText = 'Pagables';
       $('.switch-checkbox').bootstrapSwitch();   
    };

 //parametros en duro
    $scope.idEmpleado = 1;
    $scope.idEmpresa = 4;

$scope.llenaAgrupadores = function () {
        
    $scope.agrupadores = [
        { titulo: 'Lista 1', lista: [ 
                                    { id: 1, nombre: 'Prov 1' },
                                    { id: 2, nombre: 'Prov 2' } ] },
        { titulo: 'Lista 2', lista: null },
        { titulo: 'Lista 3', lista: [ 
                                    { id: 5, nombre: 'Prov 5' },
                                    { id: 6, nombre: 'Prov 6' } ] }
    ];

    setTimeout(function(){ 

        $scope.agrupadores[1].lista = [ 
                                    { id: 3, nombre: 'Prov 3' },
                                    { id: 4, nombre: 'Prov 4' } ];


        $scope.$apply() 

    }, 2000);

        //Llamada a repository para obtener data
        // agrupadorRepository.getAgrupadores($scope.idEmpresa)
        //     .then(function successCallback(response) 
        //     {
        //         $scope.model = response.data;
                
        //         var tmpList = [];
        //         for (var j = 0; j <= (($scope.model.length)-1); j++) 
        //             {
        //                 tmpList.push
        //                 ({
        //                     pca_idAgrupador: $scope.model[j].pca_idAgrupador,
        //                     pca_idEmpresa: $scope.model[j].pca_idEmpresa,
        //                     pca_nombre: $scope.model[j].pca_nombre,
        //                     pca_descripcion: $scope.model[j].pca_descripcion,
        //                     pca_orden: $scope.model[j].pca_orden,
        //                     pca_estatus: $scope.model[j].pca_estatus,
        //                     lista: {[],[]}
        //                  });
        //             }     
        //             $scope.model = tmpList
        //             $scope.llenaProvedores();
        //     }

        // , function errorCallback(response) {
               
        //         alertFactory.error('Error al obtener los datos del agrupador.');
        //     }
        // );

    };    

$scope.llenaProvedores = function () {
        
        //Llamada a repository para obtener data
        agrupadorRepository.getProvedores($scope.idEmpresa)
            .then(function successCallback(response) 
            {
                $scope.proveedores = response.data;
                

                var tmpList = [];
                var tmpprov = [];
                for (var j = 0; j <= (($scope.proveedores.length)-1); j++) 
                    {
                        tmpprov.push
                        ({
                            text: $scope.proveedores[j].nomProveedor + '('+ $scope.proveedores[j].idProveedor + ')',
                            value: j + '|' + $scope.proveedores[j].idProveedor
                         });
                    }       

                tmpList[0] = tmpprov;

               $scope.list1 = [];
               $scope.list2 = [];
               $scope.list3 = [];
               $scope.list4 = [];
               $scope.list5 = tmpList[0];
     
               $scope.rawScreens = [$scope.list1,$scope.list2,$scope.list3,$scope.list4,$scope.list5]
            }

        , function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                alertFactory.error('Error al obtener los datos del agrupador.');
            }
        );

    };  //Propiedades
    
            



    
    $scope.sortingLog = [];
    $scope.sortableOptions = uiSortableMultiSelectionMethods.extendOptions({
        connectWith: ".apps-container"
    });

    $scope.logModels = function () {
        $scope.sortingLog = [];
        for (var i = 0; i < $scope.rawScreens.length; i++) {
            var logEntry = $scope.rawScreens[i].map(function (x) {
                return x.value;
            }).join(', ');
            logEntry = 'Agrupamiento #' + (i + 1) + ': ' + logEntry;
            $scope.sortingLog.push(logEntry);
        }
    };




});



