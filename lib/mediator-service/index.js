var CONSTANTS = require('../constants');
var MediatorTopicUtility = require('fh-wfm-mediator/lib/topics');

/**
 *
 * Removes variables added by angular from an object.
 *
 * @param {Object} itemToCleanse
 */
function removeAngularVars(itemToCleanse) {
  return JSON.parse(angular.toJson(itemToCleanse)); //remove generated angular variables
}



/**
 *
 * A mediator service that will publish and subscribe to topics to be able to render workflow data.
 *
 * @param {Mediator} mediator
 * @param {object}   config
 * @constructor
 */
function WorkflowMediatorService(mediator, config) {
  this.mediator = mediator;
  this.config = config || {};

  this.workflowsTopics = new MediatorTopicUtility(mediator).prefix(CONSTANTS.TOPIC_PREFIX).entity(CONSTANTS.WORKFLOWS_ENTITY_NAME);
  this.workordersTopics = new MediatorTopicUtility(mediator).prefix(CONSTANTS.TOPIC_PREFIX).entity(CONSTANTS.WORKORDER_ENTITY_NAME);
  this.workflowStepSubscribers = new MediatorTopicUtility(mediator).prefix(CONSTANTS.WORKFLOW_PREFIX).entity(CONSTANTS.STEPS_ENTITY_NAME);

  this.workflowUITopics = new MediatorTopicUtility(mediator).prefix(CONSTANTS.WORKFLOW_UI_TOPIC_PREFIX).entity(CONSTANTS.WORKFLOW);
}


/**
 *
 * Listing All Workflows
 *
 * @returns {Promise}
 */
WorkflowMediatorService.prototype.listWorkflows = function listWorkflows() {
  return this.mediator.publish(this.workflowsTopics.getTopic(CONSTANTS.TOPICS.LIST));
};

/**
 *
 * Listing all workorders
 *
 * @returns {Promise}
 */
WorkflowMediatorService.prototype.listWorkorders = function listWorkorders() {

  return this.mediator.publish(this.workordersTopics.getTopic(CONSTANTS.TOPICS.LIST));
};


/**
 *
 * Reading A single workflow
 *
 * @param {string} workflowId
 * @returns {Promise}
 */
WorkflowMediatorService.prototype.readWorkflow = function readWorkflow(workflowId) {

  return this.mediator.publish(this.workflowsTopics.getTopic(CONSTANTS.TOPICS.READ), {id: workflowId, topicUid: workflowId});
};

/**
 *
 * Reading A single workorder
 *
 * @param {string} workorderId
 * @returns {Promise}
 */
WorkflowMediatorService.prototype.readWorkorder = function readWorkorder(workorderId) {
  return this.mediator.publish(this.workordersTopics.getTopic(CONSTANTS.TOPICS.READ), {id: workorderId, topicUid: workorderId});
};

/**
 *
 * Updating A Single Workflow
 *
 * @param {object} workflowToUpdate - The Workflow To Update
 * @param {string} workflowToUpdate.id - The ID of the Workorder To Update
 * @returns {Promise}
 */
WorkflowMediatorService.prototype.updateWorkflow = function updateWorkflow(workflowToUpdate) {
  workflowToUpdate = removeAngularVars(workflowToUpdate);

  return this.mediator.publish(this.workflowsTopics.getTopic(CONSTANTS.TOPICS.UPDATE), {
    workflowToUpdate: workflowToUpdate,
    topicUid: workflowToUpdate.id
  });
};


/**
 *
 * Creating A Single Workflow
 *
 * @param {object} workflowToCreate - The Workflow To Create
 * @returns {Promise}
 */
WorkflowMediatorService.prototype.createWorkflow = function createWorkflow(workflowToCreate) {

  workflowToCreate = removeAngularVars(workflowToCreate);

  return this.mediator.publish(this.workflowsTopics.getTopic(CONSTANTS.TOPICS.CREATE), {
    workflowToCreate: workflowToCreate
  });
};

/**
 *
 * Removing A Single Workorder
 *
 * @param {object} workflowToRemove - The Workorder To Remove
 * @param {string} workflowToRemove.id - The ID of the workorder to remove.
 * @returns {Promise}
 */
WorkflowMediatorService.prototype.removeWorkflow = function removeWorkorder(workflowToRemove) {
  var workflowToRemoveId = workflowToRemove.id || workflowToRemove._localuid;

  return this.mediator.publish(this.workflowsTopics.getTopic(CONSTANTS.TOPICS.REMOVE), {
    id: workflowToRemoveId
  });
};

/**
 *
 * Small utility function to subscribe to done topics for update/remove/create topics for a scope
 *
 * @param $scope
 * @param subscriberFunc
 */
WorkflowMediatorService.prototype.subscribeToWorkflowCRUDDoneTopics = function($scope, subscriberFunc) {
  this.mediator.subscribeForScope(this.workflowsTopics.getTopic(CONSTANTS.TOPICS.CREATE, CONSTANTS.DONE_PREFIX), $scope, function() {
    subscriberFunc();
  });

  this.mediator.subscribeForScope(this.workflowsTopics.getTopic(CONSTANTS.TOPICS.UPDATE, CONSTANTS.DONE_PREFIX), $scope, function() {
    subscriberFunc();
  });

  this.mediator.subscribeForScope(this.workflowsTopics.getTopic(CONSTANTS.TOPICS.REMOVE, CONSTANTS.DONE_PREFIX), $scope, function() {
    subscriberFunc();
  });
};


/**
 *
 * Beginning a workflow for a single workorder.
 *
 * @param {string} workorderId - The ID of the workorder to begin the workflow for.
 */
WorkflowMediatorService.prototype.beginWorkflow = function(workorderId) {
  return this.mediator.publish(this.workflowStepSubscribers.getTopic(CONSTANTS.TOPICS.BEGIN), {
    workorderId: workorderId
  });
};

/**
 *
 * Getting a summary of the workorder. This wiil get all of the details related to the workorder, including workflow and result data.
 *
 * @param {string} workorderId - The ID of the workorder to get the summary for.
 */
WorkflowMediatorService.prototype.workflowSummary = function(workorderId) {
  return this.mediator.publish(this.workflowStepSubscribers.getTopic(CONSTANTS.TOPICS.SUMMARY), {
    workorderId: workorderId
  });
};


/**
 *
 * Going to the previous step of a workorder.
 *
 * @param {string} workorderId - The ID of the workorder to switch to the previous step for
 */
WorkflowMediatorService.prototype.previousStep = function(workorderId) {
  return this.mediator.publish(this.workflowStepSubscribers.getTopic(CONSTANTS.TOPICS.PREVIOUS), {
    workorderId: workorderId
  });
};



/**
 *
 * Completing a single step for a workorder.
 *
 * @param parameters
 * @param {string} parameters.workorderId - The ID of the workorder to complete the step for
 * @param {string} parameters.submission - The submission to save
 * @param {string} parameters.stepCode - The ID of the step to save the submission for
 */
WorkflowMediatorService.prototype.completeStep = function(parameters) {
  return this.mediator.publish(this.workflowStepSubscribers.getTopic(CONSTANTS.TOPICS.COMPLETE), {
    workorderId: parameters.workorderId,
    submission: parameters.submission,
    stepCode: parameters.stepCode
  });
};


angular.module(CONSTANTS.WORKFLOW_DIRECTIVE_MODULE).service("workflowMediatorService", ['mediator', 'WORKFLOW_CONFIG', function(mediator, WORKFLOW_CONFIG) {
  return new WorkflowMediatorService(mediator, WORKFLOW_CONFIG);
}]);