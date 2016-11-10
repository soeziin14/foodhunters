describe('Sign-Up controller', function() {
    var $httpBackend, $rootScope, createController;

    var userList = [
        {
            email       :  'qwe@qwe.com',
            firstname   :  'Mike',
            lastname    :  'Kim',
            username    :  'SuperCool',
            password    :  'encryptedsomething',
            address     :  ''
        },
        {
            email       :  'qwe@qwe.com',
            firstname   :  'Mike',
            lastname    :  'Kim',
            username    :  'SuperCool',
            password    :  'encryptedsomething',
            address     :  ''
        },
        {
            email       :  'diff@diff.com',
            firstname   :  'Suzy',
            lastname    :  'Paylor',
            username    :  'cutiepie9933',
            password    :  'encryptedsomething',
            address     :  ''
        },
        {
            email       :  'higuys333@yahoo.co.kr',
            firstname   :  'Jake',
            lastname    :  'Tatum',
            username    :  'guywith6packs',
            password    :  'encryptedsomething',
            address     :  ''
        }
    ];

    // Load our api.users module
    beforeEach(angular.mock.module('app'));

    beforeEach(inject(function($injector) {

        $httpBackend    = $injector.get('$httpBackend');
        $rootScope      = $injector.get('$rootScope');
        var $controller = $injector.get('$controller');

        createController = function() {
            return $controller('SignupController', {'$scope' : $rootScope });
        };
    }));

    it('register new valid user', function() {

        $httpBackend
            .expect('POST', 'api/CRUD/signup',
                {
                    email       :  'qwe@qwe.com',
                    firstname   :  'Mike',
                    lastname    :  'Kim',
                    username    :  'SuperCool',
                    password    :  'encryptedsomething',
                    address     :  ''
                }
            )
            .respond(201);
    });

    it('register new INVALID user', function() {

        $httpBackend
            .expect('POST', 'api/CRUD/signup',
                {
                    email       :   null,
                    firstname   :  'Mike',
                    lastname    :  'Kim',
                    username    :  'SuperCool',
                    password    :  'encryptedsomething',
                    address     :  ''
                }
            )
            .respond(400);
    });
});