(function () {

    angular
        .module('app')
        .controller('EdublocksController', EdublocksController);

    EdublocksController.$inject = [
        'authService', 'projectsService', 'scratchkeysService',
        '$stateParams', '$scope'
    ];

    function EdublocksController(authService, projectsService, scratchkeysService, $stateParams, $scope) {

        var vm = this;
        vm.authService = authService;

        $scope.projectId = $stateParams.projectId;
        $scope.userId = $stateParams.userId;

        $scope.projecturls = {
            edublocks : 'https://beta.app.edublocks.org/',
            train : '/#!/mlproject/' + $stateParams.userId + '/' + $stateParams.projectId + '/training',
            learnandtest : '/#!/mlproject/' + $stateParams.userId + '/' + $stateParams.projectId + '/models'
        };

        authService.getProfileDeferred()
            .then(function (profile) {
                vm.profile = profile;

                return projectsService.getProject($scope.projectId, $scope.userId, profile.tenant);
            })
            .then(function (project) {
                $scope.project = project;

                $scope.projecturls.train = '/#!/mlproject/' + $scope.project.userid + '/' + $scope.project.id + '/training';
                $scope.projecturls.learnandtest = '/#!/mlproject/' + $scope.project.userid + '/' + $scope.project.id + '/models';

                return scratchkeysService.getScratchKeys($stateParams.projectId, $stateParams.userId, vm.profile.tenant);
            })
            .then(function (resp) {
                if (resp) {
                    $scope.scratchkey = resp[0];
                    $scope.edublocksurl = $scope.projecturls.edublocks +
                                            '#mlstarter?' +
                                            $scope.scratchkey.id;
                }
            })
            .catch(function (err) {
                $scope.failure = {
                    message : err.data.error,
                    status : err.status
                };
            });
    }
}());
