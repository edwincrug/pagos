// -- =============================================
// -- Author:      Fernando Alvarado Luna
// -- Create date: 12/03/2016
// -- Description: Controller para la autentificación del empleado
// -- Modificó: 
// -- Fecha: 
// -- =============================================
registrationModule.controller("empleadoController", function ($scope, $filter, $rootScope, localStorageService, alertFactory, empleadoRepository) {

    //Propiedades
   
    //Funcion que carga al inicio para obtener la ficha de empleado
    $scope.init = function () {
    	

        getEmpleado();
        
    	empleadoRepository.getFichaEmpleado($rootScope.currentEmployee)
    		.then(function successCallback(response) {

			    $rootScope.empleado = response.data;
                $rootScope.idEmpresa = $rootScope.empleado.emp_idempresa;
			    alertFactory.success('Datos de empleado obtenidos.');

  			}, function errorCallback(response) {

			    alertFactory.error('Error al obtener los datos de empleado.');
  			}
  		);

    };

    var getEmpleado = function(){
        if(!($('#lgnUser').val().indexOf('[') > -1)){
            localStorageService.set('lgnUser', $('#lgnUser').val());
        }
        else{
            if(($('#lgnUser').val().indexOf('[') > -1) && !localStorageService.get('lgnUser')){
                if(getParameterByName('employee') != ''){
                    $rootScope.currentEmployee = getParameterByName('employee');
                    return;
                }
                else{
                   alert('Inicie sesión desde panel de aplicaciones.');
                    window.close(); 
                }
                
            }
        }
        //Obtengo el empleado logueado
        $rootScope.currentEmployee = localStorageService.get('lgnUser');
    };

$scope.Salir = function () {

	alertFactory.info('exit user');

}

}); 

