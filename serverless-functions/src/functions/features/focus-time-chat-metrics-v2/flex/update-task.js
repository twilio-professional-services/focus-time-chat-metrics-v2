const { prepareStudioFunction } = require(Runtime.getFunctions()[
  "common/helpers/prepare-function"
].path);
const ChatOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/programmable-chat"
].path);
const TaskOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/taskrouter"
].path);

const requiredParameters = [
  { key: "taskSid", purpose: "task sid to remove the chat channel from" },
  { key: "focusTime", purpose: "focus time measured for the reservation" },
  {
    key: "additional_features",
    purpose: "enabled features for chat metrics",
  },
  { key: "workerName", purpose: "name of the worker" },
  { key: "conversationSid", purpose: "channel SID of the chat" },
  { key: "reservationAccepted", purpose: "time of reservation accepted" },
];

exports.handler = prepareStudioFunction(
  requiredParameters,
  async (context, event, callback, response, handleError) => {
    try {
      const taskSid = event.taskSid;
      const focusTime = parseInt(event.focusTime);
      const focusMetric = event.focus_metric;
      const additionalChannels = JSON.parse(event.additionalChannelsString);
      const taskChannelUniqueName = event.taskChannelUniqueName;

      let attributesUpdateJSON = {
        conversations: { [focusMetric]: focusTime },
      };

      if (additionalChannels.includes(taskChannelUniqueName)) {
        const conversationSid = event.conversationSid;
        const workerName = event.workerName;
        const dateAccepted = event.reservationAccepted;
        const configuredFeatures = JSON.parse(event.additional_features);

        const { messages } = await ChatOperations.getChannelMessages({
          context,
          conversationSid,
          attempts: 0,
        });

        // agent first reply
        if (configuredFeatures["firstAgentResponse"] !== null) {
          const agentFirstResponse = messages.find(
            (m) => m.from === workerName
          );
          let firstAgentMessageDuration = 0;

          if (agentFirstResponse) {
            const agentFirstResponseTimeUTC = new Date(
              new Date(agentFirstResponse.dateCreated).toISOString()
            );
            const dateAcceptedUTC = new Date(dateAccepted);
            firstAgentMessageDuration =
              (agentFirstResponseTimeUTC - dateAcceptedUTC) / 1000;

            attributesUpdateJSON.conversations[
              configuredFeatures["firstAgentResponse"]
            ] = firstAgentMessageDuration;
          }
        }

        // average message time
        if (configuredFeatures["averageResponseTime"] !== null) {
          let durations = [];

          for (let i = 0; i < messages.length; i++) {
            if (i > 0) {
              if (
                messages[i].from === workerName &&
                messages[i].from !== messages[i - 1].from
              ) {
                durations.push(
                  (new Date(messages[i].dateCreated) -
                    new Date(messages[i - 1].dateCreated)) /
                    1000
                );
              }
            }
          }
          durations.shift(); // exclude first agent response
          const averageTime =
            durations.length > 0
              ? durations.reduce((a, b) => a + b, 0) / durations.length
              : null;
          attributesUpdateJSON.conversations[
            configuredFeatures["averageResponseTime"]
          ] = averageTime;
        }

        // agent message count
        if (configuredFeatures["agentMessages"] !== null) {
          const agentMessages = messages.filter(
            ({ from }) => from === workerName
          ).length;
          attributesUpdateJSON.conversations[
            configuredFeatures["agentMessages"]
          ] = agentMessages;
        }

        // customer message count
        if (configuredFeatures["customerMessages"] !== null) {
          const customerMessages = messages.filter(
            ({ from }) => from != workerName
          ).length;
          attributesUpdateJSON.conversations[
            configuredFeatures["customerMessages"]
          ] = customerMessages;
        }

        // agent average length
        if (configuredFeatures["averageAgentLength"] !== null) {
          const agentMessages = messages.filter(
            ({ from }) => from === workerName
          ).length;
          let totalLength = 0;

          for (let i = 0; i < messages.length; i++) {
            messages[i].from === workerName
              ? (totalLength += messages[i].body.length)
              : null;
          }

          const averageAgentLength = totalLength / agentMessages;
          attributesUpdateJSON.conversations[
            configuredFeatures["averageAgentLength"]
          ] = averageAgentLength;
        }

        // customer average lenght
        if (configuredFeatures["averageCustomerLength"] !== null) {
          const customerMessages = messages.filter(
            ({ from }) => from != workerName
          ).length;
          let totalLength = 0;

          for (let i = 0; i < messages.length; i++) {
            messages[i].from != workerName
              ? (totalLength += messages[i].body.length)
              : null;
          }

          const averageCustomerLength = totalLength / customerMessages;
          attributesUpdateJSON.conversations[
            configuredFeatures["averageCustomerLength"]
          ] = averageCustomerLength;

          console.log(attributesUpdateJSON);
        }
      }

      const attempts = 0;
      const attributesUpdate = JSON.stringify(attributesUpdateJSON);

      const { success: updateTaskSuccess } =
        await TaskOperations.updateTaskAttributes({
          attempts,
          taskSid,
          attributesUpdate,
        });

      response.setBody({ success: updateTaskSuccess });
      callback(null, response);
    } catch (error) {
      console.log(error);
      response.setStatusCode(500);
      response.setBody({ success: false, message: error.message });
      callback(null, response);
    }
  }
);
