registrationModule.controller("agrupadorController", function ($scope, uiSortableMultiSelectionMethods, alertFactory, agrupadorRepository) {


 //Propiedades
    $scope.idEmpleado = 1;

    //Funcion que carga al inicio para obtener la ficha de empleado
    $scope.init = function () {
      
      alertFactory.info('entra al controller');

    };
    
    $scope.Salir = function () {

      alertFactory.info('exit de agrupadorController');

    };

 function makeList(letter) {
        var tmpList = [];

        for (var i = 1; i <= 15; i++) {
            tmpList.push({
                text: 'Item ' + i + letter,
                value: i + letter
            });
        }
        return tmpList;
    }

        $scope.list1 = makeList('a');
        $scope.list2 = makeList('b');
        $scope.list3 = [];
        $scope.rawScreens = [
        $scope.list1,
        $scope.list2,
        $scope.list3
    ];


    $scope.sortingLog = [];

    $scope.sortableOptions = uiSortableMultiSelectionMethods.extendOptions({
        connectWith: ".apps-container"
    });

    $scope.logModels = function () {
        $scope.sortingLog = [];
        for (var i = 0; i < $scope.rawScreens.length; i++) {
            var logEntry = $scope.rawScreens[i].map(function (x) {
                return x.text;
            }).join(', ');
            logEntry = 'Agrupamiento #' + (i + 1) + ': ' + logEntry;
            $scope.sortingLog.push(logEntry);
        }
    };
});



