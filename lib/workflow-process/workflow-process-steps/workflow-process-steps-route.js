var CONSTANTS = require('../../constants');


angular.module(CONSTANTS.WORKFLOW_DIRECTIVE_MODULE).config(['$stateProvider', function($stateProvider) {

  $stateProvider.state('app.workflowProcess.steps', {
    url: '/steps',
    templateProvider: function($templateCache) {
      return $templateCache.get('wfm-template/workflow-process-steps.tpl.html');
    },
    controller: 'WorkflowProcessStepsController as ctrl'
  });
}]);