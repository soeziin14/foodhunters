angular.module('app').controller('BlogController', BlogController);

function BlogController($auth, $http, API, $rootScope, $window, Upload, $scope, $location, jwtHelper, toaster, $timeout) {

    $scope.recentPhotos = $rootScope.photos;
    $scope.recentPhotosSize = $scope.recentPhotos.length;
    $scope.chosenFiles = [];console.log("chosen photos: ", $scope.chosenFiles);

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
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (f) {
                    $scope.upload(f, false);
                })(files[i]);
            }
        }
    });

    $scope.startUpload = function() {
        for (var i = 0; i < $scope.chosenFiles.length; i++) {
            $scope.errorMsg = null;
            (function (f) {
                $scope.upload(f, false);
            })(files[i]);
        }
    }

    $scope.upload = function (file, resumable) {
        $scope.errorMsg = null;
        $scope.uploadUsingUpload(file, resumable);
    };

    $scope.uploadUsingUpload = function (file, resumable) {console.log("upload?");
        file.upload = Upload.upload({
            url: 'blog/upload',
            data: {username: $scope.username, file: file}
        });

        file.upload.then(function (response) {
            $timeout(function () {
                file.result = response.data;
            });
        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        }, function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });

        file.upload.xhr(function (xhr) {
            console.log("what?", xhr);
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }

    $scope.formSubmit = function() {

        var form = {
            title   : $scope.title,
            atmos   : $scope.atmos,
            food    : $scope.food,
            service : $scope.service
        };

        $http.post('/blog', form).then(function(response){

            console.log("/blog/new response: ", response);
            $location.path('/blog');
        }).catch(function(err) {
                console.log("err: ", err);
        })
    }
}

