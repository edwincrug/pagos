registrationModule.controller("pagoController", function ($scope, $http, $interval, uiGridGroupingConstants, uiGridConstants,$filter, $rootScope, localStorageService, alertFactory, pagoRepository, stats) {

   $scope.idEmpresa = 2;             
   $scope.idCuenta = 4;


   var errorCallBack = function (data, status, headers, config) {
        alertFactory.error('Ocurrio un problema');
    };

    /***************************************************************************************************************
    Funciones de incio  
    BEGIN
    ****************************************************************************************************************/

    $scope.init = function () {
       //LQMA   leer parametros : id , idemployee
       GetEmpleado();
       //getId();       

       //Inicializamos el switch
       $.fn.bootstrapSwitch.defaults.offColor = 'info';
       $.fn.bootstrapSwitch.defaults.onText = 'Todos';
       $.fn.bootstrapSwitch.defaults.offText = 'Pagables';
       $('.switch-checkbox').bootstrapSwitch();      

    };
    
    var Prepagos = function(){
        $scope.llenaGrid();
        $scope.llenaEncabezado();
    };

    /////////////////////////////////////////////
    //Obtiene ID de empleado
    //LQMA 
    var GetEmpleado = function(){
        if(getParameterByName('employee') != ''){
            $rootScope.currentEmployee = getParameterByName('employee');
        }

        if ($rootScope.currentEmployee == null){
            var idEmpleado = prompt("Ingrese un número de empleado", 1);
            $rootScope.currentEmployee = idEmpleado;
        }
        
        if ($rootScope.currentEmployee != null)
                GetId();
        else{
            ConfiguraGrid();
            setTimeout(function(){Prepagos();},500);
        }
    };

    //LQMA obtiene el ID de padre para consultar pagos por aprobar
    var GetId = function(){
        if(getParameterByName('id') != ''){
            $rootScope.currentId = getParameterByName('id');
        }

        if ($rootScope.currentId != null)
            GetIdOp();
        else{
            ConfiguraGrid();
            setTimeout(function(){Prepagos();},500);
        }
    }

    //obtiene parametro de operacion para configurar el Grid en editable o no.
    var GetIdOp = function(){
        if(getParameterByName('idOp') != ''){
            $rootScope.currentIdOp = getParameterByName('idOp');
        }        

        if ($rootScope.currentIdOp != null)
        {            
            ConfiguraGrid();
            setTimeout(function(){Prepagos();},500);            
        }
        else{
            ConfiguraGrid();
            setTimeout(function(){Prepagos();},500);
        }
    };

    $scope.llenaEncabezado = function () {        
        //Llamada a repository para obtener data
        pagoRepository.getEncabezado($scope.idCuenta)
            .then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.scencabezado = response.data;
                alertFactory.success('Se lleno el encabezado.');

            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                alertFactory.error('Error al obtener los datos del encabezado.');
            }
        );

    };

    /***************************************************************************************************************
    Funciones de incio  
    END
    ****************************************************************************************************************/


    /***************************************************************************************************************
    Funciones de GRID  
    BEGIN
    ****************************************************************************************************************/    


    $scope.llenaGrid = function () {        

        if ($rootScope.currentId != null){
            pagoRepository.getDatosAprob($rootScope.currentId)
            .success(llenaGridSuccessCallback)
            .error(errorCallBack);
            $scope.llenaEncabezado();
        }
        else
            pagoRepository.getDatos($scope.idEmpresa)
            .success(llenaGridSuccessCallback)
            .error(errorCallBack);

    };  //Propiedades    

    var llenaGridSuccessCallback = function (data, status, headers, config) {
                $scope.gridOptions.data = data;
                $scope.data = data;
                $scope.carteraVencida = 0;
                $scope.cantidadTotal = 0;
                $scope.cantidadUpdate = 0;
                $scope.noPagable = 0;
                $scope.Reprogramable = 0;
                for (var i = 0; i < $scope.data.length; i++)
                {
                     $scope.data[i].Pagar = $scope.data[i].saldo;
                     if ($scope.data[i].ordenBloqueada=='True')
                    {
                        $scope.data[i].Pagar = 0;
                    }
                     if ($scope.data[i].documentoPagable=='False')
                    {
                        $scope.data[i].Pagar = 0;
                    }
                $scope.carteraVencida = $scope.carteraVencida + $scope.data[i].saldo

                }
                $scope.noPagable = $scope.carteraVencida -$scope.cantidadTotal;
                $scope.gridOptions.data = $scope.data;
                
                alertFactory.success('Se lleno el grid.');
                setTimeout(function()
                { 
                 $scope.selectAll();
                }, 500);
    };     

 var setGroupValues = function (columns, rows) {
         columns.forEach( function( column ) {
           if ( column.grouping && column.grouping.groupPriority > -1 && column.treeAggregation.type !== uiGridGroupingConstants.aggregation.CUSTOM){
             column.treeAggregation.type = uiGridGroupingConstants.aggregation.CUSTOM;
             column.customTreeAggregationFn = function( aggregation, fieldValue, numValue, row ) {
               if ( typeof(aggregation.value) === 'undefined') {
                 aggregation.value = 0;
               }

               aggregation.value = aggregation.value + row.entity.Pagar;
             };
             column.customTreeAggregationFinalizerFn = function( aggregation ) {
               if ( typeof(aggregation.groupVal) !== 'undefined') {
                 aggregation.rendered = aggregation.groupVal + ' (' + $filter('currency')(aggregation.value) + ')';
               } else {
                 aggregation.rendered = null;
               }
             };
           }
         });
        return columns;
    };

