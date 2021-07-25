let app = angular.module("MonthManagement", []);

// Controller Part
app.controller("MonthController", function($scope, $http) {

    $scope.modal = false;
    $scope.value = null;
    $scope.bool = false;
    $scope.insert = false;

    $scope.id = 0;
    $scope.inputValue = null;

    $scope.idValue = 0;
    $scope.monthName = null;

    $scope.month = {
        id: 0,
        name: ""
    };
    $scope.monthAction = {
        id : 0,
        name: ""
    };

    $scope.resizeMode = "OverflowResizer";
    $scope.table = undefined;


    $http.get('/main/months').then(function (response) {
            $scope.months = response.data;
        }
    );

    $scope.submitMonth = function(inputValue) {

        if($scope.bool){
            $scope.bool = false;
        }
        $http({
            method: 'POST',
            url: '/main/search',
            data: angular.toJson({"name": inputValue}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            $scope.months = response.data;
        });
    };

    $scope.clickElement = function (event, bool) {
        $scope.value = event.target.parentElement.children[1].innerHTML;
        $scope.id = event.target.parentElement.children[0].innerHTML;
        if(!bool)
            $scope.bool = !bool;
    };

    $scope.updateMonth = function(idValue, inputValue, modal, bool){

        $scope.modal = !modal;
        $scope.bool = !bool;

        $scope.id = idValue;
        $scope.value = inputValue;

        $scope.monthAction = { id: idValue, name: inputValue };

        angular.element(document.getElementById('inputModal')).attr('disabled', false);

    };

    $scope.createMonth = function(modal){
        $scope.modal = !modal;
        $scope.id = 0;
        $scope.value = "";
        angular.element(document.getElementById('inputModal')).attr('disabled', false);
    };

    $scope.deleteMonth = function (idValue, modal, bool) {
        $scope.modal = !modal;
        $scope.bool =!bool;
        $scope.delete = true;
        angular.element(document.getElementById('inputModal')).attr('disabled', true);
    }
});

app.directive('modalDialog', function ($http) {
    return{
        restrict:'E',
        scope: false,
        template: "<div id='modalDialog-bg' ng-show='modal'>" +
                        "<div id='modalDialog'>" +
                        "<div class='content' >" +

                            "<input type='hidden' ng-model='id' />" +
                            "<input id='inputModal' type='text'  placeholder='Mесяц' ng-model='value' />" +

                        "</div>" +
                        "<div class='buttons-container' >" +
                        "<div class='pull-left'>" +
                            "<button class='btn btn-primary' ng-click='doneAction(id, value, modal, bool)'>Выполнить</button>" +
                        "</div>" +
                        "<div class='pull-right'>" +
                            "<button class='btn btn-warning' ng-click='closeModalDialog(modal, bool)'>Отмена</button>" +
                        "</div>" +

                        "</div>" +
                        "</div>" +
                        "</div>" ,
        controller:function ($scope) {

            $scope.closeModalDialog = function(modal, bool){
                $scope.modal = !modal;
                $scope.bool = !bool;
            };

            $scope.doneAction = function(id, value, modal, bool){

                $scope.modal = !modal;
                $scope.bool = !bool;

                $scope.month = {id: id, name: value};
                if(id === 0 ){
                    $scope.insert = true;
                    $http({
                        method: 'POST',
                        url: '/main/create',
                        data: angular.toJson({"name": value}),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function (response) {
                       if($scope.inputValue === null || $scope.month.name.toLowerCase().includes($scope.inputValue.toLowerCase())){
                           $scope.month =response.data;

                           $http({
                               method: 'POST',
                               url: '/main/search',
                               data: angular.toJson({"name": $scope.inputValue}),
                               headers: {
                                   'Content-Type': 'application/json'
                               }
                           }).then(function (response) {
                               $scope.months = response.data;
                           });
                       }
                    })
                }
                if(id !== 0 && !$scope.delete) {
                    $http({
                        method: 'POST',
                        url: '/main/update',
                        data: angular.toJson($scope.month),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function (response) {
                        if($scope.inputValue === null || $scope.month.name.toLowerCase().includes($scope.inputValue.toLowerCase())) {
                            $scope.month = response.data[0];
                            let td_name = angular.element(document.getElementById(id).nextElementSibling);
                            td_name.text(value);
                        } else {
                            let td_name = angular.element(document.getElementById(id).nextElementSibling);
                            td_name.remove();
                            let td_id = angular.element(document.getElementById(id));
                            td_id.remove();
                        }

                    });
                }
                if($scope.delete){

                    $scope.delete = false;

                    $http({
                        method: 'POST',
                        url: '/main/delete',
                        data: angular.toJson({"id" : id}),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function () {
                        let td_name = angular.element(document.getElementById(id).nextElementSibling);
                        td_name.remove();
                        let td_id = angular.element(document.getElementById(id));
                        td_id.remove();
                    });
                }
            };
        }
    }
});

