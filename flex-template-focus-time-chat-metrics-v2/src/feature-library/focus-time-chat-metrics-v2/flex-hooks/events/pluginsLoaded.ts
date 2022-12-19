import * as Flex from '@twilio/flex-ui';
import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { initialize } from "../../index";
import { UIAttributes } from 'types/manager/ServiceConfiguration';
const { custom_data } = Flex.Manager.getInstance().serviceConfiguration.ui_attributes as UIAttributes;
const { enabled } = custom_data.features.focus_time_chat_metrics_v2;

const pluginsLoadedHandler = (flexEvent: FlexEvent) => {
  if (!enabled) return;
  
  console.log(`Feature enabled: chat-metrics-flex-insights-plugin`);
  initialize();
};

export default pluginsLoadedHandler;
