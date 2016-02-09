registrationModule.controller("notificacionController", function ($scope, $filter, $rootScope, localStorageService, alertFactory, notificacionRepository, aprobacionRepository, filtroRepository) {

    //Propiedades
    $scope.oneAtATime = true;
    $scope.isSearching = false;
    //Variables de control de orden
    $scope.alphaOrder = false;
    $scope.tooltipAlphabeth = 'Ordenar Descencente';
    $scope.dateOrder = true;
    $scope.tooltipDate = 'Ordenar Ascendente';
    $scope.currentOrder = 1;
    //Variable de control de filtros
    $scope.filtrado = false; 
    //Manejo de cascada en filtros
    $scope.nivelCascada = 1;


    //Grupo de funciones de inicio
    $scope.init = function () {
        $rootScope.actualizar = true;
        $rootScope.currentEmployee = getParameterByName('id');
        $scope.currentMarca = null;

        //Inicializamos la fecha 
        $scope.hora = new Date();

        //Inicializamos el filtro
        $scope.txtAlphaOrder = '+identificador';
        $scope.txtDateOrder = '-fecha';

        //Inicializamos el reloj
        setInterval(function () {
            $scope.ReloadTime();
        }, 1000);
        //Inicializamos el reloj
        setInterval(function () {
            $('.parpadear').toggle('highlight');
        }, 500);
        //Recargamos la lista de notificaciones
        $rootScope.Reload();
        setInterval(function () {
            $rootScope.Reload();
        }, global_settings.liveReload);

        //Obtengo el nombre del empleado
        filtroRepository.getEmpleado($rootScope.currentEmployee)
            .success(getEmpleadoSuccessCallback)
            .error(errorCallBack);
        //Descargo el filtro padre
        GetMarca();

        var socket = io.connect('http://localhost:3100/');
            socket.on('mejorandola', function(data){
           // alertFactory.warning(data.hola);
        });

    };

    //Mensajes en caso de error
    var errorCallBack = function (data, status, headers, config) {
        alertFactory.error('Ocurrio un problema: ' + data);
        $('#btnReject').button('reset');
        $('#btnApprove').button('reset');
    };

    //Obtiene los datos del empleado
    var getEmpleadoSuccessCallback = function (data, status, headers, config) {
        $rootScope.empleado = data;
    };

    //Success al obtener notificaciones
    var getNSuccessCallback = function (data, status, headers, config) {
        //Obtiene Notificaciones
        if ($scope.listaNotificacion_original != null) {
            var inicial = $scope.listaNotificacion_original.length;
            //if (data.length != inicial) {
                if($rootScope.actualizar){
                    $scope.listaNotificacion_original = data;
                    //$scope.listaNotificacion = data;
                    AsignaListaNotificacion(); 
                    if($scope.currentOrder == 1)
                        DateOrderNotificacion(); 
                    else
                        AlphaOrderNotificacion(); 
                }
            //}
            if (data.length > inicial)
            {
                alertFactory.info((data.length - inicial).toString() + ' nuevas notificaciones.');
            }
        }
        else{
            $scope.listaNotificacion_original = data;
            AsignaListaNotificacion();
        }
        
    };

    var AsignaListaNotificacion = function() {

        if($scope.currentMarca != null && $scope.currentAgencia != null && $scope.currentDepartamento != null){
            $scope.listaNotificacion = $filter('filter')($scope.listaNotificacion_original, { idEmpresa: $scope.currentMarca.emp_idempresa, idSucursal: $scope.currentAgencia.suc_idsucursal, idDepartamento: $scope.currentDepartamento.dep_iddepartamento } , true);
        }
        else if($scope.currentMarca != null && $scope.currentAgencia != null){
            $scope.listaNotificacion = $filter('filter')($scope.listaNotificacion_original, { idEmpresa: $scope.currentMarca.emp_idempresa, idSucursal: $scope.currentAgencia.suc_idsucursal } , true);
        }
        else if($scope.currentMarca != null){
            $scope.listaNotificacion = $filter('filter')($scope.listaNotificacion_original, { idEmpresa: $scope.currentMarca.emp_idempresa } , true);
        }
        else{
            $scope.listaNotificacion = $scope.listaNotificacion_original;
        }
        
    };

    //Success al obtener aprobaciones
    var getASuccessCallback = function (data, status, headers, config) {
        //Obtiene Notificaciones
        if ($scope.listaAprobacion != null) {
            var inicial = $scope.listaAprobacion.length;
            if (data.length != inicial) {
                $scope.listaAprobacion = data;
            }
        }
        else
            $scope.listaAprobacion = data;
    };

    //Consulto el servidor para buscar nuevas notificaciones
    $rootScope.Reload = function () {
        //Obtengo las notificaciones
        notificacionRepository.get($rootScope.currentEmployee)
            .success(getNSuccessCallback)
            .error(errorCallBack);

       // Obtengo las aprobaciones
        aprobacionRepository.get($rootScope.currentEmployee)
                .success(getASuccessCallback)
                .error(errorCallBack);
    }

    //////////////////////////////////////////////////////////////////
    // Implementación para ver documentos
    //////////////////////////////////////////////////////////////////

    $scope.VerDocumento = function(not) {
        window.open(not.adjunto, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=500, left=500, width=1024, height=768");
        myWindow.document.write("<p>Detalle de la orden de compra en Business PRO</p>");
    };

    $scope.VerBusiness = function(not) {
        var myWindow = window.open(not.link, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=500, left=500, width=1024, height=768");
        myWindow.document.write("<p>Detalle de la orden de compra en Business PRO</p>");
    };

    //Rercargo el reloj
    $scope.ReloadTime = function () {
        $scope.hora = new Date();
        $scope.$apply();
    };

    //////////////////////////////////////////////////////////////////
    //Funcionalidad de visto
    /////////////////////////////////////////////////////////////////
    $scope.Visto = function (not) {
        //Bloquea la actualización automática de notificaciones
        $rootScope.actualizar = !not.open;
        if(not.estado == 0){
            aprobacionRepository.visto($rootScope.currentEmployee, not.idAprobacion)
              .error(errorCallBack);
            not.estado = 1;
        }
    };

    /////////////////////////////////////////////////////////////////
    //Configuracion de Busquedas 
    /////////////////////////////////////////////////////////////////

    $scope.ViewSearch = function() {
        $scope.isSearching = !$scope.isSearching;
        $("#slideIzq").animate({
            width: "toggle"
        });
        if($scope.isSearching == false){
            $('#slideIzq').blur();
            $('#slideIzq').val('');
            $scope.keySearch = '';
        }
    };

    $scope.TextSearch = function() {
        $scope.keySearch = $('#slideIzq').val();
    };

    /////////////////////////////////////////////////////////////////
    //Configuracion de Ordenamiento 
    /////////////////////////////////////////////////////////////////

    $scope.AlphaOrder = function() {
        $scope.currentOrder = 2;
        //Administra el estado del botón
        $scope.alphaOrder = !$scope.alphaOrder;
        if($scope.alphaOrder == true){
            $scope.tooltipAlphabeth = 'Ordenar Ascendente';
            $scope.txtAlphaOrder = '-identificador';
            AlphaOrderNotificacion();
        }
        else{
            
            $scope.tooltipAlphabeth = 'Ordenar Descencente';
            $scope.txtAlphaOrder = '+identificador';
            AlphaOrderNotificacion();
        }

    }

    var AlphaOrderNotificacion = function() {
        $scope.listaNotificacion = $filter('orderBy')($scope.listaNotificacion, $scope.txtAlphaOrder);
    };

    $scope.DateOrder = function() {
        $scope.currentOrder = 1;
        //Administra el estado del botón
        $scope.dateOrder = !$scope.dateOrder;
        if($scope.dateOrder == true){
            $scope.tooltipDate = 'Ordenar Ascendente';  
            $scope.txtDateOrder = '-fecha';
            DateOrderNotificacion();
        }
        else{
            
            $scope.tooltipDate = 'Ordenar Descencente';
            $scope.txtDateOrder = '+fecha';
            DateOrderNotificacion();
        }
    };

    var DateOrderNotificacion = function() {
        $scope.listaNotificacion = $filter('orderBy')($scope.listaNotificacion, $scope.txtDateOrder);
    };

    /////////////////////////////////////////////////////////////////
    //Configuracion de Filtros 
    /////////////////////////////////////////////////////////////////

    $scope.ViewFiltro = function() {
        $('#modalFiltro').modal('show');
        
    };

    $scope.AplicarFiltro = function() {
        $scope.filtrado = true;
        AsignaListaNotificacion();
        $('#modalFiltro').modal('hide');
    };

    $scope.QuitarFiltro = function() {
        $scope.filtrado = false;
        $scope.nivelCascada = 1;
        $scope.currentMarca = null;
        $scope.currentAgencia  = null;
        $scope.currentDepartamento = null;
        AsignaListaNotificacion();
        $('#modalFiltro').modal('hide');
    };

    //Success de la lista de marcas
    var getMarcaCallback = function (data, status, headers, config) {
        $scope.listaMarca = data;
    }

    //Success de la lista de agencias
    var getAgenciaCallback = function (data, status, headers, config) {
        $scope.listaAgencia = data;
    }

    //Success de la lista de departamentos
    var getDepartamentoCallback = function (data, status, headers, config) {
        $scope.listaDepartamento = data;
    }

    //Obtiene las marcas para filtrar
    var GetMarca = function() {
        //Obtiene la lista de marcas
        filtroRepository.getMarca($rootScope.currentEmployee)
            .success(getMarcaCallback)
            .error(errorCallBack);
    };

    //Obtiene las listas para filtrar
    $scope.GetAgencia = function() {
        //Obtiene la lista de agencias
        filtroRepository.getAgencia($rootScope.currentEmployee,$scope.currentMarca.emp_idempresa)
            .success(getAgenciaCallback)
            .error(errorCallBack);
    };

    $scope.GetDepartamento = function() {
        //Obtiene la lista de departamentos
        filtroRepository.getDepartamento($rootScope.currentEmployee,$scope.currentMarca.emp_idempresa,$scope.currentAgencia.suc_idsucursal)
            .success(getDepartamentoCallback)
            .error(errorCallBack);
    };

    //Establece el valor de una Marca 
    $scope.SetMarca = function(mar) {
        $scope.currentMarca = mar;
        $scope.GetAgencia();
        $scope.nivelCascada = 2;
        $scope.currentAgencia = null;
        $scope.currentDepartamento = null;
    };

    //Establece el valor de una Marca 
    $scope.SetAgencia = function(age) {
        $scope.currentAgencia = age;
        $scope.GetDepartamento();
        $scope.nivelCascada = 3;
        $scope.currentDepartamento = null;
    };

    //Establece el valor de un departamento
    $scope.SetDepartamento = function(dep) {
        $scope.currentDepartamento = dep;
    };



});

