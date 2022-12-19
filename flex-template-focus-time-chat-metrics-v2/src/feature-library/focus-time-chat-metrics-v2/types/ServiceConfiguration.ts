export default interface FocusTimeChatMetricsV2 {
    enabled: boolean;
    additional_features_channels: Array<string>;
    focus_metric: string;
    additional_features: {
      firstAgentResponse : string;
      averageResponseTime: string;
      agentMessages: string;
      customerMessages: string;
      averageAgentLength: string;
      averageCustomerLength: string
    }
  }  