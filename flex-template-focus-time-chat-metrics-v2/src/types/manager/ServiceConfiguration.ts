import * as Flex from "@twilio/flex-ui";
import CustomServiceConfiguration from "./CustomServiceConfiguration";

type FlexUIAttributes = Flex.ServiceConfiguration["ui_attributes"];

export interface UIAttributes extends FlexUIAttributes {
  custom_data: {
    serverless_functions_protocol: string;
    serverless_functions_domain_focus_time_chat_metrics_v2: string;
    serverless_functions_port: string;
    features: CustomServiceConfiguration;
  };
}
