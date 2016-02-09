registrationModule.controller("parametroController", function ($scope, $filter, $rootScope, localStorageService, alertFactory, parametroRepository,mancomunadoRepository, filtroRepository) {

    //Propiedades
   $scope.productoId = 1;
    $scope.usuarioId = 1;
    $scope.empresaId = 1;
    $scope.sucursalId = 3;
    $scope.departamentoId = 13;
    $scope.tipoOrdenId = 1;
     /*   $scope.productoId = 2;
    $scope.usuarioId = 1;
    $scope.empresaId = 1;
    $scope.sucursalId = 1;
    $scope.departamentoId = 1;
    $scope.tipoOrdenId = 4;*/
    $scope.nodoId = 1;
    $scope.divisionId = 1;
    $scope.sucursalesId = 1;
    $scope.usuarioMancomunadoId = 1;
    $scope.idDelete = 15;
    $scope.mancomunadoSelecciona=null;
    $scope.currentUsuarioActual=null;
 // $scope.OpcionDefault = "Selecciona una opción";

    $scope.OpcionDefaultTipoOrden = "";
    $scope.OpcionDefaultTipoProceso = "";
    $scope.OpcionDefaultEmpresa = "";
    $scope.OpcionDefaultSucursal = "";
    $scope.OpcionDefaultDepartamento = "";
    $scope.OpcionDefaulEscalamientoId = "";
    $scope.currentUsuarioActualId = "";

//Seccion para Items
     $scope.tipoProcesoItem= null;
     $scope.empresaItem= null;
     $scope.sucursalItem= null;
     $scope.deptoItem= null;
     $scope.tipoOrdenItem= null;

//Validadores
     $scope.tipoProcesoSelected= false;
     $scope.empresaSelected= false;
     $scope.sucursalSelected= false;
     $scope.deptoSelected= false;
     $scope.tipoOrdenSelected= false;

    
    //Grupo de funciones de inicio
    $scope.init = function () {
        getData();
    };

 
    var getData = function(){

        parametroRepository.getEscalamiento($scope.productoId, $scope.usuarioId, $scope.empresaId, $scope.sucursalId, $scope.departamentoId, $scope.tipoOrdenId)
            .success(getEscalamientoSuccessCallback)
            .error(errorCallBack);
                                                      
        mancomunadoRepository.getMancomunados($scope.productoId, $scope.nodoId, $scope.empresaId, $scope.sucursalId, $scope.departamentoId, $scope.tipoOrdenId)
            .success(getMancoumunadoSuccessCallback)
            .error(errorCallBack);
    }
    //Mensajes en caso de error
    var errorCallBack = function (data, status, headers, config) {
        getData();
        alertFactory.error('Ocurrio un problema: ' + data);
    };

    //Succes obtiene lista de objetos de tipo escalamiento
    var getEscalamientoSuccessCallback = function (data, status, headers, config) {
        $scope.listaEscalamiento = data;
        alertFactory.success('Datos de escalamiento cargados.');
    };

    //Botón para mostrar aprobadores
    $scope.MostrarAprobadores = function(esc){
        $scope.listaTipoProceso = _tipoProceso;
        parametroRepository.getAprobadores(esc.empIdempresa, esc.sucIdsucursal, esc.depIddepartamento, esc.tipoidtipoorden)
            .success(getAprobadoresSuccessCallback)
            .error(errorCallBack);
    };

    //Success obtiene lista de aprobadores por nivel
    var getAprobadoresSuccessCallback = function (data, status, headers, config) {
        $scope.listaAprobadores = data;
        $('#viewAprobadores').modal('show');
        alertFactory.success('Aprobadores cargados.');
    };

     //Succes obtiene lista de objetos de usuarios Mancomunados
    var getMancoumunadoSuccessCallback = function (data, status, headers, config) {
        $rootScope.listaMancomunados = data;
        alertFactory.success('Datos de usuarios mancomunados cargados.');
    };

    //Botón para dar de alta Nuevo Mancomunado
    $scope.NuevoMancomunado = function(){   
        //Cargo los tipos de proceso de la entidad

        $scope.NewCurrentTipoProceso=null;
        $scope.NewCurrentEmpresa= null;
        $scope.NewCurrentSucursal=null;
        $scope.NewCurrentDepto=null;
        $scope.NewCurrentTipoOrden=null;


        $scope.OpcionDefaultTipoProceso="Seleccione una opción";
        $scope.OpcionDefaultTipoOrden = "Seleccione una opción";            
        $scope.OpcionDefaultEmpresa = "Seleccione una opción";
        $scope.OpcionDefaultSucursal ="Seleccione una opción";
        $scope.OpcionDefaultDepartamento="Seleccione una opción";
        $scope.listaTipoProceso = _tipoProceso;

        filtroRepository.getSucursales($scope.usuarioId, $scope.empresaId)
            .success(getSucursalesSuccessCallback)
            .error(errorCallBack);
        filtroRepository.getDepartamentos($scope.usuarioId, $scope.empresaId, $scope.sucursalesId)
            .success(getDepartamentosSuccessCallback)
            .error(errorCallBack);
        filtroRepository.getTipoOrden()
            .success(getTipoOrdenSuccessCallback)
            .error(errorCallBack);
           
        $('#viewNewMancomunado').modal('show');
    };

    //Asigna el objeto Tipo Proceso
    $scope.SetTipoProceso = function(tip) {
        $scope.OpcionDefaultTipoProceso=null;
       //Cargo los tipos de proceso de la entidad
        $scope.currentTipoProceso = tip;

        filtroRepository.getEmpresas($scope.empresaId) //ID de tipo proceso   <<<<-------
             .success(getEmpresasSuccessCallback)
             .error(errorCallBack);
    };

    //Asigna el objeto Tipo Orden
    $scope.SetTipoOrden = function(orden) {
        $scope.OpcionDefaultTipoOrden = null;
        $scope.currentTipoOrden = orden;
    };

    //Asigna el objeto Empresa
    $scope.SetEmpresa = function(tip) {        
        $scope.OpcionDefaultEmpresa = null;
        $scope.currentEmpresa = tip;
    };

    //Asigna el objeto Sucursal
    $scope.SetSucursal= function(tip) {
        $scope.OpcionDefaultSucursal = null;
        $scope.currentSucursal = tip;
    };

    //Asigna el objeto Departamento
    $scope.SetDepto= function(tip) {
        $scope.OpcionDefaultDepartamento = null;
        $scope.currentDepto = tip;
    };

//Botón para dar de alta Nuevo Mancomunado 
    $scope.UpdateMancomunado = function(mancomunado){
        //Checar estas 5 lineas.
        $scope.tipoProcesoSelected= false;
        $scope.empresaSelected= false;
        $scope.sucursalSelected= false;
        $scope.deptoSelected= false;
        $scope.tipoOrdenSelected= false;

        if(mancomunado==null)
        {
            $scope.NewMancomunadouSet();
        }

        //Cargo los tipos de proceso de la entidad
       $scope.mancomunadoSelecciona=  mancomunado;
        $scope.listaTipoProceso = _tipoProceso;      


        filtroRepository.getEmpresas(mancomunado.empIdEmpresa)
             .success(getEmpresasSuccessCallback)
             .error(errorCallBack);
        filtroRepository.getSucursales(mancomunado.usuarioMancomunado, mancomunado.empIdEmpresa)
            .success(getSucursalesSuccessCallback)
            .error(errorCallBack);
        filtroRepository.getDepartamentos(mancomunado.empIdEmpresa, mancomunado.empIdEmpresa, mancomunado.sucIdSucursal)
            .success(getDepartamentosSuccessCallback)
            .error(errorCallBack);
        filtroRepository.getTipoOrden()
            .success(getTipoOrdenSuccessCallback)
            .error(errorCallBack);

            if ($scope.currentUsuarioActual == '') {
                 $scope.currentUsuarioActual = mancomunado.usuarioMancomunadoC;
                 $scope.currentUsuarioActualId = mancomunado.usuarioMancomunado;
            } else{
                $scope.currentUsuarioActual;
            }
                
             $scope.OpcionDefaultTipoOrden = mancomunado.tipOrden;
             $scope.OpcionDefaultTipoProceso = mancomunado.nodoNombre;
             $scope.OpcionDefaultEmpresa = mancomunado.empNombre;
             $scope.OpcionDefaultSucursal = mancomunado.sucNombre;
             $scope.OpcionDefaultDepartamento = mancomunado.depNombre;
             $scope.OpcionDefaultEscalamientoId = mancomunado.escalamientoId;
             

        $('#viewUpdMancomunado').modal('show');
    };


    //Botón nuevo usuario mancomunado
    $scope.NewMancomunadouSet = function(){        
        if ($scope.currentUsuarioActual == '') {
            $scope.currentUsuarioActual=mancomunado.usuarioMancomunadoC;
        } else {
            $scope.currentUsuarioActual;
        }

        $('#viewNewMancomunado').modal('show');
    };

    //Asigna el objeto Tipo Proceso
    $scope.UpdSetTipoProceso = function(tip) {
        //Cargo los tipos de proceso de la entidad
        $scope.OpcionDefaultTipoProceso =null;
       $scope.currentTipoProceso = tip;

        filtroRepository.getEmpresas($scope.empresaId) //ID de tipo proceso   <<<<-------
             .success(getEmpresasSuccessCallback)
             .error(errorCallBack);
    };

    //Asigna el usuario seleccionado
    $scope.SetUsuario= function(user) {  
        $scope.usuarioMancomunadoId=user.idUsuario;      
        $scope.currentUsuarioActual=null;
        $('#viewUsuarios').modal('hide');
        $scope.currentUsuarioActual='';
        $scope.currentUsuarioActual = user.nombre +' '+ user.aPaterno+' '+ user.aMaterno;
        $scope.currentUsuarioActualId = user.idUsuario;
       
//Obtener nuevos valores para el array $scope.levels
        if($scope.op==1){
           $scope.level.usuarioAutoriza1 = user.nombre +' '+ user.aPaterno+' '+ user.aMaterno;
           $scope.level.idUsuarioAutoriza1 = user.idUsuario;
        }
        else if($scope.op==2){
            $scope.level.usuarioAutoriza2 = user.nombre +' '+ user.aPaterno+' '+ user.aMaterno;
            $scope.level.idUsuarioAutoriza2 = user.idUsuario;            
        }
        else if($scope.op==3){
            $scope.level.usuarioAutoriza3 = user.nombre +' '+ user.aPaterno+' '+ user.aMaterno;
            $scope.level.idUsuarioAutoriza3 = user.idUsuario;
        }
        
        if($scope.mancomunadoSelecciona!=null){
            $scope.UpdateMancomunado($scope.mancomunadoSelecciona);            
        }  


       // NOTA:  Verificar si va esta linea o el if anterior
       // $scope.UpdateMancomunado($scope.mancomunadoSelecciona);
    };

 //Asigna el objeto Tipo Orden
    $scope.UpdSetTipoOrden = function(orden) {        
        $scope.OpcionDefaultTipoOrden=null;
        $scope.currentTipoOrden = orden;
    };

       //Asigna el objeto Empresa
    $scope.UpdSetEmpresa = function(tip) {        
        $scope.OpcionDefaultEmpresa = null;
        $scope.currentEmpresa = tip;
    };


        //Asigna el objeto Sucursal
    $scope.UpdSetSucursal= function(tip) {        
        $scope.OpcionDefaultSucursal =null;
        $scope.currentSucursal = tip;
    };


    //Asigna el objeto Departamento
    $scope.UpdSetDepto= function(tip) {        
        $scope.OpcionDefaultDepartamento=null;
        $scope.currentDepto = tip;
    };


    //Success obtiene lista de usuarios
    var getUsuariosSuccessCallback = function (data, status, headers, config) {
        $scope.listaUsuarios = data;
        $('#viewAprobadores').modal('show');
        alertFactory.success('Usuarios cargados.');
    };

    //Success obtiene lista de empresas
    var getEmpresasSuccessCallback = function(data, status, headers, config){
        $scope.listaEmpresas = data;
        alertFactory.success('Datos de Empresas cargados.');
    };

    //Success obtiene lista de departamentos
    var getDepartamentosSuccessCallback = function(data, status, headers, config){
        $scope.listaDeptos = data;
        alertFactory.success('Datos de Departamentos cargados.');
    };

    //Success obtiene lista de sucursales
    var getSucursalesSuccessCallback = function(data, status, headers, config){
        $scope.listaSucursales = data;
        alertFactory.success('Datos de Sucursales cargados.');
    };

    //Success obtiene lista de Tipo Orden
    var getTipoOrdenSuccessCallback = function(data, status, headers, config){
        $scope.listaTipoOrden = data;
        alertFactory.success('Datos de Tipo Orden cargados.');   
    };


        //Success obtiene lista de Usuarios
    var getUsuariosMancomunadosSuccessCallback = function(data, status, headers, config){
        $scope.usuarios = data;        
        $('#viewUsuarios').modal('show');
        alertFactory.success('Datos de los Usuarios cargados');
    };


   //Success Update Mancomunado
    var getUpdMancomunadoSuccessCallback = function(data, status, headers, config){
        getData();
        alertFactory.success('Datos de los Usuarios actualizados');
    };

    //Success Update Mancomunado
    var getDelMancomunadoSuccessCallback = function(data, status, headers, config){
        getData();
        alertFactory.success('Datos de los Usuarios cargados');
    };


    //Mostrar lista Usuarios
    $scope.MostrarListaUsuarios =  function(){
        filtroRepository.getUsuarios()
            .success(getUsuariosMancomunadosSuccessCallback)
            .error(errorCallBack);
    };


    //Botón para Actualizar Usuario Mancomunado
    $scope.UpdMancomunado = function(){
        $('#viewUpdMancomunado').modal('hide');
        mancomunadoRepository.updateMancomunado($scope.OpcionDefaultEscalamientoId, $scope.currentUsuarioActualId)
            .success(getUpdMancomunadoSuccessCallback)
            .error(errorCallBack);
    };


    //Botón Delete Usuario Mancomunado
    $scope.DelMancomunado = function(mancomunado){
        mancomunadoRepository.deleteMancomunado(mancomunado.escalamientoId)
            .success(getDelMancomunadoSuccessCallback)
            .error(errorCallBack);
    };





 //Limpia los datos en caso de cerrar la ventana de seleccionar usuario
     $scope.updCerrarSelectionUser = function(){
        $('#viewUpdMancomunado').modal('hide');
        $scope.currentUsuarioActual = '';
     };


    //Asigna el objeto Tipo Proceso
    $scope.NewSetTipoProceso = function(tip) {
        $scope.tipoProcesoSelected= true;
        $scope.tipoProcesoItem=tip.valor;
         $scope.OpcionDefaultTipoProceso = '';
        //Cargo los tipos de proceso de la entidad
        $scope.NewCurrentTipoProceso = tip;

        filtroRepository.getEmpresas($scope.empresaId) //ID de tipo proceso   <<<<-------
             .success(getEmpresasSuccessCallback)
             .error(errorCallBack);
    };

    //Asigna el objeto Tipo Orden
    $scope.NewSetTipoOrden = function(orden) {
        $scope.tipoOrdenSelected= true;
        $scope.tipoOrdenItem= orden.idtipoorden;
        $scope.OpcionDefaultTipoOrden = '';
        $scope.NewCurrentTipoOrden = orden;
    };

    //Asigna el objeto Empresa
    $scope.NewSetEmpresa = function(tip) {
        $scope.empresaSelected= true;
        $scope.empresaItem=tip.idEmpresa;
        $scope.OpcionDefaultEmpresa = '';
        $scope.NewCurrentEmpresa = tip;
    };

    //Asigna el objeto Sucursal
    $scope.NewSetSucursal= function(tip) {
        $scope.sucursalSelected= true;
        $scope.sucursalItem=tip.idSucursal;
        $scope.OpcionDefaultSucursal = '';
        $scope.NewCurrentSucursal = tip;
    };

    //Asigna el objeto Departamento
    $scope.NewSetDepto= function(tip) {
        $scope.deptoSelected= true;
        $scope.deptoItem=tip.idDepartamento;
        $scope.OpcionDefaultDepartamento = '';
        $scope.NewCurrentDepto = tip;
    };

    //Mostrar lista Usuarios
    $scope.NewMostrarListaUsuarios =  function(){
        filtroRepository.getUsuarios()
            .success(getUsuariosMancomunadosSuccessCallback)
            .error(errorCallBack);
    };

    //Success obtiene lista de Usuarios
    var getNewUsuariosMancomunadosSuccessCallback = function(data, status, headers, config){
        $scope.usuarios = data;        
        $('#viewUsuarios').modal('show');
        alertFactory.success('Datos de los Usuarios cargados');
    };

    $scope.InsertarMancomunado = function(mancomunado){

//1.-
        if($scope.tipoProcesoSelected==false) { errorCallBackTipoProceso(); return;  }
        if($scope.empresaSelected==false) { errorCallBackEmpresa();   return;     }
        if($scope.sucursalSelected==false)  { errorCallBackSucursal();return;  }
        if($scope.deptoSelected==false){ errorCallBackDepartamento();  return;}
        if($scope.tipoOrdenSelected==false){ errorCallBackTipoOrden(); return; }

        SelectedDropdownFalse();
     /*   $scope.tipoProcesoSelected= false;
        $scope.empresaSelected= false;
        $scope.sucursalSelected= false;
        $scope.deptoSelected= false;
        $scope.tipoOrdenSelected= false;*/


         $scope.tipoProcesoSelected==false;
        $('#viewNewMancomunado').modal('hide');
        //mancomunadoRepository.insertMancomunados($scope.productoId, $scope.nodoId, $scope.empresaId, $scope.sucursalId, $scope.departamentoId, $scope.tipoOrdenId, $scope.currentUsuarioActualId)
        mancomunadoRepository.insertMancomunados($scope.tipoProcesoItem, $scope.nodoId, $scope.empresaItem, $scope.sucursalItem, $scope.deptoItem, $scope.tipoOrdenItem, $scope.usuarioMancomunadoId)    
            .success(getInsertMancomunadosSuccessCallback)
            .error(errorCallBack);
        
    };

    var getInsertMancomunadosSuccessCallback = function(data, status, headers, config){
        getData();
        alertFactory.success('Datos insertados correctamente');
    };

    //Botón nuevo escalamiento
    $scope.MostrarNuevoEscalamiento = function(){ 
        //Cargo los tipos de proceso de la entidad
        $scope.listaTipoProceso = _tipoProceso;

         filtroRepository.getSucursales($scope.usuarioId, $scope.empresaId)
             .success(getSucursalesSuccessCallback)
             .error(errorCallBack);
         filtroRepository.getDepartamentos($scope.usuarioId, $scope.empresaId, $scope.sucursalesId)
             .success(getDepartamentosSuccessCallback)
             .error(errorCallBack);
         filtroRepository.getTipoOrden()
             .success(getTipoOrdenSuccessCallback)
             .error(errorCallBack);
        $('#viewNewEscalamiento').modal('show');
    };

    //Asigna el objeto Tipo Proceso
    $scope.NewEscSetTipoProceso = function(tip) {
        //Cargo los tipos de proceso de la entidad
       $scope.NewEscCurrentTipoProceso = tip;

        filtroRepository.getEmpresas($scope.empresaId)
             .success(getEmpresasSuccessCallback)
             .error(errorCallBack);
    };

   
     //Limpia los datos en caso de cerrar la ventana de seleccionar usuario
     $scope.newCerrarSelectionUser = function(){
        $('#viewNewMancomunado').modal('hide');
        $scope.currentUsuarioActual = '';
     };


//VALIDADORES

var errorCallBackTipoProceso = function () {       
        alertFactory.error('Seleccione Tipo Proceso ');
    };

var errorCallBackEmpresa = function () {
        alertFactory.error('Seleccione Empresa');
    };

    var errorCallBackSucursal = function () {
        alertFactory.error('Seleccione Sucursal');
    };

 var errorCallBackDepartamento = function () {
        alertFactory.error('Seleccione Departamento');
    };

 var errorCallBackTipoOrden = function () {
        alertFactory.error('Seleccione Tipo Orden');
    };


var SelectedDropdownFalse = function () {
     $scope.tipoProcesoSelected= false;
     $scope.empresaSelected= false;
     $scope.sucursalSelected= false;
     $scope.deptoSelected= false;
     $scope.tipoOrdenSelected= false;
    };






var app = angular.module('formApp', []);
  /*   app.controller('MainCtrl', function($scope) {
  $scope.formData = {};*/

     $scope.submitForm = function (formData) {
    alert('Form submitted with' + JSON.stringify(formData));
  };




  /***SCRIPT PARA EL FUNCIONAMIENTO DE ESCALAMIENTOS
         VICENTE VLADIMIR JUAREZ JUAREZ
     *****/
     //Botón nuevo escalamiento
    $scope.MostrarNuevoEscalamiento = function(){ 
        $scope.OpcionDefaultTipoProceso="Seleccione una opción";
        $scope.OpcionDefaultTipoOrden = "Seleccione una opción";            
        $scope.OpcionDefaultEmpresa = "Seleccione una opción";
        $scope.OpcionDefaultSucursal ="Seleccione una opción";
        $scope.OpcionDefaultDepartamento="Seleccione una opción";
        $scope.levels = null;
        $scope.levels =
        [
            { nivel: 0, nivelTexto: "Nivel 0", active:true, idUsuarioAutoriza1: 0,idUsuarioAutoriza2: 0,idUsuarioAutoriza3: 0, usuarioAutoriza1: "", usuarioAutoriza2: "", usuarioAutoriza3: "", minutos: 1}        
        ]; 
        //Carga los tipos de proceso de la entidad
        $scope.listaTipoProceso = _tipoProceso;

         filtroRepository.getSucursales($scope.usuarioId, $scope.empresaId)
             .success(getSucursalesSuccessCallback)
             .error(errorCallBack);
         filtroRepository.getDepartamentos($scope.usuarioId, $scope.empresaId, $scope.sucursalesId)
             .success(getDepartamentosSuccessCallback)
             .error(errorCallBack);
         filtroRepository.getTipoOrden()
             .success(getTipoOrdenSuccessCallback)
             .error(errorCallBack);
        $('#viewNewEscalamiento').modal('show');
    };    

    //Botón para mostrar aprobadores
    var getAprobadores = function(esc){
        $scope.listaTipoProceso = _tipoProceso;
        parametroRepository.getAprobadores(esc.empIdempresa, esc.sucIdsucursal, esc.depIddepartamento, esc.tipoidtipoorden)
            .success(getAprobadoresSuccessCallback1)
            .error(errorCallBack);
    };

    var listaApp = [];
    //Success obtiene lista de aprobadores por nivel
    var getAprobadoresSuccessCallback1 = function (data) {
        $scope.listaAprobadores = data;        
        alertFactory.success('Aprobadores cargados.',data);
    }; 
    
    //Carga y muestra los controles del modal viewUpdateEscalamiento
    $scope.MostrarUpdateEscalamiento = function(escalamiento){
        /*if(escalamiento==null)
        {
            $scope.NewMancomunadouSet();
        }*/
        //$scope.listaTipoProceso = _tipoProceso;      
        //Carga los tipos de proceso de la entidad
        $scope.listaTipoProceso = _tipoProceso;

         filtroRepository.getSucursales($scope.usuarioId, $scope.empresaId)
             .success(getSucursalesSuccessCallback)
             .error(errorCallBack);
         filtroRepository.getDepartamentos($scope.usuarioId, $scope.empresaId, $scope.sucursalesId)
             .success(getDepartamentosSuccessCallback)
             .error(errorCallBack);
         filtroRepository.getTipoOrden()
             .success(getTipoOrdenSuccessCallback)
             .error(errorCallBack);
         
         $scope.OpcionDefaultTipoProceso = escalamiento.nodoNombre;
         $scope.OpcionDefaultEmpresa = escalamiento.empNombre;
         $scope.OpcionDefaultSucursal = escalamiento.sucNombre;
         $scope.OpcionDefaultDepartamento = escalamiento.depNombre;
         //$scope.OpcionDefaultEscalamientoId = escalamiento.escalamientoId;             
         $scope.OpcionDefaultTipoOrden = escalamiento.tipOrden;
         getAprobadores(escalamiento); 
         
         if($scope.listaAprobadores!=null){
            $scope.levels = null;
            $scope.levels = $scope.listaAprobadores;
            nivel =  $scope.levels.length-1;           
         }       
             

        $('#viewUpdateEscalamiento').modal('show');                
    };

    //Asigna el objeto Tipo Proceso
    $scope.NewEscSetTipoProceso = function(tip) {
        //Cargo los tipos de proceso de la entidad
       $scope.NewEscCurrentTipoProceso = tip;

        filtroRepository.getEmpresas($scope.empresaId)
             .success(getEmpresasSuccessCallback)
             .error(errorCallBack);
    };

    //pone inactivo a los tab cada vez que se añade un nuevo tab
    var setAllInactive = function() {
        angular.forEach($scope.levels, function(level) {
        level.active = false;
        });
    };
    
    var nivel = 0;
    //añade nuevo nivel (tab) en el tabset
    var addNewLevel = function() {                
        nivel = nivel+1;        
        $scope.levels.push({
            nivel: nivel,
            nivelTexto: "Nivel " + nivel,
            active: true,
            idUsuarioAutoriza1: 0,            
            idUsuarioAutoriza2: 0,
            idUsuarioAutoriza3: 0,
            usuarioAutoriza1: "",
            usuarioAutoriza2: "",
            usuarioAutoriza3: "",
            minutos: 1            
        });        
    };         
 
    //reinicia arreglo de levels
    $scope.initLevels = function(){
        $scope.levels = null;
        $scope.levels =
        [
            { nivel: 0, nivelTexto: "Nivel 0", active:true, idUsuarioAutoriza1: 0,idUsuarioAutoriza2: 0,idUsuarioAutoriza3: 0, usuarioAutoriza1: "", usuarioAutoriza2: "", usuarioAutoriza3: "", minutos: 1}        
        ];
        nivel=0;
        $scope.currentTipoProceso= null;
        $scope.currentEmpresa= null;
        $scope.currentSucursal= null;
        $scope.currentDepto= null;
        $scope.currentTipoOrden= null;
        $('#viewNewEscalamiento').modal('hide');
        $(this).remove();
    }

    //Cierra el modal 
    $scope.closeUpdateEscalamiento = function(){
        $('#viewUpdateEscalamiento').modal('hide');
        $(this).remove();
    }
    $scope.addLevel = function () {
        setAllInactive();        
        addNewLevel();
    };

    //Inserta Nuevo Escalamiento
    var getInsertEscalamientoSuccessCallback = function(data, status, headers, config){
        getData();
        alertFactory.success('Datos insertados correctamente');
    };

    //actualiza Escalamiento
    var getUpdateEscalamientoSuccessCallback = function(data, status, headers, config){
        getData();
        alertFactory.success('Datos actualizados correctamente');
    };
    
    $scope.setLevelApprover = function(level,op){
        $scope.level = level;
        $scope.op = op;
    }

//realiza el insert para escalamiento
    $scope.insertEscalamiento = function(escalamiento){
        $('#viewNewEscalamiento').modal('hide');
        angular.forEach($scope.levels, function(level){
            $scope.levels.push()
            parametroRepository.insertEscalamiento($scope.productoId, $scope.nodoId, $scope.empresaId, $scope.sucursalId, $scope.departamentoId, $scope.tipoOrdenId,level.nivel, level.idUsuarioAutoriza1, level.idUsuarioAutoriza2, level.idUsuarioAutoriza3, 
                level.minutos)
            .success(getInsertEscalamientoSuccessCallback)
            .error(errorCallBack);
        });
        $scope.initLevels();        
    };

    //realiza el update para escalamiento
    $scope.updateEscalamiento = function(escalamiento){   
        $('#viewNewEscalamiento').modal('hide');     
        angular.forEach($scope.levels, function(level){
            $scope.levels.push()
            parametroRepository.updateEscalamiento(level.nivel, level.idUsuarioAutoriza1, level.idUsuarioAutoriza2, level.idUsuarioAutoriza3, 
                level.minutos)
            .success(getUpdateEscalamientoSuccessCallback)
            .error(errorCallBack);
        });
        $scope.levels = null;        
    };
    /********************************************************************************************************************************************************************************************************************************/



}); 
