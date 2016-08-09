/*global $*/
/*global window*/
/*global angular*/
/*global cordova*/
/*global StatusBar*/
/*global CryptoJS*/
/*global localStorage*/
/*jslint node: true */
"use strict";
// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ngRoute']);
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {templateUrl: 'connexion.html'})
        .when('/dash', {templateUrl: 'dashboard.html'})
        .when('/add', {templateUrl: 'add.html'})
        .when('/des', {templateUrl: 'description.html'})
        .when('/details', {templateUrl: 'details.html'})
        .when('/yes', {templateUrl: 'success.html'})
        .when('/no', {templateUrl: 'error.html'})
        .when('/moreDetails', {templateUrl: 'moreDetails.html'})
        .when('/showAdd', {templateUrl: 'vueCommentaire.html'})
        .when('/friendList', {templateUrl: 'friendList.html'})
        .when('/menuAmi', {templateUrl: 'menuAmi.html'})
        .otherwise({redirectTo: '/'});
}]);
app.factory('api', [function () {
    var url = "https://api.betaseries.com/",
        urlParams = '?key=20b207a1048b&v=2.4',
        token = '&token=' + localStorage.getItem('tokenBeta');


    return {
        get: function (method, param, fn, headers) {
            this.ajax('GET', url + method + urlParams + token, param, fn, headers);
        },
        post: function (method, param, fn, headers) {
            this.ajax('POST', url + method + urlParams + token, param, fn, headers);
        },
        delete: function (method, param, fn, headers) {
            this.ajax('DELETE', url + method + urlParams + token, param, fn, headers);
        },
        ajax: function (method, url, param, fn, headers) {
            var h = {
                "X-BetaSeries-Key" : "20b207a1048b"
            }, p;
            for (p in headers) {
                if (headers.hasOwnProperty(p)) {
                    h[p] = headers[p];
                }
            }
            $.ajax(url, {
                success: fn,
                data: param,
                headers: h,
                method: method,
                dataType: 'json'
            });
        }
    };
}]);
app.factory('connexion', [function () {
    var url = "https://api.betaseries.com/",
        urlParams = '?key=20b207a1048b&v=2.4';

    return {
        post: function (method, param, fn, headers) {
            this.ajax('POST', url + method + urlParams, param, fn, headers);
        },
        ajax: function (method, url, param, fn, headers) {
            var h = {
                "X-BetaSeries-Key" : "20b207a1048b"
            }, p;

            for (p in headers) {
                if (headers.hasOwnProperty(p)) {
                    h[p] = headers[p];
                }
            }
            $.ajax(url, {
                success: fn,
                data: param,
                headers: h,
                method: method,
                dataType: 'json'
            });
        }
    };
}]);
/*app.directive('long', ['$timeout', '$location', function ($setTimeout, $location) {
    return {
        restrict : 'A',
        link: function ($scope, elem) {
            elem.on('touchstart', function () {
                $scope.long = true;
                $setTimeout(function () {
                    if ($scope.long) {
                        $location.path('/des');
                    }
                }, 200);
            });
            elem.on('touchend', function () {
                $scope.long = false;
            });
        }
    };
}]);*/
angular.module('app', ['ngTouch', 'ngRoute']);
app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});
app.factory('myLocation', ["$timeout", "$location", function ($timeout, $location) {
    return {
        path: function (path) {
            $timeout(function () {
                $location.path(path);
            }, 0);
        }
    };
}]);
app.controller('MenuAmiController', ['$scope', 'api', 'myLocation', function ($scope, api, $location) {
    $scope.back = function () {
        $location.path('/dash');
    };
    $scope.blok = function () {
        var param = {'id' : localStorage.getItem('idCopain')};

        api.post('friends/block', param, function () {
            $location.path('/yes');
        });
    };
    $scope.delet = function () {
        var param = {'id' : localStorage.getItem('idCopain')};

        api.delete('friends/friend', param, function () {
            $location.path('/yes');
        });
    };
}]);
app.controller('FriendListController', ['$scope', 'api', 'myLocation', function ($scope, api, $location) {
    var param = {'id' : localStorage.getItem("idUserBeta")},
        param2 = {'received ' : 'received'};
    api.get('friends/list', param, function (data) {
        $scope.amis = data.users;
        $scope.$apply();
    });
    api.get('friends/requests', param2, function (data) {
        localStorage.setItem('idDemandeCopain', data.users.users);
        $scope.lists = data.users.users;
    });
    $scope.back = function () {
        $location.path('/dash');
    };
    $scope.menuAmi = function (id) {
        localStorage.setItem('idCopain', id);
        $location.path('/menuAmi');
    };
    $scope.demandeAmi = function () {
        var param3 = {'id' : localStorage.getItem("idDemandeCopain")};

        api.get('friends/friend', param3, function () {
            $location.path('/yes');
        });
    };
}]);
app.controller('VueCommentaireController', ['$scope', 'api', 'myLocation', function ($scope, api, $location) {
    $scope.back = function () {
        $location.path('/dash');
    };
    $scope.commentaire = function () {
        var param4 = {'type' : 'episode', 'id' : localStorage.getItem("idSeries"), 'text' : $scope.commentaire};

        api.post('comments/comment', param4, function () {
            $location.path('/yes');
        });
    };
}]);
app.controller('MoreDetailsController', ['$scope', 'api', 'myLocation', function ($scope, api, $location) {
    var param = {'id' : localStorage.getItem("idSeries")};

    api.get('episodes/display', param, function (data) {
        $scope.detail = data.episode;
        $scope.$apply();
    });
    api.get('shows/pictures', param, function (data) {
        $scope.image = data.pictures[0].url;
        $scope.$apply();
    });
    $scope.back = function () {
        $location.path('/dash');
    };
}]);
app.controller('DetailsController', ['$scope', 'api', 'myLocation', function ($scope, api, $location) {
    var param = {'showId' : localStorage.getItem('idSeries')};
    api.get('episodes/list', param, function (data) {
        $scope.noViews = data.shows[0].unseen;
        $scope.$apply();
    });
    $scope.back = function () {
        $location.path('/dash');
    };
    $scope.check = function (id) {
        localStorage.setItem('idEpisode', id);
        param = {'id' : localStorage.getItem('idEpisode'), 'bulk' : true};
        api.post('episodes/watched', param, function () {
            $location.path('/showAdd');
        });
    };
    $scope.pasVues = function (id) {
        localStorage.setItem('idEpisode', id);
    };
    $scope.onHold = function (id) {
        console.log(id);
        localStorage.setItem('idEpisode', id);
        $location.path('/moreDetails');
    };
}]);
app.controller('AddController', ['$scope', 'api', 'myLocation', function ($scope, api, $location) {
    $scope.search = function () {
        var param = {'title' : $scope.titre, 'order' : 'title', 'nbpp' : '5', 'page' : '1'},
            param2 = {'login' : $scope.titre};

        api.get('shows/search', param, function (data) {
            $scope.serieRecherches = data.shows;
            $scope.$apply();

        });
        api.get('members/search', param2, function (data) {
            $scope.amisRecherches = data.users;
            $scope.$apply();
        });
    };
    $scope.back = function () {
        $location.path('/dash');
    };
    $scope.details = function (id) {
        localStorage.setItem('idSeries', id);
        $location.path('/des');
    };
}]);
app.controller('DesController', ['$scope', 'api', 'myLocation', function ($scope, api, $location) {
    var param1 = {'id' : localStorage.getItem("idSeries")},
        param2 = {'id' : localStorage.getItem("idSeries")};

    api.get('shows/display', param1, function (data) {
        $scope.description = data.show;
        $scope.$apply();
    });
    api.get('shows/pictures', param2, function (data) {
        $scope.image = data.pictures[0].url;
        $scope.$apply();
    });
    $scope.back = function () {
        $location.path('/dash');
    };
    $scope.archivage = function () {
        var param = {'id' : localStorage.getItem("idSeries")};

        api.post('shows/archive', param, function () {
            $location.path('/yes');
        });
    };
    $scope.details = function () {
        $location.path('/details');
    };
}]);
app.controller('DashController', ['$scope', 'api', '$timeout', 'myLocation', function ($scope, api, $timeout, $location) {
    var param = {'id' : localStorage.getItem("idUserBeta"), 'only' : 'shows'};

    api.get('members/infos', param, function (data) {
        $timeout(function () {
            $scope.series = data.member.shows;
        }, 0);
    });
    $scope.add = function () {
        $location.path('/add');
    };
    $scope.description = function (id) {
        localStorage.setItem('idSeries', id);
        $location.path('/details');
    };
    $scope.titreSeries = function (id) {
        localStorage.setItem('idSeries', id);
    };
    $scope.friend = function () {
        $location.path('/friendList');
    };
    $scope.onHold = function (id) {
        localStorage.setItem('idSeries', id);
        $location.path('/des');
    };
}]);
app.controller('SuccessController', ['$scope', 'myLocation', function ($scope, $location) {
    $scope.back = function () {
        $location.path('/dash');
    };
}]);
app.controller('ErrorController', ['$scope', 'myLocation', function ($scope, $location) {
    $scope.back = function () {
        $location.path('/dash');
    };
}]);
app.controller('ConnexionController', ['$scope', 'myLocation', 'connexion', '$timeout', function ($scope, $location, connexion, $timeout) {
    $scope.connexion = function () {
        var param = {'login' : $scope.logMail, 'password': CryptoJS.MD5($scope.logPass).toString()};

        connexion.post('members/auth', param, function (data) {
            localStorage.setItem("tokenBeta", data.token);
            localStorage.setItem("idUserBeta", data.user.id);
            $timeout(function () {
                $location.path('/yes');
            }, 0);
        });
    };
}]);