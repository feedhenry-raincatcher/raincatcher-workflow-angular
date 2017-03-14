var CONSTANTS = require('../../constants');

angular.module(CONSTANTS.WORKFLOW_DIRECTIVE_MODULE).directive('workflowStep', function($templateRequest, $compile) {
  return {
    restrict: 'E'
    , link: function(scope, element) {
      scope.$watch(angular.bind(scope.ctrl, function() {
        return this.stepCurrent;
      }), function(currentStep) {
        if (currentStep) {
          if (currentStep.formId) {
            element.html('<appform form-id="step.formId"></appform>');
            $compile(element.contents())(scope);
          } else if (currentStep.templatePath) {
            $templateRequest(currentStep.templatePath).then(function(template) {
              element.html(template);
              $compile(element.contents())(scope);
            });
          } else {
            element.html(currentStep.templates.form);
            $compile(element.contents())(scope);
          }
        }
      });
    }
  };
});