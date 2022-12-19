import * as Flex from "@twilio/flex-ui";
import { FlexEvent } from "../../types/manager/FlexEvent";
import FocusTimePluginLoaded from "../../feature-library/focus-time-chat-metrics-v2/flex-hooks/events/pluginsLoaded";

const eventHandlers: Record<FlexEvent, ((...args: any[]) => void)[]> = {
  pluginsLoaded: [FocusTimePluginLoaded],
  taskAccepted: [],
  taskCanceled: [],
  taskCompleted: [],
  taskReceived: [],
  taskRejected: [],
  taskRescinded: [],
  taskTimeout: [],
  taskUpdated: [],
  taskWrapup: [],
  tokenUpdated: []
};

export default eventHandlers;
