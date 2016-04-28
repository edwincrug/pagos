// -- =============================================
// -- Author:      Fernando Alvarado Luna
// -- Create date: 12/03/2016
// -- Description: Controller para la autentificación del empleado
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

			    $scope.empleado = response.data;
			    alertFactory.success('Datos de empleado obtenidos.');

  			}, function errorCallback(response) {

			    alertFactory.error('Error al obtener los datos de empleado.');
  			}
  		);

    };
$scope.Salir = function () {

	alertFactory.info('exit user');

}

}); 

