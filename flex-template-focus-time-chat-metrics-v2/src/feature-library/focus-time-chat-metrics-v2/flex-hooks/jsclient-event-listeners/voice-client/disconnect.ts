import * as Flex from "@twilio/flex-ui";
import { UIAttributes } from "../../../../../types/manager/ServiceConfiguration";
import { taskWrappingAction } from "../../../helpers/windowStateActions";
import { Call } from '@twilio/voice-sdk';

export interface EventPayload {
  task: Flex.ITask;
  sid: string;
  parameters: {
    CallSid: string
  }
}

export const focusOnDisconnectedCall = async (
  flex: typeof Flex,
  manager: Flex.Manager,
  call: Call
) => {
  const { custom_data } = manager.serviceConfiguration
    .ui_attributes as UIAttributes;
  const { enabled } = custom_data.features.focus_time_chat_metrics_v2;

  if (!enabled) return;

  call.on(
    "disconnect",
    async (payload: EventPayload) => {
        const call_sid = payload.parameters.CallSid;
        let flag = false;
        const tasks = manager.store.getState().flex.worker.tasks;
        console.log('call_sid :>> ', call_sid);
        console.log('tasks :>> ', tasks);
    
        for (let [, task] of tasks) {
            if (task.conference && task.conference.participants) {
                for (let i = 0; i < task.conference.participants.length; i++) {
                    let participantCallSid = task.conference.participants[i].callSid;
                    if (participantCallSid === call_sid) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {

                    const wrapped = true;
                    const reservationSid = task.sid as string;
                    const taskInWindowStore = window.focusTimeTracker.reservations[reservationSid];
                    const currentDate = new Date();
                    const previousTaskSelectedTime = new Date(taskInWindowStore.selectedTime);
                    const timeDifference = currentDate.getTime() - previousTaskSelectedTime.getTime();
                    const seconds = Math.abs(timeDifference / 1000);
                
                    const focusTime = taskInWindowStore.focusTime + seconds;
                
                    taskWrappingAction(reservationSid, focusTime, wrapped)
                    break;
                }
            }
        }
    }
  );
};
