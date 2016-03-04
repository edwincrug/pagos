registrationModule.controller("agrupadorController", function ($scope, uiSortableMultiSelectionMethods, alertFactory, agrupadorRepository) {

$scope.init = function () {
      $scope.llenaProvedores()
      $.fn.bootstrapSwitch.defaults.offColor = 'info';
       $.fn.bootstrapSwitch.defaults.onText = 'Todos';
       $.fn.bootstrapSwitch.defaults.offText = 'Pagables';
       $('.switch-checkbox').bootstrapSwitch();   
    };

 //parametros en duro
    $scope.idEmpleado = 1;
    $scope.idEmpresa = 4;

$scope.llenaAgrupadores = function () {
 agrupadorRepository.getAgrupadores($scope.idEmpresa)
            .then(function successCallback(response) 
        {
            $scope.agrupadores = response.data;
            var i = 0, j=0;
            $scope.agrupadores.forEach(function (pca_idAgrupador, pca_nombre)
            {
             $scope.agrupadores[i].lista = llenaLista($scope.agrupadores[i].pca_idAgrupador);
            i++;                            
            });
             $scope.rawScreens = $scope.agrupadores;
                 
        }

        , function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                alertFactory.error('Error al obtener los datos del agrupador.');
            }
        );
}; 


function llenaLista(id_agrupador) {

        var tmpList = [];
        var i = 0;
        $scope.proveedores.forEach(function (idProveedor, nomProveedor)
            {  
                if(id_agrupador == $scope.proveedores[i].idAgrupador)
                {
                    tmpList.push(
                    {
                    text: $scope.proveedores[i].nombreProveedor + id_agrupador + '-' + $scope.proveedores[i].idProveedor,
                    value: id_agrupador + '-' + $scope.proveedores[i].idProveedor
                    });
                 i++;    
                }
                else
                {
                   i++;   
                }   
                                      
            }); 

        return tmpList;
    }


$scope.llenaProvedores = function () {
        
        //Llamada a repository para obtener data
        agrupadorRepository.getProvedores($scope.idEmpresa)
            .then(function successCallback(response) 
            {
                $scope.proveedores = response.data;
                $scope.llenaAgrupadores();
         }

        , function errorCallback(response) {
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