//LQMA congifura e inicializa el grid
var ConfiguraGrid = function(){

$scope.gridOptions = {
        enableGridMenu: true,
        enableFiltering: true,
        enableGroupHeaderSelection: true,
        treeRowHeaderAlwaysVisible: true,
        showColumnFooter: true,
        showGridFooter: true,
        height:900,
        cellEditableCondition: function($scope) {
            // put your enable-edit code here, using values from $scope.row.entity and/or $scope.col.colDef as you desire
            return $scope.row.entity.ordenBloqueada; // in this example, we'll only allow active rows to be edited
        },

        columnDefs: [
         
         {
           name: 'proveedor', grouping: { groupPriority: 0 }, sort: { priority: 0, direction: 'asc' }, width: '20%',name: 'proveedor'
           , width: '20%'
           ,cellTemplate: '<div><div ng-if="!col.grouping || col.grouping.groupPriority === undefined || col.grouping.groupPriority === null || ( row.groupHeader && col.grouping.groupPriority === row.treeLevel )" class="ui-grid-cell-contents" title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div></div>'
         },
         {
             field: 'Pagar', displayName: 'Pagar (total)', width: '10%', cellFilter: 'currency', aggregationType: uiGridConstants.aggregationTypes.sum,
             treeAggregationType: uiGridGroupingConstants.aggregation.SUM, enableCellEdit: ($rootScope.currentIdOp == 1)?false:true,
             editableCellTemplate: '<div><form name="inputForm"><input type="number" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD"></form></div>',
             customTreeAggregationFinalizerFn: function (aggregation) {
                 aggregation.rendered = aggregation.value;
             }
         },
         {
             field: 'saldoPorcentaje', displayName: 'Porcentaje %', width: '10%', cellFilter: 'number: 6', aggregationType: uiGridConstants.aggregationTypes.sum,
             treeAggregationType: uiGridGroupingConstants.aggregation.SUM, enableCellEdit: false,
             customTreeAggregationFinalizerFn: function (aggregation) {
                 aggregation.rendered = aggregation.value;
             }
         },
        { name: 'monto', displayName: 'Monto', width: '13%', cellFilter: 'currency' , enableCellEdit: false},
         { name: 'saldo', displayName: 'Saldo', width: '13%', cellFilter: 'currency' , enableCellEdit: false},
         { name: 'documento', displayName: '# Documento', width: '15%', enableCellEdit: false, headerTooltip: 'Documento # de factura del provedor', cellClass: 'cellToolTip' },
         { name: 'tipo', width: '15%', displayName: 'Tipo', enableCellEdit: false },
         { name: 'tipodocto', width: '15%', displayName: 'Tipo Documento', enableCellEdit: false },
         { name: 'cartera', width: '15%', displayName: 'Cartera', enableCellEdit: false },
         { name: 'moneda', width: '10%' , displayName: 'Moneda', enableCellEdit: false},
         { name: 'fechaVencimiento', displayName: 'Fecha de Vencimiento', type: 'date', cellFilter: 'date:"dd/MM/yyyy"', width: '17%', enableCellEdit: false},
         { name: 'fechaPromesaPago', displayName: 'Fecha Promesa de Pago', type: 'date', cellFilter: 'date:"dd/MM/yyyy"', width: '17%'},
         { name: 'fechaRecepcion', displayName: 'Fecha Recepción', type: 'date', cellFilter: 'date:"dd/MM/yyyy"', width: '17%', enableCellEdit: false },
         { name: 'fechaFactura', displayName: 'Fecha Factura', type: 'date', cellFilter: 'date:"dd/MM/yyyy"', width: '17%', enableCellEdit: false },
         { name: 'ordenCompra', displayName: 'Orden de compra',width: '13%', enableCellEdit: false },
         { name: 'estatus', displayName: 'Estatus', width: '10%', enableCellEdit: false },
         { name: 'anticipo', displayName: 'Anticipo', width: '10%', enableCellEdit: false },
         { name: 'anticipoAplicado',displayName: 'Anticipo Aplicado', width: '15%' , enableCellEdit: false},
         { name: 'cuenta', width: '15%', displayName: '# Cuenta'},
         // { name: 'idProveedor', width: '5%' },
         //{ name: 'annio', width: '5%' },
         // { name: 'proveedorBloqueado', width: '5%' },
         { name: 'documentoPagable', width: '15%', displayName: 'Estatus del Documento'},
         { name: 'ordenBloqueada', displayName: 'Bloqueada', width: '20%' , cellTemplate: '<button ng-click="row.entity.ordenBloqueada = !row.entity.ordenBloqueada" ng-model="row.entity.ordenBloqueada" style="{{row.entity.ordenBloqueada ? "background-color: lightgreen" : ""}}"></button>' },
         // { name: 'diasCobro', width: '5%' },
         // { name: 'aprobado', width: '5%' },
         // { name: 'contReprog', width: '5%' }
        ],
        rowTemplate:'<div ng-class="{\'ordenBloqueada\':(row.entity.ordenBloqueada==\'True\' && ((row.entity.idEstatus < 1 || row.entity.idEstatus > 5) && row.entity.idEstatus != 20) && !row.isSelected)' + 
                                    ',\'bloqueadaSelec\': (row.isSelected && row.entity.ordenBloqueada==\'True\') || (row.isSelected && ((row.entity.idEstatus >= 1 && row.entity.idEstatus <= 5) || row.entity.idEstatus == 20)),'+
                                    '\'selectNormal\': (row.isSelected && row.entity.ordenBloqueada==\'False\' && ((row.entity.idEstatus < 1 || row.entity.idEstatus > 5) && row.entity.idEstatus != 20))'+
                                    ',\'docIncompletos\': (!row.isSelected && ((row.entity.idEstatus >= 1 && row.entity.idEstatus <= 5) || row.entity.idEstatus == 20) && row.entity.ordenBloqueada==\'False\')'+
                                    ',\'bloqDocIncom\': (!row.isSelected && ((row.entity.idEstatus >= 1 && row.entity.idEstatus <= 5) || row.entity.idEstatus == 20) && row.entity.ordenBloqueada==\'True\')}"> <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader == \'True\'}" ui-grid-cell></div></div>',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            // $scope.gridApi.grid.registerColumnsProcessor( setGroupValues, 410 );
            $scope.cantidadTotal = $scope.cantidadTotal;
            $scope.gridApi.selection.on.rowSelectionChanged($scope, function (rowChanged) {
                if (typeof (rowChanged.treeLevel) !== 'undefined' && rowChanged.treeLevel > -1) 
                {
                    // this is a group header
                    children = $scope.gridApi.treeBase.getRowChildren(rowChanged);
                    children.forEach(function (child) {
                        if (rowChanged.isSelected) {
                            $scope.gridApi.selection.selectRow(child.entity);
                        } else {
                            $scope.gridApi.selection.unSelectRow(child.entity);
                        }
                    });
                }
                 else

                        if (rowChanged.isSelected) {
                           $scope.Reprogramable =  Math.round($scope.Reprogramable * 100) / 100 - Math.round(rowChanged.entity.Pagar * 100) / 100;
                           $scope.cantidadTotal = Math.round($scope.cantidadTotal * 100) / 100 + Math.round(rowChanged.entity.Pagar * 100) / 100;
                        }
                        else{
                            $scope.Reprogramable = Math.round($scope.Reprogramable * 100) / 100 + Math.round(rowChanged.entity.Pagar * 100) / 100;
                            $scope.cantidadTotal = Math.round($scope.cantidadTotal * 100) / 100 - Math.round(rowChanged.entity.Pagar * 100) / 100;
                        }
            });

            gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {


                rows.forEach(function (row,i) {
                
                    if (row.isSelected) {
                        $scope.cantidadTotal = Math.round($scope.cantidadTotal * 100) / 100 + Math.round(row.entity.Pagar * 100) / 100;
                        
                    }                        
                    else
                        $scope.cantidadTotal = Math.round($scope.cantidadTotal * 100) / 100 - Math.round(row.entity.Pagar * 100) / 100;
                });
                
            });

            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) 
            {
                $scope.cantidadUpdate = newValue - oldValue;
                $scope.cantidadTotal = Math.round($scope.cantidadTotal* 100) / 100 + Math.round($scope.cantidadUpdate* 100) / 100
                $scope.Reprogramable =  Math.round($scope.Reprogramable * 100) / 100 - Math.round($scope.cantidadUpdate * 100) / 100;
                //$scope.$apply();
                if (colDef.name == 'fechaPromesaPago') {

                    if (oldValue == '')
                        {   
                           if (newValue == '')
                            {   
                                //alertFactory.error('La fecha promesa de pago es invalida !!!');
                            }  
                            else
                            {
                                old_date = Date.now();
                                var new_date = new Date(newValue);
                                if (new_date < old_date)
                                {
                                    alertFactory.warning('La fecha promesa de pago no puede ser menor a ' + old_date + ' !!!');
                                    rowEntity.fechaPromesaPago = old_date;
                                }
                            }    
                        } 

                    else{
                         old_date = Date.now();
                         var new_date = new Date(newValue);
                            if (new_date < old_date)
                            {
                                alertFactory.warning('La fecha promesa de pago no puede ser menor a ' + old_date + '  !!!');
                                rowEntity.fechaPromesaPago = old_date;
                            }
                    }        
                    
                } 
                if (colDef.name == 'Pagar') {
                    // if (isNumeric(newValue)){
                        if (oldValue == '')
                            {   
                               if (newValue == '')
                                {   
                                    //alertFactory.warning('La fecha promesa de pago es invalida !!!');
                                }  
                            } 

                        else{

                              if (newValue > oldValue)
                                {
                                    alertFactory.warning('El pago no puede ser mayor a ' + oldValue + '  !!!');
                                    rowEntity.Pagar = oldValue;
                                }
                            }
                        //}    
                    // else{
                    //                 alertFactory.warning('El pago debe de ser númerico  !!!');
                    //                 rowEntity.Pagar = oldValue;
                    //     }                
                }               
              });

          $scope.gridApi.selection.selectAllRows();  
        }
    } //grid options
}//funcion

 $scope.selectAll = function() {
    $scope.gridApi.selection.selectAllRows();    
    };       

