registrationModule.controller("pagoController", function ($scope, $http, $interval, uiGridGroupingConstants, uiGridConstants,$filter, $rootScope, localStorageService, alertFactory, pagoRepository, stats) {

   $scope.idEmpresa = 4;             
   $scope.idCuenta = 4;
   $scope.idUsuario = 4;

   //LQMA 04032016
   $rootScope.currentEmployee = 21;
   $rootScope.currentId = null;
   $rootScope.currentIdOp = null;
   $scope.idLote = 0;

   var errorCallBack = function (data, status, headers, config) {
        alertFactory.error('Ocurrio un problema');
    };

    /***************************************************************************************************************
    Funciones de incio  
    BEGIN
    ****************************************************************************************************************/


    $scope.init = function () {
       //LQMA   leer parametros : id , idemployee
       
       /*if($scope.currentEmployee == 0)
       {
            $('#inicioModal').modal('hide');
            //GetEmpleado();
       }
       else
       {
             //GetEmpleado();
             $scope.traeEmpresas();
       }*/
       //LQMA 11032016
       $scope.caja = 0;       
       $scope.cobrar = 0;

       /***********************************************************/
       GetEmpleado();
       //getId();       

       //Inicializamos el switch
       $.fn.bootstrapSwitch.defaults.offColor = 'info';
       $.fn.bootstrapSwitch.defaults.onText = 'Lote';
       $.fn.bootstrapSwitch.defaults.offText = 'Global';
       $('.switch-checkbox').bootstrapSwitch();      
       $scope.showSelCartera = true;
       /***********************************************************/ 
       //configuraGridModal();
       //*******************************
       //                   id=no esta, nombre y cuenta = cuenta, saldo = saldo, disponible = disponible,
       /*$scope.ingresos = [{id: 1, nombre:'Santander', cuenta: 94039,saldo: 40000, disponible: 40000, ingreso:1, egreso:0},         
                          {id: 2,nombre:'Bancomer', cuenta: 594833,saldo: 79000, disponible: 79000,ingreso:0, egreso:1},
                          {id: 3,nombre:'Banamex', cuenta: 100298,saldo: 685000, disponible: 685000, ingreso:0, egreso:1}];*/

        // SEL_CUENTAS_INGRESOS_SP
        /*$scope.ingresos = [{nombre:'Santander', cuenta: 94039,saldo: 40000, disponible: 40000},
                          {nombre:'Bancomer', cuenta: 594833,saldo: 79000, disponible: 79000},
                          {nombre:'Banamex', cuenta: 100298,saldo: 685000, disponible: 685000}];

        $scope.egresos = [{nombre:'HSBC', cuenta: 228139,saldo: 90000, aTransferir: 0, total:90000,excedente:0, ingreso:0, egreso:1,totalPagar:200000,saldoIngreso:0},
                         {nombre:'Bancomer', cuenta: 594833,saldo: 120000, aTransferir: 0,total:120000,excedente:0, ingreso:1, egreso:1,totalPagar:450000,saldoIngreso:0}];*/

        $scope.LlenaIngresos();

        // SEL_CUENTAS_EGRESOS_SP
       /*$scope.egresos = [{id: 1,nombre:'HSBC', cuenta: 228139,saldo: 90000, aTransferir: 0, total:90000,excedente:0, ingreso:0, egreso:1,totalPagar:200000,saldoIngreso:0},
                         {id: 2,nombre:'Bancomer', cuenta: 594833,saldo: 120000, aTransferir: 0,total:120000,excedente:0, ingreso:1, egreso:1,totalPagar:450000,saldoIngreso:0}]; */

       // nombre y cuenta = cuenta, saldo = saldo (siempre vendra en 0), aTransferir = aTransferir (viene en 0), total = total (viene en 0, se calcula),   excedente = viene en 0, se calcula, totalPagar = recuperar del $scope.TotalxEmpresa.sumaSaldo,saldoIngreso = 0   
       $scope.transferencias = [{bancoOrigen:'', bancoDestino: '', importe:0, disponibleOrigen:0,index:0}];       

    };//Fin funcion Init
    
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
            var idEmpleado = 1; //prompt("Ingrese un número de empleado", 1);
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

    //FAl--Llena los datos de la empresa dependiendo el usuario.
    $scope.llenaEncabezado = function () {        
       
        pagoRepository.getEncabezado($scope.idCuenta)
            .then(function successCallback(response) {
                $scope.scencabezado = response.data;

            }, function errorCallback(response) {
                alertFactory.error('Error al obtener los datos del encabezado.');
            }
        );

    };

  //Trae las empresas para el modal de inicio
    $scope.traeEmpresas = function () {
        //Llamada a repository para obtener data

        //LQMA 03032016
        $rootScope.showGrid = false;
        pagoRepository.getEmpresas($scope.idUsuario)
            .then(function successCallback(response) {
                $scope.empresas = response.data;
                 $('#inicioModal').modal('show');
                 $scope.showTotales = false;
               
            }, function errorCallback(response) {
                 alertFactory.error('Error en empresas.');
            }
        );

    };
    //FAl--Trae el total de bancos de la empresa seleccionada
    $scope.traeTotalxEmpresa = function (emp_idempresa,emp_nombre) {        
      
        pagoRepository.getTotalxEmpresa(emp_idempresa)
            .then(function successCallback(response) {
                $rootScope.GranTotal = 0;
                $rootScope.TotalxEmpresas = response.data;
                $scope.idEmpresa = emp_idempresa;
                i=0;
                $rootScope.TotalxEmpresas.forEach(function (cuentaPagadora, sumaSaldo)
                    {
                    $rootScope.GranTotal = $rootScope.GranTotal + $rootScope.TotalxEmpresas[i].sumaSaldo; 
                    i++;                          
                    });
                $scope.traeTotalxEmpresa.emp_nombre = emp_nombre;
                $scope.showTotales = true;
                $scope.showSelCartera = true;
                //LQMA  07032016
                $scope.ObtieneLotes(0);// borra todos los lotes
                $scope.LlenaIngresos();

            }, function errorCallback(response) {
                //oculta la información y manda el total a cero y llena el input del modal
                $rootScope.TotalxEmpresas = [];
                $rootScope.GranTotal = 0;
                $rootScope.showGrid = false;
                $scope.showSelCartera = false;
                $scope.showTotales = false;
                $scope.traeTotalxEmpresa.emp_nombre = 'La empresa seleccionada no tiene información';
            }
        );
    };

    $scope.ObtieneLotes = function(newLote) //borraLote, 0 para borrar lotes sin relacion, 1 para conservarlos
    {
        $rootScope.NuevoLote = true;
        pagoRepository.getLotes($scope.idEmpresa,$rootScope.currentEmployee,0)
                .then(function successCallback(data) {

                    $rootScope.noLotes = data;
                    if(newLote!=0)
                        $rootScope.noLotes.data.push(newLote);

                    if($rootScope.noLotes.data.length > 0) //mostrar boton crear lote
                    {   
                        alertFactory.success('Total de lotes: ' +  $rootScope.noLotes.data.length);
                        $rootScope.idLotePadre = $rootScope.noLotes.data[$rootScope.noLotes.data.length - 1].idLotePago;
                        $rootScope.NuevoLote = false;
                    }
                    else
                    {
                        alertFactory.info('No existen Lotes');
                    }
                }, 
                function errorCallback(response) {
                    alertFactory.error('Error al obtener los Lotes');
                });
    };

    //LQMA 04032016 obtiene ingresos y egresos
    $scope.LlenaIngresos = function () {       
        pagoRepository.getIngresos($scope.idEmpresa,$scope.idLote)  //$scope.idEmpresa
            .then(function successCallback(response) {
                $rootScope.ingresos = response.data;
                $scope.LlenaEgresos();
            }, function errorCallback(response) {
                alertFactory.error('Error al obtener los Ingresos');
            }
        );
    };

    $scope.LlenaEgresos = function () {
        pagoRepository.getEgresos($scope.idEmpresa,$scope.idLote) //$scope.idEmpresa
            .then(function successCallback(response) {
                $rootScope.egresos = response.data;

                angular.forEach($rootScope.TotalxEmpresas, function(empresa, key){
                    angular.forEach($rootScope.egresos, function(egreso, key){
                            if(empresa.cuentaPagadora == egreso.cuenta) 
                                egreso.totalPagar = empresa.sumaSaldo;
                    });
                });
                
                $scope.calculaTotalOperaciones();
                recalculaIngresos();               

            }, function errorCallback(response) {
                alertFactory.error('Error al obtener los Egresos');
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

     //FAl--Muestra el div del grid en el Modal y 
     //lo configura para que no se edite y solo presente los campos principales
    $scope.MuestraGridModal = function (value) 
    {       
        $rootScope.showGrid = true;
        $scope.init();
        pagoRepository.getDatos($scope.idEmpresa)
            .success(llenaGridSuccessCallback)
            .error(errorCallBack);

        $rootScope.gridOptions.columnDefs = [
         
         {
           name: 'nombreAgrupador', grouping: { groupPriority: 0 }, sort: { priority: 0, direction: 'asc' }, width: '15%',displayName: 'Grupo', enableCellEdit: false
         },
         {
           name: 'proveedor', grouping: { groupPriority: 1 }, sort: { priority: 1, direction: 'asc' }, name: 'proveedor', enableCellEdit: false
           , width: '35%'
           ,cellTemplate: '<div><div ng-if="!col.grouping || col.grouping.groupPriority === undefined || col.grouping.groupPriority === null || ( row.groupHeader && col.grouping.groupPriority === row.treeLevel )" class="ui-grid-cell-contents" title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div></div>'
         },
         {
             field: 'Pagar', displayName: 'Pagar (total)', width: '25%', cellFilter: 'currency', aggregationType: uiGridConstants.aggregationTypes.sum,
             treeAggregationType: uiGridGroupingConstants.aggregation.SUM, enableCellEdit: false,
             editableCellTemplate: '<div><form name="inputForm"><input type="number" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD"></form></div>',
             customTreeAggregationFinalizerFn: function (aggregation) {
                 aggregation.rendered = aggregation.value;
             }
         },
         { name: 'fechaPromesaPago', displayName: 'Fecha Promesa de Pago', type: 'date', cellFilter: 'date:"dd/MM/yyyy"', width: '15%', enableCellEdit: false},
         { name: 'cuentaPagadora', width: '15%', displayName: 'Banco'}
        ];  

        /************************************************************************************************************************/  
    };
    //FAl--Oculta el grid del Modal y asigna la variable toda la cartera true
    $scope.OcultaGridModal = function (value) 
    {
        $rootScope.showGrid = value;
    };

    //LQMA 07032016
    $scope.IniciaLote = function(){
        //$("#modalNuevoLote").modal('show');

        /*if(($rootScope.nombreLoteNuevo == null) || ($rootScope.nombreLoteNuevo == ''))
              alertFactory.warning('Debe capturar el nombre del Lote');
        else  */ //LQMA 10032016
        /*pagoRepository.getPagosPadre($scope.idEmpresa,$rootScope.currentEmployee,$rootScope.nombreLoteNuevo)
            .then(function successCallback(response) 
            {  
                $rootScope.idLotePadre = response.data;
                if($rootScope.showGrid) {
                    $rootScope.modalSeleccionados = $scope.gridApi.selection.getSelectedRows();
                    $rootScope.gridOptions.data = $rootScope.modalSeleccionados;
                }   
                $('#inicioModal').modal('hide');

                $scope.ObtieneLotes(1); //conserva el lote recien insertado

            }, function errorCallback(response) {                
                alertFactory.error('Error al insertar Lote.');
            });*/
         //LQMA 10032016
        var newLote = {idLotePago:'0',idEmpresa:$scope.idEmpresa,idUsuario:$rootScope.currentEmployee,fecha:'',nombre:$rootScope.nombreLoteNuevo,estatus:0};
        $scope.ObtieneLotes(newLote);
        
        if($rootScope.showGrid) {
            $rootScope.modalSeleccionados = $scope.gridApi.selection.getSelectedRows();
            $rootScope.gridOptions.data = $rootScope.modalSeleccionados;
        }
        
        $('#inicioModal').modal('hide');

    }; //FIN inicia Lote

    $scope.llenaGrid = function () {

        if(!$rootScope.showGrid){ //LQMA  si esta oculto, consultamos toda la cartera
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
        }// esta oculto
        else{
            ConfiguraGrid();
            $rootScope.gridOptions.data = $rootScope.modalSeleccionados;

        }
    };  //Propiedades    

    var llenaGridSuccessCallback = function (data, status, headers, config) {
                $rootScope.gridOptions.data = data;
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
                $rootScope.gridOptions.data = $scope.data;                
 
                setTimeout(function()
                { 

                 $scope.selectAll();
                 //FAL evita que se alteren los datos al seleccionar todos
                 $scope.grdinicia = true;
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

$rootScope.gridOptions = {
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
           name: 'nombreAgrupador', grouping: { groupPriority: 0 }, sort: { priority: 0, direction: 'asc' }, width: '15%',displayName: 'Grupo', enableCellEdit: false
         },
         {
           name: 'proveedor', grouping: { groupPriority: 1 }, sort: { priority: 1, direction: 'asc' }, width: '15%',name: 'proveedor'
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
         { name: 'fechaPromesaPago', displayName: 'Fecha Promesa de Pago', type: 'date', cellFilter: 'date:"dd/MM/yyyy"', width: '17%'},
         { name: 'monto', displayName: 'Monto', width: '15%', cellFilter: 'currency' , enableCellEdit: false},
         { name: 'saldo', displayName: 'Saldo', width: '15%', cellFilter: 'currency' , enableCellEdit: false},
         { name: 'documento', displayName: '# Documento', width: '15%', enableCellEdit: false, headerTooltip: 'Documento # de factura del provedor', cellClass: 'cellToolTip' },
         { name: 'tipo', width: '15%', displayName: 'Tipo', enableCellEdit: false },
         { name: 'tipodocto', width: '15%', displayName: 'Tipo Documento', enableCellEdit: false },
         { name: 'cartera', width: '15%', displayName: 'Cartera', enableCellEdit: false },
         { name: 'moneda', width: '10%' , displayName: 'Moneda', enableCellEdit: false},
         { name: 'fechaVencimiento', displayName: 'Fecha de Vencimiento', type: 'date', cellFilter: 'date:"dd/MM/yyyy"', width: '17%', enableCellEdit: false},
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
         { name: 'cuentaPagadora', width: '15%', displayName: 'Banco'}
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
            // marcando los padres.

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
                           $scope.grdNoIncluido =  Math.round($scope.grdNoIncluido * 100) / 100 - Math.round(rowChanged.entity.Pagar * 100) / 100;
                          
                          //FAL actualizar cuenta pagadoras
                            if ($scope.grdinicia){
                            i=0;
                            $scope.grdBancos.forEach(function (banco, subtotal)
                            {
                               if(rowChanged.entity.cuentaPagadora == $scope.grdBancos[i].banco)
                                {
                                        $scope.grdBancos[i].subtotal = Math.round($scope.grdBancos[i].subtotal * 100) / 100 + Math.round(rowChanged.entity.Pagar * 100) / 100;
                                        $scope.grdApagar = $scope.grdApagar + rowChanged.entity.Pagar;
                                   }
                                   
                                   i++;                           
                                });
                            }
                        }
                        else{
                            $scope.grdNoIncluido = Math.round($scope.grdNoIncluido * 100) / 100 + Math.round(rowChanged.entity.Pagar * 100) / 100;
                           
                            //FAL actualizar cuenta pagadoras
                            i=0;
                            if ($scope.grdinicia) {
                                $scope.grdBancos.forEach(function (banco, subtotal)
                                {
                                   if(rowChanged.entity.cuentaPagadora == $scope.grdBancos[i].banco)
                                   {
                                        $scope.grdBancos[i].subtotal = Math.round($scope.grdBancos[i].subtotal * 100) / 100 - Math.round(rowChanged.entity.Pagar * 100) / 100;
                                        $scope.grdApagar = $scope.grdApagar - rowChanged.entity.Pagar;
                                   }
                                   i++;                           
                                });
                            }
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
                                //FAL trabaja con las variables dependiendo si se edita o cambia la fecha
                $scope.cantidadUpdate = newValue - oldValue;
                
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
                            else{
                                $scope.grdReprogramado =  Math.round($scope.grdReprogramado * 100) / 100 + Math.round(rowEntity.Pagar * 100) / 100;
                                $scope.grdApagar = Math.round($scope.grdApagar * 100) / 100 - Math.round(rowEntity.Pagar* 100) / 100
                            }
                    }        
                    
                } 
                if (colDef.name == 'Pagar') {
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
                                else{
                                    $scope.grdNoIncluido =  Math.round($scope.grdNoIncluido * 100) / 100 - Math.round($scope.cantidadUpdate * 100) / 100;
                                    $scope.grdApagar = Math.round($scope.grdApagar * 100) / 100 + Math.round($scope.cantidadUpdate* 100) / 100
                                }
                            }
                 }
              });               
                    
          $scope.gridApi.selection.selectAllRows(true);  
        }
    } //grid options    
};//funcion

 $scope.selectAll = function() {
    //FAL se analizan los registros para selccionarlos y se obtienen los totales relacionados al grid
    $scope.grdApagar = 0;
    $scope.grdnoPagable = 0;
    $scope.grdBancos = [];
    $scope.grdinicia = false;
    $rootScope.gridOptions.data.forEach(function (grDatosSel, i)
    {
       if(grDatosSel.ordenBloqueada == 'True')
       {
        $scope.grdnoPagable = Math.round($scope.grdnoPagable * 100) / 100 + Math.round(grDatosSel.saldo * 100) / 100;
        $scope.grdApagar = Math.round($scope.grdApagar * 100) / 100 + Math.round(grDatosSel.saldo * 100) / 100;
       }
       else
       {
        $scope.grdApagar = Math.round($scope.grdApagar * 100) / 100 + Math.round(grDatosSel.saldo * 100) / 100;
        $scope.gridApi.selection.selectRow($scope.gridOptions.data[i]);
       };
       if (i == 0)
       {
        $scope.grdBancos.push(
                    {
                    banco: grDatosSel.cuentaPagadora,
                    subtotal: grDatosSel.saldo
                    });
       }
       else
       {    
            var add = true;
            var j = 0;
            for (var j = 0; j < $scope.grdBancos.length; j++)
            {
                if ($scope.grdBancos[j].banco == grDatosSel.cuentaPagadora)
                {   
                    add = false
                    $scope.grdBancos[j].subtotal = $scope.grdBancos[j].subtotal + grDatosSel.saldo
                }
            }
            if (add)
            {
                $scope.grdBancos.push(
                    {
                    banco: grDatosSel.cuentaPagadora,
                    subtotal: grDatosSel.saldo
                    });
            }
       };
    });

        $scope.grdReprogramado = 0;
        $scope.grdNoIncluido = 0;
        $rootScope.gridOptions.isRowSelectable = function(row){
        if(row.entity.ordenBloqueada == 'True'){
          return false;
        } else {
          return true;
        }
      };
      $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
      $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
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
//LQMA 08032016

$rootScope.ConsultaLote = function(Lote,index) {
    alertFactory.info('Consulta de Lote ' + index);

    $scope.idLote = Lote.idLotePago;

    $scope.LlenaIngresos(); 
    $scope.LlenaEgresos();

    pagoRepository.getOtrosIngresos($scope.idLote)
            .then(function successCallback(response) 
            {  
                $scope.caja = response.data[0].pio_caja;
                $scope.cobrar = response.data[0].pio_cobranzaEsperada;

            }, function errorCallback(response) {                
                alertFactory.error('Error al obtener Otros Ingresos.');
            });

    pagoRepository.getTransferencias($scope.idLote)
            .then(function successCallback(response) 
            {  
                $scope.transferencias = [];

                angular.forEach(response.data, function(transferencia, key){                    
                    var newTransferencia = transferencia;
                    $scope.transferencias.push(newTransferencia);
                });                

            }, function errorCallback(response) {                
                alertFactory.error('Error al obtener Transferencias.');
            });

    pagoRepository.getDatosAprob($scope.idLote)
                .success(llenaGridSuccessCallback)
                .error(errorCallBack);
}

//LQMA funcion para guardar datos del grid (se implementara para guardar Ingresos bancos, otros , Transferencias)
$scope.Guardar = function() {

    var negativos = 0;
    angular.forEach($rootScope.ingresos, function(ingreso, key){
            if(parseInt(ingreso.disponible) < 0)
                negativos += 1;
        });

    setTimeout(function(){guardaValida(negativos);},500);
    
  };//fin de funcion guardar

  var guardaValida=function(negativos){

    if(negativos > 0)
        alertFactory.warning('Existen disponibles en valores negativos. Verifique las transferencias.');
    else 
    {
        //alertFactory.success('Se guardaron los datos.');
        //pagoRepository.getPagosPadre($rootScope.currentEmployee)
          pagoRepository.getPagosPadre($scope.idEmpresa,$rootScope.currentEmployee,$rootScope.nombreLoteNuevo)
            .then(function successCallback(response) 
            {   
                $rootScope.idLotePadre = response.data;

                var array = [];
                var rows =  $scope.gridApi.grid.rows;
                var count = 0;

                rows.forEach(function (row,i) {

                            var elemento = {};

                             elemento.pal_id_lote_pago = $rootScope.idLotePadre; //response.data;
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

                 var jsIngresos = angular.toJson($rootScope.ingresos); //delete $scope.ingresos['$$hashKey'];
                 var jsTransf = angular.toJson($scope.transferencias);
                 var jsEgresos = angular.toJson($rootScope.egresos);
                    
                    pagoRepository.setDatos(array,$rootScope.currentEmployee,$rootScope.idLotePadre,jsIngresos,jsTransf,$scope.caja,$scope.cobrar,jsEgresos,1)
                        .then(function successCallback(response) {
                            
                            alertFactory.success('Se guardaron los datos.');

                        }, function errorCallback(response) {                
                            alertFactory.error('Error al guardar Datos');
                        }
                    );     
            }, function errorCallback(response) {                
                alertFactory.error('Error al insertar en tabla padre.');
            });
        }//fin else
  };

/***************************************************************************************************************
    Funciones de guardado de datos
    END
****************************************************************************************************************/

    $scope.addTransferencia = function()
    {
        var index = $scope.transferencias.length;
        var newTransferencia = {bancoOrigen:'', bancoDestino: '', importe:0, index:index};
        $scope.transferencias.push(newTransferencia);
    };

    $scope.delTransferencia = function(transferencia)
    {    
        $scope.transferencias.splice(transferencia.index,1);

        var index = 0;
        angular.forEach($scope.transferencias, function(transferencia, key){
                    transferencia.index = index;
                    index +=1;
        });

        $scope.calculaTotalOperaciones();
        recalculaIngresos();   
    };

    $scope.selBancoIngreso = function(ingreso,transferencia)
    {   
        if(ingreso.disponible <= 0)
            alertFactory.warning('El saldo disponible de esta cuenta es 0 o menor. Elija otra.');
        else
            if(transferencia.bancoOrigen != ingreso.cuenta)
            {
                angular.forEach($rootScope.ingresos, function(ingreso, key){     
                    if(ingreso.cuenta == transferencia.bancoOrigen)                
                            ingreso.disponible = parseInt(ingreso.disponible) + parseInt(transferencia.importe);
                });

                transferencia.bancoOrigen = ingreso.cuenta;
                transferencia.disponibleOrigen = ingreso.disponible;
                transferencia.importe = 0;
            }

        $scope.calculaTotalOperaciones();
        recalculaIngresos(); 
    };

    $scope.selBancoEgreso = function(egreso,transferencia)
    {
        transferencia.bancoDestino = egreso.cuenta;

        $scope.calculaTotalOperaciones();
        recalculaIngresos(); 
    };

    $scope.calculaSaldoIngresos = function(ingreso)
    {    
        var total = 0;

        angular.forEach($scope.transferencias, function(transferencia, key){
                if(transferencia.bancoOrigen == ingreso.cuenta)
                {
                    total = parseInt(total) + parseInt(transferencia.importe);
                    //transferencia.disponibleOrigen = ingreso.disponible;
                }
            });

        ingreso.disponible = parseInt(ingreso.saldo) - parseInt(total);

        angular.forEach($rootScope.egresos, function(egreso, key){
                    if((ingreso.cuenta == egreso.cuenta) && egreso.ingreso == 1)
                        egreso.saldoIngreso = ingreso.disponible;
            });

        angular.forEach($scope.transferencias, function(transferencia, key){
                if(transferencia.bancoOrigen == ingreso.cuenta)
                    transferencia.disponibleOrigen = ingreso.disponible;
            });

        if(parseInt(ingreso.disponible) < 0)
            alertFactory.warning('El saldo disponible de esta cuenta es menor a 0. Verifique las transferencias.');
        //setTimeout(function(){recalculaIngresos()},100);    

        $scope.calculaTotalOperaciones();
    };
    
    $scope.calculaTransferencia = function(transferencia)
    {
        //$scope.ingresos = [{id: 1, nombre:'Santander', cuenta: 94039,saldo: 40000, disponible: 25000, ingreso:1, egreso:0}]
        //$scope.transferencias = [{bancoOrigen:'', bancoDestino: '', importe:0}]    
        var total = 0;
        
        angular.forEach($scope.transferencias, function(transferencia1, key){
                if(transferencia1.bancoOrigen == transferencia.bancoOrigen)
                    total +=1;
            });

        if(total == 1)
        {
            if((transferencia.importe > transferencia.disponibleOrigen) ||  (transferencia.disponibleOrigen <=0))
            {
                alertFactory.warning('El valor es mayor al saldo disponible!');
                transferencia.importe = 0;
            }
        }
        else
        {
            angular.forEach($rootScope.ingresos, function(ingreso, key){
                if(ingreso.cuenta == transferencia.bancoOrigen)
                {
                    if(ingreso.disponible - transferencia.importe < 0)    
                    {
                        alertFactory.warning('El valor es mayor al saldo disponible!');
                        transferencia.importe = 0;
                    }
                    else{
                        ingreso.disponible =  ingreso.disponible - transferencia.importe;
                        //transferencia.disponibleOrigen = ingreso.disponible;
                    }
                }        
            });
        }    

        $scope.calculaTotalOperaciones();
        recalculaIngresos();
    };

    var recalculaIngresos = function()
    {
        angular.forEach($rootScope.ingresos, function(ingreso, key){
            ingreso.disponible = ingreso.saldo;
            angular.forEach($scope.transferencias, function(transferencia, key){
                if(ingreso.cuenta == transferencia.bancoOrigen)
                    ingreso.disponible = ingreso.disponible - transferencia.importe;
            });

            /*angular.forEach($rootScope.TotalxEmpresas, function(empresa, key){
                    angular.forEach($rootScope.egresos, function(egreso, key){
                            if(empresa.cuentaPagadora == egreso.cuenta) 
                                empresa.sumaSaldo = egreso.total;
                    });
                });*/

        });        
    }

    $scope.calculaTotalOperaciones = function()
    {        
        //$scope.egresos = [{id: 1,nombre:'HSBC', cuenta: 228139,saldo: 90000, aTransferir: 25000, total:0,excedente:0, ingreso:1, egreso:0},
        angular.forEach($rootScope.egresos, function(egreso, key){
                var totalDestino = 0;
                angular.forEach($scope.transferencias, function(transferencia, key){
                    if(transferencia.bancoDestino == egreso.cuenta)
                         totalDestino = totalDestino + parseInt(transferencia.importe);
                });

                angular.forEach($rootScope.ingresos, function(ingreso, key){
                            if((ingreso.cuenta == egreso.cuenta) && egreso.ingreso == 1)
                                egreso.saldoIngreso = ingreso.saldo;
                });

                egreso.aTransferir = totalDestino;
                var sss = parseInt(egreso.ingreso);
                var suma = (sss == 1)?parseInt(egreso.saldoIngreso):parseInt(egreso.saldo);
                egreso.total = parseInt(egreso.aTransferir) + suma;
                //egreso.excedente = egreso.totalPagar - egreso.total;
                egreso.excedente = parseInt(egreso.totalPagar) - parseInt(egreso.total);
        });
    };

    $scope.presskey = function(event){
        if (event.which === 13)
        {            
            $scope.calculaTotalOperaciones();
            recalculaIngresos();
        }
    };


    $scope.getTotal = function(opcion){
        var total = 0;
    
        switch(opcion){

        case 'egresosTotal':
                angular.forEach($rootScope.egresos, function(egreso, key){        
                    total += parseInt(egreso.total);
                });
                $rootScope.FlujoEfectivo = total;
                break;

        case 'ingresoSaldo':
                angular.forEach($rootScope.ingresos, function(ingreso, key){
                   total += parseInt((ingreso.saldo == '')?0:ingreso.saldo); 
                });
                break;

        case 'ingresoDisponible':
                angular.forEach($rootScope.ingresos, function(ingreso, key){
                   total += parseInt((ingreso.disponible == '')?0:ingreso.disponible); 
                });
                break;

        case 'excedente':
                angular.forEach($rootScope.egresos, function(egreso, key){
                    total += parseInt(egreso.excedente);
                });
                break;

        case 'otrosIngresos':                
                    total += parseInt(($scope.caja == '' || $scope.caja == null )?0:$scope.caja) + parseInt(($scope.cobrar == '' || $scope.cobrar == null)?0:$scope.cobrar);
                break;

        case 'transferencias':
                    angular.forEach($scope.transferencias, function(transferencia, key){
                        total += parseInt(transferencia.importe);
                    });     
                break;
        case 'saldo':
                    angular.forEach($rootScope.egresos, function(egreso, key){
                        total += (egreso.ingreso == 1)?parseInt(egreso.saldoIngreso):parseInt(egreso.saldo);
                    });     
                break;                                
        case 'aTransferir':
                    angular.forEach($rootScope.egresos, function(egreso, key){
                        total += parseInt(egreso.aTransferir);
                    });     
                break;
        } 

        return total;
    } //get total end
    //LQMA 10032016
    $rootScope.CrearNuevoLote = function(){

      var lotesPendientes = $.grep($rootScope.noLotes.data, function( n, i ) {
                    return n.estatus===0;
                });

        if(lotesPendientes.length > 0)
            alertFactory.warning('Existe lotes sin guardar.');
        else{
            $rootScope.NuevoLote = true;
            $('#inicioModal').modal('show');
        }        
    }

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
