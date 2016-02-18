registrationModule.controller("pagoController", function ($scope, $http, $interval, uiGridGroupingConstants, uiGridConstants, $filter, $rootScope, localStorageService, alertFactory, pagoRepository, stats) {

   $scope.idEmpresa = 2;             
   $scope.idCuenta = 4;

     $scope.init = function () {
        
       $scope.llenaGrid();
       $scope.llenaEncabezado();

    };

    //Funcion que carga al inicio para obtener la ficha de empleado
    $scope.llenaGrid = function () {
    	
    	//Llamada a repository para obtener data
    	pagoRepository.getDatos($scope.idEmpresa)
    		.then(function successCallback(response) 
            {
			    
			    $scope.gridOptions.data = response.data;
                 $scope.data = response.data;
                 $scope.carteraVencida = 0;
                for (var i = 0; i < $scope.data.length; i++)
                {
                     $scope.data[i].Pagar = $scope.data[i].saldo;
                     if ($scope.data[i].ordenBloqueada=='False')
                    {
                        $scope.data[i].Pagar = 0;
                    }
                    $scope.carteraVencida = $scope.carteraVencida + $scope.data[i].saldo

                }
                $scope.gridOptions.data = $scope.data;
                $scope.cantidadTotal = 0;
                $scope.cantidadUpdate = 0;
			    alertFactory.success('Se lleno el grid.');
                
                setTimeout(function()
                { 
                 $scope.selectAll();
                }, 1000);
                

  			}, function errorCallback(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			    alertFactory.error('Error al obtener los datos del grid.');
  			}
  		);

    };  //Propiedades
    

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

    $scope.gridOptions = {
        enableFiltering: true,
        enableGroupHeaderSelection: true,
        treeRowHeaderAlwaysVisible: true,
        showColumnFooter: false,
        showGridFooter: false,
        cellEditableCondition: function($scope) {
            // put your enable-edit code here, using values from $scope.row.entity and/or $scope.col.colDef as you desire
            return $scope.row.entity.ordenBloqueada; // in this example, we'll only allow active rows to be edited
        },

        columnDefs: [
         // { name: 'cuenta', width: '5%' },
         // { name: 'idProveedor', width: '5%' },
         {
           name: 'proveedor', grouping: { groupPriority: 0 }, sort: { priority: 0, direction: 'asc' }, width: '20%',name: 'proveedor'
           ,grouping: { groupPriority: 0 }, sort: { priority: 0, direction: 'asc' }, width: '20%'
           ,cellTemplate: '<div><div ng-if="!col.grouping || col.grouping.groupPriority === undefined || col.grouping.groupPriority === null || ( row.groupHeader && col.grouping.groupPriority === row.treeLevel )" class="ui-grid-cell-contents" title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div></div>'
         },
         {
             field: 'Pagar', displayName: 'Pagar (total)', width: '10%', cellFilter: 'currency', aggregationType: uiGridConstants.aggregationTypes.sum,
             treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
             customTreeAggregationFinalizerFn: function (aggregation) {
                 aggregation.rendered = aggregation.value;
             }
         },
         {
             field: 'saldoPorcentaje', displayName: 'Porcentaje %', width: '10%', aggregationType: uiGridConstants.aggregationTypes.sum,
             treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
             customTreeAggregationFinalizerFn: function (aggregation) {
                 aggregation.rendered = aggregation.value;
             }
         },
        { name: 'monto', displayName: 'Monto', width: '10%', cellFilter: 'currency' , pinnedLeft: true},
         { name: 'saldo', displayName: 'Saldo', width: '10%', cellFilter: 'currency' },
         { name: 'documento', width: '5%' },
         { name: 'tipo', width: '5%' },
         { name: 'tipodocto', width: '5%' },
         { name: 'cartera', width: '5%' },
         { name: 'moneda', width: '5%' },
         { name: 'fechaVencimiento', displayName: 'fechaVencimiento', type: 'date', cellFilter: 'date:"yyyy-MM-dd"', width: '5%' },
         { name: 'fechaPromesaPago', displayName: 'fechaPromesaPago', type: 'date', cellFilter: 'date:"yyyy-MM-dd"', width: '5%' },
         { name: 'fechaRecepcion', displayName: 'fechaRecepcion', type: 'date', cellFilter: 'date:"yyyy-MM-dd"', width: '5%' },
         { name: 'fechaFactura', displayName: 'fechaFactura', type: 'date', cellFilter: 'date:"yyyy-MM-dd"', width: '5%' },
         { name: 'ordenCompra', width: '5%' },
         { name: 'estatus', width: '5%' },
         { name: 'anticipo', width: '5%' },
         { name: 'anticipoAplicado', width: '5%' },
         { name: 'annio', width: '5%' },
         { name: 'proveedorBloqueado', width: '5%' },
         { name: 'ordenBloqueada', width: '5%' },
         { name: 'diasCobro', width: '5%' },
         { name: 'aprobado', width: '5%' },
         { name: 'contReprog', width: '5%' }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            // $scope.gridApi.grid.registerColumnsProcessor( setGroupValues, 410 );
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
                            //alert(rowChanged.entity.Pagar);
                            $scope.cantidadTotal = Math.round($scope.cantidadTotal * 100) / 100 + Math.round(rowChanged.entity.Pagar * 100) / 100;
                        }
                        else
                            $scope.cantidadTotal = Math.round($scope.cantidadTotal * 100) / 100 - Math.round(rowChanged.entity.Pagar * 100) / 100;
            });

            gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {

                
                rows.forEach(function (row,i) {
                      i++;      
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
                $scope.cantidadTotal = $scope.cantidadTotal + $scope.cantidadUpdate;
                $scope.$apply();
              });

          $scope.gridApi.selection.selectAllRows();  

        }
    }

 $scope.selectAll = function() {
    $scope.gridApi.selection.selectAllRows();
    };       

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