$scope.FiltrarCartera = function (value) {
    console.log(value);
    $scope.gridApi.grid.columns[21].filters[0].term=value;
    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    $scope.gridApi.grid.refresh();
    }

var isNumeric = function(obj){
  return !Array.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
}


    /***************************************************************************************************************
    Funciones de GRID  
    END
    ****************************************************************************************************************/

    $scope.colapsado = false;
    //Funcion para controlar el redimensionamiento del GRID
    $scope.Resize = function () {
         $scope.colapsado = !$scope.colapsado;
    }  

/***************************************************************************************************************
    Funciones de guardado de datos
    BEGIN
****************************************************************************************************************/

//LQMA funcion para guardar datos del grid (se implementara para guardar Ingresos bancos, otros , Transferencias)
$scope.Guardar = function() {

    pagoRepository.getPagosPadre($rootScope.currentEmployee)
            .then(function successCallback(response) 
            {        
                var array = [];
                var rows =  $scope.gridApi.grid.rows;
                var count = 0;

                rows.forEach(function (row,i) {

                            var elemento = {};

                             elemento.pag_id = response.data;
                             elemento.pad_polTipo = row.entity.polTipo;
                             elemento.pad_polAnnio = row.entity.annio;
                             elemento.pad_polMes = row.entity.polMes;
                             elemento.pad_polConsecutivo = row.entity.polConsecutivo;
                             elemento.pad_polMovimiento = row.entity.polMovimiento;
                             elemento.pad_fechaPromesaPago = (row.entity.fechaPromesaPago == ''?'01/01/1999':row.entity.fechaPromesaPago);
                             elemento.pad_saldo = row.entity.Pagar;

                                if (row.isSelected)
                                    elemento.tab_revision = 1;
                                else
                                    elemento.tab_revision = 0;

                                array.push(elemento);

                            });    

                 pagoRepository.setDatos(array,$rootScope.currentEmployee,response.data)
                        .then(function successCallback(response) {
                            
                            alertFactory.success('Se guardaron los datos.');

                        }, function errorCallback(response) {                
                            alertFactory.error('Error al guardar Datos');
                        }
                    );     
            }, function errorCallback(response) {                
                alertFactory.error('Error al insertar en tabla padre.');
            });
  };//fin de funcion guardar

