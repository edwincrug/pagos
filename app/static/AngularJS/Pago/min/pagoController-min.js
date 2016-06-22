registrationModule.controller("pagoController",function(e,a,o,t,n,r,s,l,d,c,u,g){function p(e){var a=e.date,o=e.mode;return"day"===o&&(0===a.getDay()||6===a.getDay())}function f(a){var o=a.date,t=a.mode;if("day"===t)for(var n=new Date(o).setHours(0,0,0,0),r=0;r<e.events.length;r++){var i=new Date(e.events[r].date).setHours(0,0,0,0);if(n===i)return e.events[r].status}return""}e.idEmpresa=4,e.idUsuario=14,null==s.currentEmployee?s.currentEmployee=14:e.idUsuario=s.currentEmployee,s.currentId=null,s.currentIdOp=null,e.idLote=0,s.formData={},s.proceso="",e.radioModel="",e.radioTotales=1,s.escenarios=[],e.fechaHoy=new Date,s.blTotales=!0,s.grdBancos=[],s.msgFiltros="",s.tipoEmpresa="",s.pagoDirecto="",s.tipoEmpresaVarios=!0,e.refMode=!0,s.pagoDirectoSeleccion=!1,s.pdPlanta=!1,s.pdBanco=!1,s.refPlanta=0,s.refpdBanco=0,s.selPagoDirecto=!1,s.selPlantaBanco=!1;var m=function(e,a,o,t){d.error("Ocurrio un problema")};e.iniciaCheck=function(){$("#switch-onText").bootstrapSwitch(),$("#switch-onText").on("switchChange.bootstrapSwitch",function(){var a=$("#switch-onText").bootstrapSwitch("state");a?e.OcultaGridModal(!1):e.MuestraGridModal(!0)})},e.isNumberKey=function(e){var a=e.which?e.which:event.keyCode;return!(a>31&&(48>a||a>57))},e.init=function(){if(e.caja=0,e.cobrar=0,v(),s.accionPagina=!1,$.fn.bootstrapSwitch.defaults.offColor="info",$.fn.bootstrapSwitch.defaults.onText="Lote",$.fn.bootstrapSwitch.defaults.offText="Global",$(".switch-checkbox").bootstrapSwitch(),e.showSelCartera=!0,e.llenaEncabezado(),$("#lgnUser").val().indexOf("[")>-1?$("#lgnUser").val().indexOf("[")>-1&&!l.get("lgnUser")&&(""!=getParameterByName("employee")?s.currentEmployee=getParameterByName("employee"):alert("Inicie sesión desde panel de aplicaciones.")):l.set("lgnUser",$("#lgnUser").val()),e.transferencias=[{bancoOrigen:"",bancoDestino:"",importe:0,disponibleOrigen:0,index:0}],s.idOperacion=0,""!=getParameterByName("idOperacion")){s.idOperacion=getParameterByName("idOperacion");var a=getParameterByName("idLote");s.idAprobador=getParameterByName("idAprobador"),s.idAprobacion=getParameterByName("idAprobacion"),s.idNotify=getParameterByName("idNotify"),c.getLotes(e.idEmpresa,s.currentEmployee,0,a).then(function o(a){c.getTotalxEmpresa(e.idEmpresa).then(function o(a){s.GranTotal=0,s.TotalxEmpresas=a.data,e.idEmpresa=e.idEmpresa,i=0,s.TotalxEmpresas.forEach(function(e,a){s.GranTotal=s.GranTotal+s.TotalxEmpresas[i].sumaSaldo,i++}),e.showTotales=!0,e.showSelCartera=!0},function t(a){s.TotalxEmpresas=[],s.GranTotal=0,s.showGrid=!1,e.showSelCartera=!1,e.showTotales=!1,e.traeTotalxEmpresa.emp_nombre="La empresa seleccionada no tiene información"}),s.noLotes=a,s.noLotes.data.length>0&&($("#inicioModal").modal("hide"),d.success("Total de lotes: "+s.noLotes.data.length),s.idLotePadre=s.noLotes.data[s.noLotes.data.length-1].idLotePago,s.estatusLote=s.noLotes.data[s.noLotes.data.length-1].estatus,s.accionPagina=!0,s.ConsultaLote(s.noLotes.data[s.noLotes.data.length-1],s.noLotes.data.length,0),s.ProgPago=!0,s.selPagoDirecto=!0,e.traeBancosCompleta(),setTimeout(function(){$("#btnSelectAll").click()},3e3))},function t(e){d.error("Error al obtener el Lote")})}e.traeEmpresas()};var b=function(){if($("#lgnUser").val().indexOf("[")>-1){if($("#lgnUser").val().indexOf("[")>-1&&!l.get("lgnUser")){if(""!=getParameterByName("employee"))return void(s.currentEmployee=getParameterByName("employee"));alert("Inicie sesión desde panel de aplicaciones."),window.close()}}else l.set("lgnUser",$("#lgnUser").val());s.currentEmployee=l.get("lgnUser")},h=function(){""!=getParameterByName("id")&&(s.currentId=getParameterByName("id")),null!=s.currentId?P():(v(),setTimeout(function(){Prepagos()},500))},P=function(){""!=getParameterByName("idOp")&&(s.currentIdOp=getParameterByName("idOp")),null!=s.currentIdOp?(v(),setTimeout(function(){Prepagos()},500)):(v(),setTimeout(function(){Prepagos()},500))};e.llenaEncabezado=function(){c.getEncabezado(e.idEmpresa).then(function a(o){e.scencabezado=o.data},function o(e){d.error("Error al obtener los datos del encabezado.")})},e.traeEmpresas=function(){s.showGrid=!1,c.getEmpresas(e.idUsuario).then(function a(o){s.empresas=o.data,$("#inicioModal").modal("show"),e.showTotales=!1},function o(e){d.error("Error en empresas.")})},e.llenaParametroEscenarios=function(){c.getParametrosEscenarios(s.tipoEmpresa).then(function e(a){s.escenarios=a.data,s.pdPlanta=s.escenarios.Pdbanco,s.pdBanco=s.escenarios.Pdplanta,s.refPlanta=s.escenarios.TipoRefPlanta,s.refpdBanco=s.escenarios.tipoRefBanco,(s.pdPlanta||s.pdBanco)&&(s.selPagoDirecto=!0)},function a(e){d.error("Error al obtener los parametros del escenario de pagos.")})},e.traeBancosCompleta=function(){s.grdBancos=[],s.grdBancosoriginal=[],c.getBancosCompleta(e.idEmpresa).then(function a(e){s.bancosCompletas=e.data,s.GranTotalaPagar=0,s.GranTotalnoPagable=0,s.GranTotalPagable=0,i=0,s.bancosCompletas.forEach(function(e,a){s.GranTotalaPagar=s.GranTotalaPagar+s.bancosCompletas[i].sumaSaldo,s.GranTotalnoPagable=s.GranTotalnoPagable+s.bancosCompletas[i].sumaSaldoNoPagable,s.GranTotalPagable=s.GranTotalPagable+s.bancosCompletas[i].sumaSaldoPagable,i++}),s.grdBancosoriginal=s.grdBancos},function o(e){d.error("Error en bancos con todos sus saldos.")})},e.traeTotalxEmpresa=function(a,o,t,n,r,l){$("#btnTotalxEmpresa").button("loading"),e.showTotales=!1,e.showSelCartera=!1,s.emp_nombrecto=t,s.rfc=n,c.getTotalxEmpresa(a).then(function d(t){s.GranTotal=0,s.TotalxEmpresas=t.data,e.idEmpresa=a,i=0,s.TotalxEmpresas.forEach(function(e,a){s.GranTotal=s.GranTotal+s.TotalxEmpresas[i].sumaSaldo,i++}),e.traeTotalxEmpresa.emp_nombre=o,e.showTotales=!0,s.tipoEmpresa=r,s.pagoDirecto=l,e.showSelCartera=!0,e.ObtieneLotes(0),$("#btnTotalxEmpresa").button("reset"),e.llenaParametroEscenarios()},function u(a){s.TotalxEmpresas=[],s.GranTotal=0,s.showGrid=!1,e.showSelCartera=!1,e.showTotales=!1,e.traeTotalxEmpresa.emp_nombre="La empresa seleccionada no tiene información",$("#btnTotalxEmpresa").button("reset")}),e.traeBancosCompleta()},e.ObtieneLotes=function(a){c.getLotes(e.idEmpresa,s.currentEmployee,0,0).then(function o(e){var o=0;if(s.selPlantaBanco&&(o=1),s.noLotes=e,0!=a&&(s.noLotes.data.push(a),s.estatusLote=0),s.noLotes.data.length>0)d.success("Total de lotes: "+s.noLotes.data.length),s.idLotePadre=s.noLotes.data[s.noLotes.data.length-1].idLotePago,s.estatusLote=s.noLotes.data[s.noLotes.data.length-1].estatus,s.ConsultaLote(s.noLotes.data[s.noLotes.data.length-1],s.noLotes.data.length,0,o),s.ProgPago=!0;else{d.info("No existen Lotes"),s.NuevoLote=!0;var t=new Date;s.formData.nombreLoteNuevo=("0"+(t.getMonth()+1)).slice(-2)+("0"+t.getDate()).slice(-2)+t.getFullYear()+"-"+s.rfc+("0"+(s.noLotes.data.length+1)).slice(-2)}},function t(e){d.error("Error al obtener los Lotes")})},e.LlenaIngresos=function(){c.getIngresos(e.idEmpresa,e.idLote).then(function a(o){s.ingresos=o.data,e.LlenaEgresos()},function o(e){d.error("Error al obtener los Ingresos")})},e.LlenaEgresos=function(){c.getEgresos(e.idEmpresa,e.idLote).then(function a(o){s.egresos=o.data,angular.forEach(s.TotalxEmpresas,function(e,a){angular.forEach(s.egresos,function(a,o){e.cuentaPagadora==a.cuenta&&(a.totalPagar=e.sumaSaldo)})}),angular.forEach(s.egresos,function(e,a){angular.forEach(s.ingresos,function(a,o){a.cuenta==e.cuenta&&(e.ingreso=1)})}),e.calculaTotalOperaciones(),C()},function o(e){d.error("Error al obtener los Egresos")})},e.MuestraGridModal=function(e){setTimeout(function(){s.selectAllModal(),s.showGrid=!0},5e3)},e.OcultaGridModal=function(e){$("#btnTodalaCartera").button("loading"),s.selectAllModal(),s.showGrid=e,$("#btnTodalaCartera").button("reset")},e.IniciaLote=function(){s.crearLote=!0,s.selPlantaBanco=!1,$("#btnCrealote").button("loading"),null==s.formData.nombreLoteNuevo?(d.warning("Debe proporcionar el nombre del nuevo lote."),$("#btnCrealote").button("reset")):(e.gridOptions=null,v(),s.NuevoLote=!0,c.getDatos(e.idEmpresa).success(E).error(m))},e.IniciaLotePD=function(){s.crearLote=!0,s.pagoDirectoSeleccion=!0,s.selPlantaBanco=!0,$("#btnCrealotePD").button("loading"),null==s.formData.nombreLoteNuevo?(d.warning("Debe proporcionar el nombre del nuevo lote."),$("#btnCrealotePD").button("reset")):(e.gridOptions=null,v(),s.NuevoLote=!0,c.getDatos(e.idEmpresa).success(E).error(m))},e.ProgramacionPagos=function(){e.ObtieneLotes(0),e.LlenaIngresos(),s.accionPagina=!0,setTimeout(function(){$("#btnSelectAll").click()},500),e.grdinicia=e.grdinicia+1},e.llenaGrid=function(){s.showGrid?c.getDatos(e.idEmpresa).success(llenaGridSuccessCallback).error(m):(c.getDatos(e.idEmpresa).success(llenaGridSuccessCallback).error(m),e.llenaEncabezado())};var E=function(a,o,t,n){e.data=a,e.carteraVencida=0,e.cantidadTotal=0,e.cantidadUpdate=0,e.noPagable=0,e.Reprogramable=0;var r=1;s.pdPlanta=s.escenarios.Pdplanta,s.pdBanco=s.escenarios.Pdbanco,s.refPlanta=s.escenarios.TipoRefPlanta,s.refpdBanco=s.escenarios.tipoRefBanco,s.grdPagoDirecto=[];for(var i=0,l=e.data.length,d=0;l>d;d++){if(e.data[d].Pagar=e.data[d].saldo,e.data[d].fechaPago=e.data[d].fechaPromesaPago,"1900-01-01T00:00:00"==e.data[d].fechaPromesaPago&&(e.data[d].fechaPromesaPago=""),s.pdPlanta)if(7==e.data[d].idProveedor){e.data[d].referencia="Planta";var c=e.data[d];s.grdPagoDirecto.push(c)}else e.data[d].referencia="";if(s.pdPlanta&&6==e.data[d].idProveedor){e.data[d].referencia="Financiera";var c=e.data[d];s.grdPagoDirecto.push(c)}s.pdBanco&&"true"==e.data[d].esBanco&&(e.data[d].referencia="Banco"),"False"==e.data[d].seleccionable&&(e.data[d].estGrid="Pago"),"True"==e.data[d].seleccionable&&(e.data[d].Pagar=e.data[d].saldo,e.data[d].estGrid="No pagar"),"False"==e.data[d].documentoPagable&&(e.data[d].Pagar=e.data[d].saldo),17==e.data[d].numeroSerie.length&&(e.data[d].referencia=e.data[d].numeroSerie.substring(9,17)),e.carteraVencida=e.carteraVencida+e.data[d].saldo}e.noPagable=e.carteraVencida-e.cantidadTotal,s.selPlantaBanco?s.datosModal=s.grdPagoDirecto:s.datosModal=e.data;var u={idLotePago:"0",idEmpresa:e.idEmpresa,idUsuario:s.currentEmployee,fecha:"",nombre:s.formData.nombreLoteNuevo,estatus:0};e.ObtieneLotes(u),e.LlenaIngresos(),s.estatusLote=0,s.accionPagina=!0,s.grdApagar=0,s.grdBancos=[],s.grdApagar=0,s.bancosCompletas.forEach(function(e,a){s.grdBancos.push({banco:e.cuentaPagadora,subtotalLote:0,subtotal:e.sumaSaldoPagable}),s.grdApagar=s.grdApagar+e.sumaSaldoPagable}),s.blTotales=!0,s.idOperacion=0},y=function(a,o,t,n){s.grdBancos=[],s.grdApagar=0,null==e.gridOptions&&v(),e.gridOptions.data=null,e.gridOptions.data=a,e.data=a,e.carteraVencida=0,e.cantidadTotal=0,e.cantidadUpdate=0,e.noPagable=0,e.Reprogramable=0,s.pdPlanta=s.escenarios.Pdbanco,s.pdBanco=s.escenarios.Pdplanta,s.refPlanta=s.escenarios.TipoRefPlanta,s.refpdBanco=s.escenarios.tipoRefBanco;for(var r=!0,i=0;i<e.data.length;i++)e.data[i].Pagar=e.data[i].saldo,e.data[i].fechaPago=e.data[i].fechaPromesaPago,"1900-01-01T00:00:00"==e.data[i].fechaPromesaPago&&(e.data[i].fechaPromesaPago=""),"False"==e.data[i].seleccionable&&(e.data[i].estGrid="Pago",0==i?(s.grdBancos.push({banco:e.data[i].cuentaPagadora,subtotal:e.data[i].Pagar}),s.grdApagar=s.grdApagar+e.data[i].Pagar):(r=!1,s.grdBancos.forEach(function(a,o){e.data[i].cuentaPagadora==s.grdBancos[o].banco&&(s.grdBancos[o].subtotal=Math.round(100*s.grdBancos[o].subtotal)/100+Math.round(100*e.data[i].Pagar)/100,s.grdApagar=s.grdApagar+Math.round(100*e.data[i].Pagar)/100,r=!0)}),r||(s.grdBancos.push({banco:e.data[i].cuentaPagadora,subtotal:e.data[i].Pagar}),s.grdApagar=s.grdApagar+e.data[i].Pagar))),"True"==e.data[i].seleccionable&&(e.data[i].Pagar=e.data[i].saldo,e.data[i].estGrid="No pagar"),"False"==e.data[i].documentoPagable&&(e.data[i].Pagar=e.data[i].saldo),e.carteraVencida=e.carteraVencida+e.data[i].saldo;e.noPagable=e.carteraVencida-e.cantidadTotal,e.gridOptions.data=a,s.blTotales=!1},w=function(e,a){return e.forEach(function(e){e.grouping&&e.grouping.groupPriority>-1&&e.treeAggregation.type!==t.aggregation.CUSTOM&&(e.treeAggregation.type=t.aggregation.CUSTOM,e.customTreeAggregationFn=function(e,a,o,t){"undefined"==typeof e.value&&(e.value=0),e.value=e.value+t.entity.Pagar},e.customTreeAggregationFinalizerFn=function(e){"undefined"!=typeof e.groupVal?e.rendered=e.groupVal+" ("+r("currency")(e.value)+")":e.rendered=null})}),e},v=function(){e.idEmpleado=s.currentEmployee,e.gridOptions={enableColumnResize:!0,enableRowSelection:!0,enableGridMenu:!0,enableFiltering:!0,enableGroupHeaderSelection:!1,treeRowHeaderAlwaysVisible:!0,showColumnFooter:!0,showGridFooter:!0,height:900,cellEditableCondition:function(e){return e.row.entity.seleccionable},columnDefs:[{name:"nombreAgrupador",grouping:{groupPriority:0},sort:{priority:0,direction:"asc"},width:"15%",displayName:"Grupo",enableCellEdit:!1},{name:"proveedor",grouping:{groupPriority:1},sort:{priority:1,direction:"asc"},width:"20%",name:"proveedor",enableCellEdit:!1,cellTemplate:'<div><div ng-if="!col.grouping || col.grouping.groupPriority === undefined || col.grouping.groupPriority === null || ( row.groupHeader && col.grouping.groupPriority === row.treeLevel )" class="ui-grid-cell-contents" title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div></div>'},{field:"Pagar",displayName:"Pagar (total)",width:"10%",cellFilter:"currency",enableCellEdit:1!=s.currentIdOp,editableCellTemplate:'<div><form name="inputForm"><input type="number" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD"></form></div>'},{field:"saldoPorcentaje",displayName:"Porcentaje %",width:"10%",cellFilter:"number: 6",enableCellEdit:!1},{name:"cuentaPagadora",width:"10%",displayName:"Banco",enableCellEdit:!1},{name:"fechaPromesaPago",displayName:"Fecha Promesa de Pago",type:"date",cellFilter:'date:"dd/MM/yyyy"',width:"15%"},{name:"referencia",displayName:"Referencia",width:"10%",visible:!0,editableCellTemplate:'<div><form name="inputForm"><input type="INPUT_TYPE"  ui-grid-editor ng-model="MODEL_COL_FIELD"  minlength=3 maxlength=30 required><div ng-show="!inputForm.$valid"><span class="error">La referencia debe tener al menos 5 caracteres</span></div></form></div>'},{name:"documento",displayName:"# Documento",width:"15%",enableCellEdit:!1,headerTooltip:"Documento # de factura del provedor",cellClass:"cellToolTip"},{name:"ordenCompra",displayName:"Orden de compra",width:"13%",enableCellEdit:!1,cellTemplate:'<div class="urlTabla" ng-class="col.colIndex()" ><a tooltip="Ver en digitalización" class="urlTabla" href="http://192.168.20.41:3200/?id={{row.entity.ordenCompra}}&employee='+e.idEmpleado+'" target="_new">{{row.entity.ordenCompra}}</a></div>'},{name:"monto",displayName:"Monto",width:"15%",cellFilter:"currency",enableCellEdit:!1},{name:"saldo",displayName:"Saldo",width:"15%",cellFilter:"currency",enableCellEdit:!1},{name:"tipo",width:"15%",displayName:"Tipo",enableCellEdit:!1},{name:"tipodocto",width:"15%",displayName:"Tipo Documento",enableCellEdit:!1},{name:"cartera",width:"15%",displayName:"Cartera",enableCellEdit:!1},{name:"moneda",width:"10%",displayName:"Moneda",enableCellEdit:!1},{name:"numeroSerie",width:"20%",displayName:"N Serie",enableCellEdit:!1},{name:"facturaProveedor",width:"20%",displayName:"Factura Proveedor",enableCellEdit:!1},{name:"fechaVencimiento",displayName:"Fecha de Vencimiento",type:"date",cellFilter:'date:"dd/MM/yyyy"',width:"17%",enableCellEdit:!1},{name:"fechaRecepcion",displayName:"Fecha Recepción",type:"date",cellFilter:'date:"dd/MM/yyyy"',width:"17%",enableCellEdit:!1},{name:"fechaFactura",displayName:"Fecha Factura",type:"date",cellFilter:'date:"dd/MM/yyyy"',width:"17%",enableCellEdit:!1},{name:"estatus",displayName:"Estatus",width:"10%",enableCellEdit:!1},{name:"anticipo",displayName:"Anticipo",width:"10%",enableCellEdit:!1},{name:"anticipoAplicado",displayName:"Anticipo Aplicado",width:"15%",enableCellEdit:!1},{name:"cuenta",width:"15%",displayName:"# Cuenta",enableCellEdit:!1},{name:"documentoPagable",width:"15%",displayName:"Estatus del Documento",visible:!1,enableCellEdit:!1},{name:"ordenBloqueada",displayName:"Bloqueada",width:"20%",enableCellEdit:!1},{name:"fechaPago",displayName:"fechaPago",width:"20%",visible:!1,enableCellEdit:!1},{name:"estGrid",width:"15%",displayName:"Estatus Grid",enableCellEdit:!1},{name:"seleccionable",displayName:"seleccionable",width:"20%",enableCellEdit:!1,visible:!1},{name:"cuentaDestino",displayName:"Cuenta Destino",width:"20%",enableCellEdit:!1},{name:"idEstatus",displayName:"idEstatus",width:"20%",enableCellEdit:!1,visible:!0},{name:"tipoCartera",displayName:"tipoCartera",width:"20%",enableCellEdit:!1,visible:!0}],rowTemplate:"<div ng-class=\"{'ordenBloqueada':(row.entity.ordenBloqueada=='True' && ((row.entity.idEstatus < 1 || row.entity.idEstatus > 5) && row.entity.idEstatus != 20) && !row.isSelected),'bloqueadaSelec': (row.isSelected && row.entity.ordenBloqueada=='True') || (row.isSelected && ((row.entity.idEstatus >= 1 && row.entity.idEstatus <= 5) || row.entity.idEstatus == 20)),'bancocss': (row.entity.referencia=='Banco'),'plantacss': (row.entity.referencia=='Planta'),'selectNormal': (row.isSelected && row.entity.ordenBloqueada=='False' && ((row.entity.idEstatus < 1 || row.entity.idEstatus > 5) && row.entity.idEstatus != 20)),'docIncompletos': (!row.isSelected && ((row.entity.idEstatus >= 1 && row.entity.idEstatus <= 5) || row.entity.idEstatus == 20) && row.entity.ordenBloqueada=='False'),'bloqDocIncom': (!row.isSelected && ((row.entity.idEstatus >= 1 && row.entity.idEstatus <= 5) || row.entity.idEstatus == 20) && row.entity.ordenBloqueada=='True'),'ordenBloqueada':(row.entity.ordenBloqueada=='True' && ((row.entity.idEstatus < 1 || row.entity.idEstatus > 5) && row.entity.idEstatus != 20) && !row.isSelected)}\"> <div ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.uid\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader == 'True'}\" ui-grid-cell></div></div>",onRegisterApi:function(a){e.gridApi1=a,a.selection.on.rowSelectionChanged(e,function(o,t){if(1==o.internalRow&&1==o.isSelected)for(var n=o.treeNode.children,r=0,l=n.length;l>r;r++)e.selectAllChildren(a,n[r]);if(1==o.internalRow&&0==o.isSelected)for(var n=o.treeNode.children,r=0,l=n.length;l>r;r++)e.unSelectAllChildren(a,n[r]);if(void 0==o.internalRow&&1==o.isSelected&&"False"==o.entity.seleccionable)for(var n=o.treeNode.parentRow.treeNode.children,d=o.treeNode.parentRow.treeNode.aggregations[0].value,c=0,r=0;d>r;r++)1==n[r].row.isSelected&&(c+=1),c==d&&(id="closeMenu",o.treeNode.parentRow.treeNode.row.isSelected=!0);if(void 0==o.internalRow&&0==o.isSelected)for(var n=o.treeNode.parentRow.treeNode.children,u=o.treeNode.parentRow.treeNode.aggregations[0].value,c=0,r=0;u>r;r++)1==n[r].row.isSelected&&(c+=1),c>0&&(r=u,o.treeNode.parentRow.treeNode.row.isSelected=!1,o.treeNode.parentRow.treeNode.parentRow.treeNode.row.isSelected=!1);if(null==o.entity.Pagar)var g=0;else g=o.entity.Pagar;o.isSelected?(s.grdNoIncluido=Math.round(100*s.grdNoIncluido)/100-Math.round(100*g)/100,s.grdNoIncluido<0&&(s.grdNoIncluido=0),e.grdinicia>0&&(i=0,"Pago Reprogramado"==o.entity.estGrid&&(s.grdReprogramado=Math.round(100*s.grdReprogramado)/100-Math.round(100*o.entity.Pagar)/100),s.grdBancos.forEach(function(e,a){o.entity.cuentaPagadora==s.grdBancos[i].banco&&(s.grdBancos[i].subtotal=Math.round(100*s.grdBancos[i].subtotal)/100+Math.round(100*g)/100,s.grdApagar=s.grdApagar+o.entity.Pagar,o.entity.estGrid="Pago"),i++}))):(s.grdNoIncluido=Math.round(100*s.grdNoIncluido)/100+Math.round(100*g)/100,i=0,e.grdinicia>0&&s.grdBancos.forEach(function(e,a){o.entity.cuentaPagadora==s.grdBancos[i].banco&&(s.grdBancos[i].subtotal=Math.round(100*s.grdBancos[i].subtotal)/100-Math.round(100*g)/100,s.grdApagar=s.grdApagar-o.entity.Pagar,"Pago Reprogramado"!=o.entity.estGrid?o.entity.estGrid="Permitido":s.grdReprogramado=Math.round(100*s.grdReprogramado)/100+Math.round(100*o.entity.Pagar)/100),i++}))}),a.selection.on.rowSelectionChangedBatch(e,function(a){var o=0,t=s.grdBancos.length;s.grdNoIncluido=0,e.grdinicia>0&&s.grdBancos.forEach(function(e,a){s.grdBancos[a].subtotal=0,s.grdApagar=0}),e.grdinicia>0&&a.forEach(function(e,a){if(e.isSelected){if("False"==e.entity.seleccionable){e.entity.estGrid="Pago",s.grdNoIncluido=0;for(var a=0;t>a;a++)e.entity.cuentaPagadora==s.grdBancos[a].banco&&(s.grdBancos[a].subtotal=Math.round(100*s.grdBancos[a].subtotal)/100+Math.round(100*e.entity.Pagar)/100,s.grdApagar=s.grdApagar+e.entity.Pagar,a=t);s.grdNoIncluido=0}}else"False"==e.entity.seleccionable&&(e.entity.estGrid="Permitido",s.grdNoIncluido=s.grdApagarOriginal,e.treeNode.parentRow.treeNode.row.isSelected=!1,e.treeNode.parentRow.treeNode.parentRow.treeNode.row.isSelected=!1,s.grdApagar=0)})}),a.edit.on.afterCellEdit(e,function(a,o,t,n){var r=0,i=s.grdBancos.length;if("Pago"==a.estGrid||"Pago Reprogramado"==a.estGrid){if("1900-01-01T00:00:00"==a.fechaPago?old_date="":old_date=new Date(a.fechaPago),"fechaPromesaPago"==o.name&&(dtHoy=Date.now(),now_date=new Date(e.formatDate(dtHoy)),new_date=new Date(e.formatDate(t)),new_date<=now_date?(d.warning("La fecha promesa de pago no puede ser menor o igual a "+e.formatDate(dtHoy)+" !!!"),a.fechaPromesaPago=old_date,a.estGrid="Pago"):(a.Pagar=a.saldo,a.estGrid="Pago Reprogramado",e.gridApi1.selection.unSelectRow(a))),"Pagar"==o.name)if(e.cantidadUpdate=t-n,t>a.saldo||0>=t)d.warning("El pago es inválido !!!"),a.Pagar=n;else{"Pago Reprogramado"==a.estGrid&&(s.grdReprogramado=Math.round(100*s.grdReprogramado)/100-Math.round(100*a.Pagar)/100);for(var r=0;i>r;r++)a.cuentaPagadora==s.grdBancos[r].banco&&(s.grdBancos[r].subtotal=Math.round(100*s.grdBancos[r].subtotal)/100+Math.round(100*e.cantidadUpdate)/100,r=i);s.grdNoIncluido=Math.round(100*s.grdNoIncluido)/100-Math.round(100*e.cantidadUpdate)/100,s.grdApagar=Math.round(100*s.grdApagar)/100+Math.round(100*e.cantidadUpdate)/100,a.estGrid="Pago",a.fechaPromesaPago=old_date}"referencia"==o.name&&t.length>30&&(d.warning("La referencia no puede tener más de 30 caracteres"),a.referencia=n)}else d.warning("Solo se pueden modificar datos de los documentos seleccionados"),"Pagar"==o.name&&(a.Pagar=n),"fechaPromesaPago"==o.name&&(a.fechaPromesaPago=n)})}}};e.formatDate=function(e){var a=new Date(e),o=""+(a.getMonth()+1),t=""+a.getDate(),n=a.getFullYear();return o.length<2&&(o="0"+o),t.length<2&&(t="0"+t),[n,o,t].join("/")},e.selectAllChildren=function(a,o){if(0==o.children.length)"False"==o.row.entity.seleccionable&&a.selection.selectRow(o.row.entity);else{"False"==o.row.entity.seleccionable&&a.selection.selectRow(o.row.entity);for(var t=o.children,n=0,r=t.length;r>n;n++)e.selectAllChildren(a,t[n])}},e.unSelectAllChildren=function(a,o){if(0==o.children.length)a.selection.unSelectRow(o.row.entity);else{a.selection.unSelectRow(o.row.entity);for(var t=o.children,n=0,r=t.length;r>n;n++)e.unSelectAllChildren(a,t[n])}},e.seleccionaTodo=function(){e.selectAll(0)},e.selecciona=function(){e.selectAll(1)},e.selectAll=function(a){s.grdApagarOriginal=0,e.etqFiltros="Todos",e.grdinicia=0,e.gridOptions.data.forEach(function(o,t){"True"==o.seleccionable?s.grdnoPagable=Math.round(100*s.grdnoPagable)/100+Math.round(100*o.saldo)/100:0==a&&e.gridApi1.selection.selectRow(e.gridOptions.data[t])}),s.grdReprogramado=0,s.grdNoIncluido=0,s.grdApagarOriginal=s.grdApagar,s.selPlantaBanco?e.gridOptions.isRowSelectable=function(e){return"True"==e.entity.seleccionable||"Planta"==e.entity.referencia||"Banco"==e.entity.referencia}:e.gridOptions.isRowSelectable=function(e){return"True"!=e.entity.seleccionable&&"Planta"!=e.entity.referencia&&"Banco"!=e.entity.referencia},e.gridApi1.core.notifyDataChange(n.dataChange.OPTIONS),e.gridApi1.core.notifyDataChange(n.dataChange.EDIT),e.gridApi1.selection.selectAllRows(!0),e.grdinicia=e.grdinicia+1},e.proPegaReferencia=function(a,o){switch(a){case 1:e.pegaReferencia.proceso="Pegar",e.pagoDirecto(o);break;case 2:e.pegaReferencia.proceso="Pegar sobre filtros",e.pegaFiltros(o);break;case 3:e.pegaReferencia.proceso="Borrar sobre filtros",e.borraFiltros(o);break;case 4:e.pegaReferencia.proceso="Borrar",e.borraReferencias(o)}},e.pagoDirecto=function(a){var o="",t=!0,n=!0,r=0,i=e.gridApi1.selection.getSelectedRows();0==i.length?d.warning("Debe seleccionar al menos un documento"):(i.forEach(function(e,a){void 0!=e.referencia&&""!=e.referencia||(n&&(o=e.idProveedor,n=!1),o!=e.idProveedor&&(t=!1))}),t?i.forEach(function(e,o){void 0!=e.referencia&&""!=e.referencia||(e.referencia=a.referencia)}):d.warning("No puede tener mas de un proveedor seleccionado para pegar la referencia"))},e.borraReferencias=function(a){var o=e.gridApi1.selection.getSelectedRows();o.forEach(function(e,a){e.referencia=""}),a.referencia="Borrar todas"},e.pegaFiltros=function(a){e.gridApi1.core.getVisibleRows(e.gridApi1.grid).forEach(function(e,o){e.entity.referencia=a.referencia}),e.gridApi1.grid.refresh()},e.borraFiltros=function(a){e.gridApi1.core.getVisibleRows(e.gridApi1.grid).forEach(function(e,a){e.entity.referencia=""}),e.gridApi1.grid.refresh()},e.onReferencia=function(a){e.refMode?e.refMode=!1:e.refMode=!0},e.Filtrar=function(a,o,t){s.msgFiltros="Calculando....",e.etqFiltros=t,e.BorraFiltrosParciales(),e.gridApi1.grid.columns[o].filters[0].term=a,e.gridApi1.core.notifyDataChange(n.dataChange.COLUMN),e.gridApi1.grid.refresh(),s.msgFiltros=""},e.BorraFiltrosParciales=function(){e.gridApi1.grid.columns.forEach(function(a,o){e.gridApi1.grid.columns[o].filters[0].term=""}),e.gridApi1.core.notifyDataChange(n.dataChange.COLUMN),e.gridApi1.grid.refresh()},e.BorraFiltros=function(){s.msgFiltros="Calculando....",e.etqFiltros="Todos",e.gridApi1.grid.columns.forEach(function(a,o){e.gridApi1.grid.columns[o].filters[0].term=""}),e.gridApi1.core.notifyDataChange(n.dataChange.COLUMN),e.gridApi1.grid.refresh(),s.msgFiltros=""};var T=function(e){return!Array.isArray(e)&&e-parseFloat(e)+1>=0};e.colapsado=!1,e.Resize=function(){e.colapsado=!e.colapsado},s.ConsultaLote=function(e,a,o,t){1==o?confirm("¿Al cambiar de lote se perderan los cambios no guardados. Desea continuar??")&&s.ConsultaLoteObtiene(e,a,t):s.ConsultaLoteObtiene(e,a,t)},s.ConsultaLoteObtiene=function(a,o,t){d.info("Consulta de Lote "+o),e.idLote=a.idLotePago,s.grdnoPagable=0,s.idLotePadre=a.idLotePago,s.nombreLote=a.nombre,s.estatusLote=a.estatus,s.NuevoLote=!1,1==a.pal_esAplicacionDirecta||1==t?(s.pagoDirectoSeleccion=!0,s.selPlantaBanco=!0):(s.pagoDirectoSeleccion=!1,s.selPlantaBanco=!1),s.accionPagina&&(e.LlenaIngresos(),c.getOtrosIngresos(e.idLote).then(function r(a){e.caja=0,e.cobrar=0,a.data.length>0&&(e.caja=a.data[0].pio_caja,e.cobrar=a.data[0].pio_cobranzaEsperada)},function i(e){d.error("Error al obtener Otros Ingresos.")}),c.getTransferencias(e.idLote).then(function l(a){if(e.transferencias=[],a.data.length>0)angular.forEach(a.data,function(a,o){var t=a;e.transferencias.push(t)});else{var t={bancoOrigen:"",bancoDestino:"",importe:0,index:o};e.transferencias.push(t)}},function u(e){d.error("Error al obtener Transferencias.")}),0==s.estatusLote?(e.gridOptions.data=s.datosModal,e.gridOptions.isRowSelectable=function(e){return"True"!=e.entity.seleccionable},e.gridApi1.core.notifyDataChange(n.dataChange.OPTIONS),e.gridApi1.core.notifyDataChange(n.dataChange.EDIT),$("#btnTotalxEmpresa").button("reset"),s.crearLote&&($("#inicioModal").modal("hide"),s.crearLote=!1)):c.getDatosAprob(e.idLote).success(y).error(m),setTimeout(function(){$("#btnSelectAll").click()},500)),e.grdinicia=e.grdinicia+1},e.Guardar=function(e,a){$("#btnGuardando").button("loading");var o=0,t=0;angular.forEach(s.ingresos,function(e,a){parseInt(e.disponible)<0&&(o+=1),t=parseInt(t)+parseInt(e.saldo)}),setTimeout(function(){L(o,t,e,a)},500)},e.Cancelar=function(){e.gridOptions.data=[],s.noLotes=null,e.ObtieneLotes(0),setTimeout(function(){0==s.noLotes.data.length&&(s.NuevoLote=!0,s.estatusLote=0,s.CrearNuevoLote())},500)};var L=function(a,o,t,n){if(s.selPlantaBanco&&(o=.01),a>0)d.warning("Existen disponibles en valores negativos. Verifique las transferencias."),$("#btnGuardando").button("reset");else if(0>=o)d.warning("La sumatoria del saldo de cuentas de Ingreso no puede ser cero."),$("#btnGuardando").button("reset");else{var r=e.gridApi1.selection.getSelectedRows();if(0==r.length)d.warning("Debe seleccionar al menos un documento para guardar un lote."),$("#btnGuardando").button("reset"),$("#btnAprobar").button("reset");else{var i=0;s.selPlantaBanco&&(i=1),c.getPagosPadre(e.idEmpresa,s.currentEmployee,s.formData.nombreLoteNuevo,s.idLotePadre,i).then(function l(a){s.idLotePadre=a.data;var o=[],i=0;r.forEach(function(e,a){var t={};t.pal_id_lote_pago=s.idLotePadre,t.pad_polTipo=e.polTipo,t.pad_polAnnio=e.annio,t.pad_polMes=e.polMes,t.pad_polConsecutivo=e.polConsecutivo,t.pad_polMovimiento=e.polMovimiento,t.pad_fechaPromesaPago=""==e.fechaPromesaPago?"1900-01-01T00:00:00":e.fechaPromesaPago,t.pad_saldo=e.Pagar,null!=e.referencia&&void 0!=e.referencia&&""!=e.referencia||(e.referencia="AUT"),t.pad_polReferencia=e.referencia,t.tab_revision=1,o.push(t)});var l=angular.toJson(s.ingresos),u=angular.toJson(e.transferencias),g=angular.toJson(s.egresos);c.setDatos(o,s.currentEmployee,s.idLotePadre,l,u,e.caja,e.cobrar,g,0==s.estatusLote?1:2).then(function p(a){d.success("Se guardaron los datos."),s.estatusLote=1,angular.forEach(s.noLotes.data,function(a,o){a.idLotePago==e.idLote&&(a.idLotePago=s.idLotePadre,a.estatus=1)}),$("#btnGuardando").button("reset"),2==t&&c.setAprobacion(1,n,e.idEmpresa,s.idLotePadre,s.currentEmployee,s.idAprobador,s.idAprobacion,s.idNotify,s.formData.Observacion).then(function o(e){3==n?(d.success("Se aprobo el lote con exito"),$("#btnAprobar").button("reset")):(d.success("Se rechazo el lote con exito"),$("#btnRechazar").button("reset")),s.idOperacion=0,setTimeout(function(){window.close()},3500),$("#btnAprobar").prop("disabled",!0),$("#btnRechazar").prop("disabled",!0)},function r(e){3==n?(d.error("Error al aprobar"),$("#btnAprobar").button("reset")):(d.error("Error al rechazar"),$("#btnRechazar").button("reset"))}),3==t&&c.setAplicacion(e.idEmpresa,s.idLotePadre,s.currentEmployee).then(function i(e){3==n?(d.success("Se aprobo el lote con exito"),$("#btnAprobar").button("reset")):(d.success("Se rechazo el lote con exito"),$("#btnRechazar").button("reset")),s.idOperacion=0,setTimeout(function(){window.close()},3500),$("#btnAprobar").prop("disabled",!0),$("#btnRechazar").prop("disabled",!0)},function l(e){3==n?(d.error("Error al aprobar"),$("#btnAprobar").button("reset")):(d.error("Error al rechazar"),$("#btnRechazar").button("reset"))})},function f(e){d.error("Error al guardar Datos"),$("#btnGuardando").button("reset"),$("#btnAprobar").button("reset")}),$("#btnguardando").button("reset")},function u(e){d.error("Error al insertar en tabla padre."),$("#btnguardando").button("reset")})}}};e.addTransferencia=function(){var a=e.transferencias.length,o={bancoOrigen:"",bancoDestino:"",importe:0,index:a};e.transferencias.push(o)},e.delTransferencia=function(a){e.transferencias.splice(a.index,1);var o=0;angular.forEach(e.transferencias,function(e,a){e.index=o,o+=1}),e.calculaTotalOperaciones(),C()},e.selBancoIngreso=function(a,o){a.disponible<=0?d.warning("El saldo disponible de esta cuenta es 0 o menor. Elija otra."):o.bancoOrigen!=a.cuenta&&(angular.forEach(s.ingresos,function(e,a){e.cuenta==o.bancoOrigen&&(e.disponible=parseInt(e.disponible)+parseInt(o.importe))}),o.bancoOrigen=a.cuenta,o.disponibleOrigen=a.disponible,o.importe=0),e.calculaTotalOperaciones(),C()},e.selBancoEgreso=function(a,o){o.bancoDestino=a.cuenta,e.calculaTotalOperaciones(),C()},e.calculaSaldoIngresos=function(a){var o=0;angular.forEach(e.transferencias,function(e,t){e.bancoOrigen==a.cuenta&&(o=parseInt(o)+parseInt(e.importe))}),a.disponible=parseInt(a.saldo)-parseInt(o),angular.forEach(s.egresos,function(e,o){a.cuenta==e.cuenta&&1==e.ingreso&&(e.saldoIngreso=a.disponible)}),angular.forEach(e.transferencias,function(e,o){e.bancoOrigen==a.cuenta&&(e.disponibleOrigen=a.disponible)}),parseInt(a.disponible)<0&&d.warning("El saldo disponible de esta cuenta es menor a 0. Verifique las transferencias."),
e.calculaTotalOperaciones()},e.calculaTransferencia=function(a){var o=0;angular.forEach(e.transferencias,function(e,t){e.bancoOrigen==a.bancoOrigen&&(o+=1)}),1==o?(a.importe>a.disponibleOrigen||a.disponibleOrigen<=0)&&(d.warning("El valor es mayor al saldo disponible!"),a.importe=0):angular.forEach(s.ingresos,function(e,o){e.cuenta==a.bancoOrigen&&(e.disponible-a.importe<0?(d.warning("El valor es mayor al saldo disponible!"),a.importe=0):e.disponible=e.disponible-a.importe)}),e.calculaTotalOperaciones(),C()};var C=function(){angular.forEach(s.ingresos,function(a,o){a.disponible=a.saldo,angular.forEach(e.transferencias,function(e,o){a.cuenta==e.bancoOrigen&&(a.disponible=a.disponible-e.importe)}),angular.forEach(s.TotalxEmpresas,function(e,a){angular.forEach(s.egresos,function(a,o){e.cuentaPagadora==a.cuenta&&(e.saldoLote=a.total)})})}),angular.forEach(s.egresos,function(e,a){angular.forEach(s.grdBancos,function(a,o){e.cuenta==a.banco&&(a.subtotalLote=e.total)})})};e.calculaTotalOperaciones=function(){angular.forEach(s.egresos,function(a,o){var t=0;angular.forEach(e.transferencias,function(e,o){e.bancoDestino==a.cuenta&&(t+=parseInt(e.importe))}),angular.forEach(s.ingresos,function(e,o){e.cuenta==a.cuenta&&1==a.ingreso&&(a.saldoIngreso=e.saldo)}),a.aTransferir=t;var n=parseInt(a.ingreso),r=1==n?parseInt(a.saldoIngreso):parseInt(a.saldo);a.total=parseInt(a.aTransferir)+r,a.excedente=parseInt(a.total)-parseInt(a.totalPagar)})},e.presskey=function(a){13===a.which&&(e.calculaTotalOperaciones(),C())},e.getDiferencia=function(e){var a=e.subtotalLote-e.subtotal;return a},e.getTotal=function(a){var o=0;switch(a){case"egresosTotal":angular.forEach(s.egresos,function(e,a){o+=parseInt(e.total)}),s.FlujoEfectivo=o;break;case"ingresoSaldo":angular.forEach(s.ingresos,function(e,a){o+=parseInt(""==e.saldo?0:e.saldo)});break;case"ingresoDisponible":angular.forEach(s.ingresos,function(e,a){o+=parseInt(""==e.disponible?0:e.disponible)});break;case"excedente":angular.forEach(s.egresos,function(e,a){o+=parseInt(e.excedente)});break;case"otrosIngresos":o+=parseInt(""==e.caja||null==e.caja?0:e.caja)+parseInt(""==e.cobrar||null==e.cobrar?0:e.cobrar);break;case"transferencias":angular.forEach(e.transferencias,function(e,a){o+=parseInt(e.importe)});break;case"saldo":angular.forEach(s.egresos,function(e,a){o+=1==e.ingreso?parseInt(e.saldoIngreso):parseInt(e.saldo)});break;case"aTransferir":angular.forEach(s.egresos,function(e,a){o+=parseInt(e.aTransferir)})}return o},s.CrearNuevoLote=function(){$("#closeMenu").click(),s.ProgPago=!0;var a=$.grep(s.noLotes.data,function(e,a){return 0===e.estatus});a.length>0?d.warning("Existe lotes sin guardar."):((s.pdPlanta||s.pdBanco)&&(s.selPagoDirecto=!0),s.NuevoLote=!0,s.accionPagina=!1,$("#btnCrealote").button("reset"),$("#btnCrealotePD").button("reset"),c.getLotes(e.idEmpresa,s.currentEmployee,0,0).then(function o(e){s.noLotes=e;var a=new Date;s.formData.nombreLoteNuevo=("0"+(a.getMonth()+1)).slice(-2)+("0"+a.getDate()).slice(-2)+a.getFullYear()+"-"+s.rfc+"-"+("0"+(s.noLotes.data.length+1)).slice(-2),$("#inicioModal").modal("show")},function t(e){d.error("Error al obtener los Lotes"),s.formData.nombreLoteNuevo="0000",$("#inicioModal").modal("show")}))},$('input[name="options"]').click(function(){$(this).tab("show")}),e.GenerarArchivo=function(){$("#processing-modal").modal("show"),c.setArchivo(e.idEmpresa,e.gridOptions.data,s.idLotePadre).then(function a(o){e.documentoIni='<div><object id="ifDocument" data="'+o.data+'" type="application/txt" width="100%"><p>Descargar archivo de pagos <a href="../../files/'+o.data+'" target="_blank"><img border="0" alt="descargar" src="image/gifs/download.jpg" width="50" height="50"></a></p></object> </div>',setTimeout(function(){$("#processing-modal").modal("hide")},1e3),setTimeout(function(){g.location.href="../../files/"+o.data},2e3)},function o(e){d.error("Error al generar el archivo"),setTimeout(function(){$("#processing-modal").modal("hide")},1e3)})},s.AbreConsultaLotes=function(){$("#closeMenu").click(),$("#consultaModal").modal("show")},s.Abrecuentas=function(){$("#closeMenu").click(),g.location.href="/cuentas"},s.AbreAgrupador=function(){$("#closeMenu").click(),g.location.href="/agrupador"},s.AbreAdministrador=function(){$("#closeMenu").click(),g.location.href="/loteAdmin"},e.today=function(){e.dt=new Date},e.today(),e.clear=function(){e.dt=null},e.inlineOptions={customClass:f,minDate:new Date,showWeeks:!0},e.dateOptions={dateDisabled:p,formatYear:"yy",maxDate:new Date(2020,5,22),minDate:new Date,startingDay:1},e.toggleMin=function(){e.inlineOptions.minDate=e.inlineOptions.minDate?null:new Date,e.dateOptions.minDate=e.inlineOptions.minDate},e.toggleMin(),e.open1=function(){e.popup1.opened=!0},e.open2=function(){e.popup2.opened=!0},e.setDate=function(a,o,t){e.dt=new Date(a,o,t)},e.formats=["dd-MMMM-yyyy","yyyy/MM/dd","dd.MM.yyyy","shortDate"],e.format=e.formats[0],e.altInputFormats=["M!/d!/yyyy"],e.popup1={opened:!1},e.popup2={opened:!1};var A=new Date;A.setDate(A.getDate()+1);var D=new Date;D.setDate(A.getDate()+1),e.events=[{date:A,status:"full"},{date:D,status:"partially"}],s.EnviaAprobacion=function(){$("#btnEnviaApro").button("loading"),c.setSolAprobacion(1,8,e.idEmpresa,s.idLotePadre).then(function a(e){d.success("Se envio la solicitud con exito"),$("#btnEnviaApro").button("reset"),s.idOperacion=1},function o(e){d.error("Error al enviar solicitud de aprobación"),$("#btnEnviaApro").button("reset")})},s.AprobarLote=function(a){$("#btnAprobar").button("loading"),e.Guardar(2,a)},s.AprobarLotePD=function(a){$("#btnAprobar").button("loading"),e.Guardar(3,a)}}),registrationModule.service("stats",function(){var e=function(e,o){a(e),angular.isUndefined(e.stats.accumulator)&&(e.stats.accumulator=[]),e.stats.accumulator.push(o)},a=function(e){angular.isUndefined(e.stats)&&(e.stats={sum:0})},o=function(e,a){angular.isUndefined(e[a])?e[a]=1:e[a]++},t={aggregator:{accumulate:{numValue:function(a,o,t){return e(a,t)},fieldValue:function(a,o){return e(a,o)}},mode:function(e,t){a(e);var n=t;(angular.isUndefined(n)||null===n)&&(n=e.col.grid.options.groupingNullLabel),o(e.stats,n),(e.stats[n]>e.maxCount||angular.isUndefined(e.maxCount))&&(e.maxCount=e.stats[n],e.value=n)},sumSquareErr:function(e,n,r){a(e),o(e.stats,"count"),e.stats.sum+=r,t.aggregator.accumulate.numValue(e,n,r)}},finalizer:{cleanup:function(e){delete e.stats,angular.isUndefined(e.rendered)&&(e.rendered=e.value)},sumSquareErr:function(e){if(e.value=0,0!==e.count){var a=e.stats.sum/e.stats.count,o;angular.forEach(e.stats.accumulator,function(t){o=t-a,e.value+=o*o})}}}};return t});