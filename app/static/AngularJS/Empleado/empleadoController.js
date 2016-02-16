// -- =============================================
// -- Author:      Mario Mejía
// -- Create date: 08/02/2016
// -- Description: Repositorio de la busqueda de aplicación móvil Flotillas
// -- Modificó: 
// -- Fecha: 
// -- =============================================
registrationModule.controller("empleadoController", function ($scope, $filter, $rootScope, localStorageService, alertFactory, empleadoRepository) {

    //Propiedades
    $scope.idEmpleado = 1;

    //Funcion que carga al inicio para obtener la ficha de empleado
    $scope.init = function () {
    	
    	//Llamada a repository para obtener data
    	empleadoRepository.getFichaEmpleado($scope.idEmpleado)
    		.then(function successCallback(response) {
			    // this callback will be called asynchronously
			    // when the response is available
			    $scope.empleado = response.data;
			    alertFactory.success('Datos de empleado obtenidos.');

  			}, function errorCallback(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			    alertFactory.error('Error al obtener los datos de empleado.');
  			}
  		);

    };
$scope.Salir = function () {

	alertFactory.info($scope.empleado + 'exit user');

}

}); 

