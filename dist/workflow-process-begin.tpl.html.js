var ngModule;
try {
  ngModule = angular.module('wfm.workflow.directives');
} catch (e) {
  ngModule = angular.module('wfm.workflow.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/workflow-process-begin.tpl.html',
    '<div class="workflow" ng-if="ctrl.workflow">\n' +
    '  <workflow-progress workflow="ctrl.workflow" step-index="ctrl.stepIndex"></workflow-progress>\n' +
    '\n' +
    '  <workorder workorder="ctrl.workorder" status="ctrl.status"></workorder>\n' +
    '  <div class="workflow-actions md-padding md-whiteframe-z4">\n' +
    '    <md-button ng-click="ctrl.begin()" class="md-primary">\n' +
    '      <span ng-if="ctrl.stepIndex === 0">Begin Workflow</span>\n' +
    '      <span ng-if="ctrl.stepIndex > 0 && ctrl.stepIndex < ctrl.workflow.steps.length">Continue Workflow</span>\n' +
    '      <span ng-if="ctrl.stepIndex >= ctrl.workflow.steps.length">View Summary</span>\n' +
    '    </md-button>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);
