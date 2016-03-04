registrationModule.controller("pagoController",function(e,a,t,n,o,r,i,d,l,c,u){e.idEmpresa=2,e.idCuenta=4;var s=function(e,a,t,n){l.error("Ocurrio un problema")};e.init=function(){p(),$.fn.bootstrapSwitch.defaults.offColor="info",$.fn.bootstrapSwitch.defaults.onText="Todos",$.fn.bootstrapSwitch.defaults.offText="Pagables",$(".switch-checkbox").bootstrapSwitch()};var g=function(){e.llenaGrid(),e.llenaEncabezado()},p=function(){if(""!=getParameterByName("employee")&&(i.currentEmployee=getParameterByName("employee")),null==i.currentEmployee){var e=prompt("Ingrese un número de empleado",1);i.currentEmployee=e}null!=i.currentEmployee?m():(w(),setTimeout(function(){g()},500))},m=function(){""!=getParameterByName("id")&&(i.currentId=getParameterByName("id")),null!=i.currentId?y():(w(),setTimeout(function(){g()},500))},y=function(){""!=getParameterByName("idOp")&&(i.currentIdOp=getParameterByName("idOp")),null!=i.currentIdOp?(w(),setTimeout(function(){g()},500)):(w(),setTimeout(function(){g()},500))};e.colapsado=!1,e.Resize=function(){e.colapsado=!e.colapsado},e.llenaGrid=function(){null!=i.currentId?(c.getDatosAprob(i.currentId).success(f).error(s),e.llenaEncabezado()):c.getDatos(e.idEmpresa).success(f).error(s)};var f=function(a,t,n,o){e.gridOptions.data=a,e.data=a,e.carteraVencida=0,e.cantidadTotal=0,e.cantidadUpdate=0,e.noPagable=0,e.Reprogramable=0;for(var r=0;r<e.data.length;r++)e.data[r].Pagar=e.data[r].saldo,"True"==e.data[r].ordenBloqueada&&(e.data[r].Pagar=0),"False"==e.data[r].documentoPagable&&(e.data[r].Pagar=0),e.carteraVencida=e.carteraVencida+e.data[r].saldo;e.noPagable=e.carteraVencida-e.cantidadTotal,e.gridOptions.data=e.data,l.success("Se lleno el grid."),setTimeout(function(){e.selectAll()},500)};e.llenaEncabezado=function(){c.getEncabezado(e.idCuenta).then(function a(t){e.scencabezado=t.data,l.success("Se lleno el encabezado.")},function t(e){l.error("Error al obtener los datos del encabezado.")})};var h=function(e,a){return e.forEach(function(e){e.grouping&&e.grouping.groupPriority>-1&&e.treeAggregation.type!==n.aggregation.CUSTOM&&(e.treeAggregation.type=n.aggregation.CUSTOM,e.customTreeAggregationFn=function(e,a,t,n){"undefined"==typeof e.value&&(e.value=0),e.value=e.value+n.entity.Pagar},e.customTreeAggregationFinalizerFn=function(e){"undefined"!=typeof e.groupVal?e.rendered=e.groupVal+" ("+r("currency")(e.value)+")":e.rendered=null})}),e},w=function(){e.gridOptions={enableGridMenu:!0,enableFiltering:!0,enableGroupHeaderSelection:!0,treeRowHeaderAlwaysVisible:!0,showColumnFooter:!0,showGridFooter:!0,height:900,cellEditableCondition:function(e){return e.row.entity.ordenBloqueada},columnDefs:[{name:"proveedor",grouping:{groupPriority:0},sort:{priority:0,direction:"asc"},width:"20%",name:"proveedor",width:"20%",cellTemplate:'<div><div ng-if="!col.grouping || col.grouping.groupPriority === undefined || col.grouping.groupPriority === null || ( row.groupHeader && col.grouping.groupPriority === row.treeLevel )" class="ui-grid-cell-contents" title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div></div>'},{field:"Pagar",displayName:"Pagar (total)",width:"10%",cellFilter:"currency",aggregationType:o.aggregationTypes.sum,treeAggregationType:n.aggregation.SUM,enableCellEdit:1==i.currentIdOp?!1:!0,editableCellTemplate:'<div><form name="inputForm"><input type="number" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD"></form></div>',customTreeAggregationFinalizerFn:function(e){e.rendered=e.value}},{field:"saldoPorcentaje",displayName:"Porcentaje %",width:"10%",cellFilter:"number: 6",aggregationType:o.aggregationTypes.sum,treeAggregationType:n.aggregation.SUM,enableCellEdit:!1,customTreeAggregationFinalizerFn:function(e){e.rendered=e.value}},{name:"monto",displayName:"Monto",width:"13%",cellFilter:"currency",enableCellEdit:!1},{name:"saldo",displayName:"Saldo",width:"13%",cellFilter:"currency",enableCellEdit:!1},{name:"documento",displayName:"# Documento",width:"15%",enableCellEdit:!1,headerTooltip:"Documento # de factura del provedor",cellClass:"cellToolTip"},{name:"tipo",width:"15%",displayName:"Tipo",enableCellEdit:!1},{name:"tipodocto",width:"15%",displayName:"Tipo Documento",enableCellEdit:!1},{name:"cartera",width:"15%",displayName:"Cartera",enableCellEdit:!1},{name:"moneda",width:"10%",displayName:"Moneda",enableCellEdit:!1},{name:"fechaVencimiento",displayName:"Fecha de Vencimiento",type:"date",cellFilter:'date:"dd/MM/yyyy"',width:"17%",enableCellEdit:!1},{name:"fechaPromesaPago",displayName:"Fecha Promesa de Pago",type:"date",cellFilter:'date:"dd/MM/yyyy"',width:"17%"},{name:"fechaRecepcion",displayName:"Fecha Recepción",type:"date",cellFilter:'date:"dd/MM/yyyy"',width:"17%",enableCellEdit:!1},{name:"fechaFactura",displayName:"Fecha Factura",type:"date",cellFilter:'date:"dd/MM/yyyy"',width:"17%",enableCellEdit:!1},{name:"ordenCompra",displayName:"Orden de compra",width:"13%",enableCellEdit:!1},{name:"estatus",displayName:"Estatus",width:"10%",enableCellEdit:!1},{name:"anticipo",displayName:"Anticipo",width:"10%",enableCellEdit:!1},{name:"anticipoAplicado",displayName:"Anticipo Aplicado",width:"15%",enableCellEdit:!1},{name:"cuenta",width:"15%",displayName:"# Cuenta"},{name:"documentoPagable",width:"15%",displayName:"Estatus del Documento"},{name:"ordenBloqueada",displayName:"Bloqueada",width:"20%",cellTemplate:'<button ng-click="row.entity.ordenBloqueada = !row.entity.ordenBloqueada" ng-model="row.entity.ordenBloqueada" style="{{row.entity.ordenBloqueada ? "background-color: lightgreen" : ""}}"></button>'}],rowTemplate:"<div ng-class=\"{'ordenBloqueada':(row.entity.ordenBloqueada=='True' && ((row.entity.idEstatus < 1 || row.entity.idEstatus > 5) && row.entity.idEstatus != 20) && !row.isSelected),'bloqueadaSelec': (row.isSelected && row.entity.ordenBloqueada=='True') || (row.isSelected && ((row.entity.idEstatus >= 1 && row.entity.idEstatus <= 5) || row.entity.idEstatus == 20)),'selectNormal': (row.isSelected && row.entity.ordenBloqueada=='False' && ((row.entity.idEstatus < 1 || row.entity.idEstatus > 5) && row.entity.idEstatus != 20)),'docIncompletos': (!row.isSelected && ((row.entity.idEstatus >= 1 && row.entity.idEstatus <= 5) || row.entity.idEstatus == 20) && row.entity.ordenBloqueada=='False'),'bloqDocIncom': (!row.isSelected && ((row.entity.idEstatus >= 1 && row.entity.idEstatus <= 5) || row.entity.idEstatus == 20) && row.entity.ordenBloqueada=='True')}\"> <div ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.uid\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader == 'True'}\" ui-grid-cell></div></div>",onRegisterApi:function(a){e.gridApi=a,e.cantidadTotal=e.cantidadTotal,e.gridApi.selection.on.rowSelectionChanged(e,function(a){"undefined"!=typeof a.treeLevel&&a.treeLevel>-1?(children=e.gridApi.treeBase.getRowChildren(a),children.forEach(function(t){a.isSelected?e.gridApi.selection.selectRow(t.entity):e.gridApi.selection.unSelectRow(t.entity)})):a.isSelected?(e.Reprogramable=Math.round(100*e.Reprogramable)/100-Math.round(100*a.entity.Pagar)/100,e.cantidadTotal=Math.round(100*e.cantidadTotal)/100+Math.round(100*a.entity.Pagar)/100):(e.Reprogramable=Math.round(100*e.Reprogramable)/100+Math.round(100*a.entity.Pagar)/100,e.cantidadTotal=Math.round(100*e.cantidadTotal)/100-Math.round(100*a.entity.Pagar)/100)}),a.selection.on.rowSelectionChangedBatch(e,function(a){a.forEach(function(a,t){a.isSelected?e.cantidadTotal=Math.round(100*e.cantidadTotal)/100+Math.round(100*a.entity.Pagar)/100:e.cantidadTotal=Math.round(100*e.cantidadTotal)/100-Math.round(100*a.entity.Pagar)/100})}),a.edit.on.afterCellEdit(e,function(a,t,n,o){if(e.cantidadUpdate=n-o,e.cantidadTotal=Math.round(100*e.cantidadTotal)/100+Math.round(100*e.cantidadUpdate)/100,e.Reprogramable=Math.round(100*e.Reprogramable)/100-Math.round(100*e.cantidadUpdate)/100,"fechaPromesaPago"==t.name)if(""==o)if(""==n);else{old_date=Date.now();var r=new Date(n);r<old_date&&(l.warning("La fecha promesa de pago no puede ser menor a "+old_date+" !!!"),a.fechaPromesaPago=old_date)}else{old_date=Date.now();var r=new Date(n);r<old_date&&(l.warning("La fecha promesa de pago no puede ser menor a "+old_date+"  !!!"),a.fechaPromesaPago=old_date)}"Pagar"==t.name&&(""==o||n>o&&(l.warning("El pago no puede ser mayor a "+o+"  !!!"),a.Pagar=o))}),e.gridApi.selection.selectAllRows()}}};e.selectAll=function(){e.gridApi.selection.selectAllRows()},e.FiltrarCartera=function(a){console.log(a),e.gridApi.grid.columns[21].filters[0].term=a,e.gridApi.core.notifyDataChange(o.dataChange.COLUMN),e.gridApi.grid.refresh()};var E=function(e){return!Array.isArray(e)&&e-parseFloat(e)+1>=0};e.guardar=function(){c.getPagosPadre(i.currentEmployee).then(function a(t){var n=[],o=e.gridApi.grid.rows,r=0;o.forEach(function(e,a){var o={};o.pag_id=t.data,o.pad_polTipo=e.entity.polTipo,o.pad_polAnnio=e.entity.annio,o.pad_polMes=e.entity.polMes,o.pad_polConsecutivo=e.entity.polConsecutivo,o.pad_polMovimiento=e.entity.polMovimiento,o.pad_fechaPromesaPago=""==e.entity.fechaPromesaPago?"01/01/1999":e.entity.fechaPromesaPago,o.pad_saldo=e.entity.Pagar,e.isSelected?o.tab_revision=1:o.tab_revision=0,n.push(o)}),c.setDatos(n,i.currentEmployee,t.data).then(function d(e){l.success("Se guardaron los datos.")},function u(e){l.error("Error al guardar Datos")})},function t(e){l.error("Error al insertar en tabla padre.")})}}),registrationModule.service("stats",function(){var e=function(e,t){a(e),angular.isUndefined(e.stats.accumulator)&&(e.stats.accumulator=[]),e.stats.accumulator.push(t)},a=function(e){angular.isUndefined(e.stats)&&(e.stats={sum:0})},t=function(e,a){angular.isUndefined(e[a])?e[a]=1:e[a]++},n={aggregator:{accumulate:{numValue:function(a,t,n){return e(a,n)},fieldValue:function(a,t){return e(a,t)}},mode:function(e,n){a(e);var o=n;(angular.isUndefined(o)||null===o)&&(o=e.col.grid.options.groupingNullLabel),t(e.stats,o),(e.stats[o]>e.maxCount||angular.isUndefined(e.maxCount))&&(e.maxCount=e.stats[o],e.value=o)},sumSquareErr:function(e,o,r){a(e),t(e.stats,"count"),e.stats.sum+=r,n.aggregator.accumulate.numValue(e,o,r)}},finalizer:{cleanup:function(e){delete e.stats,angular.isUndefined(e.rendered)&&(e.rendered=e.value)},sumSquareErr:function(e){if(e.value=0,0!==e.count){var a=e.stats.sum/e.stats.count,t;angular.forEach(e.stats.accumulator,function(n){t=n-a,e.value+=t*t})}}}};return n});