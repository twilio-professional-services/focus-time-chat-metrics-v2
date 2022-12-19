import * as Flex from "@twilio/flex-ui";
import { UIAttributes } from "../../../../types/manager/ServiceConfiguration";
import { taskSelectedAction } from "../../helpers/windowStateActions";


export interface EventPayload {
  task?: Flex.ITask;
  sid?: string;
}

declare global {
  interface Window {
    focusTimeTracker: any;
  }
}

// when an outbound call back completes, select the parent task that initiated it
export const updateFocusTime = async (
  flex: typeof Flex,
  manager: Flex.Manager
) => {
  const { custom_data } = manager.serviceConfiguration
    .ui_attributes as UIAttributes;
  const { enabled } = custom_data.features.focus_time_chat_metrics_v2;
  
  if (!enabled) return;

  flex.Actions.addListener(
    "beforeSelectTask",
    async (payload: EventPayload) => {
      //No task is selected
      if (typeof payload.sid === "undefined") {
        return;
      }

      const currentTaskSid = payload.sid;
      const previousTaskSid: any =
        manager.store.getState().flex.view.selectedTaskSid;

      //Only execute if a new task is selected, do nothinsg if the same task is selected again
      if (previousTaskSid !== currentTaskSid) {
        const existingReservations = window.focusTimeTracker.reservations
        console.log('exi' + existingReservations);
        let previousTaskSelectedTime = null;
        let previousTaskFocusTime = null
        
        if (Object.keys(existingReservations).length > 0) {
          const { selectedTime, focusTime } = previousTaskSid in existingReservations ?
              { selectedTime: existingReservations[previousTaskSid].selectedTime, focusTime: existingReservations[previousTaskSid].focusTime } :
              { selectedTime: 0, focusTime: 0 };
          previousTaskSelectedTime = selectedTime;
          previousTaskFocusTime = focusTime;
      }

      const currentTaskPreviousFocusTime = currentTaskSid in existingReservations ? existingReservations[currentTaskSid].focusTime : 0;
      taskSelectedAction(currentTaskSid, currentTaskPreviousFocusTime, previousTaskSid, previousTaskSelectedTime, previousTaskFocusTime)

      }
    }
  );
};