/***************************************************************************************************************
    Funciones de guardado de datos
    END
****************************************************************************************************************/

})
 
registrationModule.service('stats', function () {

     var coreAccumulate = function (aggregation, value) {
         initAggregation(aggregation);
         if (angular.isUndefined(aggregation.stats.accumulator)) {
             aggregation.stats.accumulator = [];
         }
         aggregation.stats.accumulator.push(value);
     };

     var initAggregation = function (aggregation) {
         /* To be used in conjunction with the cleanup finalizer */
         if (angular.isUndefined(aggregation.stats)) {
             aggregation.stats = { sum: 0 };
         }
     };

     var increment = function (obj, prop) {
         /* if the property on obj is undefined, sets to 1, otherwise increments by one */
         if (angular.isUndefined(obj[prop])) {
             obj[prop] = 1;
         }
         else {
             obj[prop]++;
         }
     };

     var service = {
         aggregator: {
             accumulate: {
                
                 numValue: function (aggregation, fieldValue, numValue) {
                     return coreAccumulate(aggregation, numValue);
                 },
                 fieldValue: function (aggregation, fieldValue) {
                     return coreAccumulate(aggregation, fieldValue);
                 }
             },
             mode: function (aggregation, fieldValue) {
                 initAggregation(aggregation);
                 var thisValue = fieldValue;
                 if (angular.isUndefined(thisValue) || thisValue === null) {
                     thisValue = aggregation.col.grid.options.groupingNullLabel;
                 }
                 increment(aggregation.stats, thisValue);
                 if (aggregation.stats[thisValue] > aggregation.maxCount || angular.isUndefined(aggregation.maxCount)) {
                     aggregation.maxCount = aggregation.stats[thisValue];
                     aggregation.value = thisValue;
                 }
             },
             sumSquareErr: function (aggregation, fieldValue, numValue) {
                 initAggregation(aggregation);
                 increment(aggregation.stats, 'count');
                 aggregation.stats.sum += numValue;
                 service.aggregator.accumulate.numValue(aggregation, fieldValue, numValue);
             }
         },
         finalizer: {
             cleanup: function (aggregation) {
                 delete aggregation.stats;
                 if (angular.isUndefined(aggregation.rendered)) {
                     aggregation.rendered = aggregation.value;
                 }
             },            
            
             sumSquareErr: function (aggregation) {
                 aggregation.value = 0;
                 if (aggregation.count !== 0) {
                     var mean = aggregation.stats.sum / aggregation.stats.count,
                       error;

                     angular.forEach(aggregation.stats.accumulator, function (value) {
                         error = value - mean;
                         aggregation.value += error * error;
                     });
                 }
             },
         },
     };
     return service;
}); 
