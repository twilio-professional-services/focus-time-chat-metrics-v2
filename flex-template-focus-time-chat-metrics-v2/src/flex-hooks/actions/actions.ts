import { Actions } from "../../types/flex-hooks/Actions";
import { writeAcceptTime } from "../../feature-library/focus-time-chat-metrics-v2/flex-hooks/actions/AcceptTask";
import { writeFocusTime } from "../../feature-library/focus-time-chat-metrics-v2/flex-hooks/actions/CompleteTask";
import { updateFocusTime } from "../../feature-library/focus-time-chat-metrics-v2/flex-hooks/actions/SelectTask";
import { calculateFocusTime } from "../../feature-library/focus-time-chat-metrics-v2/flex-hooks/actions/WrapupTask";

// Replace the action that your plugin wants to register.
// For example asuming you have added a feature to the template plugin called customPlugin that listens on the beforeAcceptTask action

// import {customPluginAcceptTask} from "../../feature-library/customPlugin/flex-hooks/actions/AcceptTask";
// actions_template = { AcceptTask: {before: [customPluginAcceptTask], replace: [], after: []}}

// where before: is an array of methods that will call Actions.addListener("beforeAcceptTask", {})

const actionsToRegister: Actions = {
  AcceptTask: { before: [], replace: [], after: [writeAcceptTime] },
  ApplyTeamsViewFilters: {},
  CompleteTask: { before: [writeFocusTime] },
  HangupCall: {},
  HoldCall: {},
  UnholdCall: {},
  HoldParticipant: {},
  KickParticipant: {},
  MonitorCall: {},
  StopMonitorCall: {},
  SelectTask: { before: [updateFocusTime] },
  SetWorkerActivity: {},
  StartOutboundCall: {},
  UnHoldParticipant: {},
  NavigateToView: {},
  RejectTask: {},
  SetActivity: {},
  TransferTask: {},
  WrapUpTask: { after: [calculateFocusTime] },
};

export default actionsToRegister;
