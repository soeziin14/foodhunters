angular.module('app').controller('BlogController', BlogController);

function BlogController($http, $routeParams, $rootScope, Upload, $scope, $location,toaster, $timeout, blogDataFactory, userDataFactory) {

    $scope.recentPhotos = $rootScope.photos;
    $scope.chosenFiles = [];
    $scope.ratings = {
        atmosphere: 5,
        food: 5,
        service: 5,
        price: 5
    };
    $scope.timestamp = null;
    $scope.userName;

    $scope.getUserName = function(){
        $scope.userName = $rootScope.currentUser.displayName;
    },
    $scope.$watch('files', function (files) {
        //console.log("chosen photos: ", $scope.chosenFiles);
        if(files && files[0] && !files[0].$error) {
            $scope.chosenFiles.push(files[0]);
        }
        $scope.formUpload = false;
        if (files != null) {
            // make files array for not multiple to be able to be used in ng-repeat in the ui
            if (!angular.isArray(files)) {
                $timeout(function () {
                    $scope.files = files = [files];
                });
                return;
            }
        }
    });
    $scope.startUpload = function() {
        $scope.timestamp = Date.now();
        for (var i = 0; i < $scope.chosenFiles.length; i++) {
            $scope.errorMsg = null;
            (function (f) {
                $scope.uploadS3(f, false);
            })($scope.chosenFiles[i]);
        }
    },
    $scope.uploadS3 = function(file, resumable){
        if (file) {
            var filename = file.name;
            var type = file.type;
            var query = {
                filename: filename,
                type: type
            };
            $http.post('/blogs/uploads3', query)
                .success(function(result) {
                    Upload.upload({
                        url: result.url, //s3Url
                        transformRequest: function(data, headersGetter) {
                            var headers = headersGetter();
                            delete headers.Authorization;
                            return data;
                        },
                        fields: result.fields, //credentials
                        method: 'POST',
                        file: file
                    }).progress(function(evt) {
                        console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function(data, status, headers, config) {
                        //console.log($rootScope.currentUser);
                        // file is uploaded successfully
                        console.log('file ' + config.file.name + 'is uploaded successfully. Response: ' + data);
                        var form = {
                            title   : $scope.title,
                            descriptions : {
                                atmosphere  : $scope.atmos,
                                food        : $scope.food,
                                service     : $scope.service,
                                price       : $scope.price,
                            },
                            ratings : $scope.ratings,
                            author: {
                                id: $rootScope.currentUser.displayName,
                                name: $rootScope.currentUser.fullName
                            },
                            photos: config.file.name,
                            timestamp: $scope.timestamp,
                        };
                        $http.post('/blogs/new', form).then(function(response){
                            //console.log("/blog/new response: ", response);
                            $location.path('/blog/index');
                        }).catch(function(err) {
                            console.log("err: ", err);
                        })
                    }).error(function() {

                    });
                })
                .error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }
    },
    $scope.getAllUserBlogs = function() {
        blogDataFactory.getAllUserBlogs().then(function(response) {
            $scope.allUserBlogs = response.data.blog;
        });
    },
    $scope.show = function() {
        blogDataFactory.getOneUserBlog($routeParams.id).then(function(response){
            $scope.showBlog = response.data.blog;console.log("$scope:showBlog: ", $scope.showBlog);
        })
    },
    $scope.getValidRestaurants = function() {
        $http.get('/restaurant/allValidatedRestaurants').then(function(response) {
            console.log("RESPONSE: ", response);
            $scope.allRestaurants = response.data.restaurants;
            console.log("$scope.all: ", $scope.allRestaurants);
        })
    }
}

