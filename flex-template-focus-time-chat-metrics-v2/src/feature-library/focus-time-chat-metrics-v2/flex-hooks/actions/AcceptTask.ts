import * as Flex from "@twilio/flex-ui";
import { UIAttributes } from "../../../../types/manager/ServiceConfiguration";
import { reservationAcceptedAction } from "../../helpers/windowStateActions";

export interface EventPayload {
  task: Flex.ITask;
  sid: string;
}

export const writeAcceptTime = async (
  flex: typeof Flex,
  manager: Flex.Manager
) => {
  const { custom_data } = manager.serviceConfiguration
    .ui_attributes as UIAttributes;
  const { enabled } = custom_data.features.focus_time_chat_metrics_v2;

  if (!enabled) return;

  Flex.Actions.addListener("afterAcceptTask", async (payload: EventPayload) => {
    const channelName = payload.task.taskChannelUniqueName;
    const additional_features_channels =
      custom_data.features.focus_time_chat_metrics_v2.additional_features_channels;

    if (additional_features_channels.includes(channelName)) {
      const currentTaskSid = payload.sid;
      reservationAcceptedAction(currentTaskSid);
    }
  });
};
