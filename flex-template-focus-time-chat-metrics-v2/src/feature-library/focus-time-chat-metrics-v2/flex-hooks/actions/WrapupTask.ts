import * as Flex from "@twilio/flex-ui";
import { UIAttributes } from "../../../../types/manager/ServiceConfiguration";
import { taskWrappingAction } from "../../helpers/windowStateActions";

export interface EventPayload {
  task?: Flex.ITask;
  sid?: string;
}

export const calculateFocusTime = async (
  flex: typeof Flex,
  manager: Flex.Manager
) => {
  const { custom_data } = manager.serviceConfiguration
    .ui_attributes as UIAttributes;
  const { enabled } = custom_data.features.focus_time_chat_metrics_v2;

  if (!enabled) return;

  Flex.Actions.addListener(
    "afterWrapupTask",
    async (payload: EventPayload, wrapped: boolean) => {
      wrapped = true;
      const reservationSid = payload.sid as string;
      const taskInWindowStore =
        window.focusTimeTracker.reservations[reservationSid];
      const currentDate = new Date();
      const previousTaskSelectedTime = new Date(taskInWindowStore.selectedTime);
      const timeDifference =
        currentDate.getTime() - previousTaskSelectedTime.getTime();
      const seconds = Math.abs(timeDifference / 1000);

      const focusTime = taskInWindowStore.focusTime + seconds;

      taskWrappingAction(reservationSid, focusTime, wrapped);
    }
  );
};
