import * as Flex from "@twilio/flex-ui";

import ApiService from "../../../../utils/serverless/ApiService";
import { EncodedParams } from "../../../../types/serverless";
import { UIAttributes } from "../../../../types/manager/ServiceConfiguration";

export interface EventPayload {
  task: Flex.ITask;
  sid: string;
}

export interface UpdateTaskResponse {
  success: boolean;
  message?: string;
}

class UpdateTaskService extends ApiService {
  async updateTask(task: Flex.ITask) {
    try {
      const manager = Flex.Manager.getInstance();
      const { custom_data } = manager.serviceConfiguration
        .ui_attributes as UIAttributes;
      const {
        additional_features,
        focus_metric,
        additional_features_channels,
      } = custom_data.features.focus_time_chat_metrics_v2;

      const workerName = manager.store
        .getState()
        .flex.worker.attributes.contact_uri.split(":")[1];

      const reservationSid = task.sid;
      const taskInWindowStore =
        window.focusTimeTracker.reservations[reservationSid];
      const focusTime = taskInWindowStore.focusTime || 0;
      const reservationAccepted = taskInWindowStore.reservationAcceptedTime;
      const additionalChannelsString = JSON.stringify(
        additional_features_channels
      );

      const {
        attributes: { conversationSid },
        taskSid,
        taskChannelUniqueName,
      } = task;

      const { success } = await this.#updateTask(
        taskSid,
        focusTime,
        additional_features,
        conversationSid,
        workerName,
        reservationAccepted,
        focus_metric,
        additionalChannelsString,
        taskChannelUniqueName
      );

      return success;
    } catch (error) {
      return false;
    }
  }

  #updateTask = (
    taskSid: string,
    focusTime: number,
    additional_features: Object,
    conversationSid: string,
    workerName: string,
    reservationAccepted: string,
    focus_metric: string,
    additionalChannelsString: string,
    taskChannelUniqueName: string
  ): Promise<UpdateTaskResponse> => {
    const manager = Flex.Manager.getInstance();

    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(manager.user.token),
      taskSid: encodeURIComponent(taskSid),
      focusTime: encodeURIComponent(focusTime),
      additional_features: encodeURIComponent(
        JSON.stringify(additional_features)
      ),
      conversationSid: encodeURIComponent(conversationSid),
      workerName: encodeURIComponent(workerName),
      reservationAccepted: encodeURIComponent(reservationAccepted),
      focus_metric: encodeURIComponent(focus_metric),
      additionalChannelsString: encodeURIComponent(additionalChannelsString),
      taskChannelUniqueName: encodeURIComponent(taskChannelUniqueName),
    };

    return this.fetchJsonWithReject<UpdateTaskResponse>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/features/focus-time-chat-metrics-v2/flex/update-task`,
      {
        method: "post",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: this.buildBody(encodedParams),
      }
    ).then((response): UpdateTaskResponse => {
      return {
        ...response,
      };
    });
  };
}

export default new UpdateTaskService();
