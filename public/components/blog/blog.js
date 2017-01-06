angular.module('app').controller('BlogController', BlogController);

function BlogController($http, API,$routeParams, $rootScope, Upload, $scope, $location, jwtHelper, toaster, $timeout, blogDataFactory) {

    $scope.recentPhotos = $rootScope.photos;
    $scope.chosenFiles = [];
    $scope.ratings = {
        atmosphere: 5,
        food: 5,
        service: 5,
        price: 5
    };

    var counter = 0;
    $scope.$watch('files', function (files) {console.log("files: ", files);
        console.log("chosen photos: ", $scope.chosenFiles);
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
            //for (var i = 0; i < files.length; i++) {
            //    $scope.errorMsg = null;
            //    (function (f) {
            //        $scope.upload(f, false);
            //    })(files[i]);
            //}
        }
    });

    $scope.startUpload = function() {
        for (var i = 0; i < $scope.chosenFiles.length; i++) {
            $scope.errorMsg = null;
            (function (f) {
                $scope.uploadS3(f, false);
            })($scope.chosenFiles[i]);
        }
    }

    $scope.uploadS3 = function(file, resumable){
        if (file) {
            var filename = file.name;
            var type = file.type;
            var query = {
                filename: filename,
                type: type
            };
            $http.post('/blog/signing', query)
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
                        // file is uploaded successfully
                        console.log('file ' + config.file.name + 'is uploaded successfully. Response: ' + data.key);
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
                                id: $rootScope.currentUser._id,
                                name: $rootScope.currentUser.fullName
                            },
                            photos: config.file.name,
                        };
                        $http.post('/blog', form).then(function(response){

                            console.log("/blog/new response: ", response);
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
    }
    $scope.upload = function (file, resumable) {
        $scope.errorMsg = null;
        $scope.uploadUsingUpload(file, resumable);
    };

    $scope.uploadUsingUpload = function (file, resumable) {

        file.upload = Upload.upload({
            url: 'blog/upload',
            enctype: 'multipart/form-data',
            data: {username: $rootScope.currentUser.displayName, file: file}
        });

        file.upload.then(function (response) {
            console.log("response: ", response);
            console.log("coutner: ", counter + " ## " + $scope.chosenFiles.length);
            counter++;
            //$timeout(function () {
            //    file.result = response.data;
            //});
            if (counter == $scope.chosenFiles.length) {
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
                        id: $rootScope.currentUser._id,
                        name: $rootScope.currentUser.fullName
                    },
                    photos: response.data.photos,
                };
                $http.post('/blog', form).then(function(response){

                    console.log("/blog/new response: ", response);
                    $location.path('/blog/index');
                }).catch(function(err) {
                    console.log("err: ", err);
                })
            }

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
            // Math.min is to fix IE which reports 200% sometimes
            //file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }

    $scope.loadIndex = function() {
        blogDataFactory.blogList().then(function(response) {
            $scope.indexBlogs = response.data.blog;
            console.log("indexBLogs: ", $scope.indexBlogs);

        });
    }

    $scope.show = function() {
        blogDataFactory.blogShow($routeParams.id).then(function(response){
            $scope.showBlog = response.data.blog;console.log("$scope:showBlog: ", $scope.showBlog);
        })
    }
    $scope.getValidRestaurants = function() {
        $http.get('/restaurant/allValidatedRestaurants').then(function(response) {
            console.log("RESPONSE: ", response);
            $scope.allRestaurants = response.data.restaurants;
            console.log("$scope.all: ", $scope.allRestaurants);
        })
    }
}

