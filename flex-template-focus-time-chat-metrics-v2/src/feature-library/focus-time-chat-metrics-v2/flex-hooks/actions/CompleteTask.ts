import * as Flex from "@twilio/flex-ui";
import { UIAttributes } from "../../../../types/manager/ServiceConfiguration";

import UpdateTaskService from "../../utils/serverless/UpdateTask";
import { taskCompletedAction } from "../../helpers/windowStateActions";

export interface EventPayload {
  task: Flex.ITask;
  sid: string;
}

export const writeFocusTime = async (
  flex: typeof Flex,
  manager: Flex.Manager
) => {
  const { custom_data } = manager.serviceConfiguration
    .ui_attributes as UIAttributes;
  const { enabled } = custom_data.features.focus_time_chat_metrics_v2;

  if (!enabled) return;

  Flex.Actions.addListener(
    "beforeCompleteTask",
    async (payload: EventPayload) => {
      const task = payload.task;

      const success = await UpdateTaskService.updateTask(task);

      if (success) {
        const reservationSid = task.sid;
        taskCompletedAction(reservationSid);
      }
    }
  );
};
