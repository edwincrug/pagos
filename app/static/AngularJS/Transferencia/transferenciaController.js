// -- =============================================
// -- Author:  Alejandro Lopez y Fernando Alvarado Luna
// -- Create date: 27/04/2016
// -- Description: Controller para el sistema de programación de pagos
// -- Modificó:
// -- Fecha:
// -- =============================================
registrationModule.controller("transferenciaController", function($scope, $http, $interval, uiGridGroupingConstants, uiGridConstants, $filter, $rootScope, localStorageService, alertFactory, transferenciaRepository, pagoRepository, stats, $window) {
                $scope.editatransferencia = true;

                $scope.gridTransferenciaoptions = { 
                 enableRowSelection: true,
                 enableRowHeaderSelection: true
                 //,rowTemplate: rowTemplate()
                  };

                $scope.gridTransferenciaoptions.columnDefs = [
                //{ name: 'fecha', displayName: 'Fecha Lote', type: 'date', cellFilter: 'date:"dd/MM/yyyy"', width: '17%', enableCellEdit: false },
                { name: 'ptb_id_cuenta_origen', displayName: 'Banco Origen'},
                { name: 'ptb_id_cuenta_destino', displayName: 'Banco Destino' },
                { name: 'ptb_importe', displayName: 'Transferencia', width: '15%', cellFilter: 'currency', enableCellEdit: false },
                { name: 'pet_descripcion', displayName: 'Estatus', width: '15%', enableCellEdit: false },
                { name: 'buscar',displayName: '', width: '5%', cellTemplate: '<div><button class="btn btn-warning" ><span class="glyphicon glyphicon-search" ng-click="grid.appScope.TraeTransferencia(row.entity.ptb_id)"></span></button></div>'},
                { name: 'pal_id_lote_pago', displayName: 'Lote', width: '20%', enableCellEdit: false, visible: false },
                { name: 'ptb_id', displayName: 'Lote', width: '20%', enableCellEdit: false, visible: false },
                ];

                $scope.gridTransferenciaoptions.multiSelect = false;
                $scope.gridTransferenciaoptions.modifierKeysToMultiSelect = false;
                $scope.gridTransferenciaoptions.noUnselect = true;
                $scope.gridTransferenciaoptions.onRegisterApi = function( gridApi ) {
                $scope.gridApiLote = gridApi;
                };


$scope.init = function () {

       transferenciaRepository.getEmpresas($rootScope.idUsuario)
                .then(function successCallback(response) {
                    $scope.empresas = response.data;
                    //
                    $scope.showTotales = 0;
                }, function errorCallback(response) {
                    alertFactory.error('Error en empresas.');
                });

    };

 $scope.traeTransferenciaxEmpresa = function(emp_idempresa, emp_nombre, emp_nombrecto, rfc, tipo, pagoDirecto) {
            
            $scope.editatransferencia = true;
            
            $scope.traeTransferenciaxEmpresa.emp_idempresa = emp_idempresa;
            $scope.traeTransferenciaxEmpresa.emp_nombre = emp_nombre;
            $scope.traeTransferenciaxEmpresa.emp_nombrecto = emp_nombrecto;
            $scope.traeTransferenciaxEmpresa.rfc = rfc;
            $scope.traeTransferenciaxEmpresa.tipo = tipo;
            $scope.traeTransferenciaxEmpresa.pagoDirecto = pagoDirecto;
            transferenciaRepository.getTransferenciasxEmpresa(emp_idempresa)
                .then(function successCallback(response) {
                    $scope.gridTransferenciaoptions.data = response.data;
                    }, function errorCallback(response) {
                    //oculta la información y manda el total a cero y llena el input del modal
                    $scope.traeTransferenciaxEmpresa.emp_nombre = 'La empresa seleccionada no tiene información';
                    $scope.gridTransferenciaoptions.data = [];
                });
        };

$scope.TraeTransferencia = function(idlote) {
                $scope.editatransferencia = false;

                transferenciaRepository.getTransferenciaxlote(idlote)
                .then(function successCallback(response) {
                    $scope.transferencia = response.data;
                    
                }, function errorCallback(response) {
                    alertFactory.error('Error al obtener los parametros del escenario de pagos.');
                });

            }

$scope.AplicaTransferencia = function(idlote,monto) {
                $scope.editatransferencia = true;

                transferenciaRepository.setAplicacionTrans(idlote,monto)
                                            .then(function successCallback(response) {
                                            
                                           
                                            $scope.TraeTransferenciaUpdate($scope.traeTransferenciaxEmpresa.emp_idempresa);

                                            }, function errorCallback(response) {
                                            
                                            alertFactory.error('Error .');    
                                                    
                                            });
                $scope.init();
            }
$scope.EditaTransferencia = function(idlote,monto) {
              $scope.editatransferencia = true;
              transferenciaRepository.setEdicionTrans(idlote,monto)
                                            .then(function successCallback(response) {
                                            
                                            
                                            $scope.TraeTransferenciaUpdate($scope.traeTransferenciaxEmpresa.emp_idempresa);

                                            }, function errorCallback(response) {
                                            
                                            alertFactory.error('Error .');    
                                                    
                                            });
            }            


$scope.TraeTransferenciaUpdate = function(idlote) {

                 transferenciaRepository.getTransferenciasxEmpresa(idlote)
                .then(function successCallback(response) {
                    $scope.gridTransferenciaoptions.data = response.data;
                    }, function errorCallback(response) {
                    //oculta la información y manda el total a cero y llena el input del modal
                    $scope.traeTransferenciaxEmpresa.emp_nombre = 'La empresa seleccionada no tiene información';
                    $scope.gridTransferenciaoptions.data = [];
                });

            }

$scope.today = function() {
            $scope.dtini = new Date();
            $scope.dtfin = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.dt = null;
        };

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        $scope.dateOptions = {
            //dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        $scope.toggleMin = function() {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.setDate = function(year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.formats = ['dd/MM/yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events = [{
            date: tomorrow,
            status: 'full'
        }, {
            date: afterTomorrow,
            status: 'partially'
        }];

        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        }

        $scope.BuscarLotesxFecha = function(fechaini, fechafin) {


            var fecha_ini = $scope.formatDate(fechaini);
            var fecha_fin = $scope.formatDate(fechafin);

            pagoRepository.getLotesxFecha($rootScope.idEmpresa, $rootScope.idUsuario, fecha_ini, fecha_fin)


            .then(function successCallback(response) {
                $scope.gridLotesoptions.data = response.data;

                if (response.data.length == 0) {
                    alertFactory.infoTopFull('No existen lotes para este rango de fechas');
                }

            }, function errorCallback(response) {
                alertFactory.error('Error al obtener los datos del encabezado.');
            });
        }


});
