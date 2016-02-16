registrationModule.controller("pagoController", function ($scope, $filter, $rootScope, localStorageService, alertFactory, pagoRepository) {

   $scope.idEmpresa = 2;

    //Funcion que carga al inicio para obtener la ficha de empleado
    $scope.init = function () {
    	
    	//Llamada a repository para obtener data
    	pagoRepository.getEncabezado($scope.idEmpresa)
    		.then(function successCallback(response) {
			    // this callback will be called asynchronously
			    // when the response is available
			    $scope.encabezado = response.data;
			    alertFactory.success('Datos del encabezado obtenido.');

  			}, function errorCallback(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			    alertFactory.error('Error al obtener los datos del encabezdo.');
  			}
  		);

    };  //Propiedades
    
}); 
