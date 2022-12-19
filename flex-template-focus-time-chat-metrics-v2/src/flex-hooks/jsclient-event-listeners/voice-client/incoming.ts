import * as Flex from "@twilio/flex-ui";
import { Call } from '@twilio/voice-sdk';
import { focusOnDisconnectedCall } from "../../../feature-library/focus-time-chat-metrics-v2/flex-hooks/jsclient-event-listeners/voice-client/disconnect";


export default (flex: typeof Flex, manager: Flex.Manager) => {
  manager.voiceClient.on(
    "incoming",
    (call: Call) => {
      focusOnDisconnectedCall(flex,manager, call);
    }
  );
};
